import { Application, Router } from "https://deno.land/x/oak@v12.6.1/mod.ts";
import { HEIGHT, WIDTH } from "./constants.ts";
import { isPerfectPixel, type Pixel } from "./pixel.ts";

const sockets = new Map<string, WebSocket>();
const app = new Application({ logErrors: false });
const router = new Router();

router.get("/ws", (ctx) => {
	if (!ctx.isUpgradable) {
		ctx.throw(501);
	}

	const ws = ctx.upgrade();
	const uid = crypto.randomUUID();

	ws.addEventListener("open", () => {
		try {
			sockets.set(uid, ws);
			console.log(
				"Client +",
				uid,
				"current",
				sockets.size,
			);
		} catch (error) {
			console.log("ERROR onopen", error);
			ws.close(1008, "Server Error");
		}
	});
	ws.addEventListener("close", () => {
		sockets.delete(uid);
		console.log(
			"Client -",
			uid,
			"current",
			sockets.size,
		);
	});
	ws.addEventListener("error", (ev) => {
		console.log("WebSocket ERROR", ev);
	});
	ws.addEventListener("message", (m) => {
		try {
			const data = JSON.parse(m.data) as unknown;
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

router.get("/healthz", (ctx) => {
	ctx.response.type = "text/plain";
	ctx.response.headers.set(
		"Cache-Control",
		"no-store",
	);
	ctx.response.body = "ok";
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
app.use(async (ctx) => {
	ctx.response.headers.set("Content-Security-Policy", CONTENT_SECURITY_POLICY);
	await ctx.send({
		index: "index.html",
		// maxage: 1000 * 60 * 60 * 20, // 20h
		root: `${Deno.cwd()}/public`,
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
