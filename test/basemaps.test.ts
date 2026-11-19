import fs from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
import test from 'node:test';
import { Basemap } from '../index.js';

for (const fixturename of await fs.readdir(new URL('./basemaps/', import.meta.url))) {
    test(`Basemap Test: ${fixturename}`, async () => {
        const fixture = String(await fs.readFile(path.join(import.meta.dirname, 'basemaps/', fixturename)));
        const container = Basemap.parse(fixture);

        assert.ok(container.raw.customMapSource.name._text.length, 'Ensure raw xml name exists')

        const json = container.to_json();
        assert.ok(json.name && json.name.length > 0, 'Ensure JSON name exists');
        assert.ok(json.url && json.url.length > 0, 'Ensure JSON url exists');
        assert.ok(typeof json.minZoom === 'number', 'Ensure JSON minZoom is a number');
        assert.ok(typeof json.maxZoom === 'number', 'Ensure JSON maxZoom is a number');
        assert.ok(typeof json.tileType === 'string' && json.tileType.length > 0, 'Ensure JSON tileType is a string');
        
        assert.deepEqual(Object.keys(json), [
            'name',
            'url',
            'minZoom',
            'maxZoom',
            'tileType',
            'tileUpdate',
            'backgroundColor',
            'serverParts'
        ], 'Ensure JSON keys match expected structure')
    });
}
