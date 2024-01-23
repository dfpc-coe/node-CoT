import test from 'tape';
import CoT from '../index.js';

test('CoT.is_chat', (t) => {
    let cot = CoT.from_geojson({
        type: 'Feature',
        properties: {

        },
        geometry: {
            type: 'Point',
            coordinates: [0,0]
        }
    });

    t.ok(cot.is_chat());

    t.end();
});
