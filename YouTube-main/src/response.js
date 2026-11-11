import { $app, Console, done, fetch, Lodash as _, Storage } from "@nsnanocat/util";
import XML from "@nsnanocat/xml";
import { WireType, UnknownFieldHandler, reflectionMergePartial, MessageType } from "@protobuf-ts/runtime";
import WebVTT from "./WebVTT/WebVTT.mjs";
import database from "./function/database.mjs";
import setENV from "./function/setENV.mjs";
import setCaptions from "./function/setCaptions.mjs";
import detectFormat from "./function/detectFormat.mjs";
import { extractProtobufText, replaceProtobufText, extractProtobufTextBySuffix, replaceProtobufTextBySuffix } from "./function/protobufWire.mjs";
import Composite from "./class/Composite.mjs";
import Translate from "./class/Translate.mjs";
import { PlayerResponse } from "./protobuf/google/protos/youtube/api/innertube/PlayerResponse.js";
import { GetWatchResponse } from "./protobuf/google/protos/youtube/api/innertube/GetWatchResponse.js";
import { BrowseResponse } from "./protobuf/google/protos/youtube/api/innertube/BrowseResponse.js";

/***************** Processing *****************/
// 解构URL
const url = new URL($request.url);
Console.info(`url: ${url.toJSON()}`);
// 获取连接参数
const PATHs = url.pathname.split("/").filter(Boolean);
Console.info(`PATHs: ${PATHs}`);
// 解析格式
let FORMAT = ($response.headers?.["Content-Type"] ?? $response.headers?.["content-type"] ?? $request.headers?.Accept ?? $request.headers?.accept)?.split(";")?.[0]?.trim()?.toLowerCase();
if (!FORMAT && url.hostname === "youtubei.googleapis.com") {
	FORMAT = "application/x-protobuf";
}
if (url.pathname === "/api/timedtext" && (FORMAT === "application/octet-stream" || FORMAT === "text/plain" || FORMAT === "text/html" || !FORMAT)) {
	FORMAT = detectFormat(url, $response?.body, FORMAT);
}
Console.info(`FORMAT: ${FORMAT}`);
(async () => {
	/**
	 * 设置
	 * @type {{Settings: import('./types').Settings}}
	 */
	const { Settings, Caches, Configs } = setENV("DualSubs", ["YouTube", "Composite", "Translate", "External", "Universal", "API"], database);
	Console.logLevel = Settings.LogLevel;
	const Type = url.searchParams?.get("subtype") ?? Settings.Type;
	const Languages = [url.searchParams?.get("lang")?.toUpperCase?.() ?? Settings.Languages[0], (url.searchParams?.get("tlang") ?? Caches?.tlang)?.toUpperCase?.() ?? Settings.Languages[1]];
	// 创建空数据
	let body = {};
	// 优先处理 /api/timedtext 字幕响应
	if (url.pathname === "/api/timedtext") {
		await handleTimedText(url, FORMAT, Type, Settings, Caches, Languages);
		return;
	}
	// 在 player / get_watch 时初始化默认自动翻译语言，确保首次启用即支持双语
	if ((url.pathname === "/youtubei/v1/player" || url.pathname === "/youtubei/v1/get_watch") && Settings.AutoCC && !Caches.tlang) {
		const defaultTlang = Configs?.Languages?.[Settings?.Languages?.[1]] || "zh-Hans";
		Caches.tlang = defaultTlang;
		Storage.setItem("@DualSubs.YouTube.Caches.tlang", Caches.tlang);
	}
	// 格式判断
	switch (FORMAT) {
		case undefined: // 视为无body
			break;
		case "application/x-www-form-urlencoded":
		case "text/plain":
		default:
			break;
		case "application/x-mpegURL":
		case "application/x-mpegurl":
		case "application/vnd.apple.mpegurl":
		case "audio/mpegurl":
			break;
		case "text/xml":
		case "text/html":
		case "text/plist":
		case "application/xml":
		case "application/plist":
		case "application/x-plist":
			break;
		case "text/vtt":
		case "application/vtt":
			break;
		case "text/json":
		case "application/json":
			body = JSON.parse($response.body ?? "{}");
			switch (url.pathname) {
				case "/youtubei/v1/player":
					if (body?.captions) body.captions = setCaptions(body.captions, Configs.translationLanguages, url.hostname);
					break;
				case "/youtubei/v1/get_watch":
					if (Array.isArray(body?.contents)) {
						for (const item of body.contents) {
							if (item?.playerResponse?.captions) {
								item.playerResponse.captions = setCaptions(item.playerResponse.captions, Configs.translationLanguages, url.hostname);
							}
						}
					} else if (body?.playerResponse?.captions) {
						body.playerResponse.captions = setCaptions(body.playerResponse.captions, Configs.translationLanguages, url.hostname);
					}
					break;
				case "/youtubei/v1/browse":
				case "/youtubei/v1/get_panel":
					await translateBrowseLyrics(body, Settings, Languages);
					break;
			}
			$response.body = JSON.stringify(body);
			break;
		case "application/protobuf":
		case "application/x-protobuf":
		case "application/vnd.google.protobuf":
		case "application/grpc":
		case "application/grpc+proto":
		case "application/octet-stream": {
			let rawBody = $app === "Quantumult X" ? new Uint8Array($response.bodyBytes ?? []) : new Uint8Array($response.body ?? []);
			switch (FORMAT) {
				case "application/protobuf":
				case "application/x-protobuf":
				case "application/vnd.google.protobuf":
				case "application/octet-stream": {
					switch (url.pathname) {
						case "/youtubei/v1/player": {
							body = PlayerResponse.fromBinary(rawBody);
							Console.debug(`body: ${JSON.stringify(body)}`);
							if (body?.captions) body.captions = setCaptions(body.captions, Configs.translationLanguages, url.hostname);
							Console.debug(`body: ${JSON.stringify(body)}`);
							rawBody = PlayerResponse.toBinary(body);
							break;
						}
						case "/youtubei/v1/get_watch": {
							class get_watch_response$Type extends MessageType {
								constructor() {
									super("get_watch_response", [{ no: 1, name: "contents", kind: "message", repeat: 1 /*RepeatType.PACKED*/, T: () => GetWatchResponse }]);
								}
								create(value) {
									const message = globalThis.Object.create(this.messagePrototype);
									message.contents = [];
									if (value !== undefined) reflectionMergePartial(this, message, value);
									return message;
								}
								internalBinaryRead(reader, length, options, target) {
									const message = target ?? this.create(),
										end = reader.pos + length;
									while (reader.pos < end) {
										const [fieldNo, wireType] = reader.tag();
										switch (fieldNo) {
											case /* repeated google.protos.youtube.api.innertube.GetWatchResponse contents */ 1:
												message.contents.push(GetWatchResponse.internalBinaryRead(reader, reader.uint32(), options));
												break;
											default:
												const u = options.readUnknownField;
												if (u === "throw") throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
												const d = reader.skip(wireType);
												if (u !== false) (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
										}
									}
									return message;
								}
								internalBinaryWrite(message, writer, options) {
									for (let i = 0; i < message.contents.length; i++) GetWatchResponse.internalBinaryWrite(message.contents[i], writer.tag(1, WireType.LengthDelimited).fork(), options).join();
									const u = options.writeUnknownFields;
									if (u !== false) (u === true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
									return writer;
								}
							}
							const get_watch_response = new get_watch_response$Type();
							body = get_watch_response.fromBinary(rawBody);
							Console.debug(`body: ${JSON.stringify(body)}`);
							if (Array.isArray(body?.contents)) {
								for (const content of body.contents) {
									if (content?.playerResponse?.captions) {
										content.playerResponse.captions = setCaptions(content.playerResponse.captions, Configs.translationLanguages, url.hostname);
									}
								}
							}
							Console.debug(`body: ${JSON.stringify(body)}`);
							rawBody = get_watch_response.toBinary(body);
							break;
						}
						case "/youtubei/v1/browse": {
							let translated = false;
							try {
								body = BrowseResponse.fromBinary(rawBody);
								Console.debug(`body: ${JSON.stringify(body)}`);
								translated = await translateBrowseLyrics(body, Settings, Languages);
								if (translated) {
									rawBody = BrowseResponse.toBinary(body);
								}
							} catch (error) {
								Console.warn(`BrowseResponse parse warning: ${error?.message ?? error}`);
							}
							if (!translated) {
								rawBody = await translateGetPanelLyrics(rawBody, Settings, Languages);
							}
							break;
						}
						case "/youtubei/v1/get_panel": {
							if (Settings.Types?.includes("Translate") || Type === "Translate") {
								rawBody = await translateGetPanelLyrics(rawBody, Settings, Languages);
							}
							break;
						}
					}
					break;
				}
				case "application/grpc":
				case "application/grpc+proto":
					break;
			}
			// 写入二进制数据
			$response.body = rawBody;
			break;
		}
	}
})()
	.catch(e => Console.error(e))
	.finally(() => done($response));

async function handleTimedText(url, format, Type, Settings, Caches, Languages) {
	if (url.searchParams.has("dualsubs_subreq")) return;
	const kind = url.searchParams.get("kind");
	const lang = url.searchParams.get("lang");
	const hasSubtype = url.searchParams.has("subtype");
	const hasTlang = url.searchParams.has("tlang");
	if (!hasSubtype && !hasTlang) {
		if (Settings.AutoCC === false) return;
		if (lang?.split?.(/[-_]/)?.[0]?.toLowerCase?.() === Languages?.[1]?.split?.(/[-_]/)?.[0]?.toLowerCase?.()) return;
	}
	const effectiveType = !hasTlang && (Type === "Official" || Type === "Composite") ? "Translate" : Type;
	if (effectiveType === "Official" || effectiveType === "Composite") {
		const v = url.searchParams.get("v");
		const subUrl = new URL(url.toString());
		const cachedLang = Caches?.Playlists?.Subtitle?.get?.(v);
		if (typeof cachedLang === "string" && cachedLang) {
			subUrl.searchParams.set("lang", cachedLang);
		}
		subUrl.searchParams.delete("tlang");
		subUrl.searchParams.delete("subtype");
		subUrl.searchParams.set("dualsubs_subreq", "1");
		const subHeaders = { ...($request.headers || {}) };
		delete subHeaders.Cookie;
		delete subHeaders.cookie;
		const requests = [
			{
				url: subUrl.toString(),
				headers: subHeaders,
			},
		];
		// YouTube 官方字幕中 Sub1 为译文(tlang)、Sub2 为原文(lang)，因此合成方向需反转
		const compositeSettings = {
			...Settings,
			Tolerance: Settings.Tolerance || 1000,
			Position: Settings.Position === "Reverse" ? "Forward" : "Reverse",
		};
		const Subtitles = await Promise.all(
			requests.map(async request => {
				const _response = await fetch(request);
				return _response?.body ?? "";
			}),
		);
		const validSub2 = Subtitles.find(s => s && s.trim().length > 0 && !s.includes("<title>Sorry...</title>")) || "";
		let activeFormat = format;
		if ((!activeFormat || !$response?.body?.trim?.() || $response?.body?.includes?.("<title>Sorry...</title>")) && validSub2) {
			activeFormat = detectFormat(url, validSub2, activeFormat);
		}
		switch (activeFormat) {
			case "text/xml":
			case "text/html":
			case "text/plist":
			case "application/xml":
			case "application/plist":
			case "application/x-plist": {
				const rawSub1 = $response?.body ?? "";
				let body1 = rawSub1.trim() && !rawSub1.includes("<title>Sorry...</title>") ? XML.parse(rawSub1) : {};
				const body2 = validSub2 ? XML.parse(validSub2) : {};
				const hasSub1Cues = Boolean(body1?.timedtext?.body?.p || body1?.transcript?.text);
				const hasSub2Cues = Boolean(body2?.timedtext?.body?.p || body2?.transcript?.text);
				if (hasSub1Cues && hasSub2Cues && !Settings.ShowOnly) {
					body1 = new Composite(compositeSettings).timedText(body1, body2, kind);
					$response.body = XML.stringify(body1).replace(/&amp;#x000A;/g, "&#x000A;");
				} else if (!hasSub1Cues && hasSub2Cues) {
					Console.warn("官方翻译字幕返回为空或429，自动回退至第三方翻译合并原文字幕");
					$response.body = await translateXmlSubtitles(validSub2, kind, Settings, Languages);
					$response.status = $app === "Quantumult X" ? "HTTP/1.1 200 OK" : 200;
					if ($response.headers) {
						$response.headers["Content-Type"] = "text/xml; charset=UTF-8";
						$response.headers["content-type"] = "text/xml; charset=UTF-8";
					}
				}
				break;
			}
			case "text/vtt":
			case "application/vtt": {
				const rawSub1 = $response?.body ?? "";
				let body1 = rawSub1.trim() ? WebVTT.parse(rawSub1) : {};
				const body2 = validSub2 ? WebVTT.parse(validSub2) : {};
				const hasSub1Cues = Array.isArray(body1?.body) && body1.body.length > 0;
				const hasSub2Cues = Array.isArray(body2?.body) && body2.body.length > 0;
				if (hasSub1Cues && hasSub2Cues && !Settings.ShowOnly) {
					body1 = new Composite(compositeSettings).webVTT(body1, body2);
					$response.body = WebVTT.stringify(body1);
				} else if (!hasSub1Cues && hasSub2Cues) {
					$response.body = await translateVttSubtitles(validSub2, Settings, Languages);
					$response.status = $app === "Quantumult X" ? "HTTP/1.1 200 OK" : 200;
					if ($response.headers) {
						$response.headers["Content-Type"] = "text/vtt; charset=UTF-8";
						$response.headers["content-type"] = "text/vtt; charset=UTF-8";
					}
				}
				break;
			}
			case "text/json":
			case "application/json": {
				const rawSub1 = $response?.body ?? "";
				let body1 = rawSub1.trim() && rawSub1.trim().startsWith("{") ? JSON.parse(rawSub1) : {};
				const body2 = validSub2 && validSub2.trim().startsWith("{") ? JSON.parse(validSub2) : {};
				const hasSub1Cues = Array.isArray(body1?.events) && body1.events.length > 0;
				const hasSub2Cues = Array.isArray(body2?.events) && body2.events.length > 0;
				if (hasSub1Cues && hasSub2Cues && !Settings.ShowOnly) {
					body1 = new Composite(compositeSettings).JSON(body1, body2, kind);
					$response.body = JSON.stringify(body1);
				} else if (!hasSub1Cues && hasSub2Cues) {
					$response.body = await translateJsonSubtitles(validSub2, kind, Settings, Languages);
					$response.status = $app === "Quantumult X" ? "HTTP/1.1 200 OK" : 200;
					if ($response.headers) {
						$response.headers["Content-Type"] = "application/json; charset=UTF-8";
						$response.headers["content-type"] = "application/json; charset=UTF-8";
					}
				}
				break;
			}
		}
	} else {
		const rawBody = $response?.body ?? "";
		if (!rawBody.trim() || rawBody.includes("<title>Sorry...</title>")) return;
		const activeFormat = format || detectFormat(url, rawBody);
		switch (activeFormat) {
			case "text/xml":
			case "text/html":
			case "text/plist":
			case "application/xml":
			case "application/plist":
			case "application/x-plist":
				$response.body = await translateXmlSubtitles(rawBody, kind, Settings, Languages);
				break;
			case "text/vtt":
			case "application/vtt":
				$response.body = await translateVttSubtitles(rawBody, Settings, Languages);
				break;
			case "text/json":
			case "application/json":
				$response.body = await translateJsonSubtitles(rawBody, kind, Settings, Languages);
				break;
		}
	}
}

async function translateXmlSubtitles(xmlText, kind, Settings, Languages) {
	const body = XML.parse(xmlText);
	if (body?.transcript?.text) {
		const rawTexts = Array.isArray(body.transcript.text) ? body.transcript.text : [body.transcript.text];
		const tList = rawTexts.filter(item => item && typeof item["#"] === "string" && item["#"].trim());
		if (tList.length > 0) {
			const fullText = tList.map(item => decodeHTML(item["#"].replace(/[\r\n]+/g, " ").trim()) || "\u200b");
			const translation = await translateTextList(fullText, Settings, Languages);
			tList.forEach((item, i) => {
				item["#"] = combineText(item["#"].replace(/[\r\n]+/g, " ").trim(), translation?.[i], Settings?.ShowOnly, Settings?.Position, "&#x000A;");
			});
			body.transcript.text = tList;
		}
		return XML.stringify(body).replace(/&amp;#x000A;/g, "&#x000A;");
	}
	const isAsr = kind === "asr";
	if (isAsr) {
		if (Array.isArray(body?.timedtext?.head?.wp) && body.timedtext.head.wp[1]) {
			body.timedtext.head.wp[1]["@rc"] = "1";
		} else if (body?.timedtext?.head?.wp && typeof body.timedtext.head.wp === "object") {
			body.timedtext.head.wp["@rc"] = "1";
		}
	}
	const rawList = body?.timedtext?.body?.p ? (Array.isArray(body.timedtext.body.p) ? body.timedtext.body.p : [body.timedtext.body.p]) : [];
	const rawPens = body?.timedtext?.head?.pen
		? (Array.isArray(body.timedtext.head.pen) ? body.timedtext.head.pen : [body.timedtext.head.pen])
		: [];
	const penMap = new Map();
	for (const pen of rawPens) {
		if (pen && pen["@id"] !== undefined) {
			penMap.set(String(pen["@id"]), pen);
		}
	}
	const isStyledXml =
		!isAsr &&
		(penMap.size > 0 ||
			rawList.some(
				p =>
					p?.["@p"] !== undefined ||
					p?.["@wp"] !== undefined ||
					(Array.isArray(p?.s) ? p.s.some(s => s?.["@p"] !== undefined) : p?.s?.["@p"] !== undefined),
			));
	if (isStyledXml) {
		await translateStyledXmlParagraphs(rawList, penMap, Settings, Languages);
		body.timedtext.body.p = rawList;
		return XML.stringify(body).replace(/&amp;#x000A;/g, "&#x000A;");
	}
	const pList = [];
	for (const para of rawList) {
		if (!para || para["@a"] === "1") continue;
		if (para.s) {
			if (Array.isArray(para.s)) para["#"] = para.s.map(seg => seg?.["#"] ?? "").join("");
			else para["#"] = para.s?.["#"] ?? "";
			delete para.s;
		}
		if (typeof para["#"] === "string") para["#"] = para["#"].replace(/[\r\n]+/g, " ").trim();
		if (para["#"]) {
			if (isAsr) delete para["@w"];
			pList.push(para);
		}
	}
	if (isAsr) {
		for (let i = 0; i < pList.length - 1; i++) {
			const t = Number.parseInt(pList[i]["@t"], 10);
			const d = Number.parseInt(pList[i]["@d"], 10);
			const nextT = Number.parseInt(pList[i + 1]["@t"], 10);
			if (!Number.isNaN(t) && !Number.isNaN(d) && !Number.isNaN(nextT) && t + d > nextT) {
				pList[i]["@d"] = String(Math.max(0, nextT - t));
			}
		}
	}
	if (pList.length > 0) {
		const fullText = pList.map(para => decodeHTML(para["#"] || "") || "\u200b");
		const translation = await translateTextList(fullText, Settings, Languages);
		pList.forEach((para, i) => {
			para["#"] = combineText(para["#"], translation?.[i], Settings?.ShowOnly, Settings?.Position, "&#x000A;");
		});
		body.timedtext.body.p = pList;
	}
	return XML.stringify(body).replace(/&amp;#x000A;/g, "&#x000A;");
}

async function translateStyledXmlParagraphs(rawList, penMap, Settings, Languages) {
	const getPenFo = penId => {
		if (penId === undefined || penId === null) return 254;
		const pen = penMap.get(String(penId));
		if (!pen || pen["@fo"] === undefined) return 254;
		const fo = Number.parseInt(pen["@fo"], 10);
		return Number.isNaN(fo) ? 254 : fo;
	};
	const getPenRb = penId => {
		if (penId === undefined || penId === null) return 0;
		const pen = penMap.get(String(penId));
		if (!pen || pen["@rb"] === undefined) return 0;
		return Number.parseInt(pen["@rb"], 10) || 0;
	};

	let defaultHiddenPenId = null;
	if (penMap.has("1") && getPenFo("1") === 0) {
		defaultHiddenPenId = "1";
	} else if (penMap.has("0") && getPenFo("0") === 0) {
		defaultHiddenPenId = "0";
	} else {
		for (const [id, pen] of penMap.entries()) {
			if (getPenFo(id) === 0 && Number.parseInt(pen["@bo"] ?? "0", 10) === 0 && !pen["@rb"]) {
				defaultHiddenPenId = id;
				break;
			}
		}
	}

	const stripZwsp = str => String(str ?? "").replace(/\u200B \u200B/g, "").replace(/\u200B/g, "");
	const tasks = [];
	const textsToTranslate = [];

	for (const para of rawList) {
		if (!para || para["@a"] === "1") continue;
		const hasS = para.s !== undefined;
		const rawSegs = hasS
			? (Array.isArray(para.s) ? para.s : [para.s])
			: typeof para["#"] === "string" && para["#"].length > 0
				? [{ ...(para["@p"] !== undefined ? { "@p": String(para["@p"]) } : {}), "#": para["#"] }]
				: [];
		if (rawSegs.length === 0) continue;

		const subLines = [[]];
		const lineBreakSegs = [];
		for (const seg of rawSegs) {
			if (!seg) continue;
			const rawStr = String(seg["#"] ?? "");
			if (!rawStr.includes("\n")) {
				subLines[subLines.length - 1].push({ ...seg, "#": rawStr });
				continue;
			}
			const cleanedNoNewline = stripZwsp(rawStr).replace(/[\r\n]+/g, "").trim();
			if (cleanedNoNewline === "") {
				lineBreakSegs.push({ ...seg, "#": rawStr.replace(/\r?\n/g, "&#x000A;") });
				subLines.push([]);
			} else {
				const parts = rawStr.split(/\r?\n/);
				for (let pIdx = 0; pIdx < parts.length; pIdx++) {
					if (parts[pIdx].length > 0) {
						subLines[subLines.length - 1].push({ ...seg, "#": parts[pIdx] });
					}
					if (pIdx < parts.length - 1) {
						const lbPen = defaultHiddenPenId ?? seg["@p"] ?? para["@p"];
						lineBreakSegs.push({ ...(lbPen !== undefined && lbPen !== null ? { "@p": String(lbPen) } : {}), "#": "&#x000A;" });
						subLines.push([]);
					}
				}
			}
		}

		let paraHasVisible = false;
		const parsedSubLines = subLines.map(lineSegs => {
			let hasVisible = false;
			let firstContentIdx = -1;
			let lastContentIdx = -1;
			let rawSentence = "";
			let usesPaddingSpace = false;
			let usesZwsp = false;
			let lineHiddenPenId = null;
			const penLengths = new Map();
			let fallbackNonRubyPenId;
			let fallbackVisiblePenId;

			for (let i = 0; i < lineSegs.length; i++) {
				const s = lineSegs[i];
				const rawText = String(s["#"] ?? "");
				if (rawText.includes("\u200B \u200B")) usesPaddingSpace = true;
				if (rawText.includes("\u200B")) usesZwsp = true;
				const cleanText = stripZwsp(rawText);
				const effPenId = s["@p"] ?? para["@p"];
				const fo = getPenFo(effPenId);
				const rb = getPenRb(effPenId);

				if (fo === 0 && cleanText.length === 0 && effPenId !== undefined && lineHiddenPenId === null) {
					lineHiddenPenId = String(effPenId);
				}
				if (fo > 0 && effPenId !== undefined) {
					if (fallbackVisiblePenId === undefined) fallbackVisiblePenId = String(effPenId);
					if (rb === 0 && fallbackNonRubyPenId === undefined) fallbackNonRubyPenId = String(effPenId);
				}
				if (cleanText.length > 0) {
					if (firstContentIdx === -1) firstContentIdx = i;
					lastContentIdx = i;
					if (![2, 4, 5].includes(rb)) {
						rawSentence += cleanText;
					}
					const trimmedLen = cleanText.trim().length;
					if (fo > 0 && trimmedLen > 0) {
						hasVisible = true;
						if (effPenId !== undefined && rb === 0) {
							const key = String(effPenId);
							penLengths.set(key, (penLengths.get(key) ?? 0) + trimmedLen);
						}
					}
				}
			}

			const sentence = decodeHTML(rawSentence.replace(/[\r\n]+/g, " ").replace(/\s+/g, " ").trim());
			if (!hasVisible || !sentence) {
				return { isVisible: false, lineSegs };
			}
			paraHasVisible = true;

			let dominantPenId;
			let maxLen = -1;
			for (const [penId, len] of penLengths.entries()) {
				if (len > maxLen) {
					maxLen = len;
					dominantPenId = penId;
				}
			}
			if (dominantPenId === undefined) {
				dominantPenId = fallbackNonRubyPenId ?? fallbackVisiblePenId ?? (para["@p"] !== undefined ? String(para["@p"]) : undefined);
			}

			const textIdx = textsToTranslate.length;
			textsToTranslate.push(sentence);

			return {
				isVisible: true,
				lineSegs,
				firstContentIdx,
				lastContentIdx,
				textIdx,
				dominantPenId,
				hiddenPenId: lineHiddenPenId ?? defaultHiddenPenId,
				usesPaddingSpace,
				usesZwsp: usesZwsp || lineHiddenPenId !== null || defaultHiddenPenId !== null,
			};
		});

		if (paraHasVisible) {
			tasks.push({ para, hasS, parsedSubLines, lineBreakSegs });
		}
	}

	if (textsToTranslate.length === 0) return;
	const translations = await translateTextList(textsToTranslate, Settings, Languages);

	for (const { para, hasS, parsedSubLines, lineBreakSegs } of tasks) {
		const newSegs = [];
		for (let sIdx = 0; sIdx < parsedSubLines.length; sIdx++) {
			const sub = parsedSubLines[sIdx];
			if (!sub.isVisible) {
				newSegs.push(...sub.lineSegs);
			} else {
				const transText = translations[sub.textIdx] ?? "";
				if (!transText || transText === "\u200b") {
					newSegs.push(...sub.lineSegs);
				} else {
					const leadingPadding = sub.lineSegs.slice(0, sub.firstContentIdx);
					const contentSegs = sub.lineSegs.slice(sub.firstContentIdx, sub.lastContentIdx + 1);
					const trailingPadding = sub.lineSegs.slice(sub.lastContentIdx + 1);
					const formattedTrans = sub.usesPaddingSpace ? `\u200B \u200B${transText}\u200B \u200B` : transText;
					const transSeg = {
						...(sub.dominantPenId !== undefined ? { "@p": String(sub.dominantPenId) } : {}),
						"#": formattedTrans,
					};
					const sepPenId = sub.hiddenPenId ?? sub.dominantPenId;
					const sepSeg = {
						...(sepPenId !== undefined && sepPenId !== null ? { "@p": String(sepPenId) } : {}),
						"#": sub.usesZwsp ? "\u200B&#x000A;\u200B" : "&#x000A;",
					};
					if (Settings?.ShowOnly) {
						newSegs.push(...leadingPadding, transSeg, ...trailingPadding);
					} else if (Settings?.Position === "Reverse") {
						newSegs.push(...leadingPadding, transSeg, sepSeg, ...contentSegs, ...trailingPadding);
					} else {
						newSegs.push(...leadingPadding, ...contentSegs, sepSeg, transSeg, ...trailingPadding);
					}
				}
			}
			if (sIdx < lineBreakSegs.length) {
				newSegs.push(lineBreakSegs[sIdx]);
			}
		}

		para.s = newSegs;
		if (!hasS) {
			delete para["@p"];
			para["#"] = "\u200B";
		}
		const xmlOrderSym = Object.getOwnPropertySymbols(para)[0];
		if (xmlOrderSym && Array.isArray(para[xmlOrderSym])) {
			const oldOrder = para[xmlOrderSym];
			let hashAfterS = 0;
			for (let i = 0; i < oldOrder.length; i++) {
				if (oldOrder[i]?.[0] === "#" && i > 0 && oldOrder[i - 1]?.[0] === "s") {
					hashAfterS = oldOrder[i - 1][1];
					break;
				}
			}
			if (typeof para["#"] === "string" && para["#"].replace(/\u200B/g, "").trim() === "") {
				if (newSegs.length > 1) {
					para["#"] = "\u200B";
				} else if (hasS) {
					delete para["#"];
				}
			} else if (typeof para["#"] !== "string" && newSegs.length > 1) {
				para["#"] = "\u200B";
			}
			const newOrder = [];
			for (let idx = 0; idx < newSegs.length; idx++) {
				newOrder.push(["s", idx]);
				if (idx === hashAfterS && typeof para["#"] === "string") {
					newOrder.push(["#", 0]);
				}
			}
			para[xmlOrderSym].splice(0, para[xmlOrderSym].length, ...newOrder);
		}
	}
}

async function translateVttSubtitles(vttText, Settings, Languages) {
	const body = WebVTT.parse(vttText);
	if (Array.isArray(body?.body) && body.body.length > 0) {
		const fullText = body.body.map(item => decodeHTML(item?.text || "") || "\u200b");
		const translation = await translateTextList(fullText, Settings, Languages);
		body.body.forEach((item, i) => {
			item.text = combineText(item.text, translation?.[i], Settings?.ShowOnly, Settings?.Position, "\n");
		});
	}
	return WebVTT.stringify(body);
}

async function translateJsonSubtitles(jsonText, kind, Settings, Languages) {
	const body = JSON.parse(jsonText);
	const isAsr = kind === "asr";
	if (isAsr && body?.wpWinPositions?.[1]) {
		body.wpWinPositions[1].rcRows = 1;
	}
	if (Array.isArray(body?.events)) {
		const rawPens = Array.isArray(body?.pens) ? body.pens : [];
		const isStyledJson =
			!isAsr &&
			(rawPens.length > 0 ||
				body.events.some(
					e =>
						e?.pPenId !== undefined ||
						e?.wpWinPosId !== undefined ||
						(Array.isArray(e?.segs) && e.segs.some(s => s?.pPenId !== undefined)),
				));
		if (isStyledJson) {
			await translateStyledJsonEvents(body.events, rawPens, Settings, Languages);
			return JSON.stringify(body);
		}
		const events = [];
		for (const event of body.events) {
			if (!event || event.aAppend === 1) continue;
			if (event.segs) {
				const text = event.segs.map(seg => seg?.utf8 ?? "").join("").trim();
				if (!text) continue;
				event.segs = [{ utf8: text }];
				if (isAsr) delete event.wWinId;
				events.push(event);
			}
		}
		if (isAsr) {
			for (let i = 0; i < events.length - 1; i++) {
				const t = events[i].tStartMs;
				const d = events[i].dDurationMs;
				const nextT = events[i + 1].tStartMs;
				if (typeof t === "number" && typeof d === "number" && typeof nextT === "number" && t + d > nextT) {
					events[i].dDurationMs = Math.max(0, nextT - t);
				}
			}
		}
		const fullText = events.map(e => decodeHTML(e.segs?.[0]?.utf8 || "") || "\u200b");
		if (fullText.length > 0) {
			const translation = await translateTextList(fullText, Settings, Languages);
			events.forEach((event, i) => {
				event.segs[0].utf8 = combineText(event.segs[0].utf8, translation?.[i], Settings?.ShowOnly, Settings?.Position, "\n");
			});
		}
		body.events = events;
	}
	return JSON.stringify(body);
}

async function translateStyledJsonEvents(events, rawPens, Settings, Languages) {
	const getPenFo = penId => {
		const idx = Number(penId ?? 0);
		const pen = rawPens[idx];
		if (!pen || pen.foForeAlpha === undefined) return 254;
		const fo = Number(pen.foForeAlpha);
		return Number.isNaN(fo) ? 254 : fo;
	};
	const getPenRb = penId => {
		const idx = Number(penId ?? 0);
		const pen = rawPens[idx];
		if (!pen || pen.rbRuby === undefined) return 0;
		return Number(pen.rbRuby) || 0;
	};

	let defaultHiddenPenId = null;
	if (rawPens[1] && getPenFo(1) === 0) {
		defaultHiddenPenId = 1;
	} else if (rawPens[0] && getPenFo(0) === 0) {
		defaultHiddenPenId = 0;
	} else {
		for (let i = 0; i < rawPens.length; i++) {
			if (rawPens[i] && getPenFo(i) === 0 && !rawPens[i].boBackAlpha && !rawPens[i].rbRuby) {
				defaultHiddenPenId = i;
				break;
			}
		}
	}

	const stripZwsp = str => String(str ?? "").replace(/\u200B \u200B/g, "").replace(/\u200B/g, "");
	const tasks = [];
	const textsToTranslate = [];

	for (const event of events) {
		if (!event || event.aAppend === 1 || !Array.isArray(event.segs) || event.segs.length === 0) continue;

		const subLines = [[]];
		const lineBreakSegs = [];
		for (const seg of event.segs) {
			if (!seg) continue;
			const rawStr = String(seg.utf8 ?? "");
			if (!rawStr.includes("\n")) {
				subLines[subLines.length - 1].push({ ...seg, utf8: rawStr });
				continue;
			}
			const cleanedNoNewline = stripZwsp(rawStr).replace(/[\r\n]+/g, "").trim();
			if (cleanedNoNewline === "") {
				lineBreakSegs.push({ ...seg, utf8: rawStr.replace(/\r\n/g, "\n") });
				subLines.push([]);
			} else {
				const parts = rawStr.split(/\r?\n/);
				for (let pIdx = 0; pIdx < parts.length; pIdx++) {
					if (parts[pIdx].length > 0) {
						subLines[subLines.length - 1].push({ ...seg, utf8: parts[pIdx] });
					}
					if (pIdx < parts.length - 1) {
						const lbPen = defaultHiddenPenId ?? seg.pPenId ?? event.pPenId;
						lineBreakSegs.push({ ...(lbPen !== undefined && lbPen !== null ? { pPenId: Number(lbPen) } : {}), utf8: "\n" });
						subLines.push([]);
					}
				}
			}
		}

		let eventHasVisible = false;
		const parsedSubLines = subLines.map(lineSegs => {
			let hasVisible = false;
			let firstContentIdx = -1;
			let lastContentIdx = -1;
			let rawSentence = "";
			let usesPaddingSpace = false;
			let usesZwsp = false;
			let lineHiddenPenId = null;
			const penLengths = new Map();
			let fallbackNonRubyPenId;
			let fallbackVisiblePenId;

			for (let i = 0; i < lineSegs.length; i++) {
				const s = lineSegs[i];
				const rawText = String(s.utf8 ?? "");
				if (rawText.includes("\u200B \u200B")) usesPaddingSpace = true;
				if (rawText.includes("\u200B")) usesZwsp = true;
				const cleanText = stripZwsp(rawText);
				const effPenId = s.pPenId ?? event.pPenId;
				const fo = getPenFo(effPenId);
				const rb = getPenRb(effPenId);

				if (fo === 0 && cleanText.length === 0 && effPenId !== undefined && lineHiddenPenId === null) {
					lineHiddenPenId = Number(effPenId);
				}
				if (fo > 0 && effPenId !== undefined) {
					if (fallbackVisiblePenId === undefined) fallbackVisiblePenId = Number(effPenId);
					if (rb === 0 && fallbackNonRubyPenId === undefined) fallbackNonRubyPenId = Number(effPenId);
				}
				if (cleanText.length > 0) {
					if (firstContentIdx === -1) firstContentIdx = i;
					lastContentIdx = i;
					if (![2, 4, 5].includes(rb)) {
						rawSentence += cleanText;
					}
					const trimmedLen = cleanText.trim().length;
					if (fo > 0 && trimmedLen > 0) {
						hasVisible = true;
						if (effPenId !== undefined && rb === 0) {
							const key = Number(effPenId);
							penLengths.set(key, (penLengths.get(key) ?? 0) + trimmedLen);
						}
					}
				}
			}

			const sentence = decodeHTML(rawSentence.replace(/[\r\n]+/g, " ").replace(/\s+/g, " ").trim());
			if (!hasVisible || !sentence) {
				return { isVisible: false, lineSegs };
			}
			eventHasVisible = true;

			let dominantPenId;
			let maxLen = -1;
			for (const [penId, len] of penLengths.entries()) {
				if (len > maxLen) {
					maxLen = len;
					dominantPenId = penId;
				}
			}
			if (dominantPenId === undefined) {
				dominantPenId = fallbackNonRubyPenId ?? fallbackVisiblePenId ?? (event.pPenId !== undefined ? Number(event.pPenId) : undefined);
			}

			const textIdx = textsToTranslate.length;
			textsToTranslate.push(sentence);

			return {
				isVisible: true,
				lineSegs,
				firstContentIdx,
				lastContentIdx,
				textIdx,
				dominantPenId,
				hiddenPenId: lineHiddenPenId ?? defaultHiddenPenId,
				usesPaddingSpace,
				usesZwsp: usesZwsp || lineHiddenPenId !== null || defaultHiddenPenId !== null,
			};
		});

		if (eventHasVisible) {
			tasks.push({ event, parsedSubLines, lineBreakSegs });
		}
	}

	if (textsToTranslate.length === 0) return;
	const translations = await translateTextList(textsToTranslate, Settings, Languages);

	for (const { event, parsedSubLines, lineBreakSegs } of tasks) {
		const newSegs = [];
		for (let sIdx = 0; sIdx < parsedSubLines.length; sIdx++) {
			const sub = parsedSubLines[sIdx];
			if (!sub.isVisible) {
				newSegs.push(...sub.lineSegs);
			} else {
				const transText = translations[sub.textIdx] ?? "";
				if (!transText || transText === "\u200b") {
					newSegs.push(...sub.lineSegs);
				} else {
					const leadingPadding = sub.lineSegs.slice(0, sub.firstContentIdx);
					const contentSegs = sub.lineSegs.slice(sub.firstContentIdx, sub.lastContentIdx + 1);
					const trailingPadding = sub.lineSegs.slice(sub.lastContentIdx + 1);
					const formattedTrans = sub.usesPaddingSpace ? `\u200B \u200B${transText}\u200B \u200B` : transText;
					const transSeg = {
						...(sub.dominantPenId !== undefined ? { pPenId: Number(sub.dominantPenId) } : {}),
						utf8: formattedTrans,
					};
					const sepPenId = sub.hiddenPenId ?? sub.dominantPenId;
					const sepSeg = {
						...(sepPenId !== undefined && sepPenId !== null ? { pPenId: Number(sepPenId) } : {}),
						utf8: sub.usesZwsp ? "\u200B\n\u200B" : "\n",
					};
					if (Settings?.ShowOnly) {
						newSegs.push(...leadingPadding, transSeg, ...trailingPadding);
					} else if (Settings?.Position === "Reverse") {
						newSegs.push(...leadingPadding, transSeg, sepSeg, ...contentSegs, ...trailingPadding);
					} else {
						newSegs.push(...leadingPadding, ...contentSegs, sepSeg, transSeg, ...trailingPadding);
					}
				}
			}
			if (sIdx < lineBreakSegs.length) {
				newSegs.push(lineBreakSegs[sIdx]);
			}
		}
		event.segs = newSegs;
	}
}

async function translateBrowseLyrics(body, Settings, Languages) {
	let translated = false;
	const elementRenderers = [];
	const shelfRenderers = [];

	const collectFromSectionList = (sectionList) => {
		if (!Array.isArray(sectionList?.contents)) return;
		for (const item of sectionList.contents) {
			if (item?.elementRenderer) elementRenderers.push(item.elementRenderer);
			if (item?.musicDescriptionShelfRenderer) shelfRenderers.push(item.musicDescriptionShelfRenderer);
			if (Array.isArray(item?.itemSectionRenderer?.contents)) {
				for (const sub of item.itemSectionRenderer.contents) {
					if (sub?.elementRenderer) elementRenderers.push(sub.elementRenderer);
				}
			}
		}
	};

	if (body?.contents?.elementRenderer) elementRenderers.push(body.contents.elementRenderer);
	if (body?.contents?.sectionListRenderer) collectFromSectionList(body.contents.sectionListRenderer);
	if (Array.isArray(body?.contents?.singleColumnBrowseResultsRenderer?.tabs)) {
		for (const tab of body.contents.singleColumnBrowseResultsRenderer.tabs) {
			if (tab?.tabRenderer?.content?.sectionListRenderer) {
				collectFromSectionList(tab.tabRenderer.content.sectionListRenderer);
			}
		}
	}
	if (body?.continuationContents?.sectionListContinuation) {
		collectFromSectionList(body.continuationContents.sectionListContinuation);
	}
	if (body?.continuationContents?.musicDescriptionShelfRenderer) {
		shelfRenderers.push(body.continuationContents.musicDescriptionShelfRenderer);
	}

	for (const elementRenderer of elementRenderers) {
		const timedLyricsContent = elementRenderer?.newElement?.type?.model?.videoContent?.timedLyricsRender?.timedLyricsContent;
		if (Array.isArray(timedLyricsContent?.runs) && timedLyricsContent.runs.length > 0) {
			const fullText = timedLyricsContent.runs.map(run => run?.text?.trim() || "\u200b");
			const translation = await translateTextList(fullText, Settings, Languages);
			timedLyricsContent.runs.forEach((run, i) => {
				if (run?.text) {
					run.text = combineText(run.text, translation?.[i], Settings?.ShowOnly, Settings?.Position, "\n");
				}
			});
			if (timedLyricsContent.footerLabel && !timedLyricsContent.footerLabel.includes("Translated by")) {
				timedLyricsContent.footerLabel += ` (Translated by ${Settings?.Vendor || "Google"})`;
			}
			translated = true;
		}

		const lyricsData =
			elementRenderer?.newElement?.type?.model?.n4F168777401?.n1F465100242?.timedLyricsModel?.lyricsData ??
			elementRenderer?.newElement?.type?.componentType?.model?.timedLyricsModel?.lyricsData;
		if (Array.isArray(lyricsData?.timedLyricsData) && lyricsData.timedLyricsData.length > 0) {
			const fullText = lyricsData.timedLyricsData.map(item => item?.lyricLine?.trim() || "\u200b");
			const translation = await translateTextList(fullText, Settings, Languages);
			lyricsData.timedLyricsData.forEach((item, i) => {
				if (item?.lyricLine) {
					item.lyricLine = combineText(item.lyricLine, translation?.[i], Settings?.ShowOnly, Settings?.Position, "\n");
				}
			});
			if (lyricsData.sourceMessage && !lyricsData.sourceMessage.includes("Translated by")) {
				lyricsData.sourceMessage += ` (Translated by ${Settings?.Vendor || "Google"})`;
			}
			translated = true;
		}
	}

	for (const shelf of shelfRenderers) {
		const runs = shelf?.description?.runs;
		if (Array.isArray(runs) && runs[0]?.text) {
			const lines = runs[0].text.split("\n");
			const fullText = lines.map(line => line.trim() || "\u200b");
			const translation = await translateTextList(fullText, Settings, Languages);
			runs[0].text = lines
				.map((line, i) => (line.trim() ? combineText(line, translation?.[i], Settings?.ShowOnly, Settings?.Position, "\n") : ""))
				.join("\n");
			if (shelf?.footer?.runs?.[0]?.text && !shelf.footer.runs[0].text.includes("Translated by")) {
				shelf.footer.runs[0].text += ` (Translated by ${Settings?.Vendor || "Google"})`;
			}
			translated = true;
		}
	}
	return translated;
}

async function translateGetPanelLyrics(rawBody, Settings, Languages) {
	const GET_PANEL_LYRIC_PATHS = [
		[2, 138681066, 3, 153515154, 172660663, 1, 168777401, 5, 465160965, 4, 1, 1],
		[2, 138681066, 3, 153515154, 172660663, 1, 168777401, 4, 465100242, 1, 1, 1, 1],
		[2, 138681066, 3, 153515154, 172660663, 1, 168777401, 1, 465100242, 1, 1, 1, 1],
		[2, 138681066, 3, 153515154, 172660663, 1, 221496734, 1, 1, 1],
		[2, 138681066, 3, 221496734, 3, 1, 1],
	];

	const LYRIC_SUFFIX_PATHS = [
		[465160965, 4, 1, 1],
		[465160965, 1, 1],
		[465100242, 1, 1, 1, 1],
		[465100242, 1, 1, 1],
		[221496734, 3, 1, 1],
		[221496734, 1, 1, 1],
	];

	const bytes = rawBody instanceof Uint8Array ? rawBody : new Uint8Array(rawBody ?? []);
	for (const path of GET_PANEL_LYRIC_PATHS) {
		const lyrics = extractProtobufText(bytes, path);
		if (!lyrics.length) continue;
		Console.info(`YouTube Music get_panel timed lyrics: ${lyrics.length} entries`);
		if (lyrics.length === 1 && lyrics[0].includes("\n")) {
			const lines = lyrics[0].split("\n");
			const fullText = lines.map(line => line.trim() || "\u200b");
			const translation = await translateTextList(fullText, Settings, Languages);
			const combinedBlock = lines
				.map((line, i) => (line.trim() ? combineText(line, translation?.[i], Settings?.ShowOnly, Settings?.Position, "\n") : ""))
				.join("\n");
			return replaceProtobufText(bytes, path, [combinedBlock]).body;
		}
		const fullText = lyrics.map(line => line.trim() || "\u200b");
		const translated = await translateTextList(fullText, Settings, Languages);
		const combined = lyrics.map((origin, index) => combineText(origin, translated?.[index], Settings?.ShowOnly, Settings?.Position, "\n"));
		return replaceProtobufText(bytes, path, combined).body;
	}
	for (const suffixPath of LYRIC_SUFFIX_PATHS) {
		const lyrics = extractProtobufTextBySuffix(bytes, suffixPath);
		if (!lyrics.length) continue;
		Console.info(`YouTube Music suffix wire lyrics: ${lyrics.length} entries`);
		if (lyrics.length === 1 && lyrics[0].includes("\n")) {
			const lines = lyrics[0].split("\n");
			const fullText = lines.map(line => line.trim() || "\u200b");
			const translation = await translateTextList(fullText, Settings, Languages);
			const combinedBlock = lines
				.map((line, i) => (line.trim() ? combineText(line, translation?.[i], Settings?.ShowOnly, Settings?.Position, "\n") : ""))
				.join("\n");
			return replaceProtobufTextBySuffix(bytes, suffixPath, [combinedBlock]).body;
		}
		const fullText = lyrics.map(line => line.trim() || "\u200b");
		const translated = await translateTextList(fullText, Settings, Languages);
		const combined = lyrics.map((origin, index) => combineText(origin, translated?.[index], Settings?.ShowOnly, Settings?.Position, "\n"));
		return replaceProtobufTextBySuffix(bytes, suffixPath, combined).body;
	}
	return rawBody;
}

async function translateTextList(fullText, Settings, Languages) {
	if (!Array.isArray(fullText) || fullText.length === 0) return [];
	const uniqueTexts = [];
	const textToUniqueIndex = new Map();
	const indexMap = new Array(fullText.length);
	for (let i = 0; i < fullText.length; i++) {
		const raw = typeof fullText[i] === "string" ? fullText[i].trim() : "";
		if (!raw || raw === "\u200b" || raw === "\u200B") {
			indexMap[i] = -1;
			continue;
		}
		let uIdx = textToUniqueIndex.get(raw);
		if (uIdx === undefined) {
			uIdx = uniqueTexts.length;
			textToUniqueIndex.set(raw, uIdx);
			uniqueTexts.push(raw);
		}
		indexMap[i] = uIdx;
	}
	if (uniqueTexts.length === 0) return fullText.map(() => "");
	const vendor = Settings?.Vendor || "Google";
	const translator = new Translate({ Source: Languages?.[0], Target: Languages?.[1], API: Settings?.API?.[vendor] });
	const fn = translator[vendor]?.bind(translator) || translator.Google.bind(translator);
	const Queue = [];
	const length = vendor === "BaiduFanyi" ? 20 : 100;
	switch (Settings?.Method) {
		case "Part":
		default: {
			const parts = chunk(uniqueTexts, length);
			for (const part of parts) {
				Queue.push(() => retry(() => fn(part), Settings?.Times ?? 3, Settings?.Interval ?? 500, Settings?.Exponential ?? true));
			}
			break;
		}
		case "Row":
			for (const row of uniqueTexts) {
				Queue.push(() => retry(() => fn(row), Settings?.Times ?? 3, Settings?.Interval ?? 500, Settings?.Exponential ?? true));
			}
			break;
	}
	const uniqueTranslations = await Promise.all(Queue.map(q => q())).then(results => results.flat());
	return indexMap.map(uIdx => (uIdx === -1 ? "" : (uniqueTranslations[uIdx] ?? "")));
}

function combineText(originText, transText, ShowOnly = false, position = "Forward", lineBreak = "\n") {
	if (!transText || transText === "\u200b") return originText;
	if (ShowOnly) return transText;
	return position === "Reverse" ? `${transText}${lineBreak}${originText}` : `${originText}${lineBreak}${transText}`;
}

function chunk(source, length) {
	let index = 0;
	const target = [];
	while (index < source.length) target.push(source.slice(index, (index += length)));
	return target;
}

async function retry(fn, retriesLeft = 3, interval = 500, exponential = true) {
	try {
		return await fn();
	} catch (error) {
		if (retriesLeft > 0) {
			await new Promise(r => setTimeout(r, interval));
			return retry(fn, retriesLeft - 1, exponential ? interval * 2 : interval, exponential);
		}
		throw error;
	}
}

function decodeHTML(str) {
	return str
		.replace(/&apos;/g, "'")
		.replace(/&quot;/g, '"')
		.replace(/&gt;/g, ">")
		.replace(/&lt;/g, "<")
		.replace(/&amp;/g, "&")
		.replace(/&nbsp;/g, " ")
		.replace(/&#39;/g, "'")
		.replace(/&ldquo;/g, "“")
		.replace(/&rdquo;/g, "”")
		.replace(/&#x2f;/g, "/")
		.replace(/&mdash;/g, "—")
		.replace(/&hellip;/g, "…")
		.replace(/&bull;/g, "•")
		.replace(/&copy;/g, "©")
		.replace(/%23x2f;/g, "/");
}
