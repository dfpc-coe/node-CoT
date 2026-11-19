import type { Static } from '@sinclair/typebox';
import { Position, Polygon } from './types/feature.js';
import { SensorAttributes } from './types/types.js';
import { sector } from '@turf/sector';

function orZero(value?: number): number {
    const defined = value ?? 0;
    return Number.isNaN(defined) ? 0 : defined;
}

export default class Sensor {
    center: Static<typeof Position>;
    sensor: Static<typeof SensorAttributes>;

    constructor(
        center: Static<typeof Position>,
        sensor: Static<typeof SensorAttributes>
    ) {
        this.center = center;
        this.sensor = sensor;
    }

    /**
     * Ground footprint of the sensor cone, centred on the azimuth.
     * `range` is a slant range so it is projected to the ground via the elevation
     */
    to_geojson(): Static<typeof Polygon> | null {
        const range = orZero(this.sensor.range);
        if (range === 0) return null;
        if (typeof this.sensor.azimuth !== 'number') return null;
        const fov = orZero(this.sensor.fov);
        if (fov === 0) return null;

        const elevation = orZero(this.sensor.elevation);
        const ground = range * Math.cos(elevation * Math.PI / 180);
        if (ground < 1) return null;

        const half = fov / 2;

        return sector(
            this.center,
            ground / 1000,
            this.sensor.azimuth - half,
            this.sensor.azimuth + half,
        ).geometry;
    }
}
