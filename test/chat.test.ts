import test from 'tape';
import { DirectChat } from '../index.js';

test('DirectChat', (t) => {
    let cot = new DirectChat({
        to: {
            uid: '123456',
            callsign: 'Alpha Operator'
        },
        from: {
            uid: '654321',
            callsign: 'Bravo Operator'
        },
        message: 'Direct Message Test'
    });

    t.ok(cot.is_chat());

    t.end();
});
