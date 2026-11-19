import protobuf from 'protobufjs';
import Err from '@openaddresses/batch-error';
import { xml2js, js2xml } from '@tak-ps/xml-js';
import { diff } from 'json-diff-ts';
import type { Static } from '@sinclair/typebox';
import { from_geojson } from './parser/from_geojson.js';
import { normalize_geojson } from './parser/normalize_geojson.js';
import { to_geojson } from './parser/to_geojson.js';
import type { ToGeoJSONOptions } from './parser/to_geojson.js';
export type { ToGeoJSONOptions } from './parser/to_geojson.js';
import type {
    Feature,
} from './types/feature.js';
import type {
    GeoJSONFeature,
} from './types/geojson.js';
import {
    InputFeature,
} from './types/feature.js';
import { hasUnclosedElements, normalizeBooleanAttributeValues } from './parser-normalize.js';
import JSONCoT, { Detail } from './types/types.js'
import CoT from './cot.js';
import type { CoTOptions } from './cot.js';
import AJV from 'ajv';
import fs from 'fs';
import path from 'node:path';

const protoPath = path.join(import.meta.dirname, 'proto', 'takmessage.proto');
const RootMessage = await protobuf.load(protoPath);

function isObject(input: unknown): input is Record<string, unknown> {
    return typeof input === 'object' && input !== null;
}

const pkg: unknown = JSON.parse(String(fs.readFileSync(new URL('../package.json', import.meta.url))));
const pkgVersion = isObject(pkg) ? String(pkg.version) : 'undefined';

const checkXML = (new AJV({
    allErrors: true,
    coerceTypes: true,
    allowUnionTypes: true
}))
    .compile(JSONCoT);

export interface SerializerOptions {
    resetFlow: boolean
}

export interface CoTParseError {
    error: string;
    event: unknown;
}

interface ProtoLong {
    toNumber: () => number;
}

function isProtoLong(input: unknown): input is ProtoLong {
    return isObject(input) && typeof input.toNumber === 'function';
}

function protoTime(input: unknown): string {
    if (!isProtoLong(input)) throw new Err(400, null, 'Invalid cotEvent Time');
    return new Date(input.toNumber()).toISOString();
}

function toArray(input: unknown): unknown[] {
    if (Array.isArray(input)) return input;
    return [input];
}

function unvalidated(input: unknown): Static<typeof JSONCoT> {
    // oxlint-disable-next-line typescript/no-unsafe-type-assertion
    return input as Static<typeof JSONCoT>;
}

function stripServerFlowTags(tags: Record<string, unknown>): void {
    for (const key of Object.keys(tags)) {
        if (key !== '_attributes' && key.startsWith('TAK-Server')) {
            delete tags[key];
        }
    }
}

function resetFlowTags(cot: CoT): void {
    const flowTags: unknown = cot.raw.event.detail?.['_flow-tags_'];

    if (!isObject(flowTags) || Array.isArray(flowTags)) {
        return;
    }

    stripServerFlowTags(flowTags);

    if (isObject(flowTags._attributes) && !Array.isArray(flowTags._attributes)) {
        stripServerFlowTags(flowTags._attributes);
    }

    flowTags[`NodeCoT-${pkgVersion}`] = new Date().toISOString();
}

/**
 * Convert to and from an XML CoT message
 * @class
 *
 * @param cot A string/buffer containing the XML representation or the xml-js object tree
 *
 * @prop raw Raw XML-JS representation of CoT
 */
// XML detail element => first-class TakMessage Detail field
const PROTO_DETAIL_FIELDS: Record<string, string> = {
    contact: 'contact',
    precisionlocation: 'precisionLocation',
    status: 'status',
    takv: 'takv',
    track: 'track'
};

const PROTO_DETAIL_ELEMENTS: Record<string, string> = Object.fromEntries(
    Object.entries(PROTO_DETAIL_FIELDS).map(([element, field]) => [field, element])
);

export class CoTParser {
    static validate(
        cot: CoT,
        opts?: {
            flow: boolean
        }
    ): CoT {
        checkXML(cot.raw);
        if (checkXML.errors) {
            throw new Err(400, null, `${checkXML.errors[0].message} (${checkXML.errors[0].instancePath})`);
        }

        if (opts?.flow ?? true) {
            cot.raw.event.detail ??= {};

            const existing: unknown = cot.raw.event.detail['_flow-tags_'];
            const flowTags = isObject(existing) ? existing : {};
            cot.raw.event.detail['_flow-tags_'] = flowTags;

            flowTags[`NodeCoT-${pkgVersion}`] = new Date().toISOString()
        }

        return cot;
    }

    /**
     * Detect difference between CoT messages
     * Note: This diffs based on GeoJSON Representation of message
     *       So if unknown properties are present they will be excluded from the diff
     */
    static async isDiff(
        aCoT: CoT,
        bCoT: CoT,
        opts?: {
            diffMetadata: boolean,
            diffStaleStartTime: boolean,
            diffDest: boolean,
            diffFlow: boolean
        }
    ): Promise<boolean> {
        const a = await this.to_geojson(aCoT) as Static<typeof InputFeature>;
        const b = await this.to_geojson(bCoT) as Static<typeof InputFeature>;

        if (!opts?.diffDest) {
            delete a.properties.dest;
            delete b.properties.dest;
        }

        if (!opts?.diffMetadata) {
            delete a.properties.metadata;
            delete b.properties.metadata;
        }

        if (!opts?.diffFlow) {
            delete a.properties.flow;
            delete b.properties.flow;
        }

        if (!opts?.diffStaleStartTime) {
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
        const str = String(raw);

        let parsed: unknown;
        try {
            parsed = xml2js(str, { compact: true });
        } catch (err) {
            console.error(`Failed to parse CoT XML: ${str}`);
            throw err;
        }

        if (hasUnclosedElements(parsed)) {
            throw new Err(400, null, 'Malformed XML: unclosed element');
        }

        normalizeBooleanAttributeValues(parsed);

        const cot = new CoT(
            unvalidated(parsed),
            opts
        );

        return this.validate(cot);
    }

    static from_xml_document(
        raw: Buffer | string,
        opts: CoTOptions = {}
    ): {
        cots: CoT[];
        invalid: CoTParseError[];
    } {
        const str = String(raw);

        let parsed: unknown;
        try {
            parsed = xml2js(str, { compact: true });
        } catch (err) {
            console.error(`Failed to parse CoT XML Document: ${str}`);
            throw err;
        }

        if (hasUnclosedElements(parsed)) {
            throw new Err(400, null, 'Malformed XML: unclosed element');
        }

        normalizeBooleanAttributeValues(parsed);

        let events: unknown[] = [];
        if (isObject(parsed)) {
            const hasEvent = Boolean(parsed.event);

            if (isObject(parsed.events) && Boolean(parsed.events.event)) {
                events = toArray(parsed.events.event);
            } else if (hasEvent) {
                events = toArray(parsed.event);
            }
        }

        const cots: CoT[] = [];
        const invalid: CoTParseError[] = [];

        for (const event of events) {
            try {
                cots.push(this.validate(
                    new CoT(unvalidated({ event: structuredClone(event) }), opts),
                    { flow: false }
                ));
            } catch (err) {
                invalid.push({
                    error: err instanceof Error ? err.message : String(err),
                    event
                });
            }
        }

        return { cots, invalid };
    }

    static to_xml(
        cot: CoT,
        opts?: SerializerOptions
    ): string {
        if (opts?.resetFlow) {
            resetFlowTags(cot);
        }

        return js2xml(cot.raw, { compact: true });
    }

    /**
     * Return an ATAK Compliant Protobuf
     */
    static async to_proto(
        cot: CoT,
        version = 1,
        opts?: SerializerOptions
    ): Promise<Uint8Array> {
        if (version !== 1) throw new Err(400, null, `Unsupported Proto Version: ${version}`);
        const ProtoMessage = RootMessage.lookupType(`atakmap.commoncommo.protobuf.v${version}.TakMessage`)

        if (opts?.resetFlow) {
            resetFlowTags(cot);
        }

        // The spread operator is important to make sure the delete doesn't modify the underlying detail object
        const detail = { ...cot.raw.event.detail };
        const protoDetail: Record<string, unknown> = {
            xmlDetail: ''
        };
        const msg = {
            cotEvent: {
                ...cot.raw.event._attributes,
                sendTime: new Date(cot.raw.event._attributes.time).getTime(),
                startTime: new Date(cot.raw.event._attributes.start).getTime(),
                staleTime: new Date(cot.raw.event._attributes.stale).getTime(),
                ...cot.raw.event.point._attributes,
                detail: protoDetail
            }
        };

        let key: keyof Static<typeof Detail>;
        for (key in detail) {
            const field = PROTO_DETAIL_FIELDS[key];
            if (field) {
                const element: unknown = detail[key];
                protoDetail[field] = isObject(element) ? element._attributes : undefined;
                delete detail[key]
            }
        }

        protoDetail.xmlDetail = js2xml({
            ...detail,
            metadata: cot.metadata
        }, { compact: true });

        return ProtoMessage.encode(msg).finish();
    }

    /**
     * Return a GeoJSON Feature from an XML CoT message
     */
    static async to_geojson(cot: CoT, opts: ToGeoJSONOptions = {}): Promise<Static<typeof Feature>> {
        return to_geojson(cot, opts);
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

        const cotEvent: unknown = ProtoMessage.decode(raw).cotEvent;

        if (!isObject(cotEvent)) throw new Err(400, null, 'No cotEvent Data');

        const protoDetail = isObject(cotEvent.detail) ? cotEvent.detail : {};

        const detail: Record<string, unknown> = {};
        const metadata: Record<string, unknown> = {};
        for (const key in protoDetail) {
            if (key === 'xmlDetail') {
                const xmlDetail = typeof protoDetail.xmlDetail === 'string' ? protoDetail.xmlDetail : '';
                const parsed: unknown = xml2js(`<detail>${xmlDetail}</detail>`, { compact: true });
                normalizeBooleanAttributeValues(parsed);
                if (isObject(parsed)) Object.assign(detail, parsed.detail);

                if (isObject(detail.metadata)) {
                    for (const metadataKey in detail.metadata) {
                        const entry = detail.metadata[metadataKey];
                        metadata[metadataKey] = isObject(entry) ? entry._text : undefined;
                    }
                    delete detail.metadata;
                }
            } else if (key === 'group' && Boolean(protoDetail[key])) {
                detail.__group = { _attributes: protoDetail[key] };
            } else if (PROTO_DETAIL_ELEMENTS[key] && Boolean(protoDetail[key])) {
                detail[PROTO_DETAIL_ELEMENTS[key]] = { _attributes: protoDetail[key] };
            }
        }

        const cot = new CoT(unvalidated({
            event: {
                _attributes: {
                    version: '2.0',
                    uid: cotEvent.uid, type: cotEvent.type, how: cotEvent.how,
                    qos: cotEvent.qos, opex: cotEvent.opex, access: cotEvent.access,
                    time: protoTime(cotEvent.sendTime),
                    start: protoTime(cotEvent.startTime),
                    stale: protoTime(cotEvent.staleTime),
                },
                detail,
                point: {
                    _attributes: {
                        lat: cotEvent.lat,
                        lon: cotEvent.lon,
                        hae: cotEvent.hae,
                        le: cotEvent.le,
                        ce: cotEvent.ce,
                    },
                }
            }
        }), opts);

        cot.metadata = metadata;

        return this.validate(cot);
    }

    static async normalize_geojson(
        feature: Static<typeof GeoJSONFeature>
    ): Promise<Static<typeof Feature>> {
        const feat = await normalize_geojson(feature);
        return feat;
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
