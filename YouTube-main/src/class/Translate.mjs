import { Console, fetch, Lodash as _ } from "@nsnanocat/util";
import CryptoJS from "crypto-js";

export default class Translate {
	constructor(options = {}) {
		this.Name = "Translate";
		this.Version = "1.0.7";
		Console.log(`🟧 ${this.Name} v${this.Version}`);
		this.Source = "AUTO";
		this.Target = "ZH";
		this.API = {};
		Object.assign(this, options);
	}

	#LanguagesCode = {
		Google: {
			AUTO: "auto",
			AF: "af",
			AM: "am",
			AR: "ar",
			AS: "as",
			AY: "ay",
			AZ: "az",
			BG: "bg",
			BM: "bm",
			BN: "bn",
			BS: "bs",
			CA: "ca",
			CEB: "ceb",
			CKB: "ckb",
			CO: "co",
			CS: "cs",
			CY: "cy",
			DA: "da",
			DE: "de",
			DOI: "doi",
			DV: "dv",
			EE: "ee",
			EL: "el",
			EN: "en",
			"EN-CA": "en",
			"EN-GB": "en",
			"EN-US": "en",
			EO: "eo",
			ES: "es",
			"ES-419": "es",
			"ES-ES": "es",
			ET: "et",
			EU: "eu",
			FA: "fa",
			FI: "fi",
			FIL: "fil",
			FR: "fr",
			"FR-CA": "fr",
			"FR-FR": "fr",
			FY: "fy",
			GA: "ga",
			GD: "gd",
			GL: "gl",
			GN: "gn",
			GOM: "gom",
			GU: "gu",
			HA: "ha",
			HAW: "haw",
			HE: "iw",
			HI: "hi",
			HMN: "hmn",
			HR: "hr",
			HT: "ht",
			HU: "hu",
			HY: "hy",
			ID: "id",
			IG: "ig",
			ILO: "ilo",
			IS: "is",
			IT: "it",
			IW: "iw",
			JA: "ja",
			JV: "jw",
			JW: "jw",
			KA: "ka",
			KK: "kk",
			KM: "km",
			KN: "kn",
			KO: "ko",
			KRI: "kri",
			KU: "ku",
			KY: "ky",
			LA: "la",
			LB: "lb",
			LG: "lg",
			LN: "ln",
			LO: "lo",
			LT: "lt",
			LUS: "lus",
			LV: "lv",
			MAI: "mai",
			MG: "mg",
			MI: "mi",
			MK: "mk",
			ML: "ml",
			MN: "mn",
			"MN-CYRL": "mn",
			MR: "mr",
			MS: "ms",
			MT: "mt",
			MY: "my",
			NE: "ne",
			NL: "nl",
			NO: "no",
			NSO: "nso",
			NY: "ny",
			OM: "om",
			OR: "or",
			PA: "pa",
			PL: "pl",
			PS: "ps",
			PT: "pt",
			"PT-BR": "pt",
			"PT-PT": "pt",
			QU: "qu",
			RO: "ro",
			RU: "ru",
			RW: "rw",
			SA: "sa",
			SD: "sd",
			SI: "si",
			SK: "sk",
			SL: "sl",
			SM: "sm",
			SN: "sn",
			SO: "so",
			SQ: "sq",
			SR: "sr",
			"SR-CYRL": "sr",
			"SR-LATN": "sr",
			ST: "st",
			SU: "su",
			SV: "sv",
			SW: "sw",
			TA: "ta",
			TE: "te",
			TG: "tg",
			TH: "th",
			TI: "ti",
			TK: "tk",
			TL: "tl",
			TR: "tr",
			TS: "ts",
			TT: "tt",
			UG: "ug",
			UK: "uk",
			UR: "ur",
			UZ: "uz",
			VI: "vi",
			XH: "xh",
			YI: "yi",
			YO: "yo",
			YUE: "yue",
			"YUE-HK": "yue",
			ZH: "zh-CN",
			"ZH-CN": "zh-CN",
			"ZH-HANS": "zh-CN",
			"ZH-HANT": "zh-TW",
			"ZH-HK": "zh-TW",
			"ZH-TW": "zh-TW",
			ZU: "zu",
		},
		Microsoft: {
			AUTO: "",
			AF: "af",
			AM: "am",
			AR: "ar",
			AS: "as",
			AZ: "az",
			BG: "bg",
			BN: "bn",
			BS: "bs",
			CA: "ca",
			CS: "cs",
			CY: "cy",
			DA: "da",
			DE: "de",
			DV: "dv",
			EL: "el",
			EN: "en",
			"EN-CA": "en",
			"EN-GB": "en",
			"EN-US": "en",
			ES: "es",
			"ES-419": "es",
			"ES-ES": "es",
			ET: "et",
			EU: "eu",
			FA: "fa",
			FI: "fi",
			FIL: "fil",
			FJ: "fj",
			FO: "fo",
			FR: "fr",
			"FR-CA": "fr-ca",
			"FR-FR": "fr",
			GA: "ga",
			GL: "gl",
			GOM: "gom",
			GU: "gu",
			HA: "ha",
			HE: "he",
			HI: "hi",
			HR: "hr",
			HSB: "hsb",
			HT: "ht",
			HU: "hu",
			HY: "hy",
			ID: "id",
			IG: "ig",
			IKT: "ikt",
			IS: "is",
			IT: "it",
			IU: "iu",
			"IU-LATN": "iu-Latn",
			JA: "ja",
			KA: "ka",
			KK: "kk",
			KM: "km",
			KMR: "kmr",
			KN: "kn",
			KO: "ko",
			KU: "ku",
			KY: "ky",
			LN: "ln",
			LO: "lo",
			LT: "lt",
			LUG: "lug",
			LV: "lv",
			LZH: "lzh",
			MAI: "mai",
			MG: "mg",
			MI: "mi",
			MK: "mk",
			ML: "ml",
			MN: "mn-Cyrl",
			"MN-CYRL": "mn-Cyrl",
			"MN-MONG": "mn-Mong",
			MR: "mr",
			MS: "ms",
			MT: "mt",
			MWW: "mww",
			MY: "my",
			NB: "nb",
			NE: "ne",
			NL: "nl",
			NO: "nb",
			NSO: "nso",
			NYA: "nya",
			OR: "or",
			OTQ: "otq",
			PA: "pa",
			PL: "pl",
			PRS: "prs",
			PS: "ps",
			PT: "pt-br",
			"PT-BR": "pt",
			"PT-PT": "pt-pt",
			RO: "ro",
			RU: "ru",
			RUN: "run",
			RW: "rw",
			SD: "sd",
			SI: "si",
			SK: "sk",
			SL: "sl",
			SM: "sm",
			SN: "sn",
			SO: "so",
			SQ: "sq",
			SR: "sr-Cyrl",
			"SR-CYRL": "sr-Cyrl",
			"SR-LATN": "sr-Latn",
			ST: "st",
			SV: "sv",
			SW: "sw",
			TA: "ta",
			TE: "te",
			TH: "th",
			TI: "ti",
			TK: "tk",
			"TLH-LATN": "tlh-Latn",
			"TLH-PIQD": "tlh-Piqd",
			TN: "tn",
			TO: "to",
			TR: "tr",
			TT: "tt",
			TY: "ty",
			UG: "ug",
			UK: "uk",
			UR: "ur",
			UZ: "uz",
			VI: "vi",
			XH: "xh",
			YO: "yo",
			YUA: "yua",
			YUE: "yue",
			"YUE-HK": "yue",
			ZH: "zh-Hans",
			"ZH-CN": "zh-Hans",
			"ZH-HANS": "zh-Hans",
			"ZH-HANT": "zh-Hant",
			"ZH-HK": "zh-Hant",
			"ZH-TW": "zh-Hant",
			ZU: "zu",
		},
		DeepL: {
			AUTO: "",
			BG: "BG",
			CS: "CS",
			DA: "DA",
			DE: "DE",
			EL: "EL",
			EN: "EN",
			"EN-CA": "EN",
			"EN-GB": "EN-GB",
			"EN-US": "EN-US",
			ES: "ES",
			"ES-419": "ES",
			"ES-ES": "ES",
			ET: "ET",
			FI: "FI",
			FR: "FR",
			"FR-CA": "FR",
			"FR-FR": "FR",
			HU: "HU",
			ID: "ID",
			IT: "IT",
			JA: "JA",
			LV: "LV",
			LT: "LT",
			NL: "NL",
			PL: "PL",
			PT: "PT",
			"PT-PT": "PT-PT",
			"PT-BR": "PT-BR",
			RO: "RO",
			RU: "RU",
			SK: "SK",
			SL: "SL",
			SV: "SV",
			TR: "TR",
			ZH: "ZH",
			"ZH-CN": "ZH",
			"ZH-HANS": "ZH",
			"ZH-HANT": "ZH",
			"ZH-HK": "ZH",
			"ZH-TW": "ZH",
		},
		Baidu: {
			AUTO: "auto",
			AR: "ara",
			CS: "cs",
			DA: "dan",
			DE: "de",
			EL: "el",
			EN: "en",
			"EN-CA": "en",
			"EN-GB": "en",
			"EN-US": "en",
			ES: "spa",
			"ES-419": "spa",
			"ES-ES": "spa",
			ET: "est",
			FI: "fin",
			FR: "fra",
			"FR-CA": "fra",
			"FR-FR": "fra",
			HU: "hu",
			IT: "it",
			JA: "jp",
			KO: "kor",
			NL: "nl",
			PL: "pl",
			PT: "pt",
			"PT-BR": "pt",
			"PT-PT": "pt",
			RO: "rom",
			RU: "ru",
			SL: "slo",
			SV: "swe",
			TH: "th",
			VI: "vie",
			YUE: "yue",
			"YUE-HK": "yue",
			ZH: "zh",
			"ZH-CN": "zh",
			"ZH-HANS": "zh",
			"ZH-HANT": "cht",
			"ZH-HK": "cht",
			"ZH-TW": "cht",
		},
	};

	#MaxLength = {
		Google: 12000,
		GoogleCloud: 30000,
		Microsoft: 50000,
		Azure: 50000,
		DeepL: 130000,
		Baidu: 6000,
	};

	async Google(text = [], source = this.Source, target = this.Target) {
		Console.log("☑️ Google", `source: ${source}`, `target: ${target}`);
		text = Array.isArray(text) ? text : [text];
		source = this.#LanguagesCode.Google[source] ?? this.#LanguagesCode.Google[source?.split?.(/[-_]/)?.[0]?.toUpperCase?.()] ?? source.toLowerCase();
		target = this.#LanguagesCode.Google[target] ?? this.#LanguagesCode.Google[target?.split?.(/[-_]/)?.[0]?.toUpperCase?.()] ?? target.toLowerCase();
		const BaseURL = "https://translate.googleapis.com";
		const Path = "translate_a/single";
		const Params = {
			client: "gtx",
			sl: source,
			tl: target,
			hl: "en",
			dt: "t",
			dj: "1",
			ie: "UTF-8",
			oe: "UTF-8",
		};
		const Request = {
			url: `${BaseURL}/${Path}?${Object.entries(Params)
				.map(([key, value]) => `${key}=${value}`)
				.join("&")}`,
			headers: {
				"User-Agent": "GoogleTranslate/6.29.59279 (iPhone; iOS 15.4; en; iPhone14,2)",
				Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
				"Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
			},
			body: text.map(item => `q=${encodeURIComponent(item)}`).join("&"),
		};
		return await fetch(Request)
			.then(response => {
				const body = JSON.parse(response.body);
				if (Array.isArray(body)) return body.map(item => item?.sentences?.map(sentence => sentence?.trans ?? "").join("") ?? "");
				else return body?.sentences?.map(sentence => sentence?.trans ?? "");
			})
			.catch(error => Promise.reject(error))
			.finally(() => {
				Console.log("✅ Google");
			});
	}

	async GoogleCloud(text = [], source = this.Source, target = this.Target, api = this.API) {
		Console.log("☑️ GoogleCloud", `source: ${source}`, `target: ${target}`);
		text = Array.isArray(text) ? text : [text];
		source = this.#LanguagesCode.Google[source] ?? this.#LanguagesCode.Google[source?.split?.(/[-_]/)?.[0]?.toUpperCase?.()] ?? source.toLowerCase();
		target = this.#LanguagesCode.Google[target] ?? this.#LanguagesCode.Google[target?.split?.(/[-_]/)?.[0]?.toUpperCase?.()] ?? target.toLowerCase();
		const BaseURL = "https://translation.googleapis.com";
		let Path = "language/translate";
		const Request = {
			headers: {
				"User-Agent": "DualSubs",
				Accept: "*/*",
				"Content-Type": "application/json; charset=utf-8",
			},
			body: {},
		};
		switch (api?.Version) {
			default:
			case "v2":
				Path += "/v2";
				switch (api?.Mode) {
					default:
					case "Key":
						Request.url = `${BaseURL}/${Path}?key=${api?.Auth}`;
						break;
					case "Token":
						Request.url = `${BaseURL}/${Path}`;
						Request.headers.Authorization = `Bearer ${api?.Auth}`;
						break;
				}
				Request.body = JSON.stringify({
					q: text,
					source: source === "auto" ? undefined : source,
					target: target,
					format: "text",
				});
				break;
			case "v3":
				Path += "/v3";
				switch (api?.Mode) {
					default:
					case "Key":
						Request.url = `${BaseURL}/${Path}?key=${api?.Auth}`;
						break;
					case "Token":
						Request.url = `${BaseURL}/${Path}`;
						Request.headers.Authorization = `Bearer ${api?.Auth}`;
						break;
				}
				Request.body = JSON.stringify({
					contents: text,
					sourceLanguageCode: source === "auto" ? undefined : source,
					targetLanguageCode: target,
					mimeType: "text/plain",
				});
				break;
		}
		return await fetch(Request)
			.then(response => {
				const body = JSON.parse(response.body);
				return body?.data?.translations?.map(item => item?.translatedText ?? `翻译失败, vendor: ${"GoogleCloud"}`);
			})
			.catch(error => Promise.reject(error))
			.finally(() => {
				Console.log("✅ GoogleCloud");
			});
	}

	async Microsoft(text = [], source = this.Source, target = this.Target, api = this.API) {
		Console.log("☑️ Microsoft", `source: ${source}`, `target: ${target}`);
		text = Array.isArray(text) ? text : [text];
		source = this.#LanguagesCode.Microsoft[source] ?? this.#LanguagesCode.Microsoft[source?.split?.(/[-_]/)?.[0]?.toUpperCase?.()] ?? source.toLowerCase();
		target = this.#LanguagesCode.Microsoft[target] ?? this.#LanguagesCode.Microsoft[target?.split?.(/[-_]/)?.[0]?.toUpperCase?.()] ?? target.toLowerCase();
		let BaseURL = "https://api.cognitive.microsofttranslator.com";
		const Path = "translate";
		const Params = {
			"api-version": "3.0",
			from: source ? source : undefined,
			to: target,
		};
		const Request = {
			headers: {
				"User-Agent": "DualSubs",
				Accept: "application/json; charset=UTF-8",
				"Content-Type": "application/json; charset=UTF-8",
			},
			body: JSON.stringify(text.map(item => ({ Text: item }))),
		};
		switch (api?.Version) {
			default:
			case "Azure":
				BaseURL = "https://api.cognitive.microsofttranslator.com";
				break;
			case "AzureCN":
				BaseURL = "https://api.translator.azure.cn";
				break;
			case "AzureUS":
				BaseURL = "https://api.cognitive.microsofttranslator.us";
				break;
		}
		Request.url = `${BaseURL}/${Path}?${Object.entries(Params)
			.filter(([, v]) => v !== undefined)
			.map(([key, value]) => `${key}=${value}`)
			.join("&")}`;
		switch (api?.Mode) {
			default:
			case "Key":
				Request.headers["Ocp-Apim-Subscription-Key"] = api?.Auth;
				Request.headers["Ocp-Apim-Subscription-Region"] = api?.Region;
				break;
			case "Token":
				Request.headers.Authorization = `Bearer ${api?.Auth}`;
				break;
		}
		return await fetch(Request)
			.then(response => {
				const body = JSON.parse(response.body);
				if (Array.isArray(body)) return body.map(item => item?.translations?.map(translation => translation?.text ?? "").join("\n") ?? "");
				else Promise.reject(body?.error ?? body);
			})
			.catch(error => Promise.reject(error))
			.finally(() => {
				Console.log("✅ Microsoft");
			});
	}

	async DeepL(text = [], source = this.Source, target = this.Target, api = this.API) {
		Console.log("☑️ DeepL", `source: ${source}`, `target: ${target}`);
		text = Array.isArray(text) ? text : [text];
		source = this.#LanguagesCode.DeepL[source] ?? this.#LanguagesCode.DeepL[source?.split?.(/[-_]/)?.[0]?.toUpperCase?.()] ?? source.toUpperCase();
		target = this.#LanguagesCode.DeepL[target] ?? this.#LanguagesCode.DeepL[target?.split?.(/[-_]/)?.[0]?.toUpperCase?.()] ?? target.toUpperCase();
		let BaseURL = "https://api-free.deepl.com";
		const Path = "v2/translate";
		switch (api?.Version) {
			default:
			case "Free":
				BaseURL = "https://api-free.deepl.com";
				break;
			case "Pro":
				BaseURL = "https://api.deepl.com";
				break;
		}
		const Request = {
			url: `${BaseURL}/${Path}`,
			headers: {
				"User-Agent": "DualSubs",
				Authorization: `DeepL-Auth-Key ${api?.Auth}`,
				Accept: "*/*",
				"Content-Type": "application/json",
			},
			body: {
				text: text,
				source_lang: source ? source : undefined,
				target_lang: target,
			},
		};
		Request.body = JSON.stringify(Request.body);
		return await fetch(Request)
			.then(response => {
				const body = JSON.parse(response.body);
				return body?.translations?.map(item => item?.text ?? `翻译失败, vendor: ${"DeepL"}`);
			})
			.catch(error => Promise.reject(error))
			.finally(() => {
				Console.log("✅ DeepL");
			});
	}

	async DeepLX(text = [], source = this.Source, target = this.Target, api = this.API) {
		Console.log("☑️ DeepLX", `source: ${source}`, `target: ${target}`);
		text = Array.isArray(text) ? text : [text];
		source = this.#LanguagesCode.DeepL[source] ?? this.#LanguagesCode.DeepL[source?.split?.(/[-_]/)?.[0]?.toUpperCase?.()] ?? source.toUpperCase();
		target = this.#LanguagesCode.DeepL[target] ?? this.#LanguagesCode.DeepL[target?.split?.(/[-_]/)?.[0]?.toUpperCase?.()] ?? target.toUpperCase();
		const BaseURL = api?.Endpoint;
		const Path = "translate";
		const Request = {
			url: `${BaseURL}/${Path}`,
			headers: {
				"User-Agent": "DualSubs",
				Accept: "*/*",
				"Content-Type": "application/json",
			},
			body: {
				text: text.join("\r"),
				source_lang: source ? source : "auto",
				target_lang: target,
			},
		};
		if (api?.Auth) Request.headers.Authorization = `Bearer ${api?.Auth}`;
		Request.body = JSON.stringify(Request.body);
		return await fetch(Request)
			.then(response => {
				const body = JSON.parse(response.body);
				return body?.data?.split?.("\r") ?? Array(text.length).fill(`翻译失败, vendor: ${"DeepLX"}`);
			})
			.catch(error => Promise.reject(error))
			.finally(() => {
				Console.log("✅ DeepLX");
			});
	}

	async BaiduFanyi(text = [], source = this.Source, target = this.Target, api = this.API) {
		Console.log("☑️ BaiduFanyi", `source: ${source}`, `target: ${target}`);
		text = Array.isArray(text) ? text : [text];
		source = this.#LanguagesCode.Baidu[source] ?? this.#LanguagesCode.Baidu[source?.split?.(/[-_]/)?.[0]?.toUpperCase?.()] ?? source.toLowerCase();
		target = this.#LanguagesCode.Baidu[target] ?? this.#LanguagesCode.Baidu[target?.split?.(/[-_]/)?.[0]?.toUpperCase?.()] ?? target.toLowerCase();
		const BaseURL = "https://fanyi-api.baidu.com";
		const Path = "api/trans/vip/translate";
		const salt = new Date().getTime();
		const query = text.join("\r");
		const sign = CryptoJS.MD5(api?.Id + query + salt + api?.Auth).toString();
		const Request = {
			url: `${BaseURL}/${Path}`,
			headers: {
				"User-Agent": "DualSubs",
				Accept: "*/*",
				"Content-Type": "application/x-www-form-urlencoded",
			},
			body: encodeURI(`q=${query}&from=${source}&to=${target}&appid=${api?.Id}&salt=${salt}&sign=${sign}`),
		};
		return await fetch(Request)
			.then(response => {
				const body = JSON.parse(response.body);
				return body?.trans_result?.map(item => item?.dst ?? `翻译失败, vendor: ${"Baidu"}`);
			})
			.catch(error => Promise.reject(error))
			.finally(() => {
				Console.log("✅ BaiduFanyi");
			});
	}
}
