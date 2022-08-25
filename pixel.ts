export type Pixel = {
  readonly x: number;
  readonly y: number;
  readonly r: number;
  readonly g: number;
  readonly b: number;
}

function isRecord(r: unknown): r is Record<string, unknown> {
  return typeof r === "object" && r !== null;
}

function isIntegerInRange(num: unknown, exclusiveMax: number): num is number {
  return typeof num === "number" && Math.floor(num) === num && num >= 0 &&
    num < exclusiveMax;
}

export function hasPixel(
  p: unknown,
  width: number,
  height: number,
): p is Pixel {
  return isRecord(p) &&
    isIntegerInRange(p.x, width) &&
    isIntegerInRange(p.y, height) &&
    isIntegerInRange(p.r, 256) &&
    isIntegerInRange(p.g, 256) &&
    isIntegerInRange(p.b, 256);
}

export function isPerfectPixel(
  p: unknown,
  width: number,
  height: number,
): p is Pixel {
  return isRecord(p) &&
    Object.keys(p).length === 5 &&
    isIntegerInRange(p.x, width) &&
    isIntegerInRange(p.y, height) &&
    isIntegerInRange(p.r, 256) &&
    isIntegerInRange(p.g, 256) &&
    isIntegerInRange(p.b, 256);
}
