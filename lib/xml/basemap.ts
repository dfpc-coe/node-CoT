import Err from '@openaddresses/batch-error';
import XMLDocument from '../xml-document.js';
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
    static parse(input: string): Basemap {
        const basemap = super.check<BasemapType>(input, checkBasemap);
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
    } {
        if (!this.raw.customMapSource) throw new Err(400, null, 'Unknown Basemap Type');
        if (!this.raw.customMapSource.url) throw new Err(400, null, 'Unknown Basemap Type - Missing URL');
    
        return {
            name: this.raw.customMapSource.name ? this.raw.customMapSource.name._text : undefined,
            url: this.raw.customMapSource.url._text,
            minZoom: this.raw.customMapSource.minZoom ? Number(this.raw.customMapSource.minZoom._text) : undefined,
            maxZoom: this.raw.customMapSource.maxZoom ? Number(this.raw.customMapSource.maxZoom._text) : undefined,
            tileType: this.raw.customMapSource.tileType ? this.raw.customMapSource.tileType._text : undefined,
            tileUpdate: this.raw.customMapSource.tileUpdate ? this.raw.customMapSource.tileUpdate._text : undefined,
            backgroundColor: this.raw.customMapSource.backgroundColor ? this.raw.customMapSource.backgroundColor._text : undefined
        }
    }
}
