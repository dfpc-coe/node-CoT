import test from 'tape';
import { CoTParser } from '../index.js';

test('Parse b-m-p-s-m (Spotted)', async (t) => {
    const cot = CoTParser.from_xml(`
        <event version='2.0' uid='9405e320-9356-41c4-8449-f46990aa17f8' type='b-m-p-s-m' time='2020-12-16T19:59:34.913Z' start='2020-12-16T19:59:34.913Z' stale='2021-01-02T20:40:03.841Z' how='h-g-i-g-o'>
            <point lat='38.85606343062312' lon='-77.0563755018233' hae='9999999.0' ce='9999999.0' le='9999999.0' />
            <detail>
                <status readiness='true'/>
                <archive/>
                <link uid='ANDROID-589520ccfcd20f01' production_time='2020-12-16T19:51:09.603Z' type='a-f-G-U-C' parent_callsign='HOPE' relation='p-p'/>
                <contact callsign='R 1'/>
                <remarks></remarks>
                <archive/>
                <color argb='-65536'/>
                <precisionlocation altsrc='???'/>
                <usericon iconsetpath='COT_MAPPING_SPOTMAP/b-m-p-s-m/-65536'/>
            </detail>
        </event>
    `);

    t.deepEquals(await CoTParser.to_geojson(cot), {
        id: '9405e320-9356-41c4-8449-f46990aa17f8',
        type: 'Feature',
        path: '/',
        properties: {
            callsign: 'R 1',
            center: [ -77.0563755018233, 38.85606343062312, 9999999 ],
            type: 'b-m-p-s-m',
            how: 'h-g-i-g-o',
            time: '2020-12-16T19:59:34.913Z',
            start: '2020-12-16T19:59:34.913Z',
            stale: '2021-01-02T20:40:03.841Z',
            links: [{
                uid: 'ANDROID-589520ccfcd20f01',
                production_time: '2020-12-16T19:51:09.603Z',
                type: 'a-f-G-U-C',
                parent_callsign: 'HOPE',
                relation: 'p-p'
            }],
            archived: true,
            status: { readiness: 'true' },
            precisionlocation: { altsrc: '???' },
            'marker-color': '#FF0000',
            'marker-opacity': 1,
            metadata: {}
        },
        geometry: {
            type: 'Point',
            coordinates: [ -77.0563755018233, 38.85606343062312, 9999999 ]
        },
    });

    t.end();
});

test('Parse b-m-p-s-m (Spotted)', async (t) => {
    const cot = CoTParser.from_xml(`
        <event version='2.0' uid='a7b52383-85be-42a1-a672-c32696029ff9' type='b-m-p-s-m' time='2026-02-03T19:54:05.000Z' start='2026-02-03T19:54:05.000Z' stale='2027-02-03T19:54:05.000Z' how='h-g-i-g-o' access='Undefined'>
            <point lat='37.4' lon='-121.9' hae='-29.1' ce='9999999.0' le='9999999.0' />
            <detail>
                <status readiness='true'/>
                <archive/>
                <contact callsign='O/Z Entry'/>
                <remarks></remarks>
                <precisionlocation altsrc='SRTM1'/>
                <usericon iconsetpath='COT_MAPPING_SPOTMAP/b-m-p-s-m/-65536'/>
                <archive/>
                <link uid='ANDROID-7e34c3dd00737f90' production_time='2026-02-03T04:40:23.566Z' type='a-f-G-U-C' parent_callsign='NG-CA_95CST_OPSNCO_Kem' relation='p-p'/>
                <color argb='-65536'/>
                <uid alertable='true'/>
            </detail>
        </event>
    `);

    t.deepEquals(await CoTParser.to_geojson(cot), {
        id: 'a7b52383-85be-42a1-a672-c32696029ff9',
        type: 'Feature',
        path: '/',
        properties: {
            callsign: 'O/Z Entry',
            center: [ -121.9, 37.4, -29.1 ],
            type: 'b-m-p-s-m',
            how: 'h-g-i-g-o',
            time: '2026-02-03T19:54:05.000Z',
            start: '2026-02-03T19:54:05.000Z',
            stale: '2027-02-03T19:54:05.000Z',
            links: [{
                uid: 'ANDROID-7e34c3dd00737f90',
                production_time: '2026-02-03T04:40:23.566Z',
                type: 'a-f-G-U-C',
                parent_callsign: 'NG-CA_95CST_OPSNCO_Kem',
                relation: 'p-p'
            }],
            archived: true,
            status: { readiness: 'true' },
            precisionlocation: { altsrc: 'SRTM1' },
            'marker-color': '#FF0000',
            'marker-opacity': 1,
            metadata: {}
        },
        geometry: {
            type: 'Point',
            coordinates: [ -121.9, 37.4, -29.1 ]
        },
    });

    t.end();
});
