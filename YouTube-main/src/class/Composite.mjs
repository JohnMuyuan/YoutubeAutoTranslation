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
		const stripZwsp = str => String(str ?? "").replace(/\u200B \u200B/g, "").replace(/\u200B/g, "");
		const getParaText = para => {
			if (!para) return "";
			if (para.s) {
				const segs = Array.isArray(para.s) ? para.s : [para.s];
				return stripZwsp(segs.map(seg => seg?.["#"] ?? "").join("")).trim();
			}
			return typeof para["#"] === "string" ? stripZwsp(para["#"]).trim() : "";
		};
		const normalizeParagraphs = (pList, isAsr) => {
			if (!pList) return [];
			const arr = Array.isArray(pList) ? pList : [pList];
			const result = [];
			for (const para of arr) {
				if (!para || para["@a"] === "1") continue;
				const isStyledPara =
					!isAsr &&
					para.s &&
					(Array.isArray(para.s) ? para.s.some(s => s?.["@p"] !== undefined) : para.s?.["@p"] !== undefined);
				if (para.s && !isStyledPara) {
					if (Array.isArray(para.s)) para["#"] = para.s.map(seg => seg?.["#"] ?? "").join("");
					else para["#"] = para.s?.["#"] ?? "";
					delete para.s;
				}
				if (!para.s && typeof para["#"] === "string") {
					para["#"] = para["#"].trim();
				}
				if (getParaText(para)) {
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
			const para1 = Sub1.timedtext.body.p[index1];
			const para2 = Sub2.timedtext.body.p[index2];
			const timeStamp1 = Number.parseInt(para1["@t"], 10);
			const timeStamp2 = Number.parseInt(para2["@t"], 10) + Offset;
			const text1 = getParaText(para1);
			const text2 = getParaText(para2);
			if (Math.abs(timeStamp1 - timeStamp2) <= Tolerance) {
				index0 = Position.includes("Reverse") ? index2 : index1;
				const targetPara = DualSub.timedtext.body.p[index0];
				const otherText = Position.includes("Reverse") ? text1 : text2;
				if (targetPara.s && otherText) {
					const segs = Array.isArray(targetPara.s) ? [...targetPara.s] : [targetPara.s];
					const mainSeg = segs.find(s => stripZwsp(s?.["#"]).trim().length > 0 && s?.["@p"] !== undefined) ?? segs[0];
					const penId = mainSeg?.["@p"] ?? targetPara["@p"];
					const sepSeg = { ...(segs[0]?.["@p"] !== undefined ? { "@p": segs[0]["@p"] } : {}), "#": "\u200B&#x000A;\u200B" };
					const addSeg = { ...(penId !== undefined ? { "@p": penId } : {}), "#": `\u200B \u200B${otherText}\u200B \u200B` };
					segs.push(sepSeg, addSeg);
					targetPara.s = segs;
				} else {
					targetPara["#"] = (Position.includes("Reverse") ? `${text2}&#x000A;${text1}` : `${text1}&#x000A;${text2}`).trim();
				}
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
		const stripZwsp = str => String(str ?? "").replace(/\u200B \u200B/g, "").replace(/\u200B/g, "");
		const getEventText = event => {
			if (!Array.isArray(event?.segs)) return "";
			return stripZwsp(event.segs.map(seg => seg?.utf8 ?? "").join("")).trim();
		};
		const normalizeEvents = events => {
			if (!Array.isArray(events)) return [];
			const result = [];
			for (const event of events) {
				if (!event || event.aAppend === 1) continue;
				if (event.segs) {
					const text = getEventText(event);
					if (!text) continue;
					const isStyledEvent = !isAsr && event.segs.some(s => s?.pPenId !== undefined);
					if (!isStyledEvent) {
						event.segs = [{ utf8: text }];
					}
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
			const ev1 = Sub1.events[index1];
			const ev2 = Sub2.events[index2];
			const timeStamp1 = ev1.tStartMs;
			const timeStamp2 = ev2.tStartMs + Offset;
			const text1 = getEventText(ev1);
			const text2 = getEventText(ev2);
			if (Math.abs(timeStamp1 - timeStamp2) <= Tolerance) {
				index0 = Position.includes("Reverse") ? index2 : index1;
				const targetEvent = DualSub.events[index0];
				const otherText = Position.includes("Reverse") ? text1 : text2;
				if (targetEvent.segs?.some(s => s?.pPenId !== undefined) && otherText) {
					const mainSeg = targetEvent.segs.find(s => stripZwsp(s?.utf8).trim().length > 0 && s?.pPenId !== undefined) ?? targetEvent.segs[0];
					const penId = mainSeg?.pPenId ?? targetEvent.pPenId;
					targetEvent.segs.push(
						{ ...(targetEvent.segs[0]?.pPenId !== undefined ? { pPenId: targetEvent.segs[0].pPenId } : {}), utf8: "\u200B\n\u200B" },
						{ ...(penId !== undefined ? { pPenId: penId } : {}), utf8: `\u200B \u200B${otherText}\u200B \u200B` },
					);
				} else {
					targetEvent.segs = [{ utf8: (Position.includes("Reverse") ? `${text2}\n${text1}` : `${text1}\n${text2}`).trim() }];
				}
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
