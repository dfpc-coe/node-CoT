import test from 'tape';
import CoT from '../index.js';

test('Decode MultiMissionAircraft CoTs', (t) => {
    const cot = new CoT({"event":{"_attributes":{"version":"2.0","uid":"CO-DFPC-WLD27_CO-DFPC-WLD27-SPI","time":"2024-07-01T22:06:41Z","start":"2024-07-01T22:06:38Z","stale":"2024-07-01T22:06:58Z","type":"b-m-p-s-p-i","how":"m-g-n"},"point":{"_attributes":{"lat":"40.066418","lon":"-108.322413","hae":"1899.427151","ce":"9999999","le":"9999999"}},"detail":{"precisionlocation":{"_attributes":{"geopointsrc":"CALC","altsrc":"CALC"}},"contact":{"_attributes":{"name":"CO-DFPC-WLD27-SPI","callsign":"CO-DFPC-WLD27-SPI"}},"link":{"_attributes":{"uid":"CO-DFPC-WLD27_CO-DFPC-WLD27","relation":"p-p"}},"shape":{"polyline":{"_attributes":{"closed":"true","fillColor":"0","color":"-1"},"vertex":[{"_attributes":{"lat":"40.059445","lon":"-108.328368"}},{"_attributes":{"lat":"40.061846","lon":"-108.314776"}},{"_attributes":{"lat":"40.075499","lon":"-108.315566"}},{"_attributes":{"lat":"40.071252","lon":"-108.330782"}}]}},"__group":{},"_flow-tags_":{"_attributes":{"TAK-Server-e87a0e02420b44a08f6032bcf1877745":"2024-07-01T22:06:41Z"}}}}});

    if (!cot.raw.event.detail) {
        t.fail('No Detail Section')
    } else {
        t.ok(cot.raw.event.detail['_flow-tags_']);
        delete cot.raw.event.detail['_flow-tags_'];

        t.deepEquals({
            "event":{
                "_attributes":{
                    "version":"2.0",
                    "uid":"CO-DFPC-WLD27_CO-DFPC-WLD27-SPI",
                    "time":"2024-07-01T22:06:41Z",
                    "start":"2024-07-01T22:06:38Z",
                    "stale":"2024-07-01T22:06:58Z",
                    "type":"b-m-p-s-p-i",
                    "how":"m-g-n"
                },
                "point":{
                    "_attributes":{
                        "lat":"40.066418",
                        "lon":"-108.322413",
                        "hae":"1899.427151",
                        "ce":"9999999",
                        "le":"9999999"
                    }
                },
                "detail":{
                    "precisionlocation":{
                        "_attributes":{
                            "geopointsrc":"CALC",
                            "altsrc":"CALC"
                        }
                    },
                    "contact":{
                        "_attributes":{
                            "name":"CO-DFPC-WLD27-SPI",
                            "callsign":"CO-DFPC-WLD27-SPI"
                        }
                    },
                    "link":{
                        "_attributes": {
                            "uid":"CO-DFPC-WLD27_CO-DFPC-WLD27",
                            "relation":"p-p"
                        }
                    },
                    "shape":{
                        "polyline":{
                            "_attributes":{
                                "closed":"true",
                                "fillColor":"0",
                                "color":"-1"
                            },
                            "vertex":[
                                {"_attributes":{"lat":"40.059445","lon":"-108.328368"}},
                                {"_attributes":{"lat":"40.061846","lon":"-108.314776"}},
                                {"_attributes":{"lat":"40.075499","lon":"-108.315566"}},
                                {"_attributes":{"lat":"40.071252","lon":"-108.330782"}}
                            ]
                        }
                    },
                    "__group":{},
                }
            }
        }, cot.raw);

        t.deepEquals({
            id: 'CO-DFPC-WLD27_CO-DFPC-WLD27-SPI',
            type: 'Feature',
            properties: {
                callsign: 'CO-DFPC-WLD27-SPI',
                type: 'b-m-p-s-p-i',
                how: 'm-g-n',
                center: [ -108.322413, 40.066418, 1899.427151 ],
                fill: "#000000",
                "fill-opacity": 0,
                stroke: "#FFFFFF",
                "stroke-opacity": 1,
                time: '2024-07-01T22:06:41Z',
                start: '2024-07-01T22:06:38Z',
                stale: '2024-07-01T22:06:58Z',
                contact: {
                    name: "CO-DFPC-WLD27-SPI"
                },
                metadata: {},
                precisionlocation: {
                  "geopointsrc": "CALC",
                  "altsrc": "CALC"
                },
            },
            geometry: {
                type: 'Polygon',
                coordinates: [ [
                    [ -108.328368, 40.059445 ],
                    [ -108.314776, 40.061846 ],
                    [ -108.315566, 40.075499 ],
                    [ -108.330782, 40.071252 ],
                    [ -108.328368, 40.059445 ],
                ] ]
            }
        }, cot.to_geojson());
    }

    t.end();
});
