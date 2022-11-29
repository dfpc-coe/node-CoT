import xmljs from 'xml-js';

/**
 * Convert to and from an XML CoT message
 * @class
 */
export default class XMLCot {
    /**
     *
     */
    static from_geojson(feature) {
        if (feature.type !== 'Feature') throw new Error('Must be GeoJSON Feature');
        if (!feature.geometry || feature.geometry.type !== 'Point') throw new Error('Must be GeoJSON Point Feature');
        if (!feature.properties) throw new Error('Feature must have properties');


    }

    static ping() {

    }

    static js2xml(js) {
        if (typeof js === 'undefined' || !js) {
            throw new Error('Attempted to parse empty Object');
        }

        return xmljs.js2xml(js, { compact: true });
    }

    // accepts an Object decoded with xml2js.decodeType(type)
    static encodeType(type) {
        let result = type.atom;
        if (type.descriptor) {
            result += `-${type.descriptor}`;
        }
        if (type.domain) {
            result += `-${type.domain}`;
        }
        if (type.milstd.length > 0) {
            result += `-${type.milstd.join('-')}`;
        }
        return result;
    }

    static jsDate2cot(unix) {
        return new Date(unix).toISOString();
    }

    static xml2js(cot) {
        if (typeof cot === 'undefined' || cot === null) {
            throw new Error('Attempted to parse empty COT message');
        }

        if (typeof cot === 'object') { // accept a data buffer or string for conversion
            cot = cot.toString();
        }

        return xmljs.xml2js(cot, { compact: true });
    }

    // accepts a string formatted like 'a-f-G-U-C-I'
    static decodeType(type) {
        const split = type.split('-');
        const atom = split[0];
        const descriptor = split[1] || null;
        const domain = split[2] || null;
        const milstd = split.slice(3);
        return {
            type,
            atom,
            descriptor,
            domain,
            milstd
        };
    }

    static cotDate2js(iso) {
        return Date.parse(iso);
    }

    // convert a decoded point from xml2js(cot) from String to Numbers
    static parsePoint(point) {
        return {
            lat: parseFloat(point.lat),
            lon: parseFloat(point.lon),
            hae: parseFloat(point.hae),
            ce: parseFloat(point.ce),
            le: parseFloat(point.le)
        };
    }
}
