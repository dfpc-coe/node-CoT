import assert from 'node:assert/strict';
import test from 'node:test';
import { CoTParser } from '../index.js';

test('CoTParser.to_xml - callsign with ampersand is escaped in attribute', async () => {
    const cot = await CoTParser.from_geojson({
        id: 'xml-escape-amp',
        type: 'Feature',
        path: '/',
        properties: {
            type: 'a-f-G',
            how: 'm-g',
            callsign: 'Alpha & Bravo',
            center: [1.1, 2.2, 0],
            time: '2023-08-04T15:17:43.649Z',
            start: '2023-08-04T15:17:43.649Z',
            stale: '2023-08-04T15:17:43.649Z',
            metadata: {}
        },
        geometry: { type: 'Point', coordinates: [1.1, 2.2, 0] }
    });

    const xml = CoTParser.to_xml(cot);
    assert.ok(xml.includes('&amp;'), `callsign ampersand must be escaped as &amp; in XML, got: ${xml}`);
    assert.ok(!xml.includes('callsign="Alpha & Bravo"'), 'callsign must not contain a raw & in XML attribute');
});

test('CoTParser.to_xml - callsign with all XML special chars is fully escaped', async () => {
    const cot = await CoTParser.from_geojson({
        id: 'xml-escape-all',
        type: 'Feature',
        path: '/',
        properties: {
            type: 'a-f-G',
            how: 'm-g',
            callsign: 'A & B < C > D " E',
            center: [1.1, 2.2, 0],
            time: '2023-08-04T15:17:43.649Z',
            start: '2023-08-04T15:17:43.649Z',
            stale: '2023-08-04T15:17:43.649Z',
            metadata: {}
        },
        geometry: { type: 'Point', coordinates: [1.1, 2.2, 0] }
    });

    const xml = CoTParser.to_xml(cot);
    assert.ok(xml.includes('&amp;'), 'ampersand must be escaped');
    assert.ok(xml.includes('&lt;'), 'less-than must be escaped');
    assert.ok(xml.includes('&gt;'), 'greater-than must be escaped');
    assert.ok(xml.includes('&quot;'), 'double-quote must be escaped');
});

test('CoTParser.to_xml - remarks with ampersand are escaped in text node', async () => {
    const cot = CoTParser.from_xml(`
        <event version="2.0" uid="xml-escape-remarks" type="a-f-G" how="m-g"
               time="2023-08-04T15:17:43.649Z" start="2023-08-04T15:17:43.649Z"
               stale="2023-08-04T15:17:43.649Z">
            <point lat="2.2" lon="1.1" hae="0" ce="9999999.0" le="9999999.0"/>
            <detail>
                <contact callsign="Test"/>
                <remarks>Heading north &amp; east of the ridge</remarks>
            </detail>
        </event>
    `);

    const xml = CoTParser.to_xml(cot);
    assert.ok(xml.includes('&amp;'), `remarks ampersand must be escaped as &amp; in XML text, got: ${xml}`);
    assert.ok(!xml.match(/>.*Heading north & east/), 'remarks must not contain a raw & in text node');
});

test('CoTParser.to_xml - callsign round-trips correctly through XML with special chars', async () => {
    const original = `<event version="2.0" uid="xml-roundtrip" type="a-f-G" how="m-g" time="2023-08-04T15:17:43.649Z" start="2023-08-04T15:17:43.649Z" stale="2023-08-04T15:17:43.649Z"><point lat="2.2" lon="1.1" hae="0" ce="9999999.0" le="9999999.0"/><detail><contact callsign="Alpha &amp; Bravo"/></detail></event>`;
    const cot = CoTParser.from_xml(original);

    // The parsed in-memory value should be the decoded string
    assert.equal(cot.callsign(), 'Alpha & Bravo');

    // And serializing back should re-encode it
    const xml = CoTParser.to_xml(cot);
    assert.ok(xml.includes('callsign="Alpha &amp; Bravo"'), `callsign must re-encode to &amp; on to_xml, got: ${xml}`);
});

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
