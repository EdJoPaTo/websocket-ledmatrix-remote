FROM docker.io/denoland/deno:latest AS builder
RUN apt-get update \
	&& apt-get upgrade -y \
	&& apt-get install -y unzip
WORKDIR /app
COPY . ./
RUN deno run \
	--allow-env \
	--allow-net=jsr.io \
	--allow-read \
	--allow-write \
	bundle.ts
RUN deno compile \
	--allow-net=:8080 \
	--allow-read \
	websocket-ledmatrix-remote.ts


FROM docker.io/library/debian:bookworm-slim AS final
RUN apt-get update \
	&& apt-get upgrade -y \
	&& apt-get clean \
	&& rm -rf /var/lib/apt/lists/* /var/cache/* /var/log/*

WORKDIR /app
EXPOSE 8080

COPY --from=builder /app/public public
COPY --from=builder /app/websocket-ledmatrix-remote /usr/local/bin/

CMD ["websocket-ledmatrix-remote"]
