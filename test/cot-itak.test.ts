import test from 'tape';
import { CoTParser } from '../index.js';

test('Decode iTAK COT message', (t) => {
    const packet = '<event version="2.0" uid="C94B9215-9BD4-4DBE-BDE1-83625F09153F" type="a-f-G-E-V-C" time="2023-07-18T15:23:09.00Z" start="2023-07-18T15:23:09.00Z" stale="2023-07-18T15:25:09.00Z" how="m-g"><point lat="41.52309645" lon="-107.72376567" hae="1681.23725821" ce="9999999" le="9999999" /><detail><contact callsign="DFPC-iSchmidt" phone="7204258729" endpoint="*:-1:stcp" /><uid Droid="DFPC-iSchmidt" /><__group name="Yellow" role="Team Member" /><precisionlocation geopointsrc="GPS" altsrc="???" /><status battery="100" /><takv device="iPhone" platform="iTAK" os="16.5.1" version="2.7.0.609" /><track speed="0.00000000" course="137.23542786" /></detail></event>';

    const cot = CoTParser.from_xml(packet);

    if (!cot.raw.event.detail) {
        t.fail('No Detail Section')
    } else {
        t.ok(cot.raw.event.detail['_flow-tags_']);
        delete cot.raw.event.detail['_flow-tags_'];

        t.deepEquals({
            'event': {
                '_attributes': {
                    'version': '2.0',
                    'uid': 'C94B9215-9BD4-4DBE-BDE1-83625F09153F',
                    'type': 'a-f-G-E-V-C',
                    'time': '2023-07-18T15:23:09.00Z',
                    'start': '2023-07-18T15:23:09.00Z',
                    'stale': '2023-07-18T15:25:09.00Z',
                    'how': 'm-g',
                },
                'point': {
                    '_attributes': {
                        'lat': '41.52309645',
                        'lon': '-107.72376567',
                        'hae': '1681.23725821',
                        'ce': '9999999',
                        'le': '9999999'
                    }
                },
                detail: {
                    contact: {
                        _attributes: {
                            callsign: 'DFPC-iSchmidt',
                            phone: '7204258729',
                            endpoint: '*:-1:stcp'
                        }
                    },
                    uid: { _attributes: { Droid: 'DFPC-iSchmidt' } },
                    __group: { _attributes: { name: 'Yellow', role: 'Team Member' } },
                    precisionlocation: { _attributes: { geopointsrc: 'GPS', altsrc: '???' } },
                    status: { _attributes: { battery: '100' } },
                    takv: { _attributes: { device: 'iPhone', platform: 'iTAK', os: '16.5.1', version: '2.7.0.609' } },
                    track: { _attributes: { speed: '0.00000000', course: '137.23542786' } }
                }
            }
        }, cot.raw);

        t.deepEquals({
            id: 'C94B9215-9BD4-4DBE-BDE1-83625F09153F',
            type: 'Feature',
            path: '/',
            properties: {
                callsign: 'DFPC-iSchmidt',
                droid: "DFPC-iSchmidt",
                type: 'a-f-G-E-V-C',
                how: 'm-g',
                center: [ -107.72376567, 41.52309645, 1681.23725821 ],
                time: '2023-07-18T15:23:09.00Z',
                start: '2023-07-18T15:23:09.00Z',
                stale: '2023-07-18T15:25:09.00Z',
                course: 137.23542786,
                speed: 0,
                contact: {
                  "phone": "7204258729",
                  "endpoint": "*:-1:stcp"
                },
                metadata: {},
                group: {
                    name: 'Yellow',
                    role: 'Team Member'
                },
                precisionlocation: {
                  "geopointsrc": "GPS",
                  "altsrc": "???"
                },
                status: {
                  "battery": "100"
                },
                takv: {
                  "device": "iPhone",
                  "platform": "iTAK",
                  "os": "16.5.1",
                  "version": "2.7.0.609"
                }

            },
            geometry: {
                type: 'Point',
                coordinates: [ -107.72376567, 41.52309645, 1681.23725821 ]
            }
        }, cot.to_geojson());
    }

    t.end();
});
