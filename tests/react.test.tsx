import { cleanup, render, screen } from "@testing-library/react";
import type React from "react";
import { afterEach, describe, expect, it } from "vitest";
import { def, get } from "../src/vitest.js";

// A simple component that accepts props
const UserProfile = ({ username, age }: { username: string; age: number }) => {
	return (
		<div>
			<h1>Profile: {username}</h1>
			<p>Age: {age}</p>
		</div>
	);
};

describe("React Component with testoise", () => {
	// Clean up after each test to unmount the React components
	afterEach(() => {
		cleanup();
	});

	// Define our reactive lazy variables
	def("username", () => "Guest");
	def("age", () => 30);

	// Define the component using the other lazy variables.
	// We use "as any" or explicitly cast because get returns T but sometimes TS needs help in TSX
	def("component", () => (
		<UserProfile username={get<string>("username")} age={get<number>("age")} />
	));

	it("renders with default props", () => {
		render(get<React.ReactElement>("component"));
		expect(screen.getByText("Profile: Guest")).toBeDefined();
		expect(screen.getByText("Age: 30")).toBeDefined();
	});

	describe("when the user is logged in", () => {
		// Override lazy variable `username`
		def("username", () => "Alice");
		def("age", () => 25);

		it("renders the new user without needing to redefine the component", () => {
			render(get<React.ReactElement>("component"));
			// Notice we didn't have to redefine `component`, it automatically picks up the new `username` and `age`!
			expect(screen.getByText("Profile: Alice")).toBeDefined();
			expect(screen.getByText("Age: 25")).toBeDefined();
		});
	});
});
