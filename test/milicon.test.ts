import test from 'tape';
import { CoTParser } from '../index.js';

test('MilIcon Augmentation - a-n-G', (t) => {
    const cot = CoTParser.from_xml(`
        <event
            version="2.0"
            type="a-n-G"
            how="h-g-i-g-o"
            uid="a471cec4-4d18-41b4-a1c5-d79e52b5a678"
            time="2025-04-24T15:23:11.088Z"
            start="2025-04-24T15:23:11.088Z"
            stale="2026-04-24T15:23:11.088Z"
            access="Undefined"
        >
            <point lat="39.0664644" lon="-108.4328957" hae="1402.385" ce="9999999.0" le="9999999.0"/>
            <detail></detail>
        </event>
    `, {
        milsym: {
            augment: true
        }
    });

    t.deepEquals(cot.raw.event.detail!.__milicon, {
        _attributes: { id: '12041000000000000000' },
    });

    t.end();
});

// TAK Aware generated uppercase battle dimension, handle this
test('MilIcon Augmentation - a-U-G', (t) => {
    const cot = CoTParser.from_xml(`
        <event
            version="2.0"
            type="a-U-G"
            how="h-g-i-g-o"
            uid="a471cec4-4d18-41b4-a1c5-d79e52b5a678"
            time="2025-04-24T15:23:11.088Z"
            start="2025-04-24T15:23:11.088Z"
            stale="2026-04-24T15:23:11.088Z"
            access="Undefined"
        >
            <point lat="39.0664644" lon="-108.4328957" hae="1402.385" ce="9999999.0" le="9999999.0"/>
            <detail></detail>
        </event>
    `, {
        milsym: {
            augment: true
        }
    });

    t.deepEquals(cot.raw.event.detail!.__milicon, {
        _attributes: { id: '12011000000000000000' },
    });

    t.end();
});

test('MilSym Augmentation - a-f-G-E-V-C', (t) => {
    const cot = CoTParser.from_xml(`
        <event
            version="2.0"
            type="a-f-G-E-V-C"
            how="h-g-i-g-o"
            uid="a471cec4-4d18-41b4-a1c5-d79e52b5a678"
            time="2025-04-24T15:23:11.088Z"
            start="2025-04-24T15:23:11.088Z"
            stale="2026-04-24T15:23:11.088Z"
            access="Undefined"
        >
            <point lat="39.0664644" lon="-108.4328957" hae="1402.385" ce="9999999.0" le="9999999.0"/>
            <detail></detail>
        </event>
    `, {
        milsym: {
            augment: true
        }
    });

    t.deepEquals(cot.raw.event.detail!.__milicon, {
        _attributes: { id: '10031500001601000000' },
    });

    t.end();
});
