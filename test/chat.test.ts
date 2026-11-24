import assert from 'node:assert/strict';
import test from 'node:test';
import { DirectChat, DirectChatReceipt, GroupChat, MissionChat, CoTParser } from '../index.js';

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

    assert.equal(cot.is_chat(), false);
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
    cot.raw.event._attributes.time = '2024-04-01';
    assert.equal(typeof cot.raw.event._attributes.start, 'string');
    cot.raw.event._attributes.start = '2024-04-01';
    assert.equal(typeof cot.raw.event._attributes.stale, 'string');
    cot.raw.event._attributes.stale = '2024-04-01';

    assert.deepEqual(cot.raw, {
        event: {
            _attributes: {
                uid: 'c0dfa5d7-27c2-4f4a-a4d6-a4d0d4d9b3c1',
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

test('GroupChat - User Group', async () => {
    const messageId = '1d5fa1e3-0a0b-4c69-9c5b-9a5a3c2b7d10';

    const cot = new GroupChat({
        from: { uid: 'ANDROID-sender', callsign: 'Sender' },
        group: { id: '9a2f4c1e-group', name: 'Search Team' },
        members: [
            { uid: 'ANDROID-alpha', callsign: 'Alpha' },
            { uid: 'ANDROID-bravo', callsign: 'Bravo' },
            { uid: 'ANDROID-sender', callsign: 'Sender' }
        ],
        message: 'Rally at the trailhead',
        messageId
    });

    assert.equal(cot.raw.event._attributes.type, 'b-t-f');
    assert.equal(cot.raw.event._attributes.uid, `GeoChat.ANDROID-sender.9a2f4c1e-group.${messageId}`);
    assert.equal(cot.is_chat(), true);

    assert.deepEqual(cot.raw.event.detail?.__chat, {
        _attributes: {
            parent: 'UserGroups',
            groupOwner: 'false',
            messageId,
            chatroom: 'Search Team',
            id: '9a2f4c1e-group',
            senderCallsign: 'Sender'
        },
        chatgrp: {
            _attributes: {
                uid0: 'ANDROID-sender',
                id: '9a2f4c1e-group',
                uid1: 'ANDROID-alpha',
                uid2: 'ANDROID-bravo'
            }
        },
        hierarchy: {
            group: {
                _attributes: { uid: 'UserGroups', name: 'Groups' },
                group: [{
                    _attributes: { uid: '9a2f4c1e-group', name: 'Search Team' },
                    contact: [
                        { _attributes: { uid: 'ANDROID-sender', name: 'Sender' } },
                        { _attributes: { uid: 'ANDROID-alpha', name: 'Alpha' } },
                        { _attributes: { uid: 'ANDROID-bravo', name: 'Bravo' } }
                    ]
                }]
            }
        }
    });

    assert.deepEqual(cot.raw.event.detail?.marti?.dest, [
        { _attributes: { uid: 'ANDROID-alpha' } },
        { _attributes: { uid: 'ANDROID-bravo' } }
    ]);

    assert.equal(cot.raw.event.detail?.remarks?._attributes?.to, undefined);

    const xml = CoTParser.to_xml(cot);
    assert.ok(xml.includes('<contact uid="ANDROID-bravo" name="Bravo"/>'));

    const feat = await CoTParser.to_geojson(CoTParser.from_xml(xml));
    assert.equal(feat.properties.remarks, 'Rally at the trailhead');
    assert.equal(feat.properties.chat?.id, '9a2f4c1e-group');
    assert.equal(feat.properties.chat?.chatroom, 'Search Team');
    assert.equal(feat.properties.chat?.parent, 'UserGroups');
    assert.deepEqual(feat.properties.chat?.chatgrp, {
        _attributes: {
            uid0: 'ANDROID-sender',
            id: '9a2f4c1e-group',
            uid1: 'ANDROID-alpha',
            uid2: 'ANDROID-bravo'
        }
    });
    assert.deepEqual(feat.properties.chat?.hierarchy, {
        uid: 'UserGroups',
        name: 'Groups',
        type: 'group',
        children: [{
            uid: '9a2f4c1e-group',
            name: 'Search Team',
            type: 'group',
            children: [
                { uid: 'ANDROID-sender', name: 'Sender', type: 'contact' },
                { uid: 'ANDROID-alpha', name: 'Alpha', type: 'contact' },
                { uid: 'ANDROID-bravo', name: 'Bravo', type: 'contact' }
            ]
        }]
    });
});

test('GroupChat - Team Group has no hierarchy', () => {
    const cot = new GroupChat({
        from: { uid: 'ANDROID-sender', callsign: 'Sender' },
        group: { id: 'Cyan', name: 'Cyan' },
        parent: 'TeamGroups',
        members: [{ uid: 'ANDROID-alpha', callsign: 'Alpha' }],
        message: 'Team only'
    });

    assert.equal(cot.raw.event.detail?.__chat?._attributes.parent, 'TeamGroups');
    assert.equal(cot.raw.event.detail?.__chat?.hierarchy, undefined);
    assert.deepEqual(cot.raw.event.detail?.marti?.dest, [{ _attributes: { uid: 'ANDROID-alpha' } }]);
});

test('GroupChat - Broadcast (All Chat Rooms)', () => {
    const cot = new GroupChat({
        from: { uid: 'ANDROID-sender', callsign: 'Sender' },
        group: { id: 'All Chat Rooms', name: 'All Chat Rooms' },
        message: 'Everyone'
    });

    assert.deepEqual(cot.raw.event.detail?.__chat, {
        _attributes: {
            parent: 'RootContactGroup',
            groupOwner: 'false',
            messageId: cot.raw.event.detail?.__chat?._attributes.messageId,
            chatroom: 'All Chat Rooms',
            id: 'All Chat Rooms',
            senderCallsign: 'Sender'
        },
        chatgrp: {
            _attributes: {
                uid0: 'ANDROID-sender',
                id: 'All Chat Rooms',
                uid1: 'All Chat Rooms'
            }
        }
    });

    assert.equal(cot.raw.event.detail?.marti, undefined);
    assert.equal(cot.raw.event.detail?.remarks?._attributes?.to, 'All Chat Rooms');
});

test('DirectChat - Event UID ends in the messageId', () => {
    const messageId = '0c6f0c0e-5a0e-4a53-8b5e-0a4f6f1f3f77';

    const cot = new DirectChat({
        to: { uid: 'ANDROID-alpha', callsign: 'Alpha' },
        from: { uid: 'ANDROID-sender', callsign: 'Sender' },
        message: 'Direct',
        messageId
    });

    assert.equal(cot.raw.event._attributes.uid, `GeoChat.ANDROID-sender.ANDROID-alpha.${messageId}`);

    const generated = new DirectChat({
        to: { uid: 'ANDROID-alpha', callsign: 'Alpha' },
        from: { uid: 'ANDROID-sender', callsign: 'Sender' },
        message: 'Direct'
    });

    assert.equal(
        generated.raw.event._attributes.uid,
        `GeoChat.ANDROID-sender.ANDROID-alpha.${generated.raw.event.detail?.__chat?._attributes.messageId}`
    );
});

// Taken from the shape ATAK's GeoChatService.parseHierarchy writes for a sub-group
const nestedXML = `
<event version="2.0" uid="GeoChat.ANDROID-owner.sub-group.6f0d7c52-msg" type="b-t-f" how="h-g-i-g-o" time="2026-01-01T00:00:00Z" start="2026-01-01T00:00:00Z" stale="2026-01-02T00:00:00Z">
    <point lat="0" lon="0" hae="0" ce="9999999" le="9999999"/>
    <detail>
        <__chat id="sub-group" chatroom="Dog Team" senderCallsign="Owner" parent="top-group" groupOwner="true" messageId="6f0d7c52-msg">
            <chatgrp id="sub-group" uid0="ANDROID-owner" uid1="ANDROID-charlie"/>
            <hierarchy>
                <group uid="UserGroups" name="Groups">
                    <group uid="top-group" name="Search Team">
                        <group uid="sub-group" name="Dog Team">
                            <contact uid="ANDROID-charlie" name="Charlie"/>
                        </group>
                        <contact uid="ANDROID-alpha" name="Alpha"/>
                        <contact uid="ANDROID-owner" name="Owner"/>
                    </group>
                </group>
            </hierarchy>
        </__chat>
        <remarks source="BAO.F.ATAK.ANDROID-owner" time="2026-01-01T00:00:00Z">Dogs to the north ridge</remarks>
    </detail>
</event>`;

const nested = {
    uid: 'UserGroups',
    name: 'Groups',
    type: 'group' as const,
    children: [{
        uid: 'top-group',
        name: 'Search Team',
        type: 'group' as const,
        children: [{
            uid: 'sub-group',
            name: 'Dog Team',
            type: 'group' as const,
            children: [
                { uid: 'ANDROID-charlie', name: 'Charlie', type: 'contact' as const }
            ]
        },
        { uid: 'ANDROID-alpha', name: 'Alpha', type: 'contact' as const },
        { uid: 'ANDROID-owner', name: 'Owner', type: 'contact' as const }]
    }]
};

test('GeoChat - Parse a nested hierarchy', async () => {
    const feat = await CoTParser.to_geojson(CoTParser.from_xml(nestedXML));

    assert.deepEqual(feat.properties.chat?.hierarchy, nested);
    assert.equal(feat.properties.chat?.parent, 'top-group');
    assert.equal(feat.properties.chat?.groupOwner, 'true');
});

test('GeoChat - No hierarchy property without a hierarchy', async () => {
    const cot = new DirectChat({
        to: { uid: 'ANDROID-alpha', callsign: 'Alpha' },
        from: { uid: 'ANDROID-sender', callsign: 'Sender' },
        message: 'Direct'
    });

    const feat = await CoTParser.to_geojson(CoTParser.from_xml(CoTParser.to_xml(cot)));
    assert.equal(feat.properties.chat && 'hierarchy' in feat.properties.chat, false);
});

test('GroupChat - Nested group from a parsed hierarchy', async () => {
    const cot = new GroupChat({
        from: { uid: 'ANDROID-alpha', callsign: 'Alpha' },
        group: { id: 'top-group', name: 'Search Team' },
        hierarchy: nested,
        message: 'Copy'
    });

    assert.equal(cot.raw.event.detail?.__chat?._attributes.parent, 'UserGroups');

    // Every contact below the addressed group, however deep, except the sender
    assert.deepEqual(cot.raw.event.detail?.marti?.dest, [
        { _attributes: { uid: 'ANDROID-charlie' } },
        { _attributes: { uid: 'ANDROID-owner' } }
    ]);

    const sub = new GroupChat({
        from: { uid: 'ANDROID-alpha', callsign: 'Alpha' },
        group: { id: 'sub-group', name: 'Dog Team' },
        hierarchy: nested,
        message: 'Copy'
    });

    assert.equal(sub.raw.event.detail?.__chat?._attributes.parent, 'top-group');
    assert.deepEqual(sub.raw.event.detail?.marti?.dest, [{ _attributes: { uid: 'ANDROID-charlie' } }]);

    const feat = await CoTParser.to_geojson(CoTParser.from_xml(CoTParser.to_xml(sub)));
    assert.deepEqual(feat.properties.chat?.hierarchy, nested);
});

test('GeoChat - deleteChild', async () => {
    const cot = new GroupChat({
        from: { uid: 'ANDROID-owner', callsign: 'Owner' },
        group: { id: 'top-group', name: 'Search Team' },
        members: [{ uid: 'ANDROID-alpha', callsign: 'Alpha' }],
        groupOwner: true,
        deleteChild: 'sub-group',
        message: 'Deleted group: Dog Team'
    });

    assert.equal(cot.raw.event.detail?.__chat?._attributes.deleteChild, 'sub-group');

    const feat = await CoTParser.to_geojson(CoTParser.from_xml(CoTParser.to_xml(cot)));
    assert.equal(feat.properties.chat?.deleteChild, 'sub-group');
    assert.equal(feat.properties.chat?.groupOwner, 'true');
});

