import { Type } from '@sinclair/typebox';
import {
    GroupAttributes,
    CreatorAttributes,
    ACKRequestAttributes,
    ShapeEllipseAttributes,
    GeofenceAttributes,
    StatusAttributes,
    ContactAttributes,
    PrecisionLocationAttributes,
    VideoConnectionEntryAttributes,
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

export const MilSym = Type.Object({
    id: Type.String()
})

export const FeaturePropertyMissionLayer = Type.Object({
    name: Type.Optional(Type.String()),
    parentUid: Type.Optional(Type.String()),
    type: Type.Optional(Type.String()),
    uid: Type.Optional(Type.String()),
})

export const FeaturePropertyMissionChange = Type.Object({
    contentUid: Type.String(),
    creatorUid: Type.String(),
    isFederatedChange: Type.String(),
    missionName: Type.String(),
    timestamp: Type.String(),
    type: Type.String(),
    details: Type.Object({
        type: Type.String(),
        callsign: Type.String(),
        color: Type.String(),
        lat: Type.String(),
        lon: Type.String()
    })
})

export const FeaturePropertyMission = Type.Object({
    type: Type.Optional(Type.String()),
    tool: Type.Optional(Type.String()),
    guid: Type.Optional(Type.String()),
    name: Type.Optional(Type.String()),
    authorUid: Type.Optional(Type.String()),
    missionLayer: Type.Optional(FeaturePropertyMissionLayer),
    missionChanges: Type.Optional(Type.Array(FeaturePropertyMissionChange))
});

export const Properties = Type.Object({
    callsign: Type.String({ default: 'UNKNOWN' }),
    type: Type.String({ default: 'a-f-G' }),
    how: Type.String(),
    time: Type.String(),
    start: Type.String(),
    stale: Type.String(),
    center: Position,
    minzoom: Type.Optional(Type.Number()),
    maxzoom: Type.Optional(Type.Number()),
    rotate: Type.Optional(Type.Boolean()),
    range: Type.Optional(Type.Number()),
    bearing: Type.Optional(Type.Number()),
    creator: Type.Optional(CreatorAttributes),
    course: Type.Optional(Type.Number()),
    slope: Type.Optional(Type.Number()),
    speed: Type.Optional(Type.Number()),
    labels: Type.Optional(Type.Boolean()),
    'marker-color': Type.Optional(Type.String()),
    'marker-opacity': Type.Optional(Type.Number({ minimum: 0, maximum: 1 })),
    'stroke': Type.Optional(Type.String()),
    'stroke-opacity': Type.Optional(Type.Number({ minimum: 0, maximum: 1 })),
    'stroke-width': Type.Optional(Type.Number()),
    'stroke-style': Type.Optional(Type.String()),
    'fill': Type.Optional(Type.String()),
    'fill-opacity': Type.Optional(Type.Number({ minimum: 0, maximum: 1 })),
    metadata: Type.Optional(Type.Record(Type.String(), Type.Unknown())),
    archived: Type.Optional(Type.Boolean()),
    geofence: Type.Optional(GeofenceAttributes),
    contact: Type.Optional(ContactAttributes),
    shape: Type.Optional(Type.Object({
        ellipse: Type.Optional(ShapeEllipseAttributes)
    })),
    remarks: Type.Optional(Type.String()),
    milsym: Type.Optional(MilSym),
    mission: Type.Optional(FeaturePropertyMission),
    fileshare: Type.Optional(FileShareAttributes),
    ackrequest: Type.Optional(ACKRequestAttributes),
    attachments: Type.Optional(Type.Array(Type.String())),
    sensor: Type.Optional(SensorAttributes),
    video: Type.Optional(Type.Composite([
        VideoAttributes,
        Type.Optional(Type.Object({
            connection: Type.Optional(VideoConnectionEntryAttributes)
        }))
    ])),
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

export const Geometry = Type.Union([
    Point,
    LineString,
    Polygon
]);

export const Feature = Type.Object({
    id: Type.String(),
    type: Type.Literal('Feature'),
    properties: Properties,
    path: Type.Optional(Type.String()),
    geometry: Geometry
})

export const InputProperties = Type.Partial(Type.Composite([
    Type.Omit(Properties, ['stale']),
    Type.Object({
        stale: Type.Union([Type.Integer(), Type.String()])
    })
]))

export const InputFeature = Type.Object({
    id: Type.Optional(Type.String()),
    type: Type.Literal('Feature'),
    path: Type.Optional(Type.String()),
    properties: InputProperties,
    geometry: Geometry
})

export const InputFeatureCollection = Type.Object({
    type: Type.Literal('FeatureCollection'),
    features: Type.Array(InputFeature)
})

export const FeatureCollection = Type.Object({
    type: Type.Literal('FeatureCollection'),
    features: Type.Array(Feature)
})
