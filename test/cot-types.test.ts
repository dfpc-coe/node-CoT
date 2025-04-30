import { CoTTypes } from '../index.js'
import { StandardIdentity, Domain } from '../lib/utils/2525.js'
import test from 'tape';

test(`CoTTypes Parsing`, async (t) => {
    const types = await CoTTypes.default.load();

    const typed = types.types(StandardIdentity.FRIEND, {
        domain: Domain.ATOM
    });

    for (const type of typed) {
        if (type.cot === 'a-f-G-E-V-E-B') {
            t.deepEquals(type, {
                cot: 'a-f-G-E-V-E-B',
                full: 'Gnd/Equip/Vehic/Bridge',
                desc: 'BRIDGE',
                '2525b': 'SFGPEVEB-------'
            });
        }
    }

    t.end();
});
