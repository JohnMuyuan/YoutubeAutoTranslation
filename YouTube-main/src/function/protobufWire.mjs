const utf8Decoder = new TextDecoder("utf-8", { fatal: true });
const utf8Encoder = new TextEncoder();

function readVarint(bytes, start) {
	let value = 0n;
	let shift = 0n;
	let offset = start;
	while (offset < bytes.length && shift <= 63n) {
		const byte = bytes[offset++];
		value |= BigInt(byte & 0x7f) << shift;
		if ((byte & 0x80) === 0) return { value, offset };
		shift += 7n;
	}
	throw new Error("Invalid protobuf varint");
}

function writeVarint(input) {
	let value = BigInt(input);
	const bytes = [];
	do {
		let byte = Number(value & 0x7fn);
		value >>= 7n;
		if (value) byte |= 0x80;
		bytes.push(byte);
	} while (value);
	return Uint8Array.from(bytes);
}

function fields(bytes) {
	const result = [];
	let offset = 0;
	while (offset < bytes.length) {
		const start = offset;
		const tag = readVarint(bytes, offset);
		offset = tag.offset;
		const tagEnd = offset;
		const field = Number(tag.value >> 3n);
		const wire = Number(tag.value & 7n);
		if (!field) throw new Error("Invalid protobuf field number 0");
		let payloadStart;
		let payloadEnd;
		switch (wire) {
			case 0:
				offset = readVarint(bytes, offset).offset;
				break;
			case 1:
				offset += 8;
				break;
			case 2: {
				const length = readVarint(bytes, offset);
				payloadStart = length.offset;
				payloadEnd = payloadStart + Number(length.value);
				offset = payloadEnd;
				break;
			}
			case 5:
				offset += 4;
				break;
			default:
				throw new Error(`Unsupported protobuf wire type ${wire}`);
		}
		if (offset > bytes.length) throw new Error("Truncated protobuf field");
		result.push({ field, wire, start, end: offset, tagEnd, payloadStart, payloadEnd });
	}
	return result;
}

function tryFields(bytes) {
	try {
		return fields(bytes);
	} catch {
		return null;
	}
}

function concat(chunks) {
	const length = chunks.reduce((total, chunk) => total + chunk.length, 0);
	const output = new Uint8Array(length);
	let offset = 0;
	for (const chunk of chunks) {
		output.set(chunk, offset);
		offset += chunk.length;
	}
	return output;
}

export function extractProtobufText(bytes, path) {
	const text = [];
	function visit(message, depth) {
		for (const field of fields(message)) {
			if (field.wire !== 2 || field.field !== path[depth]) continue;
			const payload = message.subarray(field.payloadStart, field.payloadEnd);
			if (depth === path.length - 1) text.push(utf8Decoder.decode(payload));
			else visit(payload, depth + 1);
		}
	}
	visit(bytes, 0);
	return text;
}

export function replaceProtobufText(bytes, path, replacements) {
	let replacementIndex = 0;
	function visit(message, depth) {
		let changed = false;
		const chunks = [];
		for (const field of fields(message)) {
			if (field.wire !== 2 || field.field !== path[depth]) {
				chunks.push(message.subarray(field.start, field.end));
				continue;
			}
			const payload = message.subarray(field.payloadStart, field.payloadEnd);
			let nextPayload = payload;
			if (depth === path.length - 1) {
				if (replacementIndex >= replacements.length) throw new Error("Missing protobuf text replacement");
				nextPayload = utf8Encoder.encode(replacements[replacementIndex++]);
			} else {
				const nested = visit(payload, depth + 1);
				nextPayload = nested.bytes;
			}
			if (nextPayload === payload) {
				chunks.push(message.subarray(field.start, field.end));
				continue;
			}
			changed = true;
			chunks.push(message.subarray(field.start, field.tagEnd), writeVarint(nextPayload.length), nextPayload);
		}
		return { bytes: changed ? concat(chunks) : message, changed };
	}
	const result = visit(bytes, 0);
	if (replacementIndex !== replacements.length) {
		throw new Error(`Unused protobuf text replacements: ${replacements.length - replacementIndex}`);
	}
	return { body: result.bytes, count: replacementIndex };
}

export function extractProtobufTextBySuffix(bytes, suffixPath) {
	const text = [];
	const anchor = suffixPath[0];
	const innerPath = suffixPath.slice(1);
	function search(message, depth) {
		if (depth > 16) return;
		const parsed = tryFields(message);
		if (!parsed) return;
		for (const field of parsed) {
			if (field.wire !== 2) continue;
			const payload = message.subarray(field.payloadStart, field.payloadEnd);
			if (field.field === anchor) {
				try {
					text.push(...extractProtobufText(payload, innerPath));
				} catch {}
			} else if (payload.length > 2) {
				search(payload, depth + 1);
			}
		}
	}
	search(bytes, 0);
	return text;
}

export function replaceProtobufTextBySuffix(bytes, suffixPath, replacements) {
	let replacementIndex = 0;
	const anchor = suffixPath[0];
	const innerPath = suffixPath.slice(1);
	function searchReplace(message, depth) {
		if (depth > 16) return { bytes: message, changed: false };
		const parsed = tryFields(message);
		if (!parsed) return { bytes: message, changed: false };
		let changed = false;
		const chunks = [];
		for (const field of parsed) {
			if (field.wire !== 2) {
				chunks.push(message.subarray(field.start, field.end));
				continue;
			}
			const payload = message.subarray(field.payloadStart, field.payloadEnd);
			let nextPayload = payload;
			if (field.field === anchor) {
				try {
					const found = extractProtobufText(payload, innerPath);
					if (found.length > 0) {
						const slice = replacements.slice(replacementIndex, replacementIndex + found.length);
						replacementIndex += found.length;
						nextPayload = replaceProtobufText(payload, innerPath, slice).body;
					}
				} catch {}
			} else if (payload.length > 2) {
				const nested = searchReplace(payload, depth + 1);
				nextPayload = nested.bytes;
			}
			if (nextPayload === payload) {
				chunks.push(message.subarray(field.start, field.end));
				continue;
			}
			changed = true;
			chunks.push(message.subarray(field.start, field.tagEnd), writeVarint(nextPayload.length), nextPayload);
		}
		return { bytes: changed ? concat(chunks) : message, changed };
	}
	const result = searchReplace(bytes, 0);
	return { body: result.bytes, count: replacementIndex };
}
