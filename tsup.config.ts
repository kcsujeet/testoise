import { defineConfig } from "tsup";

export default defineConfig({
	entry: ["src/bun.ts", "src/vitest.ts", "src/jest.ts"],
	format: ["esm"],
	dts: true,
	external: ["bun:test", "vitest", "jest", "@jest/globals"],
	clean: true,
	outDir: "dist",
});
