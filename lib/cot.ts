import { v4 as randomUUID } from 'uuid';
import Err from '@openaddresses/batch-error';
import type { Static } from '@sinclair/typebox';
import type {
    Polygon,
    Position,
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
import Sensor from './sensor.js';
import Util from './utils/util.js';
import util2525 from './utils/2525.js'
import JSONCoT, { Detail } from './types/types.js'

export type CoTOptions = {
    verbose?: boolean,
    creator?: CoT | {
        uid: string,
        type: string,
        callsign: string,
        time?: Date | string,
    },
    milsym?: {
        augment?: boolean
    }
}

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
        opts: CoTOptions = {}
    ) {
        this.raw = cot;

        this.metadata = {};
        this.path = '/';

        if (!this.raw.event._attributes.uid) {
            this.raw.event._attributes.uid = Util.cot_uuid();
        }

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

        if (opts.milsym && opts.milsym.augment && !this.raw.event.detail.__milsym) {
            if (util2525.is2525BConvertable(this.raw.event._attributes.type)) {
                try {
                    this.raw.event.detail.__milicon = {
                        _attributes: {
                            id: util2525.to2525D(this.raw.event._attributes.type)
                        }
                    }
                } catch (err) {
                    console.warn(`Failed to augment CoT (${this.raw.event._attributes.type}) with 2525D MilIcon ID`, err);
                }
            }
        }

        if (process.env.DEBUG_COTS) console.log(JSON.stringify(this.raw))
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
            video.uid = randomUUID();
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
            this.raw.event.point._attributes.lon = position[0];
            this.raw.event.point._attributes.lat = position[1];
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
