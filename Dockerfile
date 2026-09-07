FROM node:22.22.0-alpine
ENV BMRG_HOME=/opt/boomerang/server

# Fix CVE-2026-31789 (OpenSSL heap buffer overflow) while matching the
# package version already present in node:22.22.0-alpine.
RUN apk add --no-cache openssl=3.5.8-r0

WORKDIR $BMRG_HOME
COPY server .
# Install server deps, then remove build-only package managers from runtime image
RUN npm install -g npm@11.16.0 pnpm@10.34.1 && CI=true pnpm install --production --config.minimumReleaseAge=0 --ignore-scripts

RUN rm -rf /usr/local/lib/node_modules/npm /usr/local/lib/node_modules/pnpm /usr/local/bin/npm /usr/local/bin/npx /usr/local/bin/pnpm /usr/local/bin/pnpx

# Create user, chown, and chmod. 
# OpenShift requires that a numeric user is used in the USER declaration instead of the user name
RUN chmod -R u+x $BMRG_HOME \
    && chgrp -R 0 $BMRG_HOME  \
    && chmod -R g=u $BMRG_HOME
USER 2000

EXPOSE 3000
ENTRYPOINT node scripts/rewriteAssetPaths && node_modules/.bin/boomerang-webapp-server serve
