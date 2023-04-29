FROM docker.io/lukechannings/deno:latest AS deno

FROM docker.io/library/debian:bullseye-slim

COPY --from=deno /usr/bin/deno /usr/local/bin/
RUN useradd --uid 1993 --user-group deno \
	&& mkdir -p /deno-dir \
	&& chown deno:deno /deno-dir \
	&& deno --version
ENV DENO_DIR /deno-dir/
ENV DENO_INSTALL_ROOT /usr/local

RUN apt-get update \
	&& apt-get upgrade -y \
	&& apt-get clean \
	&& rm -rf /var/lib/apt/lists/* /var/cache/* /var/log/*

WORKDIR /app
EXPOSE 8080

COPY . ./
RUN deno cache *.ts
RUN deno run --allow-env --allow-read --allow-write --allow-net=deno.land bundle.ts

CMD ["deno", "run", "--allow-net=:8080", "--allow-read", "websocket-ledmatrix-remote.ts"]
