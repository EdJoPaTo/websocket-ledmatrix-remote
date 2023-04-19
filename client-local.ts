import { Client } from "./client.ts";
import { HEIGHT, WIDTH } from "./constants.ts";

const SERVER = Deno.env.get("SERVER") ?? "ws://localhost:8080/ws";
const client = new Client(SERVER);

setInterval(() => {
	const x = Math.floor(Math.random() * WIDTH);
	const y = Math.floor(Math.random() * HEIGHT);
	const r = Math.floor(Math.random() * 256);
	const g = Math.floor(Math.random() * 256);
	const b = Math.floor(Math.random() * 256);
	try {
		client.send({ x, y, r, g, b });
	} catch (error: unknown) {
		console.warn(
			"ERROR sendPixel",
			error instanceof Error ? error.message : error,
		);
	}
}, 500);
