FROM node:alpine

WORKDIR /opt/boomerang/server

COPY server .

COPY .npmrc .

RUN npm install --production

EXPOSE 3000

ENTRYPOINT node scripts/rewriteAssetPaths && npm start