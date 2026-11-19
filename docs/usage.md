# Run the HTTP server

Use Node.js 26 or later. Install locked dependencies with `npm ci`.

Set `PUBLIC_DIR` to the published nodejs-repository tree. Start the server with `npm start`.

The server listens on `0.0.0.0:7001` by default. It returns repository files and metadata through read-only routes.

Run the server in a container with `docker compose up --build -d`. Set `REPOSITORY_ROOT` to the local repository path before you start Compose.
