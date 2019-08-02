FROM node:alpine

WORKDIR /opt/boomerang/server

COPY server .

ARG ART_USER
ARG ART_PASSWORD
ARG ART_URL

RUN apk add --no-cache --virtual .build-deps curl && \
    curl -k -v -u $ART_USER:$ART_PASSWORD $ART_URL/api/npm/boomeranglib-npm/auth/boomerang -o .npmrc && \
    npm install --production && \
    rm -f .npmrc && \
    apk del .build-deps

EXPOSE 3000

ENTRYPOINT node scripts/rewriteAssetPaths && npm start
