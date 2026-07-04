import assert from 'node:assert/strict';
import test from 'node:test';
import { DirectChat, DirectChatReceipt, MissionChat, CoTParser } from '../index.js';

test('MissionChat - GeoJSON output', async () => {
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

    assert.deepEqual(await CoTParser.to_geojson(cot), {
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
});

test('DirectChat - Basic', () => {
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

    assert.equal(cot.is_chat(), true);

    assert.ok(cot.raw.event._attributes.uid);
    cot.raw.event._attributes.uid = '123';

    if (!cot.raw.event.detail) {
        assert.fail('No Detail Section')
    } else {
        assert.equal(typeof cot.raw.event._attributes.time, 'string');
        cot.raw.event._attributes.time = '2024-04-01'
        assert.equal(typeof cot.raw.event._attributes.start, 'string');
        cot.raw.event._attributes.start = '2024-04-01'
        assert.equal(typeof cot.raw.event._attributes.stale, 'string');
        cot.raw.event._attributes.stale = '2024-04-01'

        if (!cot.raw.event.detail.__chat) {
            assert.fail('No Chat Section')
        } else {
            assert.equal(typeof cot.raw.event.detail.__chat._attributes.messageId, 'string');
            cot.raw.event.detail.__chat._attributes.messageId = '123';
        }

        if (!cot.raw.event.detail.remarks || !cot.raw.event.detail.remarks._attributes) {
            assert.fail('No Remarks Section')
        } else {
            assert.equal(typeof cot.raw.event.detail.remarks._attributes.time, 'string');
            cot.raw.event.detail.remarks._attributes.time = '123';
        }

        assert.deepEqual(cot.raw, {
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
});

test('DirectChatReceipt - Parse ATAK style __chatreceipt', async () => {
    const cot = CoTParser.from_xml(`
        <event version="2.0" uid="f77dae64-3573-4dae-8447-c0c7a0219d7a.d" type="b-t-f-d" how="h-g-i-g-o" time="2026-07-02T16:19:11Z" start="2026-07-02T16:19:15Z" stale="2026-07-03T16:19:15Z">
            <point lat="49.2695677890608" lon="-123.112677849291" hae="-11.93099513512" ce="9999999" le="9999999"/>
            <detail>
                <__chatreceipt parent="RootContactGroup" groupOwner="false" messageId="f77dae64-3573-4dae-8447-c0c7a0219d7a" chatroom="DFPC Ingalls" id="ANDROID-CloudTAK-admin" senderCallsign="TR-SSC">
                    <chatgrp uid0="ANDROID-121345" uid1="ANDROID-CloudTAK-admin" id="ANDROID-CloudTAK-admin"/>
                </__chatreceipt>
                <link uid="ANDROID-121345" type="a-f-G-U-C-I" relation="p-p"/>
            </detail>
        </event>
    `);

    assert.equal(cot.is_chat(), false);
    assert.equal(cot.is_chat_receipt(), true);

    const feat = await CoTParser.to_geojson(cot);

    assert.equal(feat.properties.type, 'b-t-f-d');
    assert.deepEqual(feat.properties.chat, {
        parent: 'RootContactGroup',
        groupOwner: 'false',
        messageId: 'f77dae64-3573-4dae-8447-c0c7a0219d7a',
        chatroom: 'DFPC Ingalls',
        id: 'ANDROID-CloudTAK-admin',
        senderCallsign: 'TR-SSC',
        chatgrp: {
            _attributes: {
                uid0: 'ANDROID-121345',
                uid1: 'ANDROID-CloudTAK-admin',
                id: 'ANDROID-CloudTAK-admin'
            }
        }
    });
});

test('DirectChatReceipt - Parse WinTAK style __chat receipt', async () => {
    const cot = CoTParser.from_xml(`
        <event version="2.0" uid="f77dae64-3573-4dae-8447-c0c7a0219d7a" type="b-t-f-r" how="h-g-i-g-o" time="2026-07-02T16:19:28Z" start="2026-07-02T16:19:31Z" stale="2026-07-03T16:19:31Z" access="Undefined">
            <point lat="49.2695677890608" lon="-123.112677849291" hae="-11.93099513512" ce="9999999" le="9999999"/>
            <detail>
                <__chat id="ANDROID-CloudTAK-admin" chatroom="DFPC Ingalls" senderCallsign="TR-SSC" groupOwner="false" messageId="f77dae64-3573-4dae-8447-c0c7a0219d7a">
                    <chatgrp id="ANDROID-CloudTAK-admin" uid0="ANDROID-121345" uid1="ANDROID-CloudTAK-admin"/>
                </__chat>
                <link uid="ANDROID-121345" type="a-f-G-U-C-I" relation="p-p"/>
            </detail>
        </event>
    `);

    assert.equal(cot.is_chat_receipt(), true);

    const feat = await CoTParser.to_geojson(cot);

    assert.equal(feat.properties.type, 'b-t-f-r');
    assert.equal(feat.properties.remarks, undefined);
    assert.deepEqual(feat.properties.chat, {
        groupOwner: 'false',
        messageId: 'f77dae64-3573-4dae-8447-c0c7a0219d7a',
        chatroom: 'DFPC Ingalls',
        id: 'ANDROID-CloudTAK-admin',
        senderCallsign: 'TR-SSC',
        chatgrp: {
            _attributes: {
                id: 'ANDROID-CloudTAK-admin',
                uid0: 'ANDROID-121345',
                uid1: 'ANDROID-CloudTAK-admin'
            }
        }
    });
});

test('DirectChatReceipt - Builder', async () => {
    const cot = new DirectChatReceipt({
        to: {
            uid: '123456',
            callsign: 'Alpha Operator'
        },
        from: {
            uid: '654321',
            callsign: 'Bravo Operator'
        },
        status: 'read',
        messageId: 'c0dfa5d7-27c2-4f4a-a4d6-a4d0d4d9b3c1'
    });

    assert.equal(cot.is_chat(), false);
    assert.equal(cot.is_chat_receipt(), true);

    assert.equal(typeof cot.raw.event._attributes.time, 'string');
    cot.raw.event._attributes.time = '2024-04-01'
    assert.equal(typeof cot.raw.event._attributes.start, 'string');
    cot.raw.event._attributes.start = '2024-04-01'
    assert.equal(typeof cot.raw.event._attributes.stale, 'string');
    cot.raw.event._attributes.stale = '2024-04-01'

    assert.deepEqual(cot.raw, {
        event: {
            _attributes: {
                uid: 'c0dfa5d7-27c2-4f4a-a4d6-a4d0d4d9b3c1.r',
                version: '2.0',
                type: 'b-t-f-r',
                how: 'h-g-i-g-o',

                time: '2024-04-01',
                stale: '2024-04-01',
                start: '2024-04-01'
            },
            point: {
                _attributes: { lat: 0.000000, lon: 0.000000, hae: 0.0, ce: 9999999.0, le: 9999999.0 }
            },
            detail: {
                __chatreceipt: {
                    _attributes: {
                        parent: 'RootContactGroup',
                        groupOwner: 'false',
                        messageId: 'c0dfa5d7-27c2-4f4a-a4d6-a4d0d4d9b3c1',
                        chatroom: 'Alpha Operator',
                        id: '123456',
                        senderCallsign: 'Bravo Operator'
                    },
                    chatgrp: {
                        _attributes: {
                            uid0: '654321',
                            uid1: '123456',
                            id: '123456'
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
                }
            }
        }
    });
});
