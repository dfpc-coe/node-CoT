import test from 'tape';
import { CoTParser } from '../index.js';

test('Decode iTAK COT message', (t) => {
    const packet = `<event version="2.0" uid="layer-35-4707" type="a-f-G" how="m-g" time="2024-06-07T15:28:48Z" start="2024-06-07T15:28:48.669Z" stale="2024-06-07T15:33:48.669Z"><point lat="39.1" lon="-105.1" hae="0.0" ce="9999999.0" le="9999999.0"/><detail><contact callsign="9T20"/><usericon iconsetpath="f7f71666-8b28-4b57-9fbb-e38e61d33b79/Google/police.png"/><remarks>Incident ID: 6841390
Master Incident Number: 05242024-0253042
Unit Name: 9F20
Unit ID: 3412
Status: Dispatched
Jurisdiction: Golden PD
Speed: 1</remarks><_flow-tags_ TAK-Server-e87a0e02420b44a08f6032bcf1877745="2024-06-07T15:28:48Z"><NodeCoT-8.1.0>2024-06-07T15:28:48.669Z</NodeCoT-8.1.0></_flow-tags_></detail></event>`

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
                    'uid': 'layer-35-4707',
                    'type': 'a-f-G',
                    'time': '2024-06-07T15:28:48Z',
                    'start': '2024-06-07T15:28:48.669Z',
                    'stale': '2024-06-07T15:33:48.669Z',
                    'how': 'm-g',
                },
                'point': {
                    '_attributes': {
                        'lat': '39.1',
                        'lon': '-105.1',
                        'hae': '0.0',
                        'ce': '9999999.0',
                        'le': '9999999.0'
                    }
                },
                detail: {
                    usericon: {
                        _attributes: {
                            "iconsetpath": "f7f71666-8b28-4b57-9fbb-e38e61d33b79/Google/police.png"
                        }
                    },
                    contact: {
                        _attributes: {
                            callsign: '9T20',
                        }
                    },
                    remarks: {
                        "_text": "Incident ID: 6841390\nMaster Incident Number: 05242024-0253042\nUnit Name: 9F20\nUnit ID: 3412\nStatus: Dispatched\nJurisdiction: Golden PD\nSpeed: 1"
                    },
                }
            }
        }, cot.raw);

        t.deepEquals(CoTParser.to_geojson(cot), {
            id: 'layer-35-4707',
            type: 'Feature',
            path: '/',
            properties: {
                callsign: '9T20',
                type: 'a-f-G',
                how: 'm-g',
                center: [ -105.1, 39.1, 0],
                remarks: "Incident ID: 6841390\nMaster Incident Number: 05242024-0253042\nUnit Name: 9F20\nUnit ID: 3412\nStatus: Dispatched\nJurisdiction: Golden PD\nSpeed: 1",
                time: '2024-06-07T15:28:48Z',
                start: '2024-06-07T15:28:48.669Z',
                stale: '2024-06-07T15:33:48.669Z',
                icon: "f7f71666-8b28-4b57-9fbb-e38e61d33b79/Google/police.png",
                metadata: {},
            },
            geometry: {
                type: 'Point',
                coordinates: [ -105.1, 39.1, 0 ]
            }
        });
    }

    t.end();
});
