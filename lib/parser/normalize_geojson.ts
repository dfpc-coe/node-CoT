import Err from '@openaddresses/batch-error';
import { v4 as randomUUID } from 'uuid';
import type { Static } from '@sinclair/typebox';
import { coordEach } from "@turf/meta";
import TypeValidator from '../type.js';
import { Feature } from '../types/feature.js';
import PointOnFeature from '@turf/point-on-feature';
import { GeoJSONFeature } from '../types/geojson.js';

/**
 * Given a generic GeoJSON Feature, convert it to a CoT Featurt
 *
 * @param {Object} feature GeoJSON Feature
 *
 * @return {CoT}
 */
export async function normalize_geojson(
    feature: Static<typeof GeoJSONFeature>,
): Promise<Static<typeof Feature>> {
    try {
        feature = await TypeValidator.type(GeoJSONFeature, feature);
    } catch (err) {
        throw new Err(400, null, `Validation Error: ${err}`);
    }

    if (!feature.id) {
        feature.id = randomUUID();
    }

    const props = feature.properties;

    feature.properties = {
        metadata: props || {}
    }

    if (feature.geometry.type === 'Point') {
        feature.properties.type = 'u-d-p';
    } else if (feature.geometry.type === 'LineString') {
        feature.properties.type = 'u-d-f';
    } else if (feature.geometry.type === 'Polygon') {
        feature.properties.type = 'u-d-f';
    } else {
        throw new Err(400, null, `Unsupported Geometry Type`);
    }

    for (const color of ['marker-color', 'stroke', 'fill']) {
        if (
            props[color]
            && typeof props[color] === 'string'
            && /^#?[0-9a-fA-F]{6}$/.test(props[color])
        ) {
            feature.properties[color] = props[color].startsWith('#') ? props[color] : `#${props[color]}`;
        }
    }

    for (const number of ['marker-opacity', 'stroke-opacity', 'stroke-width', 'fill-opacity']) {
        if (
            props[number]
            && typeof props[number] === 'number'
        ) {
            feature.properties[number] = props[number];
        }
    }

    // Callsign Options
    for (const callsign of ['callsign', 'title', 'name']) {
        if (props[callsign] && typeof props[callsign] === 'string') {
            feature.properties.callsign = props[callsign];
            break;
        }
    }

    if (!feature.properties.callsign) {
        feature.properties.callsign = 'New Feature';
    }

    // Remarks Options
    for (const remarks of ['remarks', 'description']) {
        if (props[remarks] && typeof props[remarks] === 'string') {
            feature.properties.remarks = props[remarks];
            break;
        }
    }

    if (!feature.properties.remarks) {
        feature.properties.remarks = '';
    }

    feature.properties.time = new Date().toISOString();
    feature.properties.start = new Date().toISOString();

    const stale = new Date();
    stale.setHours(stale.getHours() + 1);
    feature.properties.stale = stale;

    feature.properties.center = PointOnFeature(feature).geometry.coordinates.slice(0, 3);

    feature.properties.archived = true;

    coordEach(feature.geometry, (coord) => {
        coord.splice(3);
    });

    return feature as Static<typeof Feature>;
}
