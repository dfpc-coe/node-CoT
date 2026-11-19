import type { Static } from '@sinclair/typebox';
import type {
    EventAttributes,
    TrackAttributes,
    Detail,
    Point
} from '../types/types.js';

/**
 * Helper functions for generating CoT data
 * @class
 */
export function jsonClone<T>(value: T): T {
    // oxlint-disable-next-line typescript/no-unsafe-return
    return JSON.parse(JSON.stringify(value));
}

/**
 * Coerce numeric values that may not have passed through schema coercion
 */
export function toNumber(value: number | string): number {
    return typeof value === 'number' ? value : Number(value);
}

export default class Util {
    /**
     * Return an event._attributes object with as many defaults as possible
     *
     * @param type      CoT Type
     * @param how       CoT how
     * @param time      Time of CoT Message - if omitted, current time is used
     * @param start     Start Time of CoT - if omitted, current time is used
     * @param stale     Expiration of CoT - if null now+20s is used. Alternative an integer representing the ms offset
     */
    static cot_event_attr(
        type: string,
        how: string,
        time?: Date | string | null,
        start?: Date | string | null,
        stale?: Date | string | number | null
    ): Static<typeof EventAttributes> {
        if (!type) throw new Error('type param required');
        if (!how) throw new Error('how param required');

        return {
            version: Util.cot_version(),
            uid: Util.cot_uuid(),
            type,
            how,
            ...Util.cot_date(time, start, stale)
        };
    }

    /**
     * Return an event.detail object with as many defaults as possible
     *
     * @param [callsign=UNKNOWN] Display Callsign
     */
    static cot_event_detail(callsign = 'UNKNOWN'): Static<typeof Detail> {
        return {
            contact: {
                _attributes: { callsign }
            }
        };
    }

    /**
     * Return a track object with as many defaults as possible
     *
     * @param [course] Speed in degrees from north
     * @param [speed=0] Speed in m/s
     */
    static cot_track_attr(course?: number, speed?: number, slope?: number): Static<typeof TrackAttributes> {
        const attr: Static<typeof TrackAttributes> = {};

        if (course !== undefined && course !== 0) attr.course = String(course);
        if (speed !== undefined && speed !== 0) attr.speed = String(speed);
        if (slope !== undefined && slope !== 0) attr.slope = String(slope);

        return attr;
    }

    /**
     * Generate a random UUID
     */
    static cot_uuid(): string {
        return crypto.randomUUID()
    }

    /**
     * Return the current version number this library supports
     */
    static cot_version(): string {
        return '2.0';
    }

    /**
     * Generate Null Island CoT point object
     */
    static cot_point(): Static<typeof Point> {
        return {
            '_attributes': {
                'lat': 0.000000,
                'lon': 0.000000,
                'hae': 0.0,
                'ce': 9999999.0,
                'le': 9999999.0
            }
        };
    }

    /**
     * Generate CoT date objects
     *
     * cot_date() - Time: now, Start: now, Stale: now + 20s
     *
     * @param time      Time of CoT Message - if omitted, current time is used
     * @param start     Start Time of CoT - if omitted, current time is used
     * @param stale     Expiration of CoT - if null now+20s is used. Alternative an integer representing the ms offset
     */
    static cot_date(
        time?: Date | string | null,
        start?: Date | string | null,
        stale?: Date | string | number | null
    ): {
        time: string,
        start: string,
        stale: string
    } {
        const now = Date.now();

        const dates = {
            time: (new Date(time === '' ? now : time ?? now)).toISOString(),
            start: (new Date(start === '' ? now : start ?? now)).toISOString()
        };

        if (stale === undefined || stale === null) {
            return {
                ...dates,
                stale: (new Date(new Date(now).getTime() + 20 * 1000)).toISOString()
            };
        }

        if (typeof stale === 'number') {
            return {
                ...dates,
                stale: (new Date(new Date(now).getTime() + stale)).toISOString()
            };
        }

        return {
            ...dates,
            stale: String(stale)
        };
    }
}
