const path = require('path')
const {cot, proto} = require(path.join(__dirname, '../index.js'))

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
			console.error('Enter a TAK proto message')
		} else if (bufferMessage[1] === 1) { // is Protobuf
			console.log('TAK protobuf format')
			const protoMessage = proto.proto2js(trimmedBuffer)
			const cotMessage = proto.protojs2cotjs(protoMessage)
			console.log(cotMessage)
			console.log(cot.js2xml(cotMessage))
		}
	} else { // not TAK message format
		console.error('Enter a TAK proto message')
	}
}

run(process.argv[2])
