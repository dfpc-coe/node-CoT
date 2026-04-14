import assert from 'node:assert/strict';
import test from 'node:test';
import { CoTParser } from '../index.js';

test('COT Emergency - Troops in Contact', async () => {
    const cot = await CoTParser.from_geojson({
        id: '6da80127-44d4-4bf0-89bd-ecd326afaef1',
        type: 'Feature',
        properties: {
            callsign: 'Example Emergency',
            type: 'b-a-o-opn',
            how: 'm-g'
        },
        geometry: {
            type: 'Point',
            coordinates: [ -108.547391197293, 38.5144413169673 ]
        }
    })

    if (!cot.raw.event.detail) {
        assert.fail('No Detail Section')
    } else {
        assert.ok(cot.raw.event.detail['_flow-tags_']);
        delete cot.raw.event.detail['_flow-tags_'];

        assert.deepEqual(cot.type(), 'b-a-o-opn', 'Type should be b-a-o-opn');

        assert.deepEqual(cot.raw.event.detail.emergency, {
            _attributes: { type: 'Troops In Contact' },
            _text: 'Example Emergency'
        }, 'Detail should match expected values');
    }
});

test('COT Emergency - Troops in Contact - No Callsign', async () => {
    const cot = await CoTParser.from_geojson({
        id: '6da80127-44d4-4bf0-89bd-ecd326afaef1',
        type: 'Feature',
        properties: {
            type: 'b-a-o-opn',
            how: 'm-g'
        },
        geometry: {
            type: 'Point',
            coordinates: [ -108.547391197293, 38.5144413169673 ]
        }
    })

    if (!cot.raw.event.detail) {
        assert.fail('No Detail Section')
    } else {
        assert.ok(cot.raw.event.detail['_flow-tags_']);
        delete cot.raw.event.detail['_flow-tags_'];

        assert.deepEqual(cot.type(), 'b-a-o-opn', 'Type should be b-a-o-opn');

        assert.deepEqual(cot.raw.event.detail.emergency, {
            _attributes: { type: 'Troops In Contact' },
            _text: 'UNKNOWN'
        }, 'Detail should match expected values');
    }
});

test('COT Emergency - 911 Alert', async () => {
    const cot = await CoTParser.from_geojson({
        id: '6da80127-44d4-4bf0-89bd-ecd326afaef1',
        type: 'Feature',
        properties: {
            callsign: 'Example Emergency',
            type: 'b-a-o-tbl',
            how: 'm-g'
        },
        geometry: {
            type: 'Point',
            coordinates: [ -108.547391197293, 38.5144413169673 ]
        }
    })

    if (!cot.raw.event.detail) {
        assert.fail('No Detail Section')
    } else {
        assert.ok(cot.raw.event.detail['_flow-tags_']);
        delete cot.raw.event.detail['_flow-tags_'];

        assert.deepEqual(cot.type(), 'b-a-o-tbl', 'Type should be b-a-o-tbl');

        assert.deepEqual(cot.raw.event.detail.emergency, {
            _attributes: { type: '911 Alert' },
            _text: 'Example Emergency'
        }, 'Detail should match expected values');
    }
});

test('COT Emergency - 911 Alert - No Callsign', async () => {
    const cot = await CoTParser.from_geojson({
        id: '6da80127-44d4-4bf0-89bd-ecd326afaef1',
        type: 'Feature',
        properties: {
            type: 'b-a-o-tbl',
            how: 'm-g'
        },
        geometry: {
            type: 'Point',
            coordinates: [ -108.547391197293, 38.5144413169673 ]
        }
    })

    if (!cot.raw.event.detail) {
        assert.fail('No Detail Section')
    } else {
        assert.ok(cot.raw.event.detail['_flow-tags_']);
        delete cot.raw.event.detail['_flow-tags_'];

        assert.deepEqual(cot.type(), 'b-a-o-tbl', 'Type should be b-a-o-tbl');

        assert.deepEqual(cot.raw.event.detail.emergency, {
            _attributes: { type: '911 Alert' },
            _text: 'UNKNOWN'
        }, 'Detail should match expected values');
    }
});

test('COT Emergency - Cancel', async () => {
    const cot = await CoTParser.from_geojson({
        id: '6da80127-44d4-4bf0-89bd-ecd326afaef1',
        type: 'Feature',
        properties: {
            callsign: 'Example Emergency',
            type: 'b-a-o-can',
            how: 'm-g'
        },
        geometry: {
            type: 'Point',
            coordinates: [ -108.547391197293, 38.5144413169673 ]
        }
    })

    if (!cot.raw.event.detail) {
        assert.fail('No Detail Section')
    } else {
        assert.ok(cot.raw.event.detail['_flow-tags_']);
        delete cot.raw.event.detail['_flow-tags_'];

        assert.deepEqual(cot.type(), 'b-a-o-can', 'Type should be b-a-o-can');

        assert.deepEqual(cot.raw.event.detail.emergency, {
            _attributes: { cancel: true },
            _text: 'Example Emergency'
        }, 'Detail should match expected values');
    }
});

test('COT Emergency - Cancel - No Callsign', async () => {
    const cot = await CoTParser.from_geojson({
        id: '6da80127-44d4-4bf0-89bd-ecd326afaef1',
        type: 'Feature',
        properties: {
            type: 'b-a-o-can',
            how: 'm-g'
        },
        geometry: {
            type: 'Point',
            coordinates: [ -108.547391197293, 38.5144413169673 ]
        }
    })

    if (!cot.raw.event.detail) {
        assert.fail('No Detail Section')
    } else {
        assert.ok(cot.raw.event.detail['_flow-tags_']);
        delete cot.raw.event.detail['_flow-tags_'];

        assert.deepEqual(cot.type(), 'b-a-o-can', 'Type should be b-a-o-can');

        assert.deepEqual(cot.raw.event.detail.emergency, {
            _attributes: { cancel: true },
            _text: 'UNKNOWN'
        }, 'Detail should match expected values');
    }
});

test('COT Emergency - Ring The Bell', async () => {
    const cot = await CoTParser.from_geojson({
        id: '6da80127-44d4-4bf0-89bd-ecd326afaef1',
        type: 'Feature',
        properties: {
            callsign: 'Example Emergency',
            type: 'b-a-o-pan',
            how: 'm-g'
        },
        geometry: {
            type: 'Point',
            coordinates: [ -108.547391197293, 38.5144413169673 ]
        }
    })

    if (!cot.raw.event.detail) {
        assert.fail('No Detail Section')
    } else {
        assert.ok(cot.raw.event.detail['_flow-tags_']);
        delete cot.raw.event.detail['_flow-tags_'];

        assert.deepEqual(cot.type(), 'b-a-o-pan', 'Type should be b-a-o-pan');

        assert.deepEqual(cot.raw.event.detail.emergency, {
            _attributes: { type: 'Ring The Bell' },
            _text: 'Example Emergency'
        }, 'Detail should match expected values');
    }
});

test('COT Emergency - Ring The Bell - No Callsign', async () => {
    const cot = await CoTParser.from_geojson({
        id: '6da80127-44d4-4bf0-89bd-ecd326afaef1',
        type: 'Feature',
        properties: {
            type: 'b-a-o-pan',
            how: 'm-g'
        },
        geometry: {
            type: 'Point',
            coordinates: [ -108.547391197293, 38.5144413169673 ]
        }
    })

    if (!cot.raw.event.detail) {
        assert.fail('No Detail Section')
    } else {
        assert.ok(cot.raw.event.detail['_flow-tags_']);
        delete cot.raw.event.detail['_flow-tags_'];

        assert.deepEqual(cot.type(), 'b-a-o-pan', 'Type should be b-a-o-pan');

        assert.deepEqual(cot.raw.event.detail.emergency, {
            _attributes: { type: 'Ring The Bell' },
            _text: 'UNKNOWN'
        }, 'Detail should match expected values');
    }
});

test('COT Emergency - GeoFence Breached', async () => {
    const cot = await CoTParser.from_geojson({
        id: '6da80127-44d4-4bf0-89bd-ecd326afaef1',
        type: 'Feature',
        properties: {
            callsign: 'Example Emergency',
            type: 'b-a-g',
            how: 'm-g'
        },
        geometry: {
            type: 'Point',
            coordinates: [ -108.547391197293, 38.5144413169673 ]
        }
    })

    if (!cot.raw.event.detail) {
        assert.fail('No Detail Section')
    } else {
        assert.ok(cot.raw.event.detail['_flow-tags_']);
        delete cot.raw.event.detail['_flow-tags_'];

        assert.deepEqual(cot.type(), 'b-a-g', 'Type should be b-a-g');

        assert.deepEqual(cot.raw.event.detail.emergency, {
            _attributes: { type: 'Geo-fence Breached' },
            _text: 'Example Emergency'
        }, 'Detail should match expected values');
    }
});

test('COT Emergency - GeoFence Breached - No Callsign', async () => {
    const cot = await CoTParser.from_geojson({
        id: '6da80127-44d4-4bf0-89bd-ecd326afaef1',
        type: 'Feature',
        properties: {
            type: 'b-a-g',
            how: 'm-g'
        },
        geometry: {
            type: 'Point',
            coordinates: [ -108.547391197293, 38.5144413169673 ]
        }
    })

    if (!cot.raw.event.detail) {
        assert.fail('No Detail Section')
    } else {
        assert.ok(cot.raw.event.detail['_flow-tags_']);
        delete cot.raw.event.detail['_flow-tags_'];

    assert.deepEqual(cot.type(), 'b-a-g', 'Type should be b-a-g');

        assert.deepEqual(cot.raw.event.detail.emergency, {
            _attributes: { type: 'Geo-fence Breached' },
            _text: 'UNKNOWN'
        }, 'Detail should match expected values');
    }
});

test('COT Emergency - WearOS', async () => {
    const cot = await CoTParser.from_xml(`
         <event version='2.0' uid='17eaa1c4-e137-4328-b5e4-294d2a7fd01d' type='b-a-o' time='2026-02-04T13:40:15.895Z' start='2026-02-04T13:40:15.895Z' stale='2026-02-04T13:55:15.895Z' how='h-e' access='Undefined'>
             <point lat='41.8838397' lon='-87.6590334' hae='155.50001525878906' ce='17.75' le='0.9278001' />
             <detail>
                 <link uid='WEAROS_dce34c83708172e9' type='a-f-G-U-C' relation='p-p'/>
                 <contact callsign='SP-Dev&#10;Manual Alert: Gunshot'/>
                 <emergency type='Manual Alert: Gunshot'>SP-Dev</emergency>
                 <usericon iconsetpath='911 Alert'/>
                 <color argb='-1'/>
             </detail>
         </event>
    `)

    assert.deepEqual(await CoTParser.to_geojson(cot), {
        id: '17eaa1c4-e137-4328-b5e4-294d2a7fd01d',
        type: 'Feature',
        path: '/',
        properties: {
            callsign: 'SP-Dev\nManual Alert: Gunshot',
            center: [ -87.6590334, 41.8838397, 155.50001525878906 ],
            type: 'b-a-o',
            how: 'h-e',
            time: '2026-02-04T13:40:15.895Z',
            start: '2026-02-04T13:40:15.895Z',
            stale: '2026-02-04T13:55:15.895Z',
            links: [ { uid: 'WEAROS_dce34c83708172e9', type: 'a-f-G-U-C', relation: 'p-p' } ],
            icon: '911 Alert',
            'marker-color': '#FFFFFF',
            'marker-opacity': 1,
            metadata: {}
        },
        geometry: {
            type: 'Point',
            coordinates: [ -87.6590334, 41.8838397, 155.50001525878906 ]
        },
    });
});
