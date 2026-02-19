import test from 'tape';
import CoT, { CoTParser } from '../index.js';

test('Decode MissionChange CoTs', async (t) => {
    const cot = new CoT({"event":{"_attributes":{"how":"h-g-i-g-o","type":"t-x-m-c","version":"2.0","uid":"f205227b-2e23-40bf-8948-711566116365","start":"2024-07-17T18:49:03Z","time":"2024-07-17T18:49:03Z","stale":"2024-07-17T18:49:23Z"},"point":{"_attributes":{"ce":9999999,"le":9999999,"hae":0,"lat":0,"lon":0}},"detail":{"mission":{"_attributes":{"type":"CHANGE","tool":"public","name":"2024-07-17 - Lost Hiker","guid":"4ce8e41d-21e4-4471-a303-09d12bb93bcf","authorUid":"CN=mesasar-machine-user@ingalls.ca,OU=WILDFIRE,O=CO-TAK"},"MissionChanges": {"MissionChange":{"contentUid":{"_text":"layer-11-27529-1"},"creatorUid":{"_text":"CN=mma-etl-user@cotak.gov,OU=WILDFIRE,O=CO-TAK"},"isFederatedChange":{"_text":false},"missionName":{"_text":"Colorado NIFS Fire Perimeters"},"timestamp":{"_text":"2024-08-16T15:21:55.361Z"},"type":{"_text":"ADD_CONTENT"},"details":{"_attributes":{"type":"t-x-d-d"}}}}}}}});

    if (!cot.raw.event.detail) {
        t.fail('No Detail Section')
    } else {
        t.deepEquals({
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

    t.end();
});

test('Decode MissionChange CoTs - #2', async (t) => {
    const cot = new CoT({"event":{"_attributes":{"how":"h-g-i-g-o","type":"t-x-m-c","version":"2.0","uid":"f205227b-2e23-40bf-8948-711566116365","start":"2024-07-17T18:49:03Z","time":"2024-07-17T18:49:03Z","stale":"2024-07-17T18:49:23Z"},"point":{"_attributes":{"ce":9999999,"le":9999999,"hae":0,"lat":0,"lon":0}},"detail":{"mission":{"_attributes":{"type":"CHANGE","tool":"public","name":"2024-07-17 - Lost Hiker","guid":"4ce8e41d-21e4-4471-a303-09d12bb93bcf","authorUid":"CN=mesasar-machine-user@ingalls.ca,OU=WILDFIRE,O=CO-TAK"},"MissionChanges":{"MissionChange":{"contentUid":{"_text":"8fb7b41f-77c5-4537-9a4c-5b7a76a71cb9"},"creatorUid":{"_text":"CN=mesasar-machine-user@ingalls.ca,OU=WILDFIRE,O=CO-TAK"},"isFederatedChange":{"_text":false},"missionName":{"_text":"2024-07-17 - Lost Hiker"},"timestamp":{"_text":"2024-07-17T18:49:03.606Z"},"type":{"_text":"ADD_CONTENT"},"details":{"_attributes":{"type":"u-d-p","callsign":"Third Test","color":"-65536"},"location":{"_attributes":{"lat":"39.118611111111115","lon":"-108.31361111111111"}}}}}}}}});

    if (!cot.raw.event.detail) {
        t.fail('No Detail Section')
    } else {
        t.deepEquals({
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

    t.end();
});

test('Decode MissionChange Logs', async (t) => {
    const cot = new CoT({"event":{"_attributes":{"how":"h-g-i-g-o","type":"t-x-m-c-l","version":"2.0","uid":"e77c55da-c5d2-4200-bbc9-9967b3f30b5b","start":"2024-10-14T15:33:04Z","time":"2024-10-14T15:33:04Z","stale":"2024-10-14T15:33:24Z"},"point":{"_attributes":{"ce":9999999,"le":9999999,"hae":0,"lat":0,"lon":0}},"detail":{"mission":{"_attributes":{"type":"CHANGE","tool":"public","name":"manual test","guid":"ae2e9ec4-2762-4664-8660-1ef824bde9bc","authorUid":"ANDROID-0ca41830e11d2ef3"}}}}});

    if (!cot.raw.event.detail) {
        t.fail('No Detail Section')
    } else {
        t.deepEquals({
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

    t.end();
});

test('Decode MissionChange ContentResource', async (t) => {
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
        t.fail('No Detail Section')
    } else {
        t.deepEquals({
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

    t.end();
});
