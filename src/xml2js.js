const xmljs = require('xml-js')

exports.xml2js = (cot) => {
	if (typeof cot === 'undefined' || cot === null) {
		throw new Error('Attempted to parse empty COT message')
	}

	if (typeof cot === 'object') { // accept a data buffer or string for conversion
		cot = cot.toString()
	}

	return xmljs.xml2js(cot, {compact: true})
}

// accepts a string formatted like 'a-f-G-U-C-I'
exports.decodeType = (type) => {
	const split = type.split('-')
	const atom = split[0]
	const descriptor = split[1] || null
	const domain = split[2] || null
	const milstd = split.slice(3)
	return {
		type,
		atom,
		descriptor,
		domain,
		milstd
	}
}

exports.cotDate2js = (iso) => {
	return Date.parse(iso)
}

// convert a decoded point from xml2js(cot) from String to Numbers
exports.parsePoint = (point) => {
	return {
		lat: parseFloat(point.lat),
		lon: parseFloat(point.lon),
		hae: parseFloat(point.hae),
		ce: parseFloat(point.ce),
		le: parseFloat(point.le)
	}
}
