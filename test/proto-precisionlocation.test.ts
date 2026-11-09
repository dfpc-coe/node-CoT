import assert from 'node:assert/strict';
import test from 'node:test';
import CoT, { CoTParser } from '../index.js';

test('precisionlocation survives a protobuf round trip', async () => {
    const cot = new CoT({
        event: {
            _attributes: {
                version: '2.0', uid: 'sa-1', type: 'a-f-G-U-C', how: 'm-g',
                time: '2026-01-01T00:00:00Z', start: '2026-01-01T00:00:00Z', stale: '2026-01-01T00:05:00Z'
            },
            point: { _attributes: { lat: 39.05, lon: -108.45, hae: 1500.5, ce: 5, le: 10 } },
            detail: {
                contact: { _attributes: { callsign: 'SA' } },
                precisionlocation: { _attributes: { geopointsrc: 'GPS', altsrc: 'DTED2' } }
            }
        }
    });

    const proto = await CoTParser.to_proto(cot);
    assert.ok(!Buffer.from(proto).toString('utf8').includes('precisionlocation'), 'element must not fall back to xmlDetail');

    const back = await CoTParser.from_proto(proto);
    assert.deepEqual({ ...back.raw.event.detail?.precisionlocation?._attributes }, { geopointsrc: 'GPS', altsrc: 'DTED2' });
    assert.deepEqual({ ...back.raw.event.detail?.contact?._attributes }, { callsign: 'SA' });
});
