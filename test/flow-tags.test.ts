import test from 'tape';
import { DirectChat } from '../index.js';
import fs from 'node:fs';

test('FlowTags - Basic', (t) => {
    const pkg = JSON.parse(String(fs.readFileSync(new URL('../package.json', import.meta.url))));

    const cot = new DirectChat({
        to: { uid: '123456', callsign: 'Alpha Operator' },
        from: { uid: '654321', callsign: 'Bravo Operator' },
        message: 'Direct Message Test'
    });

    if (!cot.raw.event.detail || !cot.raw.event.detail['_flow-tags_']) {
        t.fail('No Detail Section')
    } else {
        t.equals(typeof cot.raw.event.detail['_flow-tags_'][`NodeCoT-${pkg.version}`], 'string');
    }

    t.end();
});
