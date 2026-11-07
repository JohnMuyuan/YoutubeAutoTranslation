import { MessageType, ScalarType, WireType, UnknownFieldHandler, reflectionMergePartial } from "@protobuf-ts/runtime";
import { PlayerResponse } from "./PlayerResponse.js";

class GetWatchResponse$Type extends MessageType {
	constructor() {
		super("youtube.api.innertube.GetWatchResponse", [
			{ no: 2, name: "playerResponse", kind: "message", oneof: "response", T: () => PlayerResponse },
			{ no: 4, name: "getPlayerErrorMsg", kind: "scalar", oneof: "response", T: ScalarType.STRING },
			{ no: 5, name: "getWatchNextErrorMsg", kind: "scalar", oneof: "watchNextResponse", T: ScalarType.STRING },
		]);
	}
	create(value) {
		const message = globalThis.Object.create(this.messagePrototype);
		message.response = { oneofKind: undefined };
		message.watchNextResponse = { oneofKind: undefined };
		if (value !== undefined) reflectionMergePartial(this, message, value);
		return message;
	}
	internalBinaryRead(reader, length, options, target) {
		let message = target ?? this.create(), end = reader.pos + length;
		while (reader.pos < end) {
			let [fieldNo, wireType] = reader.tag();
			switch (fieldNo) {
				case /* youtube.api.innertube.PlayerResponse player_response */ 2:
					message.playerResponse = PlayerResponse.internalBinaryRead(reader, reader.uint32(), options, message.playerResponse);
					break;
				case /* string get_player_error_msg */ 4:
					message.getPlayerErrorMsg = reader.string();
					break;
				case /* string get_watch_next_error_msg */ 5:
					message.getWatchNextErrorMsg = reader.string();
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
		/* youtube.api.innertube.PlayerResponse player_response = 2; */
		if (message.playerResponse)
			PlayerResponse.internalBinaryWrite(message.playerResponse, writer.tag(2, WireType.LengthDelimited).fork(), options).join();
		/* string get_player_error_msg = 4; */
		if (message.getPlayerErrorMsg !== undefined)
			writer.tag(4, WireType.LengthDelimited).string(message.getPlayerErrorMsg);
		/* string get_watch_next_error_msg = 5; */
		if (message.getWatchNextErrorMsg !== undefined)
			writer.tag(5, WireType.LengthDelimited).string(message.getWatchNextErrorMsg);
		let u = options.writeUnknownFields;
		if (u !== false) (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
		return writer;
	}
}
export const GetWatchResponse = new GetWatchResponse$Type();
