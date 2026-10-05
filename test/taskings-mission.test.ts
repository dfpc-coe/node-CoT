import assert from 'node:assert/strict';
import test from 'node:test';
import CoT, { CoTParser } from '../index.js';

test('Decode MissionChange CoTs', async () => {
    const cot = new CoT({"event":{"_attributes":{"how":"h-g-i-g-o","type":"t-x-m-c","version":"2.0","uid":"f205227b-2e23-40bf-8948-711566116365","start":"2024-07-17T18:49:03Z","time":"2024-07-17T18:49:03Z","stale":"2024-07-17T18:49:23Z"},"point":{"_attributes":{"ce":9999999,"le":9999999,"hae":0,"lat":0,"lon":0}},"detail":{"mission":{"_attributes":{"type":"CHANGE","tool":"public","name":"2024-07-17 - Lost Hiker","guid":"4ce8e41d-21e4-4471-a303-09d12bb93bcf","authorUid":"CN=mesasar-machine-user@ingalls.ca,OU=WILDFIRE,O=CO-TAK"},"MissionChanges": {"MissionChange":{"contentUid":{"_text":"layer-11-27529-1"},"creatorUid":{"_text":"CN=mma-etl-user@cotak.gov,OU=WILDFIRE,O=CO-TAK"},"isFederatedChange":{"_text":false},"missionName":{"_text":"Colorado NIFS Fire Perimeters"},"timestamp":{"_text":"2024-08-16T15:21:55.361Z"},"type":{"_text":"ADD_CONTENT"},"details":{"_attributes":{"type":"t-x-d-d"}}}}}}}});

    if (!cot.raw.event.detail) {
        assert.fail('No Detail Section')
    } else {
        assert.deepEqual({
            id: 'f205227b-2e23-40bf-8948-711566116365',
            type: 'Feature',
            path: '/',
            properties: {
                callsign: 'UNKNOWN',
                center: [ 0, 0, 0 ],
                type: 't-x-m-c',
                how: 'h-g-i-g-o',
                time: '2024-07-17T18:49:03Z',
                start: '2024-07-17T18:49:03Z',
                stale: '2024-07-17T18:49:23Z',
                mission: {
                    type: 'CHANGE',
                    tool: 'public',
                    name: '2024-07-17 - Lost Hiker',
                    guid: '4ce8e41d-21e4-4471-a303-09d12bb93bcf',
                    authorUid: 'CN=mesasar-machine-user@ingalls.ca,OU=WILDFIRE,O=CO-TAK',
                    missionChanges: [{
                        contentUid: 'layer-11-27529-1',
                        creatorUid: 'CN=mma-etl-user@cotak.gov,OU=WILDFIRE,O=CO-TAK',
                        isFederatedChange: false,
                        missionName: 'Colorado NIFS Fire Perimeters',
                        timestamp: '2024-08-16T15:21:55.361Z',
                        type: 'ADD_CONTENT',
                        details: {                                                                                                                                                                          
                          type: 't-x-d-d',                                                                                                                                                           
                        } 
                    }]
                },
                metadata: {}
            },
            geometry: {
                type: 'Point',
                coordinates: [ 0, 0, 0 ]
            }
        }, await CoTParser.to_geojson(cot));
    }
});

test('Decode MissionChange CoTs - #2', async () => {
    const cot = new CoT({"event":{"_attributes":{"how":"h-g-i-g-o","type":"t-x-m-c","version":"2.0","uid":"f205227b-2e23-40bf-8948-711566116365","start":"2024-07-17T18:49:03Z","time":"2024-07-17T18:49:03Z","stale":"2024-07-17T18:49:23Z"},"point":{"_attributes":{"ce":9999999,"le":9999999,"hae":0,"lat":0,"lon":0}},"detail":{"mission":{"_attributes":{"type":"CHANGE","tool":"public","name":"2024-07-17 - Lost Hiker","guid":"4ce8e41d-21e4-4471-a303-09d12bb93bcf","authorUid":"CN=mesasar-machine-user@ingalls.ca,OU=WILDFIRE,O=CO-TAK"},"MissionChanges":{"MissionChange":{"contentUid":{"_text":"8fb7b41f-77c5-4537-9a4c-5b7a76a71cb9"},"creatorUid":{"_text":"CN=mesasar-machine-user@ingalls.ca,OU=WILDFIRE,O=CO-TAK"},"isFederatedChange":{"_text":false},"missionName":{"_text":"2024-07-17 - Lost Hiker"},"timestamp":{"_text":"2024-07-17T18:49:03.606Z"},"type":{"_text":"ADD_CONTENT"},"details":{"_attributes":{"type":"u-d-p","callsign":"Third Test","color":"-65536"},"location":{"_attributes":{"lat":"39.118611111111115","lon":"-108.31361111111111"}}}}}}}}});

    if (!cot.raw.event.detail) {
        assert.fail('No Detail Section')
    } else {
        assert.deepEqual({
            id: 'f205227b-2e23-40bf-8948-711566116365',
            type: 'Feature',
            path: '/',
            properties: {
                callsign: 'UNKNOWN',
                center: [ 0, 0, 0 ],
                type: 't-x-m-c',
                how: 'h-g-i-g-o',
                time: '2024-07-17T18:49:03Z',
                start: '2024-07-17T18:49:03Z',
                stale: '2024-07-17T18:49:23Z',
                mission: {
                    type: 'CHANGE',
                    tool: 'public',
                    name: '2024-07-17 - Lost Hiker',
                    guid: '4ce8e41d-21e4-4471-a303-09d12bb93bcf',
                    authorUid: 'CN=mesasar-machine-user@ingalls.ca,OU=WILDFIRE,O=CO-TAK',
                    missionChanges: [{
                        contentUid: '8fb7b41f-77c5-4537-9a4c-5b7a76a71cb9',
                        creatorUid: 'CN=mesasar-machine-user@ingalls.ca,OU=WILDFIRE,O=CO-TAK',
                        isFederatedChange: false,
                        missionName: '2024-07-17 - Lost Hiker',
                        timestamp: '2024-07-17T18:49:03.606Z',
                        type: 'ADD_CONTENT',
                        details: {                                                                                                                                                                          
                          type: 'u-d-p',                                                                                                                                                           
                          callsign: 'Third Test',                                                                                                                                                  
                          color: '-65536',                                                                                                                                                         
                          lat: '39.118611111111115',                                                                                                                                               
                          lon: '-108.31361111111111'                                                                                                                                               
                        } 
                    }]
                },
                metadata: {}
            },
            geometry: {
                type: 'Point',
                coordinates: [ 0, 0, 0 ]
            }
        }, await CoTParser.to_geojson(cot));
    }
});

test('Decode MissionChange Logs', async () => {
    const cot = new CoT({"event":{"_attributes":{"how":"h-g-i-g-o","type":"t-x-m-c-l","version":"2.0","uid":"e77c55da-c5d2-4200-bbc9-9967b3f30b5b","start":"2024-10-14T15:33:04Z","time":"2024-10-14T15:33:04Z","stale":"2024-10-14T15:33:24Z"},"point":{"_attributes":{"ce":9999999,"le":9999999,"hae":0,"lat":0,"lon":0}},"detail":{"mission":{"_attributes":{"type":"CHANGE","tool":"public","name":"manual test","guid":"ae2e9ec4-2762-4664-8660-1ef824bde9bc","authorUid":"ANDROID-0ca41830e11d2ef3"}}}}});

    if (!cot.raw.event.detail) {
        assert.fail('No Detail Section')
    } else {
        assert.deepEqual({
            id: 'e77c55da-c5d2-4200-bbc9-9967b3f30b5b',
            type: 'Feature',
            path: '/',
            properties: {
                callsign: 'UNKNOWN',
                center: [ 0, 0, 0 ],
                type: 't-x-m-c-l',
                how: 'h-g-i-g-o',
                time: '2024-10-14T15:33:04Z',
                start: '2024-10-14T15:33:04Z',
                stale: '2024-10-14T15:33:24Z',
                mission: {
                    type: 'CHANGE',
                    tool: 'public',
                    name: 'manual test',
                    guid: 'ae2e9ec4-2762-4664-8660-1ef824bde9bc',
                    authorUid: 'ANDROID-0ca41830e11d2ef3',
                },
                metadata: {}
            },
            geometry: {
                type: 'Point',
                coordinates: [ 0, 0, 0 ]
            }
        }, await CoTParser.to_geojson(cot));
    }
});

test('Decode MissionChange ContentResource', async () => {
    const cot = new CoT({
        "event": {
            "_attributes": {
                "how": "h-g-i-g-o",
                "type": "t-x-m-c",
                "version": "2.0",
                "uid": "6e244207-3f63-43a5-8da4-0ff470b23859",
                "start": "2026-02-19T22:39:15Z",
                "time": "2026-02-19T22:39:15Z",
                "stale": "2026-02-19T22:39:35Z"
            },
            "point": {
                "_attributes": {
                    "ce": "9999999",
                    "le": "9999999",
                    "hae": 0,
                    "lat": 0,
                    "lon": 0
                }
            },
            "detail": {
                "mission": {
                    "_attributes": {
                        "type": "CHANGE",
                        "tool": "public",
                        "name": "Test Attachments",
                        "guid": "cd4cfc53-621a-4dd9-81f8-8f87a3867bf2",
                        "authorUid": "nicholas.ingalls@state.co.us"
                    },
                    "MissionChanges": {
                        "MissionChange": {
                            "contentResource": {
                                "expiration": {
                                    "_text": "-1"
                                },
                                "filename": {
                                    "_text": "images.jpeg"
                                },
                                "hash": {
                                    "_text": "ce8a1eedf818cb3be12646177779820ed1d71c95ac558a70fde07b483979512a"
                                },
                                "name": {
                                    "_text": "images.jpeg"
                                },
                                "size": {
                                    "_text": 9420
                                },
                                "submissionTime": {
                                    "_text": "2026-02-19T20:48:29.725Z"
                                },
                                "submitter": {
                                    "_text": "nicholas.ingalls@state.co.us"
                                },
                                "tool": {
                                    "_text": "public"
                                },
                                "uid": {
                                    "_text": "add1e84f-6025-4cf5-a7c3-b9087309216c"
                                }
                            },
                            "creatorUid": {
                                "_text": "nicholas.ingalls@state.co.us"
                            },
                            "isFederatedChange": {
                                "_text": false
                            },
                            "missionGuid": {
                                "_text": "cd4cfc53-621a-4dd9-81f8-8f87a3867bf2"
                            },
                            "missionName": {
                                "_text": "Test Attachments"
                            },
                            "timestamp": {
                                "_text": "2026-02-19T22:39:15.446Z"
                            },
                            "type": {
                                "_text": "ADD_CONTENT"
                            }
                        }
                    }
                }
            }
        }
    });

    if (!cot.raw.event.detail) {
        assert.fail('No Detail Section')
    } else {
        assert.deepEqual({
            id: '6e244207-3f63-43a5-8da4-0ff470b23859',
            type: 'Feature',
            path: '/',
            properties: {
                callsign: 'UNKNOWN',
                center: [ 0, 0, 0 ],
                type: 't-x-m-c',
                how: 'h-g-i-g-o',
                time: '2026-02-19T22:39:15Z',
                start: '2026-02-19T22:39:15Z',
                stale: '2026-02-19T22:39:35Z',
                mission: {
                    type: 'CHANGE',
                    tool: 'public',
                    name: 'Test Attachments',
                    guid: 'cd4cfc53-621a-4dd9-81f8-8f87a3867bf2',
                    authorUid: 'nicholas.ingalls@state.co.us',
                    missionChanges: [{
                        contentUid: undefined,
                        creatorUid: 'nicholas.ingalls@state.co.us',
                        isFederatedChange: false,
                        missionName: 'Test Attachments',
                        timestamp: '2026-02-19T22:39:15.446Z',
                        type: 'ADD_CONTENT',
                        contentResource: {
                            expiration: '-1',
                            filename: 'images.jpeg',
                            hash: 'ce8a1eedf818cb3be12646177779820ed1d71c95ac558a70fde07b483979512a',
                            name: 'images.jpeg',
                            size: 9420,
                            submissionTime: '2026-02-19T20:48:29.725Z',
                            submitter: 'nicholas.ingalls@state.co.us',
                            tool: 'public',
                            uid: 'add1e84f-6025-4cf5-a7c3-b9087309216c',
                        },
                    }]
                },
                metadata: {}
            },
            geometry: {
                type: 'Point',
                coordinates: [ 0, 0, 0 ]
            }
        }, await CoTParser.to_geojson(cot));
    }
});

test('Decode MissionChange CoTs - Mission Property Set (TAK Server 5.9+)', async () => {
    const cot = CoTParser.from_xml('<?xml version="1.0" encoding="UTF-8"?><event how="h-g-i-g-o" type="t-x-m-c-p" version="2.0" uid="0954e5d0-01b3-4dd5-998c-42e700b5cf66" start="2026-09-28T04:28:57.129Z" time="2026-09-28T04:28:57.129Z" stale="2026-09-28T04:29:17.129Z"><point ce="9999999" le="9999999" hae="0" lat="0" lon="0"/><detail><mission type="CHANGE" tool="public" name="kv-test" guid="9ba05e1d-970f-49e1-a153-7216fecf5279" authorUid="test-plugin"><MissionChanges><MissionChange><creatorUid>test-plugin</creatorUid><isFederatedChange>false</isFederatedChange><missionGuid>9ba05e1d-970f-49e1-a153-7216fecf5279</missionGuid><missionName>kv-test</missionName><timestamp>2026-09-28T04:28:57.127Z</timestamp><type>ADD_CONTENT</type><content><MissionProperty><key>test.live</key><value>3</value></MissionProperty></content></MissionChange></MissionChanges></mission></detail></event>');

    const feat = await CoTParser.to_geojson(cot);

    assert.equal(feat.properties.type, 't-x-m-c-p');
    assert.deepEqual(feat.properties.mission, {
        type: 'CHANGE',
        tool: 'public',
        name: 'kv-test',
        guid: '9ba05e1d-970f-49e1-a153-7216fecf5279',
        authorUid: 'test-plugin',
        missionChanges: [{
            contentUid: undefined,
            creatorUid: 'test-plugin',
            isFederatedChange: false,
            missionName: 'kv-test',
            timestamp: '2026-09-28T04:28:57.127Z',
            type: 'ADD_CONTENT',
            missionProperty: {
                key: 'test.live',
                value: '3'
            }
        }]
    });
});

test('Decode MissionChange CoTs - Mission Property Removed (TAK Server 5.9+)', async () => {
    const cot = CoTParser.from_xml('<?xml version="1.0" encoding="UTF-8"?><event how="h-g-i-g-o" type="t-x-m-c-p" version="2.0" uid="d347662c-7c67-4333-9398-1f9546ecce35" start="2026-09-28T04:28:57.164Z" time="2026-09-28T04:28:57.164Z" stale="2026-09-28T04:29:17.164Z"><point ce="9999999" le="9999999" hae="0" lat="0" lon="0"/><detail><mission type="CHANGE" tool="public" name="kv-test" guid="9ba05e1d-970f-49e1-a153-7216fecf5279" authorUid="test-plugin"><MissionChanges><MissionChange><creatorUid>test-plugin</creatorUid><isFederatedChange>false</isFederatedChange><missionGuid>9ba05e1d-970f-49e1-a153-7216fecf5279</missionGuid><missionName>kv-test</missionName><timestamp>2026-09-28T04:28:57.163Z</timestamp><type>REMOVE_CONTENT</type><content><MissionProperty><key>test.live</key><value>3</value></MissionProperty></content></MissionChange></MissionChanges></mission></detail></event>');

    const feat = await CoTParser.to_geojson(cot);
    const change = feat.properties.mission?.missionChanges?.[0];

    assert.equal(change?.type, 'REMOVE_CONTENT');
    assert.deepEqual(change?.missionProperty, { key: 'test.live', value: '3' });
});

test('Decode MissionChange CoTs - Mission Property with an empty value', async () => {
    const cot = CoTParser.from_xml('<?xml version="1.0" encoding="UTF-8"?><event how="h-g-i-g-o" type="t-x-m-c-p" version="2.0" uid="a1b2c3d4-0000-0000-0000-000000000000" start="2026-09-28T04:28:57.129Z" time="2026-09-28T04:28:57.129Z" stale="2026-09-28T04:29:17.129Z"><point ce="9999999" le="9999999" hae="0" lat="0" lon="0"/><detail><mission type="CHANGE" tool="public" name="kv-test" guid="9ba05e1d-970f-49e1-a153-7216fecf5279" authorUid="test-plugin"><MissionChanges><MissionChange><creatorUid>test-plugin</creatorUid><isFederatedChange>false</isFederatedChange><missionName>kv-test</missionName><timestamp>2026-09-28T04:28:57.127Z</timestamp><type>ADD_CONTENT</type><content><MissionProperty><key>test.empty</key><value></value></MissionProperty></content></MissionChange></MissionChanges></mission></detail></event>');

    const feat = await CoTParser.to_geojson(cot);

    assert.deepEqual(feat.properties.mission?.missionChanges?.[0].missionProperty, { key: 'test.empty', value: '' });
});
