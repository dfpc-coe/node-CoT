import { Type } from '@sinclair/typebox';

export const IconsetAttributes = Type.Object({
    uid: Type.String(),
    version: Type.String(),
    name: Type.String(),
    default_group: Type.Optional(Type.String()),
    default_friendly: Type.Optional(Type.String()),
    default_hostile: Type.Optional(Type.String()),
    default_neutral: Type.Optional(Type.String()),
    default_unknown: Type.Optional(Type.String()),
    skip_resize: Type.Boolean({ default: false }),
})

export default Type.Object({
    iconset: Type.Object({
        _attributes: IconsetAttributes
    })
})
