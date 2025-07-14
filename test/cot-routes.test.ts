import test from 'tape';
import CoT, { CoTParser, Route } from '../index.js';

test('Decode Route', async (t) => {
    const cot = new CoT({
        "event": {
            "_attributes": {
                "version": "2.0",
                "uid": "6da80127-44d4-4bf0-89bd-ecd326afaef1",
                "type": "b-m-r",
                "how": "h-g-i-g-o",
                "time": "2024-09-09T21:53:57Z",
                "start": "2024-09-09T07:28:38Z",
                "stale": "2024-09-09T07:28:38Z"
            },
            "point": {
                "_attributes": {
                    "lat": 0.0,
                    "lon": 0.0,
                    "hae": 9999999.0,
                    "ce": 9999999.0,
                    "le": 9999999.0
                }
            },
            "detail": {
                "contact": {
                    "_attributes": {
                        "callsign": "Walking Alt Route 5"
                    }
                },
                "precisionlocation": {
                    "_attributes": {
                        "geopointsrc": "???",
                        "altsrc": "???"
                    }
                },
                "link": [
                    {
                        "_attributes": {
                            "uid": "d12c21b6-aabc-4c59-86aa-fac826d14585",
                            "callsign": "Walking Alt Route 5 SP",
                            "type": "b-m-p-w",
                            "point": "38.5144413169673,-108.547391197293"
                        }
                    },
                    {
                        "_attributes": {
                            "uid": "89a483a4-571b-497c-8763-cfaba6cbb858",
                            "callsign": "",
                            "type": "b-m-p-c",
                            "point": "38.5149532310605,-108.546923921927"
                        }
                    },
                    {
                        "_attributes": {
                            "uid": "02068dff-ebdc-44b2-a99c-f9991e7c7759",
                            "callsign": "",
                            "type": "b-m-p-c",
                            "point": "38.5150249333408,-108.546926767992"
                        }
                    },
                    {
                        "_attributes": {
                            "uid": "8c921804-779a-404f-8ef0-428325bc60fc",
                            "callsign": "",
                            "type": "b-m-p-c",
                            "point": "38.5151394174434,-108.546895974379"
                        }
                    },
                    {
                        "_attributes": {
                            "uid": "60b13bf0-8c57-4786-b694-81201629e1c5",
                            "callsign": "",
                            "type": "b-m-p-c",
                            "point": "38.5151803514502,-108.546844612187"
                        }
                    },
                    {
                        "_attributes": {
                            "uid": "fd2b6974-a3f0-4892-b140-98a2a87d2013",
                            "callsign": "",
                            "type": "b-m-p-c",
                            "point": "38.5152636957219,-108.546651915511"
                        }
                    },
                    {
                        "_attributes": {
                            "uid": "cb25f65e-1578-4fd7-8a0c-3476aba257c8",
                            "callsign": "",
                            "type": "b-m-p-c",
                            "point": "38.515552834564,-108.546310782148"
                        }
                    },
                    {
                        "_attributes": {
                            "uid": "18b9688d-1569-4c81-898f-28e70ad606bf",
                            "callsign": "",
                            "type": "b-m-p-c",
                            "point": "38.5157638654036,-108.546167031945"
                        }
                    },
                    {
                        "_attributes": {
                            "uid": "113acbcd-e3f8-46c1-b7c2-770b906a788d",
                            "callsign": "",
                            "type": "b-m-p-c",
                            "point": "38.5158532626694,-108.54609208104"
                        }
                    },
                    {
                        "_attributes": {
                            "uid": "52a1510b-dcd4-4f70-94e1-b8134ca29a3a",
                            "callsign": "",
                            "type": "b-m-p-c",
                            "point": "38.515905780664,-108.546076056876"
                        }
                    },
                    {
                        "_attributes": {
                            "uid": "86a51fa0-172d-4fda-98ea-ee942ad0eb3b",
                            "callsign": "",
                            "type": "b-m-p-c",
                            "point": "38.5160187860381,-108.54597316944"
                        }
                    },
                    {
                        "_attributes": {
                            "uid": "70159eb3-76ff-46b3-9b2b-1deaa2b2d184",
                            "callsign": "",
                            "type": "b-m-p-c",
                            "point": "38.5160564186505,-108.545938100192"
                        }
                    },
                    {
                        "_attributes": {
                            "uid": "f5ccd2e8-e8f7-4d50-8ad2-3942c4533a02",
                            "callsign": "",
                            "type": "b-m-p-c",
                            "point": "38.5160748431091,-108.545892411714"
                        }
                    },
                    {
                        "_attributes": {
                            "uid": "d516ce2b-7df2-4c03-b173-ec7ccdbb8478",
                            "callsign": "",
                            "type": "b-m-p-c",
                            "point": "38.5163298746682,-108.545661962771"
                        }
                    },
                    {
                        "_attributes": {
                            "uid": "429be532-07ba-48c8-b513-ef7bac76d028",
                            "callsign": "",
                            "type": "b-m-p-c",
                            "point": "38.5164957921584,-108.545458235843"
                        }
                    },
                    {
                        "_attributes": {
                            "uid": "e34b7f29-612b-419b-9724-f4ad5da53e2d",
                            "callsign": "",
                            "type": "b-m-p-c",
                            "point": "38.5166222378823,-108.545275877858"
                        }
                    },
                    {
                        "_attributes": {
                            "uid": "9726f118-c51d-4e21-83c7-badb0c65e60c",
                            "callsign": "",
                            "type": "b-m-p-c",
                            "point": "38.5167698285131,-108.544850396656"
                        }
                    },
                    {
                        "_attributes": {
                            "uid": "5c3f4891-a0b2-4143-9c0f-37d3d428e892",
                            "callsign": "",
                            "type": "b-m-p-c",
                            "point": "38.5168808127812,-108.54462357225"
                        }
                    },
                    {
                        "_attributes": {
                            "uid": "7113e124-f7d4-4848-b7d9-d5bb38df336f",
                            "callsign": "",
                            "type": "b-m-p-c",
                            "point": "38.5170064645084,-108.544504597929"
                        }
                    },
                    {
                        "_attributes": {
                            "uid": "4725ba21-6fcc-455e-aecb-7882046226a5",
                            "callsign": "",
                            "type": "b-m-p-c",
                            "point": "38.5171414968795,-108.544303302554"
                        }
                    },
                    {
                        "_attributes": {
                            "uid": "26934743-a721-4768-ba2d-0e97a254bd45",
                            "callsign": "",
                            "type": "b-m-p-c",
                            "point": "38.5172291006172,-108.544236333091"
                        }
                    },
                    {
                        "_attributes": {
                            "uid": "74d82143-89dd-49ea-8053-31d5f0f8ed1e",
                            "callsign": "",
                            "type": "b-m-p-c",
                            "point": "38.5173173331109,-108.544165746257"
                        }
                    },
                    {
                        "_attributes": {
                            "uid": "4ae15ac5-5839-4cc3-b712-67e9838d0014",
                            "callsign": "",
                            "type": "b-m-p-c",
                            "point": "38.5174202795084,-108.543976946151"
                        }
                    },
                    {
                        "_attributes": {
                            "uid": "aa7ba4d0-b691-4f18-a3ed-d1a187fff88f",
                            "callsign": "",
                            "type": "b-m-p-c",
                            "point": "38.5175036227552,-108.543831758696"
                        }
                    },
                    {
                        "_attributes": {
                            "uid": "c506c4e3-9915-4131-88b3-048b948d08f2",
                            "callsign": "",
                            "type": "b-m-p-c",
                            "point": "38.517613542356,-108.543661143095"
                        }
                    },
                    {
                        "_attributes": {
                            "uid": "01e7a819-668c-4274-9d90-ac055c4da54a",
                            "callsign": "",
                            "type": "b-m-p-c",
                            "point": "38.5178962265508,-108.543325809711"
                        }
                    },
                    {
                        "_attributes": {
                            "uid": "eae6be64-4e3d-4291-b4ea-d8f713ea2205",
                            "callsign": "",
                            "type": "b-m-p-c",
                            "point": "38.5179179531849,-108.542564835311"
                        }
                    },
                    {
                        "_attributes": {
                            "uid": "a121deed-8249-4a49-8e56-46a6d9eda53f",
                            "callsign": "",
                            "type": "b-m-p-c",
                            "point": "38.5179294427309,-108.542459293982"
                        }
                    },
                    {
                        "_attributes": {
                            "uid": "14666337-5cd0-4b1a-955e-cdc4b78fb612",
                            "callsign": "",
                            "type": "b-m-p-c",
                            "point": "38.5179693454348,-108.542373804005"
                        }
                    },
                    {
                        "_attributes": {
                            "uid": "b4d50ece-d5e9-410b-9938-87da3e6e13d5",
                            "callsign": "",
                            "point": "38.518518678155,-108.538496613518"
                        }
                    },
                    {
                        "_attributes": {
                            "uid": "14bbf100-e5cf-423e-9757-edede63f8aeb",
                            "callsign": "",
                            "type": "b-m-p-c",
                            "point": "38.5184750672752,-108.538285083453"
                        }
                    },
                    {
                        "_attributes": {
                            "uid": "220654a4-be29-4537-93f2-d9dd3a0f8c29",
                            "callsign": "",
                            "type": "b-m-p-c",
                            "point": "38.5184905316775,-108.538071195872"
                        }
                    },
                    {
                        "_attributes": {
                            "uid": "de932406-0ce6-49d7-8867-18e85395a88a",
                            "callsign": "",
                            "type": "b-m-p-c",
                            "point": "38.5185637113729,-108.537919778987"
                        }
                    },
                    {
                        "_attributes": {
                            "uid": "52dbaa28-736c-4409-8b1e-ae73e6655688",
                            "callsign": "",
                            "type": "b-m-p-c",
                            "point": "38.5185823219668,-108.537699998988"
                        }
                    },
                    {
                        "_attributes": {
                            "uid": "44f53570-4ef1-4076-a7e3-f203912c2675",
                            "callsign": "",
                            "type": "b-m-p-c",
                            "point": "38.5186577706628,-108.537545754848"
                        }
                    },
                    {
                        "_attributes": {
                            "uid": "91c705e6-6052-4cc2-9cd1-0bdd32fb9620",
                            "callsign": "",
                            "type": "b-m-p-c",
                            "point": "38.5187507810887,-108.537197876139"
                        }
                    },
                    {
                        "_attributes": {
                            "uid": "9c51a2e0-651f-487e-955f-c4723f57c676",
                            "callsign": "",
                            "type": "b-m-p-c",
                            "point": "38.5187772046473,-108.536844373659"
                        }
                    },
                    {
                        "_attributes": {
                            "uid": "a08ac55e-1e4d-4d3b-8ed9-654c0d0f17a7",
                            "callsign": "",
                            "type": "b-m-p-c",
                            "point": "38.5188887411569,-108.536563687344"
                        }
                    },
                    {
                        "_attributes": {
                            "uid": "d263cabb-0127-4b1a-b6ec-49ba7955613e",
                            "callsign": "",
                            "type": "b-m-p-c",
                            "point": "38.5189069741421,-108.536444249515"
                        }
                    },
                    {
                        "_attributes": {
                            "uid": "433be0f6-8e94-4c07-9c2f-12c2ccdbf585",
                            "callsign": "",
                            "type": "b-m-p-c",
                            "point": "38.5189739966264,-108.53616651121"
                        }
                    },
                    {
                        "_attributes": {
                            "uid": "31978e14-7b66-40ce-8157-6fe281dcb48e",
                            "callsign": "",
                            "type": "b-m-p-c",
                            "point": "38.5189829024848,-108.536065360801"
                        }
                    },
                    {
                        "_attributes": {
                            "uid": "bb28b040-c5ee-487c-a76b-6f8cedb27354",
                            "callsign": "TGT",
                            "type": "b-m-p-w",
                            "point": "38.5190139289798,-108.535962334931"
                        }
                    }
                ],
                "link_attr": {
                    "_attributes": {
                        "color": -256,
                        "method": "Walking",
                        "prefix": "CP",
                        "direction": "Infil",
                        "routetype": "Primary",
                        "order": "Ascending Check Points"
                    }
                },
                "_flow-tags_": {
                    "_attributes": {
                        "TAK-Server-e87a0e02420b44a08f6032bcf1877745": "2024-09-09T21:53:57Z"
                    }
                }
            }
        }
    })

    if (!cot.raw.event.detail) {
        t.fail('No Detail Section')
    } else {
        t.ok(cot.raw.event.detail['_flow-tags_']);
        delete cot.raw.event.detail['_flow-tags_'];

        t.deepEquals({
            id: '6da80127-44d4-4bf0-89bd-ecd326afaef1',
            type: 'Feature',
            path: '/',
            properties: {
                callsign: 'Walking Alt Route 5',
                center: [ 0, 0, 9999999 ],
                type: 'b-m-r',
                how: 'h-g-i-g-o',
                precisionlocation: {
                    "geopointsrc": "???",
                    "altsrc": "???"
                },
                time: '2024-09-09T21:53:57Z',
                start: '2024-09-09T07:28:38Z',
                stale: '2024-09-09T07:28:38Z',
                metadata: {}
            },
            geometry: {
                type: 'LineString',
                coordinates: [
                    [ -108.547391197293, 38.5144413169673 ],
                    [ -108.546923921927, 38.5149532310605 ],
                    [ -108.546926767992, 38.5150249333408 ],
                    [ -108.546895974379, 38.5151394174434 ],
                    [ -108.546844612187, 38.5151803514502 ],
                    [ -108.546651915511, 38.5152636957219 ],
                    [ -108.546310782148, 38.515552834564 ],
                    [ -108.546167031945, 38.5157638654036 ],
                    [ -108.54609208104, 38.5158532626694 ],
                    [ -108.546076056876, 38.515905780664 ],
                    [ -108.54597316944, 38.5160187860381 ],
                    [ -108.545938100192, 38.5160564186505 ],
                    [ -108.545892411714, 38.5160748431091 ],
                    [ -108.545661962771, 38.5163298746682 ],
                    [ -108.545458235843, 38.5164957921584 ],
                    [ -108.545275877858, 38.5166222378823 ],
                    [ -108.544850396656, 38.5167698285131 ],
                    [ -108.54462357225, 38.5168808127812 ],
                    [ -108.544504597929, 38.5170064645084 ],
                    [ -108.544303302554, 38.5171414968795 ],
                    [ -108.544236333091, 38.5172291006172 ],
                    [ -108.544165746257, 38.5173173331109 ],
                    [ -108.543976946151, 38.5174202795084 ],
                    [ -108.543831758696, 38.5175036227552 ],
                    [ -108.543661143095, 38.517613542356 ],
                    [ -108.543325809711, 38.5178962265508 ],
                    [ -108.542564835311, 38.5179179531849 ],
                    [ -108.542459293982, 38.5179294427309 ],
                    [ -108.542373804005, 38.5179693454348 ],
                    [ -108.538496613518, 38.518518678155 ],
                    [ -108.538285083453, 38.5184750672752 ],
                    [ -108.538071195872, 38.5184905316775 ],
                    [ -108.537919778987, 38.5185637113729 ],
                    [ -108.537699998988, 38.5185823219668 ],
                    [ -108.537545754848, 38.5186577706628 ],
                    [ -108.537197876139, 38.5187507810887 ],
                    [ -108.536844373659, 38.5187772046473 ],
                    [ -108.536563687344, 38.5188887411569 ],
                    [ -108.536444249515, 38.5189069741421 ],
                    [ -108.53616651121, 38.5189739966264 ],
                    [ -108.536065360801, 38.5189829024848 ],
                    [ -108.535962334931, 38.5190139289798 ]
                ]
            }
        }, await CoTParser.to_geojson(cot));
    }

    t.end();
});

test('Parser from LineString', async (t) => {
    const cot = await CoTParser.from_geojson({
        id: '6da80127-44d4-4bf0-89bd-ecd326afaef1',
        type: 'Feature',
        path: '/',
        properties: {
            callsign: 'Walking Alt Route 5',
            type: 'b-m-r',
        },
        geometry: {
            type: 'LineString',
            coordinates: [
                [ -108.547391197293, 38.5144413169673 ],
                [ -108.546923921927, 38.5149532310605 ],
                [ -108.546926767992, 38.5150249333408 ],
                [ -108.546895974379, 38.5151394174434 ],
            ]
        }
    });

    if (!cot.raw.event.detail) {
        t.fail('No Detail Section');
    } else {
        t.ok(cot.raw.event.detail['_flow-tags_']);
        delete cot.raw.event.detail['_flow-tags_'];

        if (cot.raw.event.detail.link && Array.isArray(cot.raw.event.detail.link)) {
            cot.raw.event.detail.link.forEach((link, it) => {
                link._attributes.uid = String(it);
            });
        }

        t.deepEquals(cot.raw.event.detail, {
            contact: {
                _attributes: { callsign: 'Walking Alt Route 5' }
            },
            remarks: { _attributes: {}, _text: '' },
            strokeColor: { _attributes: { value: -2130706688 } },
            strokeWeight: { _attributes: { value: 3 } },
            strokeStyle: { _attributes: { value: 'solid' } },
            link: [
                { _attributes: { type: 'b-m-p-c', uid: '0', callsign: '', point: '38.5144413169673,-108.547391197293' } },
                { _attributes: { type: 'b-m-p-c', uid: '1', callsign: '', point: '38.5149532310605,-108.546923921927' } },
                { _attributes: { type: 'b-m-p-c', uid: '2', callsign: '', point: '38.5150249333408,-108.546926767992' } },
                { _attributes: { type: 'b-m-p-c', uid: '3', callsign: '', point: '38.5151394174434,-108.546895974379' } }
            ],
            __routeinfo: { __navcues: { __navcue: [] } },
            labels_on: { _attributes: { value: false } },
            tog: { _attributes: { enabled: '0' } }
        });
    }

    t.end();
});

test('Decode Route (5.4 Additions)', async (t) => {
    const cot = await CoTParser.from_xml(`
<event version="2.0" uid="9bb32cff-9eb2-4330-a9ba-a92ba01e9eb7" type="b-m-r" time="2025-06-26T00:03:05.328Z" start="2025-06-26T00:03:05.328Z" stale="2025-06-27T00:03:05.328Z" how="h-e" access="Undefined">
  <point lat="0.0" lon="0.0" hae="9999999.0" ce="9999999.0" le="9999999.0"/>
  <detail>
    <link uid="b21452d6-e790-4e62-94cf-ea4b2039d77b" callsign="Route 1 SP" type="b-m-p-w" point="39.739824,-108.6214369,2294.137" remarks="" relation="c"/>
    <link uid="d54f26ac-45b1-4403-b917-ac22759ce51f" callsign="" type="b-m-p-c" point="39.8844583,-107.8598727,2558.013" remarks="" relation="c"/>
    <link uid="ba83a98b-686f-45ca-84c6-bf24b0760b4b" callsign="" type="b-m-p-c" point="39.9832506,-107.0896848,3226.394" remarks="" relation="c"/>
    <link uid="ab476fe0-7ac7-4a2a-9b2b-2c02b2a39ef2" callsign="" type="b-m-p-c" point="40.1245883,-107.4795999,2660.115" remarks="" relation="c"/>
    <link uid="949e8175-fcb0-41c8-9547-de768f35d04b" callsign="" type="b-m-p-c" point="40.40795,-107.391659,2215.23" remarks="" relation="c"/>
    <link uid="88c972aa-37ae-441e-b947-3c414a105d05" callsign="CP1" type="b-m-p-w" point="40.4424526,-106.8073534,2069.87" remarks="" relation="c"/>
    <link uid="f68bab28-174d-48ba-93e4-d44df043bb2c" callsign="CP2" type="b-m-p-w" point="40.4201162,-106.3445289,2972.233" remarks="" relation="c"/>
    <link uid="06580726-6036-4fa7-bc65-2557aa3cd119" callsign="" type="b-m-p-c" point="40.5270864,-106.0568542,2787.202" remarks="" relation="c"/>
    <link uid="6ce419f7-3c0b-40f2-af48-abbc37f95b7d" callsign="" type="b-m-p-c" point="40.676681,-106.0420281,2507.621" remarks="" relation="c"/>
    <link uid="0d245fd5-7381-45a0-9a67-3d814d0f11b0" callsign="TGT" type="b-m-p-w" point="40.8199031,-106.12258,2629.467" remarks="" relation="c"/>
    <link_attr planningmethod="Infil" color="-65536" method="Walking" prefix="CP" style="0" type="On Foot" stroke="6" direction="Infil" routetype="Primary" order="Ascending Check Points"/>
    <strokeColor value="-65536"/>
    <strokeWeight value="6.24"/>
    <strokeStyle value="solid"/>
    <remarks/>
    <contact callsign="Route 1"/>
    <archive/>
    <labels_on value="false"/>
    <color value="-65536"/>
    <creator uid="ANDROID-764679f74013dfe2" callsign="COTAK ADMIN Ingalls" time="2025-06-25T23:47:38.493Z" type="a-f-G-E-V-C"/>
    <__routeinfo>
      <__navcues>
        <__navcue voice="Danger" id="0d245fd5-7381-45a0-9a67-3d814d0f11b0" text="Danger">
          <trigger mode="d" value="70"/>
        </__navcue>
        <__navcue voice="Stop" id="88c972aa-37ae-441e-b947-3c414a105d05" text="Stop">
          <trigger mode="d" value="70"/>
        </__navcue>
        <__navcue voice="Stay Right" id="b21452d6-e790-4e62-94cf-ea4b2039d77b" text="Stay Right">
          <trigger mode="d" value="70"/>
        </__navcue>
        <__navcue voice="Speed Up" id="f68bab28-174d-48ba-93e4-d44df043bb2c" text="Speed Up">
          <trigger mode="d" value="70"/>
        </__navcue>
      </__navcues>
    </__routeinfo>
  </detail>
</event>
    `)

    new Route(cot);

    t.end();
});
