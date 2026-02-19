import Err from '@openaddresses/batch-error';
import type { Static } from '@sinclair/typebox';
import type {
    Feature,
    Polygon,
    FeaturePropertyMission,
    FeaturePropertyMissionLayer,
} from '../types/feature.js';
import type {
    MartiDest,
    MartiDestAttributes,
    Link,
    LinkAttributes,
    ColorAttributes,
} from '../types/types.js'
import Ellipse from '@turf/ellipse';
import Truncate from '@turf/truncate';
import { destination } from '@turf/destination';
import Color from '../utils/color.js';
import JSONCoT from '../types/types.js'
import CoT from '../cot.js';

// GeoJSON Geospatial ops will truncate to the below
const COORDINATE_PRECISION = 6;

/**
 * Return a GeoJSON Feature from an XML CoT message
 */
export async function to_geojson(cot: CoT): Promise<Static<typeof Feature>> {
    const raw: Static<typeof JSONCoT> = JSON.parse(JSON.stringify(cot.raw));
    if (!raw.event.detail) raw.event.detail = {};
    if (!raw.event.detail.contact) raw.event.detail.contact = { _attributes: { callsign: 'UNKNOWN' } };
    if (!raw.event.detail.contact._attributes) raw.event.detail.contact._attributes = { callsign: 'UNKNOWN' };

    const feat: Static<typeof Feature> = {
        id: raw.event._attributes.uid,
        type: 'Feature',
        properties: {
            callsign: raw.event.detail.contact._attributes.callsign || 'UNKNOWN',
            center: [ Number(raw.event.point._attributes.lon), Number(raw.event.point._attributes.lat), Number(raw.event.point._attributes.hae) ],
            type: raw.event._attributes.type,
            how: raw.event._attributes.how || '',
            time: raw.event._attributes.time,
            start: raw.event._attributes.start,
            stale: raw.event._attributes.stale,
        },
        geometry: {
            type: 'Point',
            coordinates: [ Number(raw.event.point._attributes.lon), Number(raw.event.point._attributes.lat), Number(raw.event.point._attributes.hae) ]
        }
    };

    const contact = JSON.parse(JSON.stringify(raw.event.detail.contact._attributes));
    delete contact.callsign;
    if (Object.keys(contact).length) {
        feat.properties.contact = contact;
    }

    if (cot.creator()) {
        feat.properties.creator = cot.creator();
    }

    if (raw.event.detail.remarks && raw.event.detail.remarks._text) {
        feat.properties.remarks = raw.event.detail.remarks._text;
    }

    if (raw.event.detail.fileshare) {
        feat.properties.fileshare = raw.event.detail.fileshare._attributes;
        if (feat.properties.fileshare && typeof feat.properties.fileshare.sizeInBytes === 'string') {
            feat.properties.fileshare.sizeInBytes = parseInt(feat.properties.fileshare.sizeInBytes)
        }
    }

    if (raw.event.detail.__milsym) {
        feat.properties.milsym = {
            id: raw.event.detail.__milsym._attributes.id
        }
    }

    if (raw.event.detail.__milicon) {
        feat.properties.milicon = {
            id: raw.event.detail.__milicon._attributes.id
        }
    }

    if (raw.event.detail.sensor) {
        feat.properties.sensor = raw.event.detail.sensor._attributes;
    }

    if (raw.event.detail.range) {
        feat.properties.range = raw.event.detail.range._attributes.value;
    }

    if (raw.event.detail.bearing) {
        feat.properties.bearing = raw.event.detail.bearing._attributes.value;
    }

    if (raw.event.detail.display?._attributes?.minzoom !== undefined) {
        feat.properties.minzoom = raw.event.detail.display._attributes.minzoom;
    }

    if (raw.event.detail.display?._attributes?.rotate !== undefined) {
        feat.properties.rotate = raw.event.detail.display._attributes.rotate;
    }

    if (raw.event.detail.display?._attributes?.maxzoom !== undefined) {
        feat.properties.maxzoom = raw.event.detail.display._attributes.maxzoom;
    }

    if (raw.event.detail.labels_on && raw.event.detail.labels_on._attributes && raw.event.detail.labels_on._attributes.value !== undefined) {
        feat.properties.labels = raw.event.detail.labels_on._attributes.value;
    }

    if (raw.event.detail.__video && raw.event.detail.__video._attributes) {
        feat.properties.video = raw.event.detail.__video._attributes;

        if (raw.event.detail.__video.ConnectionEntry) {
            feat.properties.video.connection = raw.event.detail.__video.ConnectionEntry._attributes;
        }
    }

    if (raw.event.detail.__geofence) {
        feat.properties.geofence = raw.event.detail.__geofence._attributes;
    }

    if (raw.event.detail.ackrequest) {
        feat.properties.ackrequest = raw.event.detail.ackrequest._attributes;
    }

    if (raw.event.detail.attachment_list) {
        feat.properties.attachments = JSON.parse(raw.event.detail.attachment_list._attributes.hashes);
    }

    if (raw.event.detail.link) {
        if (!Array.isArray(raw.event.detail.link)) raw.event.detail.link = [raw.event.detail.link];

        // These CoT Types use "point" links as geometry points
        if (['u-d-f', 'u-d-r', 'b-m-r', 'u-rb-a'].includes(raw.event._attributes.type)) {
            feat.properties.links = raw.event.detail.link
                .filter((link: Static<typeof Link>) => {
                    return !link._attributes.point
                }).map((link: Static<typeof Link>): Static<typeof LinkAttributes> => {
                    return link._attributes;
                });
        } else {
            feat.properties.links = raw.event.detail.link
                .map((link: Static<typeof Link>): Static<typeof LinkAttributes> => {
                        return link._attributes;
                });
        }

        if (!feat.properties.links || !feat.properties.links.length) delete feat.properties.links;
    }

    if (raw.event.detail.archive) {
        feat.properties.archived = true;
    }

    if (raw.event.detail.__chat) {
        feat.properties.chat = {
            ...raw.event.detail.__chat._attributes,
            chatgrp: raw.event.detail.__chat.chatgrp
        }
    }

    if (raw.event.detail.track && raw.event.detail.track._attributes) {
        if (raw.event.detail.track._attributes.course) feat.properties.course = Number(raw.event.detail.track._attributes.course);
        if (raw.event.detail.track._attributes.slope) feat.properties.slope = Number(raw.event.detail.track._attributes.slope);
        if (raw.event.detail.track._attributes.course) feat.properties.speed = Number(raw.event.detail.track._attributes.speed);
    }

    if (raw.event.detail.marti && raw.event.detail.marti.dest) {
        if (!Array.isArray(raw.event.detail.marti.dest)) raw.event.detail.marti.dest = [raw.event.detail.marti.dest];

        const dest: Array<Static<typeof MartiDestAttributes>> = raw.event.detail.marti.dest.map((d: Static<typeof MartiDest>) => {
            return { ...d._attributes };
        });

        feat.properties.dest = dest.length === 1 ? dest[0] : dest
    }

    if (
        raw.event.detail.usericon?._attributes?.iconsetpath
        && !['b-m-p-s-m'].includes(raw.event._attributes.type)
   ) {
        feat.properties.icon = raw.event.detail.usericon._attributes.iconsetpath;
    }

    if (raw.event.detail.uid && raw.event.detail.uid._attributes && raw.event.detail.uid._attributes.Droid) {
        feat.properties.droid = raw.event.detail.uid._attributes.Droid;
    }

    if (raw.event.detail.takv && raw.event.detail.takv._attributes) {
        feat.properties.takv = raw.event.detail.takv._attributes;
    }

    if (raw.event.detail.__group && raw.event.detail.__group._attributes) {
        feat.properties.group = raw.event.detail.__group._attributes;
    }

    if (raw.event.detail['_flow-tags_'] && raw.event.detail['_flow-tags_']._attributes) {
        feat.properties.flow = raw.event.detail['_flow-tags_']._attributes;
    }

    if (raw.event.detail.status && raw.event.detail.status._attributes) {
        feat.properties.status = raw.event.detail.status._attributes;
    }

    if (raw.event.detail.mission && raw.event.detail.mission._attributes) {
        const mission: Static<typeof FeaturePropertyMission> = {
            ...raw.event.detail.mission._attributes
        };

        if (raw.event.detail.mission && raw.event.detail.mission.MissionChanges) {
            const changes =
                Array.isArray(raw.event.detail.mission.MissionChanges)
                    ? raw.event.detail.mission.MissionChanges
                    : [ raw.event.detail.mission.MissionChanges ]

            mission.missionChanges = []
            for (const change of changes) {
                mission.missionChanges.push({
                    contentUid: change.MissionChange.contentUid?._text,
                    creatorUid: change.MissionChange.creatorUid?._text,
                    isFederatedChange: change.MissionChange.isFederatedChange._text,
                    missionName: change.MissionChange.missionName._text,
                    timestamp: change.MissionChange.timestamp._text,
                    type: change.MissionChange.type._text,
                    contentResource: change.MissionChange.contentResource ? {
                        expiration: change.MissionChange.contentResource.expiration._text,
                        filename: change.MissionChange.contentResource.filename._text,
                        hash: change.MissionChange.contentResource.hash._text,
                        name: change.MissionChange.contentResource.name._text,
                        size: change.MissionChange.contentResource.size._text,
                        submissionTime: change.MissionChange.contentResource.submissionTime._text,
                        submitter: change.MissionChange.contentResource.submitter._text,
                        tool: change.MissionChange.contentResource.tool._text,
                        uid: change.MissionChange.contentResource.uid._text,
                    } : undefined,
                    details: change.MissionChange.details ? {
                        ...change.MissionChange.details._attributes,
                        ...change.MissionChange.details.location
                            ? change.MissionChange.details.location._attributes
                            : {}
                    } : undefined
                })
            }
        }


        if (raw.event.detail.mission && raw.event.detail.mission.missionLayer) {
            const missionLayer: Static<typeof FeaturePropertyMissionLayer> = {};

            if (raw.event.detail.mission.missionLayer.name && raw.event.detail.mission.missionLayer.name._text) {
                missionLayer.name = raw.event.detail.mission.missionLayer.name._text;
            }
            if (raw.event.detail.mission.missionLayer.parentUid && raw.event.detail.mission.missionLayer.parentUid._text) {
                missionLayer.parentUid = raw.event.detail.mission.missionLayer.parentUid._text;
            }
            if (raw.event.detail.mission.missionLayer.type && raw.event.detail.mission.missionLayer.type._text) {
                missionLayer.type = raw.event.detail.mission.missionLayer.type._text;
            }
            if (raw.event.detail.mission.missionLayer.uid && raw.event.detail.mission.missionLayer.uid._text) {
                missionLayer.uid = raw.event.detail.mission.missionLayer.uid._text;
            }

            mission.missionLayer = missionLayer;
        }

        feat.properties.mission = mission;
    }

    if (raw.event.detail.precisionlocation && raw.event.detail.precisionlocation._attributes) {
        feat.properties.precisionlocation = raw.event.detail.precisionlocation._attributes;
    }

    if (raw.event.detail.strokeColor && raw.event.detail.strokeColor._attributes && raw.event.detail.strokeColor._attributes.value) {
        const stroke = new Color(Number(raw.event.detail.strokeColor._attributes.value));
        feat.properties.stroke = stroke.as_hex();
        feat.properties['stroke-opacity'] = stroke.as_opacity() / 255;
    }

    if (raw.event.detail.strokeWeight && raw.event.detail.strokeWeight._attributes && raw.event.detail.strokeWeight._attributes.value) {
        feat.properties['stroke-width'] = Number(raw.event.detail.strokeWeight._attributes.value);
    }

    if (raw.event.detail.strokeStyle && raw.event.detail.strokeStyle._attributes && raw.event.detail.strokeStyle._attributes.value) {
        feat.properties['stroke-style'] = raw.event.detail.strokeStyle._attributes.value;
    }

    if (raw.event.detail.color) {
        let color: Static<typeof ColorAttributes> | null = null;

        if (Array.isArray(raw.event.detail.color) && raw.event.detail.color.length > 1) {
            color = raw.event.detail.color[0];
            if (!color._attributes) color._attributes = {};

            for (let i = raw.event.detail.color.length - 1; i >= 1; i--) {
                if (raw.event.detail.color[i]._attributes) {
                    Object.assign(color._attributes, raw.event.detail.color[i]._attributes);
                }
            }
        } else if (Array.isArray(raw.event.detail.color) && raw.event.detail.color.length === 1) {
            color = raw.event.detail.color[0];
        } else if (!Array.isArray(raw.event.detail.color)) {
            color = raw.event.detail.color;
        }

        if (color && color._attributes && color._attributes.argb) {
            const parsedColor = new Color(Number(color._attributes.argb));
            feat.properties['marker-color'] = parsedColor.as_hex();
            feat.properties['marker-opacity'] = parsedColor.as_opacity() / 255;
        }
    }

    // Line, Polygon style types
    if (['u-d-f', 'u-d-r', 'b-m-r', 'u-rb-a'].includes(raw.event._attributes.type) && Array.isArray(raw.event.detail.link)) {
        const coordinates = [];

        for (const l of raw.event.detail.link) {
            if (!l._attributes.point) continue;
            coordinates.push(
                l._attributes.point.split(',')
                    .map((p: string) => { return Number(p.trim()) })
                    .splice(0, 2)
                    .reverse()
            );
        }

        // Range & Bearing Line
        if (raw.event._attributes.type === 'u-rb-a') {
            const detail = cot.detail();

            if (!detail.range) throw new Error('Range value not provided')
            if (!detail.bearing) throw new Error('Bearing value not provided')

            // TODO Support inclination
            const dest = destination(
                cot.position(),
                detail.range._attributes.value / 1000,
                detail.bearing._attributes.value
            ).geometry.coordinates;

            feat.geometry = {
                type: 'LineString',
                coordinates: [cot.position(), dest]
            };
        } else if (raw.event._attributes.type === 'u-d-r' || (coordinates[0][0] === coordinates[coordinates.length -1][0] && coordinates[0][1] === coordinates[coordinates.length -1][1])) {
            if (raw.event._attributes.type === 'u-d-r') {
                // CoT rectangles are only 4 points - GeoJSON needs to be closed
                coordinates.push(coordinates[0])
            }

            feat.geometry = {
                type: 'Polygon',
                coordinates: [coordinates]
            }

            if (raw.event.detail.fillColor && raw.event.detail.fillColor._attributes && raw.event.detail.fillColor._attributes.value) {
                const fill = new Color(Number(raw.event.detail.fillColor._attributes.value));
                feat.properties['fill-opacity'] = fill.as_opacity() / 255;
                feat.properties['fill'] = fill.as_hex();
            }
        } else {
            feat.geometry = {
                type: 'LineString',
                coordinates
            }
        }
    } else if (raw.event._attributes.type.startsWith('u-d-c-c') || raw.event._attributes.type.startsWith('u-r-b-c-c')) {
        if (!raw.event.detail.shape) throw new Err(400, null, `${raw.event._attributes.type} (Circle) must define shape value`)

        if (
            !raw.event.detail.shape.ellipse
            || !raw.event.detail.shape.ellipse._attributes
        ) throw new Err(400, null, `${raw.event._attributes.type} (Circle) must define ellipse shape value`)

        const ellipse = {
            major: Number(raw.event.detail.shape.ellipse._attributes.major),
            minor: Number(raw.event.detail.shape.ellipse._attributes.minor),
            angle: Number(raw.event.detail.shape.ellipse._attributes.angle)
        }

        if (
            !Array.isArray(raw.event.detail.shape.link)
            && raw.event.detail.shape.link?._attributes.type === 'b-x-KmlStyle'
            && raw.event.detail.shape.link?.Style
        ) {
            if (raw.event.detail.shape.link.Style.LineStyle?.color) {
                let rawColor = raw.event.detail.shape.link.Style.LineStyle.color._text;
                if (rawColor.startsWith('#')) rawColor = rawColor.substring(1);

                const a = parseInt(rawColor.substring(0, 2), 16);
                const r = parseInt(rawColor.substring(2, 4), 16);
                const g = parseInt(rawColor.substring(4, 6), 16);
                const b = parseInt(rawColor.substring(6, 8), 16);

                const strokeColor = new Color([a, r, g, b]);
                feat.properties.stroke = strokeColor.as_hex();

                feat.properties['stroke-opacity'] = strokeColor.as_opacity() / 255;
            }

            if (raw.event.detail.shape.link.Style.LineStyle?.width) {
                feat.properties['stroke-width'] = Number(raw.event.detail.shape.link.Style.LineStyle.width._text);
            }

            if (raw.event.detail.shape.link.Style.PolyStyle?.color) {
                let rawColor = raw.event.detail.shape.link.Style.PolyStyle.color._text;
                if (rawColor.startsWith('#')) rawColor = rawColor.substring(1);

                const a = parseInt(rawColor.substring(0, 2), 16);
                const r = parseInt(rawColor.substring(2, 4), 16);
                const g = parseInt(rawColor.substring(4, 6), 16);
                const b = parseInt(rawColor.substring(6, 8), 16);

                const fillColor = new Color([a, r, g, b]);
                feat.properties['fill-opacity'] = fillColor.as_opacity() / 255;
                feat.properties['fill'] = fillColor.as_hex();
            }
        }

        feat.geometry = Truncate(Ellipse(
            feat.geometry.coordinates as number[],
            Number(ellipse.major) / 1000,
            Number(ellipse.minor) / 1000,
            {
                angle: ellipse.angle
            }
        ), {
            precision: COORDINATE_PRECISION,
            coordinates: 3,
            mutate: true
        }).geometry as Static<typeof Polygon>;

        feat.properties.shape = {};
        feat.properties.shape.ellipse = ellipse;
    } else if (raw.event._attributes.type.startsWith('b-m-p-s-p-i')) {
        // TODO: Currently the "shape" tag is only parsed here - asking ARA for clarification if it is a general use tag
        if (raw.event.detail.shape && raw.event.detail.shape.polyline && raw.event.detail.shape.polyline.vertex) {
            const coordinates = [];

            const vertices = Array.isArray(raw.event.detail.shape.polyline.vertex) ? raw.event.detail.shape.polyline.vertex : [raw.event.detail.shape.polyline.vertex];
            for (const v of vertices) {
                coordinates.push([Number(v._attributes.lon), Number(v._attributes.lat)]);
            }

            if (coordinates.length === 1) {
                feat.geometry = { type: 'Point', coordinates: coordinates[0] }
            } else if (raw.event.detail.shape.polyline._attributes && raw.event.detail.shape.polyline._attributes.closed === true) {
                coordinates.push(coordinates[0]);
                feat.geometry = { type: 'Polygon', coordinates: [coordinates] }
            } else {
                feat.geometry = { type: 'LineString', coordinates }
            }
        }

        if (
            raw.event.detail.shape
            && raw.event.detail.shape.polyline
            && raw.event.detail.shape.polyline._attributes
        ) {
            if (raw.event.detail.shape.polyline._attributes.fillColor) {
                const fill = new Color(Number(raw.event.detail.shape.polyline._attributes.fillColor));
                feat.properties['fill-opacity'] = fill.as_opacity() / 255;
                feat.properties['fill'] = fill.as_hex();
            }

            if (raw.event.detail.shape.polyline._attributes.color) {
                const stroke = new Color(Number(raw.event.detail.shape.polyline._attributes.color));
                feat.properties.stroke = stroke.as_hex();
                feat.properties['stroke-opacity'] = stroke.as_opacity() / 255;
            }
        }
    } else if (raw.event._attributes.type === 'b-m-p-s-m') {
        if (
            raw.event.detail.usericon?._attributes?.iconsetpath
            && raw.event.detail.usericon._attributes.iconsetpath.startsWith('COT_MAPPING_SPOTMAP/b-m-p-s-m/')
       ) {
            const spot = new Color(Number(raw.event.detail.usericon._attributes.iconsetpath.split('/')[2]));
            feat.properties['marker-color'] = spot.as_hex();
            feat.properties['marker-opacity'] = spot.as_opacity() / 255;
            delete feat.properties.icon;
        }
    }

    feat.properties.metadata = cot.metadata;
    feat.path = cot.path;

    return feat;
}
