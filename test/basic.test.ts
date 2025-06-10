import test from 'tape';
import { CoTParser } from '../index.js';

test('COT.callsign', (t) => {
    const cot = CoTParser.from_geojson({
        "id": "123",
        "type": "Feature",
        "path": "/",
        "properties": {
            "type": "a-f-G",
            "how": "m-g",
            "callsign": "BasicTest",
            "center": [ 1.1, 2.2, 0 ],
            "time": "2023-08-04T15:17:43.649Z",
            "start": "2023-08-04T15:17:43.649Z",
            "stale": "2023-08-04T15:17:43.649Z",
            "metadata": {}
        },
        "geometry": {
            "type": "Point",
            "coordinates": [1.1, 2.2, 0]
        }
    });

    t.equals(cot.callsign(), 'BasicTest');
    t.equals(cot.callsign('Reassign'), 'Reassign');
    t.equals(cot.callsign(), 'Reassign');

    t.end();
});

test('COT.type', (t) => {
    const cot = CoTParser.from_geojson({
        "id": "123",
        "type": "Feature",
        "path": "/",
        "properties": {
            "type": "a-f-G",
            "how": "m-g",
            "callsign": "BasicTest",
            "center": [ 1.1, 2.2, 0 ],
            "time": "2023-08-04T15:17:43.649Z",
            "start": "2023-08-04T15:17:43.649Z",
            "stale": "2023-08-04T15:17:43.649Z",
            "metadata": {}
        },
        "geometry": {
            "type": "Point",
            "coordinates": [1.1, 2.2, 0]
        }
    });

    t.equals(cot.type(), 'a-f-G');
    t.equals(cot.type('u-d-f'), 'u-d-f');
    t.equals(cot.type(), 'u-d-f');

    t.end();
});

test('COT.archived', (t) => {
    const cot = CoTParser.from_geojson({
        "id": "123",
        "type": "Feature",
        "path": "/",
        "properties": {
            "type": "a-f-G",
            "how": "m-g",
            "callsign": "BasicTest",
            "center": [ 1.1, 2.2, 0 ],
            "time": "2023-08-04T15:17:43.649Z",
            "start": "2023-08-04T15:17:43.649Z",
            "stale": "2023-08-04T15:17:43.649Z",
            "metadata": {}
        },
        "geometry": {
            "type": "Point",
            "coordinates": [1.1, 2.2, 0]
        }
    });

    t.equals(cot.archived(), false);
    t.equals(cot.archived(true), true);

    t.equals(cot.to_geojson().properties.archived, true)

    t.equals(cot.archived(), true);
    t.equals(cot.archived(false), false);
    t.equals(cot.archived(), false);

    t.equals(cot.to_geojson().properties.archived, undefined)

    t.end();
});

