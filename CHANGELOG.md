# CHANGELOG

All notable changes to this project will be documented in this file.

## [0.1.0] - 2026-03-18
### Added
- Improved project description in README and package.json.
- Modern alternative mention to `bdd-lazy-var` in documentation.
- New high-resolution branding screenshot in README.

### Changed
- **Simplified Nesting API**: Removed the redundant `testoise` callback parameter.
- **Enhanced Scoping**: Standard `describe` blocks now fully support type-safe `def` and `get` calls from the outer `testoise` scope.
- **Refactored Adapters**: Bun, Vitest, and Jest adapters now use a more efficient global registration mechanism for better nesting support.
- Updated all example files to use the new simplified pattern.

## [0.0.1] - 2026-03-17
- Initial release of `@ilamy/testoise`.
- Core lazy evaluation logic with `def` and `get`.
- Framework adapters for Bun, Vitest, and Jest.
- Scoped context management and redefinition protection.
- Support for React and Vue component testing.
- Monorepo-style examples for all supported runners.
- Automated Git hooks with `husky` and `lint-staged`.
