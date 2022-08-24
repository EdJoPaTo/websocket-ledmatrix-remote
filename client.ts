import { HEIGHT, WIDTH } from "./constants.ts";
import { hasPixel, Pixel } from "./pixel.ts";

type PixelFunc = (pixel: Pixel) => void;

export class Client {
  #ws: WebSocket;
  constructor(
    public readonly server: string,
    public readonly onPixel: PixelFunc = (pixel) =>
      console.log("new pixel", pixel),
  ) {
    this.#ws = connect(server, onPixel);
    setInterval(() => {
      if (this.#ws.readyState === WebSocket.CLOSED) {
        console.log("Try reconnecting to websocket", this.server);
        this.#ws = connect(server, onPixel);
      }
    }, 2500);
  }

  public send(pixel: Pixel) {
    this.#ws.send(JSON.stringify(pixel));
  }
}

function connect(server: string, onPixel: PixelFunc) {
  console.log("Connecting to", server);
  const ws = new WebSocket(server);
  ws.onopen = () => console.log("Connected to server", server);
  ws.onclose = () => console.warn("Disconnected from server", server);
  ws.onmessage = (m) => {
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
  };
  return ws;
}
