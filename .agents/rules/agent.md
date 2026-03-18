# testoise Agent Technical Rules

When acting as an agent in this repository, you MUST follow these technical standards:

1. **Write Specs**: Always write or update tests (specs) for any logic changes.
2. **Lazy Var Patterns**: Follow the patterns established in `skills/testoise.md` (no globals, lazy dependency injection).
3. **Use Bun**: ALWAYS use `bun` as the primary runtime and package manager for this project. Use `bun test` for all core testing and `bun run` for scripts.
