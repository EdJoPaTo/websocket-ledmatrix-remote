import { HEIGHT, WIDTH } from "./constants.ts";
import { hasPixel, Pixel } from "./pixel.ts";

type PixelHandleFunc = (pixel: Pixel) => void;
let ws: WebSocket | undefined;
let handlePixelFunc: PixelHandleFunc = (pixel) =>
  console.log("new pixel", pixel);

export function setPixelHandleFunc(func: PixelHandleFunc) {
  handlePixelFunc = func;
}

function connect() {
  const server =
    (location?.origin.replace(/^http/, "ws") ?? "ws://localhost:8080") + "/ws";
  console.log("Connecting to", server);
  ws = new WebSocket(server);
  ws.onopen = () => console.log("Connected to server", server);
  ws.onclose = () => console.warn("Disconnected from server", server);
  ws.onmessage = (m) => {
    try {
      const data = JSON.parse(m.data);
      if (hasPixel(data, WIDTH, HEIGHT)) {
        handlePixelFunc?.(data);
      } else {
        console.log("Got unknown message from server", m.data);
      }
    } catch (error: unknown) {
      console.error("onmessage ERROR", error, m.data);
    }
  };
}

connect();
setInterval(() => {
  if (ws && ws.readyState === ws.CLOSED) {
    console.log("Try reconnecting to websocket");
    connect();
  }
}, 2500);

export function sendPixel(
  x: number,
  y: number,
  r: number,
  g: number,
  b: number,
) {
  ws?.send(JSON.stringify({ x, y, r, g, b }));
}
