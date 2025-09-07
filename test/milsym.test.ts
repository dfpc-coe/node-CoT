import test from 'tape';
import { CoTParser } from '../index.js';

test('Parse Creator', (t) => {
    const cot = CoTParser.from_xml(`
        <event version="2.0" uid="a471cec4-4d18-41b4-a1c5-d79e52b5a678" type="a-n-G" time="2025-04-24T15:23:11.088Z" start="2025-04-24T15:23:11.088Z" stale="2026-04-24T15:23:11.088Z" how="h-g-i-g-o" access="Undefined">
            <point lat="39.0664644" lon="-108.4328957" hae="1402.385" ce="9999999.0" le="9999999.0"/>
            <detail>
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
            </detail>
        </event>
    `);

    const detail = cot.detail(); 

    if (!detail.__milsym) t.fail();

    t.deepEquals(detail.__milsym, {
        _attributes: { id: 'SNGX-----------' },
        unitmodifier: [
            { _attributes: { code: 'Z' } },
            { _attributes: { code: 'Y' } },
            { _attributes: { code: 'T' } },
            { _attributes: { code: 'P' } },
            { _attributes: { code: 'Q' }, _text: '58' },
            { _attributes: { code: 'J' } },
            { _attributes: { code: 'H' } },
            { _attributes: { code: 'G' }, _text: 'test' },
            { _attributes: { code: 'AI' }, _text: 'true' },
            { _attributes: { code: 'AJ' }, _text: 'true' },
            { _attributes: { code: 'AK' }, _text: 'true' },
            { _attributes: { code: 'AH' }, _text: 'true' }
        ]
    });

    t.end();
});

test('MilSym Augmentation', (t) => {
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

    t.deepEquals(cot.raw.event.detail!.__milsym, {
        _attributes: { id: 'SNGP-----------' },
    });

    t.end();
});
