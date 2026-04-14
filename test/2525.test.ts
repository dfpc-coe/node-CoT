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
