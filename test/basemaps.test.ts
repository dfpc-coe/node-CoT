import fs from 'node:fs/promises';
import path from 'node:path';
import test from 'tape';
import { Basemap } from '../index.js';
import { fileURLToPath } from 'node:url';

for (const fixturename of await fs.readdir(new URL('./basemaps/', import.meta.url))) {
    test(`Basemap Test: ${fixturename}`, async (t) => {
        const fixture = String(await fs.readFile(path.join(path.parse(fileURLToPath(import.meta.url)).dir, 'basemaps/', fixturename)));
        const container = await Basemap.parse(fixture);

        t.ok(container.raw.customMapSource.name._text.length, 'Ensure raw xml name exists')

        const json = container.to_json();
        t.ok(json.name && json.name.length, 'Ensure JSON name exists');
        t.ok(json.url && json.url.length, 'Ensure JSON url exists');
        t.ok(typeof json.minZoom === 'number', 'Ensure JSON minZoom is a number');
        t.ok(typeof json.maxZoom === 'number', 'Ensure JSON maxZoom is a number');
        t.ok(typeof json.tileType === 'string' && json.tileType.length, 'Ensure JSON tileType is a string');
        
        t.deepEqual(Object.keys(json), [
            'name',
            'url',
            'minZoom',
            'maxZoom',
            'tileType',
            'tileUpdate',
            'backgroundColor',
            'serverParts'
        ], 'Ensure JSON keys match expected structure')

        t.end();
    });
}
