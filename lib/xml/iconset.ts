import XMLDocument from '../xml-document.js';
import type { Static } from '@sinclair/typebox'
import IconsetSchema from '../types/iconset.js';
import AJV from 'ajv';

const checkIconset = (new AJV({
    allErrors: true,
    coerceTypes: true,
    allowUnionTypes: true
}))
    .compile(IconsetSchema);

type IconsetType = Static<typeof IconsetSchema>;

/**
 * Helper class for creating and parsing Iconset XML documents
 */
export class Iconset extends XMLDocument<IconsetType> {
    /**
     * Return an Iconset from a string XML representation
     */
    static parse(input: string | Buffer): Iconset {
        const basemap = super.check<IconsetType>(String(input), checkIconset);
        return new Iconset(basemap);
    }
}
