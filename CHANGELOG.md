# Changelog
All changes will be recorded in this file, formatted loosely around [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), using [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## 3.0.0

### Added
- Command groups - group similar commands together by using scope
    - e.g. `app install-package` and `app remove-package` can become `app package install` and `app package remove`
- Middleware - intercept options, run a function before each command, measure how long commands take, and more

### Changed
- Actions now have type "Action"
- CommandActionContext has been renamed to ActionContext
- Options are now specified in the constructor of Application
- Everything now uses classes
- Public methods (except run) will return `this`
- Flags are now seperate from options in ActionContext due to type issues

### Removed
- Ability to disable help option 

### Fixed
- Command names being allowed any characters

## 2.0.1
### Fixed
- Option parse regex would ignore value if any special characters were included. Made more lenient, only disallows whitespace and dashes.

## 2.0.0 
### Added
- Example from README in `examples/`
- Options are now also converted to camelcase

### Changed
- Switched platform from Node.js to Deno
- Improved README
- Made ApplicationSpec optional

### Removed
- TypeDoc page, since it is incompatible with Deno

## 1.0.0
Initial release of library