import test from 'tape';
import { CoTParser } from '../index.js';

test('CoTParser.from_xml - Invalid', (t) => {
    try {
        CoTParser.from_xml('<not-cot-xml test="1"/>');
        t.fail('Shoult not parse invalid CoT XML');
    } catch (err) {
        t.ok(String(err).includes('Cannot read properties of undefined'));
    }

    t.end();
});
