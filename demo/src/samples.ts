export const SAMPLE_XML = `<event version="2.0" uid="peer-ca436e556558" type="a-f-G" how="m-g" time="2026-11-18T20:18:55.692Z" start="2026-11-18T20:18:55.692Z" stale="2026-11-18T20:19:59.502Z">
    <point lat="38.8586426" lon="-77.0535135" hae="9999999" ce="9999999" le="9999999"/>
    <detail>
        <contact callsign="ca436e556558"/>
        <archive/>
        <emergency type="false"/>
        <usericon iconsetpath="f8f7f666-8b28-4b57-9fbb-e48e61d33b79/Iron Sites/Fire Incident.png"/>
        <remarks>Position received</remarks>
    </detail>
</event>`;

export const SAMPLE_INVALID_XML = `<event version="2.0" uid="invalid-example" type="a-f-G" how="m-g" time="2026-11-18T20:18:55.692Z" start="2026-11-18T20:18:55.692Z">
    <point lat="38.8586426" lon="-77.0535135" hae="0" ce="0"/>
    <detail>
        <contact/>
        <emergency cancel="maybe"/>
    </detail>
</event>`;

export const SAMPLE_GEOJSON = JSON.stringify({
    id: 'example-point',
    type: 'Feature',
    properties: {
        callsign: 'Example Point',
        type: 'a-f-G',
        how: 'm-g',
        remarks: 'Dropped from the node-cot validator',
        'marker-color': '#FFB300'
    },
    geometry: {
        type: 'Point',
        coordinates: [-108.547391, 38.514441]
    }
}, null, 4);
