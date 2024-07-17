import test from 'tape';
import CoT from '../index.js';

test('Decode MultiMissionAircraft CoTs', (t) => {
    const cot = new CoT({"event":{"_attributes":{"how":"h-g-i-g-o","type":"t-x-m-c","version":"2.0","uid":"f205227b-2e23-40bf-8948-711566116365","start":"2024-07-17T18:49:03Z","time":"2024-07-17T18:49:03Z","stale":"2024-07-17T18:49:23Z"},"point":{"_attributes":{"ce":"9999999","le":"9999999","hae":"0","lat":"0","lon":"0"}},"detail":{"mission":{"_attributes":{"type":"CHANGE","tool":"public","name":"2024-07-17 - Lost Hiker","guid":"4ce8e41d-21e4-4471-a303-09d12bb93bcf","authorUid":"CN=mesasar-machine-user@ingalls.ca,OU=WILDFIRE,O=CO-TAK"},"MissionChanges":{"MissionChange":{"contentUid":{"_text":"8fb7b41f-77c5-4537-9a4c-5b7a76a71cb9"},"creatorUid":{"_text":"CN=mesasar-machine-user@ingalls.ca,OU=WILDFIRE,O=CO-TAK"},"isFederatedChange":{"_text":"false"},"missionName":{"_text":"2024-07-17 - Lost Hiker"},"timestamp":{"_text":"2024-07-17T18:49:03.606Z"},"type":{"_text":"ADD_CONTENT"},"details":{"_attributes":{"type":"u-d-p","callsign":"Third Test","color":"-65536"},"location":{"_attributes":{"lat":"39.118611111111115","lon":"-108.31361111111111"}}}}}}}}});

    if (!cot.raw.event.detail) {
        t.fail('No Detail Section')
    } else {
        t.ok(cot.raw.event.detail['_flow-tags_']);
        delete cot.raw.event.detail['_flow-tags_'];

        t.deepEquals({
            id: 'f205227b-2e23-40bf-8948-711566116365',
            type: 'Feature',
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
                        isFederatedChange: 'false',
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
        }, cot.to_geojson());
    }

    t.end();
});
