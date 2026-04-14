import assert from 'node:assert/strict';
import test from 'node:test';
import { CoTParser } from '../index.js';

test('COT.callsign', async () => {
    const cot = await CoTParser.from_geojson({
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

    assert.equal(cot.callsign(), 'BasicTest');
    assert.equal(cot.callsign('Reassign'), 'Reassign');
    assert.equal(cot.callsign(), 'Reassign');
});

test('COT.type', async () => {
    const cot = await CoTParser.from_geojson({
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

    assert.equal(cot.type(), 'a-f-G');
    assert.equal(cot.type('u-d-f'), 'u-d-f');
    assert.equal(cot.type(), 'u-d-f');
});

test('COT.archived', async () => {
    const cot = await CoTParser.from_geojson({
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

    assert.equal(cot.archived(), false);
    assert.equal(cot.archived(true), true);

    assert.equal((await CoTParser.to_geojson(cot)).properties.archived, true)

    assert.equal(cot.archived(), true);
    assert.equal(cot.archived(false), false);
    assert.equal(cot.archived(), false);

    assert.equal((await CoTParser.to_geojson(cot)).properties.archived, undefined)
});

