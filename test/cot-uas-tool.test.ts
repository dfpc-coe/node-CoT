import test from 'tape';
import CoT from '../index.js';

test('Decode iTAK COT message', (t) => {
    const packet = '<event version="2" uid="2983J8B001V013" type="a-f-A-M-H-Q" time="2024-04-24T16:37:38.002Z" start="2024-04-24T16:37:38.002Z" stale="2024-04-24T16:37:41.502Z" > <detail> <_uastool extendedCot="" activeRoute="" > </_uastool> <track course="140.8" slope="0" speed="0" > </track> <sensor elevation="0" vfov="41.6" north="320.8000030518" roll="0" range="300" azimuth="140" model="Mavic 2 Enterprise Dual-Visual" fov="66.9" type="r-e" version="0.6" > </sensor> <spatial> <attitude roll="-0.2" pitch="3.8" yaw="140.8" > </attitude> <spin roll="0" pitch="0.0896860987" yaw="0" > </spin> </spatial> <vehicle goHomeBatteryPercent="15" hal="0" flightTimeRemaining="0" typeTag="_DJI_" batteryRemainingCapacity="2216" isFlying="" flightTime="0" type="DJI" batteryMaxCapacity="3672" voltage="15.71" > </vehicle> <_radio rssi="100" gps="" > </_radio> <waypointCollection> </waypointCollection> <_route sender="ANDROID-c96c2c467371208c" > </_route> <commandedData climbRate="0" > </commandedData> <__video sensor="UAS-CO DFPC Lawrence" spi="UAS-CO DFPC Lawrence.SPI1" url="rtsp://18.254.132.96:8554/money" > </__video> <link uid="ANDROID-c96c2c467371208c" type="a-f-G-U-C" relation="p-p" > </link> <_flow-tags_ TAK-Server-e87a0e02420b44a08f6032bcf1877745="2024-04-24T16:37:38Z" > </_flow-tags_> </detail> <point lat="39.1" lon="-108.6" ce="0" hae="1381.333" le="0" > </point></event>';

    const cot = new CoT(packet);

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
                            "elevation": "0",
                            "vfov": "41.6",
                            "north": "320.8000030518",
                            "roll": "0",
                            "range": "300",
                            "azimuth": "140",
                            "model": "Mavic 2 Enterprise Dual-Visual",
                            "fov": "66.9",
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
                        "lat": "39.1",
                        "lon": "-108.6",
                        "ce": "0",
                        "hae": "1381.333",
                        "le": "0"
                    }
                }
            }
        });

        t.deepEquals(cot.to_geojson(), {
            id: '2983J8B001V013',
            type: 'Feature',
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
                    elevation: '0',
                    vfov: '41.6',
                    north: '320.8000030518',
                    roll: '0',
                    range: '300',
                    azimuth: '140',
                    model: 'Mavic 2 Enterprise Dual-Visual',
                    fov: '66.9',
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
