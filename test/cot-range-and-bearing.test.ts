import test from 'tape';
import CoT, { CoTParser } from '../index.js';

test('Decode Range & Bearing', (t) => {
    const cot = new CoT({
        "event": {
            "_attributes": {
                "version": "2.0",
                "uid": "ebbf42a7-ea71-43a1-baf6-e259c3d115bf",
                "type": "u-rb-a",
                "how": "h-e",
                "time": "2024-08-30T22:28:02Z",
                "start": "2024-08-30T22:28:02Z",
                "stale": "2024-08-31T22:28:02Z",
                "access": "Undefined"
            },
            "point": {
                "_attributes": {
                    "lat": 39.0981196,
                    "lon": -108.7395013,
                    "hae": 0.0,
                    "ce": 9999999.0,
                    "le": 9999999.0
                }
            },
            "detail": {
                "contact": {
                    "_attributes": {
                        "callsign": "R&B 1"
                    }
                },
                "range": {
                    "_attributes": {
                        "value": 14806.869682096987
                    }
                },
                "bearing": { "_attributes": { "value": 102.28151464168589 } },
                "inclination": { "_attributes": { "value": 5.373568186490131 } },
                "rangeUnits": { "_attributes": { "value": 0 } },
                "bearingUnits": { "_attributes": { "value": 0 } },
                "northRef": { "_attributes": { "value": 1 } },
                "strokeColor": { "_attributes": { "value": -65536 } },
                "strokeWeight": { "_attributes": { "value": 3.0 } },
                "strokeStyle": { "_attributes": { "value": "solid" } },
                "remarks": {},
                "labels_on": { "_attributes": { "value": false } },
                "archive": {},
                "link": {
                    "_attributes": {
                        "uid": "ANDROID-0ca41830e11d2ef3",
                        "production_time": "2024-08-30T22:26:28.264Z",
                        "type": "a-f-G-E-V-C",
                        "parent_callsign": "DFPC Ingalls Tab",
                        "relation": "p-p"
                    }
                },
                "color": {
                    "_attributes": {
                        "value": -65536
                    }
                },
                "_flow-tags_": {
                    "_attributes": {
                        "TAK-Server-e87a0e02420b44a08f6032bcf1877745": "2024-08-30T22:28:02Z"
                    }
                }
            }
        }
    })

    if (!cot.raw.event.detail) {
        t.fail('No Detail Section')
    } else {
        t.ok(cot.raw.event.detail['_flow-tags_']);
        delete cot.raw.event.detail['_flow-tags_'];

        t.deepEquals(CoTParser.to_geojson(cot), {
            id: 'ebbf42a7-ea71-43a1-baf6-e259c3d115bf',
            type: 'Feature',
            path: '/',
            properties: {
                archived: true,
                callsign: 'R&B 1',
                center: [ -108.7395013, 39.0981196, 0 ],
                type: 'u-rb-a',
                how: 'h-e',
                labels: false,
                time: '2024-08-30T22:28:02Z',
                start: '2024-08-30T22:28:02Z',
                stale: '2024-08-31T22:28:02Z',
                range: 14806.869682096987,
                bearing: 102.28151464168589,
                stroke: "#FF0000",
                'stroke-opacity': 1,
                'stroke-style': "solid",
                'stroke-width': 3,
                metadata: {}
            },
            geometry: {
                type: 'LineString',
                coordinates: [ [ -108.7395013, 39.0981196 ], [  -108.5719110069878, 39.06967421349145 ]]
            }
        });
    }

    t.end();
});
