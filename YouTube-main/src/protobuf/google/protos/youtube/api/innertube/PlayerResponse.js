import { MessageType, ScalarType, WireType, UnknownFieldHandler, reflectionMergePartial } from "@protobuf-ts/runtime";

class PlayerResponse$Type extends MessageType {
	constructor() {
		super("youtube.api.innertube.PlayerResponse", [
			{ no: 10, name: "captions", kind: "message", T: () => Captions },
		]);
	}
	create(value) {
		const message = globalThis.Object.create(this.messagePrototype);
		if (value !== undefined) reflectionMergePartial(this, message, value);
		return message;
	}
	internalBinaryRead(reader, length, options, target) {
		let message = target ?? this.create(), end = reader.pos + length;
		while (reader.pos < end) {
			let [fieldNo, wireType] = reader.tag();
			switch (fieldNo) {
				case /* youtube.api.innertube.Captions captions */ 10:
					message.captions = Captions.internalBinaryRead(reader, reader.uint32(), options, message.captions);
					break;
				default:
					let u = options.readUnknownField;
					if (u === "throw") throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
					let d = reader.skip(wireType);
					if (u !== false) (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
			}
		}
		return message;
	}
	internalBinaryWrite(message, writer, options) {
		/* youtube.api.innertube.Captions captions = 10; */
		if (message.captions)
			Captions.internalBinaryWrite(message.captions, writer.tag(10, WireType.LengthDelimited).fork(), options).join();
		let u = options.writeUnknownFields;
		if (u !== false) (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
		return writer;
	}
}
export const PlayerResponse = new PlayerResponse$Type();

class Captions$Type extends MessageType {
	constructor() {
		super("youtube.api.innertube.Captions", [
			{ no: 51621377, name: "playerCaptionsTracklistRenderer", kind: "message", T: () => PlayerCaptionsTracklistRenderer },
		]);
	}
	create(value) {
		const message = globalThis.Object.create(this.messagePrototype);
		if (value !== undefined) reflectionMergePartial(this, message, value);
		return message;
	}
	internalBinaryRead(reader, length, options, target) {
		let message = target ?? this.create(), end = reader.pos + length;
		while (reader.pos < end) {
			let [fieldNo, wireType] = reader.tag();
			switch (fieldNo) {
				case /* youtube.api.innertube.PlayerCaptionsTracklistRenderer player_captions_tracklist_renderer */ 51621377:
					message.playerCaptionsTracklistRenderer = PlayerCaptionsTracklistRenderer.internalBinaryRead(reader, reader.uint32(), options, message.playerCaptionsTracklistRenderer);
					break;
				default:
					let u = options.readUnknownField;
					if (u === "throw") throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
					let d = reader.skip(wireType);
					if (u !== false) (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
			}
		}
		return message;
	}
	internalBinaryWrite(message, writer, options) {
		/* youtube.api.innertube.PlayerCaptionsTracklistRenderer player_captions_tracklist_renderer = 51621377; */
		if (message.playerCaptionsTracklistRenderer)
			PlayerCaptionsTracklistRenderer.internalBinaryWrite(message.playerCaptionsTracklistRenderer, writer.tag(51621377, WireType.LengthDelimited).fork(), options).join();
		let u = options.writeUnknownFields;
		if (u !== false) (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
		return writer;
	}
}
export const Captions = new Captions$Type();

class PlayerCaptionsTracklistRenderer$Type extends MessageType {
	constructor() {
		super("youtube.api.innertube.PlayerCaptionsTracklistRenderer", [
			{ no: 1, name: "captionTracks", kind: "message", repeat: 1 /*RepeatType.PACKED*/, T: () => CaptionTrack },
			{ no: 2, name: "audioTracks", kind: "message", repeat: 1 /*RepeatType.PACKED*/, T: () => AudioTrack },
			{ no: 3, name: "translationLanguages", kind: "message", repeat: 1 /*RepeatType.PACKED*/, T: () => TranslationLanguage },
			{ no: 4, name: "defaultAudioTrackIndex", kind: "scalar", opt: true, T: ScalarType.INT32 },
			{ no: 6, name: "defaultCaptionTrackIndex", kind: "scalar", opt: true, T: ScalarType.INT32 },
		]);
	}
	create(value) {
		const message = globalThis.Object.create(this.messagePrototype);
		message.captionTracks = [];
		message.audioTracks = [];
		message.translationLanguages = [];
		if (value !== undefined) reflectionMergePartial(this, message, value);
		return message;
	}
	internalBinaryRead(reader, length, options, target) {
		let message = target ?? this.create(), end = reader.pos + length;
		while (reader.pos < end) {
			let [fieldNo, wireType] = reader.tag();
			switch (fieldNo) {
				case /* repeated youtube.api.innertube.CaptionTrack caption_tracks */ 1:
					message.captionTracks.push(CaptionTrack.internalBinaryRead(reader, reader.uint32(), options));
					break;
				case /* repeated youtube.api.innertube.AudioTrack audio_tracks */ 2:
					message.audioTracks.push(AudioTrack.internalBinaryRead(reader, reader.uint32(), options));
					break;
				case /* repeated youtube.api.innertube.TranslationLanguage translation_languages */ 3:
					message.translationLanguages.push(TranslationLanguage.internalBinaryRead(reader, reader.uint32(), options));
					break;
				case /* optional int32 default_audio_track_index */ 4:
					message.defaultAudioTrackIndex = reader.int32();
					break;
				case /* optional int32 default_caption_track_index */ 6:
					message.defaultCaptionTrackIndex = reader.int32();
					break;
				default:
					let u = options.readUnknownField;
					if (u === "throw") throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
					let d = reader.skip(wireType);
					if (u !== false) (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
			}
		}
		return message;
	}
	internalBinaryWrite(message, writer, options) {
		/* repeated youtube.api.innertube.CaptionTrack caption_tracks = 1; */
		for (let i = 0; i < message.captionTracks.length; i++)
			CaptionTrack.internalBinaryWrite(message.captionTracks[i], writer.tag(1, WireType.LengthDelimited).fork(), options).join();
		/* repeated youtube.api.innertube.AudioTrack audio_tracks = 2; */
		for (let i = 0; i < message.audioTracks.length; i++)
			AudioTrack.internalBinaryWrite(message.audioTracks[i], writer.tag(2, WireType.LengthDelimited).fork(), options).join();
		/* repeated youtube.api.innertube.TranslationLanguage translation_languages = 3; */
		for (let i = 0; i < message.translationLanguages.length; i++)
			TranslationLanguage.internalBinaryWrite(message.translationLanguages[i], writer.tag(3, WireType.LengthDelimited).fork(), options).join();
		/* optional int32 default_audio_track_index = 4; */
		if (message.defaultAudioTrackIndex !== undefined)
			writer.tag(4, WireType.Varint).int32(message.defaultAudioTrackIndex);
		/* optional int32 default_caption_track_index = 6; */
		if (message.defaultCaptionTrackIndex !== undefined)
			writer.tag(6, WireType.Varint).int32(message.defaultCaptionTrackIndex);
		let u = options.writeUnknownFields;
		if (u !== false) (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
		return writer;
	}
}
export const PlayerCaptionsTracklistRenderer = new PlayerCaptionsTracklistRenderer$Type();

class CaptionTrack$Type extends MessageType {
	constructor() {
		super("youtube.api.innertube.CaptionTrack", [
			{ no: 1, name: "baseUrl", kind: "scalar", T: ScalarType.STRING },
			{ no: 2, name: "name", kind: "message", T: () => FormattedString },
			{ no: 3, name: "vssId", kind: "scalar", T: ScalarType.STRING },
			{ no: 4, name: "languageCode", kind: "scalar", T: ScalarType.STRING },
			{ no: 5, name: "kind", kind: "scalar", opt: true, T: ScalarType.STRING },
			{ no: 6, name: "rtl", kind: "scalar", opt: true, T: ScalarType.BOOL },
			{ no: 7, name: "isTranslatable", kind: "scalar", T: ScalarType.BOOL },
		]);
	}
	create(value) {
		const message = globalThis.Object.create(this.messagePrototype);
		message.baseUrl = "";
		message.vssId = "";
		message.languageCode = "";
		message.isTranslatable = false;
		if (value !== undefined) reflectionMergePartial(this, message, value);
		return message;
	}
	internalBinaryRead(reader, length, options, target) {
		let message = target ?? this.create(), end = reader.pos + length;
		while (reader.pos < end) {
			let [fieldNo, wireType] = reader.tag();
			switch (fieldNo) {
				case /* string base_url */ 1:
					message.baseUrl = reader.string();
					break;
				case /* youtube.api.innertube.FormattedString name */ 2:
					message.name = FormattedString.internalBinaryRead(reader, reader.uint32(), options, message.name);
					break;
				case /* string vss_id */ 3:
					message.vssId = reader.string();
					break;
				case /* string language_code */ 4:
					message.languageCode = reader.string();
					break;
				case /* optional string kind */ 5:
					message.kind = reader.string();
					break;
				case /* optional bool rtl */ 6:
					message.rtl = reader.bool();
					break;
				case /* bool is_translatable */ 7:
					message.isTranslatable = reader.bool();
					break;
				default:
					let u = options.readUnknownField;
					if (u === "throw") throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
					let d = reader.skip(wireType);
					if (u !== false) (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
			}
		}
		return message;
	}
	internalBinaryWrite(message, writer, options) {
		/* string base_url = 1; */
		if (message.baseUrl !== "") writer.tag(1, WireType.LengthDelimited).string(message.baseUrl);
		/* youtube.api.innertube.FormattedString name = 2; */
		if (message.name)
			FormattedString.internalBinaryWrite(message.name, writer.tag(2, WireType.LengthDelimited).fork(), options).join();
		/* string vss_id = 3; */
		if (message.vssId !== "") writer.tag(3, WireType.LengthDelimited).string(message.vssId);
		/* string language_code = 4; */
		if (message.languageCode !== "") writer.tag(4, WireType.LengthDelimited).string(message.languageCode);
		/* optional string kind = 5; */
		if (message.kind !== undefined) writer.tag(5, WireType.LengthDelimited).string(message.kind);
		/* optional bool rtl = 6; */
		if (message.rtl !== undefined) writer.tag(6, WireType.Varint).bool(message.rtl);
		/* bool is_translatable = 7; */
		if (message.isTranslatable !== false) writer.tag(7, WireType.Varint).bool(message.isTranslatable);
		let u = options.writeUnknownFields;
		if (u !== false) (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
		return writer;
	}
}
export const CaptionTrack = new CaptionTrack$Type();

class AudioTrack$Type extends MessageType {
	constructor() {
		super("youtube.api.innertube.AudioTrack", [
			{ no: 2, name: "captionTrackIndices", kind: "scalar", repeat: 2 /*RepeatType.UNPACKED*/, T: ScalarType.INT32 },
			{ no: 3, name: "defaultCaptionTrackIndex", kind: "scalar", opt: true, T: ScalarType.INT32 },
			{ no: 4, name: "forcedCaptionTrackIndex", kind: "scalar", opt: true, T: ScalarType.INT32 },
			{ no: 5, name: "visibility", kind: "scalar", opt: true, T: ScalarType.INT32 },
			{ no: 6, name: "hasDefaultTrack", kind: "scalar", opt: true, T: ScalarType.BOOL },
			{ no: 7, name: "hasForcedTrack", kind: "scalar", opt: true, T: ScalarType.BOOL },
			{ no: 8, name: "audioTrackId", kind: "scalar", opt: true, T: ScalarType.STRING },
			{ no: 11, name: "captionsInitialState", kind: "scalar", opt: true, T: ScalarType.INT32 },
		]);
	}
	create(value) {
		const message = globalThis.Object.create(this.messagePrototype);
		message.captionTrackIndices = [];
		if (value !== undefined) reflectionMergePartial(this, message, value);
		return message;
	}
	internalBinaryRead(reader, length, options, target) {
		let message = target ?? this.create(), end = reader.pos + length;
		while (reader.pos < end) {
			let [fieldNo, wireType] = reader.tag();
			switch (fieldNo) {
				case /* repeated int32 caption_track_indices */ 2:
					if (wireType === WireType.LengthDelimited)
						for (let e = reader.int32() + reader.pos; reader.pos < e;)
							message.captionTrackIndices.push(reader.int32());
					else
						message.captionTrackIndices.push(reader.int32());
					break;
				case /* optional int32 default_caption_track_index */ 3:
					message.defaultCaptionTrackIndex = reader.int32();
					break;
				case /* optional int32 forced_caption_track_index */ 4:
					message.forcedCaptionTrackIndex = reader.int32();
					break;
				case /* optional int32 visibility */ 5:
					message.visibility = reader.int32();
					break;
				case /* optional bool has_default_track */ 6:
					message.hasDefaultTrack = reader.bool();
					break;
				case /* optional bool has_forced_track */ 7:
					message.hasForcedTrack = reader.bool();
					break;
				case /* optional string audio_track_id */ 8:
					message.audioTrackId = reader.string();
					break;
				case /* optional int32 captions_initial_state */ 11:
					message.captionsInitialState = reader.int32();
					break;
				default:
					let u = options.readUnknownField;
					if (u === "throw") throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
					let d = reader.skip(wireType);
					if (u !== false) (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
			}
		}
		return message;
	}
	internalBinaryWrite(message, writer, options) {
		/* repeated int32 caption_track_indices = 2; */
		for (let i = 0; i < message.captionTrackIndices.length; i++)
			writer.tag(2, WireType.Varint).int32(message.captionTrackIndices[i]);
		/* optional int32 default_caption_track_index = 3; */
		if (message.defaultCaptionTrackIndex !== undefined)
			writer.tag(3, WireType.Varint).int32(message.defaultCaptionTrackIndex);
		/* optional int32 forced_caption_track_index = 4; */
		if (message.forcedCaptionTrackIndex !== undefined)
			writer.tag(4, WireType.Varint).int32(message.forcedCaptionTrackIndex);
		/* optional int32 visibility = 5; */
		if (message.visibility !== undefined)
			writer.tag(5, WireType.Varint).int32(message.visibility);
		/* optional bool has_default_track = 6; */
		if (message.hasDefaultTrack !== undefined)
			writer.tag(6, WireType.Varint).bool(message.hasDefaultTrack);
		/* optional bool has_forced_track = 7; */
		if (message.hasForcedTrack !== undefined)
			writer.tag(7, WireType.Varint).bool(message.hasForcedTrack);
		/* optional string audio_track_id = 8; */
		if (message.audioTrackId !== undefined)
			writer.tag(8, WireType.LengthDelimited).string(message.audioTrackId);
		/* optional int32 captions_initial_state = 11; */
		if (message.captionsInitialState !== undefined)
			writer.tag(11, WireType.Varint).int32(message.captionsInitialState);
		let u = options.writeUnknownFields;
		if (u !== false) (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
		return writer;
	}
}
export const AudioTrack = new AudioTrack$Type();

class TranslationLanguage$Type extends MessageType {
	constructor() {
		super("youtube.api.innertube.TranslationLanguage", [
			{ no: 1, name: "languageCode", kind: "scalar", T: ScalarType.STRING },
			{ no: 2, name: "languageName", kind: "message", T: () => FormattedString },
		]);
	}
	create(value) {
		const message = globalThis.Object.create(this.messagePrototype);
		message.languageCode = "";
		if (value !== undefined) reflectionMergePartial(this, message, value);
		return message;
	}
	internalBinaryRead(reader, length, options, target) {
		let message = target ?? this.create(), end = reader.pos + length;
		while (reader.pos < end) {
			let [fieldNo, wireType] = reader.tag();
			switch (fieldNo) {
				case /* string language_code */ 1:
					message.languageCode = reader.string();
					break;
				case /* youtube.api.innertube.FormattedString language_name */ 2:
					message.languageName = FormattedString.internalBinaryRead(reader, reader.uint32(), options, message.languageName);
					break;
				default:
					let u = options.readUnknownField;
					if (u === "throw") throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
					let d = reader.skip(wireType);
					if (u !== false) (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
			}
		}
		return message;
	}
	internalBinaryWrite(message, writer, options) {
		/* string language_code = 1; */
		if (message.languageCode !== "") writer.tag(1, WireType.LengthDelimited).string(message.languageCode);
		/* youtube.api.innertube.FormattedString language_name = 2; */
		if (message.languageName)
			FormattedString.internalBinaryWrite(message.languageName, writer.tag(2, WireType.LengthDelimited).fork(), options).join();
		let u = options.writeUnknownFields;
		if (u !== false) (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
		return writer;
	}
}
export const TranslationLanguage = new TranslationLanguage$Type();

class FormattedString$Type extends MessageType {
	constructor() {
		super("youtube.api.innertube.FormattedString", [
			{ no: 1, name: "runs", kind: "message", repeat: 1 /*RepeatType.PACKED*/, T: () => StringRun },
			{ no: 2, name: "simpleText", kind: "scalar", opt: true, T: ScalarType.STRING },
		]);
	}
	create(value) {
		const message = globalThis.Object.create(this.messagePrototype);
		message.runs = [];
		if (value !== undefined) reflectionMergePartial(this, message, value);
		return message;
	}
	internalBinaryRead(reader, length, options, target) {
		let message = target ?? this.create(), end = reader.pos + length;
		while (reader.pos < end) {
			let [fieldNo, wireType] = reader.tag();
			switch (fieldNo) {
				case /* repeated youtube.api.innertube.StringRun runs */ 1:
					message.runs.push(StringRun.internalBinaryRead(reader, reader.uint32(), options));
					break;
				case /* optional string simple_text */ 2:
					message.simpleText = reader.string();
					break;
				default:
					let u = options.readUnknownField;
					if (u === "throw") throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
					let d = reader.skip(wireType);
					if (u !== false) (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
			}
		}
		return message;
	}
	internalBinaryWrite(message, writer, options) {
		/* repeated youtube.api.innertube.StringRun runs = 1; */
		for (let i = 0; i < message.runs.length; i++)
			StringRun.internalBinaryWrite(message.runs[i], writer.tag(1, WireType.LengthDelimited).fork(), options).join();
		/* optional string simple_text = 2; */
		if (message.simpleText !== undefined)
			writer.tag(2, WireType.LengthDelimited).string(message.simpleText);
		let u = options.writeUnknownFields;
		if (u !== false) (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
		return writer;
	}
}
export const FormattedString = new FormattedString$Type();

class StringRun$Type extends MessageType {
	constructor() {
		super("youtube.api.innertube.StringRun", [
			{ no: 1, name: "text", kind: "scalar", T: ScalarType.STRING },
		]);
	}
	create(value) {
		const message = globalThis.Object.create(this.messagePrototype);
		message.text = "";
		if (value !== undefined) reflectionMergePartial(this, message, value);
		return message;
	}
	internalBinaryRead(reader, length, options, target) {
		let message = target ?? this.create(), end = reader.pos + length;
		while (reader.pos < end) {
			let [fieldNo, wireType] = reader.tag();
			switch (fieldNo) {
				case /* string text */ 1:
					message.text = reader.string();
					break;
				default:
					let u = options.readUnknownField;
					if (u === "throw") throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
					let d = reader.skip(wireType);
					if (u !== false) (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
			}
		}
		return message;
	}
	internalBinaryWrite(message, writer, options) {
		/* string text = 1; */
		if (message.text !== "") writer.tag(1, WireType.LengthDelimited).string(message.text);
		let u = options.writeUnknownFields;
		if (u !== false) (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
		return writer;
	}
}
export const StringRun = new StringRun$Type();
