---
name: Release Management
description: Instructions for updating the changelog and managing GitHub releases.
---

# Release Management Skill

This skill provides instructions for managing the release process of `@ilamy/testoise`, including updating the `CHANGELOG.md` and creating GitHub releases.

## Updating CHANGELOG.md

When changes are made to the project, follow these steps to update the `CHANGELOG.md`:

1. **Identify Changes**: Determine the type of changes made (e.g., Added, Changed, Deprecated, Removed, Fixed, Security).
2. **Determine Version**: Decide on the next version number based on Semantic Versioning (SemVer).
3. **Format Entry**: Add a new entry to `CHANGELOG.md` under a new version header.
   - Use the format: `## [Version] - YYYY-MM-DD`
   - Group changes under relevant subheadings (e.g., `### Added`, `### Fixed`).
   - **Only Changes Since Last Version**: Do not include changes already present in previous entries.
4. **Link to PRs & Commits**:
   - **Prefer PRs**: Always link to the Pull Request (PR) if one exists for the change.
   - **Major Commits**: Only link to individual commits if they are major and don't have a corresponding PR.
   - **Redundancy**: Never link both a PR and a commit for the same change.
5. **Update Links**: (Optional) Update the comparison links at the bottom of the file if they exist.

## Managing GitHub Releases

After publishing to NPM and updating the changelog, create a GitHub release:

1. **Tag the Release**: Use `git tag v<version>` and `git push origin v<version>` to tag the release in the repository (always ask for permission).
2. **Create Release**: Use the GitHub CLI (`gh release create`) or the GitHub web interface to create a new release.
   - **Tag**: Use the tag created in step 1.
   - **Title**: Use the version number (e.g., `v0.0.1`).
   - **Description**: Copy the relevant entries from `CHANGELOG.md` for this version.
   - **Assets**: (Optional) Attach any build artifacts if necessary.

## Automation Rules

- **Always Check CHANGELOG**: Before finalizing a task that changes logic, check if `CHANGELOG.md` needs an update.
- **Consistency**: Ensure the version in `package.json`, `CHANGELOG.md`, and the GitHub tag are identical.
- **Turtle Branding**: Maintain the tortoise-themed branding in release descriptions. 🐢🚀
