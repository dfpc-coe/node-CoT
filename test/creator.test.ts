import test from 'tape';
import { CoTParser } from '../index.js';

test('Parse Creator', (t) => {
    const cot = CoTParser.from_xml(`
        <event version="2.0" uid="a471cec4-4d18-41b4-a1c5-d79e52b5a678" type="a-n-G" time="2025-04-24T15:23:11.088Z" start="2025-04-24T15:23:11.088Z" stale="2026-04-24T15:23:11.088Z" how="h-g-i-g-o" access="Undefined">
            <point lat="39.0664644" lon="-108.4328957" hae="1402.385" ce="9999999.0" le="9999999.0"/>
            <detail>
                <status readiness="true"/>
                <archive/>
                <usericon iconsetpath="COT_MAPPING_2525C/a-n/a-n-G"/>
                <creator uid="ANDROID-0ca41830e11d2ef3" callsign="DFPC Ingalls Tab" time="2025-04-24T15:09:21.789Z" type="a-f-G-E-V-C"/>
                <remarks/>
                <contact callsign="N.24.090921"/>
                <precisionlocation altsrc="SRTM1"/>
                <link uid="ANDROID-0ca41830e11d2ef3" production_time="2025-04-24T15:09:21.789Z" type="a-f-G-E-V-C" parent_callsign="DFPC Ingalls Tab" relation="p-p"/>
                <archive/>
                <color argb="-1"/>
            </detail>
        </event>
    `);

    t.deepEquals(cot.creator(), {
        uid: 'ANDROID-0ca41830e11d2ef3',
        callsign: 'DFPC Ingalls Tab',
        time: '2025-04-24T15:09:21.789Z',
        type: 'a-f-G-E-V-C'
    });

    t.deepEquals(cot.creator({
        uid: 'ANDROID-123',
        callsign: 'New Creator',
        time: '2023-04-24T15:09:21.789Z',
        type: 'a-f-G'
    }), {
        uid: 'ANDROID-123',
        callsign: 'New Creator',
        time: '2023-04-24T15:09:21.789Z',
        type: 'a-f-G'
    });

    t.deepEquals(cot.creator(), {
        uid: 'ANDROID-123',
        callsign: 'New Creator',
        time: '2023-04-24T15:09:21.789Z',
        type: 'a-f-G'
    });

    t.end();
});

test('Augment Creator', (t) => {
    const cot = CoTParser.from_xml(`
        <event version="2.0" uid="a471cec4-4d18-41b4-a1c5-d79e52b5a678" type="a-n-G" time="2025-04-24T15:23:11.088Z" start="2025-04-24T15:23:11.088Z" stale="2026-04-24T15:23:11.088Z" how="h-g-i-g-o" access="Undefined">
            <point lat="39.0664644" lon="-108.4328957" hae="1402.385" ce="9999999.0" le="9999999.0"/>
            <detail>
                <status readiness="true"/>
                <archive/>
                <__milsym id="SNGX-----------">
                    <unitmodifier code="Z"/>
                    <unitmodifier code="Y"/>
                    <unitmodifier code="T"/>
                    <unitmodifier code="P"/>
                    <unitmodifier code="Q">58</unitmodifier>
                    <unitmodifier code="J"/>
                    <unitmodifier code="H"/>
                    <unitmodifier code="G">test</unitmodifier>
                    <unitmodifier code="AI">true</unitmodifier>
                    <unitmodifier code="AJ">true</unitmodifier>
                    <unitmodifier code="AK">true</unitmodifier>
                    <unitmodifier code="AH">true</unitmodifier>
                </__milsym>
                <usericon iconsetpath="COT_MAPPING_2525C/a-n/a-n-G"/>
                <remarks/>
                <contact callsign="N.24.090921"/>
                <precisionlocation altsrc="SRTM1"/>
                <link uid="ANDROID-0ca41830e11d2ef3" production_time="2025-04-24T15:09:21.789Z" type="a-f-G-E-V-C" parent_callsign="DFPC Ingalls Tab" relation="p-p"/>
                <archive/>
                <color argb="-1"/>
            </detail>
        </event>
    `, {
        creator: {
            uid: 'ANDROID-0ca41830e11d2ef3',
            callsign: 'DFPC Ingalls Tab',
            time: '2025-04-24T15:09:21.789Z',
            type: 'a-f-G-E-V-C'
        }
    });

    t.deepEquals(cot.creator(), {
        uid: 'ANDROID-0ca41830e11d2ef3',
        callsign: 'DFPC Ingalls Tab',
        time: '2025-04-24T15:09:21.789Z',
        type: 'a-f-G-E-V-C'
    });

    t.end();
});
