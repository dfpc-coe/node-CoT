import Err from '@openaddresses/batch-error';
import XMLDocument from '../xml-document.js';
import { toNumber } from '../utils/util.js';
import type { Static } from '@sinclair/typebox'
import BasemapSchema from '../types/basemap.js';
import AJV from 'ajv';

const checkBasemap = (new AJV({
    allErrors: true,
    coerceTypes: true,
    allowUnionTypes: true
}))
    .compile(BasemapSchema);

type BasemapType = Static<typeof BasemapSchema>;

/**
 * Helper class for creating and parsing Basemap XML documents
 */
export class Basemap extends XMLDocument<BasemapType> {
    /**
     * Return a Basemap from a string XML representation
     */
    static parse(input: string | Buffer): Basemap {
        const basemap = super.check<BasemapType>(String(input), checkBasemap);
        return new Basemap(basemap);
    }

    to_json(): {
        name: string | undefined
        url: string;
        minZoom: number | undefined;
        maxZoom: number | undefined;
        tileType: string | undefined;
        tileUpdate: string | undefined;
        backgroundColor: string | undefined;
        serverParts: string | undefined;
    } {
        if (this.raw.customMapSource === undefined) throw new Err(400, null, 'Unknown Basemap Type');
        if (this.raw.customMapSource.url === undefined) throw new Err(400, null, 'Unknown Basemap Type - Missing URL');

        return {
            name: this.raw.customMapSource.name?._text,
            url: this.raw.customMapSource.url._text,
            minZoom: this.raw.customMapSource.minZoom !== undefined ? toNumber(this.raw.customMapSource.minZoom._text) : undefined,
            maxZoom: this.raw.customMapSource.maxZoom !== undefined ? toNumber(this.raw.customMapSource.maxZoom._text) : undefined,
            tileType: this.raw.customMapSource.tileType?._text,
            tileUpdate: this.raw.customMapSource.tileUpdate?._text,
            backgroundColor: this.raw.customMapSource.backgroundColor?._text,
            serverParts: this.raw.customMapSource.serverParts?._text,
        }
    }
}
