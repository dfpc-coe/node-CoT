import assert from 'node:assert/strict';
import test from 'node:test';
import CoT, { CoTParser } from '../index.js';

test('En-decode polyline', async () => {
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

    const cot2 = await CoTParser.from_proto(await CoTParser.to_proto(cot))
    const vertex = cot2.raw.event.detail?.shape?.polyline?.vertex
    assert.ok(Array.isArray(vertex) && vertex.length === 5)
});

test('En-decode 0-length polyline', async () => {
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
    const cot4 = await CoTParser.from_proto(await CoTParser.to_proto(cot3))
    assert.ok(cot4.raw.event.detail?.shape?.polyline)
});

test('Basic Circle', async () => {
    const cot = await CoTParser.from_xml(`
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

    const feat = await CoTParser.to_geojson(cot);
    delete feat.properties.flow;

    assert.deepEqual(feat, {
        id: '96bba41c-e6fd-44d5-be90-8d816c6b873b',
        type: 'Feature',
        properties: {
            callsign: 'R&B Circle 1',
            center: [ -113.9094586, 41.8988499, 2040.381 ],
            type: 'u-r-b-c-c',
            how: 'h-e',
            time: '2025-07-10T16:49:54Z',
            start: '2025-07-10T16:49:43Z',
            stale: '2025-07-11T16:49:43Z',
            creator: {
                uid: 'ANDROID-764679f74013dfe2',
                callsign: 'COTAK Admin Ingalls',
                time: '2025-07-09T22:12:06.038Z',
                type: 'a-f-G-E-V-C'
            },
            labels: true,
            archived: true,
            precisionlocation: { altsrc: 'DTED0' },
            stroke: '#FF7700',
            'stroke-opacity': 1,
            'stroke-width': 3,
            'stroke-style': 'solid',
            'marker-color': '#FF7700',
            'marker-opacity': 1,
            'fill-opacity': 0,
            fill: '#FF7700',
            shape: { ellipse: { major: 185753.64687066682, minor: 185753.64687066682, angle: 360 } },
            metadata: {}
        },
        geometry: {
            type: 'Polygon',
            coordinates: [
                [
                    [ -116.15329, 41.877005, 2040.381 ],
                    [ -116.148232, 42.040876, 2040.381 ],
                    [ -116.121499, 42.203586, 2040.381 ],
                    [ -116.073183, 42.363555, 2040.381 ],
                    [ -116.003595, 42.519217, 2040.381 ],
                    [ -115.913263, 42.669036, 2040.381 ],
                    [ -115.802937, 42.811522, 2040.381 ],
                    [ -115.673587, 42.94525, 2040.381 ],
                    [ -115.526395, 43.06887, 2040.381 ],
                    [ -115.362749, 43.181129, 2040.381 ],
                    [ -115.184231, 43.28088, 2040.381 ],
                    [ -114.992604, 43.367099, 2040.381 ],
                    [ -114.789789, 43.438897, 2040.381 ],
                    [ -114.577848, 43.49553, 2040.381 ],
                    [ -114.358959, 43.536409, 2040.381 ],
                    [ -114.135387, 43.561108, 2040.381 ],
                    [ -113.909459, 43.56937, 2040.381 ],
                    [ -113.68353, 43.561108, 2040.381 ],
                    [ -113.459958, 43.536409, 2040.381 ],
                    [ -113.241069, 43.49553, 2040.381 ],
                    [ -113.029128, 43.438897, 2040.381 ],
                    [ -112.826313, 43.367099, 2040.381 ],
                    [ -112.634686, 43.28088, 2040.381 ],
                    [ -112.456169, 43.181129, 2040.381 ],
                    [ -112.292523, 43.06887, 2040.381 ],
                    [ -112.14533, 42.94525, 2040.381 ],
                    [ -112.01598, 42.811522, 2040.381 ],
                    [ -111.905655, 42.669036, 2040.381 ],
                    [ -111.815322, 42.519217, 2040.381 ],
                    [ -111.745734, 42.363555, 2040.381 ],
                    [ -111.697418, 42.203586, 2040.381 ],
                    [ -111.670685, 42.040876, 2040.381 ],
                    [ -111.665627, 41.877005, 2040.381 ],
                    [ -111.682128, 41.713554, 2040.381 ],
                    [ -111.719866, 41.552085, 2040.381 ],
                    [ -111.778326, 41.394132, 2040.381 ],
                    [ -111.85681, 41.241184, 2040.381 ],
                    [ -111.954447, 41.094672, 2040.381 ],
                    [ -112.070206, 40.95596, 2040.381 ],
                    [ -112.202908, 40.826329, 2040.381 ],
                    [ -112.351241, 40.706969, 2040.381 ],
                    [ -112.513771, 40.598972, 2040.381 ],
                    [ -112.688958, 40.503321, 2040.381 ],
                    [ -112.875166, 40.420881, 2040.381 ],
                    [ -113.070681, 40.352397, 2040.381 ],
                    [ -113.273721, 40.298484, 2040.381 ],
                    [ -113.482452, 40.259626, 2040.381 ],
                    [ -113.694998, 40.236171, 2040.381 ],
                    [ -113.909459, 40.22833, 2040.381 ],
                    [ -114.123919, 40.236171, 2040.381 ],
                    [ -114.336466, 40.259626, 2040.381 ],
                    [ -114.545196, 40.298484, 2040.381 ],
                    [ -114.748236, 40.352397, 2040.381 ],
                    [ -114.943751, 40.420881, 2040.381 ],
                    [ -115.129959, 40.503321, 2040.381 ],
                    [ -115.305146, 40.598972, 2040.381 ],
                    [ -115.467676, 40.706969, 2040.381 ],
                    [ -115.616009, 40.826329, 2040.381 ],
                    [ -115.748711, 40.95596, 2040.381 ],
                    [ -115.86447, 41.094672, 2040.381 ],
                    [ -115.962107, 41.241184, 2040.381 ],
                    [ -116.040591, 41.394132, 2040.381 ],
                    [ -116.099051, 41.552085, 2040.381 ],
                    [ -116.136789, 41.713554, 2040.381 ],
                    [ -116.15329, 41.877005, 2040.381 ]
                ]
            ]
        },
        path: '/'
    });

    const parsedCoT = await CoTParser.from_geojson(feat);

    if (!parsedCoT.raw.event.detail) {
        assert.fail('No Detail Section')
    } else {
        assert.ok(parsedCoT.raw.event.detail['_flow-tags_']);
        delete parsedCoT.raw.event.detail['_flow-tags_'];

        assert.deepEqual(parsedCoT.raw.event, {
            _attributes: { version: '2.0', uid: '96bba41c-e6fd-44d5-be90-8d816c6b873b', type: 'u-r-b-c-c', how: 'h-e', time: '2025-07-10T16:49:54.000Z', start: '2025-07-10T16:49:43.000Z', stale: '2025-07-11T16:49:43Z' },
            point: { _attributes: { lat: 41.8988499, lon: -113.9094586, hae: 2040.381, ce: 9999999, le: 9999999 } },
            detail: {
                contact: { _attributes: { callsign: 'R&B Circle 1' } },
                archive: { _attributes: {} },
                creator: { _attributes: { uid: 'ANDROID-764679f74013dfe2', callsign: 'COTAK Admin Ingalls', time: '2025-07-09T22:12:06.038Z', type: 'a-f-G-E-V-C' } },
                precisionlocation: { _attributes: { altsrc: 'DTED0' } },
                strokeColor: { "_attributes": { "value": -35072 } },
                strokeWeight: { "_attributes": { "value": 3 } },
                labels_on: { "_attributes": { "value": true } },
                tog: { "_attributes": { "enabled": "0" } },
                strokeStyle: { "_attributes": { "value": "solid" } },
                fillColor: { "_attributes": { "value": 16742144 } },
                shape: {
                    ellipse: { "_attributes": { "major": 185753.64687066682, "minor": 185753.64687066682, "angle": 360 } },
                    link: {
                        _attributes: {
                            uid: "96bba41c-e6fd-44d5-be90-8d816c6b873b.Style",
                            type:"b-x-KmlStyle",
                            relation:"p-c"
                        },
                        Style:{
                            LineStyle: {
                                color: { _text: "FFFF7700" },
                                width: { _text: 3 }
                            },
                            PolyStyle: {
                                color: { _text: "00FF7700" }
                            }
                        }
                    }
                },
                remarks: { _attributes: {}, _text: '' },
                color: { _attributes: { argb: -35072, value: -35072 } },
            }
        });
    }
});

test('Parse u-d-c-e (Ellipse)', async () => {
    const cot = CoTParser.from_xml(`
        <?xml version='1.0' encoding='UTF-8' standalone='yes'?>
        <event version='2.0' uid='b76cb411-a36d-4308-be55-506729eace92' type='u-d-c-e' time='2026-04-14T19:02:19.212Z' start='2026-04-14T19:02:19.212Z' stale='2026-04-15T19:02:19.212Z' how='h-e' access='Undefined'>
            <point lat='39.9127697' lon='-102.7876738' hae='1287.178' ce='9999999.0' le='9999999.0' />
            <detail>
                <shape>
                    <ellipse major='1659.789905685972' minor='1350.724238139261' swapAxis='true' angle='118.71278427072082'/>
                    <link uid='b76cb411-a36d-4308-be55-506729eace92.Style' type='b-x-KmlStyle' relation='p-c'>
                        <Style>
                            <LineStyle>
                                <color>ffffffff</color>
                                <width>4.0</width>
                            </LineStyle>
                            <PolyStyle>
                                <color>96ffffff</color>
                            </PolyStyle>
                        </Style>
                    </link>
                </shape>
                <__shapeExtras cpvis='true' editable='true'/>
                <precisionlocation altsrc='DTED2'/>
                <creator uid='ANDROID-764679f74013dfe2' callsign='COTAK Admin Ingalls' time='2026-04-14T18:51:00.613Z' type='a-f-G-E-V-C'/>
                <labels_on value='false'/>
                <contact callsign='Ellipse 1'/>
                <strokeColor value='-1'/>
                <strokeWeight value='4.0'/>
                <strokeStyle value='solid'/>
                <fillColor value='-1761607681'/>
                <archive/>
                <remarks></remarks>
            </detail>
        </event>
    `);

    const feat = await CoTParser.to_geojson(cot);

    assert.equal(feat.properties.callsign, 'Ellipse 1');
    assert.deepEqual(feat.properties.center, [ -102.7876738, 39.9127697, 1287.178 ]);
    assert.deepEqual(feat.properties.shape, {
        ellipse: {
            major: 1659.789905685972,
            minor: 1350.724238139261,
            angle: 118.71278427072082,
            swapAxis: true
        }
    });

    if (feat.geometry.type !== 'Polygon') {
        assert.fail(`Expected Polygon geometry, received ${feat.geometry.type}`);
    }

    assert.ok(feat.geometry.coordinates[0].length > 20);
    assert.notDeepEqual(feat.geometry.coordinates[0][0].slice(0, 2), feat.properties.center.slice(0, 2));

    const parsedCoT = await CoTParser.from_geojson(feat);

    assert.equal(parsedCoT.raw.event._attributes.type, 'u-d-c-e');

    if (!parsedCoT.raw.event.detail?.shape?.ellipse?._attributes) {
        assert.fail('Expected ellipse metadata in round-tripped CoT detail.shape');
    }

    assert.deepEqual(parsedCoT.raw.event.detail.shape.ellipse._attributes, {
        major: 1659.789905685972,
        minor: 1350.724238139261,
        angle: 118.71278427072082,
        swapAxis: true
    });
});
