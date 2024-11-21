import { bundle } from "jsr:@deno/emit@0.46";

const { code } = await bundle("client-web.ts", {
	minify: true,
	compilerOptions: {
		inlineSourceMap: true,
		inlineSources: true,
	},
});
await Deno.writeTextFile("public/client.js", code);
