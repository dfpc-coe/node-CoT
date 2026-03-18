import test from 'tape';
import Err from '@openaddresses/batch-error';
import { CoTParser } from '../index.js';
import fs from 'node:fs';

test('FlowTags - Basic', async (t) => {
    const pkg = JSON.parse(String(fs.readFileSync(new URL('../package.json', import.meta.url))));

    const cot = await CoTParser.from_geojson({
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
        t.equals(typeof cot.raw.event.detail['_flow-tags_']._attributes?.[`NodeCoT-${pkg.version}`], 'string');
    }

    t.end();
});

test('FlowTags - Reset Existing', async (t) => {
    const cot = CoTParser.from_xml(`
        <event version="2.0" uid="123" type="a-f-G" how="m-g" time="2023-08-04T15:17:43.649Z" start="2023-08-04T15:17:43.649Z" stale="2023-08-04T15:17:43.649Z">
            <point lat="2.2" lon="1.1" hae="0" ce="9999999" le="9999999" />
            <detail>
                <contact callsign="BasicTest" />
                <_flow-tags_ TAK-Server-test="2026-03-08T04:48:00Z" />
            </detail>
        </event>
    `);

    CoTParser.flow(cot, { remove: true });

    t.equal(cot.raw.event.detail?.['_flow-tags_'], undefined, 'removes existing flow tags');

    CoTParser.flow(cot, { init: true });

    const flow = cot.raw.event.detail?.['_flow-tags_']._attributes;

    t.ok(flow, 'creates replacement flow tags');
    t.notOk(flow?.['TAK-Server-test'], 'removes server flow tags');
    t.equal(Object.keys(flow || {}).length, 1, 'only node-cot flow tag remains');
    t.ok(Object.keys(flow || {})[0]?.startsWith('NodeCoT-'), 'uses node-cot flow tag prefix');

    t.end();
});

test('FlowTags - Stamp Existing', async (t) => {
    const cot = CoTParser.from_xml(`
        <event version="2.0" uid="123" type="a-f-G" how="m-g" time="2023-08-04T15:17:43.649Z" start="2023-08-04T15:17:43.649Z" stale="2023-08-04T15:17:43.649Z">
            <point lat="2.2" lon="1.1" hae="0" ce="9999999" le="9999999" />
            <detail>
                <contact callsign="BasicTest" />
                <_flow-tags_ TAK-Server-test="2026-03-08T04:48:00Z" />
            </detail>
        </event>
    `);

    const flow = CoTParser.flow(cot, { stamp: true, source: 'NodeCoT-test', timestamp: '2026-03-18T00:00:00.000Z' });

    t.equal(flow?.['TAK-Server-test'], '2026-03-08T04:48:00Z', 'preserves existing flow tags when stamping');
    t.equal(flow?.['NodeCoT-test'], '2026-03-18T00:00:00.000Z', 'adds requested flow tag when stamping');
    t.end();
});

test('FlowTags - Legacy Flow Parsing', async (t) => {
    const cot = CoTParser.from_xml(`
        <event version="2.0" uid="123" type="a-f-G" how="m-g" time="2023-08-04T15:17:43.649Z" start="2023-08-04T15:17:43.649Z" stale="2023-08-04T15:17:43.649Z">
            <point lat="2.2" lon="1.1" hae="0" ce="9999999" le="9999999" />
            <detail>
                <contact callsign="BasicTest" />
            </detail>
        </event>
    `);

    cot.raw.event.detail!['_flow-tags_'] = {
        LegacyFlow: '2026-03-08T04:48:00Z'
    };

    const feat = await CoTParser.to_geojson(cot);

    t.equal(feat.properties.flow?.LegacyFlow, '2026-03-08T04:48:00Z', 'parses legacy flow tag shape');
    t.end();
});

test('FlowTags - GeoJSON Internal Flow Control', async (t) => {
    const cot = await CoTParser.from_geojson({
        id: '123',
        type: 'Feature',
        path: '/',
        properties: {
            type: 'a-f-G',
            how: 'm-g',
            callsign: 'BasicTest',
            center: [1.1, 2.2, 0],
            time: '2023-08-04T15:17:43.649Z',
            start: '2023-08-04T15:17:43.649Z',
            stale: '2023-08-04T15:17:43.649Z',
            metadata: {}
        },
        geometry: {
            type: 'Point',
            coordinates: [1.1, 2.2, 0]
        }
    });

    const full = await CoTParser.to_geojson(cot);
    const filtered = await CoTParser.to_geojson(cot, { includeInternalFlow: false });

    t.ok(full.properties.flow, 'default GeoJSON output retains internal flow tags');
    t.ok(Object.keys(full.properties.flow || {}).some((key) => key.startsWith('NodeCoT-')), 'default output includes NodeCoT flow tags');
    t.equal(filtered.properties.flow, undefined, 'filtered GeoJSON output hides internal-only flow tags');
    t.end();
});

test('FlowTags - Invalid Timestamp', async (t) => {
    const cot = CoTParser.from_xml(`
        <event version="2.0" uid="123" type="a-f-G" how="m-g" time="2023-08-04T15:17:43.649Z" start="2023-08-04T15:17:43.649Z" stale="2023-08-04T15:17:43.649Z">
            <point lat="2.2" lon="1.1" hae="0" ce="9999999" le="9999999" />
            <detail>
                <contact callsign="BasicTest" />
            </detail>
        </event>
    `);

    try {
        CoTParser.flow(cot, { stamp: true, timestamp: 'not-a-date' });
        t.fail('expected invalid timestamp to throw');
    } catch (err) {
        t.ok(err instanceof Err, 'throws batch error');
        t.equal((err as Err).status, 400, 'returns bad request status');
        t.equal((err as Error).message, 'Invalid flow timestamp', 'returns clear validation message');
    }

    t.end();
});
