import assert from 'node:assert/strict';
import test from 'node:test';
import { CoTParser } from '../index.js';

test('Link: CloudTAK Core Entity parent links round trip through GeoJSON', async () => {
    const links = [{
        relation: 'p',
        type: 'core-event',
        event: '0ed16b9e-a0c8-480f-8860-284b9afb2b1d',
        url: 'https://example.com/event/0ed16b9e-a0c8-480f-8860-284b9afb2b1d',
        remarks: 'Event Name',
    }, {
        relation: 'p',
        type: 'core-device',
        device: '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d',
        url: 'https://example.com/device/9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d',
        remarks: 'Device Name',
    }];

    const cot = await CoTParser.from_geojson({
        id: '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d',
        type: 'Feature',
        properties: {
            type: 'a-f-G',
            how: 'm-g',
            callsign: 'Device Name',
            links,
        },
        geometry: {
            type: 'Point',
            coordinates: [-104.6282182, 38.2089117]
        }
    });

    assert.deepEqual(cot.raw.event.detail?.link, links.map((link) => ({ _attributes: link })));

    const feat = await CoTParser.to_geojson(cot);

    assert.deepEqual(feat.properties.links, links);
});
