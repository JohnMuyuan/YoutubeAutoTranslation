import { $app, Console, done, Lodash as _ } from "@nsnanocat/util";
import XML from "@nsnanocat/xml";
import WebVTT from "./WebVTT/WebVTT.mjs";
import database from "./function/database.mjs";
import setENV from "./function/setENV.mjs";
import detectFormat from "./function/detectFormat.mjs";
import detectPlatform from "./function/detectPlatform.mjs";
import Translate from "./class/Translate.mjs";
import { BrowseResponse } from "./protobuf/google/protos/youtube/api/innertube/BrowseResponse.js";

/***************** Processing *****************/
// 解构URL
const url = new URL($request.url);
Console.info(`url: ${url.toJSON()}`);
// 获取连接参数
const PATHs = url.pathname.split("/").filter(Boolean);
Console.info(`PATHs: ${PATHs}`);
// 解析格式
let FORMAT = ($response.headers?.["Content-Type"] ?? $response.headers?.["content-type"] ?? $request.headers?.Accept ?? $request.headers?.accept)?.split(";")?.[0];
if (FORMAT === "application/octet-stream" || FORMAT === "text/plain" || FORMAT === "text/html" || !FORMAT) FORMAT = detectFormat(url, $response?.body, FORMAT);
Console.info(`FORMAT: ${FORMAT}`);
(async () => {
	// 获取平台
	const PLATFORM = detectPlatform($request.url);
	Console.info(`PLATFORM: ${PLATFORM}`);
	/**
	 * 设置
	 * @type {{Settings: import('./types').Settings}}
	 */
	const { Settings, Caches, Configs } = setENV("DualSubs", [["YouTube", "Netflix", "BiliBili", "Spotify"].includes(PLATFORM) ? PLATFORM : "Universal", "Translate", "API"], database);
	Console.logLevel = Settings.LogLevel;
	// 获取字幕类型与语言
	const Type = url.searchParams?.get("subtype") ?? Settings.Type;
	const Languages = [url.searchParams?.get("lang")?.toUpperCase?.() ?? Settings.Languages[0], (url.searchParams?.get("tlang") ?? Caches?.tlang)?.toUpperCase?.() ?? Settings.Languages[1]];
	Console.info(`Type: ${Type}`, `Languages: ${Languages}`);
	// 创建空数据
	let body = {};
	// 格式判断
	switch (FORMAT) {
		case undefined:
			break;
		case "text/xml":
		case "text/html":
		case "text/plist":
		case "application/xml":
		case "application/plist":
		case "application/x-plist": {
			body = XML.parse($response.body);
			const isAsr = url.searchParams.get("kind") === "asr";
			if (isAsr) {
				if (Array.isArray(body?.timedtext?.head?.wp) && body.timedtext.head.wp[1]) {
					body.timedtext.head.wp[1]["@rc"] = "1";
				} else if (body?.timedtext?.head?.wp && typeof body.timedtext.head.wp === "object") {
					body.timedtext.head.wp["@rc"] = "1";
				}
			}
			const rawList = body?.timedtext?.body?.p ? (Array.isArray(body.timedtext.body.p) ? body.timedtext.body.p : [body.timedtext.body.p]) : [];
			const pList = [];
			for (const para of rawList) {
				if (!para || para["@a"] === "1") continue;
				if (para.s) {
					if (Array.isArray(para.s)) para["#"] = para.s.map(seg => seg?.["#"] ?? "").join("");
					else para["#"] = para.s?.["#"] ?? "";
					delete para.s;
				}
				if (typeof para["#"] === "string") para["#"] = para["#"].trim();
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
				const fullText = pList.map(para => para["#"]?.decodeHTML?.() || "\u200b");
				const translation = await translateTextList(fullText, Settings, Languages);
				pList.forEach((para, i) => {
					para["#"] = combineText(para["#"], translation?.[i], Settings?.ShowOnly, Settings?.Position, "&#x000A;");
				});
				body.timedtext.body.p = pList;
			}
			$response.body = XML.stringify(body).replace(/&amp;#x000A;/g, "&#x000A;");
			break;
		}
		case "text/vtt":
		case "application/vtt": {
			body = WebVTT.parse($response.body);
			if (Array.isArray(body?.body) && body.body.length > 0) {
				const fullText = body.body.map(item => item?.text?.decodeHTML?.() || "\u200b");
				const translation = await translateTextList(fullText, Settings, Languages);
				body.body.forEach((item, i) => {
					item.text = combineText(item.text, translation?.[i], Settings?.ShowOnly, Settings?.Position, "\n");
				});
			}
			$response.body = WebVTT.stringify(body);
			break;
		}
		case "text/json":
		case "application/json": {
			body = JSON.parse($response.body ?? "{}");
			switch (PLATFORM) {
				case "YouTube": {
					if (body?.events) {
						const isAsr = url.searchParams.get("kind") === "asr";
						if (isAsr && body?.wpWinPositions?.[1]) {
							body.wpWinPositions[1].rcRows = 1;
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
						const fullText = events.map(e => e.segs?.[0]?.utf8?.decodeHTML?.() || "\u200b");
						if (fullText.length > 0) {
							const translation = await translateTextList(fullText, Settings, Languages);
							events.forEach((event, i) => {
								event.segs[0].utf8 = combineText(event.segs[0].utf8, translation?.[i], Settings?.ShowOnly, Settings?.Position, "\n");
							});
						}
						body.events = events;
					} else if (body?.contents || body?.continuationContents) {
						await translateBrowseLyrics(body, Settings, Languages);
					}
					break;
				}
			}
			$response.body = JSON.stringify(body);
			break;
		}
		case "application/protobuf":
		case "application/x-protobuf":
		case "application/vnd.google.protobuf":
		case "application/grpc":
		case "application/grpc+proto":
		case "application/octet-stream": {
			let rawBody = $app === "Quantumult X" ? new Uint8Array($response.bodyBytes ?? []) : ($response.body ?? new Uint8Array());
			switch (url.pathname) {
				case "/youtubei/v1/browse": {
					body = BrowseResponse.fromBinary(rawBody);
					const translated = await translateBrowseLyrics(body, Settings, Languages);
					if (translated) {
						rawBody = BrowseResponse.toBinary(body);
					}
					break;
				}
			}
			$response.body = rawBody;
			break;
		}
	}
})()
	.catch(e => Console.error(e))
	.finally(() => done($response));

export async function translateBrowseLyrics(body, Settings, Languages) {
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

String.prototype.decodeHTML = function () {
	return this.replace(/&apos;/g, "'")
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
};
