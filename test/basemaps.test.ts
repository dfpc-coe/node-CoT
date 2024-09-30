import fs from 'node:fs/promises';
import path from 'node:path';
import test from 'tape';
import { Basemap } from '../index.js';
import { fileURLToPath } from 'node:url';

for (const fixturename of await fs.readdir(new URL('./basemaps/', import.meta.url))) {
    test(`Basemap Test: ${fixturename}`, async (t) => {
        const fixture = String(await fs.readFile(path.join(path.parse(fileURLToPath(import.meta.url)).dir, 'basemaps/', fixturename)));
        const container = await Basemap.parse(fixture);

        t.ok(container.raw.customMapSource.name._text.length)

        t.end();
    });
}
