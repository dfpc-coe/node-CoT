import test from 'tape';
import { CoTParser } from '../index.js';

test('COT Emergency - Troops in Contact', (t) => {
    const cot = CoTParser.from_geojson({
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
        t.fail('No Detail Section')
    } else {
        t.ok(cot.raw.event.detail['_flow-tags_']);
        delete cot.raw.event.detail['_flow-tags_'];

        t.deepEquals(cot.type(), 'b-a-o-opn', 'Type should be b-a-o-opn');

        t.deepEquals(cot.raw.event.detail.emergency, {
            _attributes: { type: 'Troops In Contact' },
            _text: 'Example Emergency'
        }, 'Detail should match expected values');
    }

    t.end();
});

test('COT Emergency - Troops in Contact - No Callsign', (t) => {
    const cot = CoTParser.from_geojson({
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
        t.fail('No Detail Section')
    } else {
        t.ok(cot.raw.event.detail['_flow-tags_']);
        delete cot.raw.event.detail['_flow-tags_'];

        t.deepEquals(cot.type(), 'b-a-o-opn', 'Type should be b-a-o-opn');

        t.deepEquals(cot.raw.event.detail.emergency, {
            _attributes: { type: 'Troops In Contact' },
            _text: 'UNKNOWN'
        }, 'Detail should match expected values');
    }

    t.end();
});

test('COT Emergency - 911 Alert', (t) => {
    const cot = CoTParser.from_geojson({
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
        t.fail('No Detail Section')
    } else {
        t.ok(cot.raw.event.detail['_flow-tags_']);
        delete cot.raw.event.detail['_flow-tags_'];

        t.deepEquals(cot.type(), 'b-a-o-tbl', 'Type should be b-a-o-tbl');

        t.deepEquals(cot.raw.event.detail.emergency, {
            _attributes: { type: '911 Alert' },
            _text: 'Example Emergency'
        }, 'Detail should match expected values');
    }

    t.end();
});

test('COT Emergency - 911 Alert - No Callsign', (t) => {
    const cot = CoTParser.from_geojson({
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
        t.fail('No Detail Section')
    } else {
        t.ok(cot.raw.event.detail['_flow-tags_']);
        delete cot.raw.event.detail['_flow-tags_'];

        t.deepEquals(cot.type(), 'b-a-o-tbl', 'Type should be b-a-o-tbl');

        t.deepEquals(cot.raw.event.detail.emergency, {
            _attributes: { type: '911 Alert' },
            _text: 'UNKNOWN'
        }, 'Detail should match expected values');
    }

    t.end();
});

test('COT Emergency - Cancel', (t) => {
    const cot = CoTParser.from_geojson({
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
        t.fail('No Detail Section')
    } else {
        t.ok(cot.raw.event.detail['_flow-tags_']);
        delete cot.raw.event.detail['_flow-tags_'];

        t.deepEquals(cot.type(), 'b-a-o-can', 'Type should be b-a-o-can');

        t.deepEquals(cot.raw.event.detail.emergency, {
            _attributes: { cancel: true },
            _text: 'Example Emergency'
        }, 'Detail should match expected values');
    }

    t.end();
});

test('COT Emergency - Cancel - No Callsign', (t) => {
    const cot = CoTParser.from_geojson({
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
        t.fail('No Detail Section')
    } else {
        t.ok(cot.raw.event.detail['_flow-tags_']);
        delete cot.raw.event.detail['_flow-tags_'];

        t.deepEquals(cot.type(), 'b-a-o-can', 'Type should be b-a-o-can');

        t.deepEquals(cot.raw.event.detail.emergency, {
            _attributes: { cancel: true },
            _text: 'UNKNOWN'
        }, 'Detail should match expected values');
    }

    t.end();
});

test('COT Emergency - Ring The Bell', (t) => {
    const cot = CoTParser.from_geojson({
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
        t.fail('No Detail Section')
    } else {
        t.ok(cot.raw.event.detail['_flow-tags_']);
        delete cot.raw.event.detail['_flow-tags_'];

        t.deepEquals(cot.type(), 'b-a-o-pan', 'Type should be b-a-o-pan');

        t.deepEquals(cot.raw.event.detail.emergency, {
            _attributes: { type: 'Ring The Bell' },
            _text: 'Example Emergency'
        }, 'Detail should match expected values');
    }

    t.end();
});

test('COT Emergency - Ring The Bell - No Callsign', (t) => {
    const cot = CoTParser.from_geojson({
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
        t.fail('No Detail Section')
    } else {
        t.ok(cot.raw.event.detail['_flow-tags_']);
        delete cot.raw.event.detail['_flow-tags_'];

        t.deepEquals(cot.type(), 'b-a-o-pan', 'Type should be b-a-o-pan');

        t.deepEquals(cot.raw.event.detail.emergency, {
            _attributes: { type: 'Ring The Bell' },
            _text: 'UNKNOWN'
        }, 'Detail should match expected values');
    }

    t.end();
});
