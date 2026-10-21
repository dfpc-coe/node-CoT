import assert from 'node:assert/strict';
import test from 'node:test';
import CoT, { CoTParser } from '../index.js';

const png = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=', 'base64');

function base(): CoT {
    return new CoT({
        event: {
            _attributes: {
                version: '2.0',
                uid: '0ed16b9e-a0c8-480f-8860-284b9afb2b1d',
                type: 'a-f-G',
                how: 'h-g-i-g-o',
                time: '2023-11-15T20:48:16.097Z',
                start: '2023-11-15T20:48:16.097Z',
                stale: '2024-11-14T20:48:16.097Z'
            },
            point: { _attributes: { lat: 38.2089117, lon: -104.6282182, hae: 1455.285, ce: 9999999.0, le: 9999999.0 } },
            detail: {
                image: {
                    _attributes: { mime: 'image/png' },
                    _text: png.toString('base64')
                }
            }
        }
    });
}

test('Parse inline image from XML', async () => {
    const cot = await CoTParser.from_xml(`<event version='2.0' uid='0ed16b9e-a0c8-480f-8860-284b9afb2b1d' type='a-f-G' time='2023-11-15T20:48:16.097Z' start='2023-11-15T20:48:16.097Z' stale='2024-11-14T20:48:16.097Z' how='h-g-i-g-o'><point lat='38.2089117' lon='-104.6282182' hae='1455.285' ce='9999999.0' le='9999999.0' /><detail><image mime='image/png'>${png.toString('base64')}</image></detail></event>`);

    assert.deepEqual(cot.raw.event.detail?.image, {
        _attributes: { mime: 'image/png' },
        _text: png.toString('base64')
    });

    const xml = CoTParser.to_xml(cot);
    assert.ok(xml.includes(`<image mime="image/png">${png.toString('base64')}</image>`));
});

test('Image GeoJSON & Protobuf round trip', async () => {
    const cot = base();

    const feat = await CoTParser.to_geojson(cot);
    assert.deepEqual(feat.properties.image, { mime: 'image/png', data: png.toString('base64') });

    const back = await CoTParser.from_geojson(feat);
    assert.deepEqual(back.raw.event.detail?.image, cot.raw.event.detail?.image);

    const proto = await CoTParser.from_proto(await CoTParser.to_proto(cot));
    assert.deepEqual(proto.raw.event.detail?.image, cot.raw.event.detail?.image);
});

test('Image without mime round trips through GeoJSON', async () => {
    const feat = await CoTParser.to_geojson(await CoTParser.from_xml(`<event version='2.0' uid='0ed16b9e-a0c8-480f-8860-284b9afb2b1d' type='a-f-G' time='2023-11-15T20:48:16.097Z' start='2023-11-15T20:48:16.097Z' stale='2024-11-14T20:48:16.097Z' how='h-g-i-g-o'><point lat='38.2089117' lon='-104.6282182' hae='1455.285' ce='9999999.0' le='9999999.0' /><detail><image>${png.toString('base64')}</image></detail></event>`));

    assert.deepEqual(feat.properties.image, { data: png.toString('base64') });

    const back = await CoTParser.from_geojson(feat);
    assert.deepEqual(back.raw.event.detail?.image, { _attributes: {}, _text: png.toString('base64') });
});
