import test from 'tape';
import Util from '../lib/util.js';

test('Util.cot_date - default', (t) => {
    const res = Util.cot_date();

    // Within 100ms of current time
    t.ok(+new Date(res.time) > +new Date() - 100, 'res.time within 100ms of current time');

    // res.start is the same as res.time
    t.equals(+new Date(res.start), +new Date(res.time), 'by default res.start === res.time');

    // Approx 20s ahead of start
    t.ok(+new Date(res.stale) > +new Date(res.start) + 20 * 1000 - 100);
    t.ok(+new Date(res.stale) < +new Date(res.start) + 20 * 1000 + 100);

    t.end();
});

test('Util.cot_date - stale', (t) => {
    const res = Util.cot_date(null, null, 1000);

    // Within 100ms of current time
    t.ok(+new Date(res.time) > +new Date() - 100, 'res.time within 100ms of current time');

    // res.start is the same as res.time
    t.equals(+new Date(res.start), +new Date(res.time), 'by default res.start === res.time');

    // Approx 1s ahead of start
    t.ok(+new Date(res.stale) > +new Date(res.start) + 1 * 1000 - 100);
    t.ok(+new Date(res.stale) < +new Date(res.start) + 1 * 1000 + 100);

    t.end();
});
