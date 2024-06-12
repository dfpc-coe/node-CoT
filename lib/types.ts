import { Type } from '@sinclair/typebox';

export const EventAttributes = Type.Object({
    version: Type.String(),
    uid: Type.String(),
    type: Type.String(),
    how: Type.Optional(Type.String()),

    access: Type.Optional(Type.String()),
    qos: Type.Optional(Type.String()),
    opex: Type.Optional(Type.String()),

    time: Type.String(),
    stale: Type.String(),
    start: Type.String(),
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
})

export const Link = Type.Object({
    _attributes: LinkAttributes
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

export const SensorAttributes = Type.Object({
    elevation: Type.Optional(Type.String()),
    vfov: Type.Optional(Type.String()),
    fov: Type.Optional(Type.String()),
    type: Type.Optional(Type.String()),
    version: Type.Optional(Type.String()),
    north: Type.Optional(Type.String()),
    roll: Type.Optional(Type.String()),
    range: Type.Optional(Type.String()),
    azimuth: Type.Optional(Type.String()),
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
    _attributes: VideoAttributes
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

export const Detail = Type.Object({
    contact: Type.Optional(Contact),
    tog: Type.Optional(TogAttributes),
    '__group': Type.Optional(Group),
    '__chat': Type.Optional(Chat),
    '__video': Type.Optional(Video),
    '_flow-tags_': Type.Optional(FlowTags),
    uid: Type.Optional(Uid),
    status: Type.Optional(Status),
    fileshare: Type.Optional(FileShare),
    ackrequest: Type.Optional(ACKRequest),
    remarks: Type.Optional(Remarks),
    precisionlocation: Type.Optional(PrecisionLocation),
    color: Type.Optional(ColorAttributes),
    strokeColor: Type.Optional(GenericAttributes),
    archive: Type.Optional(GenericAttributes),
    strokeWeight: Type.Optional(GenericAttributes),
    strokeStyle: Type.Optional(GenericAttributes),
    labels_on: Type.Optional(GenericAttributes),
    fillColor: Type.Optional(GenericAttributes),
    link: Type.Optional(Type.Union([Link, Type.Array(Link)])),
    usericon: Type.Optional(UserIcon),
    track: Type.Optional(Track),
    sensor: Type.Optional(Sensor),
    takv: Type.Optional(TakVersion),
    marti: Type.Optional(Marti),
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
        detail: Type.Optional(Type.Index(Detail, Type.KeyOf(Detail))),
        point: Point,
    }),
})
