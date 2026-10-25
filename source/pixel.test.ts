import test from "node:test";

import { hasPixel, isPerfectPixel } from "./pixel.ts";

test("hasPixel example works", () => {
	const example = {
		x: 2,
		y: 3,
		r: 0,
		g: 128,
		b: 255,
	};
	if (!hasPixel(example, 8, 8)) {
		throw new Error("not a pixel");
	}
});

test("hasPixel invalid data fails", () => {
	function checkIsNotPixel(p: unknown): void {
		if (hasPixel(p, 8, 8)) {
			throw new Error("is a pixel: " + JSON.stringify(p));
		}
	}

	checkIsNotPixel("bla");
	checkIsNotPixel({});
	checkIsNotPixel({ foo: "bar" });
});

test("hasPixel overly specified works", () => {
	const example = {
		x: 2,
		y: 3,
		r: 0,
		g: 128,
		b: 255,
		foo: "bar",
	};
	if (!hasPixel(example, 8, 8)) {
		throw new Error("should be a pixel");
	}
});

test("isPerfectPixel overly specified fails", () => {
	const example = {
		x: 2,
		y: 3,
		r: 0,
		g: 128,
		b: 255,
		foo: "bar",
	};
	if (isPerfectPixel(example, 8, 8)) {
		throw new Error("should not be a pixel");
	}
});
