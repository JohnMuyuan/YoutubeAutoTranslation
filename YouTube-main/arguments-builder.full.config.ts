import { type ArgumentItem, defineConfig } from "@nsnanocat/arguments-builder";

export const output = {
	surge: {
		path: "./dist/DualSubs.YouTube.sgmodule",
		transformEgern: {
			enable: false,
			path: "./dist/DualSubs.YouTube.yaml"
		}
	},
	loon: {
		path: "./dist/DualSubs.YouTube.plugin"
	},
	customItems: [
		{
			path: "./dist/DualSubs.YouTube.snippet",
			template: "./template/quantumultx.handlebars"
		},
		{
			path: "./dist/DualSubs.YouTube.stoverride",
			template: "./template/stash.handlebars"
		}
	],
	dts: {
		isExported: true,
		path: "./src/types.d.ts"
	},
	boxjsSettings: {
		path: "./template/boxjs.settings.json",
		scope: "@DualSubs.YouTube.Settings"
	}
};

const languageOptions = [
	{ key: "AUTO", label: "自动 - Automatic" },
	{ key: "ZH", label: "中文（自动）" },
	{ key: "ZH-HANS", label: "中文（简体）" },
	{ key: "ZH-HK", label: "中文（香港）" },
	{ key: "ZH-HANT", label: "中文（繁体）" },
	{ key: "ZH-TW", label: "中文（台湾）" },
	{ key: "EN", label: "English - 英语（自动）" },
	{ key: "EN-US", label: "English - 英语（美国）" },
	{ key: "EN-GB", label: "English - 英语（英国）" },
	{ key: "JA", label: "日本語 - 日语" },
	{ key: "KO", label: "한국어 - 韩语" },
	{ key: "DE", label: "Deutsch - 德语" },
	{ key: "FR", label: "Français - 法语" },
	{ key: "ES", label: "Español - 西班牙语（自动）" },
	{ key: "RU", label: "Русский - 俄语" },
	{ key: "IT", label: "Italiano - 意大利语" },
	{ key: "PT", label: "Português - 葡萄牙语" }
];

export const argType: ArgumentItem = {
	key: "Type",
	name: "[字幕] 启用类型",
	defaultValue: "Official",
	type: "string",
	options: [
		{ key: "Official", label: "官方字幕（合成器，自动回退翻译器）" },
		{ key: "Translate", label: "翻译字幕（翻译器）" }
	],
	description: "请选择要使用的字幕，双语字幕将使用您选择类型呈现。"
};

export const argTypes: ArgumentItem = {
	key: "Types",
	name: "[歌词] 启用类型",
	defaultValue: [
		"Translate"
	],
	type: "array",
	options: [
		{ key: "Translate", label: "翻译歌词（翻译器）" }
	],
	description: "请选择要添加的歌词选项，如果为多选，则会自动决定提供的歌词类型。"
};

export const argAutoCC: ArgumentItem = {
	key: "AutoCC",
	name: "[字幕] 自动显示",
	defaultValue: true,
	type: "boolean",
	description: "是否总是自动开启字幕显示。"
};

export const argLanguages0: ArgumentItem = {
	key: "Languages[0]",
	name: "[字幕/歌词] 主语言（源语言）",
	defaultValue: "AUTO",
	type: "string",
	options: languageOptions,
	description: "选择主语言（源语言），字幕及歌词源语言将自动识别或使用指定语言。"
};

export const argLanguages1: ArgumentItem = {
	key: "Languages[1]",
	name: "[字幕/歌词] 副语言（目标语言）",
	defaultValue: "ZH-HANS",
	type: "string",
	options: languageOptions.filter(item => item.key !== "AUTO"),
	description: "选择需要翻译成的目标语言（默认中文简体）。"
};

export const argPosition: ArgumentItem = {
	key: "Position",
	name: "[字幕] 主语言（源语言）字幕位置",
	defaultValue: "Forward",
	type: "string",
	options: [
		{ key: "Forward", label: "上面（第一行）" },
		{ key: "Reverse", label: "下面（第二行）" }
	],
	description: "主语言（源语言）字幕的显示位置。"
};

export const argVendor: ArgumentItem = {
	key: "Vendor",
	name: "[翻译器] 服务商API",
	defaultValue: "Google",
	type: "string",
	description: "请选择翻译器所使用的服务商API，更多翻译选项请使用BoxJs。",
	options: [
		{ key: "Google", label: "Google Translate" },
		{ key: "Microsoft", label: "Microsoft Translator（需填写API）" },
		{ key: "DeepL", label: "DeepL Translate（需填写API）" }
	]
};

export const argShowOnly: ArgumentItem = {
	key: "ShowOnly",
	name: "[翻译器] 只显示“自动翻译”字幕",
	defaultValue: false,
	type: "boolean",
	description: "是否仅显示“自动翻译”字幕，不显示源语言字幕。"
};

export const argStorage: ArgumentItem = {
	key: "Storage",
	name: "[储存] 配置类型",
	defaultValue: "PersistentStore",
	type: "string",
	exclude: ["boxjs"],
	options: [
		{ key: "Argument", label: "插件配置优先" },
		{ key: "PersistentStore", label: "持久化存储优先" },
		{ key: "database", label: "仅使用默认配置" }
	],
	description: "默认优先使用设置面板或 BoxJS 保存的配置，其次使用插件配置，最后使用脚本默认配置。"
};

export const argLogLevel: ArgumentItem = {
	key: "LogLevel",
	name: "[调试] 日志等级",
	type: "string",
	defaultValue: "WARN",
	description: "选择脚本日志的输出等级，低于所选等级的日志将全部输出。",
	options: [
		{ key: "OFF", label: "关闭" },
		{ key: "ERROR", label: "❌ 错误" },
		{ key: "WARN", label: "⚠️ 警告" },
		{ key: "INFO", label: "ℹ️ 信息" },
		{ key: "DEBUG", label: "🅱️ 调试" },
		{ key: "ALL", label: "全部" }
	]
};

export const panelYouTubeTypesDev: ArgumentItem = {
	...argTypes,
	defaultValue: [
		"Translate",
		"External"
	],
	options: [
		{ key: "Translate", label: "翻译歌词（翻译器）" },
		{ key: "External", label: "外部歌词（外部源）" }
	]
};

export const moduleArgs: ArgumentItem[] = [argType, argTypes, argAutoCC, argLanguages0, argLanguages1, argPosition, argVendor, argShowOnly, argStorage, argLogLevel];

export default defineConfig({ output, args: moduleArgs });
