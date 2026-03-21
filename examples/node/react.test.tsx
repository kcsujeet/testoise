import assert from "node:assert";
import { afterEach, describe, it } from "node:test";
import { cleanup, render, screen } from "@testing-library/react";
import type React from "react";
import { def, get } from "../../src/node.js";

// A simple component that accepts props
const UserProfile = ({ username, age }: { username: string; age: number }) => {
	return (
		<div>
			<h1>Profile: {username}</h1>
			<p>Age: {age}</p>
		</div>
	);
};

describe("React Component with testoise (Node.js)", () => {
	// Clean up after each test to unmount the React components
	afterEach(() => {
		cleanup();
	});

	// Define our reactive lazy variables
	def("username", () => "Guest");
	def("age", () => 30);

	// Define the component using the other lazy variables.
	def("component", () => (
		<UserProfile username={get<string>("username")} age={get<number>("age")} />
	));

	it("renders with default props", () => {
		render(get<React.ReactElement>("component"));
		assert.ok(screen.getByText("Profile: Guest"));
		assert.ok(screen.getByText("Age: 30"));
	});

	describe("when the user is logged in", () => {
		// Override lazy variable `username`
		def("username", () => "Alice");
		def("age", () => 25);

		it("renders the new user without needing to redefine the component", () => {
			render(get<React.ReactElement>("component"));
			assert.ok(screen.getByText("Profile: Alice"));
			assert.ok(screen.getByText("Age: 25"));
		});

		describe("and it's their birthday", () => {
			// Deeply nested override
			def("age", () => 26);

			it("renders the incremented age", () => {
				render(get<React.ReactElement>("component"));
				assert.ok(screen.getByText("Profile: Alice"));
				assert.ok(screen.getByText("Age: 26"));
			});
		});

		it("returns to previous age (25) after the birthday block", () => {
			render(get<React.ReactElement>("component"));
			assert.ok(screen.getByText("Age: 25"));
		});
	});

	it("returns to default Guest profile after the inner describe blocks", () => {
		render(get<React.ReactElement>("component"));
		assert.ok(screen.getByText("Profile: Guest"));
		assert.ok(screen.getByText("Age: 30"));
	});
});
