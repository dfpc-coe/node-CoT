import test from 'tape';
import CoT from '../index.js';

test('Decode MultiMissionAircraft CoTs', (t) => {
    const cot = new CoT(`<event version='2.0' uid='0ed16b9e-a0c8-480f-8860-284b9afb2b1d' type='b-m-p-s-p-loc' time='2023-11-15T20:48:16.097Z' start='2023-11-15T20:48:16.097Z' stale='2024-11-14T20:48:16.097Z' how='h-g-i-g-o' access='Undefined'><point lat='38.2089117' lon='-104.6282182' hae='1455.285' ce='9999999.0' le='9999999.0' /><detail><status readiness='true'/><archive/><__video uid='05bf6c59-c7ea-465f-8337-da16ddcc82d4' url='https://publicstreamer3.cotrip.org/rtplive/123/playlist.m3u8'><ConnectionEntry networkTimeout='12000' uid='05bf6c59-c7ea-465f-8337-da16ddcc82d4' path='' protocol='raw' bufferTime='-1' address='https://publicstreamer3.cotrip.org/rtplive/123/playlist.m3u8' port='-1' roverPort='-1' rtspReliable='0' ignoreEmbeddedKLV='false' alias='I-25 .8 mi S CO-45'/></__video><color argb='-1'/><link uid='ANDROID-94e13cc4880cbcce' production_time='2022-01-31T17:35:49.565Z' type='a-f-G-U-C' parent_callsign='CO-DFPC-54-Schmidt' relation='p-p'/><sensor vfov='45' elevation='0' fovBlue='1.0' fovRed='1.0' strokeWeight='0.0' roll='0' range='100' azimuth='270' rangeLineStrokeWeight='0.0' fov='45' hideFov='true' rangeLineStrokeColor='-3355444' fovGreen='1.0' displayMagneticReference='0' strokeColor='-16777216' rangeLines='100' fovAlpha='0.2980392156862745'/><archive/><contact callsign='I-25 .8 mi S CO-45'/><remarks></remarks><precisionlocation altsrc='DTED2'/></detail></event>`);
    if (!cot.raw.event.detail) {
        t.fail('No Detail Section')
    } else {
        t.ok(cot.raw.event.detail['_flow-tags_']);
        delete cot.raw.event.detail['_flow-tags_'];

        t.deepEquals({
            event: {
                _attributes: {
                    version: '2.0',
                    uid: '0ed16b9e-a0c8-480f-8860-284b9afb2b1d',
                    type: 'b-m-p-s-p-loc',
                    time: '2023-11-15T20:48:16.097Z',
                    start: '2023-11-15T20:48:16.097Z',
                    stale: '2024-11-14T20:48:16.097Z',
                    how: 'h-g-i-g-o',
                    access: 'Undefined'
                },
                point: { _attributes: { lat: '38.2089117', lon: '-104.6282182', hae: '1455.285', ce: '9999999.0', le: '9999999.0' } },
                detail: {
                    status: { _attributes: { readiness: 'true' } },
                    archive: [ {}, {} ],
                    __video: {
                        _attributes: {
                            uid: '05bf6c59-c7ea-465f-8337-da16ddcc82d4',
                            url: 'https://publicstreamer3.cotrip.org/rtplive/123/playlist.m3u8'
                        },
                        ConnectionEntry: {
                            _attributes: {
                                networkTimeout: 12000,
                                uid: '05bf6c59-c7ea-465f-8337-da16ddcc82d4',
                                path: '',
                                protocol: 'raw',
                                bufferTime: -1,
                                address: 'https://publicstreamer3.cotrip.org/rtplive/123/playlist.m3u8',
                                port: -1,
                                roverPort: -1,
                                rtspReliable: 0,
                                ignoreEmbeddedKLV: false,
                                alias: 'I-25 .8 mi S CO-45'
                            }
                        },
                    },
                    color: { _attributes: { argb: '-1' } },
                    link: {
                        _attributes: {
                            uid: 'ANDROID-94e13cc4880cbcce',
                            production_time: '2022-01-31T17:35:49.565Z',
                            type: 'a-f-G-U-C',
                            parent_callsign: 'CO-DFPC-54-Schmidt',
                            relation: 'p-p'
                        },
                    },
                    sensor: {
                        _attributes: {
                            vfov: 45,
                            elevation: 0,
                            fovBlue: 1.0,
                            fovRed: 1.0,
                            strokeWeight: 0.0,
                            roll: 0,
                            range: 100,
                            azimuth: 270,
                            rangeLineStrokeWeight: 0.0,
                            fov: 45,
                            hideFov: true,
                            rangeLineStrokeColor: -3355444,
                            fovGreen: 1.0,
                            displayMagneticReference: 0,
                            strokeColor: -16777216,
                            rangeLines: 100,
                            fovAlpha: 0.2980392156862745
                        }
                    },
                    contact: { _attributes: { callsign: 'I-25 .8 mi S CO-45' } },
                    remarks: {},
                    precisionlocation: { _attributes: { altsrc: 'DTED2' } }
                }
            },
        }, cot.raw);

        t.deepEquals({
            id: '0ed16b9e-a0c8-480f-8860-284b9afb2b1d',
            type: 'Feature',
            properties: {
                callsign: 'I-25 .8 mi S CO-45',
                center: [ -104.6282182, 38.2089117, 1455.285 ],
                type: 'b-m-p-s-p-loc',
                how: 'h-g-i-g-o',
                time: '2023-11-15T20:48:16.097Z',
                start: '2023-11-15T20:48:16.097Z',
                stale: '2024-11-14T20:48:16.097Z',
                sensor: {
                    vfov: 45,
                    elevation: 0,
                    fovBlue: 1.0,
                    fovRed: 1.0,
                    strokeWeight: 0.0,
                    roll: 0,
                    range: 100,
                    azimuth: 270,
                    rangeLineStrokeWeight: 0.0,
                    fov: 45,
                    hideFov: true,
                    rangeLineStrokeColor: -3355444,
                    fovGreen: 1.0,
                    displayMagneticReference: 0,
                    strokeColor: -16777216,
                    rangeLines: 100,
                    fovAlpha: 0.2980392156862745
                },
                video: { uid: '05bf6c59-c7ea-465f-8337-da16ddcc82d4', url: 'https://publicstreamer3.cotrip.org/rtplive/123/playlist.m3u8' },
                archived: true,
                status: { readiness: 'true' },
                precisionlocation: { altsrc: 'DTED2' },
                'marker-color': '#FFFFFF',
                'marker-opacity': 1,
                metadata: {}
            },
            geometry: {
                type: 'Point',
                coordinates: [ -104.6282182, 38.2089117, 1455.285 ]
            }
        }, cot.to_geojson());
    }

    t.end();
});
