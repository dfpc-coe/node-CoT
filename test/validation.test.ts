import test from 'tape';
import CoT from '../index.js';

test('CoT.from_geojson - Point', (t) => {
    try {
        new CoT(
            {
                event: {
                // @ts-expect-error we're trying to force an error here
                    _attributes: {}
                }                
            }
        );
        t.fail();
    } catch (err) {
        t.ok(String(err).includes('must have required property'));
    }

    t.end();
});
