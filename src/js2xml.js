const xmljs = require('xml-js')

exports.js2xml = (js) => {
	if (typeof js === 'undefined' || !js) {
		throw new Error('Attempted to parse empty Object')
	}

	return xmljs.js2xml(js, {compact: true})
}

// accepts an Object decoded with xml2js.decodeType(type)
exports.encodeType = (type) => {
	let result = type.atom
	if (type.descriptor) {
		result += `-${type.descriptor}`
	}
	if (type.domain) {
		result += `-${type.domain}`
	}
	if (type.milstd.length > 0) {
		result += `-${type.milstd.join('-')}`
	}
	return result
}

exports.jsDate2cot = (unix) => {
	return new Date(unix).toISOString()
}

exports.js = {
	example: {
		"event": {
			"_attributes": {
				"version": "2.0",
				"uid": "EXAMPLE",
				"type": "a-f-G-U-C",
				"how": "m-p",
				"time": "2021-02-27T20:32:24.771Z",
				"start": "2021-02-27T20:32:24.771Z",
				"stale": "2021-02-27T20:38:39.771Z"
			},
			"point": {
				"_attributes": {
					"lat": "1.234567",
					"lon": "-3.141592",
					"hae": "0.0",
					"ce": "9999999.0",
					"le": "9999999.0"
				}
			},
			"detail": {}
		}
	}
}
