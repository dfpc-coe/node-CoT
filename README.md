<h1 align=center>node-CoT</h1>

<p align=center>Javascript Cursor-On-Target Library</p>

Lightweight JavaScript library for parsing and manipulating TAK messages, primarily Cursor-on-Target (COT)

## About

tak.js converts between TAK message protocols and a Javascript object/JSON format. This makes it easy to read and write TAK messages in a Node.js application.

## Installation

### NPM

To install `node-cot` with npm run

```bash
npm install @tak-ps/node-cot
```

## GeoJSON Spec

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
| `.id`                 | Used as the CoT uid - If ommitted a UUID is generated |
| `.properties.type`    | CoT type - note this will be overridden if geometry is not a Point |
| `.properties.how`     | CoT how |
| `.properties.time`    | Time at which CoT was created |
| `.properties.start`   | Time at which CoT is relevant |
| `.properties.stale`   | Time at which CoT expires |
| `.properties.callsign`| Displayed callsign (basically the name of the feature) |

Styles can also be applied to features using the following

| Property                          | Description |
| --------------------------------- | ----------- |
| `.properties.stroke`              | Polygon/LineString |
| `.properties.stroke-opacity`      | Polygon/LineString |
| `.properties.stroke-width`        | Polygon/LineString |
| `.properties.stroke-style`        | Polygon/LineString |
| `.properties.stroke-style`        | Polygon/LineString |
| `.properties.fill`                | Polygon |
| `.properties.fill-opacity`        | Polygon |

These are less common properties that can be used:

| Property                          | Description |
| --------------------------------- | ----------- |
| `.properties.icon`                | Custom Icon Path (string) |

## Usage Examples

### Basic Usage

```
import { XML } from '@tak-ps/node-cot';

const message = '<event version="2.0" uid="ANDROID-deadbeef" type="a-f-G-U-C" how="m-g" time="2021-02-27T20:32:24.771Z" start="2021-02-27T20:32:24.771Z" stale="2021-02-27T20:38:39.771Z"><point lat="1.234567" lon="-3.141592" hae="-25.7" ce="9.9" le="9999999.0"/><detail><takv os="29" version="4.0.0.0 (deadbeef).1234567890-CIV" device="Some Android Device" platform="ATAK-CIV"/><contact xmppUsername="xmpp@host.com" endpoint="*:-1:stcp" callsign="JENNY"/><uid Droid="JENNY"/><precisionlocation altsrc="GPS" geopointsrc="GPS"/><__group role="Team Member" name="Cyan"/><status battery="78"/><track course="80.24833892285461" speed="0.0"/></detail></event>'

const cot = new XML(message);

// Export Formats
cot.to_geojson(); // Output GeoJSON Representation
cot.to_xml(); // Output String XML Representation

cot.raw; // JSON XML Representation
```
