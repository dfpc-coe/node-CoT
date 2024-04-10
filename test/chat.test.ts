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
        t.ok(cot.raw.event.detail['_flow-tags_']);
        delete cot.raw.event.detail['_flow-tags_'];

        t.equals(typeof cot.raw.event._attributes.time, 'string');
        t.equals(typeof cot.raw.event._attributes.start, 'string');
        t.equals(typeof cot.raw.event._attributes.stale, 'string');

        if (!cot.raw.event.detail.__chat) {
            t.fail('No Detail Section')
        } else {
            t.equals(typeof cot.raw.event.detail.__chat._attributes.messageId, 'string');
            cot.raw.event.detail.__chat._attributes.messageId = '123';
        }

        if (!cot.raw.event.detail.remarks || !cot.raw.event.detail.remarks._attributes) {
            t.fail('No Detail Section')
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
