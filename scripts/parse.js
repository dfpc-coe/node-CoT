const path = require('path')
const {cot, proto} = require(path.join(__dirname, '../index.js'))

// https://github.com/deptofdefense/AndroidTacticalAssaultKit-CIV/blob/master/commoncommo/core/impl/protobuf/protocol.txt

const run = (message) => {
	if (!message) {
		console.error('Enter a TAK message')
		return
	}

	const bufferMessage = typeof message !== Buffer ? Buffer.from(message, 'hex') : message

	if (bufferMessage[0] === 191) { // TAK message format 0xbf
		console.log('TAK message received')
		const trimmedBuffer = bufferMessage.slice(3, bufferMessage.length) // remove tak message header from content
		if (bufferMessage[1] === 0) { // is COT XML
			console.log('COT XML format')
			console.log(cot.xml2js(trimmedBuffer)) // try parsing raw XML
		} else if (bufferMessage[1] === 1) { // is Protobuf
			console.log('TAK protobuf format')
			console.log(proto.proto2js(trimmedBuffer))
		}
	} else { // not TAK message format
		try {
			console.log('COT XML received')
			console.log(cot.xml2js(message)) // try parsing raw XML
		} catch (e) {
			console.error('Failed to parse message', e)
		}
	}
}

run(process.argv[2])
