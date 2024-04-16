import test from 'tape';
import CoT from '../index.js';

test('CoT.diff - no diff - ignored date & meta', (t) => {
    const a = CoT.from_geojson({
        id: 'C94B9215-9BD4-4DBE-BDE1-83625F09153F',
        type: 'Feature',
        properties: {
            callsign: 'DFPC-iSchmidt',
            time: '2023-07-18T15:23:09.00Z',
            start: '2023-07-18T15:23:09.00Z',
            stale: '2023-07-18T15:25:09.00Z',
            metadata: {
                test: true
            }
        },
        geometry: {
            type: 'Point',
            coordinates: [ -107.72376567, 41.52309645, 1681.23725821 ]
        }
    });

    const b = CoT.from_geojson({
        id: 'C94B9215-9BD4-4DBE-BDE1-83625F09153F',
        type: 'Feature',
        properties: {
            callsign: 'DFPC-iSchmidt',
            time: '2023-08-18T15:23:09.00Z',
            start: '2023-08-18T15:23:09.00Z',
            stale: '2023-08-18T15:25:09.00Z',
            metadata: {
                test: false
            }
        },
        geometry: {
            type: 'Point',
            coordinates: [ -107.72376567, 41.52309645, 1681.23725821 ]
        }
    });

    t.equals(a.isDiff(b), false);

    t.end();
});

test('CoT.diff - simple diff', (t) => {
    const a = CoT.from_geojson({
        id: 'D94B9215-9BD4-4DBE-BDE1-83625F09153F',
        type: 'Feature',
        properties: {
            callsign: 'DFPC-iSchmidt',
            time: '2023-07-18T15:23:09.00Z',
            start: '2023-07-18T15:23:09.00Z',
            stale: '2023-07-18T15:25:09.00Z',
        },
        geometry: {
            type: 'Point',
            coordinates: [ -107.72376567, 41.52309645, 1681.23725821 ]
        }
    });

    const b = CoT.from_geojson({
        id: 'C94B9215-9BD4-4DBE-BDE1-83625F09153F',
        type: 'Feature',
        properties: {
            callsign: 'DFPC-iSchmidt',
            time: '2023-07-18T15:23:09.00Z',
            start: '2023-07-18T15:23:09.00Z',
            stale: '2023-07-18T15:25:09.00Z',
        },
        geometry: {
            type: 'Point',
            coordinates: [ -107.72376567, 41.52309645, 1681.23725821 ]
        }
    });

    t.equals(a.isDiff(b), true);

    t.end();
});
