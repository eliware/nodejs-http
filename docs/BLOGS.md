# Blog document format

Each post uses the packaging repository metadata contract. Set `metadata_version` to the current packaging schema version. This value can use a different version from the HTTP app.

- Set a numeric `schema` field on every post.
- Provide every required value. Do not infer missing values.
- Reject the legacy `meta_version` field.
- Reject unknown fields to keep the public contract stable.
- Follow the packaging repository [metadata migration rules](https://github.com/eliware/nodejs-packaging/blob/main/docs/METADATA.md) when the schema changes.

## Canonical schema

Store one JSON post in the shared content directory at `content/blogs/`.

```json
{
  "metadata_version": "<packaging metadata schema version>",
  "schema": 2,
  "slug": "stable-releases",
  "title": "Following stable releases",
  "summary": "How to install stable Node.js updates.",
  "published_at": "2026-11-19T12:00:00Z",
  "updated_at": "2026-11-19T12:00:00Z",
  "author": "Eliware",
  "tags": ["releases", "stable"],
  "content_format": "markdown",
  "created_at": "2026-11-19T11:00:00Z",
  "category": "releases",
  "last_verified_at": "2026-11-19T12:00:00Z",
  "tested_on": ["Repository content review"],
  "status": "published",
  "content": "# Stable releases\n\nMarkdown content goes here."
}
```

Follow these field rules:

- Use unique slugs with lowercase letters, numbers, and hyphens.
- Set `title`, `summary`, `author`, and `content` to non-empty strings.
- Set `content_format` to `markdown`.
- Set `created_at` no later than `published_at`.
- Set `category` to a documented editorial category.
- Set `last_verified_at` to the date when a writer checked technical claims.
- List each platform used to check technical claims in `tested_on`.
- Set optional `hero_image` paths under `/assets/`.
- Set optional `related_slugs` values to valid post slugs.
- Set optional `series` and positive `series_order` values for tutorial series.
- Use UTC ISO 8601 timestamps ending in `Z` for `published_at` and `updated_at`.
- Set `updated_at` no earlier than `published_at`.
- Set `tags` to a non-empty array of unique strings.
- Set `status` to `draft` or `published`. Drafts do not appear on public pages or RSS.
- Derive canonical URLs from `slug`. Do not store URLs in the post.

The schema checker lives at `src/backend/blog/schema.mjs`. The matching test lives at `tests/backend/blog/schema.test.mjs`. The HTTP loader, API, post pages, and RSS use the same store validation.

Set `BLOG_DIR` to a content checkout, then run `npm run check:blogs`. The command checks each JSON post and finds duplicate slugs before publication.

## Published routes

- `/blog` lists published posts.
- `/blog/category/<category>` preselects an editorial category in the browser post list.
- `/blog/<slug>` returns one post page.
- `/blogs/` redirects to `/blog` for path compatibility.
- `/terms` and `/tos` return the Terms page.
- `/api/v1/blogs` returns the published post collection.
- `/api/v1/blogs/<slug>` returns one post and safe rendered HTML.
- `/feed.xml` returns RSS 2.0 XML.

The HTTP image contains the post viewer and schema code. At runtime, it reads JSON posts from the shared content volume. A writer can add or edit a post without rebuilding the image. Drafts stay out of public pages, APIs, RSS, and the sitemap.
