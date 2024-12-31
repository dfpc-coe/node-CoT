import Err from '@openaddresses/batch-error';
import type { ValidateFunction } from 'ajv';
import xmljs from 'xml-js';

/**
 * Core XML Document support used for XML fortatted DataPackages documents
 * such as Iconsets or Basemaps
 */
export default class XMLDocument<T> {
    raw: T;

    constructor(raw: T) {
        this.raw = raw;
    }
    
    static check<U>(input: string, check: ValidateFunction<unknown>): U {
        const xml = xmljs.xml2js(input, { compact: true })

        check(xml);
        if (check.errors) throw new Err(400, null, `${check.errors[0].message} (${check.errors[0].instancePath})`);

        return xml as U;
    }

    to_xml(): string {
        return xmljs.js2xml(this.raw as xmljs.Element, { compact: true });
    }
}
