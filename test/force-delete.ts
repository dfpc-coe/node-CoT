import test from 'tape';
import CoT, { ForceDelete } from '../index.js';

test('ForceDelete - Basic', (t) => {
    const cot = new CoT(new ForceDelete('delete-uid').to_xml());

    if (!cot.raw.event.detail) {
        t.fail('No Detail Section')
    } else {
        t.ok(cot.raw.event.detail['_flow-tags_']);
        delete cot.raw.event.detail['_flow-tags_'];

        t.equals(typeof cot.raw.event._attributes.time, 'string');
        cot.raw.event._attributes.time = '2024-04-01'
        t.equals(typeof cot.raw.event._attributes.start, 'string');
        cot.raw.event._attributes.start = '2024-04-01'
        t.equals(typeof cot.raw.event._attributes.stale, 'string');
        cot.raw.event._attributes.stale = '2024-04-01'

        t.deepEquals(cot.raw, {
            event: {
                _attributes: {
                    uid: 'delete-uid',
                    version: '2.0',
                    type: 't-x-d-d',
                    how: 'm-g',

                    time: '2024-04-01',
                    stale: '2024-04-01',
                    start: '2024-04-01'
                },
                point: {
                    _attributes: { lat: '0.000000', lon: '0.000000', hae: '0.0', ce: '9999999.0', le: '9999999.0' }
                },
                detail: {
                    __forcedelete: {},
                    link: {
                        _attributes: {
                            uid: 'delete-uid',
                            type: 'none',
                            relation: 'none'
                        }
                    },
                }
            }
        });
    }

    t.end();
});
