import test from 'tape';
import { DirectChat } from '../index.js';

test('DirectChat - Basic', (t) => {
    const cot = new DirectChat({
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

    t.equals(cot.is_chat(), true);

    t.ok(cot.raw.event._attributes.uid);
    cot.raw.event._attributes.uid = '123';

    if (!cot.raw.event.detail) {
        t.fail('No Detail Section')
    } else {
        t.equals(typeof cot.raw.event._attributes.time, 'string');
        cot.raw.event._attributes.time = '2024-04-01'
        t.equals(typeof cot.raw.event._attributes.start, 'string');
        cot.raw.event._attributes.start = '2024-04-01'
        t.equals(typeof cot.raw.event._attributes.stale, 'string');
        cot.raw.event._attributes.stale = '2024-04-01'

        if (!cot.raw.event.detail.__chat) {
            t.fail('No Chat Section')
        } else {
            t.equals(typeof cot.raw.event.detail.__chat._attributes.messageId, 'string');
            cot.raw.event.detail.__chat._attributes.messageId = '123';
        }

        if (!cot.raw.event.detail.remarks || !cot.raw.event.detail.remarks._attributes) {
            t.fail('No Remarks Section')
        } else {
            t.equals(typeof cot.raw.event.detail.remarks._attributes.time, 'string');
            cot.raw.event.detail.remarks._attributes.time = '123';
        }

        t.deepEquals(cot.raw, {
            event: {
                _attributes: {
                    uid: '123',
                    version: '2.0',
                    type: 'b-t-f',
                    how: 'h-g-i-g-o',

                    time: '2024-04-01',
                    stale: '2024-04-01',
                    start: '2024-04-01'
                },
                point: {
                    _attributes: { lat: '0.000000', lon: '0.000000', hae: '0.0', ce: '9999999.0', le: '9999999.0' }
                },
                detail: {
                    __chat: {
                        _attributes: {
                            parent: 'RootContactGroup',
                            groupOwner: 'false',
                            messageId: '123',
                            chatroom: 'Alpha Operator',
                            id: '123456',
                            senderCallsign: 'Bravo Operator'
                        },
                        chatgrp: {
                            _attributes: {
                                uid0: "654321",
                                uid1:"123456",
                                id:"123456"
                            }
                        }
                    },
                    link: {
                        _attributes: {
                            uid: '654321',
                            type: 'a-f-G',
                            relation: 'p-p'
                        }
                    },
                    remarks: {
                        _attributes: {
                            source: '654321',
                            to: '123456',
                            time: '123'
                        },
                        _text: 'Direct Message Test'
                    }
                }
            }
        });
    }

    t.end();
});
