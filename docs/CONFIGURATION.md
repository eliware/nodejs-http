# Runtime configuration

Set `PUBLIC_DIR` to the published nodejs-repository tree. Set `STATIC_DIR` to the built website directory.

Set `HOST` and `PORT` to change the listener. Set `BLOG_DIR` only when the repository contains blog documents.

Set `DIRECTORY_LISTING` and `DIRECTORY_INDEX` to control file browsing. Keep `ALLOW_DOTFILES` and `ALLOW_SYMLINKS` disabled for published content.

Set `SECURITY_HEADERS`, `COMPRESSION`, and `CACHE_CONTROL` to control HTTP responses. Keep access logs enabled for production operations.

Use `.env.example` as a local configuration reference. Keep credentials and private runtime values outside Git.
