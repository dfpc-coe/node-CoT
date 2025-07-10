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
            labels: true,
            creator: { uid: 'ANDROID-764679f74013dfe2', callsign: 'COTAK Admin Ingalls', time: '2025-07-09T22:12:06.038Z', type: 'a-f-G-E-V-C' },
            archived: true,
            precisionlocation: { altsrc: 'DTED0' },
            shape: {
                ellipse: {
                    major: 185753.64687066682,
                    minor: 185753.64687066682,
                    angle: 360
                }
            },
            'marker-color': '#FF7700',
            'marker-opacity': 1,
            metadata: {}
        },
        geometry: {
            type: 'Polygon',
            coordinates:  [ [ [ -111.665116, 41.89885 ], [ -111.68451, 42.117988 ], [ -111.741205, 42.330142 ], [ -111.831091, 42.529316 ], [ -111.948333, 42.711175 ], [ -112.08647, 42.873258 ], [ -112.239341, 43.014787 ], [ -112.401688, 43.136245 ], [ -112.569401, 43.238908 ], [ -112.739508, 43.324439 ], [ -112.910033, 43.394596 ], [ -113.079797, 43.451037 ], [ -113.24822, 43.495221 ], [ -113.415155, 43.52835 ], [ -113.580755, 43.551357 ], [ -113.745367, 43.564899 ], [ -113.909459, 43.56937 ], [ -114.07355, 43.564899 ], [ -114.238163, 43.551357 ], [ -114.403762, 43.52835 ] , [ -114.570697, 43.495221 ], [ -114.73912, 43.451037 ], [ -114.908884, 43.394596 ], [ -115.079409, 43.324439 ], [ -115.249516, 43.238908 ], [ -115.417229, 43.136245 ], [ -115.579576, 43.014787 ], [ -115.732448, 42.873258 ], [ -115.870584, 42.711175 ], [ -115.987827, 42.529316 ], [ -116.077712, 42.330142 ], [ -116.134407, 42.117988 ], [ -116.153801, 41.89885 ], [ -116.134407, 41.679712 ], [ -116.077712, 41.467557 ], [ -115.987827, 41.268384 ], [ -115.870584, 41.086525 ], [ -115.732448, 40.924442 ], [ -115.579576, 40.782913 ], [ -115.417229, 40.661455 ], [ -115.249516, 40.558792 ], [ -115.079409, 40.473261 ], [ -114.908884, 40.403104 ], [ -114.73912, 40.346663 ], [ -114.570697, 40.302479 ], [ -114.403762, 40.26935 ], [ -114.238163, 40.246343 ], [ -114.07355, 40.2328 ], [ -113.909459, 40.22833 ], [ -113.745367, 40.2328 ], [ -113.580755, 40.246343 ], [ -113.415155, 40.26935 ], [ -113.24822, 40.302479 ], [ -113.079797, 40.346663 ], [ -112.910033, 40.403104 ], [ -112.739508, 40.473261 ], [ -112.569401, 40.558792 ], [ -112.401688, 40.661455 ], [ -112.239341, 40.782913 ], [ -112.08647, 40.924442 ], [ -111.948333, 41.086525 ], [ -111.831091, 41.268384 ], [ -111.741205, 41.467557 ], [ -111.68451, 41.679712 ], [ -111.665116, 41.89885 ] ] ]
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
                strokeColor: { "_attributes": { "value": -2130706688 } },
                strokeWeight: { "_attributes": { "value": 3 } },
                labels_on: { "_attributes": { "value": true } },
                tog: { "_attributes": { "enabled": "0" } },
                strokeStyle: { "_attributes": { "value": "solid" } },
                shape: { "ellipse": { "_attributes": { "major": 185753.64687066682, "minor": 185753.64687066682, "angle": 360 } } },
                remarks: { _attributes: {}, _text: '' },
                color: { _attributes: { argb: -35072, value: -35072 } },
            }
        });
    }

    t.end();
});
