import { Type } from '@sinclair/typebox';

export const BasemapMapSource = Type.Object({
    name: Type.Object({
        _text: Type.String()
    }, { description: 'Name of the Basemap' }),
    minZoom: Type.Object({
        _text: Type.Integer()
    }, { description: 'Minimum Zoom Level' }),
    maxZoom: Type.Object({
        _text: Type.Integer()
    }, { description: 'Maximum Zoom Level' }),
    tileType: Type.Object({
        _text: Type.String()
    }, { description: 'Tile Format/Type' }),
    tileUpdate: Type.Optional(Type.Object({
        _text: Type.String({
            default: 'None'
        })
    }, { description: 'Tile Update Strategy' })),
    url: Type.Optional(Type.Object({
        _text: Type.String()
    }, { description: 'Tile Server URL Template' })),
    backgroundColor: Type.Optional(Type.Object({
        _text: Type.String()
    }, { description: 'Map Background Color' })),
    serverParts: Type.Optional(Type.Object({
        _text: Type.String()
    }, { description: 'A, B, C, prefix used in some tile servers' }))
})

export default Type.Object({
    customMapSource: BasemapMapSource
})
