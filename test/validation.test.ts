import test from 'tape';
import CoT from '../index.js';

test('CoT.from_geojson - Point', (t) => {
    try {
        // @ts-expect-error - Testing invalid input
        new CoT({ event: { _attributes: {} } });
        t.fail();
    } catch (err) {
        t.ok(String(err).includes('must have required property'));
    }

    t.end();
});
