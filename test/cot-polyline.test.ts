import test from 'tape';
import CoT, { CoTParser } from '../index.js';

test('En-decode polyline', (t) => {
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
                    "lat": "39.0981196",
                    "lon": "-108.7395013",
                    "hae": "0.0",
                    "ce": "9999999.0",
                    "le": "9999999.0"
                }
            },
            "detail": {
                "contact": {
                    "_attributes": {
                        "callsign": "c"
                    }
                },
                "shape": {
                    "polyline": {
                      "vertex": [
                        { "_attributes": { "lat": 47.7047674, "lon": -122.17861 } },
                        {
                          "_attributes": { "lat": 47.71376061012636, "lon": -122.17861 }
                        },
                        {
                          "_attributes": { "lat": 47.7047674, "lon": -122.16524615319642 }
                        },
                        {
                          "_attributes": { "lat": 47.695774189873646, "lon": -122.17861 }
                        },
                        { "_attributes": { "lat": 47.7047674, "lon": -122.17861 } }
                      ],
                      "_attributes": { "closed": true }
                    }
                }
           }
        }
    })

    const cot2 = CoTParser.from_proto(cot.to_proto())
    const vertex = cot2.raw.event.detail?.shape?.polyline?.vertex
    t.ok(Array.isArray(vertex) && vertex.length === 5)

    t.end();
});

test('En-decode 0-length polyline', (t) => {
    const cot3 = new CoT({
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
                    "lat": "39.0981196",
                    "lon": "-108.7395013",
                    "hae": "0.0",
                    "ce": "9999999.0",
                    "le": "9999999.0"
                }
            },
            "detail": {
                "contact": {
                    "_attributes": {
                        "callsign": "c"
                    }
                },
                "shape": {
                    "polyline": {
                      "vertex": [],
                    }
                }
           }
        }
    })

    // xml en-decoding looses empty array, but should work. 
    const cot4 = CoTParser.from_proto(cot3.to_proto())
    t.ok(cot4.raw.event.detail?.shape?.polyline)

    t.end();
});
