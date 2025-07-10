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

    const cot2 = CoTParser.from_proto(CoTParser.to_proto(cot))
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
    const cot4 = CoTParser.from_proto(CoTParser.to_proto(cot3))
    t.ok(cot4.raw.event.detail?.shape?.polyline)

    t.end();
});

test('Basic Circle', (t) => {
    const cot = CoTParser.from_xml(`
       <event version="2.0" uid="96bba41c-e6fd-44d5-be90-8d816c6b873b" type="u-r-b-c-c" how="h-e" time="2025-07-10T16:49:54Z" start="2025-07-10T16:49:43Z" stale="2025-07-11T16:49:43Z" access="Undefined">
            <point lat="41.8988499" lon="-113.9094586" hae="2040.381" ce="9999999.0" le="9999999.0"/>
            <detail>
                <contact callsign="R&amp;B Circle 1"/>
                <shape>
                    <ellipse major="185753.64687066682" minor="185753.64687066682" angle="360"/>
                    <link uid="96bba41c-e6fd-44d5-be90-8d816c6b873b.Style" type="b-x-KmlStyle" relation="p-c">
                        <Style>
                            <LineStyle>
                                <color>ffff7700</color>
                                <width>3.0</width>
                            </LineStyle>
                            <PolyStyle>
                                <color>00ff7700</color>
                            </PolyStyle>
                        </Style>
                    </link>
                </shape>
                <__shapeExtras cpvis="true" editable="true"/>
                <strokeColor value="-35072"/>
                <strokeWeight value="3.0"/>
                <strokeStyle value="solid"/>
                <fillColor value="16742144"/>
                <labels_on value="true"/>
                <remarks/>
                <archive/>
                <creator uid="ANDROID-764679f74013dfe2" callsign="COTAK Admin Ingalls" time="2025-07-09T22:12:06.038Z" type="a-f-G-E-V-C"/>
                <color value="-35072"/>
                <precisionlocation altsrc="DTED0"/>
                <color argb="-35072"/>
                <_flow-tags_ TAK-Server-e87a0e02420b44a08f6032bcf1877745="2025-07-10T16:49:54Z"/>
            </detail>
        </event>
    `);

    const feat = CoTParser.to_geojson(cot);
    delete feat.properties.flow;

    t.deepEqual(feat, {
        id: '96bba41c-e6fd-44d5-be90-8d816c6b873b',
        path: '/',
        type: 'Feature',
        properties: {
            callsign: 'R&B Circle 1',
            center: [ -113.9094586, 41.8988499, 2040.381 ],
            type: 'u-r-b-c-c',
            how: 'h-e',
            time: '2025-07-10T16:49:54Z',
            start: '2025-07-10T16:49:43Z',
            stale: '2025-07-11T16:49:43Z',
            creator: { uid: 'ANDROID-764679f74013dfe2', callsign: 'COTAK Admin Ingalls', time: '2025-07-09T22:12:06.038Z', type: 'a-f-G-E-V-C' },
            archived: true,
            precisionlocation: { altsrc: 'DTED0' },
            'marker-color': '#FF7700',
            'marker-opacity': 1,
            metadata: {}
        },
        geometry: {
            type: 'Point',
            coordinates: [ -113.9094586, 41.8988499, 2040.381 ]
        },
    });

    const parsedCoT = CoTParser.from_geojson(feat);

    if (!parsedCoT.raw.event.detail) {
        t.fail('No Detail Section')
    } else {
        t.ok(parsedCoT.raw.event.detail['_flow-tags_']);
        delete parsedCoT.raw.event.detail['_flow-tags_'];

        t.deepEqual(parsedCoT.raw.event, {
            _attributes: { version: '2.0', uid: '96bba41c-e6fd-44d5-be90-8d816c6b873b', type: 'u-r-b-c-c', how: 'h-e', time: '2025-07-10T16:49:54.000Z', start: '2025-07-10T16:49:43.000Z', stale: '2025-07-11T16:49:43Z' },
            point: { _attributes: { lat: 41.8988499, lon: -113.9094586, hae: 2040.381, ce: 9999999, le: 9999999 } },
            detail: {
                contact: { _attributes: { callsign: 'R&B Circle 1' } },
                archive: { _attributes: {} },
                creator: { _attributes: { uid: 'ANDROID-764679f74013dfe2', callsign: 'COTAK Admin Ingalls', time: '2025-07-09T22:12:06.038Z', type: 'a-f-G-E-V-C' } },
                precisionlocation: { _attributes: { altsrc: 'DTED0' } },
                remarks: { _attributes: {}, _text: '' },
                color: { _attributes: { argb: -35072 } },
            }
        });
    }

    t.end();
});
