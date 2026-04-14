import { CoTTypes } from '../index.js'
import { StandardIdentity, Domain } from '../lib/utils/2525.js'
import assert from 'node:assert/strict';
import test from 'node:test';

test(`CoTTypes Parsing`, async () => {
    const types = await CoTTypes.default.load();

    const typed = types.types(StandardIdentity.FRIEND, {
        domain: Domain.ATOM
    });

    for (const type of typed) {
        if (type.cot === 'a-f-G-E-V-E-B') {
            assert.deepEqual(type, {
                cot: 'a-f-G-E-V-E-B',
                full: 'Gnd/Equip/Vehic/Bridge',
                desc: 'BRIDGE',
                '2525b': 'SFGPEVEB-------'
            });
        }
    }
});
