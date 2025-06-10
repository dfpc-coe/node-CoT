import crypto from 'node:crypto';
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
    CreatorAttributes,
    VideoAttributes,
    SensorAttributes,
    VideoConnectionEntryAttributes,
} from './types/types.js'
import {
    InputFeature,
} from './types/feature.js';
import Sensor from './sensor.js';
import Truncate from '@turf/truncate';
import { destination } from '@turf/destination';
import Ellipse from '@turf/ellipse';
import Util from './utils/util.js';
import Color from './utils/color.js';
import JSONCoT, { Detail } from './types/types.js'

// GeoJSON Geospatial ops will truncate to the below
const COORDINATE_PRECISION = 6;


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

    constructor(
        cot: Static<typeof JSONCoT>,
        opts: {
            creator?: CoT | {
                uid: string,
                type: string,
                callsign: string,
                time?: Date | string,
            }
        } = {}
    ) {
        this.raw = cot;

        this.metadata = {};
        this.path = '/';

        if (!this.raw.event) this.raw.event = {};
        if (!this.raw.event._attributes.uid) this.raw.event._attributes.uid = Util.cot_uuid();

        if (!this.raw.event.detail) this.raw.event.detail = {};

        if (this.raw.event.detail.archive && Object.keys(this.raw.event.detail.archive).length === 0) {
            this.raw.event.detail.archive = { _attributes: {} };
        }

        if (opts.creator) {
            this.creator({
                uid: opts.creator instanceof CoT ? opts.creator.uid() : opts.creator.uid,
                type: opts.creator instanceof CoT ? opts.creator.type() : opts.creator.type,
                callsign: opts.creator instanceof CoT ? opts.creator.callsign() : opts.creator.callsign,
                time: opts.creator instanceof CoT ? new Date() : opts.creator.time
            });
        }

        if (process.env.DEBUG_COTS) console.log(JSON.stringify(this.raw))
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
     * Returns or sets the UID of the CoT
     */
    uid(uid?: string): string {
        if (uid) this.raw.event._attributes.uid = uid;
        return this.raw.event._attributes.uid;
    }

    /**
     * Returns or sets the Callsign of the CoT
     */
    type(type?: string): string {
        if (type) {
            this.raw.event._attributes.type = type;
        }

        return this.raw.event._attributes.type;
    }

    /**
     * Returns or sets the Archived State of the CoT
     *
     * @param callsign - Optional Archive state to set
     */
    archived(archived?: boolean): boolean {
        const detail = this.detail();

        if (archived === true) {
            detail.archive = { _attributes: { } };
        } else if (archived === false) {
            delete detail.archive;
        }

        return detail.archive !== undefined;
    }

    /**
     * Returns or sets the Callsign of the CoT
     *
     * @param callsign - Optional Callsign to set
     */
    callsign(callsign?: string): string {
        const detail = this.detail();

        if (callsign && !detail.contact) {
            detail.contact = { _attributes: { callsign } };
        } else if (callsign && detail.contact) {
            detail.contact._attributes.callsign = callsign;
        }

        if (detail.contact && detail.contact._attributes && typeof detail.contact._attributes.callsign === 'string') {
            return detail.contact._attributes.callsign;
        } else {
            return 'UNKNOWN'
        }
    }

    /**
     * Return Detail Object of CoT or create one if it doesn't yet exist and pass a reference
     */
    detail(): Static<typeof Detail> {
        if (!this.raw.event.detail) this.raw.event.detail = {};
        return this.raw.event.detail;
    }

    /**
     * Add a given Dest tag to a CoT
     */
    addDest(dest: Static<typeof MartiDestAttributes>): CoT {
        const detail = this.detail();

        if (!detail.marti) detail.marti = {};

        let destArr: Array<Static<typeof MartiDest>> = [];
        if (detail.marti.dest && !Array.isArray(detail.marti.dest)) {
            destArr = [detail.marti.dest]
        } else if (detail.marti.dest && Array.isArray(detail.marti.dest)) {
            destArr = detail.marti.dest;
        }

        destArr.push({ _attributes: dest });

        detail.marti.dest = destArr;

        return this;
    }

    addVideo(
        video: Static<typeof VideoAttributes>,
        connection?: Static<typeof VideoConnectionEntryAttributes>
    ): CoT {
        const detail = this.detail();
        if (detail.__video) throw new Err(400, null, 'A video stream already exists on this CoT');

        if (!video.url) throw new Err(400, null, 'A Video URL must be provided');

        if (!video.uid && connection && connection.uid) {
            video.uid = connection.uid
        } else if (video.uid && connection && !connection.uid) {
            connection.uid = video.uid;
        } else if (!video.uid) {
            video.uid = crypto.randomUUID();
        }

        detail.__video = {
            _attributes: video
        };

        if (connection) {
            detail.__video.ConnectionEntry = {
                _attributes: connection
            }
        } else {
            detail.__video.ConnectionEntry = {
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
        const detail = this.detail();

        if (sensor) {
            detail.sensor = {
                _attributes: sensor
            }
        }

        if (!detail.sensor || !detail.sensor._attributes) {
            return null;
        }

        return new Sensor(
            this.position(),
            detail.sensor._attributes
        ).to_geojson();
    };

    creator(
        creator?: {
            uid: string,
            type: string,
            callsign: string,
            time: Date | string | undefined,
        }
    ): Static<typeof CreatorAttributes> | undefined {
        const detail = this.detail();

        if (creator) {
            this.addLink({
                uid: creator.uid,
                production_time: creator.time ? new Date(creator.time).toISOString() : new Date().toISOString(),
                type: creator.type,
                parent_callsign: creator.callsign,
                relation: 'p-p'
            });

            detail.creator = {
                _attributes: {
                    ...creator,
                    time: creator.time ? new Date(creator.time).toISOString() : new Date().toISOString(),
                }
            };
        }

        if (detail.creator) {
            return detail.creator._attributes;
        } else {
            return;
        }
    }

    addLink(link: Static<typeof LinkAttributes>): CoT {
        const detail = this.detail();

        let linkArr: Array<Static<typeof Link>> = [];
        if (detail.link && !Array.isArray(detail.link)) {
            linkArr = [detail.link]
        } else if (detail.link && Array.isArray(detail.link)) {
            linkArr = detail.link;
        }

        linkArr.push({ _attributes: link });

        detail.link = linkArr;

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

        if (this.creator()) {
            feat.properties.creator = this.creator();
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

        // Line or Polygon style types
        if (['u-d-f', 'u-d-r', 'b-m-r', 'u-rb-a'].includes(raw.event._attributes.type) && Array.isArray(raw.event.detail.link)) {
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

            // Range & Bearing Line
            if (raw.event._attributes.type === 'u-rb-a') {
                const detail = this.detail();

                if (!detail.range) throw new Error('Range value not provided')
                if (!detail.bearing) throw new Error('Bearing value not provided')

                // TODO Support inclination
                const dest = destination(
                    this.position(),
                    detail.range._attributes.value / 1000,
                    detail.bearing._attributes.value
                ).geometry.coordinates;

                feat.geometry = {
                    type: 'LineString',
                    coordinates: [this.position(), dest]
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

    is_stale(): boolean {
        return new Date(this.raw.event._attributes.stale) < new Date();
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
}
