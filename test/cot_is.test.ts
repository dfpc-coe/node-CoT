import test from 'tape';
import { CoTParser } from '../index.js';

test('CoT.is_friend', (t) => {
    let cot = CoTParser.from_geojson({
        type: 'Feature',
        properties: {
            type: 'a-f-B'
        },
        geometry: { type: 'Point', coordinates: [0,0] }
    });

    t.ok(cot.is_friend());

    cot = CoTParser.from_geojson({
        type: 'Feature',
        properties: {
            type: 'a-h-B'
        },
        geometry: { type: 'Point', coordinates: [0,0] }
    });

    t.notOk(cot.is_friend());

    t.end();
});

test('CoT.is_hostile', (t) => {
    let cot = CoTParser.from_geojson({
        type: 'Feature',
        properties: {
            type: 'a-h-B'
        },
        geometry: { type: 'Point', coordinates: [0,0] }
    });

    t.ok(cot.is_hostile());

    cot = CoTParser.from_geojson({
        type: 'Feature',
        properties: {
            type: 'a-f-B'
        },
        geometry: { type: 'Point', coordinates: [0,0] }
    });

    t.notOk(cot.is_hostile());

    t.end();
});

test('CoT.is_unknown', (t) => {
    let cot = CoTParser.from_geojson({
        type: 'Feature',
        properties: {
            type: 'a-u-B'
        },
        geometry: { type: 'Point', coordinates: [0,0] }
    });

    t.ok(cot.is_unknown());

    cot = CoTParser.from_geojson({
        type: 'Feature',
        properties: {
            type: 'a-f-B'
        },
        geometry: { type: 'Point', coordinates: [0,0] }
    });

    t.notOk(cot.is_unknown());

    t.end();
});

test('CoT.is_pending', (t) => {
    let cot = CoTParser.from_geojson({
        type: 'Feature',
        properties: {
            type: 'a-p-B'
        },
        geometry: { type: 'Point', coordinates: [0,0] }
    });

    t.ok(cot.is_pending());

    cot = CoTParser.from_geojson({
        type: 'Feature',
        properties: {
            type: 'a-f-B'
        },
        geometry: { type: 'Point', coordinates: [0,0] }
    });

    t.notOk(cot.is_pending());

    t.end();
});

test('CoT.is_assumed', (t) => {
    let cot = CoTParser.from_geojson({
        type: 'Feature',
        properties: {
            type: 'a-a-B'
        },
        geometry: { type: 'Point', coordinates: [0,0] }
    });

    t.ok(cot.is_assumed());

    cot = CoTParser.from_geojson({
        type: 'Feature',
        properties: {
            type: 'a-f-B'
        },
        geometry: { type: 'Point', coordinates: [0,0] }
    });

    t.notOk(cot.is_assumed());
    t.end();
});

test('CoT.is_neutral', (t) => {
    let cot = CoTParser.from_geojson({
        type: 'Feature',
        properties: {
            type: 'a-n-B'
        },
        geometry: { type: 'Point', coordinates: [0,0] }
    });

    t.ok(cot.is_neutral());

    cot = CoTParser.from_geojson({
        type: 'Feature',
        properties: {
            type: 'a-f-B'
        },
        geometry: { type: 'Point', coordinates: [0,0] }
    });

    t.notOk(cot.is_neutral());
    t.end();
});

test('CoT.is_suspect', (t) => {
    let cot = CoTParser.from_geojson({
        type: 'Feature',
        properties: {
            type: 'a-s-B'
        },
        geometry: { type: 'Point', coordinates: [0,0] }
    });

    t.ok(cot.is_suspect());

    cot = CoTParser.from_geojson({
        type: 'Feature',
        properties: {
            type: 'a-f-B'
        },
        geometry: { type: 'Point', coordinates: [0,0] }
    });

    t.notOk(cot.is_suspect());
    t.end();
});

test('CoT.is_joker', (t) => {
    let cot = CoTParser.from_geojson({
        type: 'Feature',
        properties: {
            type: 'a-j-B'
        },
        geometry: { type: 'Point', coordinates: [0,0] }
    });

    t.ok(cot.is_joker());

    cot = CoTParser.from_geojson({
        type: 'Feature',
        properties: {
            type: 'a-f-B'
        },
        geometry: { type: 'Point', coordinates: [0,0] }
    });

    t.notOk(cot.is_joker());
    t.end();
});

test('CoT.is_faker', (t) => {
    let cot = CoTParser.from_geojson({
        type: 'Feature',
        properties: {
            type: 'a-k-B'
        },
        geometry: { type: 'Point', coordinates: [0,0] }
    });

    t.ok(cot.is_faker());

    cot = CoTParser.from_geojson({
        type: 'Feature',
        properties: {
            type: 'a-f-B'
        },
        geometry: { type: 'Point', coordinates: [0,0] }
    });

    t.notOk(cot.is_faker());
    t.end();
});

test('CoT.is_atom', (t) => {
    let cot = CoTParser.from_geojson({
        type: 'Feature',
        properties: {
            type: 'a-'
        },
        geometry: { type: 'Point', coordinates: [0,0] }
    });

    t.ok(cot.is_atom());

    cot = CoTParser.from_geojson({
        type: 'Feature',
        properties: {
            type: 'h'
        },
        geometry: { type: 'Point', coordinates: [0,0] }
    });

    t.notOk(cot.is_atom());
    t.end();
});

test('CoT.is_airborne', (t) => {
    let cot = CoTParser.from_geojson({
        type: 'Feature',
        properties: {
            type: 'a-f-A'
        },
        geometry: { type: 'Point', coordinates: [0,0] }
    });

    t.ok(cot.is_airborne());

    cot = CoTParser.from_geojson({
        type: 'Feature',
        properties: {
            type: 'a-h-G'
        },
        geometry: { type: 'Point', coordinates: [0,0] }
    });

    t.notOk(cot.is_airborne());
    t.end();
});

test('CoT.is_ground', (t) => {
    let cot = CoTParser.from_geojson({
        type: 'Feature',
        properties: {
            type: 'a-f-G'
        },
        geometry: { type: 'Point', coordinates: [0,0] }
    });

    t.ok(cot.is_ground());

    cot = CoTParser.from_geojson({
        type: 'Feature',
        properties: {
            type: 'a-h-A'
        },
        geometry: { type: 'Point', coordinates: [0,0] }
    });

    t.notOk(cot.is_ground());
    t.end();
});

test('CoT.is_installation', (t) => {
    let cot = CoTParser.from_geojson({
        type: 'Feature',
        properties: {
            type: 'a-f-G-I'
        },
        geometry: { type: 'Point', coordinates: [0,0] }
    });

    t.ok(cot.is_installation());

    cot = CoTParser.from_geojson({
        type: 'Feature',
        properties: {
            type: 'a-f-G'
        },
        geometry: { type: 'Point', coordinates: [0,0] }
    });

    t.notOk(cot.is_installation());

    cot = CoTParser.from_geojson({
        type: 'Feature',
        properties: {
            type: 'a-h-A'
        },
        geometry: { type: 'Point', coordinates: [0,0] }
    });

    t.notOk(cot.is_installation());
    t.end();
});

test('CoT.is_vehicle', (t) => {
    let cot = CoTParser.from_geojson({
        type: 'Feature',
        properties: {
            type: 'a-f-G-E-V'
        },
        geometry: { type: 'Point', coordinates: [0,0] }
    });

    t.ok(cot.is_vehicle());

    cot = CoTParser.from_geojson({
        type: 'Feature',
        properties: {
            type: 'a-h-G-E-V'
        },
        geometry: { type: 'Point', coordinates: [0,0] }
    });

    t.ok(cot.is_vehicle());

    cot = CoTParser.from_geojson({
        type: 'Feature',
        properties: {
            type: 'a-f-G-E'
        },
        geometry: { type: 'Point', coordinates: [0,0] }
    });

    t.notOk(cot.is_vehicle());
    t.end();
});

test('CoT.is_equipment', (t) => {
    let cot = CoTParser.from_geojson({
        type: 'Feature',
        properties: {
            type: 'a-f-G-E'
        },
        geometry: { type: 'Point', coordinates: [0,0] }
    });

    t.ok(cot.is_equipment());

    cot = CoTParser.from_geojson({
        type: 'Feature',
        properties: {
            type: 'a-f-G'
        },
        geometry: { type: 'Point', coordinates: [0,0] }
    });

    t.notOk(cot.is_equipment());

    t.end();
});

test('CoT.is_surface', (t) => {
    let cot = CoTParser.from_geojson({
        type: 'Feature',
        properties: {
            type: 'a-f-S'
        },
        geometry: { type: 'Point', coordinates: [0,0] }
    });

    t.ok(cot.is_surface());

    cot = CoTParser.from_geojson({
        type: 'Feature',
        properties: {
            type: 'a-f-G'
        },
        geometry: { type: 'Point', coordinates: [0,0] }
    });

    t.notOk(cot.is_surface());
    t.end();
});

test('CoT.is_subsurface', (t) => {
    let cot = CoTParser.from_geojson({
        type: 'Feature',
        properties: {
            type: 'a-f-U'
        },
        geometry: { type: 'Point', coordinates: [0,0] }
    });

    t.ok(cot.is_subsurface());

    cot = CoTParser.from_geojson({
        type: 'Feature',
        properties: {
            type: 'a-f-G'
        },
        geometry: { type: 'Point', coordinates: [0,0] }
    });

    t.notOk(cot.is_subsurface());
    t.end();
});

test('CoT.is_uav', (t) => {
    const cot = CoTParser.from_geojson({
        type: 'Feature',
        properties: {
            type: 'a-f-A-M-F-Q-r'
        },
        geometry: { type: 'Point', coordinates: [0,0] }
    });

    t.ok(cot.is_uav());
    t.end();
});
