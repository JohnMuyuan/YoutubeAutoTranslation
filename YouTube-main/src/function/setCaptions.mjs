import { Console } from "@nsnanocat/util";

function isAsrTrack(track) {
	return track?.kind === "asr" || (typeof track?.vssId === "string" && track.vssId.startsWith("a."));
}

function getBaseLang(code) {
	return String(code ?? "")
		.split(/[-_]/)[0]
		.toLowerCase();
}

function findPreferredManualIndex(captionTracks, currentIdx, allowedIndices) {
	if (!Array.isArray(captionTracks) || captionTracks.length === 0) return currentIdx ?? 0;
	const allPool = captionTracks.map((_, i) => i);
	const validAllowed = Array.isArray(allowedIndices) ? allowedIndices.filter(i => Number.isInteger(i) && i >= 0 && i < captionTracks.length) : [];
	const primaryPool = validAllowed.length > 0 ? validAllowed : allPool;
	const hasValidCurrent = Number.isInteger(currentIdx) && currentIdx >= 0 && currentIdx < captionTracks.length;
	if (hasValidCurrent && !isAsrTrack(captionTracks[currentIdx])) {
		return currentIdx;
	}
	const refTrack = hasValidCurrent ? captionTracks[currentIdx] : (primaryPool.map(i => captionTracks[i]).find(t => isAsrTrack(t)) ?? captionTracks[primaryPool[0]]);
	const refLang = String(refTrack?.languageCode ?? "");
	const refBaseLang = getBaseLang(refLang);
	for (const pool of primaryPool === allPool ? [primaryPool] : [primaryPool, allPool]) {
		if (refLang) {
			const exactIdx = pool.find(i => !isAsrTrack(captionTracks[i]) && captionTracks[i]?.languageCode === refLang);
			if (exactIdx !== undefined) return exactIdx;
		}
		if (refBaseLang) {
			const baseIdx = pool.find(i => !isAsrTrack(captionTracks[i]) && getBaseLang(captionTracks[i]?.languageCode) === refBaseLang);
			if (baseIdx !== undefined) return baseIdx;
		}
	}
	if (!hasValidCurrent && !isAsrTrack(refTrack)) {
		const firstManual = primaryPool.find(i => !isAsrTrack(captionTracks[i]));
		if (firstManual !== undefined) return firstManual;
	}
	return hasValidCurrent ? currentIdx : (primaryPool[0] ?? 0);
}

export default function setCaptions(captions, translationLanguages, hostname) {
	Console.log("☑️ Set Captions");
	// 有播放器字幕列表渲染器
	if (captions?.playerCaptionsTracklistRenderer) {
		const renderer = captions.playerCaptionsTracklistRenderer;
		Console.info("Tracklist");
		if (renderer.captionTracks) {
			// 改字幕可用性
			renderer.captionTracks = renderer.captionTracks.map(caption => {
				caption.isTranslatable = true;
				return caption;
			});
		}
		const captionTracks = Array.isArray(renderer.captionTracks) ? renderer.captionTracks : [];
		const preferredDefaultIdx = findPreferredManualIndex(captionTracks, renderer.defaultCaptionTrackIndex);
		if (renderer.audioTracks) {
			// 改音轨可用性，并优先绑定非自动生成（如精修彩色 .ytt）字幕轨
			renderer.audioTracks = renderer.audioTracks.map(audio => {
				audio.visibility = 2; //"ON";
				audio.hasDefaultTrack = true;
				audio.captionsInitialState = 3; //"CAPTIONS_INITIAL_STATE_ON_RECOMMENDED";
				if (captionTracks.length > 0) {
					const preferredAudioIdx = findPreferredManualIndex(captionTracks, audio.defaultCaptionTrackIndex, audio.captionTrackIndices);
					audio.defaultCaptionTrackIndex = preferredAudioIdx;
					if (Array.isArray(audio.captionTrackIndices) && audio.captionTrackIndices.length > 0 && !audio.captionTrackIndices.includes(preferredAudioIdx)) {
						audio.captionTrackIndices.push(preferredAudioIdx);
					}
				}
				return audio;
			});
		}
		// 增加自动翻译可用语言
		switch (hostname) {
			case "www.youtube.com":
			case "tv.youtube.com":
			default:
				renderer.translationLanguages = translationLanguages.DESKTOP;
				break;
			case "m.youtube.com":
			case "youtubei.googleapis.com":
				renderer.translationLanguages = translationLanguages.MOBILE;
				break;
		}
		// 改默认字幕索引值与默认翻译源轨道，优先选择手动精修字幕轨而非自动生成 ASR 字幕轨
		renderer.defaultCaptionTrackIndex = preferredDefaultIdx;
		if (Array.isArray(renderer.defaultTranslationSourceTrackIndices) && renderer.defaultTranslationSourceTrackIndices.length > 0) {
			renderer.defaultTranslationSourceTrackIndices = [...new Set(renderer.defaultTranslationSourceTrackIndices.map(idx => findPreferredManualIndex(captionTracks, idx)))];
		} else if (captionTracks.length > 0) {
			renderer.defaultTranslationSourceTrackIndices = [preferredDefaultIdx];
		}
	}
	Console.log("✅ Set Captions");
	return captions;
}
