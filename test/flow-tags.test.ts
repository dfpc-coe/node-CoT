import test from 'tape';
import { CoTParser } from '../index.js';
import fs from 'node:fs';

test('FlowTags - Basic', (t) => {
    const pkg = JSON.parse(String(fs.readFileSync(new URL('../package.json', import.meta.url))));

    const cot = CoTParser.from_geojson({
        "id": "123",
        "type": "Feature",
        "path": "/",
        "properties": {
            "type": "a-f-G",
            "how": "m-g",
            "callsign": "BasicTest",
            "center": [ 1.1, 2.2, 0 ],
            "time": "2023-08-04T15:17:43.649Z",
            "start": "2023-08-04T15:17:43.649Z",
            "stale": "2023-08-04T15:17:43.649Z",
            "metadata": {}
        },
        "geometry": {
            "type": "Point",
            "coordinates": [1.1, 2.2, 0]
        }
    });

    if (!cot.raw.event.detail || !cot.raw.event.detail['_flow-tags_']) {
        t.fail('No Detail Section')
    } else {
        t.equals(typeof cot.raw.event.detail['_flow-tags_'][`NodeCoT-${pkg.version}`], 'string');
    }

    t.end();
});
