import protobuf from 'protobufjs';
import Err from '@openaddresses/batch-error';
import { xml2js, js2xml } from 'xml-js';
import { diff } from 'json-diff-ts';
import type { Static } from '@sinclair/typebox';
import from_geojson from './parser/from_geojson.js';
import type {
    Feature,
    Polygon,
    FeaturePropertyMission,
    FeaturePropertyMissionLayer,
} from './types/feature.js';
import type {
    MartiDest,
    MartiDestAttributes,
    Link,
    LinkAttributes,
    ColorAttributes,
} from './types/types.js'
import {
    InputFeature,
} from './types/feature.js';
import Ellipse from '@turf/ellipse';
import Truncate from '@turf/truncate';
import { destination } from '@turf/destination';
import Color from './utils/color.js';
import JSONCoT, { Detail } from './types/types.js'
import CoT from './cot.js';
import type { CoTOptions } from './cot.js';
import AJV from 'ajv';
import fs from 'fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// GeoJSON Geospatial ops will truncate to the below
const COORDINATE_PRECISION = 6;

const protoPath = path.join(path.dirname(fileURLToPath(import.meta.url)), 'proto', 'takmessage.proto');
const RootMessage = await protobuf.load(protoPath);

const pkg = JSON.parse(String(fs.readFileSync(new URL('../package.json', import.meta.url))));

const checkXML = (new AJV({
    allErrors: true,
    coerceTypes: true,
    allowUnionTypes: true
}))
    .compile(JSONCoT);

/**
 * Convert to and from an XML CoT message
 * @class
 *
 * @param cot A string/buffer containing the XML representation or the xml-js object tree
 *
 * @prop raw Raw XML-JS representation of CoT
 */
export class CoTParser {
    static validate(
        cot: CoT,
        opts: {
            flow: boolean
        } = {
            flow: true
        }
    ): CoT {
        if (opts.flow === undefined) opts.flow = true;

        checkXML(cot.raw);
        if (checkXML.errors) throw new Err(400, null, `${checkXML.errors[0].message} (${checkXML.errors[0].instancePath})`);

        if (opts.flow) {
            if (!cot.raw.event.detail) cot.raw.event.detail = {};

            if (!cot.raw.event.detail['_flow-tags_']) {
                cot.raw.event.detail['_flow-tags_'] = {};
            }

            cot.raw.event.detail['_flow-tags_'][`NodeCoT-${pkg.version}`] = new Date().toISOString()
        }

        return cot;
    }

    /**
     * Detect difference between CoT messages
     * Note: This diffs based on GeoJSON Representation of message
     *       So if unknown properties are present they will be excluded from the diff
     */
    static isDiff(
        aCoT: CoT,
        bCoT: CoT,
        opts = {
            diffMetadata: false,
            diffStaleStartTime: false,
            diffDest: false,
            diffFlow: false
        }
    ): Promise<boolean> {
        const a = await this.to_geojson(aCoT) as Static<typeof InputFeature>;
        const b = await this.to_geojson(bCoT) as Static<typeof InputFeature>;

        if (!opts.diffDest) {
            delete a.properties.dest;
            delete b.properties.dest;
        }

        if (!opts.diffMetadata) {
            delete a.properties.metadata;
            delete b.properties.metadata;
        }

        if (!opts.diffFlow) {
            delete a.properties.flow;
            delete b.properties.flow;
        }

        if (!opts.diffStaleStartTime) {
            delete a.properties.time;
            delete a.properties.stale;
            delete a.properties.start;
            delete b.properties.time;
            delete b.properties.stale;
            delete b.properties.start;
        }

        const diffs = diff(a, b);

        return diffs.length > 0;
    }


    static from_xml(
        raw: Buffer | string,
        opts: CoTOptions = {}
   ): CoT {
        const cot = new CoT(
            xml2js(String(raw), { compact: true }) as Static<typeof JSONCoT>,
            opts
        );

        return this.validate(cot);
    }

    static to_xml(cot: CoT): string {
        return js2xml(cot.raw, { compact: true });
    }

    /**
     * Return an ATAK Compliant Protobuf
     */
    static async to_proto(cot: CoT, version = 1): Promise<Uint8Array> {
        if (version < 1 || version > 1) throw new Err(400, null, `Unsupported Proto Version: ${version}`);
        const ProtoMessage = RootMessage.lookupType(`atakmap.commoncommo.protobuf.v${version}.TakMessage`)

        // The spread operator is important to make sure the delete doesn't modify the underlying detail object
        const detail = { ...cot.raw.event.detail };

        const msg: any = {
            cotEvent: {
                ...cot.raw.event._attributes,
                sendTime: new Date(cot.raw.event._attributes.time).getTime(),
                startTime: new Date(cot.raw.event._attributes.start).getTime(),
                staleTime: new Date(cot.raw.event._attributes.stale).getTime(),
                ...cot.raw.event.point._attributes,
                detail: {
                    xmlDetail: ''
                }
            }
        };

        let key: keyof Static<typeof Detail>;
        for (key in detail) {
            if(['contact', 'group', 'precisionlocation', 'status', 'takv', 'track'].includes(key)) {
                msg.cotEvent.detail[key] = detail[key]._attributes;
                delete detail[key]
            }
        }

        msg.cotEvent.detail.xmlDetail = js2xml({
            ...detail,
            metadata: cot.metadata
        }, { compact: true });

        return ProtoMessage.encode(msg).finish();
    }

    /**
     * Return a GeoJSON Feature from an XML CoT message
     */
    static async to_geojson(cot: CoT): Promise<Static<typeof Feature>> {
        const raw: Static<typeof JSONCoT> = JSON.parse(JSON.stringify(cot.raw));
        if (!raw.event.detail) raw.event.detail = {};
        if (!raw.event.detail.contact) raw.event.detail.contact = { _attributes: { callsign: 'UNKNOWN' } };
        if (!raw.event.detail.contact._attributes) raw.event.detail.contact._attributes = { callsign: 'UNKNOWN' };

        const feat: Static<typeof Feature> = {
            id: raw.event._attributes.uid,
            type: 'Feature',
            properties: {
                callsign: raw.event.detail.contact._attributes.callsign || 'UNKNOWN',
                center: [ Number(raw.event.point._attributes.lon), Number(raw.event.point._attributes.lat), Number(raw.event.point._attributes.hae) ],
                type: raw.event._attributes.type,
                how: raw.event._attributes.how || '',
                time: raw.event._attributes.time,
                start: raw.event._attributes.start,
                stale: raw.event._attributes.stale,
            },
            geometry: {
                type: 'Point',
                coordinates: [ Number(raw.event.point._attributes.lon), Number(raw.event.point._attributes.lat), Number(raw.event.point._attributes.hae) ]
            }
        };

        const contact = JSON.parse(JSON.stringify(raw.event.detail.contact._attributes));
        delete contact.callsign;
        if (Object.keys(contact).length) {
            feat.properties.contact = contact;
        }

        if (cot.creator()) {
            feat.properties.creator = cot.creator();
        }

        if (raw.event.detail.remarks && raw.event.detail.remarks._text) {
            feat.properties.remarks = raw.event.detail.remarks._text;
        }

        if (raw.event.detail.fileshare) {
            feat.properties.fileshare = raw.event.detail.fileshare._attributes;
            if (feat.properties.fileshare && typeof feat.properties.fileshare.sizeInBytes === 'string') {
                feat.properties.fileshare.sizeInBytes = parseInt(feat.properties.fileshare.sizeInBytes)
            }
        }

        if (raw.event.detail.__milsym) {
            feat.properties.milsym = {
                id: raw.event.detail.__milsym._attributes.id
            }
        }

        if (raw.event.detail.sensor) {
            feat.properties.sensor = raw.event.detail.sensor._attributes;
        }

        if (raw.event.detail.range) {
            feat.properties.range = raw.event.detail.range._attributes.value;
        }

        if (raw.event.detail.bearing) {
            feat.properties.bearing = raw.event.detail.bearing._attributes.value;
        }

        if (raw.event.detail.labels_on && raw.event.detail.labels_on._attributes && raw.event.detail.labels_on._attributes.value !== undefined) {
            feat.properties.labels = raw.event.detail.labels_on._attributes.value;
        }

        if (raw.event.detail.__video && raw.event.detail.__video._attributes) {
            feat.properties.video = raw.event.detail.__video._attributes;

            if (raw.event.detail.__video.ConnectionEntry) {
                feat.properties.video.connection = raw.event.detail.__video.ConnectionEntry._attributes;
            }
        }

        if (raw.event.detail.__geofence) {
            feat.properties.geofence = raw.event.detail.__geofence._attributes;
        }

        if (raw.event.detail.ackrequest) {
            feat.properties.ackrequest = raw.event.detail.ackrequest._attributes;
        }

        if (raw.event.detail.attachment_list) {
            feat.properties.attachments = JSON.parse(raw.event.detail.attachment_list._attributes.hashes);
        }

        if (raw.event.detail.link) {
            if (!Array.isArray(raw.event.detail.link)) raw.event.detail.link = [raw.event.detail.link];

            feat.properties.links = raw.event.detail.link.filter((link: Static<typeof Link>) => {
                return !!link._attributes.url
            }).map((link: Static<typeof Link>): Static<typeof LinkAttributes> => {
                return link._attributes;
            });

            if (!feat.properties.links || !feat.properties.links.length) delete feat.properties.links;
        }

        if (raw.event.detail.archive) {
            feat.properties.archived = true;
        }

        if (raw.event.detail.__chat) {
            feat.properties.chat = {
                ...raw.event.detail.__chat._attributes,
                chatgrp: raw.event.detail.__chat.chatgrp
            }
        }

        if (raw.event.detail.track && raw.event.detail.track._attributes) {
            if (raw.event.detail.track._attributes.course) feat.properties.course = Number(raw.event.detail.track._attributes.course);
            if (raw.event.detail.track._attributes.slope) feat.properties.slope = Number(raw.event.detail.track._attributes.slope);
            if (raw.event.detail.track._attributes.course) feat.properties.speed = Number(raw.event.detail.track._attributes.speed);
        }

        if (raw.event.detail.marti && raw.event.detail.marti.dest) {
            if (!Array.isArray(raw.event.detail.marti.dest)) raw.event.detail.marti.dest = [raw.event.detail.marti.dest];

            const dest: Array<Static<typeof MartiDestAttributes>> = raw.event.detail.marti.dest.map((d: Static<typeof MartiDest>) => {
                return { ...d._attributes };
            });

            feat.properties.dest = dest.length === 1 ? dest[0] : dest
        }

        if (raw.event.detail.usericon && raw.event.detail.usericon._attributes && raw.event.detail.usericon._attributes.iconsetpath) {
            feat.properties.icon = raw.event.detail.usericon._attributes.iconsetpath;
        }


        if (raw.event.detail.uid && raw.event.detail.uid._attributes && raw.event.detail.uid._attributes.Droid) {
            feat.properties.droid = raw.event.detail.uid._attributes.Droid;
        }

        if (raw.event.detail.takv && raw.event.detail.takv._attributes) {
            feat.properties.takv = raw.event.detail.takv._attributes;
        }

        if (raw.event.detail.__group && raw.event.detail.__group._attributes) {
            feat.properties.group = raw.event.detail.__group._attributes;
        }

        if (raw.event.detail['_flow-tags_'] && raw.event.detail['_flow-tags_']._attributes) {
            feat.properties.flow = raw.event.detail['_flow-tags_']._attributes;
        }

        if (raw.event.detail.status && raw.event.detail.status._attributes) {
            feat.properties.status = raw.event.detail.status._attributes;
        }

        if (raw.event.detail.mission && raw.event.detail.mission._attributes) {
            const mission: Static<typeof FeaturePropertyMission> = {
                ...raw.event.detail.mission._attributes
            };

            if (raw.event.detail.mission && raw.event.detail.mission.MissionChanges) {
                const changes =
                    Array.isArray(raw.event.detail.mission.MissionChanges)
                        ? raw.event.detail.mission.MissionChanges
                        : [ raw.event.detail.mission.MissionChanges ]

                mission.missionChanges = []
                for (const change of changes) {
                    mission.missionChanges.push({
                        contentUid: change.MissionChange.contentUid._text,
                        creatorUid: change.MissionChange.creatorUid._text,
                        isFederatedChange: change.MissionChange.isFederatedChange._text,
                        missionName: change.MissionChange.missionName._text,
                        timestamp: change.MissionChange.timestamp._text,
                        type: change.MissionChange.type._text,
                        details: {
                            ...change.MissionChange.details._attributes,
                            ...change.MissionChange.details.location
                                ? change.MissionChange.details.location._attributes
                                : {}
                        }
                    })
                }
            }


            if (raw.event.detail.mission && raw.event.detail.mission.missionLayer) {
                const missionLayer: Static<typeof FeaturePropertyMissionLayer> = {};

                if (raw.event.detail.mission.missionLayer.name && raw.event.detail.mission.missionLayer.name._text) {
                    missionLayer.name = raw.event.detail.mission.missionLayer.name._text;
                }
                if (raw.event.detail.mission.missionLayer.parentUid && raw.event.detail.mission.missionLayer.parentUid._text) {
                    missionLayer.parentUid = raw.event.detail.mission.missionLayer.parentUid._text;
                }
                if (raw.event.detail.mission.missionLayer.type && raw.event.detail.mission.missionLayer.type._text) {
                    missionLayer.type = raw.event.detail.mission.missionLayer.type._text;
                }
                if (raw.event.detail.mission.missionLayer.uid && raw.event.detail.mission.missionLayer.uid._text) {
                    missionLayer.uid = raw.event.detail.mission.missionLayer.uid._text;
                }

                mission.missionLayer = missionLayer;
            }

            feat.properties.mission = mission;
        }

        if (raw.event.detail.precisionlocation && raw.event.detail.precisionlocation._attributes) {
            feat.properties.precisionlocation = raw.event.detail.precisionlocation._attributes;
        }

        if (raw.event.detail.strokeColor && raw.event.detail.strokeColor._attributes && raw.event.detail.strokeColor._attributes.value) {
            const stroke = new Color(Number(raw.event.detail.strokeColor._attributes.value));
            feat.properties.stroke = stroke.as_hex();
            feat.properties['stroke-opacity'] = stroke.as_opacity() / 255;
        }

        if (raw.event.detail.strokeWeight && raw.event.detail.strokeWeight._attributes && raw.event.detail.strokeWeight._attributes.value) {
            feat.properties['stroke-width'] = Number(raw.event.detail.strokeWeight._attributes.value);
        }

        if (raw.event.detail.strokeStyle && raw.event.detail.strokeStyle._attributes && raw.event.detail.strokeStyle._attributes.value) {
            feat.properties['stroke-style'] = raw.event.detail.strokeStyle._attributes.value;
        }

        if (raw.event.detail.color) {
            let color: Static<typeof ColorAttributes> | null = null;

            if (Array.isArray(raw.event.detail.color) && raw.event.detail.color.length > 1) {
                color = raw.event.detail.color[0];
                if (!color._attributes) color._attributes = {};

                for (let i = raw.event.detail.color.length - 1; i >= 1; i--) {
                    if (raw.event.detail.color[i]._attributes) {
                        Object.assign(color._attributes, raw.event.detail.color[i]._attributes);
                    }
                }
            } else if (Array.isArray(raw.event.detail.color) && raw.event.detail.color.length === 1) {
                color = raw.event.detail.color[0];
            } else if (!Array.isArray(raw.event.detail.color)) {
                color = raw.event.detail.color;
            }

            if (color && color._attributes && color._attributes.argb) {
                const parsedColor = new Color(Number(color._attributes.argb));
                feat.properties['marker-color'] = parsedColor.as_hex();
                feat.properties['marker-opacity'] = parsedColor.as_opacity() / 255;
            }
        }

        // Line, Polygon style types
        if (['u-d-f', 'u-d-r', 'b-m-r', 'u-rb-a'].includes(raw.event._attributes.type) && Array.isArray(raw.event.detail.link)) {
            const coordinates = [];

            for (const l of raw.event.detail.link) {
                if (!l._attributes.point) continue;
                coordinates.push(l._attributes.point.split(',').map((p: string) => { return Number(p.trim()) }).splice(0, 2).reverse());
            }

            // Range & Bearing Line
            if (raw.event._attributes.type === 'u-rb-a') {
                const detail = cot.detail();

                if (!detail.range) throw new Error('Range value not provided')
                if (!detail.bearing) throw new Error('Bearing value not provided')

                // TODO Support inclination
                const dest = destination(
                    cot.position(),
                    detail.range._attributes.value / 1000,
                    detail.bearing._attributes.value
                ).geometry.coordinates;

                feat.geometry = {
                    type: 'LineString',
                    coordinates: [cot.position(), dest]
                };
            } else if (raw.event._attributes.type === 'u-d-r' || (coordinates[0][0] === coordinates[coordinates.length -1][0] && coordinates[0][1] === coordinates[coordinates.length -1][1])) {
                if (raw.event._attributes.type === 'u-d-r') {
                    // CoT rectangles are only 4 points - GeoJSON needs to be closed
                    coordinates.push(coordinates[0])
                }

                feat.geometry = {
                    type: 'Polygon',
                    coordinates: [coordinates]
                }

                if (raw.event.detail.fillColor && raw.event.detail.fillColor._attributes && raw.event.detail.fillColor._attributes.value) {
                    const fill = new Color(Number(raw.event.detail.fillColor._attributes.value));
                    feat.properties['fill-opacity'] = fill.as_opacity() / 255;
                    feat.properties['fill'] = fill.as_hex();
                }
            } else {
                feat.geometry = {
                    type: 'LineString',
                    coordinates
                }
            }
        } else if (raw.event._attributes.type.startsWith('u-d-c-c') || raw.event._attributes.type.startsWith('u-r-b-c-c')) {
            if (!raw.event.detail.shape) throw new Err(400, null, `${raw.event._attributes.type} (Circle) must define shape value`)
            if (
                !raw.event.detail.shape.ellipse
                || !raw.event.detail.shape.ellipse._attributes
            ) throw new Err(400, null, `${raw.event._attributes.type} (Circle) must define ellipse shape value`)

            const ellipse = {
                major: Number(raw.event.detail.shape.ellipse._attributes.major),
                minor: Number(raw.event.detail.shape.ellipse._attributes.minor),
                angle: Number(raw.event.detail.shape.ellipse._attributes.angle)
            }

            feat.geometry = Truncate(Ellipse(
                feat.geometry.coordinates as number[],
                Number(ellipse.major) / 1000,
                Number(ellipse.minor) / 1000,
                {
                    angle: ellipse.angle
                }
            ), {
                precision: COORDINATE_PRECISION,
                mutate: true
            }).geometry as Static<typeof Polygon>;

            feat.properties.shape = {};
            feat.properties.shape.ellipse = ellipse;
        } else if (raw.event._attributes.type.startsWith('b-m-p-s-p-i')) {
            // TODO: Currently the "shape" tag is only parsed here - asking ARA for clarification if it is a general use tag
            if (raw.event.detail.shape && raw.event.detail.shape.polyline && raw.event.detail.shape.polyline.vertex) {
                const coordinates = [];

                const vertices = Array.isArray(raw.event.detail.shape.polyline.vertex) ? raw.event.detail.shape.polyline.vertex : [raw.event.detail.shape.polyline.vertex];
                for (const v of vertices) {
                    coordinates.push([Number(v._attributes.lon), Number(v._attributes.lat)]);
                }

                if (coordinates.length === 1) {
                    feat.geometry = { type: 'Point', coordinates: coordinates[0] }
                } else if (raw.event.detail.shape.polyline._attributes && raw.event.detail.shape.polyline._attributes.closed === true) {
                    coordinates.push(coordinates[0]);
                    feat.geometry = { type: 'Polygon', coordinates: [coordinates] }
                } else {
                    feat.geometry = { type: 'LineString', coordinates }
                }
            }

            if (
                raw.event.detail.shape
                && raw.event.detail.shape.polyline
                && raw.event.detail.shape.polyline._attributes
            ) {
                if (raw.event.detail.shape.polyline._attributes.fillColor) {
                    const fill = new Color(Number(raw.event.detail.shape.polyline._attributes.fillColor));
                    feat.properties['fill-opacity'] = fill.as_opacity() / 255;
                    feat.properties['fill'] = fill.as_hex();
                }

                if (raw.event.detail.shape.polyline._attributes.color) {
                    const stroke = new Color(Number(raw.event.detail.shape.polyline._attributes.color));
                    feat.properties.stroke = stroke.as_hex();
                    feat.properties['stroke-opacity'] = stroke.as_opacity() / 255;
                }
            }
        }

        feat.properties.metadata = cot.metadata;
        feat.path = cot.path;

        return feat;
    }

    /**
     * Parse an ATAK compliant Protobuf to a JS Object
     */
    static async from_proto(
        raw: Uint8Array,
        version = 1,
        opts: CoTOptions = {}
    ): Promise<CoT> {
        const ProtoMessage = RootMessage.lookupType(`atakmap.commoncommo.protobuf.v${version}.TakMessage`)

        // TODO Type this
        const msg: any = ProtoMessage.decode(raw);

        if (!msg.cotEvent) throw new Err(400, null, 'No cotEvent Data');

        const detail: Record<string, any> = {};
        const metadata: Record<string, unknown> = {};
        for (const key in msg.cotEvent.detail) {
            if (key === 'xmlDetail') {
                const parsed: any = xml2js(`<detail>${msg.cotEvent.detail.xmlDetail}</detail>`, { compact: true });
                Object.assign(detail, parsed.detail);

                if (detail.metadata) {
                    for (const key in detail.metadata) {
                        metadata[key] = detail.metadata[key]._text;
                    }
                    delete detail.metadata;
                }
            } else if (key === 'group') {
                if (msg.cotEvent.detail[key]) {
                    detail.__group = { _attributes: msg.cotEvent.detail[key] };
                }
            } else if (['contact', 'precisionlocation', 'status', 'takv', 'track'].includes(key)) {
                if (msg.cotEvent.detail[key]) {
                    detail[key] = { _attributes: msg.cotEvent.detail[key] };
                }
            }
        }

        const cot = new CoT({
            event: {
                _attributes: {
                    version: '2.0',
                    uid: msg.cotEvent.uid, type: msg.cotEvent.type, how: msg.cotEvent.how,
                    qos: msg.cotEvent.qos, opex: msg.cotEvent.opex, access: msg.cotEvent.access,
                    time: new Date(msg.cotEvent.sendTime.toNumber()).toISOString(),
                    start: new Date(msg.cotEvent.startTime.toNumber()).toISOString(),
                    stale: new Date(msg.cotEvent.staleTime.toNumber()).toISOString(),
                },
                detail,
                point: {
                    _attributes: {
                        lat: msg.cotEvent.lat,
                        lon: msg.cotEvent.lon,
                        hae: msg.cotEvent.hae,
                        le: msg.cotEvent.le,
                        ce: msg.cotEvent.ce,
                    },
                }
            }
        }, opts);

        cot.metadata = metadata;

        return this.validate(cot);
    }

    /**
     * Return an CoT Message given a GeoJSON Feature
     *
     * @param {Object} feature GeoJSON Point Feature
     *
     * @return {CoT}
     */
    static async from_geojson(
        feature: Static<typeof InputFeature>,
        opts: CoTOptions = {}
    ): Promise<CoT> {
        const cot = await from_geojson(feature, opts);

        return this.validate(cot);
    }
}
