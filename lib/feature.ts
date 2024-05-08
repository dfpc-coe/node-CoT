import { Type } from '@sinclair/typebox';
import {
    GroupAttributes,
    StatusAttributes,
    PrecisionLocationAttributes,
    MartiDestAttributes,
    TakVersionAttributes,
    FileShareAttributes,
    TrackAttributes,
    LinkAttributes,
    SensorAttributes,
    VideoAttributes
} from './types.js';

export const Position = Type.Array(Type.Number(), {
    minItems: 2,
    maxItems: 3
})
export const InputProperties = Type.Object({
    callsign: Type.Optional(Type.String({ default: 'UNKNOWN' })),
    type: Type.Optional(Type.String({ default: 'a-f-g' })),
    how: Type.Optional(Type.String()),
    time: Type.Optional(Type.Union([Type.String()])),
    start: Type.Optional(Type.Union([Type.String()])),
    stale: Type.Optional(Type.Union([Type.Integer(), Type.String()])),
    center: Type.Optional(Position),
    course: Type.Optional(Type.Integer()),
    slope: Type.Optional(Type.Integer()),
    speed: Type.Optional(Type.Integer()),
    'stroke': Type.Optional(Type.String()),
    'stroke-opacity': Type.Optional(Type.Integer({ minimum: 0, maximum: 255 })),
    'stroke-width': Type.Optional(Type.Integer()),
    'stroke-style': Type.Optional(Type.String()),
    'fill': Type.Optional(Type.String()),
    'fill-opacity': Type.Optional(Type.Integer({ minimum: 0, maximum: 255 })),
    metadata: Type.Optional(Type.Record(Type.String(), Type.Unknown())),
    archived: Type.Optional(Type.Boolean()),
    contact: Type.Optional(Type.Object({
        phone: Type.Optional(Type.String()),
        endpoint: Type.Optional(Type.String())
    })),
    remarks: Type.Optional(Type.String()),
    fileshare: Type.Optional(FileShareAttributes),
    sensor: Type.Optional(SensorAttributes),
    video: Type.Optional(VideoAttributes),
    links: Type.Optional(Type.Array(LinkAttributes)),
    chat: Type.Optional(Type.Object({
        parent: Type.Optional(Type.String()),
        groupOwner: Type.Optional(Type.String()),
        messageId: Type.Optional(Type.String()),
        chatroom: Type.String(),
        id: Type.String(),
        senderCallsign: Type.String(),
        chatgrp: Type.Any()
    })),
    track: Type.Optional(TrackAttributes),
    dest: Type.Optional(Type.Union([MartiDestAttributes, Type.Array(MartiDestAttributes)])),
    icon: Type.Optional(Type.String()),
    droid: Type.Optional(Type.String()),
    takv: Type.Optional(TakVersionAttributes),
    group: Type.Optional(GroupAttributes),
    status: Type.Optional(StatusAttributes),
    precisionlocation: Type.Optional(PrecisionLocationAttributes),
    flow: Type.Optional(Type.Record(Type.String(), Type.String())),
})

export const Properties = Type.Object({
    callsign: Type.String({ default: 'UNKNOWN' }),
    type: Type.String({ default: 'a-f-g' }),
    how: Type.String(),
    time: Type.String(),
    start: Type.String(),
    stale: Type.String(),
    center: Position,
    course: Type.Optional(Type.Integer()),
    slope: Type.Optional(Type.Integer()),
    speed: Type.Optional(Type.Integer()),
    'stroke': Type.Optional(Type.String()),
    'stroke-opacity': Type.Optional(Type.Integer({ minimum: 0, maximum: 255 })),
    'stroke-width': Type.Optional(Type.Integer()),
    'stroke-style': Type.Optional(Type.String()),
    'fill': Type.Optional(Type.String()),
    'fill-opacity': Type.Optional(Type.Integer({ minimum: 0, maximum: 255 })),
    metadata: Type.Optional(Type.Record(Type.String(), Type.Unknown())),
    archived: Type.Optional(Type.Boolean()),
    contact: Type.Optional(Type.Object({
        phone: Type.Optional(Type.String()),
        endpoint: Type.Optional(Type.String())
    })),
    remarks: Type.Optional(Type.String()),
    fileshare: Type.Optional(FileShareAttributes),
    sensor: Type.Optional(SensorAttributes),
    video: Type.Optional(VideoAttributes),
    links: Type.Optional(Type.Array(LinkAttributes)),
    chat: Type.Optional(Type.Object({
        parent: Type.Optional(Type.String()),
        groupOwner: Type.Optional(Type.String()),
        messageId: Type.Optional(Type.String()),
        chatroom: Type.String(),
        id: Type.String(),
        senderCallsign: Type.String(),
        chatgrp: Type.Any()
    })),
    track: Type.Optional(TrackAttributes),
    dest: Type.Optional(Type.Union([MartiDestAttributes, Type.Array(MartiDestAttributes)])),
    icon: Type.Optional(Type.String()),
    droid: Type.Optional(Type.String()),
    takv: Type.Optional(TakVersionAttributes),
    group: Type.Optional(GroupAttributes),
    status: Type.Optional(StatusAttributes),
    precisionlocation: Type.Optional(PrecisionLocationAttributes),
    flow: Type.Optional(Type.Record(Type.String(), Type.String())),
})

export const Point = Type.Object({
    type: Type.Literal('Point'),
    coordinates: Position
})

export const MultiPoint = Type.Object({
    type: Type.Literal('MultiPoint'),
    coordinates: Type.Array(Position)
})

export const LineString = Type.Object({
    type: Type.Literal('LineString'),
    coordinates: Type.Array(Position)
})

export const MultiLineString = Type.Object({
    type: Type.Literal('MultiLineString'),
    coordinates: Type.Array(Type.Array(Position))
})

export const Polygon = Type.Object({
    type: Type.Literal('Polygon'),
    coordinates: Type.Array(Type.Array(Position))
})

export const MultiPolygon = Type.Object({
    type: Type.Literal('MultiPolygon'),
    coordinates: Type.Array(Type.Array(Type.Array(Position)))
})

export default Type.Object({
    id: Type.String(),
    type: Type.Const('Feature'),
    properties: Properties,
    geometry: Type.Union([
        Point,
        LineString,
        Polygon
    ])
})

export const InputFeature = Type.Object({
    id: Type.Optional(Type.String()),
    type: Type.Const('Feature'),
    properties: InputProperties,
    geometry: Type.Union([
        Point,
        LineString,
        Polygon
    ])
})
