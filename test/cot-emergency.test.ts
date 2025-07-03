import test from 'tape';
import { CoTParser } from '../index.js';

test('COT Emergency', (t) => {
    const cot = CoTParser.from_geojson({
        id: '6da80127-44d4-4bf0-89bd-ecd326afaef1',
        type: 'Feature',
        properties: {
            callsign: 'Example Emergency',
            type: 'b-a-o-opn',
            how: 'm-g'
        },
        geometry: {
            type: 'Point',
            coordinates: [ -108.547391197293, 38.5144413169673 ]
        }
    })

    if (!cot.raw.event.detail) {
        t.fail('No Detail Section')
    } else {
        t.ok(cot.raw.event.detail['_flow-tags_']);
        delete cot.raw.event.detail['_flow-tags_'];

        t.deepEquals(cot.type(), 'b-a-o-opn', 'Type should be b-a-o-opn');

        t.deepEquals(cot.raw.event.detail.emergency, {
            _attributes: { type: 'Troops In Contact' },
            _text: 'Example Emergency'
        }, 'Detail should match expected values');
    }

    t.end();
});
