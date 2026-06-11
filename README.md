# UX design concepts

Design concepts for the Open Home Foundation. Only the `public/` folder is deployed (as a static site on Cloudflare Pages), each concept lives in its own folder inside it. Nothing here is production software.

## How to operate

**Add a new design:** create a folder inside `public/` (e.g. `public/concept1/`) and drop the whole design export in it. It must contain an `index.html`. The page `<title>` becomes the concept name on the landing page, and an optional `<meta name="description">` becomes its blurb.

**Update an existing design:** delete all the contents inside the folder first, then paste the whole export again. If you paste on top of the old files, files that were removed from the design will stay around and keep being deployed.

**Regenerate the landing page:** run `pnpm build`. It scans the concept folders and rewrites `public/index.html`. Cloudflare Pages also runs it on every deploy (build command `pnpm build`, output directory `public`), so committing the concept folder is enough. Never edit `public/index.html` by hand.

## Search engines

The whole site is blocked from indexing: `robots.txt` disallows everything, `_headers` sends `X-Robots-Tag: noindex, nofollow` on every path, and entry pages carry a `noindex` meta tag. Keep it that way for new concepts.
