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
}
