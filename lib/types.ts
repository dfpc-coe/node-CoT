import { Type } from '@sinclair/typebox';

export const EventAttributes = Type.Object({
    version: Type.String(),
    uid: Type.String(),
    type: Type.String(),
    how: Type.String()
});

export const GenericAttributes = Type.Object({
    _attributes: Type.Optional(Type.Object({}))
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
    _attributes: TrackAttributes
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
    chatgrp: GenericAttributes
})

export const TakVersion = Type.Object({
    _attributes: Type.Object({
        device: Type.Optional(Type.String()),
        platform: Type.Optional(Type.String()),
        os: Type.Optional(Type.String()),
        version: Type.Optional(Type.String())
    })
})

export const FlowTags = Type.Object({
    _attributes: Type.Optional(Type.Object({}))
})

export const Group = Type.Object({
    _attributes: Type.Optional(Type.Object({
        name: Type.String(),
        role: Type.String()
    }))
})

export const Status = Type.Object({
    _attributes: Type.Object({
        battery: Type.Optional(Type.String()),
        readiness: Type.Optional(Type.String())
    })
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

export const MartiDest = Type.Object({
    _attributes: Type.Object({
        uid: Type.Optional(Type.String()),
        mission: Type.Optional(Type.String()),
        callsign: Type.Optional(Type.String())
    })
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

export const PrecisionLocation = Type.Object({
    _attributes: Type.Object({
        geopointsrc: Type.Optional(Type.String()),
        altsrc: Type.Optional(Type.String())
    })
})

export const UserIcon = Type.Object({
    _attributes: Type.Object({
        iconsetpath: Type.String()
    })
})

export const Detail = Type.Object({
    contact: Type.Optional(Contact),
    tog: Type.Optional(GenericAttributes),
    '__group': Type.Optional(Group),
    '__chat': Type.Optional(Chat),
    '_flow-tags_': Type.Optional(FlowTags),
    uid: Type.Optional(Uid),
    status: Type.Optional(Status),
    remarks: Type.Optional(Remarks),
    precisionlocation: Type.Optional(PrecisionLocation),
    strokeColor: Type.Optional(GenericAttributes),
    archived: Type.Optional(GenericAttributes),
    strokeWeight: Type.Optional(GenericAttributes),
    strokeStyle: Type.Optional(GenericAttributes),
    labels_on: Type.Optional(GenericAttributes),
    fillColor: Type.Optional(GenericAttributes),
    link: Type.Optional(Type.Union([GenericAttributes, Type.Array(GenericAttributes)])),
    usericon: Type.Optional(UserIcon),
    track: Type.Optional(Track),
    takv: Type.Optional(TakVersion),
    marti: Type.Optional(Marti),
    TakControl: Type.Optional(Type.Object({
        TakServerVersionInfo: Type.Optional(GenericAttributes)
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
