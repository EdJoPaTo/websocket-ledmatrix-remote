import { bundle } from "https://deno.land/x/emit@0.27.0/mod.ts";
const { code } = await bundle("client-web.ts", {
	compilerOptions: {
		inlineSourceMap: true,
		inlineSources: true,
	},
});
await Deno.writeTextFile("public/client.js", code);
