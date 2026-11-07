# 🍿️ DualSubs: YouTube & YouTube Music 二合一双语字幕/歌词插件 (Loon)

将 `DualSubs.YouTube` 与 `DualSubs.Universal` 合二为一，专为 **Loon** 客户端打造的 YouTube 双语字幕 & YouTube Music 双语歌词插件。

## ✨ 修复与改进

1. **双插件合二为一**：不再需要同时安装 `DualSubs.YouTube` 和 `DualSubs.Universal`，全部逻辑（轨道注入、官方双语字幕合成、第三方实时翻译字幕、YouTube Music 同步/静态双语歌词）已合并至单一插件与单一脚本（`request.bundle.js` + `response.bundle.js`）。
2. **修复自动生成 (ASR) / 翻译字幕只显示单一语言**：
   - 修复 `srv3` XML 与 `json3` 字幕合成时的单行滚动窗口限制（`@w="1"` / `rc="1"`）及 `a="1"` 空白追加行问题，防止双语字幕第二行被裁剪或顶出窗口。
   - 修复已扁平化的 `tlang` 翻译段落被误过滤清空的问题。
   - 为内部原文字幕子请求添加 `dualsubs_subreq=1` 标记，防止被 `AutoCC` 递归拦截导致原文字幕被覆写为译文。
3. **修复切换翻译字幕空白 / 无法加载**：
   - 更新 Onesie `initplayback` 拦截规则（同时匹配 `oad=` 与 `ack=`），确保客户端走标准 `/youtubei/v1/player` 流程。
   - 新增官方 `tlang` 翻译字幕空响应自动降级兜底：当 YouTube 官方翻译接口返回空白时，自动调用内置翻译引擎（Google / DeepL / Microsoft）翻译原文字幕并合成双语。
4. **修复 YouTube Music 双语歌词失效**：
   - 完整支持 `/youtubei/v1/browse`（含切换歌词标签页时的 `continuationContents`）与 iOS YouTube Music 9.32+ `/youtubei/v1/get_panel` 歌词接口。
   - 同时兼容 `465160965` (`timedLyricsRender`)、`465100242` (`timedLyricsModel`) 同步滚动歌词以及 `221496734` (`musicDescriptionShelfRenderer`) 静态歌词。

## 🚀 Loon 安装地址

在 Loon -> **插件** 中直接添加以下链接即可：

```text
https://raw.githubusercontent.com/JohnMuyuan/YoutubeAutoTranslation/main/dist/DualSubs.YouTube.plugin
```

> 使用前请确保已在 Loon 中开启 **MitM** 并信任根证书。
