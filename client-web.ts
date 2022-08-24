import { HEIGHT, WIDTH } from "./constants.ts";
import * as client from "./client.ts";

const field = document.querySelector("#field") as HTMLElement;
const rInput = document.querySelector("#r") as HTMLInputElement;
const gInput = document.querySelector("#g") as HTMLInputElement;
const bInput = document.querySelector("#b") as HTMLInputElement;

let lastMove = { x: -1, y: -1 };
field.ontouchmove = (event) => {
  const touches = event.changedTouches[0];
  if (!touches) return;
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
};

for (let y = 0; y < HEIGHT; y++) {
  const row = document.createElement("div");
  row.classList.add("row");
  for (let x = 0; x < WIDTH; x++) {
    const element = document.createElement("div");
    element.id = `field${x}x${y}`;
    element.onclick = () => setCurrentColor(x, y);
    element.onmouseenter = (event) => {
      if (event.buttons > 0) {
        setCurrentColor(x, y);
      }
    };
    row.appendChild(element);
  }
  field.appendChild(row);
}

function getCurrentColor(): [number, number, number] {
  return [
    Number((rInput as HTMLInputElement).value),
    Number((gInput as HTMLInputElement).value),
    Number((bInput as HTMLInputElement).value),
  ];
}

function setCurrentColor(x: number, y: number) {
  client.sendPixel(x, y, ...getCurrentColor());
}

client.setPixelHandleFunc((pixel) => {
  const { x, y, r, g, b } = pixel;
  const field = document.querySelector(`#field${x}x${y}`) as HTMLElement;
  field.style.backgroundColor = `rgb(${r},${g},${b})`;
});

// Fade to black
setInterval(() => {
  for (let y = 0; y < HEIGHT; y++) {
    for (let x = 0; x < WIDTH; x++) {
      const field = document.querySelector(`#field${x}x${y}`) as HTMLElement;
      const color = field?.style.backgroundColor;
      if (color.startsWith("rgb(")) {
        const [r, g, b] = color.slice(4, -1).split(",").map((o) =>
          Math.max(0, Math.floor(Number(o.trim()) * 0.9))
        );
        if (r || g || b) {
          field.style.backgroundColor = `rgb(${r},${g},${b})`;
        } else {
          field.style.backgroundColor = "";
        }
      }
    }
  }
}, 100);

rInput.value = Math.floor(Math.random() * 256).toFixed(0);
gInput.value = Math.floor(Math.random() * 256).toFixed(0);
bInput.value = Math.floor(Math.random() * 256).toFixed(0);

rInput.onchange = updateTextcolor;
gInput.onchange = updateTextcolor;
bInput.onchange = updateTextcolor;
updateTextcolor();
export function updateTextcolor() {
  const [r, g, b] = getCurrentColor();
  document.documentElement.style.setProperty("--color", `rgb(${r},${g},${b})`);
}
