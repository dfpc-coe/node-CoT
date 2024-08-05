import Err from '@openaddresses/batch-error';
import fsp from 'node:fs/promises';
import xmljs from 'xml-js';
import { Static, Type } from '@sinclair/typebox'
import AJV from 'ajv';

export const TypeFormat_COT = Type.Object({
    cot: Type.String(),
    full: Type.Optional(Type.String()),
    desc: Type.String()
})

export const TypeFormat_Weapon = Type.Object({
    cot: Type.String(),
    desc: Type.String()
})

export const TypeFormat_Relation = Type.Object({
    cot: Type.String(),
    desc: Type.String()
})

export const TypeFormat_Is = Type.Object({
    what: Type.String(),
    match: Type.String()
});

export const TypeFormat_How = Type.Object({
    what: Type.String(),
    value: Type.String()
})

export const TypeFormat = Type.Object({
    types: Type.Object({
        cot: Type.Array(Type.Object({
            _attributes: TypeFormat_COT
        })),
        weapon: Type.Array(Type.Object({
            _attributes: TypeFormat_Weapon
        })),
        relation: Type.Array(Type.Object({
            _attributes: TypeFormat_Relation
        })),
        is: Type.Array(Type.Object({
            _attributes: TypeFormat_Is
        })),
        how: Type.Array(Type.Object({
            _attributes: TypeFormat_How
        }))
    })
});

const checkTypes = (new AJV({
    allErrors: true,
    coerceTypes: true,
    allowUnionTypes: true
}))
    .compile(TypeFormat);

export class CoTTypes {
    cots: Map<string, Static<typeof TypeFormat_COT>>
    weapons: Map<string, Static<typeof TypeFormat_Weapon>>
    relations: Map<string, Static<typeof TypeFormat_Relation>>
    is: Map<string, Static<typeof TypeFormat_Is>>
    how: Map<string, Static<typeof TypeFormat_How>>

    constructor(
        cots: Map<string, Static<typeof TypeFormat_COT>>,
        weapons: Map<string, Static<typeof TypeFormat_Weapon>>,
        relations: Map<string, Static<typeof TypeFormat_Relation>>,
        is: Map<string, Static<typeof TypeFormat_Is>>,
        how: Map<string, Static<typeof TypeFormat_How>>
    ) {
        this.cots = cots;
        this.weapons = weapons;
        this.relations = relations;
        this.is = is;
        this.how = how;
    }

    static async load(): Promise<CoTTypes> {
        const xml = xmljs.xml2js(String(await fsp.readFile(new URL('cot-types.xml', import.meta.url))), { compact: true })

        checkTypes(xml);
        if (checkTypes.errors) throw new Err(400, null, `${checkTypes.errors[0].message} (${checkTypes.errors[0].instancePath})`);
        const types = xml as Static<typeof TypeFormat>;

        const cots: Map<string, Static<typeof TypeFormat_COT>> = new Map();
        for (const cot of types.types.cot) {
            cots.set(cot._attributes.cot, cot._attributes);
        }

        const weapons: Map<string, Static<typeof TypeFormat_Weapon>> = new Map();
        for (const weapon of types.types.weapon) {
            weapons.set(weapon._attributes.cot, weapon._attributes);
        }

        const relations: Map<string, Static<typeof TypeFormat_Relation>> = new Map();
        for (const relation of types.types.relation) {
            relations.set(relation._attributes.cot, relation._attributes);
        }

        const is: Map<string, Static<typeof TypeFormat_Is>> = new Map();
        for (const i of types.types.is) {
            is.set(i._attributes.what, i._attributes);
        }

        const how: Map<string, Static<typeof TypeFormat_How>> = new Map();
        for (const h of types.types.how) {
            how.set(h._attributes.value, h._attributes);
        }

        return new CoTTypes(cots, weapons, relations, is, how);
    }
}
