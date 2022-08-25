import { HEIGHT, WIDTH } from "./constants.ts";
import { hasPixel, Pixel } from "./pixel.ts";

type PixelFunc = (pixel: Pixel) => void;

export class Client {
  #ws: WebSocket;
  constructor(
    public readonly server: string,
    public readonly onPixel: PixelFunc = (pixel) => {
      console.log("new pixel", pixel);
    },
  ) {
    this.#ws = connect(server, onPixel);
    setInterval(() => {
      if (this.#ws.readyState === WebSocket.CLOSED) {
        console.log("Try reconnecting to websocket", this.server);
        this.#ws = connect(server, onPixel);
      }
    }, 2500);
  }

  public send(pixel: Pixel): void {
    this.#ws.send(JSON.stringify(pixel));
  }
}

function connect(server: string, onPixel: PixelFunc) {
  console.log("Connecting to", server);
  const ws = new WebSocket(server);
  ws.addEventListener("open", () => {
    console.log("Connected to server", server);
  });
  ws.addEventListener("close", () => {
    console.warn("Disconnected from server", server);
  });
  ws.addEventListener("message", (m) => {
    try {
      const data = JSON.parse(m.data) as unknown;
      if (hasPixel(data, WIDTH, HEIGHT)) {
        onPixel(data);
      } else {
        console.log("Got unknown message from server", m.data);
      }
    } catch (error: unknown) {
      console.error("onmessage ERROR", error, m.data);
    }
  });

  return ws;
}
