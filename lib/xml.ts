import xmljs from 'xml-js';
import { Feature } from 'geojson';
import { AllGeoJSON } from "@turf/helpers";
import Util from './util.js';
import Color from './color.js';
import PointOnFeature from '@turf/point-on-feature';
import AJV from 'ajv';
import fs from 'fs';

const ajv = (new AJV({ allErrors: true }))
    .compile(JSON.parse(String(fs.readFileSync(new URL('./schema.json', import.meta.url)))));

export interface Attributes {
    version: string,
    uid: string;
    type: string;
    how: string;
    [k: string]: string;
}

export interface GenericAttributes {
    _attributes: {
        [k: string]: string;
    }
}

export interface Detail {
    contact?: GenericAttributes,
    tog?: GenericAttributes,
    strokeColor?: GenericAttributes,
    strokeWeight?: GenericAttributes,
    strokeStyle?: GenericAttributes,
    labels_on?: GenericAttributes,
    fillColor?: GenericAttributes,
    link?: object[],
    usericon?: GenericAttributes,
    TakControl?: {
        TakServerVersionInfo?: GenericAttributes
    },
    [k: string]: unknown
}

export interface Point {
    _attributes: {
        lat: string | number;
        lon: string | number;
        hae: string | number;
        ce: string | number;
        le: string | number;
        [k: string]: string | number
    }
}

export interface JSONCoT {
    event: {
        _attributes: Attributes,
        detail: Detail,
        point: Point,
        [k: string]: unknown
    },
    [k: string]: unknown
}

/**
 * Convert to and from an XML CoT message
 * @class
 *
 * @param cot A string/buffer containing the XML representation or the xml-js object tree
 *
 * @prop raw Raw XML-JS representation of CoT
 */
export default class XMLCot {
    raw: JSONCoT;

    constructor(cot: Buffer | JSONCoT | string) {
        if (typeof cot === 'string' || cot instanceof Buffer) {
            if (cot instanceof Buffer) cot = String(cot);

            const raw: any = xmljs.xml2js(cot, { compact: true });
            this.raw = raw as JSONCoT;
        } else {
            this.raw = cot;
        }

        if (!this.raw.event._attributes.uid) this.raw.event._attributes.uuid = Util.cot_uuid();

        ajv(this.raw);
        if (ajv.errors) throw new Error(`${ajv.errors[0].message} (${ajv.errors[0].instancePath})`);
    }

    /**
     * Return an XMLCot Message
     *
     * @param {Object} feature GeoJSON Point Feature
     *
     * @return {XMLCot}
     */
    static from_geojson(feature: Feature) {
        if (feature.type !== 'Feature') throw new Error('Must be GeoJSON Feature');
        if (!feature.properties) throw new Error('Feature must have properties');

        const cot: JSONCoT = {
            event: {
                _attributes: Util.cot_event_attr(
                    feature.properties.type || 'a-f-G',
                    feature.properties.how || 'm-g',
                    feature.properties.time,
                    feature.properties.start,
                    feature.properties.stale
                ),
                point: Util.cot_point(),
                detail: Util.cot_event_detail(feature.properties.callsign)
            }
        };

        if (feature.id) cot.event._attributes.uid = String(feature.id);
        if (feature.properties.callsign && !feature.id) cot.event._attributes.uid = feature.properties.callsign;

        if (!feature.geometry) throw new Error('Must have Geometry');
        if (!['Point', 'Polygon', 'LineString'].includes(feature.geometry.type)) throw new Error('Unsupported Geometry Type');

        if (feature.geometry.type === 'Point') {
            cot.event.point._attributes.lon = String(feature.geometry.coordinates[0]);
            cot.event.point._attributes.lat = String(feature.geometry.coordinates[1]);
        } else if (['Polygon', 'LineString'].includes(feature.geometry.type)) {
            const stroke = new Color(feature.properties.stroke || -1761607936);
            if (feature.properties['stroke-opacity']) stroke.a = feature.properties['stroke-opacity'];
            cot.event.detail.strokeColor = { _attributes: { value: String(stroke.as_32bit()) } };

            if (!feature.properties['stroke-width']) feature.properties['stroke-width'] = 3;
            cot.event.detail.strokeWeight = { _attributes: {
                value: String(feature.properties['stroke-width'])
            } };

            if (!feature.properties['stroke-style']) feature.properties['stroke-style'] = 'solid';
            cot.event.detail.strokeStyle = { _attributes: {
                value: feature.properties['stroke-style']
            } };

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

                const fill = new Color(feature.properties.fill || -1761607936);
                if (feature.properties['fill-opacity']) fill.a = feature.properties['fill-opacity'];
                cot.event.detail.fillColor = { _attributes: { value: String(fill.as_32bit()) } };
            }

            cot.event.detail.labels_on = { _attributes: { value: 'false' } };
            cot.event.detail.tog = { _attributes: { enabled: '0' } };

            const centre = PointOnFeature(feature as AllGeoJSON);
            cot.event.point._attributes.lon = String(centre.geometry.coordinates[0]);
            cot.event.point._attributes.lat = String(centre.geometry.coordinates[1]);
        }

        return new XMLCot(cot);
    }

    /**
     * Return a GeoJSON Feature from an XML CoT message
     */
    to_geojson(): Feature {
        const raw = JSON.parse(JSON.stringify(this.raw));
        if (!raw.event.detail) raw.event.detail = {};
        if (!raw.event.detail.contact) raw.event.detail.contact = {};
        if (!raw.event.detail.contact._attributes) raw.event.detail.contact._attributes = {};

        const geojson: Feature = {
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
                detail: {},
                point: Util.cot_point()
            }
        });
    }
}
