FROM docker.io/denoland/deno:1.24.3
WORKDIR /app
EXPOSE 8080

COPY deno.json *.ts ./
RUN deno cache *.ts

COPY . ./
RUN deno bundle client-web.ts public/client.js

HEALTHCHECK --timeout=5s \
  CMD deno run --allow-net=:8080 healthcheck.ts

CMD deno run --allow-net=:8080 --allow-read websocket-ledmatrix-remote.ts
