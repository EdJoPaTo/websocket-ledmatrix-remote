FROM docker.io/denoland/deno:1.25.0
WORKDIR /app
EXPOSE 8080

COPY deno.json *.ts ./
RUN deno cache *.ts

COPY . ./
RUN deno bundle client-web.ts public/client.js

CMD deno run --allow-net=:8080 --allow-read websocket-ledmatrix-remote.ts
