# CHANGELOG

## Emoji Cheatsheet
- :pencil2: doc updates
- :bug: when fixing a bug
- :rocket: when making general improvements
- :white_check_mark: when adding tests
- :arrow_up: when upgrading dependencies
- :tada: when adding new features

## Version History

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
