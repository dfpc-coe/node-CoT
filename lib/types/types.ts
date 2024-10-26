import { Type } from '@sinclair/typebox';

export const EventAttributes = Type.Object({
    version: Type.String({
        description: 'The CoT message version - typically 2'
    }),
    uid: Type.String({
        description: 'The Unique ID for the CoT - using the same UID will replace an existing CoT'
    }),
    type: Type.String({
        description: 'The CoT type - for "things" on the ground will start with a- for digital things b- etc'
    }),
    how: Type.Optional(Type.String({
        description: 'An optional hint as to how the CoT was generated'
    })),

    access: Type.Optional(Type.String()),
    qos: Type.Optional(Type.String()),
    opex: Type.Optional(Type.String()),

    time: Type.String({
        description: 'Time at which the CoT was generated'
    }),
    stale: Type.String({
        description: 'Time at which the CoT is no longer current'
    }),
    start: Type.String({
        description: 'Time at which the CoT starts'
    }),
});

export const TogAttributes = Type.Object({
    _attributes: Type.Optional(Type.Object({
        enabled: Type.Optional(Type.String())
    }))
})

export const LinkAttributes = Type.Object({
    // Polygon/LineString
    type: Type.Optional(Type.String()),
    point: Type.Optional(Type.String()),

    // URL Style Links
    url: Type.Optional(Type.String()),
    mime: Type.Optional(Type.String()),
    remarks: Type.Optional(Type.String()),

    // Common to all Link Types
    uid: Type.Optional(Type.String()),
    relation: Type.Optional(Type.String()),

    // Seen on QuickPics
    production_time: Type.Optional(Type.String()),
    parent_callsign: Type.Optional(Type.String())
})

export const Link = Type.Object({
    _attributes: LinkAttributes
})

// Ref: https://git.tak.gov/standards/takcot/-/blob/master/xsd/Route.xsd
export const LinkAttrRouteFil = Type.Enum({
    Infil: 'Infil',
    Exfil: 'Exfil'
});

export const LinkAttrRouteMethod = Type.Enum({
    Driving: 'Driving',
    Walking: 'Walking',
    Flying: 'Flying',
    Swimming: 'Swimming',
    Watercraft: 'Watercraft'
});

export const LinkAttrRouteType = Type.Enum({
    Primary: 'Primary',
    Secondary: 'Secondary',
});

export const LinkAttrRouteOrder = Type.Enum({
    Ascending: 'Ascending Check Points',
    Descending: 'Descending Check Points',
});

export const LinkAttrAttributes = Type.Object({
    planningmethod: Type.Optional(LinkAttrRouteFil),
    color: Type.Optional(Type.Integer()),
    method: LinkAttrRouteMethod,
    prefix: Type.String(),
    stroke: Type.Optional(Type.String()),
    type: Type.Optional(Type.String()),
    routetype: LinkAttrRouteType,
    direction: Type.Optional(LinkAttrRouteFil),
    order: LinkAttrRouteOrder
})

export const LinkAttr = Type.Object({
    _attributes: LinkAttrAttributes
})

export const ProtocolSupportAttributes = Type.Object({
    _attributes: Type.Optional(Type.Object({
        version: Type.Optional(Type.String())
    }))
});

export const ServerVersionAttributes = Type.Object({
    _attributes: Type.Optional(Type.Object({
        serverVersion: Type.Optional(Type.String())
    }))
})

export const ColorAttributes = Type.Object({
    _attributes: Type.Optional(Type.Object({
        argb: Type.Optional(Type.String())
    }))
})

export const GenericAttributes = Type.Object({
    _attributes: Type.Optional(Type.Object({
        value: Type.Optional(Type.String())
    }))
})

export const GenericOptionalText = Type.Object({
    _text: Optional(Type.String())
})

export const GenericText = Type.Object({
    _text: Type.String()
})

export const TrackAttributes = Type.Object({
    speed: Type.Optional(Type.String()),
    course: Type.Optional(Type.String()),
    slope: Type.Optional(Type.String()),
    eCourse: Type.Optional(Type.String()),
    eSpeed: Type.Optional(Type.String()),
    eSlope: Type.Optional(Type.String())
});

export const Track = Type.Object({
    _attributes: Type.Optional(TrackAttributes)
})

export const ShapePolyLineAttributes = Type.Object({
    closed: Type.Optional(Type.Boolean()),
    fillColor: Type.Optional(Type.String()),
    color: Type.Optional(Type.String()),
})

export const VertexAttribute = Type.Object({
    lat: Type.Number(),
    lon: Type.Number(),
})

export const ShapePolyLine = Type.Object({
    _attributes: Type.Optional(ShapePolyLineAttributes),
    vertex: Type.Optional(Type.Union([
        Type.Object({
            _attributes: VertexAttribute
        }),
        Type.Array(Type.Object({
            _attributes: VertexAttribute
        }))
    ]))
})

export const ShapeEllipseAttributes = Type.Object({
    major: Type.Number(),
    minor: Type.Number(),
    angle: Type.Number(),
})

export const ShapeEllipse = Type.Object({
    _attributes: ShapeEllipseAttributes,
})

export const Shape = Type.Object({
    polyline: Type.Optional(ShapePolyLine),
    ellipse: Type.Optional(ShapeEllipse)
})

export const MissionAttributes = Type.Object({
    type: Type.Optional(Type.String()),
    tool: Type.Optional(Type.String()),
    name: Type.Optional(Type.String()),
    guid: Type.Optional(Type.String()),
    authorUid: Type.Optional(Type.String()),
});

export const MissionLayer = Type.Object({
    name: Type.Optional(GenericText),
    parentUid: Type.Optional(GenericText),
    type: Type.Optional(GenericText),
    uid: Type.Optional(GenericText),
})

export const MissionChangeDetails = Type.Object({
    _attributes: Type.Object({
        type: Type.String(),
        callsign: Type.Optional(Type.String()),
        color: Type.Optional(Type.String())
    }),
    location: Type.Optional(Type.Object({
        _attributes: Type.Object({
            lat: Type.String(),
            lon: Type.String()
        })
    }))
})

export const MissionChange = Type.Object({
    contentUid: GenericText,
    creatorUid: GenericOptionalText,
    isFederatedChange: GenericText,
    missionName: GenericText,
    timestamp: GenericText,
    type: GenericText,
    details: MissionChangeDetails
})

export const MissionChanges = Type.Object({
    MissionChange: Type.Union([MissionChange, Type.Array(MissionChange)])
})

export const Mission = Type.Object({
    _attributes: Type.Optional(MissionAttributes),
    missionLayer: Type.Optional(MissionLayer),
    MissionChanges: Type.Optional(MissionChanges),
})

export const SensorAttributes = Type.Object({
    elevation: Type.Optional(Type.Number()),
    vfov: Type.Optional(Type.Number()),
    fov: Type.Optional(Type.Number()),
    roll: Type.Optional(Type.Number()),
    range: Type.Optional(Type.Number()),
    azimuth: Type.Optional(Type.Number()),
    north: Type.Optional(Type.Number()),

    type: Type.Optional(Type.String()),
    version: Type.Optional(Type.String()),
    model: Type.Optional(Type.String())
});

export const Sensor = Type.Object({
    _attributes: SensorAttributes
})

export const VideoAttributes = Type.Object({
    sensor: Type.Optional(Type.String()),
    spi: Type.Optional(Type.String()),
    url: Type.Optional(Type.String())
});

export const Video = Type.Object({
    _attributes: Type.Optional(VideoAttributes)
})

export const GeofenceAttributes = Type.Object({
    elevationMonitored: Type.Optional(Type.String()),
    minElevation: Type.Optional(Type.String()),
    maxElevation: Type.Optional(Type.String()),
    monitor: Type.Optional(Type.String()),
    trigger: Type.Optional(Type.String()),
    tracking: Type.Optional(Type.String()),
    boundingSphere: Type.Optional(Type.Number()),
});

export const Geofence = Type.Object({
    _attributes: GeofenceAttributes
})

export const Chat = Type.Object({
    _attributes: Type.Object({
        parent: Type.Optional(Type.String()),
        groupOwner: Type.Optional(Type.String()),
        messageId: Type.Optional(Type.String()),
        chatroom: Type.String(),
        id: Type.String(),
        senderCallsign: Type.String()
    }),
    chatgrp: Type.Any()
})

export const TakVersionAttributes = Type.Object({
    device: Type.Optional(Type.String()),
    platform: Type.Optional(Type.String()),
    os: Type.Optional(Type.String()),
    version: Type.Optional(Type.String())
})

export const TakVersion = Type.Object({
    _attributes: TakVersionAttributes
})

export const FlowTags = Type.Any();

export const GroupAttributes = Type.Object({
    name: Type.String(),
    role: Type.String()
})

export const Group = Type.Object({
    _attributes: Type.Optional(GroupAttributes)
})

export const ACKRequestAttributes = Type.Object({
    uid: Type.String(),
    ackrequested: Type.Boolean(),
    tag: Type.String()
})

export const ACKRequest = Type.Object({
    _attributes: ACKRequestAttributes
})

export const FileShareAttributes = Type.Object({
    filename: Type.String(),
    name: Type.String(),
    senderCallsign: Type.String(),
    senderUid: Type.String(),
    senderUrl: Type.String(),
    sha256: Type.String(),
    sizeInBytes: Type.Integer()
})

export const FileShare = Type.Object({
    _attributes: FileShareAttributes
})


export const StatusAttributes = Type.Object({
    battery: Type.Optional(Type.String()),
    readiness: Type.Optional(Type.String())
})

export const Status = Type.Object({
    _attributes: StatusAttributes
})

export const Uid = Type.Object({
    _attributes: Type.Object({
        Droid: Type.String()
    })
})

export const Contact = Type.Object({
    _attributes: Type.Object({
        phone: Type.Optional(Type.String()),
        name: Type.Optional(Type.String()),
        callsign: Type.String(),
        endpoint: Type.Optional(Type.String())
    })
})

export const MartiDestAttributes = Type.Object({
    uid: Type.Optional(Type.String()),
    callsign: Type.Optional(Type.String()),

    mission: Type.Optional(Type.String()),
    after: Type.Optional(Type.String()),
    path: Type.Optional(Type.String())
})

export const MartiDest = Type.Object({
    _attributes: MartiDestAttributes
})

export const Marti = Type.Object({
    _attributes: Type.Optional(Type.Object({})),
    dest: Type.Optional(Type.Union([MartiDest, Type.Array(MartiDest)]))
});

export const AttachmentAttributes = Type.Object({
    hashes: Type.String({
        description: 'A JSON Stringified array of Content Hashes that exist on the TAK Server'
    })
});

export const Attachment = Type.Object({
    _attributes: AttachmentAttributes,
});

export const RangeAttributes = Type.Object({
    value: Type.String()
});

export const Range = Type.Object({
    _attributes: RangeAttributes,
});

export const RangeUnitsAttributes = Type.Object({
    value: Type.String()
});

export const RangeUnits = Type.Object({
    _attributes: RangeUnitsAttributes,
});

export const BearingAttributes = Type.Object({
    value: Type.String()
});

export const Bearing = Type.Object({
    _attributes: BearingAttributes,
});

export const BearingUnitsAttributes = Type.Object({
    value: Type.String()
});

export const BearingUnits = Type.Object({
    _attributes: BearingUnitsAttributes,
});

export const InclinationAttributes = Type.Object({
    value: Type.String()
});

export const Inclination = Type.Object({
    _attributes: InclinationAttributes,
});

export const NorthRefAttributes = Type.Object({
    value: Type.String()
});

export const NorthRef = Type.Object({
    _attributes: NorthRefAttributes,
});

export const Remarks = Type.Object({
    _attributes: Type.Optional(Type.Object({
        source: Type.Optional(Type.String()),
        to: Type.Optional(Type.String()),
        time: Type.Optional(Type.String())
    })),
    _text: Type.Optional(Type.String())
})

export const PrecisionLocationAttributes = Type.Object({
    geopointsrc: Type.Optional(Type.String()),
    altsrc: Type.Optional(Type.String())
})

export const PrecisionLocation = Type.Object({
    _attributes: PrecisionLocationAttributes
})

export const UserIcon = Type.Object({
    _attributes: Type.Object({
        iconsetpath: Type.String()
    })
})

export const ForceDelete = Type.Object({})

export const Detail = Type.Object({
    contact: Type.Optional(Contact),
    tog: Type.Optional(TogAttributes),
    '__group': Type.Optional(Group),
    '__chat': Type.Optional(Chat),
    '__video': Type.Optional(Video),
    '__geofence': Type.Optional(Geofence),
    '__forcedelete': Type.Optional(ForceDelete),
    '_flow-tags_': Type.Optional(FlowTags),
    uid: Type.Optional(Uid),
    status: Type.Optional(Status),
    fileshare: Type.Optional(FileShare),
    ackrequest: Type.Optional(ACKRequest),
    remarks: Type.Optional(Remarks),
    precisionlocation: Type.Optional(PrecisionLocation),
    color: Type.Optional(ColorAttributes),
    strokeColor: Type.Optional(GenericAttributes),
    archive: Type.Optional(Type.Union([GenericAttributes, Type.Array(GenericAttributes)])),
    strokeWeight: Type.Optional(GenericAttributes),
    strokeStyle: Type.Optional(GenericAttributes),
    labels_on: Type.Optional(GenericAttributes),
    fillColor: Type.Optional(GenericAttributes),
    mission: Type.Optional(Mission),
    shape: Type.Optional(Shape),

    link: Type.Optional(Type.Union([Link, Type.Array(Link)])),
    link_attr: Type.Optional(LinkAttr),

    usericon: Type.Optional(UserIcon),
    track: Type.Optional(Track),
    sensor: Type.Optional(Sensor),
    takv: Type.Optional(TakVersion),
    marti: Type.Optional(Marti),
    attachment_list: Type.Optional(Attachment),

    // Range & Bearing
    range: Type.Optional(Range),
    rangeUnits: Type.Optional(RangeUnits),
    bearing: Type.Optional(Bearing),
    bearingUnits: Type.Optional(BearingUnits),
    inclination: Type.Optional(Inclination),
    northRef: Type.Optional(NorthRef),

    TakControl: Type.Optional(Type.Object({
        TakProtocolSupport: Type.Optional(ProtocolSupportAttributes),
        TakServerVersionInfo: Type.Optional(ServerVersionAttributes)
    }))
})

export const Point = Type.Object({
    _attributes: Type.Object({
        lat: Type.Union([Type.String(), Type.Number()]),
        lon: Type.Union([Type.String(), Type.Number()]),
        hae: Type.Union([Type.String(), Type.Number()]),
        ce: Type.Union([Type.String(), Type.Number()]),
        le: Type.Union([Type.String(), Type.Number()]),
    })
})

export default Type.Object({
    event: Type.Object({
        _attributes: EventAttributes,
        detail: Type.Optional(Detail),
        point: Point,
    }),
})
