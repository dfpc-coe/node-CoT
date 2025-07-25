import { v4 as randomUUID } from 'uuid';
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

        if (course) attr.course = String(course);
        if (speed) attr.speed = String(speed);
        if (slope) attr.slope = String(slope);

        return attr;
    }

    /**
     * Generate a random UUID
     */
    static cot_uuid(): string {
        return randomUUID()
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

        if (stale === undefined || stale === null) {
            return {
                time: (new Date(time || now)).toISOString(),
                start: (new Date(start || now)).toISOString(),
                stale: (new Date(new Date(now).getTime() + 20 * 1000)).toISOString()
            };
        } else if (typeof stale === 'number') {
            return {
                time: (new Date(time || now)).toISOString(),
                start: (new Date(start || now)).toISOString(),
                stale: (new Date(new Date(now).getTime() + Number(stale))).toISOString()
            };
        } else {
            return {
                time: (new Date(time || now)).toISOString(),
                start: (new Date(start || now)).toISOString(),
                stale: String(stale)
            };
        }
    }
}
