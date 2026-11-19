import type { Static } from '@sinclair/typebox';
import type { Feature } from '../lib/types/feature.js';
import fs from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
import test from 'node:test';
import { CoTParser } from '../index.js';

for (const fixturename of await fs.readdir(new URL('./fixtures/', import.meta.url))) {
    test(`GeoJSON Reversal Tests: ${fixturename}`, async () => {
        const fixture = JSON.parse(String(await fs.readFile(path.join(import.meta.dirname, 'fixtures/', fixturename)))) as Static<typeof Feature>;
        const geo = await CoTParser.from_geojson(fixture)
        const output = await CoTParser.to_geojson(geo);

        assert.deepEqual(fixture, output, fixturename);
    });
}
