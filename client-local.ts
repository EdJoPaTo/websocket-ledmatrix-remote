import { sendPixel } from "./client.ts";
import { HEIGHT, WIDTH } from "./constants.ts";

setInterval(() => {
  const x = Math.floor(Math.random() * WIDTH);
  const y = Math.floor(Math.random() * HEIGHT);
  try {
    sendPixel(x, y, 128, 255, 0);
  } catch (error: unknown) {
    console.warn(
      "ERROR sendPixel",
      error instanceof Error ? error.message : error,
    );
  }
}, 500);
