FROM node:10 as build
WORKDIR /app

# Needed to tell webpack what environment to build for
ARG BBK_RUNTIME_ENVIRONMENT=production
ENV BBK_RUNTIME_ENVIRONMENT=${BBK_RUNTIME_ENVIRONMENT}

# Copy dependency specifications first, so we only have to re-install
# dependencies when the package.json or yarn.lock change and can make
# full use of docker's layer caching
COPY package.json yarn.lock .yarnclean /app/
RUN yarn install --frozen-lockfile

# Now copy the rest of the app into the container
COPY . /app
RUN yarn build

FROM abiosoft/caddy
COPY --from=build /app/build /srv
COPY Caddyfile /etc/Caddyfile
