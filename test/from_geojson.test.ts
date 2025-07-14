import test from 'tape';
import { CoTParser } from '../index.js';

test('CoTParser.from_geojson - Point', async (t) => {
    const geo = await CoTParser.from_geojson({
        type: 'Feature',
        properties: {},
        geometry: {
            type: 'Point',
            coordinates: [1.1, 2.2]
        }
    });

    t.equals(geo.raw.event._attributes.version, '2.0');
    t.equals(geo.raw.event._attributes.type, 'a-f-G');
    t.equals(geo.raw.event._attributes.how, 'm-g');
    t.equals(geo.raw.event._attributes.uid.length, 36);
    t.equals(geo.raw.event._attributes.time.length, 24);
    t.equals(geo.raw.event._attributes.start.length, 24);
    t.equals(geo.raw.event._attributes.stale.length, 24);

    t.deepEquals(geo.raw.event.point, {
        _attributes: { lat: 2.2, lon: 1.1, hae: 0.0, ce: 9999999.0, le: 9999999.0 }
    });

    if (!geo.raw.event.detail || !geo.raw.event.detail.remarks) {
        t.fail('No Detail Section')
    } else {
        t.ok(geo.raw.event.detail['_flow-tags_']);
        delete geo.raw.event.detail['_flow-tags_'];

        t.deepEquals(geo.raw.event.detail, {
            contact: { _attributes: { callsign: 'UNKNOWN' } },
            remarks: { _attributes: {}, _text: '' }
        });
    }

    t.end();
});

test('CoTParser.from_geojson - Polygon', async (t) => {
    const geo = await CoTParser.from_geojson({
        type: 'Feature',
        properties: {},
        geometry: {
            type: 'Polygon',
            coordinates: [[
                [-108.587, 39.098],
                [-108.587, 39.032],
                [-108.505, 39.032],
                [-108.505, 39.098],
                [-108.587, 39.098]
            ]]
        }
    });

    t.equals(geo.raw.event._attributes.version, '2.0');
    t.equals(geo.raw.event._attributes.type, 'u-d-f');
    t.equals(geo.raw.event._attributes.how, 'm-g');
    t.equals(geo.raw.event._attributes.uid.length, 36);
    t.equals(geo.raw.event._attributes.time.length, 24);
    t.equals(geo.raw.event._attributes.start.length, 24);
    t.equals(geo.raw.event._attributes.stale.length, 24);

    t.deepEquals(geo.raw.event.point, {
        _attributes: { lat: 39.065, lon: -108.54599999999999, hae: 0.0, ce: 9999999.0, le: 9999999.0 }
    });

    if (!geo.raw.event.detail || !geo.raw.event.detail.remarks) {
        t.fail('No Detail Section')
    } else {
        t.ok(geo.raw.event.detail['_flow-tags_']);
        delete geo.raw.event.detail['_flow-tags_'];

        t.deepEquals(geo.raw.event.detail, {
            contact: { _attributes: { callsign: 'UNKNOWN' } },
            link: [
                { _attributes: { point: '39.098,-108.587' } },
                { _attributes: { point: '39.032,-108.587' } },
                { _attributes: { point: '39.032,-108.505' } },
                { _attributes: { point: '39.098,-108.505' } },
                { _attributes: { point: '39.098,-108.587' } },
            ],
            labels_on: { _attributes: { value: false } },
            tog: { _attributes: { enabled: '0' } },
            strokeColor: { _attributes: { value: -2130706688 } },
            strokeWeight: { _attributes: { value: 3 } },
            strokeStyle: { _attributes: { value: 'solid' } },
            fillColor: { _attributes: { value: -2130706688 } },
            remarks: { _attributes: {}, _text: '' }
        });
    }

    t.end();
});

test('CoTParser.from_geojson - LineString', async (t) => {
    const geo = await CoTParser.from_geojson({
        type: 'Feature',
        properties: {},
        geometry: {
            type: 'LineString',
            coordinates: [
                [-108.587, 39.098],
                [-108.587, 39.032],
                [-108.505, 39.032],
                [-108.505, 39.098],
                [-108.587, 39.098]
            ]
        }
    });

    t.equals(geo.raw.event._attributes.version, '2.0');
    t.equals(geo.raw.event._attributes.type, 'u-d-f');
    t.equals(geo.raw.event._attributes.how, 'm-g');
    t.equals(geo.raw.event._attributes.uid.length, 36);
    t.equals(geo.raw.event._attributes.time.length, 24);
    t.equals(geo.raw.event._attributes.start.length, 24);
    t.equals(geo.raw.event._attributes.stale.length, 24);

    t.deepEquals(geo.raw.event.point, {
        _attributes: { lat: 39.098, lon: -108.505, hae: 0.0, ce: 9999999.0, le: 9999999.0 }
    });

    if (!geo.raw.event.detail || !geo.raw.event.detail.remarks) {
        t.fail('No Detail Section')
    } else {
        t.ok(geo.raw.event.detail['_flow-tags_']);
        delete geo.raw.event.detail['_flow-tags_'];

        t.deepEquals(geo.raw.event.detail, {
            contact: { _attributes: { callsign: 'UNKNOWN' } },
            link: [
                { _attributes: { point: '39.098,-108.587' } },
                { _attributes: { point: '39.032,-108.587' } },
                { _attributes: { point: '39.032,-108.505' } },
                { _attributes: { point: '39.098,-108.505' } },
                { _attributes: { point: '39.098,-108.587' } }
            ],
            labels_on: { _attributes: { value: false } },
            tog: { _attributes: { enabled: '0' } },
            strokeColor: { _attributes: { value: -2130706688 } },
            strokeWeight: { _attributes: { value: 3 } },
            strokeStyle: { _attributes: { value: 'solid' } },
            remarks: { _attributes: {}, _text: '' }
        });
    }

    t.end();
});

test('CoTParser.from_geojson - Start', async (t) => {
    const geo = await CoTParser.from_geojson({
        type: 'Feature',
        properties: {
            // 1hr in the future
            start: new Date(+new Date() + 60 * 60 * 1000).toISOString()
        },
        geometry: {
            type: 'Point',
            coordinates: [1.1, 2.2]
        }
    });

    // Approx +/- 100ms + 1hr ahead of Now
    t.ok(+new Date(geo.raw.event._attributes.start) > +new Date() + 60 * 60 * 1000 - 100);
    t.ok(+new Date(geo.raw.event._attributes.start) < +new Date() + 60 * 60 * 1000 + 100);

    // Approx +/- 100ms ahead of Now
    t.ok(+new Date(geo.raw.event._attributes.time) > +new Date() - 100);
    t.ok(+new Date(geo.raw.event._attributes.time) < +new Date() + 100);

    // Approx +/- 100ms +1hr20s ahead of now
    t.ok(+new Date(geo.raw.event._attributes.stale) > +new Date(geo.raw.event._attributes.time) - 100 + 20 * 1000);
    t.ok(+new Date(geo.raw.event._attributes.stale) < +new Date(geo.raw.event._attributes.start) + 100 + 20 * 1000);

    t.end();
});

test('CoTParser.from_geojson - Start/Stale', async (t) => {
    const geo = await CoTParser.from_geojson({
        type: 'Feature',
        properties: {
            // 1hr in the future
            start: new Date(+new Date() + 60 * 60 * 1000).toISOString(),
            stale: 60 * 1000
        },
        geometry: {
            type: 'Point',
            coordinates: [1.1, 2.2]
        }
    });

    // Approx +/- 100ms + 1hr ahead of Now
    t.ok(+new Date(geo.raw.event._attributes.start) > +new Date() + 60 * 60 * 1000 - 100);
    t.ok(+new Date(geo.raw.event._attributes.start) < +new Date() + 60 * 60 * 1000 + 100);

    // Approx +/- 100ms ahead of Now
    t.ok(+new Date(geo.raw.event._attributes.time) > +new Date() - 100);
    t.ok(+new Date(geo.raw.event._attributes.time) < +new Date() + 100);

    // Approx +/- 100ms +1hr60s ahead of now
    t.ok(+new Date(geo.raw.event._attributes.stale) > +new Date(geo.raw.event._attributes.time) - 100 + 60 * 1000);
    t.ok(+new Date(geo.raw.event._attributes.stale) < +new Date(geo.raw.event._attributes.start) + 100 + 60 * 1000);

    t.end();
});

test('CoTParser.from_geojson - Icon', async (t) => {
    const geo = await CoTParser.from_geojson({
        type: 'Feature',
        properties: {
            icon: '66f14976-4b62-4023-8edb-d8d2ebeaa336/Public Safety Air/EMS_ROTOR.png'
        },
        geometry: {
            type: 'Point',
            coordinates: [1.1, 2.2]
        }
    });

    if (!geo.raw.event.detail || !geo.raw.event.detail.remarks) {
        t.fail('No Detail Section')
    } else {
        t.ok(geo.raw.event.detail['_flow-tags_']);
        delete geo.raw.event.detail['_flow-tags_'];

        t.deepEquals(geo.raw.event.detail, {
            contact: { _attributes: { callsign: 'UNKNOWN' } },
            usericon: { _attributes: { iconsetpath: '66f14976-4b62-4023-8edb-d8d2ebeaa336/Public Safety Air/EMS_ROTOR.png' } }, remarks: { _attributes: {}, _text: '' }
        });
    }

    t.end();
});

test('CoTParser.from_geojson - Height Above Earth', async (t) => {
    t.deepEquals((await CoTParser.from_geojson({
        type: 'Feature',
        properties: {
        },
        geometry: {
            type: 'Point',
            coordinates: [1.1, 2.2]
        }
    })).raw.event.point._attributes, {
        lat: 2.2,
        lon: 1.1,
        hae: 0.0,
        ce: 9999999.0,
        le: 9999999.0
    }, 'default hae');

    t.deepEquals((await CoTParser.from_geojson({
        type: 'Feature',
        properties: {
        },
        geometry: {
            type: 'Point',
            coordinates: [1.1, 2.2, 101]
        }
    })).raw.event.point._attributes, {
        lat: 2.2,
        lon: 1.1,
        hae: 101,
        ce: 9999999.0,
        le: 9999999.0
    }, 'custom hae (meters)');

    t.end();
});

test('CoTParser.from_geojson - Course & Speed', async (t) => {
    const cot = await CoTParser.from_geojson({
        type: 'Feature',
        properties: {
            course: 260,
            speed: 120
        },
        geometry: {
            type: 'Point',
            coordinates: [1.1, 2.2]
        }
    });

    if (!cot.raw.event.detail || !cot.raw.event.detail.remarks) {
        t.fail('No Detail Section')
    } else {
        t.deepEquals(cot.raw.event.detail.track, {
            _attributes: {
                'course': '260',
                'speed': '120'
            }
        }, 'track');
    }

    t.end();
});

test('CoTParser.from_geojson - Remarks', async (t) => {
    const cot = await CoTParser.from_geojson({
        type: 'Feature',
        properties: {
            course: 260,
            speed: 120,
            remarks: 'Test'
        },
        geometry: {
            type: 'Point',
            coordinates: [1.1, 2.2]
        }
    })

    if (!cot.raw.event.detail || !cot.raw.event.detail.remarks) {
        t.fail('No Detail Section')
    } else {
        t.deepEquals(cot.raw.event.detail.remarks, {
            _attributes: {},
            _text: 'Test'
        }, 'track');
    }

    t.end();
});
