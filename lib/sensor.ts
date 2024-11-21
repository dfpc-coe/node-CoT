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

    to_geojson(): Static<typeof Polygon> | null {
        if (!this.sensor.range) return null;
        if (!this.sensor.azimuth) return null;
        if (!this.sensor.fov) return null;

        return sector(
            this.center,
            this.sensor.range / 1000,
            this.sensor.azimuth,
            this.sensor.azimuth + this.sensor.fov,
        ).geometry;
    }
}
