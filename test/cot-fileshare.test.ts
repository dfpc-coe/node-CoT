import test from 'tape';
import CoT from '../index.js';

test('Decode MultiMissionAircraft CoTs', (t) => {
    const cot = new CoT({"event":{"_attributes":{"version":"2.0","uid":"d60e38c2-6c51-4f69-bff9-c5cbc6b44a76","type":"b-f-t-r","how":"h-e","time":"2024-07-02T17:13:20Z","start":"2024-07-02T17:13:19Z","stale":"2024-07-02T17:13:29Z"},"point":{"_attributes":{"lat":"39.07853","lon":"-108.537397","hae":"1400.49561947","ce":"9.9350462","le":"NaN"}},"detail":{"fileshare":{"_attributes":{"filename":"20240615_144641.jpg.zip","senderUrl":"https://18.254.242.65:8443/Marti/sync/content?hash=c18e00d123057a8e33107e91ab02f999ecc6f849aed2a41b84e237ff36106a4e","sizeInBytes":"4233884","sha256":"c18e00d123057a8e33107e91ab02f999ecc6f849aed2a41b84e237ff36106a4e","senderUid":"ANDROID-0ca41830e11d2ef3","senderCallsign":"DFPC Ingalls","name":"20240615_144641.jpg"}},"ackrequest":{"_attributes":{"uid":"814d0d4a-3339-4fd2-8e09-0556444112f3","ackrequested":"true","tag":"20240615_144641.jpg"}},"_flow-tags_":{"_attributes":{"TAK-Server-e87a0e02420b44a08f6032bcf1877745":"2024-07-02T17:13:20Z"}}}}});

    if (!cot.raw.event.detail) {
        t.fail('No Detail Section')
    } else {
        t.ok(cot.raw.event.detail['_flow-tags_']);
        delete cot.raw.event.detail['_flow-tags_'];

        t.deepEquals({
            "event":{
                "_attributes":{
                    "version":"2.0",
                    "uid":"d60e38c2-6c51-4f69-bff9-c5cbc6b44a76",
                    "time":"2024-07-02T17:13:20Z",
                    "start":"2024-07-02T17:13:19Z",
                    "stale":"2024-07-02T17:13:29Z",
                    "type":"b-f-t-r",
                    "how":"h-e"
                },
                "point":{
                    "_attributes":{
                        "lat":"39.07853",
                        "lon":"-108.537397",
                        "hae":"1400.49561947",
                        "ce":"9.9350462",
                        "le":"NaN"
                    }
                },
                "detail":{
                    ackrequest: {                                                                                                                                                
                        "_attributes": {                                                                                                                                           
                            "uid": "814d0d4a-3339-4fd2-8e09-0556444112f3",                     
                            "ackrequested": "true",                                                                                                                                  
                            "tag": "20240615_144641.jpg"                                                                                                                             
                        }                                                                    
                    },
                    fileshare: {                                                                                                                                                 
                        "_attributes": {                                                                                                                                           
                            "filename": "20240615_144641.jpg.zip",                             
                            "senderUrl": "https://18.254.242.65:8443/Marti/sync/content?hash=c18e00d123057a8e33107e91ab02f999ecc6f849aed2a41b84e237ff36106a4e",                      
                            "sizeInBytes": "4233884",                                                                                                                                
                            "sha256": "c18e00d123057a8e33107e91ab02f999ecc6f849aed2a41b84e237ff36106a4e",                                                                            
                            "senderUid": "ANDROID-0ca41830e11d2ef3",                           
                            "senderCallsign": "DFPC Ingalls",                                                                                                                        
                            "name": "20240615_144641.jpg"                                                                                                                            
                        }                                                                    
                    }
                }
            }
        }, cot.raw);

        t.deepEquals({
            id: 'd60e38c2-6c51-4f69-bff9-c5cbc6b44a76',
            type: 'Feature',
            properties: {
                callsign: 'UNKNOWN',
                type: 'b-f-t-r',
                how: 'h-e',
                center: [-108.537397, 39.07853, 1400.49561947],
                time: '2024-07-02T17:13:20Z',
                start: '2024-07-02T17:13:19Z',
                stale: '2024-07-02T17:13:29Z',
                ackrequest: {                                                                                                                                                
                    "uid": "814d0d4a-3339-4fd2-8e09-0556444112f3",                     
                    "ackrequested": "true",                                                                                                                                  
                    "tag": "20240615_144641.jpg"                                                                                                                             
                },
                fileshare: {
                    "filename": "20240615_144641.jpg.zip",
                    "senderUrl": "https://18.254.242.65:8443/Marti/sync/content?hash=c18e00d123057a8e33107e91ab02f999ecc6f849aed2a41b84e237ff36106a4e",
                    "sizeInBytes": 4233884,
                    "sha256": "c18e00d123057a8e33107e91ab02f999ecc6f849aed2a41b84e237ff36106a4e",
                    "senderUid": "ANDROID-0ca41830e11d2ef3",
                    "senderCallsign": "DFPC Ingalls",
                    "name": "20240615_144641.jpg"
                },
                metadata: {},
            },
            geometry: {
                type: 'Point',
                coordinates: [-108.537397, 39.07853, 1400.49561947]
            }
        }, cot.to_geojson());
    }

    t.end();
});
