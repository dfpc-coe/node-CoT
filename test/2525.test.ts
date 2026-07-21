import assert from 'node:assert/strict';
import test from 'node:test';
import MilSymType, { StandardIdentity } from '../lib/utils/2525.js';

test('2525 StandardIdentity', () => {
    assert.equal(
        MilSymType.standardIdentity('b-f-D'),
        StandardIdentity.NONE
    );

    assert.equal(
        MilSymType.standardIdentity('a-'),
        StandardIdentity.NONE
    );

    assert.equal(
        MilSymType.standardIdentity('a-x-D-H'),
        StandardIdentity.NONE
    );

    assert.equal(
        MilSymType.standardIdentity('a-h-S'),
        StandardIdentity.HOSTILE
    );
});

test('2525 <=> SIDC to2525B', () => {
    assert.equal("SHSPCLDD-------", MilSymType.to2525B("a-h-S-C-L-D-D"))
    assert.equal("SFGPUCVRA------", MilSymType.to2525B("a-f-G-U-C-V-R-A"))

    assert.throws(() => {
        MilSymType.to2525B("b-h-S-C-L-D-D")
    }, /CoT to 2525B can only be applied to well-formed Atom type CoT Events./);

    assert.throws(() => {
        MilSymType.to2525B("")
    }, /CoT to 2525B can only be applied to well-formed Atom type CoT Events./);

    assert.throws(() => {
        MilSymType.to2525B("bhSCLDD")
    }, /CoT to 2525B can only be applied to well-formed Atom type CoT Events./);

    assert.throws(() => {
        MilSymType.to2525B("b-h-s-c-l-d-d")
    }, /CoT to 2525B can only be applied to well-formed Atom type CoT Events./);

    assert.throws(() => {
        MilSymType.to2525B("b-h-S-?-L-D-D")
    }, /CoT to 2525B can only be applied to well-formed Atom type CoT Events./);
});

test('2525 <=> SIDC from2525B', () => {

    assert.equal("a-h-S-C-L-D-D", MilSymType.from2525B("SHSPCLDD-------"))
    assert.equal("a-f-G-U-C-V-R-A", MilSymType.from2525B("SFGPUCVRA------"))

    assert.throws(() => {
        MilSymType.from2525B("SFGPUCVRA")
    }, /2525B to CoT can only be applied to well-formed warfighting 2525B SIDCs./);

    assert.throws(() => {
        MilSymType.from2525B("SOGPUCVRA------")
    }, /2525B to CoT can only be applied to well-formed warfighting 2525B SIDCs./);

    assert.throws(() => {
        MilSymType.from2525B("SFMPUCVRA------")
    }, /2525B to CoT can only be applied to well-formed warfighting 2525B SIDCs./);

    assert.throws(() => {
        MilSymType.from2525B("SFMPUCVRA------")
    }, /2525B to CoT can only be applied to well-formed warfighting 2525B SIDCs./);

    assert.throws(() => {
        MilSymType.from2525B("SFGP*CVRA------")
    }, /2525B to CoT can only be applied to well-formed warfighting 2525B SIDCs./);

    assert.throws(() => {
        MilSymType.from2525B("GFGPUCVRA------")
    }, /2525B to CoT can only be applied to well-formed warfighting 2525B SIDCs./);
})

test('2525 <=> SIDC isNumericSIDCConvertable', () => {
    assert.equal(MilSymType.isNumericSIDCConvertable('10031000001211000000'), true);
    assert.equal(MilSymType.isNumericSIDCConvertable('13061500000000000000'), true);
    assert.equal(MilSymType.isNumericSIDCConvertable('12041000000000000000'), true);

    assert.equal(MilSymType.isNumericSIDCConvertable('a-f-G'), false);
    assert.equal(MilSymType.isNumericSIDCConvertable('SFGPUCVRA------'), false);
    assert.equal(MilSymType.isNumericSIDCConvertable('1003100000121100000'), false);
    assert.equal(MilSymType.isNumericSIDCConvertable('100310000012110000000'), false);
    assert.equal(MilSymType.isNumericSIDCConvertable('20031000001211000000'), false);
    assert.equal(MilSymType.isNumericSIDCConvertable(''), false);
});

test('2525 <=> SIDC fromNumericSIDC', () => {
    // 2525D - Friend Land Unit
    assert.equal(MilSymType.fromNumericSIDC('10031000001211000000'), 'a-f-G');

    // 2525E - Hostile Land Equipment
    assert.equal(MilSymType.fromNumericSIDC('13061500000000000000'), 'a-h-G');

    // Neutral Land Unit (round trip of MilIcon augmentation short code)
    assert.equal(MilSymType.fromNumericSIDC('12041000000000000000'), 'a-n-G');

    // Unknown Air
    assert.equal(MilSymType.fromNumericSIDC('13010100000000000000'), 'a-u-A');

    // Suspect Sea Surface
    assert.equal(MilSymType.fromNumericSIDC('10053000000000000000'), 'a-s-S');

    // Assumed Friend Sea Subsurface
    assert.equal(MilSymType.fromNumericSIDC('10023500000000000000'), 'a-a-U');

    // Exercise Friend Space
    assert.equal(MilSymType.fromNumericSIDC('10130500000000000000'), 'a-f-P');

    // Joker Land Unit
    assert.equal(MilSymType.fromNumericSIDC('10151000000000000000'), 'a-j-G');

    // Unmapped Identity/Symbol Set fall back to Unknown Ground
    assert.equal(MilSymType.fromNumericSIDC('10092500000000000000'), 'a-u-G');

    assert.throws(() => {
        MilSymType.fromNumericSIDC('a-f-G');
    }, /Numeric SIDC to CoT can only be applied to well-formed 2525D\/2525E SIDCs./);

    assert.throws(() => {
        MilSymType.fromNumericSIDC('SFGPUCVRA------');
    }, /Numeric SIDC to CoT can only be applied to well-formed 2525D\/2525E SIDCs./);
});
