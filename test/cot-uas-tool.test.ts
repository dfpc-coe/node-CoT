import test from 'tape';
import { CoTParser } from '../index.js';

test('Sensor2Polygon', (t) => {
    const cot = CoTParser.from_geojson({
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
        t.fail('No Detail Section')
    } else {
        t.deepEquals(cot.sensor(), {
            type: 'Polygon',
            coordinates: [[
                [ -108.04641043504375, 39.45429166060765 ],
                [ -108.04626848908208, 39.455184277487476 ],
                [ -108.04624742260683, 39.455182129471105 ], [ -108.04622641039066, 39.4551796850677 ],
                [ -108.04620545942751, 39.45517694509086 ], [ -108.04618457669096, 39.45517391045262 ], [ -108.0461637691319, 39.45517058216307 ], [ -108.0461430436761, 39.45516696133 ],
                [ -108.0461224072221, 39.45516304915865 ],
                [ -108.04610186663874, 39.45515884695118 ],
                [ -108.04608142876303, 39.4551543561063 ],
                [ -108.0460611003977, 39.45514957811881 ],
                [ -108.04604088830905, 39.45514451457907 ],
                [ -108.0460207992247, 39.45513916717246 ], [ -108.04600083983134, 39.45513353767891 ], [ -108.04598101677242, 39.45512762797219 ], [ -108.04596133664603, 39.455121440019354 ], [ -108.04594180600273, 39.455114975880086 ], [ -108.04592243134323, 39.455108237705964 ], [ -108.04590321911644, 39.45510122773981 ], [ -108.04588417571705, 39.45509394831491 ], [ -108.04586530748368, 39.4550864018542 ], [ -108.04584662069652, 39.455078590869554 ], [ -108.04582812157547, 39.45507051796086 ], [ -108.04580981627791, 39.45506218581518 ], [ -108.04579171089668, 39.45505359720588 ], [ -108.0457738114581, 39.455044754991704 ], [ -108.04575612391994, 39.45503566211575 ], [ -108.04573865416941, 39.455026321604606 ], [ -108.04572140802122, 39.455016736567266 ], [ -108.04570439121566, 39.455006910194115 ], [ -108.04568760941667, 39.454996845755836 ], [ -108.04567106821001, 39.45498654660239 ], [ -108.04565477310123, 39.45497601616186 ], [ -108.04563872951411, 39.454965257939264 ], [ -108.04562294278857, 39.454954275515504 ], [ -108.04560741817915, 39.45494307254605 ], [ -108.04559216085299, 39.454931652759804 ], [ -108.04557717588841, 39.454920019957825 ], [ -108.04556246827298, 39.45490817801209 ], [ -108.04554804290194, 39.45489613086416 ], [ -108.04553390457663, 39.4548838825239 ], [ -108.0455200580028, 39.45487143706817 ], [ -108.04550650778911, 39.45485879863942 ], [ -108.04549325844555, 39.454845971444286 ], [ -108.04548031438193, 39.454832959752295 ], [ -108.04546767990654, 39.45481976789435 ], [ -108.04545535922452, 39.45480640026133 ], [ -108.04544335643659, 39.45479286130261 ], [ -108.04543167553766, 39.454779155524584 ], [ -108.04542032041547, 39.45476528748918 ], [ -108.04540929484936, 39.454751261812326 ], [ -108.04539860250894, 39.454737083162414 ], [ -108.04538824695291, 39.454722756258754 ], [ -108.04537823162786, 39.45470828586999 ], [ -108.04536855986714, 39.45469367681254 ], [ -108.04535923488973, 39.454678933948955 ], [ -108.04535025979919, 39.45466406218633 ], [ -108.0453416375826, 39.454649066474644 ], [ -108.04533337110959, 39.45463395180517 ], [ -108.04532546313139, 39.45461872320871 ], [ -108.04531791627988, 39.45460338575404 ], [ -108.04531073306677, 39.45458794454614 ], [ -108.04530391588266, 39.45457240472452 ], [ -108.0452974669964, 39.45455677146151 ], [ -108.04529138855419, 39.45454104996055 ], [ -108.04641043504375, 39.45429166060765 ] ] ]
        });
    }

    t.end();
});

test('Decode iTAK COT UAS Message', (t) => {
    const packet = '<event version="2" uid="2983J8B001V013" type="a-f-A-M-H-Q" time="2024-04-24T16:37:38.002Z" start="2024-04-24T16:37:38.002Z" stale="2024-04-24T16:37:41.502Z" > <detail> <_uastool extendedCot="" activeRoute="" > </_uastool> <track course="140.8" slope="0" speed="0" > </track> <sensor elevation="0" vfov="41.6" north="320.8000030518" roll="0" range="300" azimuth="140" model="Mavic 2 Enterprise Dual-Visual" fov="66.9" type="r-e" version="0.6" > </sensor> <spatial> <attitude roll="-0.2" pitch="3.8" yaw="140.8" > </attitude> <spin roll="0" pitch="0.0896860987" yaw="0" > </spin> </spatial> <vehicle goHomeBatteryPercent="15" hal="0" flightTimeRemaining="0" typeTag="_DJI_" batteryRemainingCapacity="2216" isFlying="" flightTime="0" type="DJI" batteryMaxCapacity="3672" voltage="15.71" > </vehicle> <_radio rssi="100" gps="" > </_radio> <waypointCollection> </waypointCollection> <_route sender="ANDROID-c96c2c467371208c" > </_route> <commandedData climbRate="0" > </commandedData> <__video sensor="UAS-CO DFPC Lawrence" spi="UAS-CO DFPC Lawrence.SPI1" url="rtsp://18.254.132.96:8554/money" > </__video> <link uid="ANDROID-c96c2c467371208c" type="a-f-G-U-C" relation="p-p" > </link> <_flow-tags_ TAK-Server-e87a0e02420b44a08f6032bcf1877745="2024-04-24T16:37:38Z" > </_flow-tags_> </detail> <point lat="39.1" lon="-108.6" ce="0" hae="1381.333" le="0" > </point></event>';

    const cot = CoTParser.from_xml(packet);

    if (!cot.raw.event.detail) {
        t.fail('No Detail Section')
    } else {
        t.ok(cot.raw.event.detail['_flow-tags_']);
        delete cot.raw.event.detail['_flow-tags_'];

        t.deepEquals(cot.raw, {
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
                                "roll": "-0.2",
                                "pitch": "3.8",
                                "yaw": "140.8"
                            }
                        },
                        "spin": {
                            "_attributes": {
                                "roll": "0",
                                "pitch": "0.0896860987",
                                "yaw": "0"
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

        t.deepEquals(CoTParser.to_geojson(cot), {
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

    t.end();
});

test('Decode iTAK COT UAS Message 2', (t) => {
    const packet = '<event version="2.0" uid="1581F5BKB244G00F011K" type="a-f-A-M-H-Q" how="m-g" time="2024-09-18T22:09:39Z" start="2024-09-18T22:09:39Z" stale="2024-09-18T22:09:42Z" access="Undefined"><point lat="0.0" lon="0.0" hae="-4919.1" ce="0.0" le="0.0"/><detail><contact callsign="UAS-Phoenix 2"/><_uastool extendedCot="true" activeRoute="false"/><track course="-108.90" slope="0.0" speed="0.0"/><sensor elevation="0.0" vfov="47.1000000000" north="431.1000000000" roll="0.0" range="300" azimuth="251.1000000000" model="M30T" fov="75.5000000000" type="r-e" version="0.6"/><spatial><attitude roll="0.2000000000" pitch="-4.2000000000" yaw="-108.9000000000"/><spin roll="0.0" pitch="0.0" yaw="0.0"/></spatial><vehicle goHomeBatteryPercent="20" hal="0.0" flightTimeRemaining="0" typeTag="_DJIV5_" batteryRemainingCapacity="4871" isFlying="false" flightTime="0" type="DJIV5" batteryMaxCapacity="5838" voltage="24.79"/><_radio rssi="100" gps="true"/><waypointCollection/><_route sender="ANDROID-c283321be77c8ec9"/><commandedData climbRate="0.0"/><__video/><link uid="ANDROID-c283321be77c8ec9" type="a-f-G-U-C" relation="p-p"/><_flow-tags_ TAK-Server-e87a0e02420b44a08f6032bcf1877745="2024-09-18T22:09:39Z"/></detail></event>';

    const cot = CoTParser.from_xml(packet);

    if (!cot.raw.event.detail) {
        t.fail('No Detail Section')
    } else {
        t.ok(cot.raw.event.detail['_flow-tags_']);
        delete cot.raw.event.detail['_flow-tags_'];

        t.deepEquals(CoTParser.to_geojson(cot), {
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

    t.end();
});
