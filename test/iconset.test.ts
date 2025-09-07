import test from 'tape';
import { CoTParser } from '../index.js';

test('IconSet w/ no Path - TAK Aware', async (t) => {
    const cot = await CoTParser.from_xml(`
         <event stale="2025-09-07T16:38:39Z" how="h-g-i-g-o" version="2.0" time="2025-09-07T16:28:39Z" type="a-U-G" uid="619EB636-8983-4DC3-B402-C8BC7D8DF49F" start="2025-09-07T16:28:39Z"><point lat="39" le="9999999.0" lon="-108" ce="9999999.0" hae="9999999.0"/><detail><contact endpoint="*:-1:stcp" callsign="No Path"/><archive/><remarks/><usericon/><_flow-tags_ TAK-Server-e87a0e02420b44a08f6032bcf1877745="2025-09-07T16:28:39Z"/></detail></event>
    `);
    t.equals(cot.callsign(), 'No Path');
    t.end();
});

