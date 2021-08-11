const xml2js = require('./xml2js')
const js2xml = require('./js2xml')

module.exports = {
	...js2xml,
	...xml2js
}
