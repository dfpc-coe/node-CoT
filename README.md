<h1 align=center>Node-CoT</h1>

<p align=center>Javascript Cursor-On-Target Library</p>

Lightweight JavaScript library for parsing and manipulating TAK related messages, primarily [Cursor-on-Target (COT)](https://git.tak.gov/standards/takcot)

## About

`node-tak` converts between TAK message protocols and a Javascript object/JSON format.
It also can bidirectionally convert CoT messages into a GeoJSON format

## Installation

### NPM

To install `node-cot` with npm run

```bash
npm install @tak-ps/node-cot
```

## CoT Spec

The CoT spec appears to be very informally developed by a rough internal concensus
by large TAK Clients within the TPC (TAK Product Center). The following is a current
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
| `time`        | The time at which the event was generated | `time="2023-07-18T15:25:09.00Z"` |
| `how`         | Gives a hint about how the coordinates were generated | `how=""`
| `start`       | | |
| `stale`       | | |

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

## Usage Examples

### Basic Usage

```
import CoT from '@tak-ps/node-cot';

const message = '<event version="2.0" uid="ANDROID-deadbeef" type="a-f-G-U-C" how="m-g" time="2021-02-27T20:32:24.771Z" start="2021-02-27T20:32:24.771Z" stale="2021-02-27T20:38:39.771Z"><point lat="1.234567" lon="-3.141592" hae="-25.7" ce="9.9" le="9999999.0"/><detail><takv os="29" version="4.0.0.0 (deadbeef).1234567890-CIV" device="Some Android Device" platform="ATAK-CIV"/><contact xmppUsername="xmpp@host.com" endpoint="*:-1:stcp" callsign="JENNY"/><uid Droid="JENNY"/><precisionlocation altsrc="GPS" geopointsrc="GPS"/><__group role="Team Member" name="Cyan"/><status battery="78"/><track course="80.24833892285461" speed="0.0"/></detail></event>'

const cot = new CoT(message);

// Export Formats
cot.to_geojson(); // Output GeoJSON Representation
cot.to_xml(); // Output String XML Representation

cot.raw; // JSON XML Representation
```

## Known Special CoT Types

The following list is a very incomplete list of "special" CoT types and behaviors

| CoT Type          | Notes |
| ----------------- | ----- |
| `u-d-f`           | LineString or Polygon |
| `u-d-r`           | 4 Cornered Rectangle |
| `b-a-o-tbl`       | 911 Alert |
| `b-a-o-can`       | Cancel |
| `b-a-g`           | GeoFenceBreach |
| `b-a-o-pan`       | RingTheBell |
| `b-a-o-opn`       | TroopsInContact |
| `b-t-f`           | Chat |
| `b-t-f-d`         | Chat delivery receipt |
| `b-t-f-r`         | Chat read receipt |
| `b-t-f-p`         | Chat pending receipt |
| `b-t-f-s`         | Chat delivery failure |
| `t-x-m-c-l`       | Mission Change Notification |
