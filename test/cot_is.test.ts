import assert from 'node:assert/strict';
import test from 'node:test';
import { CoTParser } from '../index.js';

test('CoT.is_friend', async () => {
    let cot = await CoTParser.from_geojson({
        type: 'Feature',
        properties: {
            type: 'a-f-B'
        },
        geometry: { type: 'Point', coordinates: [0,0] }
    });

    assert.ok(cot.is_friend());

    cot = await CoTParser.from_geojson({
        type: 'Feature',
        properties: {
            type: 'a-h-B'
        },
        geometry: { type: 'Point', coordinates: [0,0] }
    });

    assert.ok(!(cot.is_friend()));
});

test('CoT.is_hostile', async () => {
    let cot = await CoTParser.from_geojson({
        type: 'Feature',
        properties: {
            type: 'a-h-B'
        },
        geometry: { type: 'Point', coordinates: [0,0] }
    });

    assert.ok(cot.is_hostile());

    cot = await CoTParser.from_geojson({
        type: 'Feature',
        properties: {
            type: 'a-f-B'
        },
        geometry: { type: 'Point', coordinates: [0,0] }
    });

    assert.ok(!(cot.is_hostile()));
});

test('CoT.is_unknown', async () => {
    let cot = await CoTParser.from_geojson({
        type: 'Feature',
        properties: {
            type: 'a-u-B'
        },
        geometry: { type: 'Point', coordinates: [0,0] }
    });

    assert.ok(cot.is_unknown());

    cot = await CoTParser.from_geojson({
        type: 'Feature',
        properties: {
            type: 'a-f-B'
        },
        geometry: { type: 'Point', coordinates: [0,0] }
    });

    assert.ok(!(cot.is_unknown()));
});

test('CoT.is_pending', async () => {
    let cot = await CoTParser.from_geojson({
        type: 'Feature',
        properties: {
            type: 'a-p-B'
        },
        geometry: { type: 'Point', coordinates: [0,0] }
    });

    assert.ok(cot.is_pending());

    cot = await CoTParser.from_geojson({
        type: 'Feature',
        properties: {
            type: 'a-f-B'
        },
        geometry: { type: 'Point', coordinates: [0,0] }
    });

    assert.ok(!(cot.is_pending()));
});

test('CoT.is_assumed', async () => {
    let cot = await CoTParser.from_geojson({
        type: 'Feature',
        properties: {
            type: 'a-a-B'
        },
        geometry: { type: 'Point', coordinates: [0,0] }
    });

    assert.ok(cot.is_assumed());

    cot = await CoTParser.from_geojson({
        type: 'Feature',
        properties: {
            type: 'a-f-B'
        },
        geometry: { type: 'Point', coordinates: [0,0] }
    });

    assert.ok(!(cot.is_assumed()));
});

test('CoT.is_neutral', async () => {
    let cot = await CoTParser.from_geojson({
        type: 'Feature',
        properties: {
            type: 'a-n-B'
        },
        geometry: { type: 'Point', coordinates: [0,0] }
    });

    assert.ok(cot.is_neutral());

    cot = await CoTParser.from_geojson({
        type: 'Feature',
        properties: {
            type: 'a-f-B'
        },
        geometry: { type: 'Point', coordinates: [0,0] }
    });

    assert.ok(!(cot.is_neutral()));
});

test('CoT.is_suspect', async () => {
    let cot = await CoTParser.from_geojson({
        type: 'Feature',
        properties: {
            type: 'a-s-B'
        },
        geometry: { type: 'Point', coordinates: [0,0] }
    });

    assert.ok(cot.is_suspect());

    cot = await CoTParser.from_geojson({
        type: 'Feature',
        properties: {
            type: 'a-f-B'
        },
        geometry: { type: 'Point', coordinates: [0,0] }
    });

    assert.ok(!(cot.is_suspect()));
});

test('CoT.is_joker', async () => {
    let cot = await CoTParser.from_geojson({
        type: 'Feature',
        properties: {
            type: 'a-j-B'
        },
        geometry: { type: 'Point', coordinates: [0,0] }
    });

    assert.ok(cot.is_joker());

    cot = await CoTParser.from_geojson({
        type: 'Feature',
        properties: {
            type: 'a-f-B'
        },
        geometry: { type: 'Point', coordinates: [0,0] }
    });

    assert.ok(!(cot.is_joker()));
});

test('CoT.is_faker', async () => {
    let cot = await CoTParser.from_geojson({
        type: 'Feature',
        properties: {
            type: 'a-k-B'
        },
        geometry: { type: 'Point', coordinates: [0,0] }
    });

    assert.ok(cot.is_faker());

    cot = await CoTParser.from_geojson({
        type: 'Feature',
        properties: {
            type: 'a-f-B'
        },
        geometry: { type: 'Point', coordinates: [0,0] }
    });

    assert.ok(!(cot.is_faker()));
});

test('CoT.is_atom', async () => {
    let cot = await CoTParser.from_geojson({
        type: 'Feature',
        properties: {
            type: 'a-'
        },
        geometry: { type: 'Point', coordinates: [0,0] }
    });

    assert.ok(cot.is_atom());

    cot = await CoTParser.from_geojson({
        type: 'Feature',
        properties: {
            type: 'h'
        },
        geometry: { type: 'Point', coordinates: [0,0] }
    });

    assert.ok(!(cot.is_atom()));
});

test('CoT.is_airborne', async () => {
    let cot = await CoTParser.from_geojson({
        type: 'Feature',
        properties: {
            type: 'a-f-A'
        },
        geometry: { type: 'Point', coordinates: [0,0] }
    });

    assert.ok(cot.is_airborne());

    cot = await CoTParser.from_geojson({
        type: 'Feature',
        properties: {
            type: 'a-h-G'
        },
        geometry: { type: 'Point', coordinates: [0,0] }
    });

    assert.ok(!(cot.is_airborne()));
});

test('CoT.is_ground', async () => {
    let cot = await CoTParser.from_geojson({
        type: 'Feature',
        properties: {
            type: 'a-f-G'
        },
        geometry: { type: 'Point', coordinates: [0,0] }
    });

    assert.ok(cot.is_ground());

    cot = await CoTParser.from_geojson({
        type: 'Feature',
        properties: {
            type: 'a-h-A'
        },
        geometry: { type: 'Point', coordinates: [0,0] }
    });

    assert.ok(!(cot.is_ground()));
});

test('CoT.is_installation', async () => {
    let cot = await CoTParser.from_geojson({
        type: 'Feature',
        properties: {
            type: 'a-f-G-I'
        },
        geometry: { type: 'Point', coordinates: [0,0] }
    });

    assert.ok(cot.is_installation());

    cot = await CoTParser.from_geojson({
        type: 'Feature',
        properties: {
            type: 'a-f-G'
        },
        geometry: { type: 'Point', coordinates: [0,0] }
    });

    assert.ok(!(cot.is_installation()));
    cot = await CoTParser.from_geojson({
        type: 'Feature',
        properties: {
            type: 'a-h-A'
        },
        geometry: { type: 'Point', coordinates: [0,0] }
    });

    assert.ok(!(cot.is_installation()));
});

test('CoT.is_vehicle', async () => {
    let cot = await CoTParser.from_geojson({
        type: 'Feature',
        properties: {
            type: 'a-f-G-E-V'
        },
        geometry: { type: 'Point', coordinates: [0,0] }
    });

    assert.ok(cot.is_vehicle());

    cot = await CoTParser.from_geojson({
        type: 'Feature',
        properties: {
            type: 'a-h-G-E-V'
        },
        geometry: { type: 'Point', coordinates: [0,0] }
    });

    assert.ok(cot.is_vehicle());

    cot = await CoTParser.from_geojson({
        type: 'Feature',
        properties: {
            type: 'a-f-G-E'
        },
        geometry: { type: 'Point', coordinates: [0,0] }
    });

    assert.ok(!(cot.is_vehicle()));
});

test('CoT.is_equipment', async () => {
    let cot = await CoTParser.from_geojson({
        type: 'Feature',
        properties: {
            type: 'a-f-G-E'
        },
        geometry: { type: 'Point', coordinates: [0,0] }
    });

    assert.ok(cot.is_equipment());

    cot = await CoTParser.from_geojson({
        type: 'Feature',
        properties: {
            type: 'a-f-G'
        },
        geometry: { type: 'Point', coordinates: [0,0] }
    });

    assert.ok(!(cot.is_equipment()));
});

test('CoT.is_surface', async () => {
    let cot = await CoTParser.from_geojson({
        type: 'Feature',
        properties: {
            type: 'a-f-S'
        },
        geometry: { type: 'Point', coordinates: [0,0] }
    });

    assert.ok(cot.is_surface());

    cot = await CoTParser.from_geojson({
        type: 'Feature',
        properties: {
            type: 'a-f-G'
        },
        geometry: { type: 'Point', coordinates: [0,0] }
    });

    assert.ok(!(cot.is_surface()));
});

test('CoT.is_subsurface', async () => {
    let cot = await CoTParser.from_geojson({
        type: 'Feature',
        properties: {
            type: 'a-f-U'
        },
        geometry: { type: 'Point', coordinates: [0,0] }
    });

    assert.ok(cot.is_subsurface());

    cot = await CoTParser.from_geojson({
        type: 'Feature',
        properties: {
            type: 'a-f-G'
        },
        geometry: { type: 'Point', coordinates: [0,0] }
    });

    assert.ok(!(cot.is_subsurface()));
});

test('CoT.is_uav', async () => {
    const cot = await CoTParser.from_geojson({
        type: 'Feature',
        properties: {
            type: 'a-f-A-M-F-Q-r'
        },
        geometry: { type: 'Point', coordinates: [0,0] }
    });

    assert.ok(cot.is_uav());
});
