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
    swapAxis: Type.Optional(Type.Boolean({
        description: 'Whether the ellipse axes should be swapped when rendered by TAK clients'
    }))
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

export const SpatialAttitudeAttributes = Type.Object({
    roll: Type.Number({
        description: 'Roll of entity in degrees. Positive indicates listing to the right.'
    }),
    pitch: Type.Number({
        description: 'Pitch of entity in degrees. Positive indicates nose point up.'
    }),
    yaw: Type.Optional(Type.Number({
        description: 'Yaw of entity in degrees. Positive indicates turned to the right.'
    })),
    eRoll: Type.Optional(Type.Number({
        description: '1-sigma error of roll with respect to a zero mean normal Gaussian distribution.'
    })),
    ePitch: Type.Optional(Type.Number({
        description: '1-sigma error of pitch with respect to a zero mean normal Gaussian distribution.'
    })),
    eYaw: Type.Optional(Type.Number({
        description: '1-sigma error of yaw with respect to a zero mean normal Gaussian distribution.'
    }))
});

export const SpatialAttitude = Type.Object({
    _attributes: SpatialAttitudeAttributes
});

export const SpatialSpinAttributes = Type.Object({
    roll: Type.Number({
        description: 'Degrees per second with positive indicating to the pilots right'
    }),
    pitch: Type.Number({
        description: 'Degrees per second with positive indicating nose up.'
    }),
    yaw: Type.Optional(Type.Number({
        description: 'Degrees per second with positive indicating right.'
    })),
    eRoll: Type.Optional(Type.Number({
        description: '1-sigma error of roll with respect to a zero mean normal Gaussian distribution.'
    })),
    ePitch: Type.Optional(Type.Number({
        description: '1-sigma error of pitch with respect to a zero mean normal Gaussian distribution.'
    })),
    eYaw: Type.Optional(Type.Number({
        description: '1-sigma error of yaw with respect to a zero mean normal Gaussian distribution.'
    }))
});

export const SpatialSpin = Type.Object({
    _attributes: SpatialSpinAttributes
});

export const Spatial = Type.Object({
    _attributes: Type.Optional(Type.Object({
        version: Type.Optional(Type.Number({
            description: 'Version tag for this sub schema.'
        }))
    })),
    attitude: SpatialAttitude,
    spin: SpatialSpin
});

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
    callsign: Type.Optional(Type.String({
        description: 'The Callsign of the creator of the CoT'
    })),
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
        cpvis: Type.Optional(Type.Boolean({
            description: 'Determines if the center point & callsign are visible when the shape is rendered in TAK clients'
        })),
        editable: Type.Optional(Type.Boolean()),
    })
});

// === CBRN Sensor Schemas (RadCoT, ChemCoT, BioCoT) ===

// RadCoT Enums
export const RadMeasurementType = Type.Enum({
    alpha: 'alpha',
    beta: 'beta',
    gamma: 'gamma',
    neutron: 'neutron',
    doserate: 'doserate'
});

export const RadDistanceToSource = Type.Enum({
    MOVE_MUCH_CLOSER: 'MOVE_MUCH_CLOSER',
    MOVE_CLOSER: 'MOVE_CLOSER',
    OPTIMAL: 'OPTIMAL',
    MOVE_AWAY: 'MOVE_AWAY',
    MOVE_FAR_AWAY: 'MOVE_FAR_AWAY'
});

export const RadModuleLocation = Type.Enum({
    FRONT_LEFT: 'FRONT_LEFT',
    FRONT_RIGHT: 'FRONT_RIGHT',
    REAR_LEFT: 'REAR_LEFT',
    REAR_RIGHT: 'REAR_RIGHT',
    CAB: 'CAB'
});

// RadCoT Sensor Data Attributes
export const RadSensorDataAttributes = Type.Object({
    time: Type.String({
        description: 'epoch time in Long format'
    }),
    model: Type.String({
        description: 'The model of sensor (Micro Detective, IdentiFINDER 2, etc.) in string format'
    }),
    neutronstatus: Type.String({
        description: 'The neutron detector status (Full, Reduced or Unknown). Not available for most sensors, default to Unknown'
    }),
    gammastatus: Type.String({
        description: 'The gamma detector status (Full, Reduced or Unknown). Not available for most sensors, default to Unknown'
    }),
    manufacturer: Type.String({
        description: 'The Manufacturer of the sensor (Ortec, Nucsafe, etc.) in string format'
    }),
    callsign: Type.Optional(Type.String({
        description: 'The name of the given sensor in string format'
    })),
    serialnumber: Type.String({
        description: 'The Serial Number of the Sensor in string format'
    }),
    batterylevel: Type.Optional(Type.Number({
        description: 'The battery level as a percentage, float value'
    })),
    id_algorithm: Type.Optional(Type.String({
        description: 'The ID algorithm used to ID isotopes (ex. GADRAS)'
    })),
    search_algorithm: Type.Optional(Type.String({
        description: 'The search algorithm used (ex. RDAK, SAMBA)'
    })),
    alarm_algorithm: Type.Optional(Type.String({
        description: 'The alarm algorithm used (ex. RDAK, SAMBA)'
    })),
    ordinal: Type.Optional(Type.Integer({
        description: 'Used internally by the CBRN plugin'
    })),
    subchannel: Type.Optional(Type.String({
        description: 'Identifier of this subchannel, if this event is a report from a subchannel of a master sensor'
    })),
    measurement_ref: Type.Optional(Type.Integer({
        description: 'Used to align subchannels'
    })),
    master_sensor_manufacturer: Type.Optional(Type.String({
        description: 'Name of the master sensor, if this event is a report from a subchannel'
    })),
    master_sensor_serial: Type.Optional(Type.String({
        description: 'Serial number of the master sensor, if this event is a report from a subchannel'
    })),
    source_bearing: Type.Optional(Type.Integer({
        description: 'A bearing in positive degrees if the sensor reports back a direction for the detected source, -1 otherwise'
    })),
    source_strength: Type.Optional(Type.Number({
        description: 'A scale from 0 - 0.5 giving the magnitude of the source strength in the direction of source_bearing'
    })),
    relay_type: Type.Optional(Type.String({
        description: 'Used for sensors that can relay data from other sensors, or that can be relayed in that way'
    })),
    module_location: Type.Optional(Type.String({
        description: 'The location of the sensor where it\'s being worn on the vest'
    })),
    detector_number: Type.Optional(Type.Integer({
        description: 'The number from the sensor needed in order to retrieve any specific algorithm calculated data'
    })),
    mission_total_mR: Type.Optional(Type.Integer({
        description: 'The total mR configured for the sensor\'s current mission'
    })),
    mission_stay_time_sec: Type.Optional(Type.Integer({
        description: 'The total seconds remaining of mission time based on current configuration of sensor and acquired dose'
    })),
    mission_acquired_uR: Type.Optional(Type.Integer({
        description: 'The total uR acquired by the sensor for the current mission'
    })),
    sensor_temp_deg_c: Type.Optional(Type.Number({
        description: 'The temperature of the sensor in degrees celsius'
    })),
    heading: Type.Optional(Type.Number({
        description: 'The current directional heading of the sensor'
    })),
    source_distance: Type.Optional(RadDistanceToSource),
    attachedUid: Type.Optional(Type.String({
        description: 'The UID of the TAK marker that this sensor is attached to'
    })),
    simulated: Type.Optional(Type.Boolean({
        description: 'Is the data in this element representative of a simulated sensor'
    }))
});

export const RadSensorData = Type.Object({
    _attributes: RadSensorDataAttributes
});

// RadCoT Measurement
export const RadMeasurementAttributes = Type.Object({
    nalarmstddev: Type.Integer({
        description: 'Defines the alarm level, could be standard deviations above background. Will default to 0 (no alarm)'
    }),
    alarm: Type.Integer({
        description: 'Alarm flag for the measurement. 1 = alarmed, 0 = not alarmed'
    }),
    measurement: Type.Number({
        description: 'The measurement value as a float. A/B/G/N will be interpreted as CPS. Dose Rate will be interpreted as mR/Hr'
    }),
    name: RadMeasurementType
});

export const RadMeasurement = Type.Object({
    _attributes: RadMeasurementAttributes
});

// RadCoT Physical Module
export const RadPhysicalModuleAttributes = Type.Object({
    location: RadModuleLocation,
    gamma_cps: Type.Number({
        description: 'Gamma counts per second'
    }),
    gamma_alarm: Type.Integer({
        description: 'Alarm level for the measurement. 0 = not alarmed, > 0 = alarm level'
    }),
    gamma_dose_rate: Type.Number({
        description: 'The gamma dose rate. Will be interpreted as uR/Hr'
    })
});

export const RadPhysicalModule = Type.Object({
    _attributes: RadPhysicalModuleAttributes
});

// RadCoT Search Algorithm
export const RadSearchAlgorithmAttributes = Type.Object({
    neutron_loc: Type.Number({
        description: 'The Neutron localization value'
    }),
    gamma_loc: Type.Number({
        description: 'The Gamma localization value'
    }),
    neutron_loc_alarm_value: Type.Number({
        description: 'The Neutron localization alarm level'
    }),
    gamma_loc_alarm_value: Type.Number({
        description: 'The Gamma localization alarm level'
    }),
    neutron_loc_alarm: Type.Integer({
        description: 'Alarm flag for the neutron localization value. 1 = alarmed, 0 = not alarmed'
    }),
    gamma_loc_alarm: Type.Integer({
        description: 'Alarm flag for the gamma localization value. 1 = alarmed, 0 = not alarmed'
    })
});

export const RadSearchAlgorithm = Type.Object({
    _attributes: RadSearchAlgorithmAttributes
});

// RadCoT Spectrum
export const RadSpectrumAttributes = Type.Object({
    zerocompression: Type.Integer({
        description: 'Flag for zero compression. 1 = zero compressed, 0 = not compressed'
    }),
    type: Type.String({
        description: 'FOREGROUND or BACKGROUND'
    }),
    livetime_ms: Type.String({
        description: 'Spectrum live time in epoch time (ms)'
    }),
    realtime_ms: Type.String({
        description: 'Spectrum real time in epoch time (ms)'
    }),
    channeldata: Type.String({
        description: 'The spectral channel data'
    }),
    crystal_id: Type.Optional(Type.String({
        description: 'The ID of the crystal reporting the channel data'
    }))
});

export const RadSpectrum = Type.Object({
    _attributes: RadSpectrumAttributes
});

// RadCoT Isotope
export const RadIsotopeAttributes = Type.Object({
    confidence: Type.Number({
        description: 'The confidence value as a float representation of a percentage (88.5 NOT 0.885)'
    }),
    name: Type.String({
        description: 'The name of the isotope'
    }),
    type: Type.String({
        description: 'The type of the isotope'
    })
});

export const RadIsotope = Type.Object({
    _attributes: RadIsotopeAttributes
});

// RadCoT Permissions
export const RadPermissionsAttributes = Type.Object({
    all: Type.Boolean({
        description: 'All is true if all users should have access/permission'
    }),
    contact_list: Type.String({
        description: 'The list of ATAK UIDs that should have access/permission'
    })
});

export const RadDataPermissions = Type.Object({
    _attributes: RadPermissionsAttributes
});

export const RadCommandPermissions = Type.Object({
    _attributes: RadPermissionsAttributes
});

// RadCoT Main Element
export const RadSensorDetail = Type.Object({
    sensor_data: RadSensorData,
    radmeasurement: Type.Optional(Type.Union([RadMeasurement, Type.Array(RadMeasurement)])),
    physical_module: Type.Optional(Type.Union([RadPhysicalModule, Type.Array(RadPhysicalModule)])),
    search_algorithm: Type.Optional(RadSearchAlgorithm),
    spectrum: Type.Optional(Type.Union([RadSpectrum, Type.Array(RadSpectrum)])),
    isotope: Type.Optional(Type.Union([RadIsotope, Type.Array(RadIsotope)])),
    data_permissions: Type.Optional(RadDataPermissions),
    command_permissions: Type.Optional(RadCommandPermissions)
});

// ChemCoT Sensor Data Attributes
export const ChemSensorDataAttributes = Type.Object({
    manufacturer: Type.String({
        description: 'The Manufacturer of the sensor in string format'
    }),
    model: Type.String({
        description: 'The model of sensor in string format'
    }),
    serialnumber: Type.String({
        description: 'The Serial Number of the Sensor in string format'
    }),
    batterylevel: Type.Optional(Type.Number({
        description: 'The battery level as a percentage, float value'
    })),
    callsign: Type.Optional(Type.String({
        description: 'The name of the given sensor in string format. Default name is Manufacturer+SerialNum'
    })),
    revision: Type.Optional(Type.Number({
        description: 'The revision of the ChemCoT format, at writing this is "7"'
    })),
    status: Type.Optional(Type.String({
        description: 'General sensor health status'
    })),
    ordinal: Type.Optional(Type.Integer({
        description: 'Used internally by the CBRN plugin'
    })),
    attachedUid: Type.Optional(Type.String({
        description: 'The UID of the TAK marker that this sensor is attached to'
    })),
    simulated: Type.Optional(Type.Boolean({
        description: 'Is the data in this element representative of a simulated sensor'
    }))
});

export const ChemSensorData = Type.Object({
    _attributes: ChemSensorDataAttributes
});

// ChemCoT Detection
export const ChemDetectionAttributes = Type.Object({
    time: Type.String({
        description: 'Timestamp for the detection, epoch time (ms)'
    }),
    agent: Type.String({
        description: 'Chemical Name in string format'
    }),
    quantity: Type.Number({
        description: 'Amount of chemical detected as a float. Could be mass, density, bars etc.'
    }),
    quantityunits: Type.String({
        description: 'The units used to describe the quantity'
    }),
    concentration: Type.Optional(Type.Number({
        description: 'Concentration of chemical in Kg/m^3'
    })),
    alarm: Type.Number({
        description: 'Alarm state of the sensor. 1 = alarm, 0 = no alarm'
    }),
    confidence: Type.Optional(Type.Number({
        description: 'The confidence of the detection from the sensor as a percentage'
    })),
    massfraction: Type.Optional(Type.Number({
        description: 'The mass fraction of the detection from the sensor in ppm'
    })),
    percent: Type.Optional(Type.Number({
        description: 'The percentage of the detection from the sensor in percent from 0-100'
    })),
    class: Type.Optional(Type.String({
        description: 'The class of chemical detected. Nerve, Blood, TIC, etc.'
    })),
    id: Type.Optional(Type.Integer({
        description: 'The ID number of the detection'
    }))
});

export const ChemDetection = Type.Object({
    _attributes: ChemDetectionAttributes
});

// ChemCoT Main Element
export const ChemSensorDetail = Type.Object({
    sensor_data: ChemSensorData,
    detection: Type.Optional(Type.Union([ChemDetection, Type.Array(ChemDetection)]))
});

// BioCoT Sensor Data Attributes
export const BioSensorDataAttributes = Type.Object({
    manufacturer: Type.String({
        description: 'The Manufacturer of the sensor in string format'
    }),
    model: Type.String({
        description: 'The model of sensor in string format'
    }),
    serialnumber: Type.String({
        description: 'The Serial Number of the Sensor in string format'
    }),
    batterylevel: Type.Optional(Type.Number({
        description: 'The battery level as a percentage, float value'
    })),
    callsign: Type.Optional(Type.String({
        description: 'The name of the given sensor in string format. Default name is Manufacturer+SerialNum'
    })),
    revision: Type.Optional(Type.Number({
        description: 'The revision of the BioCoT format'
    })),
    status: Type.Optional(Type.String({
        description: 'General sensor health status'
    })),
    ordinal: Type.Optional(Type.Integer({
        description: 'Used internally by the CBRN plugin'
    })),
    attachedUid: Type.Optional(Type.String({
        description: 'The UID of the TAK marker that this sensor is attached to'
    })),
    simulated: Type.Optional(Type.Boolean({
        description: 'Is the data in this element representative of a simulated sensor'
    }))
});

export const BioSensorData = Type.Object({
    _attributes: BioSensorDataAttributes
});

// BioCoT Measurement Level
export const BioMeasurementLevelAttributes = Type.Object({
    levelName: Type.String({
        description: 'The name of this measurement level'
    }),
    levelValue: Type.String({
        description: 'The value of this measurement level'
    })
});

export const BioMeasurementLevel = Type.Object({
    _attributes: BioMeasurementLevelAttributes
});

// BioCoT Measurement
export const BioMeasurementAttributes = Type.Object({
    time: Type.String({
        description: 'Timestamp for the measurement, epoch time (ms)'
    }),
    bioClass: Type.Optional(Type.String({
        description: 'Biological class'
    })),
    type: Type.Optional(Type.String({
        description: 'Biological type'
    })),
    channel: Type.Optional(Type.Integer({
        description: 'Channel identifier'
    })),
    harmful: Type.Optional(Type.Boolean({
        description: 'Is this bio measurement harmful'
    })),
    doseTime: Type.Optional(Type.Integer({
        description: 'Dose Time'
    })),
    dose: Type.Number({
        description: 'Amount of dose'
    }),
    confidence: Type.Optional(Type.Number({
        description: 'The confidence of the measurement from the sensor as a percentage'
    })),
    confirmationLevel: Type.Optional(Type.String({
        description: 'Confirmation level'
    })),
    concentration: Type.Optional(Type.Number({
        description: 'Concentration'
    })),
    sampleId: Type.Optional(Type.String({
        description: 'Sample ID of this measurement'
    })),
    persistency: Type.Optional(Type.String({
        description: 'Persistency'
    }))
});

export const BioMeasurement = Type.Object({
    _attributes: BioMeasurementAttributes,
    level: Type.Optional(Type.Union([BioMeasurementLevel, Type.Array(BioMeasurementLevel)]))
});

// BioCoT Main Element
export const BioSensorDetail = Type.Object({
    sensor_data: BioSensorData,
    measurement: Type.Optional(Type.Union([BioMeasurement, Type.Array(BioMeasurement)]))
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
    // Controls the display of distance calculation labels on the edge of line/polygon features
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
    })),

    // CBRN Sensor Details
    radsensordetail: Type.Optional(RadSensorDetail),
    chemsensordetail: Type.Optional(ChemSensorDetail),
    biosensordetail: Type.Optional(BioSensorDetail),

    // Spatial information
    spatial: Type.Optional(Spatial)
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
