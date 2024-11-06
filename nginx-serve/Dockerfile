FROM node:18-bullseye AS runtime

RUN apt-get update -y \
    && apt-get install -y --no-install-recommends \
        git bash g++ make \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /code

RUN git config --global --add safe.directory /code

# ------------------------------------------------------------------------------------
FROM runtime AS nginx-build

# TODO: Add cache with packages.json
# This is not working, will need @samshara help to configure this
# COPY package.json yarn.lock /code/
# COPY app/package.json /code/app/
COPY . /code

RUN yarn install --frozen-lockfile --network-concurrency 2

# Dynamic configs. Can be changed with containers. (Placeholder values)
ENV APP_TITLE=APP_TITLE_PLACEHOLDER
ENV APP_ENVIRONMENT=APP_ENVIRONMENT_PLACEHOLDER
ENV APP_MAPBOX_ACCESS_TOKEN=APP_MAPBOX_ACCESS_TOKEN_PLACEHOLDER
ENV APP_TINY_API_KEY=APP_TINY_API_KEY_PLACEHOLDER
ENV APP_API_ENDPOINT=https://APP-API-ENDPOINT-PLACEHOLDER.COM/
ENV APP_RISK_API_ENDPOINT=https://APP-RISK-API-ENDPOINT-PLACEHOLDER.COM/
ENV APP_SENTRY_DSN=https://APP-SENTRY-DSN-PLACEHOLDER.COM

# Static configs (Configured when building docker image)
ARG APP_SENTRY_TRACES_SAMPLE_RATE=
ENV APP_SENTRY_TRACES_SAMPLE_RATE=${APP_SENTRY_TRACES_SAMPLE_RATE}
ARG APP_SENTRY_REPLAYS_SESSION_SAMPLE_RATE=
ENV APP_SENTRY_REPLAYS_SESSION_SAMPLE_RATE=${APP_SENTRY_REPLAYS_SESSION_SAMPLE_RATE}
ARG APP_SENTRY_REPLAYS_ON_ERROR_SAMPLE_RATE=
ENV APP_SENTRY_REPLAYS_ON_ERROR_SAMPLE_RATE=${APP_SENTRY_REPLAYS_ON_ERROR_SAMPLE_RATE}


RUN yarn build \
    && cd app \
    && yarn build

# ------------------------------------------------------------------------------------
FROM nginx:1 AS nginx-serve

LABEL maintainer="IFRC"
LABEL org.opencontainers.image.source="https://github.com/IFRCGo/go-web-app"

COPY ./nginx-serve/apply-helm-config.sh /docker-entrypoint.d/
COPY ./nginx-serve/nginx.conf.template /etc/nginx/templates/default.conf.template
COPY --from=nginx-build /code/build /code/build

ENV SOURCE_DIRECTORY=/code/build/
ENV DESTINATION_DIRECTORY=/usr/share/nginx/html/
ENV OVERWRITE_DESTINATION=true
