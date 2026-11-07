import { $app, Console, done, fetch, Lodash as _ } from "@nsnanocat/util";
import XML from "@nsnanocat/xml";
import WebVTT from "./WebVTT/WebVTT.mjs";
import database from "./function/database.mjs";
import setENV from "./function/setENV.mjs";
import detectFormat from "./function/detectFormat.mjs";
import detectPlatform from "./function/detectPlatform.mjs";
import constructSubtitlesQueue from "./function/constructSubtitlesQueue.mjs";
import Composite from "./class/Composite.mjs";
import Translate from "./class/Translate.mjs";

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
	const { Settings, Caches, Configs } = setENV("DualSubs", [["YouTube", "Netflix", "BiliBili", "Spotify"].includes(PLATFORM) ? PLATFORM : "Universal", "Composite", "Translate", "API"], database);
	Console.logLevel = Settings.LogLevel;
	// 获取字幕类型与语言
	const Type = url.searchParams?.get("subtype") ?? Settings.Type;
	const Languages = [url.searchParams?.get("lang")?.toUpperCase?.() ?? Settings.Languages[0], (url.searchParams?.get("tlang") ?? Caches?.tlang)?.toUpperCase?.() ?? Settings.Languages[1]];
	Console.info(`Type: ${Type}`, `Languages: ${Languages}`);
	// 创建字幕请求队列
	let requests = [];
	const compositeSettings = {
		...Settings,
		Tolerance: Settings.Tolerance || 1000,
		Position: Settings.Position === "Reverse" ? "Forward" : "Reverse",
	};
	switch (PLATFORM) {
		case "YouTube": {
			const v = url.searchParams.get("v");
			const subUrl = new URL(url.toString());
			const cachedLang = Caches?.Playlists?.Subtitle?.get?.(v);
			if (typeof cachedLang === "string" && cachedLang) {
				subUrl.searchParams.set("lang", cachedLang);
			}
			subUrl.searchParams.delete("tlang");
			subUrl.searchParams.delete("subtype");
			subUrl.searchParams.set("dualsubs_subreq", "1");
			requests.push({
				url: subUrl.toString(),
				headers: $request.headers,
			});
			break;
		}
		default:
			break;
	}
	// 获取原文字幕
	const Subtitles = await Promise.all(
		requests.map(async request => {
			const _response = await fetch(request);
			return _response?.body ?? "";
		}),
	);
	const validSub2 = Subtitles.find(s => s && s.trim().length > 0) || "";
	if ((!FORMAT || !$response?.body?.trim?.()) && validSub2) {
		FORMAT = detectFormat(url, validSub2, FORMAT);
	}
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
			const rawSub1 = $response?.body ?? "";
			let body1 = rawSub1.trim() ? XML.parse(rawSub1) : {};
			const body2 = validSub2 ? XML.parse(validSub2) : {};
			const hasSub1Cues = Boolean(body1?.timedtext?.body?.p);
			const hasSub2Cues = Boolean(body2?.timedtext?.body?.p);
			if (hasSub1Cues && hasSub2Cues && !Settings.ShowOnly) {
				body1 = new Composite(compositeSettings).timedText(body1, body2, url.searchParams.get("kind"));
				$response.body = XML.stringify(body1);
			} else if (!hasSub1Cues && hasSub2Cues) {
				Console.warn("官方翻译字幕返回为空，自动回退至第三方翻译合并原文字幕");
				$response.body = await translateXmlSubtitles(validSub2, url.searchParams.get("kind"), Settings, Languages);
				$response.status = $app === "Quantumult X" ? "HTTP/1.1 200 OK" : 200;
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
				Console.warn("官方翻译 VTT 字幕返回为空，自动回退至第三方翻译");
				$response.body = await translateVttSubtitles(validSub2, Settings, Languages);
				$response.status = $app === "Quantumult X" ? "HTTP/1.1 200 OK" : 200;
			}
			break;
		}
		case "text/json":
		case "application/json": {
			const rawSub1 = $response?.body ?? "";
			let body1 = rawSub1.trim() ? JSON.parse(rawSub1) : {};
			const body2 = validSub2 ? JSON.parse(validSub2) : {};
			const hasSub1Cues = Array.isArray(body1?.events) && body1.events.length > 0;
			const hasSub2Cues = Array.isArray(body2?.events) && body2.events.length > 0;
			if (hasSub1Cues && hasSub2Cues && !Settings.ShowOnly) {
				body1 = new Composite(compositeSettings).JSON(body1, body2, url.searchParams.get("kind"));
				$response.body = JSON.stringify(body1);
			} else if (!hasSub1Cues && hasSub2Cues) {
				Console.warn("官方翻译 JSON 字幕返回为空，自动回退至第三方翻译");
				$response.body = await translateJsonSubtitles(validSub2, url.searchParams.get("kind"), Settings, Languages);
				$response.status = $app === "Quantumult X" ? "HTTP/1.1 200 OK" : 200;
			}
			break;
		}
	}
})()
	.catch(e => Console.error(e))
	.finally(() => done($response));

async function translateTextArray(fullText, Settings, Languages) {
	const vendor = Settings.Vendor || "Google";
	const translator = new Translate({ Source: Languages[0], Target: Languages[1], API: Settings.API?.[vendor] });
	const fn = translator[vendor]?.bind(translator) || translator.Google.bind(translator);
	const chunks = [];
	const chunkSize = 100;
	for (let i = 0; i < fullText.length; i += chunkSize) {
		chunks.push(fullText.slice(i, i + chunkSize));
	}
	const results = await Promise.all(chunks.map(c => fn(c)));
	return results.flat();
}

async function translateXmlSubtitles(xmlText, kind, Settings, Languages) {
	const body = XML.parse(xmlText);
	const isAsr = kind === "asr";
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
		const fullText = pList.map(para => para["#"] || "\u200b");
		const translation = await translateTextArray(fullText, Settings, Languages);
		pList.forEach((para, i) => {
			const trans = translation[i] ?? "";
			para["#"] = Settings.ShowOnly ? trans : Settings.Position === "Reverse" ? `${trans}&#x000A;${para["#"]}` : `${para["#"]}&#x000A;${trans}`;
		});
		body.timedtext.body.p = pList;
	}
	return XML.stringify(body);
}

async function translateVttSubtitles(vttText, Settings, Languages) {
	const body = WebVTT.parse(vttText);
	if (Array.isArray(body?.body) && body.body.length > 0) {
		const fullText = body.body.map(item => item?.text || "\u200b");
		const translation = await translateTextArray(fullText, Settings, Languages);
		body.body.forEach((item, i) => {
			const trans = translation[i] ?? "";
			item.text = Settings.ShowOnly ? trans : Settings.Position === "Reverse" ? `${trans}\n${item.text}` : `${item.text}\n${trans}`;
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
		const fullText = events.map(e => e.segs?.[0]?.utf8 || "\u200b");
		if (fullText.length > 0) {
			const translation = await translateTextArray(fullText, Settings, Languages);
			events.forEach((event, i) => {
				const orig = event.segs[0].utf8;
				const trans = translation[i] ?? "";
				event.segs[0].utf8 = Settings.ShowOnly ? trans : Settings.Position === "Reverse" ? `${trans}\n${orig}` : `${orig}\n${trans}`;
			});
		}
		body.events = events;
	}
	return JSON.stringify(body);
}
