import assert from 'node:assert/strict';
import test from 'node:test';
import { CoTParser } from '../index.js';

test('await CoTParser.from_xml - Invalid', async () => {
    try {
        await CoTParser.from_xml('<not-cot-xml test="1"/>');
        assert.fail('Shoult not parse invalid CoT XML');
    } catch (err) {
        assert.ok(String(err).includes('Cannot read properties of undefined'));
    }
});

test('await CoTParser.from_xml - Case-insensitive boolean attributes', async () => {
    const cot = await CoTParser.from_xml(`
<event version="2.0" uid="case-insensitive-bool" type="u-d-f" time="2026-03-26T00:00:00Z" start="2026-03-26T00:00:00Z" stale="2026-03-27T00:00:00Z" how="h-g-i-g-o">
  <point lat="0" lon="0" hae="0" ce="9999999.0" le="9999999.0"/>
  <detail>
    <contact callsign="Test"/>
    <labels_on value="False"/>
  </detail>
</event>`);

    assert.equal(cot.raw.event.detail?.labels_on?._attributes?.value, false, 'boolean attributes are normalized before validation');

    const feature = await CoTParser.to_geojson(cot);
    assert.equal(feature.properties.labels, false, 'normalized boolean attributes remain booleans in GeoJSON output');
});
