import Err from '@openaddresses/batch-error';
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
        feature = TypeValidator.type(GeoJSONFeature, feature);
    } catch (err) {
        throw new Err(400, null, `Validation Error: ${String(err)}`);
    }

    if (!feature.id) {
        feature.id = crypto.randomUUID();
    }

    const props = feature.properties;

    feature.properties = {
        metadata: props
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
        const value = props[color];
        if (typeof value === 'string' && /^#?[0-9a-fA-F]{6}$/.test(value)) {
            feature.properties[color] = value.startsWith('#') ? value : `#${value}`;
        }
    }

    for (const number of ['marker-opacity', 'stroke-opacity', 'stroke-width', 'fill-opacity']) {
        const value = props[number];
        if (typeof value === 'number' && value) {
            feature.properties[number] = value;
        }
    }

    // Callsign Options
    let callsign = 'New Feature';
    for (const key of ['callsign', 'title', 'name']) {
        const value = props[key];
        if (typeof value === 'string' && value) {
            callsign = value;
            break;
        }
    }

    feature.properties.callsign = callsign;

    // Remarks Options
    let remarks = '';
    for (const key of ['remarks', 'description']) {
        const value = props[key];
        if (typeof value === 'string' && value) {
            remarks = value;
            break;
        }
    }

    feature.properties.remarks = remarks;

    // Keep caller supplied times, only fill in the ones that are missing
    const now = new Date();
    feature.properties.time = valid_date(props.time) || now.toISOString();
    feature.properties.start = valid_date(props.start) || now.toISOString();

    const stale = new Date(now);
    stale.setHours(stale.getHours() + 1);
    feature.properties.stale = valid_date(props.stale) || stale.toISOString();

    feature.properties.center = PointOnFeature(feature).geometry.coordinates.slice(0, 3);

    feature.properties.archived = true;

    coordEach(feature.geometry, (coord) => {
        coord.splice(3);
    });

    // oxlint-disable-next-line typescript/no-unsafe-type-assertion
    return feature as Static<typeof Feature>;
}

/**
 * Return the given value if it is a parseable date string
 */
function valid_date(value: unknown): string | undefined {
    if (typeof value === 'string' && !isNaN(Date.parse(value))) {
        return value;
    }

    return undefined;
}
