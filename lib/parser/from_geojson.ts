import Err from '@openaddresses/batch-error';
import { v4 as randomUUID } from 'uuid';
import type { Static } from '@sinclair/typebox';
import type {
    LinkAttributes,
} from '../types/types.js'
import {
    InputFeature,
} from '../types/feature.js';
import type { AllGeoJSON } from "@turf/helpers";
import TypeValidator from '../type.js';
import PointOnFeature from '@turf/point-on-feature';
import Util from '../utils/util.js';
import Color from '../utils/color.js';
import JSONCoT from '../types/types.js'
import CoT from '../cot.js';
import type { CoTOptions } from '../cot.js';

/**
 * Return an CoT Message given a GeoJSON Feature
 *
 * @param {Object} feature GeoJSON Point Feature
 *
 * @return {CoT}
 */
export async function from_geojson(
    feature: Static<typeof InputFeature>,
    opts: CoTOptions = {}
): Promise<CoT> {
    try {
        feature = await TypeValidator.type(InputFeature, feature, {
            verbose: opts.verbose
        });
    } catch (err) {
        throw new Err(400, null, `Validation Error: ${err}`);
    }

    const cot: Static<typeof JSONCoT> = {
        event: {
            _attributes: Util.cot_event_attr(
                feature.properties.type || 'a-f-G',
                feature.properties.how || 'm-g',
                feature.properties.time,
                feature.properties.start,
                feature.properties.stale
            ),
            point: Util.cot_point(),
            detail: Util.cot_event_detail(feature.properties.callsign)
        }
    };

    if (feature.id) {
        cot.event._attributes.uid = String(feature.id);
    } else {
        cot.event._attributes.uid = randomUUID();
    }

    if (!cot.event.detail) cot.event.detail = {};

    if (feature.properties.droid) {
        cot.event.detail.uid = { _attributes: { Droid: feature.properties.droid } };
    }

    if (feature.properties.archived) {
        cot.event.detail.archive = { _attributes: { } };
    }

    if (feature.properties.links) {
        if (!cot.event.detail.link) cot.event.detail.link = [];
        else if (!Array.isArray(cot.event.detail.link)) cot.event.detail.link = [cot.event.detail.link];

        cot.event.detail.link.push(...feature.properties.links.map((link: Static<typeof LinkAttributes>) => {
            return { _attributes: link };
        }))
    }

    if (feature.properties.dest) {
        const dest = !Array.isArray(feature.properties.dest) ? [ feature.properties.dest ] : feature.properties.dest;

        cot.event.detail.marti = {
            dest: dest.map((dest) => {
                return { _attributes: { ...dest } };
            })
        }
    }

    if (feature.properties.type === 'b-a-o-tbl') {
        cot.event.detail.emergency = {
            _attributes: { type: '911 Alert' },
            _text: feature.properties.callsign || 'UNKNOWN'
        }
    } else if (feature.properties.type === 'b-a-o-can') {
        cot.event.detail.emergency = {
            _attributes: { cancel: true },
            _text: feature.properties.callsign || 'UNKNOWN'
        }
    } else if (feature.properties.type === 'b-a-g') {
        cot.event.detail.emergency = {
            _attributes: { type: 'Geo-fence Breached' },
            _text: feature.properties.callsign || 'UNKNOWN'
        }
    } else if (feature.properties.type === 'b-a-o-pan') {
        cot.event.detail.emergency = {
            _attributes: { type: 'Ring The Bell' },
            _text: feature.properties.callsign || 'UNKNOWN'
        }
    } else if (feature.properties.type === 'b-a-o-opn') {
        cot.event.detail.emergency = {
            _attributes: { type: 'Troops In Contact' },
            _text: feature.properties.callsign || 'UNKNOWN'
        }
    }

    if (feature.properties.takv) {
        cot.event.detail.takv = { _attributes: { ...feature.properties.takv } };
    }

    if (feature.properties.creator) {
        cot.event.detail.creator = { _attributes: { ...feature.properties.creator } };
    }

    if (feature.properties.range !== undefined) {
        cot.event.detail.range = { _attributes: { value:  feature.properties.range  } }
    }

    if (feature.properties.bearing !== undefined) {
        cot.event.detail.bearing = { _attributes: { value:  feature.properties.bearing  } }
    }

    if (feature.properties.geofence) {
        cot.event.detail.__geofence = { _attributes: { ...feature.properties.geofence } };
    }

    if (feature.properties.milsym) {
        cot.event.detail.__milsym = { _attributes: { id: feature.properties.milsym.id} };
    }

    if (feature.properties.sensor) {
        cot.event.detail.sensor = { _attributes: { ...feature.properties.sensor } };
    }

    if (feature.properties.ackrequest) {
        cot.event.detail.ackrequest = { _attributes: { ...feature.properties.ackrequest } };
    }

    if (feature.properties.video) {
        if (feature.properties.video.connection) {
            const video = JSON.parse(JSON.stringify(feature.properties.video));

            const connection = video.connection;
            delete video.connection;

            cot.event.detail.__video = {
                _attributes: { ...video },
                ConnectionEntry: {
                    _attributes: connection
                }
            }
        } else {
            cot.event.detail.__video = { _attributes: { ...feature.properties.video } };
        }
    }

    if (feature.properties.attachments) {
        cot.event.detail.attachment_list = { _attributes: { hashes: JSON.stringify(feature.properties.attachments) } };
    }

    if (feature.properties.contact) {
        cot.event.detail.contact = {
            _attributes: {
                ...feature.properties.contact,
                callsign: feature.properties.callsign || 'UNKNOWN',
            }
        };
    }

    if (feature.properties.fileshare) {
        cot.event.detail.fileshare = { _attributes: { ...feature.properties.fileshare } };
    }

    if (feature.properties.course !== undefined || feature.properties.speed !== undefined || feature.properties.slope !== undefined) {
        cot.event.detail.track = {
            _attributes: Util.cot_track_attr(feature.properties.course, feature.properties.speed, feature.properties.slope)
        }
    }

    if (feature.properties.group) {
        cot.event.detail.__group = { _attributes: { ...feature.properties.group } }
    }

    if (feature.properties.flow) {
        cot.event.detail['_flow-tags_'] = { _attributes: { ...feature.properties.flow } }
    }

    if (feature.properties.status) {
        cot.event.detail.status = { _attributes: { ...feature.properties.status } }
    }

    if (feature.properties.precisionlocation) {
        cot.event.detail.precisionlocation = { _attributes: { ...feature.properties.precisionlocation } }
    }

    if (feature.properties.icon) {
        // Web Rendering uses a ":", to avoid issues we support it on input and normalize it to a "/"
        if (feature.properties.icon.includes(':')) {
            feature.properties.icon = feature.properties.icon
                .split(':').join('/')

            if (!feature.properties.icon.endsWith('.png')) {
                feature.properties.icon += '.png';
            }
        }

        cot.event.detail.usericon = { _attributes: { iconsetpath: feature.properties.icon } }
    }

    if (feature.properties.mission) {
        cot.event.detail.mission = {
            _attributes: {
                type: feature.properties.mission.type,
                guid: feature.properties.mission.guid,
                tool: feature.properties.mission.tool,
                name: feature.properties.mission.name,
                authorUid: feature.properties.mission.authorUid,
            }
        }

        if (feature.properties.mission.missionLayer) {
            cot.event.detail.mission.missionLayer = {};

            if (feature.properties.mission.missionLayer.name) {
                cot.event.detail.mission.missionLayer.name = { _text: feature.properties.mission.missionLayer.name };
            }

            if (feature.properties.mission.missionLayer.parentUid) {
                cot.event.detail.mission.missionLayer.parentUid = { _text: feature.properties.mission.missionLayer.parentUid };
            }

            if (feature.properties.mission.missionLayer.type) {
                cot.event.detail.mission.missionLayer.type = { _text: feature.properties.mission.missionLayer.type };
            }

            if (feature.properties.mission.missionLayer.uid) {
                cot.event.detail.mission.missionLayer.uid = { _text: feature.properties.mission.missionLayer.uid };
            }
        }
    }

    cot.event.detail.remarks = { _attributes: { }, _text: feature.properties.remarks || '' };

    if (!feature.geometry) {
        throw new Err(400, null, 'Must have Geometry');
    } else if (!['Point', 'Polygon', 'LineString'].includes(feature.geometry.type)) {
        throw new Err(400, null, 'Unsupported Geometry Type');
    }

    // This isn't specific to point as the color can apply to the centroid point
    if (feature.properties['marker-color']) {
        const color = new Color(feature.properties['marker-color'] || -1761607936);
        color.a = feature.properties['marker-opacity'] !== undefined ? feature.properties['marker-opacity'] * 255 : 128;

        cot.event.detail.color = {
            _attributes: {
                argb: color.as_32bit(),
                value: color.as_32bit()
            }
        };
    }

    if (feature.geometry.type === 'Point') {
        cot.event.point._attributes.lon = feature.geometry.coordinates[0];
        cot.event.point._attributes.lat = feature.geometry.coordinates[1];
        cot.event.point._attributes.hae = feature.geometry.coordinates[2] || 0.0;
    } else if (['Polygon', 'LineString'].includes(feature.geometry.type)) {
        const stroke = new Color(feature.properties.stroke || -1761607936);
        stroke.a = feature.properties['stroke-opacity'] !== undefined ? feature.properties['stroke-opacity'] * 255 : 128;
        cot.event.detail.strokeColor = { _attributes: { value: stroke.as_32bit() } };

        if (!feature.properties['stroke-width']) feature.properties['stroke-width'] = 3;
        cot.event.detail.strokeWeight = { _attributes: {
            value: feature.properties['stroke-width']
        } };

        if (!feature.properties['stroke-style']) feature.properties['stroke-style'] = 'solid';
        cot.event.detail.strokeStyle = { _attributes: {
            value: feature.properties['stroke-style']
        } };


        if (feature.geometry.type === 'Polygon' && feature.properties.type && ['u-d-c-c', 'u-r-b-c-c'].includes(feature.properties.type)) {
            if (!feature.properties.shape || !feature.properties.shape.ellipse) {
                throw new Err(400, null, `${feature.properties.type} (Circle) must define a feature.properties.shape.ellipse property`)
            }

            const strokeColor = new Color(feature.properties.stroke || -1761607936);
            strokeColor.a = feature.properties['stroke-opacity'] !== undefined ? feature.properties['stroke-opacity'] * 255 : 128;

            const fillColor = new Color(feature.properties.fill || -1761607936);
            fillColor.a = feature.properties['fill-opacity'] !== undefined ? feature.properties['fill-opacity'] * 255 : 128;

            cot.event.detail.shape = {
                ellipse: {
                    _attributes: feature.properties.shape.ellipse
                },
                link: {
                    _attributes: {
                        uid: `${cot.event._attributes.uid}.Style`,
                        type: 'b-x-KmlStyle',
                        relation: 'p-c'
                    },
                    Style: {
                        LineStyle: {
                            color: { _text: strokeColor.as_hexa().slice(1) },
                            width: { _text: cot.event.detail.strokeWeight?._attributes?.value ? cot.event.detail.strokeWeight._attributes.value : 3 }
                        },
                        PolyStyle: {
                            color: { _text: fillColor.as_hexa().slice(1) },
                        }
                    }
                }
            }

        } else if (feature.geometry.type === 'LineString' && feature.properties.type === 'b-m-r') {
            cot.event._attributes.type = 'b-m-r';

            if (!cot.event.detail.link) {
                cot.event.detail.link = [];
            } else if (!Array.isArray(cot.event.detail.link)) {
                cot.event.detail.link = [cot.event.detail.link]
            }

            cot.event.detail.__routeinfo = {
                __navcues: {
                    __navcue: []
                }
            }

            for (const coord of feature.geometry.coordinates) {
                cot.event.detail.link.push({
                    _attributes: {
                        type: 'b-m-p-c',
                        uid: randomUUID(),
                        callsign: "",
                        point: `${coord[1]},${coord[0]}`
                    }
                });
            }
        } else if (feature.geometry.type === 'LineString') {
            cot.event._attributes.type = 'u-d-f';

            if (!cot.event.detail.link) {
                cot.event.detail.link = [];
            } else if (!Array.isArray(cot.event.detail.link)) {
                cot.event.detail.link = [cot.event.detail.link]
            }

            for (const coord of feature.geometry.coordinates) {
                cot.event.detail.link.push({
                    _attributes: { point: `${coord[1]},${coord[0]}` }
                });
            }
        } else if (feature.geometry.type === 'Polygon') {
            cot.event._attributes.type = 'u-d-f';

            if (!cot.event.detail.link) cot.event.detail.link = [];
            else if (!Array.isArray(cot.event.detail.link)) cot.event.detail.link = [cot.event.detail.link]

            // Inner rings are not yet supported
            for (const coord of feature.geometry.coordinates[0]) {
                cot.event.detail.link.push({
                    _attributes: { point: `${coord[1]},${coord[0]}` }
                });
            }

            const fill = new Color(feature.properties.fill || -1761607936);
            fill.a = feature.properties['fill-opacity'] !== undefined ? feature.properties['fill-opacity'] * 255 : 128;
            cot.event.detail.fillColor = { _attributes: { value: fill.as_32bit() } };
        }

        if (feature.properties.labels) {
            cot.event.detail.labels_on = { _attributes: { value: feature.properties.labels } };
        } else {
            cot.event.detail.labels_on = { _attributes: { value: false } };
        }

        cot.event.detail.tog = { _attributes: { enabled: '0' } };

        if (feature.properties.center && Array.isArray(feature.properties.center) && feature.properties.center.length >= 2) {
            cot.event.point._attributes.lon = feature.properties.center[0];
            cot.event.point._attributes.lat = feature.properties.center[1];

            if (feature.properties.center.length >= 3) {
                cot.event.point._attributes.hae = feature.properties.center[2] || 0.0;
            } else {
                cot.event.point._attributes.hae = 0.0;
            }
        } else {
            const centre = PointOnFeature(feature as AllGeoJSON);
            cot.event.point._attributes.lon = centre.geometry.coordinates[0];
            cot.event.point._attributes.lat = centre.geometry.coordinates[1];
            cot.event.point._attributes.hae = 0.0;
        }
    }

    const newcot = new CoT(cot, opts);

    if (feature.properties.metadata) {
        newcot.metadata = feature.properties.metadata
    }

    if (feature.path) {
        newcot.path = feature.path
    }

    return newcot;
}
