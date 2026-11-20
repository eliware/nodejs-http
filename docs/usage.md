# Run the application

Use Node.js 26 or later. Install dependencies with `npm ci` from the repository root.

The server reads repository files from `PUBLIC_DIR`. The default path is `public/` under the current working directory. The default listener is `0.0.0.0:7100`.

The source checkout does not contain an assembled static site or a Node.js repository tree. Build and assemble the site before you start the server directly.

```sh
npm ci
npm run build
mkdir -p .local-site/web .local-site/assets
cp templates/* .local-site/
cp public/assets/* .local-site/assets/
cp dist/* .local-site/web/
export STATIC_DIR="$PWD/.local-site"
export DIRECTORY_TEMPLATE="$PWD/.local-site/directory-listing.html"
export PUBLIC_DIR=/path/to/nodejs-repository
export HOST=127.0.0.1
export PORT=7100
npm start
```

Open `http://127.0.0.1:7100/` in a browser. The server can return static pages without repository metadata. The `/ready` endpoint returns HTTP 503 until the required metadata files exist.

Set runtime values in the process environment. The application does not load `.env` files. Use `.env.example` as a list of settings, and do not commit private values.

The `.local-site/` directory contains generated files. Assemble it again after you change a template, asset, or browser module.

## Container operations

Set `REPOSITORY_ROOT` to the published repository directory. Compose attaches that directory at `/srv/repository` as read-only and binds port 7100 to localhost.

```sh
export REPOSITORY_ROOT=./nodejs-repository
docker compose up --build -d
```

Check the container with `docker compose ps` and `curl --fail http://127.0.0.1:7100/ready`. View logs with `docker compose logs --follow web`. Stop the container with `docker compose down`.

The container uses the published `ghcr.io/eliware/centos10-node26:latest` image for both build and runtime stages. A build stage creates the browser assets. The runtime stage copies the application, templates, and assets into the image. The application reads repository content from the read-only directory. It does not build RPMs or change repository files.

## Local development

Run `npm run build` or `npm run build:web` to build the browser bundle in `dist/`. Run `npm run check:blogs` with `BLOG_DIR` set to a directory of blog JSON documents. Run `npm test` for final validation before a commit.
