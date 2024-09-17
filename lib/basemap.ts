import type { Static } from '@sinclair/typebox'
import Err from '@openaddresses/batch-error';
import BasemapType from './types/basemap.js';
import xmljs from 'xml-js';
import AJV from 'ajv';

const checkBasemap = (new AJV({
    allErrors: true,
    coerceTypes: true,
    allowUnionTypes: true
}))
    .compile(BasemapType);

/**
 * Helper class for creating and parsing Basemap XML documents
 */
export class Basemap {
    basemap: Static<typeof BasemapType>;

    constructor(basemap: Static<typeof BasemapType>) {
        this.basemap = basemap;
    }

    /**
     * Return a Basemap from a string XML representation
     */
    static async parse(input: string): Promise<Basemap> {
        const xml = xmljs.xml2js(input, { compact: true })

        checkBasemap(xml);
        if (checkBasemap.errors) throw new Err(400, null, `${checkBasemap.errors[0].message} (${checkBasemap.errors[0].instancePath})`);
        const basemap = xml as Static<typeof BasemapType>;

        return new Basemap(basemap);
    }
}
