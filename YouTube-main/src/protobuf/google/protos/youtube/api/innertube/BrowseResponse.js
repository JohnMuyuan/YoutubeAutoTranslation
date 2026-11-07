import { MessageType, ScalarType, WireType, UnknownFieldHandler, reflectionMergePartial } from "@protobuf-ts/runtime";
import { FormattedString, StringRun } from "./PlayerResponse.js";

class BrowseResponse$Type extends MessageType {
	constructor() {
		super("youtube.api.innertube.BrowseResponse", [
			{ no: 1, name: "responseContext", kind: "message", T: () => ResponseContext },
			{ no: 9, name: "contents", kind: "message", T: () => BrowseResponseSupportedRenderers },
			{ no: 10, name: "continuationContents", kind: "message", T: () => ContinuationSupportedRenderers },
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
				case /* youtube.api.innertube.ResponseContext response_context */ 1:
					message.responseContext = ResponseContext.internalBinaryRead(reader, reader.uint32(), options, message.responseContext);
					break;
				case /* youtube.api.innertube.BrowseResponseSupportedRenderers contents */ 9:
					message.contents = BrowseResponseSupportedRenderers.internalBinaryRead(reader, reader.uint32(), options, message.contents);
					break;
				case /* youtube.api.innertube.ContinuationSupportedRenderers continuation_contents */ 10:
					message.continuationContents = ContinuationSupportedRenderers.internalBinaryRead(reader, reader.uint32(), options, message.continuationContents);
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
		if (message.responseContext)
			ResponseContext.internalBinaryWrite(message.responseContext, writer.tag(1, WireType.LengthDelimited).fork(), options).join();
		if (message.contents)
			BrowseResponseSupportedRenderers.internalBinaryWrite(message.contents, writer.tag(9, WireType.LengthDelimited).fork(), options).join();
		if (message.continuationContents)
			ContinuationSupportedRenderers.internalBinaryWrite(message.continuationContents, writer.tag(10, WireType.LengthDelimited).fork(), options).join();
		let u = options.writeUnknownFields;
		if (u !== false) (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
		return writer;
	}
}
export const BrowseResponse = new BrowseResponse$Type();

class ResponseContext$Type extends MessageType {
	constructor() {
		super("youtube.api.innertube.ResponseContext", [
			{ no: 6, name: "serviceTrackingParams", kind: "message", repeat: 1, T: () => ServiceTrackingParams },
		]);
	}
	create(value) {
		const message = globalThis.Object.create(this.messagePrototype);
		message.serviceTrackingParams = [];
		if (value !== undefined) reflectionMergePartial(this, message, value);
		return message;
	}
	internalBinaryRead(reader, length, options, target) {
		let message = target ?? this.create(), end = reader.pos + length;
		while (reader.pos < end) {
			let [fieldNo, wireType] = reader.tag();
			switch (fieldNo) {
				case /* repeated youtube.api.innertube.ServiceTrackingParams service_tracking_params */ 6:
					message.serviceTrackingParams.push(ServiceTrackingParams.internalBinaryRead(reader, reader.uint32(), options));
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
		for (let i = 0; i < message.serviceTrackingParams.length; i++)
			ServiceTrackingParams.internalBinaryWrite(message.serviceTrackingParams[i], writer.tag(6, WireType.LengthDelimited).fork(), options).join();
		let u = options.writeUnknownFields;
		if (u !== false) (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
		return writer;
	}
}
export const ResponseContext = new ResponseContext$Type();

class ServiceTrackingParams$Type extends MessageType {
	constructor() {
		super("youtube.api.innertube.ServiceTrackingParams", [
			{ no: 1, name: "service", kind: "scalar", opt: true, T: ScalarType.INT32 },
			{ no: 2, name: "params", kind: "message", repeat: 1, T: () => KeyValuePair },
		]);
	}
	create(value) {
		const message = globalThis.Object.create(this.messagePrototype);
		message.params = [];
		if (value !== undefined) reflectionMergePartial(this, message, value);
		return message;
	}
	internalBinaryRead(reader, length, options, target) {
		let message = target ?? this.create(), end = reader.pos + length;
		while (reader.pos < end) {
			let [fieldNo, wireType] = reader.tag();
			switch (fieldNo) {
				case 1:
					message.service = reader.int32();
					break;
				case 2:
					message.params.push(KeyValuePair.internalBinaryRead(reader, reader.uint32(), options));
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
		if (message.service !== undefined) writer.tag(1, WireType.Varint).int32(message.service);
		for (let i = 0; i < message.params.length; i++)
			KeyValuePair.internalBinaryWrite(message.params[i], writer.tag(2, WireType.LengthDelimited).fork(), options).join();
		let u = options.writeUnknownFields;
		if (u !== false) (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
		return writer;
	}
}
export const ServiceTrackingParams = new ServiceTrackingParams$Type();

class KeyValuePair$Type extends MessageType {
	constructor() {
		super("youtube.api.innertube.KeyValuePair", [
			{ no: 1, name: "key", kind: "scalar", opt: true, T: ScalarType.STRING },
			{ no: 2, name: "value", kind: "scalar", opt: true, T: ScalarType.STRING },
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
				case 1:
					message.key = reader.string();
					break;
				case 2:
					message.value = reader.string();
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
		if (message.key !== undefined) writer.tag(1, WireType.LengthDelimited).string(message.key);
		if (message.value !== undefined) writer.tag(2, WireType.LengthDelimited).string(message.value);
		let u = options.writeUnknownFields;
		if (u !== false) (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
		return writer;
	}
}
export const KeyValuePair = new KeyValuePair$Type();

class BrowseResponseSupportedRenderers$Type extends MessageType {
	constructor() {
		super("youtube.api.innertube.BrowseResponseSupportedRenderers", [
			{ no: 49399797, name: "sectionListRenderer", kind: "message", T: () => SectionListRenderer },
			{ no: 58173949, name: "singleColumnBrowseResultsRenderer", kind: "message", T: () => SingleColumnBrowseResultsRenderer },
			{ no: 153515154, name: "elementRenderer", kind: "message", T: () => ElementRenderer },
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
				case 49399797:
					message.sectionListRenderer = SectionListRenderer.internalBinaryRead(reader, reader.uint32(), options, message.sectionListRenderer);
					break;
				case 58173949:
					message.singleColumnBrowseResultsRenderer = SingleColumnBrowseResultsRenderer.internalBinaryRead(reader, reader.uint32(), options, message.singleColumnBrowseResultsRenderer);
					break;
				case 153515154:
					message.elementRenderer = ElementRenderer.internalBinaryRead(reader, reader.uint32(), options, message.elementRenderer);
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
		if (message.sectionListRenderer)
			SectionListRenderer.internalBinaryWrite(message.sectionListRenderer, writer.tag(49399797, WireType.LengthDelimited).fork(), options).join();
		if (message.singleColumnBrowseResultsRenderer)
			SingleColumnBrowseResultsRenderer.internalBinaryWrite(message.singleColumnBrowseResultsRenderer, writer.tag(58173949, WireType.LengthDelimited).fork(), options).join();
		if (message.elementRenderer)
			ElementRenderer.internalBinaryWrite(message.elementRenderer, writer.tag(153515154, WireType.LengthDelimited).fork(), options).join();
		let u = options.writeUnknownFields;
		if (u !== false) (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
		return writer;
	}
}
export const BrowseResponseSupportedRenderers = new BrowseResponseSupportedRenderers$Type();

class ContinuationSupportedRenderers$Type extends MessageType {
	constructor() {
		super("youtube.api.innertube.ContinuationSupportedRenderers", [
			{ no: 49399797, name: "sectionListContinuation", kind: "message", T: () => SectionListRenderer },
			{ no: 221496734, name: "musicDescriptionShelfRenderer", kind: "message", T: () => MusicDescriptionShelfRenderer },
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
				case 49399797:
					message.sectionListContinuation = SectionListRenderer.internalBinaryRead(reader, reader.uint32(), options, message.sectionListContinuation);
					break;
				case 221496734:
					message.musicDescriptionShelfRenderer = MusicDescriptionShelfRenderer.internalBinaryRead(reader, reader.uint32(), options, message.musicDescriptionShelfRenderer);
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
		if (message.sectionListContinuation)
			SectionListRenderer.internalBinaryWrite(message.sectionListContinuation, writer.tag(49399797, WireType.LengthDelimited).fork(), options).join();
		if (message.musicDescriptionShelfRenderer)
			MusicDescriptionShelfRenderer.internalBinaryWrite(message.musicDescriptionShelfRenderer, writer.tag(221496734, WireType.LengthDelimited).fork(), options).join();
		let u = options.writeUnknownFields;
		if (u !== false) (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
		return writer;
	}
}
export const ContinuationSupportedRenderers = new ContinuationSupportedRenderers$Type();

class SingleColumnBrowseResultsRenderer$Type extends MessageType {
	constructor() {
		super("youtube.api.innertube.SingleColumnBrowseResultsRenderer", [
			{ no: 1, name: "tabs", kind: "message", repeat: 1, T: () => BrowseTabSupportedRenderers },
		]);
	}
	create(value) {
		const message = globalThis.Object.create(this.messagePrototype);
		message.tabs = [];
		if (value !== undefined) reflectionMergePartial(this, message, value);
		return message;
	}
	internalBinaryRead(reader, length, options, target) {
		let message = target ?? this.create(), end = reader.pos + length;
		while (reader.pos < end) {
			let [fieldNo, wireType] = reader.tag();
			switch (fieldNo) {
				case 1:
					message.tabs.push(BrowseTabSupportedRenderers.internalBinaryRead(reader, reader.uint32(), options));
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
		for (let i = 0; i < message.tabs.length; i++)
			BrowseTabSupportedRenderers.internalBinaryWrite(message.tabs[i], writer.tag(1, WireType.LengthDelimited).fork(), options).join();
		let u = options.writeUnknownFields;
		if (u !== false) (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
		return writer;
	}
}
export const SingleColumnBrowseResultsRenderer = new SingleColumnBrowseResultsRenderer$Type();

class BrowseTabSupportedRenderers$Type extends MessageType {
	constructor() {
		super("youtube.api.innertube.BrowseTabSupportedRenderers", [
			{ no: 58174010, name: "tabRenderer", kind: "message", T: () => TabRenderer },
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
				case 58174010:
					message.tabRenderer = TabRenderer.internalBinaryRead(reader, reader.uint32(), options, message.tabRenderer);
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
		if (message.tabRenderer)
			TabRenderer.internalBinaryWrite(message.tabRenderer, writer.tag(58174010, WireType.LengthDelimited).fork(), options).join();
		let u = options.writeUnknownFields;
		if (u !== false) (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
		return writer;
	}
}
export const BrowseTabSupportedRenderers = new BrowseTabSupportedRenderers$Type();

class TabRenderer$Type extends MessageType {
	constructor() {
		super("youtube.api.innertube.TabRenderer", [
			{ no: 4, name: "content", kind: "message", T: () => TabRendererContent },
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
				case 4:
					message.content = TabRendererContent.internalBinaryRead(reader, reader.uint32(), options, message.content);
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
		if (message.content)
			TabRendererContent.internalBinaryWrite(message.content, writer.tag(4, WireType.LengthDelimited).fork(), options).join();
		let u = options.writeUnknownFields;
		if (u !== false) (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
		return writer;
	}
}
export const TabRenderer = new TabRenderer$Type();

class TabRendererContent$Type extends MessageType {
	constructor() {
		super("youtube.api.innertube.TabRendererContent", [
			{ no: 49399797, name: "sectionListRenderer", kind: "message", T: () => SectionListRenderer },
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
				case 49399797:
					message.sectionListRenderer = SectionListRenderer.internalBinaryRead(reader, reader.uint32(), options, message.sectionListRenderer);
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
		if (message.sectionListRenderer)
			SectionListRenderer.internalBinaryWrite(message.sectionListRenderer, writer.tag(49399797, WireType.LengthDelimited).fork(), options).join();
		let u = options.writeUnknownFields;
		if (u !== false) (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
		return writer;
	}
}
export const TabRendererContent = new TabRendererContent$Type();

class SectionListRenderer$Type extends MessageType {
	constructor() {
		super("youtube.api.innertube.SectionListRenderer", [
			{ no: 1, name: "contents", kind: "message", repeat: 1, T: () => SectionListSupportedRenderers },
		]);
	}
	create(value) {
		const message = globalThis.Object.create(this.messagePrototype);
		message.contents = [];
		if (value !== undefined) reflectionMergePartial(this, message, value);
		return message;
	}
	internalBinaryRead(reader, length, options, target) {
		let message = target ?? this.create(), end = reader.pos + length;
		while (reader.pos < end) {
			let [fieldNo, wireType] = reader.tag();
			switch (fieldNo) {
				case 1:
					message.contents.push(SectionListSupportedRenderers.internalBinaryRead(reader, reader.uint32(), options));
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
		for (let i = 0; i < message.contents.length; i++)
			SectionListSupportedRenderers.internalBinaryWrite(message.contents[i], writer.tag(1, WireType.LengthDelimited).fork(), options).join();
		let u = options.writeUnknownFields;
		if (u !== false) (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
		return writer;
	}
}
export const SectionListRenderer = new SectionListRenderer$Type();

class SectionListSupportedRenderers$Type extends MessageType {
	constructor() {
		super("youtube.api.innertube.SectionListSupportedRenderers", [
			{ no: 50195462, name: "itemSectionRenderer", kind: "message", T: () => ItemSectionRenderer },
			{ no: 153515154, name: "elementRenderer", kind: "message", T: () => ElementRenderer },
			{ no: 221496734, name: "musicDescriptionShelfRenderer", kind: "message", T: () => MusicDescriptionShelfRenderer },
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
				case 50195462:
					message.itemSectionRenderer = ItemSectionRenderer.internalBinaryRead(reader, reader.uint32(), options, message.itemSectionRenderer);
					break;
				case 153515154:
					message.elementRenderer = ElementRenderer.internalBinaryRead(reader, reader.uint32(), options, message.elementRenderer);
					break;
				case 221496734:
					message.musicDescriptionShelfRenderer = MusicDescriptionShelfRenderer.internalBinaryRead(reader, reader.uint32(), options, message.musicDescriptionShelfRenderer);
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
		if (message.itemSectionRenderer)
			ItemSectionRenderer.internalBinaryWrite(message.itemSectionRenderer, writer.tag(50195462, WireType.LengthDelimited).fork(), options).join();
		if (message.elementRenderer)
			ElementRenderer.internalBinaryWrite(message.elementRenderer, writer.tag(153515154, WireType.LengthDelimited).fork(), options).join();
		if (message.musicDescriptionShelfRenderer)
			MusicDescriptionShelfRenderer.internalBinaryWrite(message.musicDescriptionShelfRenderer, writer.tag(221496734, WireType.LengthDelimited).fork(), options).join();
		let u = options.writeUnknownFields;
		if (u !== false) (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
		return writer;
	}
}
export const SectionListSupportedRenderers = new SectionListSupportedRenderers$Type();

class ItemSectionRenderer$Type extends MessageType {
	constructor() {
		super("youtube.api.innertube.ItemSectionRenderer", [
			{ no: 1, name: "contents", kind: "message", repeat: 1, T: () => ItemSectionSupportedRenderers },
		]);
	}
	create(value) {
		const message = globalThis.Object.create(this.messagePrototype);
		message.contents = [];
		if (value !== undefined) reflectionMergePartial(this, message, value);
		return message;
	}
	internalBinaryRead(reader, length, options, target) {
		let message = target ?? this.create(), end = reader.pos + length;
		while (reader.pos < end) {
			let [fieldNo, wireType] = reader.tag();
			switch (fieldNo) {
				case 1:
					message.contents.push(ItemSectionSupportedRenderers.internalBinaryRead(reader, reader.uint32(), options));
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
		for (let i = 0; i < message.contents.length; i++)
			ItemSectionSupportedRenderers.internalBinaryWrite(message.contents[i], writer.tag(1, WireType.LengthDelimited).fork(), options).join();
		let u = options.writeUnknownFields;
		if (u !== false) (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
		return writer;
	}
}
export const ItemSectionRenderer = new ItemSectionRenderer$Type();

class ItemSectionSupportedRenderers$Type extends MessageType {
	constructor() {
		super("youtube.api.innertube.ItemSectionSupportedRenderers", [
			{ no: 153515154, name: "elementRenderer", kind: "message", T: () => ElementRenderer },
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
				case 153515154:
					message.elementRenderer = ElementRenderer.internalBinaryRead(reader, reader.uint32(), options, message.elementRenderer);
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
		if (message.elementRenderer)
			ElementRenderer.internalBinaryWrite(message.elementRenderer, writer.tag(153515154, WireType.LengthDelimited).fork(), options).join();
		let u = options.writeUnknownFields;
		if (u !== false) (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
		return writer;
	}
}
export const ItemSectionSupportedRenderers = new ItemSectionSupportedRenderers$Type();

class ElementRenderer$Type extends MessageType {
	constructor() {
		super("youtube.api.innertube.ElementRenderer", [
			{ no: 172660663, name: "newElement", kind: "message", T: () => NewElement },
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
				case 172660663:
					message.newElement = NewElement.internalBinaryRead(reader, reader.uint32(), options, message.newElement);
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
		if (message.newElement)
			NewElement.internalBinaryWrite(message.newElement, writer.tag(172660663, WireType.LengthDelimited).fork(), options).join();
		let u = options.writeUnknownFields;
		if (u !== false) (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
		return writer;
	}
}
export const ElementRenderer = new ElementRenderer$Type();

class NewElement$Type extends MessageType {
	constructor() {
		super("youtube.api.innertube.NewElement", [
			{ no: 1, name: "type", kind: "message", T: () => ElementType },
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
				case 1:
					message.type = ElementType.internalBinaryRead(reader, reader.uint32(), options, message.type);
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
		if (message.type)
			ElementType.internalBinaryWrite(message.type, writer.tag(1, WireType.LengthDelimited).fork(), options).join();
		let u = options.writeUnknownFields;
		if (u !== false) (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
		return writer;
	}
}
export const NewElement = new NewElement$Type();

class ElementType$Type extends MessageType {
	constructor() {
		super("youtube.api.innertube.ElementType", [
			{ no: 168777401, name: "model", kind: "message", T: () => Model },
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
				case 168777401:
					message.model = Model.internalBinaryRead(reader, reader.uint32(), options, message.model);
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
		if (message.model)
			Model.internalBinaryWrite(message.model, writer.tag(168777401, WireType.LengthDelimited).fork(), options).join();
		let u = options.writeUnknownFields;
		if (u !== false) (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
		return writer;
	}
}
export const ElementType = new ElementType$Type();

class Model$Type extends MessageType {
	constructor() {
		super("youtube.api.innertube.Model", [
			{ no: 4, name: "n4F168777401", kind: "message", T: () => N4F168777401 },
			{ no: 5, name: "videoContent", kind: "message", T: () => VideoContent },
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
				case 4:
					message.n4F168777401 = N4F168777401.internalBinaryRead(reader, reader.uint32(), options, message.n4F168777401);
					break;
				case 5:
					message.videoContent = VideoContent.internalBinaryRead(reader, reader.uint32(), options, message.videoContent);
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
		if (message.n4F168777401)
			N4F168777401.internalBinaryWrite(message.n4F168777401, writer.tag(4, WireType.LengthDelimited).fork(), options).join();
		if (message.videoContent)
			VideoContent.internalBinaryWrite(message.videoContent, writer.tag(5, WireType.LengthDelimited).fork(), options).join();
		let u = options.writeUnknownFields;
		if (u !== false) (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
		return writer;
	}
}
export const Model = new Model$Type();

class N4F168777401$Type extends MessageType {
	constructor() {
		super("youtube.api.innertube.N4F168777401", [
			{ no: 465100242, name: "n1F465100242", kind: "message", T: () => N1F465100242 },
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
				case 465100242:
					message.n1F465100242 = N1F465100242.internalBinaryRead(reader, reader.uint32(), options, message.n1F465100242);
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
		if (message.n1F465100242)
			N1F465100242.internalBinaryWrite(message.n1F465100242, writer.tag(465100242, WireType.LengthDelimited).fork(), options).join();
		let u = options.writeUnknownFields;
		if (u !== false) (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
		return writer;
	}
}
export const N4F168777401 = new N4F168777401$Type();

class N1F465100242$Type extends MessageType {
	constructor() {
		super("youtube.api.innertube.N1F465100242", [
			{ no: 1, name: "timedLyricsModel", kind: "message", T: () => TimedLyricsModel },
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
				case 1:
					message.timedLyricsModel = TimedLyricsModel.internalBinaryRead(reader, reader.uint32(), options, message.timedLyricsModel);
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
		if (message.timedLyricsModel)
			TimedLyricsModel.internalBinaryWrite(message.timedLyricsModel, writer.tag(1, WireType.LengthDelimited).fork(), options).join();
		let u = options.writeUnknownFields;
		if (u !== false) (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
		return writer;
	}
}
export const N1F465100242 = new N1F465100242$Type();

class TimedLyricsModel$Type extends MessageType {
	constructor() {
		super("youtube.api.innertube.TimedLyricsModel", [
			{ no: 1, name: "lyricsData", kind: "message", T: () => LyricsData },
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
				case 1:
					message.lyricsData = LyricsData.internalBinaryRead(reader, reader.uint32(), options, message.lyricsData);
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
		if (message.lyricsData)
			LyricsData.internalBinaryWrite(message.lyricsData, writer.tag(1, WireType.LengthDelimited).fork(), options).join();
		let u = options.writeUnknownFields;
		if (u !== false) (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
		return writer;
	}
}
export const TimedLyricsModel = new TimedLyricsModel$Type();

class LyricsData$Type extends MessageType {
	constructor() {
		super("youtube.api.innertube.LyricsData", [
			{ no: 1, name: "timedLyricsData", kind: "message", repeat: 1, T: () => TimedLyricsData },
			{ no: 2, name: "sourceMessage", kind: "scalar", opt: true, T: ScalarType.STRING },
		]);
	}
	create(value) {
		const message = globalThis.Object.create(this.messagePrototype);
		message.timedLyricsData = [];
		if (value !== undefined) reflectionMergePartial(this, message, value);
		return message;
	}
	internalBinaryRead(reader, length, options, target) {
		let message = target ?? this.create(), end = reader.pos + length;
		while (reader.pos < end) {
			let [fieldNo, wireType] = reader.tag();
			switch (fieldNo) {
				case 1:
					message.timedLyricsData.push(TimedLyricsData.internalBinaryRead(reader, reader.uint32(), options));
					break;
				case 2:
					message.sourceMessage = reader.string();
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
		for (let i = 0; i < message.timedLyricsData.length; i++)
			TimedLyricsData.internalBinaryWrite(message.timedLyricsData[i], writer.tag(1, WireType.LengthDelimited).fork(), options).join();
		if (message.sourceMessage !== undefined)
			writer.tag(2, WireType.LengthDelimited).string(message.sourceMessage);
		let u = options.writeUnknownFields;
		if (u !== false) (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
		return writer;
	}
}
export const LyricsData = new LyricsData$Type();

class TimedLyricsData$Type extends MessageType {
	constructor() {
		super("youtube.api.innertube.TimedLyricsData", [
			{ no: 1, name: "lyricLine", kind: "scalar", opt: true, T: ScalarType.STRING },
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
				case 1:
					message.lyricLine = reader.string();
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
		if (message.lyricLine !== undefined)
			writer.tag(1, WireType.LengthDelimited).string(message.lyricLine);
		let u = options.writeUnknownFields;
		if (u !== false) (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
		return writer;
	}
}
export const TimedLyricsData = new TimedLyricsData$Type();

class VideoContent$Type extends MessageType {
	constructor() {
		super("youtube.api.innertube.VideoContent", [
			{ no: 465160965, name: "timedLyricsRender", kind: "message", T: () => TimedLyricsRender },
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
				case 465160965:
					message.timedLyricsRender = TimedLyricsRender.internalBinaryRead(reader, reader.uint32(), options, message.timedLyricsRender);
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
		if (message.timedLyricsRender)
			TimedLyricsRender.internalBinaryWrite(message.timedLyricsRender, writer.tag(465160965, WireType.LengthDelimited).fork(), options).join();
		let u = options.writeUnknownFields;
		if (u !== false) (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
		return writer;
	}
}
export const VideoContent = new VideoContent$Type();

class TimedLyricsRender$Type extends MessageType {
	constructor() {
		super("youtube.api.innertube.TimedLyricsRender", [
			{ no: 4, name: "timedLyricsContent", kind: "message", T: () => TimedLyricsContent },
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
				case 4:
					message.timedLyricsContent = TimedLyricsContent.internalBinaryRead(reader, reader.uint32(), options, message.timedLyricsContent);
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
		if (message.timedLyricsContent)
			TimedLyricsContent.internalBinaryWrite(message.timedLyricsContent, writer.tag(4, WireType.LengthDelimited).fork(), options).join();
		let u = options.writeUnknownFields;
		if (u !== false) (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
		return writer;
	}
}
export const TimedLyricsRender = new TimedLyricsRender$Type();

class TimedLyricsContent$Type extends MessageType {
	constructor() {
		super("youtube.api.innertube.TimedLyricsContent", [
			{ no: 1, name: "runs", kind: "message", repeat: 1, T: () => StringRun },
			{ no: 2, name: "footerLabel", kind: "scalar", opt: true, T: ScalarType.STRING },
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
				case 1:
					message.runs.push(StringRun.internalBinaryRead(reader, reader.uint32(), options));
					break;
				case 2:
					message.footerLabel = reader.string();
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
		for (let i = 0; i < message.runs.length; i++)
			StringRun.internalBinaryWrite(message.runs[i], writer.tag(1, WireType.LengthDelimited).fork(), options).join();
		if (message.footerLabel !== undefined)
			writer.tag(2, WireType.LengthDelimited).string(message.footerLabel);
		let u = options.writeUnknownFields;
		if (u !== false) (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
		return writer;
	}
}
export const TimedLyricsContent = new TimedLyricsContent$Type();

class MusicDescriptionShelfRenderer$Type extends MessageType {
	constructor() {
		super("youtube.api.innertube.MusicDescriptionShelfRenderer", [
			{ no: 3, name: "description", kind: "message", T: () => FormattedString },
			{ no: 10, name: "footer", kind: "message", T: () => FormattedString },
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
				case 3:
					message.description = FormattedString.internalBinaryRead(reader, reader.uint32(), options, message.description);
					break;
				case 10:
					message.footer = FormattedString.internalBinaryRead(reader, reader.uint32(), options, message.footer);
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
		if (message.description)
			FormattedString.internalBinaryWrite(message.description, writer.tag(3, WireType.LengthDelimited).fork(), options).join();
		if (message.footer)
			FormattedString.internalBinaryWrite(message.footer, writer.tag(10, WireType.LengthDelimited).fork(), options).join();
		let u = options.writeUnknownFields;
		if (u !== false) (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
		return writer;
	}
}
export const MusicDescriptionShelfRenderer = new MusicDescriptionShelfRenderer$Type();
