import { Type } from '@sinclair/typebox';

/**
 * Type Schema for Basemap Map Source Configuration
 * Compatible with Mobile Atlas Creator (MOBAC) Custom XML Map Sources
 * @link https://mobac.sourceforge.io/wiki/index.php/Custom_XML_Map_Sources
 */

export const BasemapMapSource = Type.Object({
    name: Type.Object({
        _text: Type.String()
    }, { description: 'The name of the map source' }),
    minZoom: Type.Object({
        _text: Type.Integer()
    }, { description: 'The minimum zoom level provided by the map source' }),
    maxZoom: Type.Object({
        _text: Type.Integer()
    }, { description: 'The maximum zoom level provided by the map source' }),
    tileType: Type.Object({
        _text: Type.String()
    }, { description: 'The image type provided by the map source' }),
    tileUpdate: Type.Optional(Type.Object({
        _text: Type.String({
            default: 'None'
        })
    }, { description: 'The server capabilities for conditional downloading of new/updated tiles' })),
    url: Type.Optional(Type.Object({
        _text: Type.String()
    }, { description: 'The URL for the tiles of the map source' })),
    invertYCoordinate: Type.Optional(Type.Object({
        _text: Type.String()
    }, { description: 'Inverts the y coordinate so that it starts south' })),
    backgroundColor: Type.Optional(Type.Object({
        _text: Type.String()
    }, { description: 'The background color of a map' })),
    ignoreErrors: Type.Optional(Type.Object({
        _text: Type.String()
    }, { description: 'Handling of missing tiles' })),
    serverParts: Type.Optional(Type.Object({
        _text: Type.String()
    }, { description: 'Use multiple servers for the map source' }))
})

export default Type.Object({
    customMapSource: BasemapMapSource
})
