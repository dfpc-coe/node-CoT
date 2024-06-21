<h1 align=center>Node-CoT</h1>

<p align=center>Javascript Cursor-On-Target Library</p>

Lightweight JavaScript library for parsing and manipulating TAK related messages, primarily [Cursor-on-Target (COT)](https://git.tak.gov/standards/takcot)

## About

`node-cot` converts between TAK message protocols and a Javascript object/JSON format.
It also can bidirectionally convert CoT messages into [GeoJSON](https://geojson.org/)

## Installation

### NPM

To install `node-cot` with npm run

```bash
npm install @tak-ps/node-cot
```

## Usage Examples

### Cursor-On-Target

```js
import CoT from '@tak-ps/node-cot';

const cot = new CoT(`
    <event version="2.0" uid="ANDROID-deadbeef" type="a-f-G-U-C" how="m-g" time="2021-02-27T20:32:24.771Z" start="2021-02-27T20:32:24.771Z" stale="2021-02-27T20:38:39.771Z">
        <point lat="1.234567" lon="-3.141592" hae="-25.7" ce="9.9" le="9999999.0"/>
    </event>
`);


// Export Formats
cot.to_geojson();   // Output GeoJSON Representation
cot.to_xml();       // Output String XML Representation

cot.raw; // JSON XML Representation
```

### Debugging

If the Environment Variable `DEBUG_COTS` is truthy
ie:

```
export DEBUG_COTS=1
```

Then the raw JSONified XML will be printed on each constructor invocation.

## CoT Spec

The CoT Spec is very informally developed by rough internal concensus
of large TAK Clients within the TPC (TAK Product Center). The following is a current
understanding of the spec primarily developed through reverse engineering TAK clients

```
<event version uid type how time start stale/>
```

### Event Attributes

| Name          | Description | Example |
| ------------- | ----------- | ------- |
| `version`     | CoT Version, currently `2.0` | `version="2.0"` |
| `uid`         | Globally unique name for this information on this event | `uid="any-unique-string-123"` |
| `type`        | Hierarchically organized hint about event type | `type="a-f-G-E"' |
| `how`         | Gives a hint about how the coordinates were generated | `how=""`
| `time`        | The time at which the event was generated | `time="2023-07-18T15:25:09.00Z"` |
| `start`       | The time at which the event starts or is relevant | `start="2023-07-18T15:25:09.00Z"` |
| `stale`       | The time at which the event ends or is not relevant | `stale="2023-07-18T15:25:09.00Z"` |

## CoT GeoJSON Spec

One of the primary use-cases of this library is to make serialization and deserialiation from
more commmon geospatial formats a breeze. This section will walk through CoT options that are
exposed via the `from_geojson()` function.

### Supported Geometries

- All Input Geometries must be a GeoJSON `Feature` type
- `Point`, `Polygon`, and `LineString` are all supported
- `Multi` Geometries are not supported and must be cast to their non-multi type before being passed to the library
- Centroids are calulated using a PointOnSurface algorithm

### Supported Properties

The following are the most important/relevant properties

| Property              | Description |
| --------------------- | ----------- |
| `.id`                 | Used as the CoT uid - If omitted a UUID is generated |
| `.properties.type`    | CoT type - note this will be overridden if geometry is not a Point |
| `.properties.how`     | CoT how |
| `.properties.time`    | Time at which CoT was created |
| `.properties.start`   | Time at which CoT is relevant |
| `.properties.stale`   | Time at which CoT expires |
| `.properties.callsign`| Displayed callsign (basically the name of the feature) |
| `.properties.speed`   | Speed in m/s of the object |
| `.properties.course`  | Course in degrees from north of the object |
| `.properties.remarks` | Human readable remarks field |

Styles can also be applied to features using the following

| Property                          | Description |
| --------------------------------- | ----------- |
| `.properties.marker-color`        | Point |
| `.properties.marker-opacity`      | Point |
| `.properties.stroke`              | Polygon/LineString |
| `.properties.stroke-opacity`      | Polygon/LineString: Int from 0-256 |
| `.properties.stroke-width`        | Polygon/LineString |
| `.properties.stroke-style`        | Polygon/LineString |
| `.properties.stroke-style`        | Polygon/LineString |
| `.properties.fill`                | Polygon |
| `.properties.fill-opacity`        | Polygon: Int from 0-256 |

These are less common properties that can be used:

| Property                          | Description |
| --------------------------------- | ----------- |
| `.properties.icon`                | String: Custom Icon Path (string) |
| `.properties.archived`            | Boolean: TAK Clients will ignore the stale value and retain the feature |
| `.properties.dest`                | Marti API Instructions for sending CoTs to a specific location |
| `.properties.fileshare`           | Push Data Packages via CoT |


## Known Special CoT Types

<p align='center'><strong>Geometry</strong></p>

| CoT Type          | Notes |
| ----------------- | ----- |
| `u-d-f`           | LineString or Polygon |
| `u-d-r`           | 4 Cornered Rectangle |
| `u-d-p`           | Point |

<p align='center'><strong>Notification/Alerts</strong></p>

| CoT Type          | Notes |
| ----------------- | ----- |
| `b-a`             | Alert |
| `b-a-o-tbl`       | 911 Alert |
| `b-a-o-can`       | Cancel Alert |
| `b-a-g`           | GeoFence Breach |
| `b-a-o-pan`       | RingTheBell |
| `b-a-o-opn`       | TroopsInContact |
| `b-r-f-h-c`       | Casevac |

<p align='center'><strong>Chat</strong></p>

| CoT Type          | Notes |
| ----------------- | ----- |
| `b-t-f`           | Chat |
| `b-t-f-d`         | Chat delivery receipt |
| `b-t-f-r`         | Chat read receipt |
| `b-t-f-p`         | Chat pending receipt |
| `b-t-f-s`         | Chat delivery failure |

<p align='center'><strong>Mission Sync</strong></p>

| CoT Type          | Notes                         |
| ----------------- | ----------------------------- |
| `t-x-m`           | Mission                       |
| `t-x-m-n`         | Mission Created               |
| `t-x-m-d`         | Mission Deleted               |
| `t-x-m-i`         | Mission Invite Notification   |
| `t-x-m-c`         | Mission Change                |
| `t-x-m-c-h`       | Mission Change: Layer         |
| `t-x-m-c-l`       | Mission Change: Log           |
| `t-x-m-c-e`       | Mission Change: External      |
| `t-x-m-c-m`       | Mission Change: Metadata      |
| `t-x-m-c-k`       | Mission Change: Keywords      |

<p align='center'><strong>Special</strong></p>

| CoT Type          | Notes |
| ----------------- | ----- |
| `b-i-v`           | Bits/Imagery/Video |
| `b-i-r-r`         | Remote Resource |
| `b-f-t-r`         | File Transfer Request |
| `b-i-x-i`         | QuickPic |
