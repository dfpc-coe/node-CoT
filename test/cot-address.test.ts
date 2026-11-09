import assert from 'node:assert/strict';
import test from 'node:test';
import { CoTParser } from '../index.js';

test('__address from ATAK XML', async () => {
    const cot = await CoTParser.from_xml(`
        <event version="2.0" uid="addr" type="a-f-G" how="h-g-i-g-o" time="2026-01-01T00:00:00Z" start="2026-01-01T00:00:00Z" stale="2026-01-01T00:05:00Z">
            <point lat="39.7392" lon="-104.9903" hae="1609" ce="9999999" le="9999999"/>
            <detail>
                <contact callsign="Station 1"/>
                <__address text="1437 Bannock St, Denver, CO 80202" geocoder="Nominatim" time="2026-01-01T00:00:00Z"/>
            </detail>
        </event>
    `);

    const feat = await CoTParser.to_geojson(cot);
    assert.deepEqual(feat.properties.address, {
        text: '1437 Bannock St, Denver, CO 80202',
        geocoder: 'Nominatim',
        time: '2026-01-01T00:00:00Z'
    });

    const back = await CoTParser.from_geojson(feat);
    assert.deepEqual(back.raw.event.detail?.__address, cot.raw.event.detail?.__address);
    assert.ok(CoTParser.to_xml(back).includes('<__address text="1437 Bannock St, Denver, CO 80202" geocoder="Nominatim" time="2026-01-01T00:00:00Z"/>'));
});

test('address text is required', async () => {
    await assert.rejects(CoTParser.from_geojson({
        id: 'x', type: 'Feature',
        properties: { type: 'a-f-G', address: { geocoder: 'Nominatim' } } as never,
        geometry: { type: 'Point', coordinates: [-104.99, 39.74] }
    }), /Validation Error/);
});
