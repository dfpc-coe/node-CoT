# CHANGELOG

## Emoji Cheatsheet
- :pencil2: doc updates
- :bug: when fixing a bug
- :rocket: when making general improvements
- :white_check_mark: when adding tests
- :arrow_up: when upgrading dependencies
- :tada: when adding new features

## Version History

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
