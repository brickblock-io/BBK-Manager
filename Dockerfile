FROM node:10 as build
WORKDIR /app

# Needed to tell webpack what environment to build for
ARG BBK_RUNTIME_ENVIRONMENT=production

# Needed for tagging sentry releases
ARG COMMIT_SHA

# Copy dependency specifications first, so we only have to re-install
# dependencies when the package.json or yarn.lock change and can make
# full use of docker's layer caching
COPY package.json yarn.lock .yarnclean /app/
RUN yarn install --frozen-lockfile

# Now copy the rest of the app into the container
COPY . /app
RUN yarn build

# caddy isn't too disciplined with properly tagging their images so we have to use 'latest' here :-/
# hadolint ignore=DL3007
FROM abiosoft/caddy:latest
COPY --from=build /app/build /srv
COPY Caddyfile /etc/Caddyfile
