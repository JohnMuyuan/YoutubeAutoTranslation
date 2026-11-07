import { $app, Console, done, Lodash as _, Storage } from "@nsnanocat/util";
import database from "./function/database.mjs";
import setENV from "./function/setENV.mjs";
import setCache from "./function/setCache.mjs";
import BrowserHeaders from "./function/BrowserHeaders.mjs";
import { PlayerRequest } from "./protobuf/google/protos/youtube/api/innertube/PlayerRequest.js";
import { BrowseRequest } from "./protobuf/google/protos/youtube/api/innertube/BrowseRequest.js";

// 构造回复数据
// biome-ignore lint/style/useConst: <explanation>
let $response = undefined;
/***************** Processing *****************/
// 解构URL
const url = new URL($request.url);
Console.info(`url: ${url.toJSON()}`);
// 获取连接参数
const PATHs = url.pathname.split("/").filter(Boolean);
Console.info(`PATHs: ${PATHs}`);
// 解析格式
const FORMAT = ($request.headers?.["Content-Type"] ?? $request.headers?.["content-type"])?.split(";")?.[0];
Console.info(`FORMAT: ${FORMAT}`);
(async () => {
	/**
	 * 设置
	 * @type {{Settings: import('./types').Settings}}
	 */
	const { Settings, Caches, Configs } = setENV("DualSubs", "YouTube", database);
	Console.logLevel = Settings.LogLevel;
	// 获取字幕类型与语言
	const Type = url.searchParams.get("subtype") ?? Settings.Type,
		Languages = [url.searchParams.get("lang")?.toUpperCase?.() ?? Settings.Languages[0], (url.searchParams.get("tlang") ?? Caches?.tlang)?.toUpperCase?.() ?? Settings.Languages[1]];
	Console.info(`Type: ${Type}`, `Languages: ${Languages}`);
	// 创建空数据
	let body = {};
	// 方法判断
	switch ($request.method) {
		case "POST":
		case "PUT":
		case "PATCH":
		// biome-ignore lint/suspicious/noFallthroughSwitchClause: <explanation>
		case "DELETE":
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
					body = JSON.parse($request.body ?? "{}");
					switch (url.pathname) {
						case "/youtubei/v1/player":
							if (body?.playbackContext) {
								Console.info("playbackContext");
								if (body?.playbackContext.contentPlaybackContext) {
									body.playbackContext.contentPlaybackContext.autoCaptionsDefaultOn = true;
								}
							}
							break;
						case "/youtubei/v1/browse":
							if (body?.browseId?.startsWith?.("MPLYt") || (!body?.browseId && body?.continuation)) {
								url.searchParams.set("subtype", "Translate");
							}
							break;
					}
					$request.body = JSON.stringify(body);
					break;
				case "application/protobuf":
				case "application/x-protobuf":
				case "application/vnd.google.protobuf":
				case "application/grpc":
				case "application/grpc+proto":
				case "application/octet-stream": {
					let rawBody = $app === "Quantumult X" ? new Uint8Array($request.bodyBytes ?? []) : ($request.body ?? new Uint8Array());
					switch (FORMAT) {
						case "application/protobuf":
						case "application/x-protobuf":
						case "application/vnd.google.protobuf":
							switch (url.pathname) {
								case "/youtubei/v1/player":
									body = PlayerRequest.fromBinary(rawBody);
									Console.debug(`data: ${JSON.stringify(body)}`);
									if (body?.playbackContext) {
										Console.info("playbackContext");
										if (body?.playbackContext.contentPlaybackContext) {
											body.playbackContext.contentPlaybackContext.id4 = 1;
											body.playbackContext.contentPlaybackContext.id6 = 1;
											body.playbackContext.contentPlaybackContext.id8 = 1;
											body.playbackContext.contentPlaybackContext.id9 = 1;
										}
									}
									Console.debug(`data: ${JSON.stringify(body)}`);
									rawBody = PlayerRequest.toBinary(body);
									$request.body = rawBody;
									break;
								case "/youtubei/v1/browse":
									body = BrowseRequest.fromBinary(rawBody);
									Console.debug(`data: ${JSON.stringify(body)}`);
									if (body?.browseId?.startsWith?.("MPLYt") || (!body?.browseId && body?.continuation)) {
										url.searchParams.set("subtype", "Translate");
									}
									break;
							}
							break;
						case "application/grpc":
						case "application/grpc+proto":
							break;
					}
					break;
				}
			}
		//break; // 不中断，继续处理URL
		// biome-ignore lint/suspicious/noFallthroughSwitchClause: <explanation>
		case "GET":
			// 主机判断
			switch (url.hostname) {
				case "www.youtube.com":
				case "m.youtube.com":
				case "music.youtube.com":
					// 路径判断
					switch (url.pathname) {
						case "/api/timedtext": {
							if (url.searchParams.has("dualsubs_subreq")) {
								Console.info("内部原文字幕子请求，跳过改写");
								url.searchParams.delete("tlang");
								url.searchParams.delete("subtype");
								break;
							}
							const v = url.searchParams.get("v");
							const kind = url.searchParams.get("kind");
							const lang = url.searchParams.get("lang");
							const tlang = url.searchParams.get("tlang");
							Console.info(`v: ${v}`, `kind: ${kind}`, `lang: ${lang}`, `tlang: ${tlang}`);
							if (!tlang) {
								Console.info("翻译语言：未指定");
								// 保存原文语言
								if (v && lang) {
									Caches.Playlists.Subtitle.set(v, lang);
									Caches.Playlists.Subtitle = setCache(Caches?.Playlists.Subtitle, Settings.CacheSize);
									Storage.setItem(`@DualSubs.${"Composite"}.Caches.Playlists.Subtitle`, Caches.Playlists.Subtitle);
								}
								// 自动翻译字幕
								switch (Settings.AutoCC) {
									case true:
									default:
										Console.info("自动翻译字幕：开启");
										if (Caches.tlang) {
											if (Caches.tlang !== lang) url.searchParams.set("tlang", Caches.tlang);
										}
										break;
									case false:
										Console.info("自动翻译字幕：关闭");
										break;
								}
							}
							if (url.searchParams.get("tlang")) {
								Console.info("翻译语言：已指定");
								// 保存目标语言
								Caches.tlang = url.searchParams.get("tlang");
								Storage.setItem(`@DualSubs.${"YouTube"}.Caches.tlang`, Caches.tlang);
								// 字幕类型判断
								switch (Settings.Type) {
									case "Composite":
									case "Official":
									default:
										Console.info("官方字幕：合成器");
										if (lang?.split?.(/[-_]/)?.[0] === url.searchParams.get("tlang")?.split?.(/[-_]/)?.[0]) Settings.ShowOnly = true;
										if (!Settings.ShowOnly) url.searchParams.set("subtype", "Official"); // 官方字幕
										break;
									case "Translate":
										Console.info("翻译字幕：翻译器");
										url.searchParams.delete("tlang");
										url.searchParams.set("subtype", "Translate"); // 翻译字幕
										break;
									case "External":
										Console.info("外部字幕：外部源");
										url.searchParams.delete("tlang");
										url.searchParams.set("subtype", "External"); // 外挂字幕
										break;
								}
							}
							if (url.searchParams.get("tlang")) {
								try {
									await BrowserHeaders.setHeader($request.headers);
								} catch (error) {
									Console.warn(`BrowserHeaders.setHeader warning: ${error?.message ?? error}`);
								}
							}
							break;
						}
					}
					break;
			}
		case "HEAD":
		case "OPTIONS":
			break;
		case "CONNECT":
		case "TRACE":
			break;
	}
	$request.url = url.toString();
	Console.debug(`$request.url: ${$request.url}`);
})()
	.catch(e => Console.error(e))
	.finally(() => {
		switch (typeof $response) {
			case "object": // 有构造回复数据，返回构造的回复数据
				if ($response.headers?.["Content-Encoding"]) $response.headers["Content-Encoding"] = "identity";
				if ($response.headers?.["content-encoding"]) $response.headers["content-encoding"] = "identity";
				switch ($app) {
					default:
						done({ response: $response });
						break;
					case "Quantumult X":
						if (!$response.status) $response.status = "HTTP/1.1 200 OK";
						delete $response.headers?.["Content-Length"];
						delete $response.headers?.["content-length"];
						delete $response.headers?.["Transfer-Encoding"];
						done($response);
						break;
				}
				break;
			case "undefined": // 无构造回复数据，发送修改的请求数据
				done($request);
				break;
			default:
				Console.error(`不合法的 $response 类型: ${typeof $response}`);
				break;
		}
	});
