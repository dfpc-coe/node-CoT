import assert from 'node:assert/strict';
import test from 'node:test';
import { CoTParser } from '../index.js';

test('Sensor2Polygon', async () => {
    const cot = await CoTParser.from_geojson({
        "id": "298DG19001V0GN",
        "path": "/",
        "type": "Feature",
        "properties": {
            "callsign": "UAS-CO-DFPC-Schmidt",
            "center": [
                -108.04641043504375,
                39.45429166060765,
                1748.037
            ],
            "type": "a-f-A-M-H-Q",
            "how": "m-g",
            "time": "2024-11-21T16:07:08Z",
            "start": "2024-11-21T16:07:07Z",
            "stale": "2024-11-21T16:07:11Z",
            "sensor": {
                "elevation": 18.5,
                "vfov": 41.6,
                "north": 187.9000000954,
                "roll": 0,
                "range": 100,
                "azimuth": 7,
                "model": "Mavic 2 Enterprise Dual-Visual",
                "fov": 66.9,
                "type": "r-e",
                "version": "0.6"
            },
            "video": {
                "sensor": "UAS-CO-DFPC-Schmidt",
                "spi": "UAS-CO-DFPC-Schmidt.SPI1",
                "url": "rtsp://video.cotak.gov:8554/771c9e10-2ecb-4770-b6f2-b9669914d07e?tcp"
            },
            "course": 7.9,
            "slope": 0,
            "speed": 0,
            "flow": {
                "TAK-Server-e87a0e02420b44a08f6032bcf1877745": "2024-11-21T16:07:08Z"
            },
            "metadata": {},
            "remarks": "None",
            "icon": "a-f-A-M-H-Q"
        },
        "geometry": {
            "type": "Point",
            "coordinates": [
                -108.04641043504375,
                39.45429166060765,
                1748.037
            ]
        }
    });

    if (!cot.raw.event.detail) {
        assert.fail('No Detail Section')
    } else {
        assert.deepEqual(cot.sensor(), {
            type: 'Polygon',
            coordinates: [[ [ -108.04641043504375, 39.45429166060765 ], [ -108.0469024188539, 39.45505523324667 ], [ -108.04688429589571, 39.4550620363062 ], [ -108.0468660152126, 39.4550685829517 ], [ -108.04684758288933, 39.4550748710041 ], [ -108.04682900506103, 39.455080898370404 ], [ -108.04681028791133, 39.45508666304441 ], [ -108.04679143767018, 39.45509216310734 ], [ -108.0467724606119, 39.4550973967285 ], [ -108.04675336305303, 39.455102362165846 ], [ -108.04673415135012, 39.45510705776666 ], [ -108.04671483189786, 39.455111481967975 ], [ -108.04669541112666, 39.45511563329722 ], [ -108.04667589550078, 39.45511951037259 ], [ -108.04665629151602, 39.455123111903625 ], [ -108.04663660569754, 39.45512643669152 ], [ -108.04661684459779, 39.45512948362963 ], [ -108.04659701479432, 39.45513225170378 ], [ -108.04657712288747, 39.45513473999261 ], [ -108.04655717549828, 39.455136947667874 ], [ -108.04653717926627, 39.45513887399477 ], [ -108.04651714084724, 39.45514051833209 ], [ -108.04649706691099, 39.45514188013253 ], [ -108.04647696413916, 39.45514295894281 ], [ -108.04645683922303, 39.455143754403835 ], [ -108.04643669886116, 39.455144266250855 ], [ -108.04641654975732, 39.45514449431349 ], [ -108.04639639861821, 39.455144438515816 ], [ -108.04637625215115, 39.45514409887643 ], [ -108.04635611706192, 39.455143475508365 ], [ -108.04633600005253, 39.45514256861911 ], [ -108.04631590781896, 39.45514137851053 ], [ -108.04629584704894, 39.45513990557876 ], [ -108.04627582441974, 39.45513815031406 ], [ -108.04625584659591, 39.455136113300675 ], [ -108.04623592022713, 39.455133795216625 ], [ -108.04621605194588, 39.4551311968335 ], [ -108.04619624836538, 39.455128319016154 ], [ -108.04617651607721, 39.45512516272249 ], [ -108.04615686164937, 39.45512172900308 ], [ -108.0461372916238, 39.45511801900086 ], [ -108.0461178125144, 39.45511403395068 ], [ -108.04609843080483, 39.45510977517898 ], [ -108.04607915294628, 39.455105244103315 ], [ -108.04605998535538, 39.45510044223184 ], [ -108.04604093441209, 39.45509537116287 ], [ -108.0460220064575, 39.455090032584316 ], [ -108.04600320779176, 39.455084428273125 ], [ -108.04598454467201, 39.4550785600947 ], [ -108.04596602331023, 39.455072430002275 ], [ -108.04594764987125, 39.45506604003626 ], [ -108.04592943047062, 39.455059392323555 ], [ -108.04591137117268, 39.45505248907684 ], [ -108.04589347798839, 39.45504533259389 ], [ -108.04587575687346, 39.455037925256725 ], [ -108.0458582137263, 39.45503026953089 ], [ -108.04584085438611, 39.45502236796458 ], [ -108.04582368463089, 39.45501422318786 ], [ -108.04580671017553, 39.4550058379117 ], [ -108.04578993666988, 39.45499721492713 ], [ -108.04577336969692, 39.454988357104334 ], [ -108.04575701477089, 39.454979267391614 ], [ -108.04574087733545, 39.45496994881448 ], [ -108.04572496276182, 39.45496040447461 ], [ -108.04570927634711, 39.454950637548855 ], [ -108.04569382331236, 39.454940651288105 ], [ -108.04641043504375, 39.45429166060765 ] ]]
        });
    }
});

test('Decode iTAK COT UAS Message', async () => {
    const packet = '<event version="2" uid="2983J8B001V013" type="a-f-A-M-H-Q" time="2024-04-24T16:37:38.002Z" start="2024-04-24T16:37:38.002Z" stale="2024-04-24T16:37:41.502Z" > <detail> <_uastool extendedCot="" activeRoute="" > </_uastool> <track course="140.8" slope="0" speed="0" > </track> <sensor elevation="0" vfov="41.6" north="320.8000030518" roll="0" range="300" azimuth="140" model="Mavic 2 Enterprise Dual-Visual" fov="66.9" type="r-e" version="0.6" > </sensor> <spatial> <attitude roll="-0.2" pitch="3.8" yaw="140.8" > </attitude> <spin roll="0" pitch="0.0896860987" yaw="0" > </spin> </spatial> <vehicle goHomeBatteryPercent="15" hal="0" flightTimeRemaining="0" typeTag="_DJI_" batteryRemainingCapacity="2216" isFlying="" flightTime="0" type="DJI" batteryMaxCapacity="3672" voltage="15.71" > </vehicle> <_radio rssi="100" gps="" > </_radio> <waypointCollection> </waypointCollection> <_route sender="ANDROID-c96c2c467371208c" > </_route> <commandedData climbRate="0" > </commandedData> <__video sensor="UAS-CO DFPC Lawrence" spi="UAS-CO DFPC Lawrence.SPI1" url="rtsp://18.254.132.96:8554/money" > </__video> <link uid="ANDROID-c96c2c467371208c" type="a-f-G-U-C" relation="p-p" > </link> <_flow-tags_ TAK-Server-e87a0e02420b44a08f6032bcf1877745="2024-04-24T16:37:38Z" > </_flow-tags_> </detail> <point lat="39.1" lon="-108.6" ce="0" hae="1381.333" le="0" > </point></event>';

    const cot = await CoTParser.from_xml(packet);

    if (!cot.raw.event.detail) {
        assert.fail('No Detail Section')
    } else {
        assert.ok(cot.raw.event.detail['_flow-tags_']);
        delete cot.raw.event.detail['_flow-tags_'];

        assert.deepEqual(cot.raw, {
            "event": {
                "_attributes": {
                    "version": "2",
                    "uid": "2983J8B001V013",
                    "type": "a-f-A-M-H-Q",
                    "time": "2024-04-24T16:37:38.002Z",
                    "start": "2024-04-24T16:37:38.002Z",
                    "stale": "2024-04-24T16:37:41.502Z"
                },
                "detail": {
                    "_uastool": {
                        "_attributes": {
                            "extendedCot": "",
                            "activeRoute": ""
                        }
                    },
                    "track": {
                        "_attributes": {
                            "course": "140.8",
                            "slope": "0",
                            "speed": "0"
                        }
                    },
                    "sensor": {
                        "_attributes": {
                            "elevation": 0,
                            "vfov": 41.6,
                            "north": 320.8000030518,
                            "roll": 0,
                            "range": 300,
                            "azimuth": 140,
                            "model": "Mavic 2 Enterprise Dual-Visual",
                            "fov": 66.9,
                            "type": "r-e",
                            "version": "0.6"
                        }
                    },
                    "spatial": {
                        "attitude": {
                            "_attributes": {
                                "roll": -0.2,
                                "pitch": 3.8,
                                "yaw": 140.8
                            }
                        },
                        "spin": {
                            "_attributes": {
                                "roll": 0,
                                "pitch": 0.0896860987,
                                "yaw": 0
                            }
                        }
                    },
                    "vehicle": {
                        "_attributes": {
                            "goHomeBatteryPercent": "15",
                            "hal": "0",
                            "flightTimeRemaining": "0",
                            "typeTag": "_DJI_",
                            "batteryRemainingCapacity": "2216",
                            "isFlying": "",
                            "flightTime": "0",
                            "type": "DJI",
                            "batteryMaxCapacity": "3672",
                            "voltage": "15.71"
                        }
                    },
                    "_radio": {
                        "_attributes": {
                            "rssi": "100",
                            "gps": ""
                        }
                    },
                    "waypointCollection": {},
                    "_route": {
                        "_attributes": {
                            "sender": "ANDROID-c96c2c467371208c"
                        }
                    },
                    "commandedData": {
                        "_attributes": {
                            "climbRate": "0"
                        }
                    },
                    "__video": {
                        "_attributes": {
                            "sensor": "UAS-CO DFPC Lawrence",
                            "spi": "UAS-CO DFPC Lawrence.SPI1",
                            "url": "rtsp://18.254.132.96:8554/money"
                        }
                    },
                    "link": {
                        "_attributes": {
                            "uid": "ANDROID-c96c2c467371208c",
                            "type": "a-f-G-U-C",
                            "relation": "p-p"
                        }
                    }
                },
                "point": {
                    "_attributes": {
                        "lat": 39.1,
                        "lon": -108.6,
                        "ce": 0,
                        "hae": 1381.333,
                        "le": 0
                    }
                }
            }
        });

        assert.deepEqual(await CoTParser.to_geojson(cot), {
            id: '2983J8B001V013',
            type: 'Feature',
            path: '/',
            properties: {
                callsign: 'UNKNOWN',
                center: [ -108.6, 39.1, 1381.333 ],
                type: 'a-f-A-M-H-Q',
                how: '',
                time: '2024-04-24T16:37:38.002Z',
                start: '2024-04-24T16:37:38.002Z',
                stale: '2024-04-24T16:37:41.502Z',
                video: {
                    sensor: 'UAS-CO DFPC Lawrence',
                    spi: 'UAS-CO DFPC Lawrence.SPI1',
                    url: 'rtsp://18.254.132.96:8554/money'
                },
                links: [{
                    uid: "ANDROID-c96c2c467371208c",
                    type: "a-f-G-U-C",
                    relation: "p-p"
                }],
                sensor: {
                    elevation: 0,
                    vfov: 41.6,
                    north: 320.8000030518,
                    roll: 0,
                    range: 300,
                    azimuth: 140,
                    model: 'Mavic 2 Enterprise Dual-Visual',
                    fov: 66.9,
                    type: 'r-e',
                    version: '0.6'
                },
                spatial: {
                    attitude: {
                        roll: -0.2,
                        pitch: 3.8,
                        yaw: 140.8
                    },
                    spin: {
                        roll: 0,
                        pitch: 0.0896860987,
                        yaw: 0
                    }
                },
                course: 140.8,
                slope: 0,
                speed: 0,
                metadata: {}
            },
            geometry: {
                type: 'Point',
                coordinates: [ -108.6, 39.1, 1381.333 ]
            }
        });
    }
});

test('Decode iTAK COT UAS Message 2', async () => {
    const packet = '<event version="2.0" uid="1581F5BKB244G00F011K" type="a-f-A-M-H-Q" how="m-g" time="2024-09-18T22:09:39Z" start="2024-09-18T22:09:39Z" stale="2024-09-18T22:09:42Z" access="Undefined"><point lat="0.0" lon="0.0" hae="-4919.1" ce="0.0" le="0.0"/><detail><contact callsign="UAS-Phoenix 2"/><_uastool extendedCot="true" activeRoute="false"/><track course="-108.90" slope="0.0" speed="0.0"/><sensor elevation="0.0" vfov="47.1000000000" north="431.1000000000" roll="0.0" range="300" azimuth="251.1000000000" model="M30T" fov="75.5000000000" type="r-e" version="0.6"/><spatial><attitude roll="0.2000000000" pitch="-4.2000000000" yaw="-108.9000000000"/><spin roll="0.0" pitch="0.0" yaw="0.0"/></spatial><vehicle goHomeBatteryPercent="20" hal="0.0" flightTimeRemaining="0" typeTag="_DJIV5_" batteryRemainingCapacity="4871" isFlying="false" flightTime="0" type="DJIV5" batteryMaxCapacity="5838" voltage="24.79"/><_radio rssi="100" gps="true"/><waypointCollection/><_route sender="ANDROID-c283321be77c8ec9"/><commandedData climbRate="0.0"/><__video/><link uid="ANDROID-c283321be77c8ec9" type="a-f-G-U-C" relation="p-p"/><_flow-tags_ TAK-Server-e87a0e02420b44a08f6032bcf1877745="2024-09-18T22:09:39Z"/></detail></event>';

    const cot = await CoTParser.from_xml(packet);

    if (!cot.raw.event.detail) {
        assert.fail('No Detail Section')
    } else {
        assert.ok(cot.raw.event.detail['_flow-tags_']);
        delete cot.raw.event.detail['_flow-tags_'];

        assert.deepEqual(await CoTParser.to_geojson(cot), {
            id: '1581F5BKB244G00F011K',
            type: 'Feature',
            path: '/',
            properties: {
                callsign: 'UAS-Phoenix 2',
                center: [ 0, 0, -4919.1 ],
                type: 'a-f-A-M-H-Q',
                how: 'm-g',
                time: '2024-09-18T22:09:39Z',
                start: '2024-09-18T22:09:39Z',
                stale: '2024-09-18T22:09:42Z',
                sensor: {
                    elevation: 0.0,
                    vfov: 47.1000000000,
                    north: 431.1000000000,
                    roll: 0.0,
                    range: 300,
                    azimuth: 251.1000000000,
                    fov: 75.5000000000,
                    model: 'M30T',
                    type: 'r-e',
                    version: '0.6'
                },
                spatial: {
                    attitude: {
                        roll: 0.2,
                        pitch: -4.2,
                        yaw: -108.9
                    },
                    spin: {
                        roll: 0,
                        pitch: 0,
                        yaw: 0
                    }
                },
                links: [{
                    uid: "ANDROID-c283321be77c8ec9",
                    type: "a-f-G-U-C",
                    relation: "p-p"
                }],
                course: -108.9,
                slope: 0,
                speed: 0,
                metadata: {}
            },
            geometry: {
                type: 'Point',
                coordinates: [ 0, 0, -4919.1 ]
            }
        });
    }
});

test('Sensor2Polygon - centred on azimuth, slant range projected to ground', async () => {
    const cot = await CoTParser.from_geojson({
        id: 'sensor-north',
        type: 'Feature',
        path: '/',
        properties: {
            callsign: 'Sensor',
            type: 'a-f-A-M-H-Q',
            how: 'm-g',
            time: '2024-11-21T16:07:08Z',
            start: '2024-11-21T16:07:07Z',
            stale: '2024-11-21T16:07:11Z',
            sensor: { azimuth: 0, fov: 60, range: 200, elevation: -60 },
            metadata: {}
        },
        geometry: { type: 'Point', coordinates: [0, 0] }
    });

    const poly = cot.sensor();
    if (!poly) assert.fail('Sensor pointing due north must still produce a cone');

    const ring = poly.coordinates[0];
    const bearing = (p: number[]) => (Math.atan2(p[0], p[1]) * 180 / Math.PI + 360) % 360;
    const metres = (p: number[]) => Math.hypot(p[0], p[1]) * 111320;

    assert.deepEqual(ring[0], [0, 0]);
    assert.ok(Math.abs(bearing(ring[1]) - 330) < 0.1);
    assert.ok(Math.abs(bearing(ring[ring.length - 2]) - 30) < 0.1);
    assert.ok(Math.abs(metres(ring[1]) - 100) < 0.5);
});

test('Sensor2Polygon - no cone without a usable range', async () => {
    const cot = await CoTParser.from_geojson({
        id: 'sensor-nadir',
        type: 'Feature',
        path: '/',
        properties: {
            callsign: 'Sensor',
            type: 'a-f-A-M-H-Q',
            how: 'm-g',
            time: '2024-11-21T16:07:08Z',
            start: '2024-11-21T16:07:07Z',
            stale: '2024-11-21T16:07:11Z',
            sensor: { azimuth: 90, fov: 60, range: 200, elevation: -90 },
            metadata: {}
        },
        geometry: { type: 'Point', coordinates: [0, 0] }
    });

    assert.equal(cot.sensor(), null);
});
