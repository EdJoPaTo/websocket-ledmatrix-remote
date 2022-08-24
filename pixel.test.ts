import { hasPixel, isPerfectPixel } from "./pixel.ts";

Deno.test({
  name: "hasPixel example works",
  fn() {
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
  },
});

Deno.test({
  name: "hasPixel invalid data fails",
  fn() {
    function checkIsNotPixel(p: unknown): void {
      if (hasPixel(p, 8, 8)) {
        throw new Error("is a pixel: " + JSON.stringify(p));
      }
    }

    checkIsNotPixel("bla");
    checkIsNotPixel({});
    checkIsNotPixel({ foo: "bar" });
  },
});

Deno.test({
  name: "hasPixel overly specified works",
  fn() {
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
  },
});

Deno.test({
  name: "isPerfectPixel overly specified fails",
  fn() {
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
  },
});
