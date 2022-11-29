import { v4 as uuidv4 } from 'uuid';

/**
 * Helper functions for generating CoT data
 * @class
 */
export default class Util {
    /**
     * Return an event._attributes object with as many defaults as possible
     *
     * @param {String} type CoT Type
     * @param {String} how CoT how
     *
     * @returns {Object}
     */
    static cot_event_attr(type, how) {
        if (!type) throw new Error('type param required');
        if (!how) throw new Error('how param required');

        return {
            ...Util.cot_version(),
            ...Util.cot_uuid(),
            type,
            how,
            ...Util.cot_date()
        };
    }

    /**
     * Generate a random UUID
     *
     * @returns {Object}
     */
    static cot_uuid() {
        return {
            uid: uuidv4()
        };
    }

    /**
     * Return the current version number this library supports
     *
     * @returns {Object}
     */
    static cot_version() {
        return {
            version: '2.0'
        };
    }

    /**
     * Generate Null Island CoT point object
     *
     * @returns {Object}
     */
    static cot_point() {
        return {
            '_attributes': {
                'lat': '0.000000',
                'lon': '0.000000',
                'hae': '0.0',
                'ce': '9999999.0',
                'le': '9999999.0'
            }
        };
    }

    /**
     * Generate CoT date objects
     *
     * cot_date() - Time: now, Start: now, Stale: now + 20s
     *
     * @param {Date|null} time              Time of CoT Message - if omitted, current time is used
     * @param {Date|null} start             Start Time of CoT - if omitted, current time is used
     * @param {Date|null|numeric} stale     Expiration of CoT - if null now+20s is used. Alternative an integer representing the start + ms
     *
     * @returns {Object}
     */
    static cot_date(time, start, stale) {
        const now = Date.now();

        if (!time) time = new Date(now).toISOString();
        if (!start) start = new Date(now).toISOString();

        if (!stale) {
            stale = new Date(now + 20 * 1000).toISOString();
        } else if (!isNaN(parseInt(stale))) {
            stale = new Date(now + 20 * 1000).toISOString();
        }

        return { time, start, stale };
    }
}
