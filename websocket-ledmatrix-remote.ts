import { Application, Router } from "jsr:@oak/oak@17";
import { HEIGHT, WIDTH } from "./constants.ts";
import { isPerfectPixel, type Pixel } from "./pixel.ts";

const sockets = new Map<string, WebSocket>();
const app = new Application({ logErrors: false });
const router = new Router();

router.get("/ws", (context) => {
	if (!context.isUpgradable) {
		context.throw(501);
	}

	const ws = context.upgrade();
	const uid = crypto.randomUUID();

	ws.addEventListener("open", () => {
		try {
			sockets.set(uid, ws);
			console.log("Client +", uid, "current", sockets.size);
		} catch (error) {
			console.log("ERROR onopen", error);
			ws.close(1008, "Server Error");
		}
	});
	ws.addEventListener("close", (event) => {
		sockets.delete(uid);
		console.log(
			"Client -",
			uid,
			"current",
			sockets.size,
			"wasClean:",
			event.wasClean,
			"code:",
			event.code,
			"reason:",
			event.reason,
		);
	});
	ws.addEventListener("error", (event) => {
		console.log("WebSocket ERROR", event);
	});
	ws.addEventListener("message", (message) => {
		try {
			const data = JSON.parse(message.data) as unknown;
			if (isPerfectPixel(data, WIDTH, HEIGHT)) {
				broadcastPixel(data, undefined);
			} else {
				ws.send("invalid pixel data");
			}
		} catch (error) {
			console.log(
				"onmessage ERROR",
				uid,
				error instanceof Error ? error.message : error,
			);
			ws.close(1008, "Server Error");
		}
	});
});

router.get("/healthz", (context) => {
	context.response.type = "text/plain";
	context.response.headers.set("Cache-Control", "no-store");
	context.response.body = "ok";
});

app.use(router.routes());
app.use(router.allowedMethods());
const CONTENT_SECURITY_POLICY = [
	"default-src 'none'",
	"base-uri 'none'",
	"form-action 'none'",
	"frame-ancestors 'none'",
	"connect-src 'self'",
	"script-src 'self'",
	"style-src 'self'",
].join("; ");
app.use(async (context) => {
	context.response.headers.set(
		"Content-Security-Policy",
		CONTENT_SECURITY_POLICY,
	);
	await context.send({
		index: "index.html",
		maxage: 1000 * 60 * 30, // 30 min
		root: import.meta.dirname + "/public",
	});
});

console.log("HTTP webserver running. Access it at: http://localhost:8080/");
await app.listen({ port: 8080 });

function broadcastPixel(pixel: Pixel, skipUid: string | undefined) {
	const message = JSON.stringify(pixel);
	broadcastRaw(message, skipUid);
}

function broadcastRaw(message: string, skipUid: string | undefined) {
	for (const [uid, ws] of sockets) {
		if (uid !== skipUid && ws.readyState === ws.OPEN) {
			try {
				ws.send(message);
			} catch (error) {
				console.log("ERROR on broadcast", error);
				try {
					ws.close(1008, "Server Error");
				} catch {
					// ignore
				}
			}
		}
	}
}
