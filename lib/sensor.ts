import type { Static } from '@sinclair/typebox';
import { Position, Polygon } from './types/feature.js';
import { SensorAttributes } from './types/types.js';
import { sector } from '@turf/sector';

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
        if (!this.sensor.range) return null;
        if (typeof this.sensor.azimuth !== 'number') return null;
        if (!this.sensor.fov) return null;

        const elevation = this.sensor.elevation || 0;
        const ground = this.sensor.range * Math.cos(elevation * Math.PI / 180);
        if (ground < 1) return null;

        const half = this.sensor.fov / 2;

        return sector(
            this.center,
            ground / 1000,
            this.sensor.azimuth - half,
            this.sensor.azimuth + half,
        ).geometry;
    }
}
