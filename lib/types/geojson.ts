import { Type } from '@sinclair/typebox';

// Intentially no max for increated input flexibility
// coordinates are clipped in normalize_geojson
const Position = Type.Array(Type.Number(), { minItems: 2 });

const Point = Type.Object({
    type: Type.Literal('Point'),
    coordinates: Position
})

/*
const MultiPoint = Type.Object({
    type: Type.Literal('MultiPoint'),
    coordinates: Type.Array(Position)
})
*/

const LineString = Type.Object({
    type: Type.Literal('LineString'),
    coordinates: Type.Array(Position)
})

/*
const MultiLineString = Type.Object({
    type: Type.Literal('MultiLineString'),
    coordinates: Type.Array(Type.Array(Position))
})
*/

const Polygon = Type.Object({
    type: Type.Literal('Polygon'),
    coordinates: Type.Array(Type.Array(Position))
})

/*
const MultiPolygon = Type.Object({
    type: Type.Literal('MultiPolygon'),
    coordinates: Type.Array(Type.Array(Type.Array(Position)))
})
*/

const Geometry = Type.Union([
    Point,
    LineString,
    Polygon
]);

export const GeoJSONFeature = Type.Object({
    id: Type.Optional(Type.String()),
    type: Type.Literal('Feature'),
    properties: Type.Record(Type.String(), Type.Unknown()),
    geometry: Geometry
})

export const GeoJSONFeatureCollection = Type.Object({
    type: Type.Literal('FeatureCollection'),
    features: Type.Array(GeoJSONFeature)
});
