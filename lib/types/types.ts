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
    // Common to all Link Types
    uid: Type.Optional(Type.String()),
    relation: Type.Optional(Type.String()),

    // Polgon/Linestring or Author
    type: Type.Optional(Type.String()),

    // Polygon/LineString
    point: Type.Optional(Type.String()),

    // Used in Routes
    callsign: Type.Optional(Type.String()),

    // Custom CloudTAK Attribute to open a Mission when clicked - Should always be a GUID
    mission: Type.Optional(Type.String()),

    // URL Style Links
    url: Type.Optional(Type.String()),
    mime: Type.Optional(Type.String()),
    remarks: Type.Optional(Type.String()),

    // Author Details
    production_time: Type.Optional(Type.String()),
    parent_callsign: Type.Optional(Type.String())
})

export const RouteInfoNavCueTrigger = Type.Object({
    _attributes: Type.Object({
        mode: Type.String(),
        value: Type.String()
    }),
});

export const RouteInfoNavCue = Type.Object({
    _attributes: Type.Object({
        id: Type.String(),
        voice: Type.String(),
        text: Type.String(),
    }),
    trigger: RouteInfoNavCueTrigger
})

export const RouteInfo = Type.Object({
    __navcues: Type.Object({
        __navcue: Type.Optional(Type.Union([Type.Array(RouteInfoNavCue), RouteInfoNavCue]))
    })
})

export const Emergency = Type.Object({
    _attributes: Type.Object({
        cancel: Type.Optional(Type.Boolean()),
        type: Type.Optional(Type.String())
    }),
    _text: Type.String()
});

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
    Ascending: 'Ascending',
    Descending: 'Descending',
    AscendingCheckPoint: 'Ascending Check Points',
    DescendingCheckPoints: 'Descending Check Points',
});

export const LinkAttrAttributes = Type.Object({
    planningmethod: Type.Optional(LinkAttrRouteFil),
    color: Type.Optional(Type.Integer()),
    method: LinkAttrRouteMethod,
    prefix: Type.Optional(Type.String()),
    style: Type.Optional(Type.String()),
    stroke: Type.Optional(Type.String()),
    type: Type.Optional(Type.String()),
    routetype: LinkAttrRouteType,
    direction: Type.Optional(LinkAttrRouteFil),
    order: LinkAttrRouteOrder
})

export const LinkAttr = Type.Object({
    _attributes: LinkAttrAttributes
})

export const TakRequestAttributes = Type.Object({
    _attributes: Type.Optional(Type.Object({
        version: Type.Optional(Type.String())
    }))
});

export const TakResponseAttributes = Type.Object({
    _attributes: Type.Optional(Type.Object({
        status: Type.Boolean()
    }))
});

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
        argb: Type.Optional(Type.Integer()),

        // Have seen this used in range and bearing
        value: Type.Optional(Type.Integer())
    }))
})

export const GenericStringAttributes = Type.Object({
    _attributes: Type.Optional(Type.Object({
        value: Type.Optional(Type.String())
    }))
})

export const GenericBooleanAttributes = Type.Object({
    _attributes: Type.Optional(Type.Object({
        value: Type.Optional(Type.Boolean())
    }))
})

export const GenericIntegerAttributes = Type.Object({
    _attributes: Type.Optional(Type.Object({
        value: Type.Optional(Type.Integer())
    }))
})

export const GenericNumberAttributes = Type.Object({
    _attributes: Type.Optional(Type.Object({
        value: Type.Optional(Type.Number())
    }))
})

export const GenericOptionalText = Type.Object({
    _text: Type.Optional(Type.String())
})

export const GenericText = Type.Object({
    _text: Type.String()
})

export const GenericTextBoolean = Type.Object({
    _text: Type.Boolean()
})

export const GenericTextInteger = Type.Object({
    _text: Type.Integer()
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
    major: Type.Number({
        description: 'The major axis of the ellipse in meters'
    }),
    minor: Type.Number({
        description: 'The minor axis of the ellipse in meters'
    }),
    angle: Type.Number({
        description: 'The angle of the ellipse in degrees'
    }),
})

export const ShapeEllipse = Type.Object({
    _attributes: ShapeEllipseAttributes,
})

export const ShapeLink = Type.Object({
    _attributes: Type.Object({
        uid: Type.Optional(Type.String()),
        type: Type.Optional(Type.String()),
        relation: Type.Optional(Type.String()),
    }),

    Style: Type.Optional(Type.Object({
        LineStyle: Type.Optional(Type.Object({
            color: Type.Optional(Type.Object({
                _text: Type.String()
            })),
            width: Type.Optional(Type.Object({
                _text: Type.Number()
            }))
        })),
        PolyStyle: Type.Optional(Type.Object({
            color: Type.Optional(Type.Object({
                _text: Type.String()
            })),
            width: Type.Optional(Type.Object({
                _text: Type.Number()
            }))
        }))
    }))
});

export const Shape = Type.Object({
    polyline: Type.Optional(ShapePolyLine),
    ellipse: Type.Optional(ShapeEllipse),
    link: Type.Optional(Type.Union([Type.Array(ShapeLink), ShapeLink]))
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

export const MissionChangeContentResource = Type.Object({
    expiration: GenericText,
    filename: Type.Optional(GenericText),
    hash: GenericText,
    name: GenericText,
    size: GenericTextInteger,
    submissionTime: GenericText,
    submitter: GenericText,
    tool: Type.Optional(GenericText),
    uid: GenericText
});

export const MissionChange = Type.Object({
    contentUid: Type.Optional(GenericText),
    creatorUid: GenericOptionalText,
    isFederatedChange: GenericTextBoolean,
    missionName: GenericText,
    missionGuid: Type.Optional(GenericText),
    timestamp: GenericText,
    type: GenericText,
    contentResource: Type.Optional(MissionChangeContentResource),
    details: Type.Optional(MissionChangeDetails)
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

    fovBlue: Type.Optional(Type.Number()),
    fovAlpha: Type.Optional(Type.Number()),
    fovGreen: Type.Optional(Type.Number()),
    fovRed: Type.Optional(Type.Number()),
    strokeWeight: Type.Optional(Type.Number()),
    strokeColor: Type.Optional(Type.Number()),
    rangeLines: Type.Optional(Type.Number()),
    rangeLineStrokeWeight: Type.Optional(Type.Number()),
    rangeLineStrokeColor: Type.Optional(Type.Number()),
    displayMagneticReference: Type.Optional(Type.Number()),
    hideFov: Type.Optional(Type.Boolean()),

    type: Type.Optional(Type.String()),
    version: Type.Optional(Type.String()),
    model: Type.Optional(Type.String())
});

export const Sensor = Type.Object({
    _attributes: SensorAttributes
})

export const VideoAttributes = Type.Object({
    uid: Type.Optional(Type.String()),
    sensor: Type.Optional(Type.String()),
    spi: Type.Optional(Type.String()),
    url: Type.Optional(Type.String())
});

export const VideoConnectionEntryAttributes = Type.Object({
    uid: Type.String(),
    address: Type.String(),
    networkTimeout: Type.Optional(Type.Integer()),
    path: Type.Optional(Type.String()),
    protocol: Type.Optional(Type.String()),
    bufferTime: Type.Optional(Type.Integer()),
    port: Type.Optional(Type.Integer()),
    roverPort: Type.Optional(Type.Integer()),
    rtspReliable: Type.Optional(Type.Integer()),
    ignoreEmbeddedKLV: Type.Optional(Type.Boolean()),
    alias: Type.Optional(Type.String())
})

export const VideoConnectionEntry = Type.Object({
    _attributes: VideoConnectionEntryAttributes
})

export const Video = Type.Object({
    _attributes: Type.Optional(VideoAttributes),
    ConnectionEntry: Type.Optional(VideoConnectionEntry)
})

export const GeofenceAttributes = Type.Object({
    elevationMonitored: Type.Optional(Type.Boolean()),
    minElevation: Type.Optional(Type.String()),
    maxElevation: Type.Optional(Type.String()),
    monitor: Type.Optional(Type.String()),
    trigger: Type.Optional(Type.String()),
    tracking: Type.Optional(Type.Boolean()),
    boundingSphere: Type.Optional(Type.Number()),
});

export const Geofence = Type.Object({
    _attributes: GeofenceAttributes
})

export const MilsymUnitModifier = Type.Object({
    _attributes: Type.Object({
        code: Type.String()
    }),
    _text: Type.Optional(Type.String())
});

export const MilsymAttributes = Type.Object({
    id: Type.String(),
});

export const Milsym = Type.Object({
    _attributes: MilsymAttributes,
    unitmodifier: Type.Optional(Type.Union([MilsymUnitModifier, Type.Array(MilsymUnitModifier)]))
})

export const MilIconAttributes = Type.Object({
    id: Type.String(),
});

// https://wiki.tak.gov/spaces/DEV/pages/116031525/Single+Multi+Point+Symbology
// I know this exists but don't have examples as of yet
export const MilIcon = Type.Object({
    _attributes: MilIconAttributes,
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
        // TPC says this is required by ATAK-MIL 5.3.0.5 didn't include it
        Droid: Type.Optional(Type.String()),
        nett: Type.Optional(Type.String()),
        // Unknown, seen in the same 5.3.0.5 client
        alertable: Type.Optional(Type.Boolean())
    })
})

export const CreatorAttributes = Type.Object({
    uid: Type.String({
        description: 'The Unique ID of the creator of the CoT'
    }),
    callsign: Type.String({
        description: 'The Callsign of the creator of the CoT'
    }),
    time: Type.Optional(Type.String({
        description: 'Time at which the CoT was created by the creator'
    })),
    type: Type.String({
        description: 'The Type of the creator - typically a- for things on the ground, b- for digital things, etc'
    })
})

export const Creator = Type.Object({
    _attributes: CreatorAttributes
})

export const ContactAttributes = Type.Object({
    phone: Type.Optional(Type.String()),
    name: Type.Optional(Type.String()),
    callsign: Type.Optional(Type.String()),
    endpoint: Type.Optional(Type.String())
})

export const Contact = Type.Object({
    _attributes: ContactAttributes
})

export const MartiDestAttributes = Type.Object({
    uid: Type.Optional(Type.String()),
    callsign: Type.Optional(Type.String()),
    group: Type.Optional(Type.String()),

    mission: Type.Optional(Type.String()),
    'mission-guid': Type.Optional(Type.String()),
    after: Type.Optional(Type.String()),
    path: Type.Optional(Type.String())
})

export const MartiDest = Type.Object({
    _attributes: MartiDestAttributes
})

export const Marti = Type.Object({
    _attributes: Type.Optional(Type.Object({
        archive: Type.Optional(Type.Boolean({
            description: 'Instructs the TAK Server to archive this message'
        })),
    })),
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
    value: Type.Number()
});

export const Range = Type.Object({
    _attributes: RangeAttributes,
});

export const RangeUnitsAttributes = Type.Object({
    value: Type.Integer()
});

export const RangeUnits = Type.Object({
    _attributes: RangeUnitsAttributes,
});

export const BearingAttributes = Type.Object({
    value: Type.Number()
});

export const Bearing = Type.Object({
    _attributes: BearingAttributes,
});

export const BearingUnitsAttributes = Type.Object({
    value: Type.Integer()
});

export const BearingUnits = Type.Object({
    _attributes: BearingUnitsAttributes,
});

export const InclinationAttributes = Type.Object({
    value: Type.Number()
});

export const Inclination = Type.Object({
    _attributes: InclinationAttributes,
});

export const Display = Type.Object({
    _attributes: Type.Object({
        minzoom: Type.Optional(Type.Number({
            description: 'The minimum zoom level at which to display the feature'
        })),
        maxzoom: Type.Optional(Type.Number({
            description: 'The maximum zoom level at which to display the feature'
        })),
        rotate: Type.Optional(Type.Boolean({
            description: 'Whether to rotate the icon based on heading'
        })),
    })
});

export const NorthRefAttributes = Type.Object({
    value: Type.Number()
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
    _attributes: Type.Optional(Type.Object({
        iconsetpath: Type.String()
    }))
})

export const ForceDelete = Type.Object({})

export const ShapeExtras = Type.Object({
    _attributes: Type.Object({
        cpvis: Type.Optional(Type.Boolean()),
        editable: Type.Optional(Type.Boolean()),
    })
});

export const Detail = Type.Object({
    contact: Type.Optional(Contact),
    tog: Type.Optional(TogAttributes),
    '__group': Type.Optional(Group),
    '__chat': Type.Optional(Chat),
    '__video': Type.Optional(Video),
    '__geofence': Type.Optional(Geofence),
    '__milsym': Type.Optional(Milsym),
    '__milicon': Type.Optional(MilIcon),
    '__routeinfo': Type.Optional(RouteInfo),
    '__forcedelete': Type.Optional(ForceDelete),
    '__shapeExtras': Type.Optional(ShapeExtras),
    '_flow-tags_': Type.Optional(FlowTags),
    uid: Type.Optional(Uid),
    emergency: Type.Optional(Emergency),
    status: Type.Optional(Status),
    creator: Type.Optional(Creator),
    fileshare: Type.Optional(FileShare),
    ackrequest: Type.Optional(ACKRequest),
    remarks: Type.Optional(Remarks),
    precisionlocation: Type.Optional(PrecisionLocation),
    color: Type.Optional(Type.Union([Type.Array(ColorAttributes), ColorAttributes])),
    strokeColor: Type.Optional(GenericIntegerAttributes),
    archive: Type.Optional(Type.Union([GenericStringAttributes, Type.Array(GenericStringAttributes)])),
    strokeWeight: Type.Optional(GenericNumberAttributes),
    strokeStyle: Type.Optional(GenericStringAttributes),
    labels_on: Type.Optional(GenericBooleanAttributes),
    fillColor: Type.Optional(GenericIntegerAttributes),
    mission: Type.Optional(Mission),
    shape: Type.Optional(Shape),

    link: Type.Optional(Type.Union([Link, Type.Array(Link)])),
    link_attr: Type.Optional(LinkAttr),

    // Custom Attributes related to CloudTAK Display
    display: Type.Optional(Display),
    // ---------------------------------------------

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
        TakRequest: Type.Optional(TakRequestAttributes),
        TakResponse: Type.Optional(TakResponseAttributes),
        TakProtocolSupport: Type.Optional(ProtocolSupportAttributes),
        TakServerVersionInfo: Type.Optional(ServerVersionAttributes)
    }))
})

export const Point = Type.Object({
    _attributes: Type.Object({
        lat: Type.Number(),
        lon: Type.Number(),
        hae: Type.Number(),
        // Are Occasionally seen as "NaN"
        ce: Type.Union([Type.Number(), Type.String()]),
        le: Type.Union([Type.Number(), Type.String()])
    })
})

export default Type.Object({
    event: Type.Object({
        _attributes: EventAttributes,
        detail: Type.Optional(Detail),
        point: Point,
    }),
})
