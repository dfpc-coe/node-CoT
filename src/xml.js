import xmljs from 'xml-js';
import Util from './util.js';

/**
 * Convert to and from an XML CoT message
 * @class
 *
 * @param {String|Object|Buffer} cot A string/buffer containing the XML representation or the xml-js object tree
 *
 * @prop {Object} raw Raw XML-JS representation of CoT
 */
export default class XMLCot {
    constructor(cot) {
        if (cot instanceof Buffer) String(cot);

        if (typeof cot === 'string') {
            this.raw = xmljs.xml2js(cot, { compact: true });
        } else {
            this.raw = cot;
        }

        // Attempt to cast all point to numerics
        for (const key of Object.keys(this.raw.event.point)) {
            if (!isNaN(parseFloat(this.raw.event.point[key]))) {
                this.raw.event.point[key] = parseFloat(this.raw.event.point[key]);
            }
        }
    }

    /**
     * Return an XMLCot Message
     *
     * @param {Object} feature GeoJSON Point Feature
     *
     * @return {XMLCot}
     */
    static from_geojson(feature) {
        if (feature.type !== 'Feature') throw new Error('Must be GeoJSON Feature');
        if (!feature.geometry || feature.geometry.type !== 'Point') throw new Error('Must be GeoJSON Point Feature');
        if (!feature.properties) throw new Error('Feature must have properties');

        const cot = {
            event: {
                _attributes: Util.cot_event_attr(feature.properties.type || 'a-f-G', feature.properties.how || 'm-g'),
                point: Util.cot_point(),
                detail: Util.cot_event_detail(feature.properties.callsign)
            }
        };

        if (feature.id) cot.event._attributes.uid = feature.id;
        if (feature.properties.callsign && !feature.id) cot.event._attributes.uid = feature.properties.callsign;

        for (const key of ['time', 'start', 'stale', 'type', 'how']) {
            if (feature.properties[key]) cot.event._attributes[key] = feature.properties[key];
        }

        cot.event.point._attributes.lon = feature.geometry.coordinates[0];
        cot.event.point._attributes.lat = feature.geometry.coordinates[1];

        return new XMLCot(cot);
    }

    /**
     * Return a GeoJSON Feature from an XML CoT message
     *
     * @returns {Object}
     */
    to_geojson() {
        const raw = JSON.parse(JSON.stringify(this.raw));
        if (!raw.event.detail) raw.event.detail = {};
        if (!raw.event.detail.contact) raw.event.detail.contact = {};
        if (!raw.event.detail.contact._attributes) raw.event.detail.contact._attributes = {};

        const geojson = {
            id: raw.event._attributes.uid,
            type: 'Feature',
            properties: {
                callsign: raw.event.detail.contact._attributes.callsign || 'UNKNOWN',
                type: raw.event._attributes.type,
                how: raw.event._attributes.how,
                time: raw.event._attributes.time,
                start: raw.event._attributes.start,
                stale: raw.event._attributes.stale
            },
            geometry: {
                type: 'Point',
                coordinates: [
                    raw.event.point._attributes.lon,
                    raw.event.point._attributes.lon
                ]
            }
        };

        return geojson;
    }

    to_xml() {
        return xmljs.js2xml(this.raw, {
            compact: true
        });
    }

    /**
     * Return a CoT Message
     *
     * @returns {XMLCot}
     */
    static ping() {
        return new XMLCot({
            event: {
                _attributes: Util.cot_event_attr('t-x-c-t', 'h-g-i-g-o'),
                point: Util.cot_point()
            }
        });
    }
}
