import assert from 'node:assert/strict';
import test from 'node:test';
import { CoTParser } from '../index.js';

const xml = `<event version='2.0' uid='ccfa3615-71fe-4ca1-8370-bee78f53ae41' type='u-d-f' time='2026-11-11T22:41:50.854Z' start='2026-11-11T22:41:50.854Z' stale='2026-11-12T22:41:50.854Z' how='h-e' access='Undefined'><point lat='39.6055311' lon='-107.631251' hae='3642.854' ce='9999999.0' le='9999999.0' /><detail><link point='39.614376,-107.5999381'/><link point='39.6411276,-107.6550505'/><link point='39.5951855,-107.6666076'/><link point='39.5714352,-107.6034078'/><link point='39.614376,-107.5999381'/><__shapeExtras cpvis='true' editable='true'/><remarks></remarks><creator uid='' callsign='COTAK-Admin-Schmidt' time='2026-11-11T22:36:10.959Z' type='a-f-G-E-V-C'/><precisionlocation altsrc='USER' geopointsrc='USER'/><strokeColor value='-256'/><strokeWeight value='3.0'/><strokeStyle value='solid'/><fillColor value='1795161856'/><archive/><contact callsign='Shape 9'/><labels_on value='false'/><color value='-256'/><height value='4572.0'/></detail></event>`;

test('Height: u-d-f polygon parses height as a number', () => {
    const cot = CoTParser.from_xml(xml);

    assert.equal(cot.raw.event._attributes.type, 'u-d-f');
    assert.equal(cot.raw.event.point._attributes.hae, 3642.854);
    assert.deepEqual(cot.raw.event.detail?.height, {
        _attributes: { value: 4572 }
    });
    assert.equal(cot.raw.event.detail?.height_unit, undefined);
    assert.equal(cot.raw.event.detail?.extrudeMode, undefined);
});

test('Height: XML round trip', () => {
    const cot = CoTParser.from_xml(CoTParser.to_xml(CoTParser.from_xml(xml)));

    assert.deepEqual(cot.raw.event.detail?.height, {
        _attributes: { value: 4572 }
    });
    assert.ok(Array.isArray(cot.raw.event.detail?.link));
    assert.equal(cot.raw.event.detail.link.length, 5);
});

test('Height: Protobuf round trip', async () => {
    const cot = await CoTParser.from_proto(await CoTParser.to_proto(CoTParser.from_xml(xml)));

    assert.deepEqual(cot.raw.event.detail?.height, {
        _attributes: { value: 4572 }
    });
});

test('Height: GeoJSON geometry is unaffected', async () => {
    const feat = await CoTParser.to_geojson(CoTParser.from_xml(xml));

    assert.equal(feat.geometry.type, 'Polygon');
    assert.deepEqual(feat.geometry.coordinates, [[
        [-107.5999381, 39.614376],
        [-107.6550505, 39.6411276],
        [-107.6666076, 39.5951855],
        [-107.6034078, 39.5714352],
        [-107.5999381, 39.614376]
    ]]);
    assert.deepEqual(feat.properties.center, [-107.631251, 39.6055311, 3642.854]);
});

test('Height: legacy inner text form', () => {
    const cot = CoTParser.from_xml(xml.replace(`<height value='4572.0'/>`, `<height>4572.0</height>`));

    assert.deepEqual(cot.raw.event.detail?.height, { _text: 4572 });
});

test('Height: height_unit and extrudeMode', () => {
    const cot = CoTParser.from_xml(xml.replace(
        `<height value='4572.0'/>`,
        `<height value='4572.0'/><height_unit value='4'/><extrudeMode value='sphere'/>`
    ));

    assert.deepEqual(cot.raw.event.detail?.height_unit, {
        _attributes: { value: 4 }
    });
    assert.deepEqual(cot.raw.event.detail?.extrudeMode, {
        _attributes: { value: 'sphere' }
    });

    const out = CoTParser.to_xml(cot);
    assert.match(out, /<height value="4572"\/>/);
    assert.match(out, /<height_unit value="4"\/>/);
    assert.match(out, /<extrudeMode value="sphere"\/>/);
});

test('Height: non-numeric height is rejected', () => {
    assert.throws(() => {
        CoTParser.from_xml(xml.replace(`<height value='4572.0'/>`, `<height value='tall'/>`));
    });
});
