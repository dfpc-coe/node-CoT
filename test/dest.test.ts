import assert from 'node:assert/strict';
import test from 'node:test';
import { CoTParser } from '../index.js';

test('CoT.addDest - mission name is trimmed to match TAK Server mission names', async () => {
    const cot = await CoTParser.from_geojson({
        id: 'dest-trim',
        type: 'Feature',
        path: '/',
        properties: {
            type: 'u-d-f',
            how: 'm-g',
            callsign: 'Trim',
            center: [1.1, 2.2, 0],
            time: '2023-08-04T15:17:43.649Z',
            start: '2023-08-04T15:17:43.649Z',
            stale: '2023-08-04T15:17:43.649Z',
            metadata: {}
        },
        geometry: { type: 'Point', coordinates: [1.1, 2.2, 0] }
    });

    cot.addDest({ mission: ' CAIC Avalanche Forecast ', path: 'layer-1', after: '' });
    cot.addDest({ 'mission-guid': '6840f919-76f1-4f46-a61c-46055ff0ed30' });

    const dest = cot.detail().marti?.dest;
    assert.ok(Array.isArray(dest));
    assert.deepEqual(dest[0]._attributes, { mission: 'CAIC Avalanche Forecast', path: 'layer-1', after: '' });
    assert.deepEqual(dest[1]._attributes, { 'mission-guid': '6840f919-76f1-4f46-a61c-46055ff0ed30' });

    const xml = CoTParser.to_xml(cot);
    assert.ok(xml.includes('mission="CAIC Avalanche Forecast"'), xml);
    assert.ok(xml.includes('mission-guid="6840f919-76f1-4f46-a61c-46055ff0ed30"'), xml);
});
