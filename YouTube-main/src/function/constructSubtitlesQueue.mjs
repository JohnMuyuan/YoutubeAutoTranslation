import { Console } from "@nsnanocat/util";

/**
 * Construct Subtitles Queue
 * @author VirgilClyne
 * @param {String} fileName - Request URL
 * @param {Array} VTTs1 - Primary (Source) Language Subtitles Array
 * @param {Array} VTTs2 - Second (Target) Language Subtitles Array
 * @return {Array<*>} Subtitles Requests Queue
 */
export default function constructSubtitlesQueue(request, fileName, VTTs1 = [], VTTs2 = []) {
	Console.log("☑️ Construct Subtitles Queue", `fileName: ${fileName}`);
	const requests = [];
	Console.debug(`VTTs1.length: ${VTTs1.length}`, `VTTs2.length: ${VTTs2.length}`);
	const Index1 = VTTs1.findIndex(item => item?.includes(fileName));
	Console.debug(`Index1: ${Index1}`);
	switch (VTTs2.length) {
		case 0:
			Console.info("长度为 0");
			break;
		case 1: {
			Console.info("长度为 1");
			const request2 = {
				url: VTTs2[0],
				headers: request.headers,
			};
			requests.push(request2);
			break;
		}
		case VTTs1.length: {
			Console.info("长度相等");
			const request2 = {
				url: VTTs2[Index1],
				headers: request.headers,
			};
			requests.push(request2);
			break;
		}
		default: {
			Console.info("长度不等，需要计算");
			const Position1 = (Index1 + 1) / VTTs1.length;
			Console.debug(`Position1: ${Position1}`, `Index2: ${Index1}/${VTTs1.length}`);
			const Index2 = Math.round(Position1 * VTTs2.length - 1);
			Console.debug(`Position2: ${Position1}`, `Index2: ${Index2}/${VTTs2.length}`);
			const diffLength = Math.abs(VTTs2.length - VTTs1.length);
			const BeginIndex = Math.min(Index1, Index2);
			const EndIndex = Math.max(Index1, Index2);
			Console.debug(`diffLength: ${diffLength}`, `BeginIndex: ${BeginIndex}`, `EndIndex: ${EndIndex}`);
			const nearlyVTTs = VTTs2.slice(Math.max(0, BeginIndex - diffLength), Math.max(EndIndex, EndIndex + diffLength) + 1);
			Console.debug(`nearlyVTTs: ${JSON.stringify(nearlyVTTs)}`);
			nearlyVTTs.forEach(url => {
				const request2 = {
					url: url,
					headers: request.headers,
				};
				requests.push(request2);
			});
			break;
		}
	}
	Console.log("✅ Construct Subtitles Queue");
	return requests;
}
