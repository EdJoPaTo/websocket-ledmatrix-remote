import { bundle } from "https://deno.land/x/emit@0.19.0/mod.ts";
const { code } = await bundle("client-web.ts");
await Deno.writeTextFile("public/client.js", code);
