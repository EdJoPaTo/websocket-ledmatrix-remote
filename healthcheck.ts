const result = await fetch("http://localhost:8080/healthz");
if (result.status !== 200) {
  Deno.exit(1);
}

const text = await result.text();
if (text !== "ok") {
  Deno.exit(1);
}
