import { Console } from "@nsnanocat/util";

export default class Composite {
	constructor(options = {}) {
		this.Name = "Composite";
		this.Version = "1.0.5";
		Console.log(`🟧 ${this.Name} v${this.Version}`);
		this.Offset = 0;
		this.Tolerance = 0;
		this.Position = "Forward";
		Object.assign(this, options);
	}

	webVTT(Sub1 = {}, Sub2 = {}, Offset = this.Offset, Tolerance = this.Tolerance, Position = this.Position) {
		Console.log("☑️ Composite webVTT Subtitles", `Offset:${Offset}`, `Tolerance:${Tolerance}`, `Position:${Position}`);
		const DualSub = Position.includes("Reverse") ? Sub2 : Sub1;
		let index0 = 0;
		let index1 = 0;
		let index2 = 0;
		const length1 = Sub1?.body?.length;
		const length2 = Sub2?.body?.length;
		while (index1 < length1 && index2 < length2) {
			const timeStamp1 = Sub1.body[index1].timeStamp;
			const timeStamp2 = Sub2.body[index2].timeStamp + Offset;
			const timeStamp0 = DualSub.body[index0].timeStamp;
			const text1 = Sub1.body[index1].text.trim();
			const text2 = Sub2.body[index2].text.trim();
			if (Math.abs(timeStamp1 - timeStamp2) <= Tolerance) {
				DualSub.body[index0].text = Position.includes("Reverse") ? `${text2}\n${text1}` : `${text1}\n${text2}`;
				index0 = Position.includes("Reverse") ? index2 : index1;
				index1++;
				index2++;
				index0++;
			} else if (timeStamp1 > timeStamp2) index2++;
			else if (timeStamp1 < timeStamp2) index1++;
			else {
				index1++;
				index2++;
			}
			index0 = Position.includes("Reverse") ? index2 : index1;
		}
		Console.log("✅ Composite webVTT Subtitles");
		return DualSub;
	}

	timedText(Sub1 = {}, Sub2 = {}, kind = "subtitles", Offset = this.Offset, Tolerance = this.Tolerance, Position = this.Position) {
		Console.log("☑️ Composite timedText Subtitles", `kind:${kind}`, `Offset:${Offset}`, `Tolerance:${Tolerance}`, `Position:${Position}`);
		const normalizeParagraphs = (pList, isAsr) => {
			if (!pList) return [];
			const arr = Array.isArray(pList) ? pList : [pList];
			const result = [];
			for (const para of arr) {
				if (!para || para["@a"] === "1") continue;
				if (para.s) {
					if (Array.isArray(para.s)) para["#"] = para.s.map(seg => seg?.["#"] ?? "").join("");
					else para["#"] = para.s?.["#"] ?? "";
					delete para.s;
				}
				if (typeof para["#"] === "string") {
					para["#"] = para["#"].trim();
				}
				if (para["#"]) {
					if (isAsr) delete para["@w"];
					result.push(para);
				}
			}
			if (isAsr) {
				for (let i = 0; i < result.length - 1; i++) {
					const t = Number.parseInt(result[i]["@t"], 10);
					const d = Number.parseInt(result[i]["@d"], 10);
					const nextT = Number.parseInt(result[i + 1]["@t"], 10);
					if (!Number.isNaN(t) && !Number.isNaN(d) && !Number.isNaN(nextT) && t + d > nextT) {
						result[i]["@d"] = String(Math.max(0, nextT - t));
					}
				}
			}
			return result;
		};

		const isAsr = kind === "asr";
		if (Sub1?.timedtext?.body) {
			Sub1.timedtext.body.p = normalizeParagraphs(Sub1.timedtext.body.p, isAsr);
		}
		if (Sub2?.timedtext?.body) {
			Sub2.timedtext.body.p = normalizeParagraphs(Sub2.timedtext.body.p, isAsr);
		}
		const DualSub = Position.includes("Reverse") ? Sub2 : Sub1;
		if (isAsr) {
			if (Array.isArray(DualSub?.timedtext?.head?.wp) && DualSub.timedtext.head.wp[1]) {
				DualSub.timedtext.head.wp[1]["@rc"] = "1";
			} else if (DualSub?.timedtext?.head?.wp && typeof DualSub.timedtext.head.wp === "object") {
				DualSub.timedtext.head.wp["@rc"] = "1";
			}
		}
		let index0 = 0;
		let index1 = 0;
		let index2 = 0;
		const length1 = Sub1?.timedtext?.body?.p?.length || 0;
		const length2 = Sub2?.timedtext?.body?.p?.length || 0;
		while (index1 < length1 && index2 < length2) {
			const timeStamp1 = Number.parseInt(Sub1.timedtext.body.p[index1]["@t"], 10);
			const timeStamp2 = Number.parseInt(Sub2.timedtext.body.p[index2]["@t"], 10) + Offset;
			const text1 = Sub1.timedtext.body.p[index1]["#"]?.trim() ?? "";
			const text2 = Sub2.timedtext.body.p[index2]["#"]?.trim() ?? "";
			if (Math.abs(timeStamp1 - timeStamp2) <= Tolerance) {
				index0 = Position.includes("Reverse") ? index2 : index1;
				DualSub.timedtext.body.p[index0]["#"] = (Position.includes("Reverse") ? `${text2}&#x000A;${text1}` : `${text1}&#x000A;${text2}`).trim();
				index1++;
				index2++;
				index0++;
			} else if (timeStamp1 > timeStamp2) index2++;
			else if (timeStamp1 < timeStamp2) index1++;
			else {
				index1++;
				index2++;
			}
			index0 = Position.includes("Reverse") ? index2 : index1;
		}
		Console.log("✅ Composite timedText Subtitles");
		return DualSub;
	}

	JSON(Sub1 = {}, Sub2 = {}, kind = "subtitles", Offset = this.Offset, Tolerance = this.Tolerance, Position = this.Position) {
		Console.log("☑️ Composite JSON Subtitles", `kind:${kind}`, `Offset:${Offset}`, `Tolerance:${Tolerance}`, `Position:${Position}`);
		const isAsr = kind === "asr";
		const normalizeEvents = (events) => {
			if (!Array.isArray(events)) return [];
			const result = [];
			for (const event of events) {
				if (!event || event.aAppend === 1) continue;
				if (event.segs) {
					const text = event.segs.map(seg => seg?.utf8 ?? "").join("").trim();
					if (!text) continue;
					event.segs = [{ utf8: text }];
					if (isAsr) delete event.wWinId;
					result.push(event);
				}
			}
			if (isAsr) {
				for (let i = 0; i < result.length - 1; i++) {
					const t = result[i].tStartMs;
					const d = result[i].dDurationMs;
					const nextT = result[i + 1].tStartMs;
					if (typeof t === "number" && typeof d === "number" && typeof nextT === "number" && t + d > nextT) {
						result[i].dDurationMs = Math.max(0, nextT - t);
					}
				}
			}
			return result;
		};
		if (Sub1?.events) Sub1.events = normalizeEvents(Sub1.events);
		if (Sub2?.events) Sub2.events = normalizeEvents(Sub2.events);
		const DualSub = Position.includes("Reverse") ? Sub2 : Sub1;
		if (isAsr && DualSub?.wpWinPositions?.[1]) {
			DualSub.wpWinPositions[1].rcRows = 1;
		}
		let index0 = 0;
		let index1 = 0;
		let index2 = 0;
		const length1 = Sub1?.events?.length || 0;
		const length2 = Sub2?.events?.length || 0;
		while (index1 < length1 && index2 < length2) {
			const timeStamp1 = Sub1.events[index1].tStartMs;
			const timeStamp2 = Sub2.events[index2].tStartMs + Offset;
			const text1 = Sub1.events[index1].segs?.[0]?.utf8?.trim() ?? "";
			const text2 = Sub2.events[index2].segs?.[0]?.utf8?.trim() ?? "";
			if (Math.abs(timeStamp1 - timeStamp2) <= Tolerance) {
				index0 = Position.includes("Reverse") ? index2 : index1;
				DualSub.events[index0].segs = [{ utf8: (Position.includes("Reverse") ? `${text2}\n${text1}` : `${text1}\n${text2}`).trim() }];
				index1++;
				index2++;
				index0++;
			} else if (timeStamp1 > timeStamp2) index2++;
			else if (timeStamp1 < timeStamp2) index1++;
			else {
				index1++;
				index2++;
			}
			index0 = Position.includes("Reverse") ? index2 : index1;
		}
		Console.log("✅ Composite JSON Subtitles");
		return DualSub;
	}
}
