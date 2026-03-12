import test from 'tape';
import { DirectChat, MissionChat, CoTParser } from '../index.js';

test('MissionChat - GeoJSON output', async (t) => {
    const messageId = '6c19bcd5-c632-4c59-95e2-ae8c76c8feab';

    const cot = new MissionChat({
        from: {
            uid: 'ANDROID-764679f74013dfe2',
            type: 'a-f-G-E-V-C'
        },
        mission: {
            name: 'Test Attachments',
            id: 'ops.cotak.gov-8443-ssl-Test Attachments'
        },
        senderCallsign: 'COTAK Admin Ingalls',
        message: 'sent a datapackage with 1 item',
        messageId
    });

    // Pin time fields to match expected output
    cot.raw.event._attributes.time  = '2026-03-12T13:30:26Z';
    cot.raw.event._attributes.start = '2026-03-12T13:30:26Z';
    cot.raw.event._attributes.stale = '2026-03-13T13:30:26Z';

    if (cot.raw.event.detail?.remarks?._attributes) {
        cot.raw.event.detail.remarks._attributes.time = '2026-03-12T13:30:26Z';
    }

    // Set coordinates to match expected output
    cot.raw.event.point._attributes.lon = -108.537452;
    cot.raw.event.point._attributes.lat = 39.078503;
    cot.raw.event.point._attributes.hae = 1393.296;

    t.deepEquals(await CoTParser.to_geojson(cot), {
        id: `GeoChat.ANDROID-764679f74013dfe2.ops.cotak.gov-8443-ssl-Test Attachments.${messageId}`,
        type: 'Feature',
        path: '/',
        properties: {
            callsign: 'UNKNOWN',
            center: [ -108.537452, 39.078503, 1393.296 ],
            type: 'b-t-f',
            how: 'h-g-i-g-o',
            time: '2026-03-12T13:30:26Z',
            start: '2026-03-12T13:30:26Z',
            stale: '2026-03-13T13:30:26Z',
            remarks: 'sent a datapackage with 1 item',
            links: [{
                uid: 'ANDROID-764679f74013dfe2',
                type: 'a-f-G-E-V-C',
                relation: 'p-p'
            }],
            chat: {
                parent: 'DataSyncMissionsList',
                groupOwner: 'false',
                messageId,
                chatroom: 'Test Attachments',
                id: 'ops.cotak.gov-8443-ssl-Test Attachments',
                senderCallsign: 'COTAK Admin Ingalls',
                chatgrp: {
                    _attributes: {
                        uid0: 'ANDROID-764679f74013dfe2',
                        uid1: 'ops.cotak.gov-8443-ssl-Test Attachments',
                        id: 'ops.cotak.gov-8443-ssl-Test Attachments'
                    }
                }
            },
            dest: { mission: 'Test Attachments' },
            metadata: {}
        },
        geometry: {
            type: 'Point',
            coordinates: [ -108.537452, 39.078503, 1393.296 ]
        }
    });

    t.end();
});

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
                    _attributes: { lat: 0.000000, lon: 0.000000, hae: 0.0, ce: 9999999.0, le: 9999999.0 }
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
                    marti: {
                        dest: [{
                            _attributes: {
                                uid: '123456',
                            }
                        }],
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
