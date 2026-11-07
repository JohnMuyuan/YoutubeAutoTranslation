import { MessageType, ScalarType, WireType, UnknownFieldHandler, reflectionMergePartial } from "@protobuf-ts/runtime";
import { InnerTubeContext } from "./PlayerRequest.js";

class BrowseRequest$Type extends MessageType {
	constructor() {
		super("youtube.api.innertube.BrowseRequest", [
			{ no: 1, name: "context", kind: "message", T: () => InnerTubeContext },
			{ no: 2, name: "browseId", kind: "scalar", opt: true, T: ScalarType.STRING },
			{ no: 3, name: "params", kind: "scalar", opt: true, T: ScalarType.STRING },
			{ no: 7, name: "continuation", kind: "scalar", opt: true, T: ScalarType.STRING },
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
				case /* optional string browse_id */ 2:
					message.browseId = reader.string();
					break;
				case /* optional string params */ 3:
					message.params = reader.string();
					break;
				case /* optional string continuation */ 7:
					message.continuation = reader.string();
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
		/* optional string browse_id = 2; */
		if (message.browseId !== undefined) writer.tag(2, WireType.LengthDelimited).string(message.browseId);
		/* optional string params = 3; */
		if (message.params !== undefined) writer.tag(3, WireType.LengthDelimited).string(message.params);
		/* optional string continuation = 7; */
		if (message.continuation !== undefined) writer.tag(7, WireType.LengthDelimited).string(message.continuation);
		let u = options.writeUnknownFields;
		if (u !== false) (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
		return writer;
	}
}
export const BrowseRequest = new BrowseRequest$Type();
