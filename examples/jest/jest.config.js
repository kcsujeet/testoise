export default {
	testEnvironment: "jest-environment-jsdom",
	testEnvironmentOptions: {
		customExportConditions: ["node", "node-addons"],
	},
	transform: {
		"^.+\\.(t|j)sx?$": "@swc/jest",
	},
	moduleNameMapper: {
		"^(\\.{1,2}/.*)\\.js$": "$1",
	},
};
