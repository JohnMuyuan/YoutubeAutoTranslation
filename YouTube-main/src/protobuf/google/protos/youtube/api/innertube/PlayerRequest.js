import { MessageType, ScalarType, WireType, UnknownFieldHandler, reflectionMergePartial } from "@protobuf-ts/runtime";

class InnerTubeContext$Type extends MessageType {
	constructor() {
		super("youtube.api.innertube.InnerTubeContext", [
			{ no: 1, name: "client", kind: "message", T: () => ClientInfo },
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
				case /* youtube.api.innertube.ClientInfo client */ 1:
					message.client = ClientInfo.internalBinaryRead(reader, reader.uint32(), options, message.client);
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
		/* youtube.api.innertube.ClientInfo client = 1; */
		if (message.client)
			ClientInfo.internalBinaryWrite(message.client, writer.tag(1, WireType.LengthDelimited).fork(), options).join();
		let u = options.writeUnknownFields;
		if (u !== false) (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
		return writer;
	}
}
export const InnerTubeContext = new InnerTubeContext$Type();

class ClientInfo$Type extends MessageType {
	constructor() {
		super("youtube.api.innertube.ClientInfo", [
			{ no: 1, name: "hl", kind: "scalar", opt: true, T: ScalarType.STRING },
			{ no: 2, name: "gl", kind: "scalar", opt: true, T: ScalarType.STRING },
			{ no: 12, name: "deviceMake", kind: "scalar", opt: true, T: ScalarType.STRING },
			{ no: 13, name: "deviceModel", kind: "scalar", opt: true, T: ScalarType.STRING },
			{ no: 16, name: "clientName", kind: "scalar", opt: true, T: ScalarType.INT32 },
			{ no: 17, name: "clientVersion", kind: "scalar", opt: true, T: ScalarType.STRING },
			{ no: 18, name: "osName", kind: "scalar", opt: true, T: ScalarType.STRING },
			{ no: 19, name: "osVersion", kind: "scalar", opt: true, T: ScalarType.STRING },
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
				case /* optional string hl */ 1:
					message.hl = reader.string();
					break;
				case /* optional string gl */ 2:
					message.gl = reader.string();
					break;
				case /* optional string device_make */ 12:
					message.deviceMake = reader.string();
					break;
				case /* optional string device_model */ 13:
					message.deviceModel = reader.string();
					break;
				case /* optional int32 client_name */ 16:
					message.clientName = reader.int32();
					break;
				case /* optional string client_version */ 17:
					message.clientVersion = reader.string();
					break;
				case /* optional string os_name */ 18:
					message.osName = reader.string();
					break;
				case /* optional string os_version */ 19:
					message.osVersion = reader.string();
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
		/* optional string hl = 1; */
		if (message.hl !== undefined) writer.tag(1, WireType.LengthDelimited).string(message.hl);
		/* optional string gl = 2; */
		if (message.gl !== undefined) writer.tag(2, WireType.LengthDelimited).string(message.gl);
		/* optional string device_make = 12; */
		if (message.deviceMake !== undefined) writer.tag(12, WireType.LengthDelimited).string(message.deviceMake);
		/* optional string device_model = 13; */
		if (message.deviceModel !== undefined) writer.tag(13, WireType.LengthDelimited).string(message.deviceModel);
		/* optional int32 client_name = 16; */
		if (message.clientName !== undefined) writer.tag(16, WireType.Varint).int32(message.clientName);
		/* optional string client_version = 17; */
		if (message.clientVersion !== undefined) writer.tag(17, WireType.LengthDelimited).string(message.clientVersion);
		/* optional string os_name = 18; */
		if (message.osName !== undefined) writer.tag(18, WireType.LengthDelimited).string(message.osName);
		/* optional string os_version = 19; */
		if (message.osVersion !== undefined) writer.tag(19, WireType.LengthDelimited).string(message.osVersion);
		let u = options.writeUnknownFields;
		if (u !== false) (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
		return writer;
	}
}
export const ClientInfo = new ClientInfo$Type();

class PlayerRequest$Type extends MessageType {
	constructor() {
		super("youtube.api.innertube.PlayerRequest", [
			{ no: 1, name: "context", kind: "message", T: () => InnerTubeContext },
			{ no: 2, name: "videoId", kind: "scalar", opt: true, T: ScalarType.STRING },
			{ no: 3, name: "contentCheckOk", kind: "scalar", opt: true, T: ScalarType.BOOL },
			{ no: 4, name: "playbackContext", kind: "message", T: () => PlaybackContext },
			{ no: 5, name: "racyCheckOk", kind: "scalar", opt: true, T: ScalarType.BOOL },
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
				case /* youtube.api.innertube.InnerTubeContext context */ 1:
					message.context = InnerTubeContext.internalBinaryRead(reader, reader.uint32(), options, message.context);
					break;
				case /* optional string video_id */ 2:
					message.videoId = reader.string();
					break;
				case /* optional bool content_check_ok */ 3:
					message.contentCheckOk = reader.bool();
					break;
				case /* youtube.api.innertube.PlaybackContext playback_context */ 4:
					message.playbackContext = PlaybackContext.internalBinaryRead(reader, reader.uint32(), options, message.playbackContext);
					break;
				case /* optional bool racy_check_ok */ 5:
					message.racyCheckOk = reader.bool();
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
		/* youtube.api.innertube.InnerTubeContext context = 1; */
		if (message.context)
			InnerTubeContext.internalBinaryWrite(message.context, writer.tag(1, WireType.LengthDelimited).fork(), options).join();
		/* optional string video_id = 2; */
		if (message.videoId !== undefined) writer.tag(2, WireType.LengthDelimited).string(message.videoId);
		/* optional bool content_check_ok = 3; */
		if (message.contentCheckOk !== undefined) writer.tag(3, WireType.Varint).bool(message.contentCheckOk);
		/* youtube.api.innertube.PlaybackContext playback_context = 4; */
		if (message.playbackContext)
			PlaybackContext.internalBinaryWrite(message.playbackContext, writer.tag(4, WireType.LengthDelimited).fork(), options).join();
		/* optional bool racy_check_ok = 5; */
		if (message.racyCheckOk !== undefined) writer.tag(5, WireType.Varint).bool(message.racyCheckOk);
		let u = options.writeUnknownFields;
		if (u !== false) (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
		return writer;
	}
}
export const PlayerRequest = new PlayerRequest$Type();

class PlaybackContext$Type extends MessageType {
	constructor() {
		super("youtube.api.innertube.PlaybackContext", [
			{ no: 1, name: "contentPlaybackContext", kind: "message", T: () => ContentPlaybackContext },
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
				case /* youtube.api.innertube.ContentPlaybackContext content_playback_context */ 1:
					message.contentPlaybackContext = ContentPlaybackContext.internalBinaryRead(reader, reader.uint32(), options, message.contentPlaybackContext);
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
		/* youtube.api.innertube.ContentPlaybackContext content_playback_context = 1; */
		if (message.contentPlaybackContext)
			ContentPlaybackContext.internalBinaryWrite(message.contentPlaybackContext, writer.tag(1, WireType.LengthDelimited).fork(), options).join();
		let u = options.writeUnknownFields;
		if (u !== false) (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
		return writer;
	}
}
export const PlaybackContext = new PlaybackContext$Type();

class ContentPlaybackContext$Type extends MessageType {
	constructor() {
		super("youtube.api.innertube.ContentPlaybackContext", [
			{ no: 4, name: "id4", kind: "scalar", opt: true, T: ScalarType.INT32 },
			{ no: 6, name: "id6", kind: "scalar", opt: true, T: ScalarType.INT32 },
			{ no: 8, name: "id8", kind: "scalar", opt: true, T: ScalarType.INT32 },
			{ no: 9, name: "id9", kind: "scalar", opt: true, T: ScalarType.INT32 },
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
				case /* optional int32 id4 */ 4:
					message.id4 = reader.int32();
					break;
				case /* optional int32 id6 */ 6:
					message.id6 = reader.int32();
					break;
				case /* optional int32 id8 */ 8:
					message.id8 = reader.int32();
					break;
				case /* optional int32 id9 */ 9:
					message.id9 = reader.int32();
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
		/* optional int32 id4 = 4; */
		if (message.id4 !== undefined) writer.tag(4, WireType.Varint).int32(message.id4);
		/* optional int32 id6 = 6; */
		if (message.id6 !== undefined) writer.tag(6, WireType.Varint).int32(message.id6);
		/* optional int32 id8 = 8; */
		if (message.id8 !== undefined) writer.tag(8, WireType.Varint).int32(message.id8);
		/* optional int32 id9 = 9; */
		if (message.id9 !== undefined) writer.tag(9, WireType.Varint).int32(message.id9);
		let u = options.writeUnknownFields;
		if (u !== false) (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
		return writer;
	}
}
export const ContentPlaybackContext = new ContentPlaybackContext$Type();
