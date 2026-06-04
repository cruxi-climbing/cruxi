# use the official Bun image
# see all versions at https://hub.docker.com/r/oven/bun/tags
FROM oven/bun:1.3.14 AS base
WORKDIR /usr/src/app

FROM base AS turbo-prune
WORKDIR /monorepo
RUN bun install -g turbo@^2
COPY . .

# will create a /out/full and /out/json
RUN turbo prune @cruxi/api --docker

# install dependencies into temp directory
# this will cache them and speed up future builds
FROM base AS install
RUN mkdir -p /temp/dev
COPY --from=turbo-prune /monorepo/out/json /temp/dev/
RUN cd /temp/dev && bun install --frozen-lockfile

# install with --production (exclude devDependencies)
RUN mkdir -p /temp/prod
COPY --from=turbo-prune /monorepo/out/json /temp/prod/
RUN cd /temp/prod && bun install --frozen-lockfile --production

# copy node_modules from temp directory
# then copy all (non-ignored) project files into the image
FROM base AS prerelease
COPY --from=install /temp/dev/node_modules node_modules
COPY . .

# [optional] tests & build
ENV NODE_ENV=production
RUN bun verify

# copy production dependencies and source code into final image
FROM base AS release
COPY --from=install /temp/prod/node_modules node_modules
COPY --from=prerelease /usr/src/app/package.json .
COPY --from=prerelease /usr/src/app/apps apps
COPY --from=prerelease /usr/src/app/packages packages

# run the app
USER bun
EXPOSE 3000/tcp
ENTRYPOINT [ "bun", "run", "apps/api/index.ts" ]