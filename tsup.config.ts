import { defineConfig } from "tsup";

export default defineConfig({
	entry: ["src/bun.ts", "src/vitest.ts", "src/jest.ts", "src/core.ts"],
	format: ["esm"],
	dts: true,
	splitting: true,
	external: ["bun:test", "vitest", "jest", "@jest/globals"],
	clean: true,
	outDir: "dist",
});
