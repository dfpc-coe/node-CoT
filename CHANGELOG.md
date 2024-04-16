# CHANGELOG

## Emoji Cheatsheet
- :pencil2: doc updates
- :bug: when fixing a bug
- :rocket: when making general improvements
- :white_check_mark: when adding tests
- :arrow_up: when upgrading dependencies
- :tada: when adding new features

## Version History

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
