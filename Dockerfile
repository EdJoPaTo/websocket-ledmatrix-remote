FROM docker.io/denoland/deno:1.27.0
WORKDIR /app
EXPOSE 8080

COPY deno.jsonc *.ts ./
RUN deno cache *.ts

COPY . ./
RUN deno bundle client-web.ts public/client.js

CMD deno run --allow-net=:8080 --allow-read websocket-ledmatrix-remote.ts
