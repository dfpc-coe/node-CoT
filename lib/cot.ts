import crypto from 'node:crypto';
import protobuf from 'protobufjs';
import Err from '@openaddresses/batch-error';
import { diff } from 'json-diff-ts';
import xmljs from 'xml-js';
import type { Static } from '@sinclair/typebox';
import type {
    Feature,
    Polygon,
    Position,
    FeaturePropertyMission,
    FeaturePropertyMissionLayer,
} from './types/feature.js';
import type {
    MartiDest,
    MartiDestAttributes,
    Link,
    LinkAttributes,
    VideoAttributes,
    SensorAttributes,
    VideoConnectionEntryAttributes,
} from './types/types.js'
import {
    InputFeature,
} from './types/feature.js';
import Sensor from './sensor.js';
import type { AllGeoJSON } from "@turf/helpers";
import PointOnFeature from '@turf/point-on-feature';
import Truncate from '@turf/truncate';
import Ellipse from '@turf/ellipse';
import Util from './utils/util.js';
import Color from './utils/color.js';
import JSONCoT, { Detail } from './types/types.js'
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

const checkFeat = (new AJV({
    allErrors: true,
    coerceTypes: true,
    allowUnionTypes: true
}))
    .compile(InputFeature);

/**
 * Convert to and from an XML CoT message
 * @class
 *
 * @param cot A string/buffer containing the XML representation or the xml-js object tree
 *
 * @prop raw Raw XML-JS representation of CoT
 */
export default class CoT {
    raw: Static<typeof JSONCoT>;

    // Key/Value JSON Records - not currently support by TPC Clients
    // but used for styling/dynamic overrides and hopefully eventually
    // merged into the CoT spec
    metadata: Record<string, unknown>;

    // Does the CoT belong to a folder - defaults to "/"
    path: string;

    constructor(cot: Buffer | Static<typeof JSONCoT> | object | string) {
        if (typeof cot === 'string' || cot instanceof Buffer) {
            const raw = xmljs.xml2js(String(cot), { compact: true });
            this.raw = raw as Static<typeof JSONCoT>;
        } else {
            this.raw = cot as Static<typeof JSONCoT>;
        }

        this.metadata = {};
        this.path = '/';

        if (!this.raw.event._attributes.uid) this.raw.event._attributes.uid = Util.cot_uuid();

        if (process.env.DEBUG_COTS) console.log(JSON.stringify(this.raw))

        checkXML(this.raw);
        if (checkXML.errors) throw new Err(400, null, `${checkXML.errors[0].message} (${checkXML.errors[0].instancePath})`);

        if (!this.raw.event.detail) this.raw.event.detail = {};
        if (!this.raw.event.detail['_flow-tags_']) this.raw.event.detail['_flow-tags_'] = {};
        this.raw.event.detail['_flow-tags_'][`NodeCoT-${pkg.version}`] = new Date().toISOString()

        if (this.raw.event.detail.archive && Object.keys(this.raw.event.detail.archive).length === 0) {
            this.raw.event.detail.archive = { _attributes: {} };
        }
    }

    /**
     * Detect difference between CoT messages
     * Note: This diffs based on GeoJSON Representation of message
     *       So if unknown properties are present they will be excluded from the diff
     */
    isDiff(
        cot: CoT,
        opts = {
            diffMetadata: false,
            diffStaleStartTime: false,
            diffDest: false,
            diffFlow: false
        }
    ): boolean {
        const a = this.to_geojson() as Static<typeof InputFeature>;
        const b = cot.to_geojson() as Static<typeof InputFeature>;

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

    /**
     * Returns or sets the Callsign of the CoT
     */
    callsign(callsign?: string): string {
        if (!this.raw.event.detail) this.raw.event.detail = {};

        if (callsign && !this.raw.event.detail.contact) {
            this.raw.event.detail.contact = { _attributes: { callsign } };
        } else if (callsign && this.raw.event.detail.contact) {
            this.raw.event.detail.contact._attributes.callsign = callsign;
        }

        if (this.raw.event.detail.contact && this.raw.event.detail.contact._attributes && typeof this.raw.event.detail.contact._attributes.callsign === 'string') {
            return this.raw.event.detail.contact._attributes.callsign;
        } else {
            return 'UNKNOWN'
        }
    }

    /**
     * Returns or sets the UID of the CoT
     */
    uid(uid?: string): string {
        if (uid) this.raw.event._attributes.uid = uid;
        return this.raw.event._attributes.uid;
    }

    /**
     * Add a given Dest tag to a CoT
     */
    addDest(dest: Static<typeof MartiDestAttributes>): CoT {
        if (!this.raw.event.detail) this.raw.event.detail = {};
        if (!this.raw.event.detail.marti) this.raw.event.detail.marti = {};

        let destArr: Array<Static<typeof MartiDest>> = [];
        if (this.raw.event.detail.marti.dest && !Array.isArray(this.raw.event.detail.marti.dest)) {
            destArr = [this.raw.event.detail.marti.dest]
        } else if (this.raw.event.detail.marti.dest && Array.isArray(this.raw.event.detail.marti.dest)) {
            destArr = this.raw.event.detail.marti.dest;
        }

        destArr.push({ _attributes: dest });

        this.raw.event.detail.marti.dest = destArr;

        return this;
    }

    addVideo(
        video: Static<typeof VideoAttributes>,
        connection?: Static<typeof VideoConnectionEntryAttributes>
    ): CoT {
        if (!this.raw.event.detail) this.raw.event.detail = {};
        if (this.raw.event.detail.__video) throw new Err(400, null, 'A video stream already exists on this CoT');

        if (!video.url) throw new Err(400, null, 'A Video URL must be provided');

        if (!video.uid && connection && connection.uid) {
            video.uid = connection.uid
        } else if (video.uid && connection && !connection.uid) {
            connection.uid = video.uid;
        } else if (!video.uid) {
            video.uid = crypto.randomUUID();
        }

        this.raw.event.detail.__video = {
            _attributes: video
        };

        if (connection) {
            this.raw.event.detail.__video.ConnectionEntry = {
                _attributes: connection
            }
        } else {
            this.raw.event.detail.__video.ConnectionEntry = {
                _attributes: {
                    uid: video.uid,
                    networkTimeout: 12000,
                    path: '',
                    protocol: 'raw',
                    bufferTime: -1,
                    address: video.url,
                    port: -1,
                    roverPort: -1,
                    rtspReliable: 0,
                    ignoreEmbeddedKLV: false,
                    alias: this.callsign()
                }
            }
        }

        return this;
    }

    position(position?: Static<typeof Position>): Static<typeof Position> {
        if (position) {
            this.raw.event.point._attributes.lon = String(position[0]);
            this.raw.event.point._attributes.lat = String(position[1]);
        }

        return [
            Number(this.raw.event.point._attributes.lon),
            Number(this.raw.event.point._attributes.lat)
        ];
    }

    sensor(sensor?: Static<typeof SensorAttributes>): Static<typeof Polygon> | null {
        if (!this.raw.event.detail) this.raw.event.detail = {};

        if (sensor) {
            this.raw.event.detail.sensor = {
                _attributes: sensor
            }
        }

        if (!this.raw.event.detail.sensor || !this.raw.event.detail.sensor._attributes) {
            return null;
        }

        return new Sensor(
            this.position(),
            this.raw.event.detail.sensor._attributes
        ).to_geojson();
    };

    addLink(link: Static<typeof LinkAttributes>): CoT {
        if (!this.raw.event.detail) this.raw.event.detail = {};

        let linkArr: Array<Static<typeof Link>> = [];
        if (this.raw.event.detail.link && !Array.isArray(this.raw.event.detail.link)) {
            linkArr = [this.raw.event.detail.link]
        } else if (this.raw.event.detail.link && Array.isArray(this.raw.event.detail.link)) {
            linkArr = this.raw.event.detail.link;
        }

        linkArr.push({ _attributes: link });

        this.raw.event.detail.link = linkArr;

        return this;
    }

    /**
     * Return an ATAK Compliant Protobuf
     */
    to_proto(version = 1): Uint8Array {
        if (version < 1 || version > 1) throw new Err(400, null, `Unsupported Proto Version: ${version}`);
        const ProtoMessage = RootMessage.lookupType(`atakmap.commoncommo.protobuf.v${version}.TakMessage`)

        // The spread operator is important to make sure the delete doesn't modify the underlying detail object
        const detail = { ...this.raw.event.detail };

        const msg: any = {
            cotEvent: {
                ...this.raw.event._attributes,
                sendTime: new Date(this.raw.event._attributes.time).getTime(),
                startTime: new Date(this.raw.event._attributes.start).getTime(),
                staleTime: new Date(this.raw.event._attributes.stale).getTime(),
                ...this.raw.event.point._attributes,
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

        msg.cotEvent.detail.xmlDetail = xmljs.js2xml({
            ...detail,
            metadata: this.metadata
        }, { compact: true });

        return ProtoMessage.encode(msg).finish();
    }

    /**
     * Return a GeoJSON Feature from an XML CoT message
     */
    to_geojson(): Static<typeof Feature> {
        const raw: Static<typeof JSONCoT> = JSON.parse(JSON.stringify(this.raw));
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

        if (raw.event.detail.remarks && raw.event.detail.remarks._text) {
            feat.properties.remarks = raw.event.detail.remarks._text;
        }

        if (raw.event.detail.fileshare) {
            feat.properties.fileshare = raw.event.detail.fileshare._attributes;
            if (feat.properties.fileshare && typeof feat.properties.fileshare.sizeInBytes === 'string') {
                feat.properties.fileshare.sizeInBytes = parseInt(feat.properties.fileshare.sizeInBytes)
            }
        }

        if (raw.event.detail.sensor) {
            feat.properties.sensor = raw.event.detail.sensor._attributes;
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

        if (['u-d-f', 'u-d-r', 'b-m-r'].includes(raw.event._attributes.type) && Array.isArray(raw.event.detail.link)) {
            const coordinates = [];

            for (const l of raw.event.detail.link) {
                if (!l._attributes.point) continue;
                coordinates.push(l._attributes.point.split(',').map((p: string) => { return Number(p.trim()) }).splice(0, 2).reverse());
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

            if (raw.event._attributes.type === 'u-d-r' || (coordinates[0][0] === coordinates[coordinates.length -1][0] && coordinates[0][1] === coordinates[coordinates.length -1][1])) {
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
        } else if (raw.event._attributes.type.startsWith('u-d-c-c')) {
            if (!raw.event.detail.shape) throw new Err(400, null, 'u-d-c-c (Circle) must define shape value')
            if (
                !raw.event.detail.shape.ellipse
                || !raw.event.detail.shape.ellipse._attributes
            ) throw new Err(400, null, 'u-d-c-c (Circle) must define ellipse shape value')

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

        if (raw.event.detail.color && raw.event.detail.color._attributes && raw.event.detail.color._attributes.argb) {
            const color = new Color(Number(raw.event.detail.color._attributes.argb));
            feat.properties['marker-color'] = color.as_hex();
            feat.properties['marker-opacity'] = color.as_opacity() / 255;
        }

        feat.properties.metadata = this.metadata;
        feat.path = this.path;

        return feat;
    }

    to_xml(): string {
        return xmljs.js2xml(this.raw, { compact: true });
    }

    /**
     * Determines if the CoT message represents a Tasking Message
     *
     * @return {boolean}
     */
    is_tasking(): boolean {
        return !!this.raw.event._attributes.type.match(/^t-/)
    }

    /**
     * Determines if the CoT message represents a Chat Message
     *
     * @return {boolean}
     */
    is_chat(): boolean {
        return !!(this.raw.event.detail && this.raw.event.detail.__chat);
    }

    /**
     * Determines if the CoT message represents a Friendly Element
     *
     * @return {boolean}
     */
    is_friend(): boolean {
        return !!this.raw.event._attributes.type.match(/^a-f-/)
    }

    /**
     * Determines if the CoT message represents a Hostile Element
     *
     * @return {boolean}
     */
    is_hostile(): boolean {
        return !!this.raw.event._attributes.type.match(/^a-h-/)
    }

    /**
     * Determines if the CoT message represents a Unknown Element
     *
     * @return {boolean}
     */
    is_unknown(): boolean {
        return !!this.raw.event._attributes.type.match(/^a-u-/)
    }

    /**
     * Determines if the CoT message represents a Pending Element
     *
     * @return {boolean}
     */
    is_pending(): boolean {
        return !!this.raw.event._attributes.type.match(/^a-p-/)
    }

    /**
     * Determines if the CoT message represents an Assumed Element
     *
     * @return {boolean}
     */
    is_assumed(): boolean {
        return !!this.raw.event._attributes.type.match(/^a-a-/)
    }

    /**
     * Determines if the CoT message represents a Neutral Element
     *
     * @return {boolean}
     */
    is_neutral(): boolean {
        return !!this.raw.event._attributes.type.match(/^a-n-/)
    }

    /**
     * Determines if the CoT message represents a Suspect Element
     *
     * @return {boolean}
     */
    is_suspect(): boolean {
        return !!this.raw.event._attributes.type.match(/^a-s-/)
    }

    /**
     * Determines if the CoT message represents a Joker Element
     *
     * @return {boolean}
     */
    is_joker(): boolean {
        return !!this.raw.event._attributes.type.match(/^a-j-/)
    }

    /**
     * Determines if the CoT message represents a Faker Element
     *
     * @return {boolean}
     */
    is_faker(): boolean {
        return !!this.raw.event._attributes.type.match(/^a-k-/)
    }

    /**
     * Determines if the CoT message represents an Element
     *
     * @return {boolean}
     */
    is_atom(): boolean {
        return !!this.raw.event._attributes.type.match(/^a-/)
    }

    /**
     * Determines if the CoT message represents an Airborne Element
     *
     * @return {boolean}
     */
    is_airborne(): boolean {
        return !!this.raw.event._attributes.type.match(/^a-.-A/)
    }

    /**
     * Determines if the CoT message represents a Ground Element
     *
     * @return {boolean}
     */
    is_ground(): boolean {
        return !!this.raw.event._attributes.type.match(/^a-.-G/)
    }

    /**
     * Determines if the CoT message represents an Installation
     *
     * @return {boolean}
     */
    is_installation(): boolean {
        return !!this.raw.event._attributes.type.match(/^a-.-G-I/)
    }

    /**
     * Determines if the CoT message represents a Vehicle
     *
     * @return {boolean}
     */
    is_vehicle(): boolean {
        return !!this.raw.event._attributes.type.match(/^a-.-G-E-V/)
    }

    /**
     * Determines if the CoT message represents Equipment
     *
     * @return {boolean}
     */
    is_equipment(): boolean {
        return !!this.raw.event._attributes.type.match(/^a-.-G-E/)
    }

    /**
     * Determines if the CoT message represents a Surface Element
     *
     * @return {boolean}
     */
    is_surface(): boolean {
        return !!this.raw.event._attributes.type.match(/^a-.-S/)
    }

    /**
     * Determines if the CoT message represents a Subsurface Element
     *
     * @return {boolean}
     */
    is_subsurface(): boolean {
        return !!this.raw.event._attributes.type.match(/^a-.-U/)
    }

    /**
     * Determines if the CoT message represents a UAV Element
     *
     * @return {boolean}
     */
    is_uav(): boolean {
        return !!this.raw.event._attributes.type.match(/^a-f-A-M-F-Q-r/)
    }

    /**
     * Parse an ATAK compliant Protobuf to a JS Object
     */
    static from_proto(raw: Uint8Array, version = 1): CoT {
        const ProtoMessage = RootMessage.lookupType(`atakmap.commoncommo.protobuf.v${version}.TakMessage`)

        // TODO Type this
        const msg: any = ProtoMessage.decode(raw);

        if (!msg.cotEvent) throw new Err(400, null, 'No cotEvent Data');

        const detail: Record<string, any> = {};
        const metadata: Record<string, unknown> = {};
        for (const key in msg.cotEvent.detail) {
            if (key === 'xmlDetail') {
                const parsed: any = xmljs.xml2js(`<detail>${msg.cotEvent.detail.xmlDetail}</detail>`, { compact: true });
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
        });

        cot.metadata = metadata;

        return cot;
    }

    /**
     * Return a CoT Message
     */
    static ping(): CoT {
        return new CoT({
            event: {
                _attributes: Util.cot_event_attr('t-x-c-t', 'h-g-i-g-o'),
                detail: {},
                point: Util.cot_point()
            }
        });
    }

    /**
     * Return an CoT Message given a GeoJSON Feature
     *
     * @param {Object} feature GeoJSON Point Feature
     *
     * @return {CoT}
     */
    static from_geojson(feature: Static<typeof InputFeature>): CoT {
        checkFeat(feature);
        if (checkFeat.errors) throw new Err(400, null, `${checkFeat.errors[0].message} (${checkFeat.errors[0].instancePath})`);

        const cot: Static<typeof JSONCoT> = {
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
        if (!cot.event.detail) cot.event.detail = {};

        if (feature.properties.droid) {
            cot.event.detail.uid = { _attributes: { Droid: feature.properties.droid } };
        }

        if (feature.properties.archived) {
            cot.event.detail.archive = { _attributes: { } };
        }

        if (feature.properties.links) {
            if (!cot.event.detail.link) cot.event.detail.link = [];
            else if (!Array.isArray(cot.event.detail.link)) cot.event.detail.link = [cot.event.detail.link];

            cot.event.detail.link.push(...feature.properties.links.map((link: Static<typeof LinkAttributes>) => {
                return { _attributes: link };
            }))
        }

        if (feature.properties.dest) {
            const dest = !Array.isArray(feature.properties.dest) ? [ feature.properties.dest ] : feature.properties.dest;

            cot.event.detail.marti = {
                dest: dest.map((dest) => {
                    return { _attributes: { ...dest } };
                })
            }
        }

        if (feature.properties.takv) {
            cot.event.detail.takv = { _attributes: { ...feature.properties.takv } };
        }

        if (feature.properties.geofence) {
            cot.event.detail.__geofence = { _attributes: { ...feature.properties.geofence } };
        }

        if (feature.properties.sensor) {
            cot.event.detail.sensor = { _attributes: { ...feature.properties.sensor } };
        }

        if (feature.properties.ackrequest) {
            cot.event.detail.ackrequest = { _attributes: { ...feature.properties.ackrequest } };
        }

        if (feature.properties.video) {
            if (feature.properties.video.connection) {
                const video = JSON.parse(JSON.stringify(feature.properties.video));

                const connection = video.connection;
                delete video.connection;

                cot.event.detail.__video = {
                    _attributes: { ...video },
                    ConnectionEntry: {
                        _attributes: connection
                    }
                }
            } else {
                cot.event.detail.__video = { _attributes: { ...feature.properties.video } };
            }
        }

        if (feature.properties.attachments) {
            cot.event.detail.attachment_list = { _attributes: { hashes: JSON.stringify(feature.properties.attachments) } };
        }

        if (feature.properties.contact) {
            cot.event.detail.contact = {
                _attributes: {
                    ...feature.properties.contact,
                    callsign: feature.properties.callsign || 'UNKNOWN',
                }
            };
        }

        if (feature.properties.fileshare) {
            cot.event.detail.fileshare = { _attributes: { ...feature.properties.fileshare } };
        }

        if (feature.properties.course !== undefined || feature.properties.speed !== undefined || feature.properties.slope !== undefined) {
            cot.event.detail.track = {
                _attributes: Util.cot_track_attr(feature.properties.course, feature.properties.speed, feature.properties.slope)
            }
        }

        if (feature.properties.group) {
            cot.event.detail.__group = { _attributes: { ...feature.properties.group } }
        }

        if (feature.properties.flow) {
            cot.event.detail['_flow-tags_'] = { _attributes: { ...feature.properties.flow } }
        }

        if (feature.properties.status) {
            cot.event.detail.status = { _attributes: { ...feature.properties.status } }
        }

        if (feature.properties.precisionlocation) {
            cot.event.detail.precisionlocation = { _attributes: { ...feature.properties.precisionlocation } }
        }

        if (feature.properties.icon) {
            cot.event.detail.usericon = { _attributes: { iconsetpath: feature.properties.icon } }
        }

        if (feature.properties.mission) {
            cot.event.detail.mission = {
                _attributes: {
                    type: feature.properties.mission.type,
                    guid: feature.properties.mission.guid,
                    tool: feature.properties.mission.tool,
                    name: feature.properties.mission.name,
                    authorUid: feature.properties.mission.authorUid,
                }
            }

            if (feature.properties.mission.missionLayer) {
                cot.event.detail.mission.missionLayer = {};

                if (feature.properties.mission.missionLayer.name) {
                    cot.event.detail.mission.missionLayer.name = { _text: feature.properties.mission.missionLayer.name };
                }

                if (feature.properties.mission.missionLayer.parentUid) {
                    cot.event.detail.mission.missionLayer.parentUid = { _text: feature.properties.mission.missionLayer.parentUid };
                }

                if (feature.properties.mission.missionLayer.type) {
                    cot.event.detail.mission.missionLayer.type = { _text: feature.properties.mission.missionLayer.type };
                }

                if (feature.properties.mission.missionLayer.uid) {
                    cot.event.detail.mission.missionLayer.uid = { _text: feature.properties.mission.missionLayer.uid };
                }
            }
        }

        cot.event.detail.remarks = { _attributes: { }, _text: feature.properties.remarks || '' };

        if (!feature.geometry) {
            throw new Err(400, null, 'Must have Geometry');
        } else if (!['Point', 'Polygon', 'LineString'].includes(feature.geometry.type)) {
            throw new Err(400, null, 'Unsupported Geometry Type');
        }

        if (feature.geometry.type === 'Point') {
            cot.event.point._attributes.lon = String(feature.geometry.coordinates[0]);
            cot.event.point._attributes.lat = String(feature.geometry.coordinates[1]);
            cot.event.point._attributes.hae = String(feature.geometry.coordinates[2] || '0.0');


            if (feature.properties['marker-color']) {
                const color = new Color(feature.properties['marker-color'] || -1761607936);
                color.a = feature.properties['marker-opacity'] !== undefined ? feature.properties['marker-opacity'] * 255 : 128;
                cot.event.detail.color = { _attributes: { argb: String(color.as_32bit()) } };
            }
        } else if (feature.geometry.type === 'Polygon' && feature.properties.type === 'u-d-c-c') {
            if (!feature.properties.shape || !feature.properties.shape.ellipse) {
                throw new Err(400, null, 'u-d-c-c (Circle) must define a feature.properties.shape.ellipse property')
            }
            cot.event.detail.shape = { ellipse: { _attributes: feature.properties.shape.ellipse } }

            if (feature.properties.center) {
                cot.event.point._attributes.lon = String(feature.properties.center[0]);
                cot.event.point._attributes.lat = String(feature.properties.center[1]);
            } else {
                const centre = PointOnFeature(feature as AllGeoJSON);
                cot.event.point._attributes.lon = String(centre.geometry.coordinates[0]);
                cot.event.point._attributes.lat = String(centre.geometry.coordinates[1]);
                cot.event.point._attributes.hae = '0.0';
            }
        } else if (['Polygon', 'LineString'].includes(feature.geometry.type)) {
            const stroke = new Color(feature.properties.stroke || -1761607936);
            stroke.a = feature.properties['stroke-opacity'] !== undefined ? feature.properties['stroke-opacity'] * 255 : 128;
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

                if (!cot.event.detail.link) cot.event.detail.link = [];
                else if (!Array.isArray(cot.event.detail.link)) cot.event.detail.link = [cot.event.detail.link]

                for (const coord of feature.geometry.coordinates) {
                    cot.event.detail.link.push({
                        _attributes: { point: `${coord[1]},${coord[0]}` }
                    });
                }
            } else if (feature.geometry.type === 'Polygon') {
                cot.event._attributes.type = 'u-d-f';

                if (!cot.event.detail.link) cot.event.detail.link = [];
                else if (!Array.isArray(cot.event.detail.link)) cot.event.detail.link = [cot.event.detail.link]

                // Inner rings are not yet supported
                for (const coord of feature.geometry.coordinates[0]) {
                    cot.event.detail.link.push({
                        _attributes: { point: `${coord[1]},${coord[0]}` }
                    });
                }

                const fill = new Color(feature.properties.fill || -1761607936);
                fill.a = feature.properties['fill-opacity'] !== undefined ? feature.properties['fill-opacity'] * 255 : 128;
                cot.event.detail.fillColor = { _attributes: { value: String(fill.as_32bit()) } };
            }

            cot.event.detail.labels_on = { _attributes: { value: 'false' } };
            cot.event.detail.tog = { _attributes: { enabled: '0' } };

            if (feature.properties.center && Array.isArray(feature.properties.center) && feature.properties.center.length >= 2) {
                cot.event.point._attributes.lon = String(feature.properties.center[0]);
                cot.event.point._attributes.lat = String(feature.properties.center[1]);

                if (feature.properties.center.length >= 3) {
                    cot.event.point._attributes.hae = String(feature.properties.center[2] || '0.0');
                } else {
                    cot.event.point._attributes.hae = '0.0';
                }
            } else {
                const centre = PointOnFeature(feature as AllGeoJSON);
                cot.event.point._attributes.lon = String(centre.geometry.coordinates[0]);
                cot.event.point._attributes.lat = String(centre.geometry.coordinates[1]);
                cot.event.point._attributes.hae = '0.0';
            }
        }

        const newcot = new CoT(cot);

        if (feature.properties.metadata) {
            newcot.metadata = feature.properties.metadata
        }

        if (feature.path) {
            newcot.path = feature.path
        }

        return newcot;
    }

}
