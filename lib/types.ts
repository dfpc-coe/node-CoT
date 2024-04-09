export interface EventAttributes {
    version: string,
    uid: string;
    type: string;
    how: string;
    [k: string]: string;
}

export interface GenericAttributes {
    _attributes: {
        [k: string]: string;
    }
}

export interface Track {
    _attributes: TrackAttributes;
}

export interface Chat {
    _attributes: {
        parent?: string;
        groupOwner?: string;
        messageId?: string;
        chatroom: string;
        id: string;
        senderCallsign: string;
        [k: string]: string | undefined;
    }

    chatgrp: GenericAttributes
}

export interface TrackAttributes {
    speed?: string,
    course?: string,
    slope?: string;
    eCourse?: string;
    eSpeed?: string;
    eSlope?: string
    [k: string]: string | undefined
}

export interface TakVersion {
    _attributes: {
        device?: string;
        platform?: string;
        os?: string;
        version?: string;
        [k: string]: string | undefined
    }
}

export interface FlowTags {
    _attributes?: {
        [k: string]: string
    }
    [k: string]: string | undefined | object;
}

export interface Group {
    _attributes?: {
        name: string;
        role: string;
        [k: string]: string;
    }
}

export interface Status {
    _attributes: {
        [k: string]: string;
    }
}

export interface Uid {
    _attributes: {
        Droid: string;
        [k: string]: string;
    }
}

export interface Contact {
    _attributes: {
        phone?: string;
        callsign: string;
        endpoint?: string;
        [k: string]: string | undefined;
    }
}

export interface Marti {
    _attributes?: {
        [k: string]: string | undefined;
    }

    dest?: MartiDest | MartiDest[]
}

export interface MartiDest {
    _attributes: {
        uid?: string;
        mission?: string;
        callsign?: string;
    }
}

export interface Remarks {
    _attributes?: {
        source?: string;
        to?: string;
        time?: string;
        [k: string]: string | undefined;
    }
    _text?: string;
}

export interface PrecisionLocation {
    _attributes: {
        geopointsrc?: string;
        altsrc?: string;
        [k: string]: string | undefined;
    }
}

export interface UserIcon {
    _attributes: {
        iconsetpath: string;
        [k: string]: string;
    }
}

export interface Detail {
    contact?: Contact;
    tog?: GenericAttributes;
    '__group'?: Group;
    '__chat'?: Chat;
    '_flow-tags_'?: FlowTags;
    uid?: Uid;
    status?: Status;
    remarks?: Remarks;
    precisionlocation?: PrecisionLocation;
    strokeColor?: GenericAttributes;
    strokeWeight?: GenericAttributes;
    strokeStyle?: GenericAttributes;
    labels_on?: GenericAttributes;
    fillColor?: GenericAttributes;
    link?: GenericAttributes | GenericAttributes[];
    usericon?: UserIcon;
    track?: Track;
    takv?: TakVersion;
    marti?: Marti;
    TakControl?: {
        TakServerVersionInfo?: GenericAttributes
    };
    [k: string]: unknown;
}

export interface Point {
    _attributes: {
        lat: string | number;
        lon: string | number;
        hae: string | number;
        ce: string | number;
        le: string | number;
        [k: string]: string | number
    }
}

export default interface JSONCoT {
    event: {
        _attributes: EventAttributes,
        detail?: Detail,
        point: Point,
        [k: string]: unknown
    },
    [k: string]: unknown
}
