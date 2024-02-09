import { HEIGHT, WIDTH } from "./constants.ts";
import { hasPixel, type Pixel } from "./pixel.ts";

type PixelFunction = (pixel: Pixel) => void;

export class Client {
	#ws: WebSocket;
	constructor(
		public readonly server: string,
		public readonly onPixel: PixelFunction = (pixel) => {
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

function connect(server: string, onPixel: PixelFunction) {
	console.log("Connecting to", server);
	const ws = new WebSocket(server);
	ws.addEventListener("open", () => {
		console.log("Connected to server", server);
	});
	ws.addEventListener("close", () => {
		console.warn("Disconnected from server", server);
	});
	ws.addEventListener("error", (event) => {
		console.error("WebSocket ERROR", event);
	});
	ws.addEventListener("message", (message) => {
		try {
			const data = JSON.parse(message.data) as unknown;
			if (hasPixel(data, WIDTH, HEIGHT)) {
				onPixel(data);
			} else {
				console.log("Got unknown message from server", message.data);
			}
		} catch (error) {
			console.error("onmessage ERROR", error, message.data);
		}
	});

	return ws;
}
