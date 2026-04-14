import assert from 'node:assert/strict';
import test from 'node:test';
import Util from '../lib/utils/util.js';

test('Util.cot_date - default', () => {
    const res = Util.cot_date();

    // Within 100ms of current time
    assert.ok(+new Date(res.time) > +new Date() - 100, 'res.time within 100ms of current time');

    // res.start is the same as res.time
    assert.equal(+new Date(res.start), +new Date(res.time), 'by default res.start === res.time');

    // Approx 20s ahead of start
    assert.ok(+new Date(res.stale) > +new Date(res.start) + 20 * 1000 - 100);
    assert.ok(+new Date(res.stale) < +new Date(res.start) + 20 * 1000 + 100);
});

test('Util.cot_date - stale', () => {
    const res = Util.cot_date(null, null, 1000);

    // Within 100ms of current time
    assert.ok(+new Date(res.time) > +new Date() - 100, 'res.time within 100ms of current time');

    // res.start is the same as res.time
    assert.equal(+new Date(res.start), +new Date(res.time), 'by default res.start === res.time');

    // Approx 1s ahead of start
    assert.ok(+new Date(res.stale) > +new Date(res.start) + 1 * 1000 - 100);
    assert.ok(+new Date(res.stale) < +new Date(res.start) + 1 * 1000 + 100);
});
