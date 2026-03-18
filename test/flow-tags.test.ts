import test from 'tape';
import { CoTParser } from '../index.js';
import fs from 'node:fs';
import CoT from '../index.js';

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
        t.equals(typeof cot.raw.event.detail['_flow-tags_'][`NodeCoT-${pkg.version}`], 'string');
    }

    t.end();
});

test('FlowTags - resetFlow only removes TAK-Server tags in XML', async (t) => {
    const pkg = JSON.parse(String(fs.readFileSync(new URL('../package.json', import.meta.url))));
    const cot = new CoT({
        event: {
            _attributes: {
                version: '2.0',
                uid: 'flow-tags-xml',
                type: 'a-f-G',
                how: 'm-g',
                time: '2024-01-01T00:00:00.000Z',
                start: '2024-01-01T00:00:00.000Z',
                stale: '2024-01-02T00:00:00.000Z'
            },
            point: {
                _attributes: {
                    lat: 0,
                    lon: 0,
                    hae: 0,
                    ce: 9999999,
                    le: 9999999
                }
            },
            detail: {
                '_flow-tags_': {
                    _attributes: {
                        'TAK-Server-attr': 'drop-me',
                        'custom-attr': 'keep-me'
                    },
                    'TAK-Server-node': 'drop-me-too',
                    'custom-node': 'keep-me-too'
                }
            }
        }
    });

    const xml = CoTParser.to_xml(cot, { resetFlow: true });
    const flowTags = cot.raw.event.detail?.['_flow-tags_'];

    t.notOk(flowTags?._attributes?.['TAK-Server-attr'], 'removes TAK-Server attribute flow tags');
    t.equal(flowTags?._attributes?.['custom-attr'], 'keep-me', 'preserves custom attribute flow tags');
    t.notOk(flowTags?.['TAK-Server-node'], 'removes TAK-Server node flow tags');
    t.equal(flowTags?.['custom-node'], 'keep-me-too', 'preserves custom node flow tags');
    t.equal(typeof flowTags?.[`NodeCoT-${pkg.version}`], 'string', 'adds current NodeCoT flow tag');
    t.notOk(xml.includes('TAK-Server-attr'), 'serialized XML omits TAK-Server attribute flow tags');
    t.notOk(xml.includes('TAK-Server-node'), 'serialized XML omits TAK-Server node flow tags');
    t.ok(xml.includes('custom-attr="keep-me"'), 'serialized XML preserves custom attribute flow tags');
    t.ok(xml.includes('<custom-node>keep-me-too</custom-node>'), 'serialized XML preserves custom node flow tags');

    t.end();
});

test('FlowTags - resetFlow only removes TAK-Server tags in Proto', async (t) => {
    const pkg = JSON.parse(String(fs.readFileSync(new URL('../package.json', import.meta.url))));
    const cot = new CoT({
        event: {
            _attributes: {
                version: '2.0',
                uid: 'flow-tags-proto',
                type: 'a-f-G',
                how: 'm-g',
                time: '2024-01-01T00:00:00.000Z',
                start: '2024-01-01T00:00:00.000Z',
                stale: '2024-01-02T00:00:00.000Z'
            },
            point: {
                _attributes: {
                    lat: 0,
                    lon: 0,
                    hae: 0,
                    ce: 9999999,
                    le: 9999999
                }
            },
            detail: {
                '_flow-tags_': {
                    _attributes: {
                        'TAK-Server-attr': 'drop-me',
                        'custom-attr': 'keep-me'
                    },
                    'TAK-Server-node': 'drop-me-too',
                    'custom-node': 'keep-me-too'
                }
            }
        }
    });

    const proto = await CoTParser.to_proto(cot, 1, { resetFlow: true });
    const output = await CoTParser.from_proto(proto);
    const flowTags = output.raw.event.detail?.['_flow-tags_'];

    t.notOk(flowTags?._attributes?.['TAK-Server-attr'], 'protobuf omits TAK-Server attribute flow tags');
    t.equal(flowTags?._attributes?.['custom-attr'], 'keep-me', 'protobuf preserves custom attribute flow tags');
    t.notOk(flowTags?.['TAK-Server-node'], 'protobuf omits TAK-Server node flow tags');
    t.equal(flowTags?.['custom-node']?._text, 'keep-me-too', 'protobuf preserves custom node flow tags');
    t.equal(typeof flowTags?.[`NodeCoT-${pkg.version}`], 'string', 'protobuf retains a current NodeCoT flow tag');

    t.end();
});
