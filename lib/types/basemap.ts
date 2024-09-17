import { Type } from '@sinclair/typebox';

export const BasemapMapSource = Type.Object({
    name: Type.Object({
        _text: Type.String()
    }),
    minZoom: Type.Object({
        _text: Type.Integer()
    }),
    maxZoom: Type.Object({
        _text: Type.Integer()
    }),
    tileType: Type.Object({
        _text: Type.String()
    }),
    tileUpdate: Type.Optional(Type.Object({
        _text: Type.String()
    })),
    url: Type.Optional(Type.Object({
        _text: Type.String()
    })),
    backgroundColor: Type.Optional(Type.Object({
        _text: Type.String()
    })),
})

export default Type.Object({
    customMapSource: BasemapMapSource
})
