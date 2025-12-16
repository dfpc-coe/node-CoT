# CHANGELOG

## Emoji Cheatsheet
- :pencil2: doc updates
- :bug: when fixing a bug
- :rocket: when making general improvements
- :white_check_mark: when adding tests
- :arrow_up: when upgrading dependencies
- :tada: when adding new features

## Version History

### Pending Fixed

### v14.17.3 - 2025-12-16

- :rocket: Fix Build

### v14.17.2 - 2025-12-16

- :rocket: Add Build Step

### v14.17.1 - 2025-12-15

- :rocket: Update Release Process

### v14.17.0 - 2025-12-08

- :tada: Support passing through non-URL Links

### v14.16.0 - 2025-11-26

- :tada: Bi-Directional MilIcon Support

### v14.15.0 - 2025-11-18

- :tada: Add Mission Link Field

### v14.14.0 - 2025-11-17

- :tada: Add BiDirectional support for Spotted Map Items

### v14.13.0 - 2025-11-10

- :tada: Allow setting rotation on Features

### v14.12.0 - 2025-10-17

- :tada: Allow setting display minzoom/maxzoom on Features

### v14.11.1 - 2025-10-12

- :bug: Ensure Direct Chat messages have a `Dest` flag

### v14.11.0 - 2025-10-10

- :rocket: Fix version conflict on NPM

### v14.10.0 - 2025-10-10

- :rocket: Expand type definitions and tests to allow parsing DataPackages that include an AOI file from ATAK

### v14.9.3 - 2025-10-03

- :bug: Ensure additional coordinates are removed properly in normalize step

### v14.9.2 - 2025-09-25

- :bug: Relax Creator parsing to allow undefined `time`

### v14.9.1 - 2025-09-17

- :bug: Relax Mission Change parsing to allow empty `details`

### v14.9.0 - 2025-09-17

- :bug: Relax Mission Change parsing to allow empty `creatorUid`

### v14.8.2 - 2025-09-15

- :bug: Improve COT Type Parsing

### v14.8.1 - 2025-09-12

- :rocket: Support Circle KML Style Properties

### v14.8.0 - 2025-09-12

- :rocket: Support Circle KML Style Properties

### v14.7.9 - 2025-09-12

- :rocket: Loosen support for Route Prefix

### v14.7.8 - 2025-09-11

- :rocket: Loosen support for Route NavCues

### v14.7.7 - 2025-09-09

- :arrow_up: Update UUID to latest version

### v14.7.6 - 2025-09-08

- :bug: https://jdstaerk.substack.com/p/we-just-found-malicious-code-in-the - Revert Deps

### v14.7.5 - 2025-09-07

- :bug: Migrate single point 2525D symbols to `__milicon`

### v14.7.4 - 2025-09-07

- :bug: Support TAK Aware's Pathless Iconset Property

### v14.7.3 - 2025-09-07

- :rocket: MilSym Battle Dimension is now case-insensitive

### v14.7.2 - 2025-09-07

- :rocket: MilSym Augmentation should never error out parsing

### v14.7.1 - 2025-09-07

- :rocket: Export CoTOptions objects from CoT for downstream users

### v14.7.0 - 2025-09-07

- :rocket: Introduce 2525 Augmentation Feature

### v14.6.0 - 2025-09-06

- :arrow_up: Update Core Deps

### v14.5.0 - 2025-08-26

- :arrow_up: Update Core Deps

### v14.4.0 - 2025-08-23

- :rocket: Include types in package exports field

### v14.3.0 - 2025-08-19

- :tada: Add TAK Request/Response type defs

### v14.2.2 - 2025-08-19

- :bug: Postfix Icon with .png if it isn't present

### v14.2.1 - 2025-08-12

- :rocket: Include ACKRequested in FileRequest Builder

### v14.1.1 - 2025-08-07

- :rocket: Support WebIcon style icon paths

### v14.1.0 - 2025-08-07

- :rocket: Include `InputFeatureCollection` and `FeatureCollection` in types

### v14.0.5 - 2025-07-13

- :bug: Fix TS error

### v14.0.4 - 2025-07-13

- :rocket: Prepend `#` to color values in normalized features to ensure they are valid hex colors

### v14.0.3 - 2025-07-13

- :rocket: Use `Type.Literal` for `type: Feature`

### v14.0.2 - 2025-07-13

- :rocket: Include .d.ts files in output

### v14.0.1 - 2025-07-13

- :bug: Ensure `archived: true` is set on normalized features as these will result in `u-d` type CoTs

### v14.0.0 - 2025-07-13

- :rocket: Replace AJV with TypeBox for schema validation in `from_geojson`
- :rocket: **Breaking** All parser functions now return `Promise`

### v13.6.0 - 2025-07-10

- :rocket: Include KML Styling

### v13.5.0 - 2025-07-10

- :rocket: Update Schema to support additional symbol properties
- :tada: Add support for new circle type `u-r-b-c-c`
- :rocket: Add support for Circle Style properties
- :tada: Add support for `labels_on`

### v13.4.0 - 2025-07-03

- :tada: Add `Emergency` section to schema
- :rocket: Infer `emergency` section in `from_geojson` if an Emergency CoT type is matched

### v13.3.0 - 2025-06-25

- :rocket: Direct import of CoT Library

### v13.2.0 - 2025-06-25

- :rocket: Web Compatible UUID generation

### v13.1.0 - 2025-06-25

- :tada: Support parsing to Route format if type is set during `from_geojson`

### v13.0.0 - 2025-06-25

- :tada: The base CoT object is now seperate from the Parser
- :rocket: Migrate to/from calls to use `CoTParser` class

### v12.37.0 - 2025-06-06

- :tada: First pass at mapping MilSym

### v12.36.0 - 2025-06-01

- :rocket: `archived(archived?: boolean): boolean` Helper Function
- :white_check_mark: Add basic helper function tests

### v12.35.0 - 2025-05-28

- :rocket: `stale` value is now calculated based on current time

### v12.34.0 - 2025-05-26

- :tada: Add to/from parsing of R&B to geojson utilities
- :bug: Ensure units are in Km for Turf Conversion

### v12.33.0 - 2025-05-26

- :tada: Initial support for Range & Bearing geometry generation
- :arrow_up: Update Core Deps

### v12.32.4 - 2025-05-20

- :arrow_up: Update Core Deps

### v12.32.3 - 2025-04-30

- :rocket: Expose 2525 via index

### v12.32.2 - 2025-04-30

- :rocket: Remove Main

### v12.32.1 - 2025-04-30

- :rocket: Add 2525 Export

### v12.32.0 - 2025-04-30

- :tada: Augment COT Types with 2525B

### v12.31.0 - 2025-04-30

- :tada: Add CoT Type <=> SIDC

### v12.30.1 - 2025-04-28

- :arrow_up: Update Core Deps

### v12.30.0 - 2025-04-24

- :tada: Bi-Directional `creator` support
- :tada: COT core MilSym support
- :rocket: Avoid constant `detail` check with new helper fn

### v12.29.0 - 2025-04-21

- :rocket: Add `COT.type()` helper fn

### v12.28.0 - 2025-04-17

- :bug: Update StrokeWidth to allow Numeric Values

### v12.27.0 - 2025-04-17

- :rocket: Add `is_stale` fn

### v12.26.0 - 2025-04-17

- :rocket: Allow specifying a working path when creating a DataPackage

### v12.25.0 - 2025-04-15

- :rocket: Add support for `Marti => Dest => Group`

### v12.24.0 - 2025-04-15

- :bug: Fix paths when running on windows
- :arrow_up: Update all base deps

### v12.23.0 - 2025-03-04

- :rocket: Ensure DataPackage zip reader is closed when using `DataPackage.parse`
- :rocket: Automatically remove provided zip container given to `DataPackage.parse` unless `opts.cleanup = false`

### v12.22.0 - 2025-03-04

- :arrow_up: Update core deps

### v12.21.0 - 2025-02-03

- :tada: Add support for identifying DataPackages that are Mission Archive Exports
- :rocket: Add types present in MissionArchive Exports
- :rocket: Include unknown properties in `unknown` object of DataPackage

### v12.20.0 - 2025-01-28

- :rocket: Make Callsign Optional

### v12.19.0 - 2025-01-04

- :rocket: Ensure entire attribute type is reflected in GeoJSON

### v12.18.0 - 2025-01-01

- :tada: Add `strict: false` mode to DataPackage parsing that will turn a zip file into a DataPackage if it is not valid

### v12.17.1 - 2024-12-27

- :arrow_up: Update all core deps

### v12.17.0 - 2024-12-04

- :arrow_up: Update all core deps

### v12.16.2 - 2024-12-04

- :bug: Fix bug where calling `to_proto` twice would fail

### v12.16.1 - 2024-11-23

- :bug: Fix type complaint on CoT being converted to XML when it could be a `Buffer<ArrayBufferLike>`

### v12.16.0 - 2024-11-21

- :tada: Add limited Sensor GeoJSON Parsing - NOTE: it does not respect that sensors are in a 3D space reprojected into 2D so the sensor geojson isn't entirely correct

### v12.15.0 - 2024-11-11

- :rocket: Add internally stored `path` value

### v12.14.0 - 2024-11-11

- :rocket: Allow `Feature.Path: string` on GeoJSON Features

### v12.13.0 - 2024-11-04

- :rocket: Add support for Mission GUID dest tagging

### v12.12.0 - 2024-11-04

- :rocket: Add full bidirectional support for `ConnectionEntry` fields

### v12.11.0 - 2024-11-01

- :rocket: Allow `string` and `buffer` in `DataPackage.addFile` definition

### v12.10.0 - 2024-10-31

- :rocket: Add a ton of new Sensor Attribute keys that were surfaced in CoT mining
- :data: Add Video Configuration object type

### v12.9.0 - 2024-10-26

- :bug: MissionChange can have no text in `creatorUid` Tag

### v12.8.0 - 2024-10-26

- :rocket: Add `.to_json` call for Basemap XML

### v12.7.1 - 2024-10-16

- :rocket: Remove `exports` from package.json for now Ref: https://github.com/dfpc-coe/node-CoT/issues/47

### v12.7.0 - 2024-10-16

- :rocket: Add `DataPackage.files()` Fn for getting non-attachment files

### v12.6.0 - 2024-10-15

- :rocket: Allow 0 length polylines to allow for removal from ATAK

### v12.5.2 - 2024-10-10

- :bug: Resolver was having trouble with export path
- :bug: Group parsing wasn't adding `__` prefix from proto => CoT

### v12.5.1 - 2024-10-09

- :rocket: Add Types Export

### v12.5.0 - 2024-10-09

- :rocket: Use Numerics for Sensor Attributes

### v12.4.0 - 2024-09-30

- :rocket: Use internal XMLDocument class as base for Iconset/Basemap
- :tada: Add initial Iconset Types

### v12.3.0 - 2024-09-18

- :bug: Support parsing CoTs with empty/non-populated video tag

### v12.2.0 - 2024-09-17

- :tada: Add support for parsing Basemap XML Documents

### v12.1.0 - 2024-09-09

- :rocket: Add preliminary support for TAK Routes => GeoJSON LineStrings

### v12.0.0 - 2024-09-05

- :rocket: Add `object` type support to COT Constructor definition
- :bug: Removal of `Type.Index` on `event` in JSONCOT type definition to fix AJV Coerce Types
- :bug: Removal surfaced `archive` inconsistencies
- :bug: Removal surfaced `__forcedelete` inconsistencies

### v11.2.0 - 2024-09-03

- :rocket: Add basic typed support for Range & Bearing Values

### v11.1.0 - 2024-08-16

- :bug: Tasking messages don't have location field in MissionChange entry

### v11.0.0 - 2024-08-14

- :rocket: Require the top level TAKMessage Protobuf in `from_proto` Fn

### v10.12.2 - 2024-08-12

- :bug: MissionSync required uid to be the same for `t-x-d-d`

### v10.12.1 - 2024-08-12

- :white_check_mark: Add validation tests to ensure validation takes place

### v10.12.0 - 2024-08-12

- :data: Add `ForceDelete` helper class

### v10.11.0 - 2024-08-08

- :white_check_mark: Fixing type test

### v10.10.1 - 2024-08-08

- :bug: Fix deploy on branch

### v10.10.0 - 2024-08-08

- :bug: Fix default export in COTTypes

### v10.9.5 - 2024-08-07

- :arrow_up: Update batch-error

### v10.9.4 - 2024-08-07

- :rocket: Seperate out Geometry type into unique type def

### v10.9.3 - 2024-08-07

- :rocket: Enforce `import type` vs `import`

### v10.9.2 - 2024-08-07

- :bug: Fix polyline parsing error

### v10.9.1 - 2024-08-06

- :bug: Swap path and UID

### v10.9.0 - 2024-08-06

- :rocket: Extend the `DataPackage.addFile` method to allow specifying the file is an attachment

### v10.8.0 - 2024-08-05

- :tada: Expose a tmp dir aware version of the hash code

### v10.7.0 - 2024-08-05

- :bug: Hash should be `sha256sum` and not UID in MANIFEST

### v10.6.2 - 2024-08-05

- :bug: Fix bug in DataPackage attachment hash calculation

### v10.6.1 - 2024-08-05

- :bug: Fix bug in DataPackage attachment hash calculation

### v10.6.0 - 2024-08-05

- :tada: Initial release of the CotTypes manager/parser

### v10.5.0

- :bug: Fix an instance of `a-f-g` cot type to `a-f-G`

### v10.4.0

- :rocket: Merge attachments defined in DataPackage manifest with those defined via CoT `attachment_list` property

### v10.3.0

- :rocket: Add `MissionChange` parsing

### v10.2.0

- :rocket: Add `DataPackage.hash` fn

### v10.1.0

- :rocket: Add `addFile` `getFile` Endpoints

### v10.0.0

- :rocket: Move `Feature` and `Types` out of root for cleaner docs
- :rocket: Add `attachments` suppport for GeoJSON
- :rocket: Add `attachment_list` suppport for CoTs

### v9.10.0

- :rocket: Support QuickPic File Relations
- :bug: Fix type in DataPackage Error
- :rocket: Add additional `<link\>` attrs

### v9.9.0

- :rocket: Surface `ackrequest` in GeoJSON

### v9.8.0

- :rocket: Hoise Polyline Styles to top level geojson style

### v9.7.0

- :rocket: support closing polylines and point polylines

### v9.6.0

- :rocket: Add truncation to Ellipse outputs (including circle)

### v9.5.0

- :rocket: Add support for Circles

### v9.4.0

- :rocket: Add support for Targeting

### v9.3.0

- :rocket: Add support for `geofence` property

### v9.2.0

- :white_check_mark: Add missionLayer test
- :rocket: Add `DEBUG_COTS` debug output

### v9.1.0

- :rocket: Add support for `mission` & `missionLayer` Tags

### v9.0.0

- :rocket: Use opacity values between `0-1` instead of TAK style values `0-255` for better interop with external data

### v8.5.2

- :arrow_up: Update Core Deps

### v8.5.1

- :rocket: Use Simple Style Spec where possible `color` => `marker-color` and `opacity` => `marker-opacity`

### v8.5.0

- :bug: Fix colour encoding to XML
- :white_check_mark: Add Reversal Tests for Color

### v8.4.0

- :rocket: Add `color` detail properties in encoding/decoding and types

### v8.3.0

- :rocket: Add Schema support for `path` and `after` when using `<dest/>` with Mission Sync API Ref: https://wiki.tak.gov/display/VBM/Mission+Layers

### v8.2.0

- :white_check_mark: Add tests for ensuring newlines are retained in remarks

### v8.1.0

- :rocket: Add ability to set Ephemeral or Permanent package type

### v8.0.1

- :bug: Include `@openaddresses/batch-error`

### v8.0.0

- :tada: *BREAKING* Full Bi-Directional Parsing of DataPackages

### v7.3.0

- :rocket: Relax speed/course/slope to allow floats

### v7.2.2

- :bug: Ensure Proto Directory is copied to dist/lib/proto

### v7.2.1

- :bug: Ensure Proto Directory is copied to dist

### v7.2.0

- :tada: Preliminary support for V1 Protobuf encoded CoT messages
- :white_check_mark: Round trip to/from proto tests mirring the to/from geojson tests
- :arrow_up: Update to latest deps

### v7.1.0

- :rocket: Distribute ATAK CoT Proto files with node-cot

### v7.0.1

- :bug: Ensure `Feature` is accessible outside of library by using named

### v7.0.0

- :tada: Use more strictly defined Feature types

### v6.11.0

- :rocket: `Track._attributes` is now optional

### v6.10.0

- :tada: :arrow_up: Add basic support for UAS generated CoTs
- :tada: Add `video` parsing
- :tada: Add `sensor` parsing

### v6.9.1

- :bug: Only pass in _attributes in GeoJSONified Links

### v6.9.0

- :rocket: Add BiDirectional parsing of Feature Links

### v6.8.0

- :rocket: Add support for URL Links

### v6.7.0

- :rocket: Add schema support for `ackrequest`

### v6.6.0

- :rocket: Allow type coercion as all XML attrs are in strings by default

### v6.5.0

- :rocket: Add ability to ignore `dest` section in diff

### v6.4.0

- :rocket: Add ability to ignore `flow` section in diff

### v6.3.3

- :white_check_mark: Update GH Release action

### v6.3.2

- :white_check_mark: Update GH Release action

### v6.3.1

- :white_check_mark: Update iTAK CoT tests

### v6.3.0

- :white_check_mark: Add basic unit tests for diff mode

### v6.2.2

- :bug: Explicit array check to keep tsc happy

### v6.2.1

- :bug: Cleaner `addDest` TS code

### v6.2.0

- :arrow_up: Switch to ESLint Flat Config

### v6.1.0

- :rocket: Add reversal of `metadata` property in `to_geojson()`

### v6.0.0

- :tada: Add `metadata` section in GeoJSON feature for custom props
- :rocket: Add `addDest` function for easily adding dest to an existing COT
- :rocket: Add `isDiff` function for comparing two COTs
- :data: Add DataPackage builder

### v5.7.1

- :bug: Add missing file

### v5.7.0

- :tada: Build FileShare helper class

### v5.6.0

- :tada: Add support for `fileshare` COT

### v5.5.1

- :tada: Add TAK Server Version Attributes

### v5.5.0

- :tada: Migrate to TypeBox based schema for stricter types and to avoid JSONSchema compilation step

### v5.4.0

- :tada: Include suppport for `archived` tag
- :arrow_up: Update Core Deps

### v5.3.1

- :arrow_up: Update Core Deps

### v5.3.0

- :rocket: Add full reversal support for Marti/Dest tags

### v5.2.0

- :rocket: Add basic support for Marti/Dest tags in schema

### v5.1.1

- :bug: Make Chat vars optional

### v5.1.0

- :rocket: Add `chat` property to GeoJSON output

### v5.0.6

- :bug: Detail is optional in Tak/Pongs

### v5.0.5

- :bug: Object Defs

### v5.0.4

- :bug: Optional `_flow-tags_._attributes`

### v5.0.3

- :bug: `remarks._text` is optional

### v5.0.2

- :bug: `remarks._attributes` is optional

### v5.0.1

- :bug: Add `package.json` in `dist/`

### v5.0.0

- :tada: `schema.json` is now automatically generated from Type Defs
- :tada: Add Chat interface for easily creating Direct Messages
- :rocket: Add Flow Tag when parsed by NodeCoT
- :arrow_up: Update Typescript
- :white_check_mark: Add Chat & Flow tests

### v4.6.0

- :rocket: Decode `__group` to `.properties.group`

### v4.5.1

- :bug: Fix contact parser in `from_geojson`

### v4.5.0

- :rocket: Support `center` property and calculate if not present
- :rocket: Support `flow` property from `_flow-tags_`;
- :rocket: Support `group` property from `__group`;
- :rocket: Support `takv` property from `takv`;
- :rocket: Support `status` property from `status`;
- :rocket: Support `Droid` property from `uid._attributes.Droid`;
- :rocket: Support `contact` property from `contact`;
- :rocket: Support `precisionlocation` property from `precisionlocation`;

### v4.4.2

- :bug: Close `u-d-r` Polygons

### v4.4.1

- :rocket: `u-d-r` type can also be a polygon

### v4.4.0

- :rocket: Support `Polygon` & `LineString` `to_geojson()`
- :bug: Fix previously unused Packed colour => opacity

### v4.3.0

- :bug: Fix Opacity default to a non-zero value

### v4.2.1

- :bug: Close coordinates in `u-d-f` type

### v4.2.0

- :bug: Fix the polygon type from a Rectangle CoT type to a Polygon

### v4.1.2

- :pencil2: Update Git Repo Location

### v4.1.1

- :arrow_up: Update Core Deps

### v4.1.0

- :bug: Fix parsing of `remarks` field in `from_geojson`
- :rocket: Support for `course` in `to_geojson`
- :rocket: Support for `speed` in `to_geojson`
- :rocket: Support for `icon` in `to_geojson`
- :rocket: Support for `remarks` in `to_geojson`
- :rocket: Support for HAE in `to_geojson`

### v4.0.0

- :rocket: Rename `XMLCoT` to `CoT` and make it the default export
- :tada: Add `.is_` fns for testing CoT type
- :white_check_mark: Add `cot.is_*` unit tests

### v3.5.4

- :bug: Ensure `to_geojson` FN returns proper coordinate order
- :arrow_up: Update Deps

### v3.5.3

- :bug: Ensure `to_geojson` FN returns numeric coordinates

### v3.5.2

- :arrow_up: Update Deps

### v3.5.1

- :arrow_up: Update Deps

### v3.5.0

- :rocket: Add support for the `remarks` field

### v3.4.3

- :arrow_up: `TypeScript@5`

### v3.4.2

- :bug: Fix location of track data

### v3.4.1

- :bug: Fix location of track data

### v3.4.0

- :tada: Add `speed` & `course` parsing

### v3.3.0

- :tada: Add Height Extraction from GeoJSON from `z` coordinate

### v3.2.0

- :tada: Add support for icon property parsing in GeoJSON

### v3.1.1

- :bug: Include schema.json in dist output

### v3.1.0

- :rocket: Expand use of known vs generic raw attributes

### v3.0.0

- :rocket: Rewrite in TypeScript

### v2.8.1

- :bug: Fix typo in error message

### v2.8.0

- :bug: Significant improvements to start/time/stale parsing
- :white_check_mark: Add tests for date parsing
- :rocket: Support parsing `Date` types
- :arrow_up: General Dep Update

### v2.5.0

- :tada: Automatically perform basic schema validation on CoT Creation

### v2.4.0

- :tada: `from_geojson(Feature.LineString)` Support

### v2.3.0

- :tada: `from_geojson(Feature.Polygon)` Support

### v2.2.1

- :bug: `event.display` => `event.detail`

### v2.2.0

- :bug: Bugfixes in default values
- :bug: Ensure `to_geojson` is a function call that doesn't modify underlying message

### v2.1.3

- :bug: Continue squashing a ton of small expectation issues to get an MVP of a point on TAK

### v2.1.2

- :bug: Parse GeoJSON Point coords into COT

### v2.1.1

- :bug: Parse GeoJSON Point coords into COT

### v2.1.0

- :rocket: Allow setting `type` & `how` from GeoJSON

### v2.0.0

- :rocket: Class based XML CoT approach
- :tada: Add GeoJSON to/from parsing (experimental)
- :white_check_mark: Update tests to use `tape`
- :pencil2: Update docs to Class approach
- :pencil2: Add a CHANGELOG
