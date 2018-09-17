FROM node:alpine

WORKDIR /opt/boomerang/server

COPY server .

RUN npm install --production

EXPOSE 3000

ENTRYPOINT node scripts/rewriteAssetPaths && npm start