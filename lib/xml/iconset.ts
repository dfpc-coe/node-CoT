import XMLDocument from '../xml-document.js';
import type { Static } from '@sinclair/typebox'
import IconsetSchema, { IconsetAttributes, IconAttributes } from '../types/iconset.js';
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

    get uid() {
        return this.raw.iconset._attributes.uid;
    }

    get name() {
        return this.raw.iconset._attributes.name;
    }

    icons(): Set<Static<typeof IconAttributes>> {
        const icons = new Set<Static<typeof IconAttributes>>();
        for (const icon of Array.isArray(this.raw.iconset.icon) ? this.raw.iconset.icon : [ this.raw.iconset.icon ]) {
            icons.add(icon._attributes);
        }

        return icons;
    }

    to_json(): Static<typeof IconsetAttributes> {
        const iconset: Static<typeof IconsetAttributes> = {
            uid: this.raw.iconset._attributes.uid,
            version: this.raw.iconset._attributes.version,
            name: this.raw.iconset._attributes.name,
            skip_resize: this.raw.iconset._attributes.skip_resize === undefined ? false : this.raw.iconset._attributes.skip_resize,
            default_group: this.raw.iconset._attributes.default_group,
            default_friendly: this.raw.iconset._attributes.default_friendly,
            default_hostile: this.raw.iconset._attributes.default_hostile,
            default_neutral: this.raw.iconset._attributes.default_neutral,
            default_unknown: this.raw.iconset._attributes.default_unknown
        };

        return iconset;
    }
}
