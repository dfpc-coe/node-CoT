import { Type } from '@sinclair/typebox';

export const IconsetAttributes = Type.Object({
    uid: Type.String(),
    version: Type.Integer(),
    name: Type.String(),
    default_group: Type.Optional(Type.String()),
    default_friendly: Type.Optional(Type.String()),
    default_hostile: Type.Optional(Type.String()),
    default_neutral: Type.Optional(Type.String()),
    default_unknown: Type.Optional(Type.String()),
    skip_resize: Type.Optional(Type.Boolean()),
})

export const IconAttributes = Type.Object({
    name: Type.String(),
    type2525b: Type.Optional(Type.String())
});

export const Icon = Type.Object({
    _attributes: IconAttributes
})

export default Type.Object({
    iconset: Type.Object({
        _attributes: IconsetAttributes,
        icon: Type.Union([Type.Array(Icon), Icon])
    }),
})
