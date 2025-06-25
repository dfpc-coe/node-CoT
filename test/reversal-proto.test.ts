import type { Static } from '@sinclair/typebox';
import type { Feature } from '../lib/types/feature.js';
import fs from 'node:fs/promises';
import path from 'node:path';
import test from 'tape';
import CoT, { CoTParser } from '../index.js';
import { fileURLToPath } from 'node:url';

for (const fixturename of await fs.readdir(new URL('./fixtures/', import.meta.url))) {
    test(`Protobuf Reversal Tests: ${fixturename}`, async (t) => {
        const fixture: Static<typeof Feature> = JSON.parse(String(await fs.readFile(path.join(path.parse(fileURLToPath(import.meta.url)).dir, 'fixtures/', fixturename))));
        const geo = CoTParser.from_geojson(fixture)
        const intermediate = CoTParser.to_proto(geo);
        const output = CoTParser.from_proto(intermediate);
        t.deepEquals(fixture, CoTParser.to_geojson(output), fixturename);

        t.end();
    });
}

// Ref: https://github.com/dfpc-coe/node-CoT/issues/55
test('Protobuf Multiple Calls', (t) => {
    const cot = new CoT({
        event: {
            _attributes: {
                version: '2.0',
                uid: 'ebbf42a7-ea71-43a1-baf6-e259c3d115bf',
                type: 'u-rb-a',
                how: 'h-e',
                time: '2024-08-30T22:28:02Z',
                start: '2024-08-30T22:28:02Z',
                stale: '2024-08-31T22:28:02Z',
                access: 'Undefined',
            },
            point: {
                _attributes: {
                    lat: 39.0981196,
                    lon: -108.7395013,
                    hae: 0.0,
                    ce: 9999999.0,
                    le: 9999999.0,
                },
            },
            detail: {
                contact: {
                    _attributes: {
                        callsign: 'sign',
                    },
                },
            },
        },
    })

    const cot2 = CoTParser.from_proto(CoTParser.to_proto(cot))
    t.deepEqual(cot2.raw.event.detail?.contact?._attributes.callsign, 'sign')
    const cot3 = CoTParser.from_proto(CoTParser.to_proto(cot))
    t.deepEqual(cot3.raw.event.detail?.contact?._attributes.callsign, 'sign')

    t.end();
});
