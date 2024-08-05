import { CoTTypes } from '../index.js'
import test from 'tape';

test(`CoTTypes Parsing`, async (t) => {
    await CoTTypes.CoTTypes.load();

    t.end();
});
