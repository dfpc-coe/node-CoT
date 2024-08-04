import { Static } from '@sinclair/typebox';
import type { Feature } from '../lib/feature.js';
import fs from 'node:fs/promises';
import path from 'node:path';
import test from 'tape';
import CoT from '../index.js';
import { fileURLToPath } from 'node:url';

for (const fixturename of await fs.readdir(new URL('./fixtures/', import.meta.url))) {
    test(`GeoJSON Reversal Tests: ${fixturename}`, async (t) => {
        const fixture: Static<typeof Feature> = JSON.parse(String(await fs.readFile(path.join(path.parse(fileURLToPath(import.meta.url)).dir, 'fixtures/', fixturename))));
        const geo = CoT.from_geojson(fixture)
        const output = geo.to_geojson();
        t.deepEquals(fixture, output, fixturename);

        t.end();
    });
}
