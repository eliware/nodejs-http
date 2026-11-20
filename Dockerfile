FROM ghcr.io/eliware/centos10-node26:latest AS frontend-build

USER root
WORKDIR /opt/nodejs-http
COPY package.json package-lock.json ./
RUN PUPPETEER_SKIP_DOWNLOAD=true npm ci
COPY src ./src
COPY webpack.config.mjs ./webpack.config.mjs
RUN npm run build

FROM ghcr.io/eliware/centos10-node26:latest

USER root
ENV NODE_ENV=production
WORKDIR /opt/nodejs-http
COPY package.json package-lock.json ./
RUN npm ci --omit=dev && npm cache clean --force
COPY --chown=node:node bin/server.mjs ./bin/server.mjs
COPY --chown=node:node src ./src
COPY --chown=node:node templates ./site
COPY --chown=node:node public/assets ./site/assets
COPY --from=frontend-build --chown=node:node /opt/nodejs-http/dist ./site/web
ENV HOST=0.0.0.0 \
    PORT=7100 \
    PUBLIC_DIR=/srv/repository \
    BLOG_DIR=/srv/repository/content/blogs \
    STATIC_DIR=/opt/nodejs-http/site \
    DIRECTORY_TEMPLATE=/opt/nodejs-http/site/directory-listing.html \
    CACHE_CONTROL="no-store, no-cache, must-revalidate, max-age=0" \
    SECURITY_HEADERS=true \
    ACCESS_LOG=true \
    DIRECTORY_LISTING=true \
    DIRECTORY_INDEX=true \
    COMPRESSION=true \
    RAM_CACHE=false
EXPOSE 7100
USER node
CMD ["node", "bin/server.mjs"]
