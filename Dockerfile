FROM docker.io/denoland/deno:1.29.1
RUN apt-get update \
	&& apt-get upgrade -y \
	&& apt-get clean \
	&& rm -rf /var/lib/apt/lists/* /var/cache/* /var/log/*

WORKDIR /app
EXPOSE 8080

COPY deno.jsonc *.ts ./
RUN deno cache *.ts

COPY . ./
RUN deno bundle client-web.ts public/client.js

CMD deno run --allow-net=:8080 --allow-read websocket-ledmatrix-remote.ts
