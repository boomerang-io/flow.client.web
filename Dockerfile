FROM node:22.22.0-alpine
ENV BMRG_HOME=/opt/boomerang/server

# Fix CVE-2026-31789 (OpenSSL heap buffer overflow) - use compatible version with Node 22
RUN apk add --no-cache openssl=3.5.6-r0

WORKDIR $BMRG_HOME
COPY server .
# Fix CVE-2026-26960 by using npm that bundles tar >= 7.5.8 in npm/node_modules/node-gyp/node_modules/tar
RUN npm install -g npm@10.9.7 pnpm@10.26.0 && CI=true pnpm install --production --config.minimumReleaseAge=0 --ignore-scripts

RUN rm -r /usr/local/lib/node_modules/npm/node_modules/cross-spawn/

# Create user, chown, and chmod. 
# OpenShift requires that a numeric user is used in the USER declaration instead of the user name
RUN chmod -R u+x $BMRG_HOME \
    && chgrp -R 0 $BMRG_HOME  \
    && chmod -R g=u $BMRG_HOME
USER 2000

EXPOSE 3000
ENTRYPOINT node scripts/rewriteAssetPaths && node_modules/.bin/boomerang-webapp-server serve
