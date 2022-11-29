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
