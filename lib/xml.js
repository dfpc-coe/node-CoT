import xmljs from 'xml-js';
import Util from './util.js';
import Color from './color.js';
import PointOnFeature from '@turf/point-on-feature';
import AJV from 'ajv';
import fs from 'fs';

const ajv = (new AJV({ allErrors: true })).compile(JSON.parse(fs.readFileSync(new URL('./schema.json', import.meta.url))));


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
        for (const key of Object.keys(this.raw.event.point._attributes)) {
            if (!isNaN(parseFloat(this.raw.event.point._attributes[key]))) {
                this.raw.event.point._attributes[key] = parseFloat(this.raw.event.point._attributes[key]);
            }
        }

        if (!this.raw.event._attributes.uid) this.raw.event._attributes.uuid = Util.cot_uuid().uid;

        ajv(this.raw);
        if (ajv.errors) throw new Error(ajv.errors[0].message);
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

        if (!feature.geometry) throw new Error('Must have Geometry');
        if (!['Point', 'Polygon', 'LineString'].includes(feature.geometry.type)) throw new Error('Unsupported Geoemtry Type');

        if (feature.geometry.type === 'Point') {
            cot.event.point._attributes.lon = feature.geometry.coordinates[0];
            cot.event.point._attributes.lat = feature.geometry.coordinates[1];
        } else if (['Polygon', 'LineString'].includes(feature.geometry.type)) {
            const stroke = new Color(feature.properties.stroke || -1761607936)
            if (feature.properties['stroke-opacity']) stroke.a = feature.properties['stroke-opacity'];
            cot.event.detail.strokeColor = { _attributes: { value: stroke.as_32bit() }};

            if (!feature.properties['stroke-width']) feature.properties['stroke-width'] = 3;
            cot.event.detail.strokeWeight = { _attributes: {
                value: feature.properties['stroke-width']
            }};

            if (!feature.properties['stroke-style']) feature.properties['stroke-style'] = 'solid';
            cot.event.detail.strokeStyle = { _attributes: {
                value: feature.properties['stroke-style']
            }};

            if (feature.geometry.type === 'LineString') {
                cot.event._attributes.type = 'u-d-f';

                cot.event.detail.link = [];
                for (const coord of feature.geometry.coordinates) {
                    cot.event.detail.link.push({
                        _attributes: { point: `${coord[1]},${coord[0]}` }
                    });
                }
            } else if (feature.geometry.type === 'Polygon') {
                cot.event._attributes.type = 'u-d-r';

                // Inner rings are not yet supported
                cot.event.detail.link = [];
                feature.geometry.coordinates[0].pop(); // Dont' Close Loop in COT
                for (const coord of feature.geometry.coordinates[0]) {
                    cot.event.detail.link.push({
                        _attributes: { point: `${coord[1]},${coord[0]}` }
                    });
                }

                const fill = new Color(feature.properties.fill || -1761607936)
                if (feature.properties['fill-opacity']) fill.a = feature.properties['fill-opacity'];
                cot.event.detail.fillColor = { _attributes: { value: fill.as_32bit() }};
            }

            cot.event.detail.labels_on = { _attributes: { value: 'false' } };
            cot.event.detail.tog = { _attributes: { enabled: '0' } };

            const centre = PointOnFeature(feature);
            cot.event.point._attributes.lon = centre.geometry.coordinates[0];
            cot.event.point._attributes.lat = centre.geometry.coordinates[1];
        }

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
