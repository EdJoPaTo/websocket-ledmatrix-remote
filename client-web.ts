import { Client } from "./client.ts";
import { getCurrentColor } from "./client-web-color.ts";
import { HEIGHT, WIDTH } from "./constants.ts";

const SERVER = location.origin.replace(/^http/, "ws") + "/ws";
const client = new Client(SERVER, (pixel) => {
  const { x, y, r, g, b } = pixel;
  const field = document.querySelector(`#field${x}x${y}`) as HTMLElement;
  field.style.backgroundColor = `rgb(${r},${g},${b})`;
});

function setCurrentColor(x: number, y: number) {
  client.send({ x, y, ...getCurrentColor() });
}

const matrix = document.querySelector("#matrix") as HTMLElement;
let lastMove = { x: -1, y: -1 };
matrix.addEventListener("touchmove", (event) => {
  const touches = event.changedTouches[0];
  if (!touches) {
    return;
  }

  const target = document.elementFromPoint(touches.clientX, touches.clientY);
  if (target instanceof HTMLElement && target.id.startsWith("field")) {
    const [x, y] = target.id.slice(5).split("x").map(Number);
    if (
      typeof x === "number" && typeof y === "number" &&
      (x !== lastMove.x || y !== lastMove.y)
    ) {
      setCurrentColor(x, y);
      lastMove = { x, y };
    }
  }
});

for (let y = 0; y < HEIGHT; y++) {
  const row = document.createElement("div");
  row.classList.add("row");
  for (let x = 0; x < WIDTH; x++) {
    const element = document.createElement("div");
    element.id = `field${x}x${y}`;
    element.addEventListener("click", () => {
      setCurrentColor(x, y);
    });
    element.addEventListener("mouseenter", (event) => {
      if (event.buttons > 0) {
        setCurrentColor(x, y);
      }
    });

    row.append(element);
  }

  matrix.append(row);
}

// Fade to black
setInterval(() => {
  for (let y = 0; y < HEIGHT; y++) {
    for (let x = 0; x < WIDTH; x++) {
      const field = document.querySelector(
        `#field${x}x${y}`,
      ) as (HTMLElement | undefined);
      if (!field) {
        continue;
      }

      const color = field.style.backgroundColor;
      if (color.startsWith("rgb(")) {
        const [r, g, b] = color.slice(4, -1).split(",").map((o) =>
          Math.max(0, Math.floor(Number(o.trim()) * 0.9))
        );
        field.style.backgroundColor = r || g || b ? `rgb(${r},${g},${b})` : "";
      }
    }
  }
}, 100);
