# Midnight Frame Blog Foundation

A stylish, multi-page static blog scaffold designed for GitHub Pages.

## Included

- Home page with featured post + latest post grid
- Post detail page loaded by slug query parameter
- Tag archive page with tag cloud and filtered results
- Data-driven post manifest in data/posts.json
- 404 page for GitHub Pages fallback
- Motion system with reduced-motion support

## File map

- index.html: homepage
- post.html: article detail page
- tags.html: tag archive page
- 404.html: not found page
- style.css: global design system and responsive styles
- main.js: rendering and routing logic
- data/posts.json: post metadata source of truth
- posts/*.html: article body partials

## Publish on GitHub Pages

1. Push this folder content to your repository root (or configured publish folder).
2. In GitHub, open Settings > Pages.
3. Under Build and deployment:
   - Source: Deploy from a branch
   - Branch: main (or your default branch)
   - Folder: /(root)
4. Save and wait for deployment.
5. Open the generated Pages URL and verify Home, Post, Tags, and 404 pages.

## Add a new post

1. Create a new file in posts/, for example posts/my-next-post.html.
2. Add a new object in data/posts.json with fields:
   - slug
   - title
   - date (YYYY-MM-DD)
   - tags (array)
   - excerpt
   - readingTime
   - status (published or draft)
   - featured (true or false)
   - content (path to your posts/*.html file)
3. Commit and push.
4. Confirm the new post appears on Home, Post detail, and Tag archive flows.

## Notes

- Use relative links only for GitHub Pages compatibility.
- Keep one featured post for visual rhythm on the homepage.
- If you plan to use a custom domain later, add a CNAME file as a follow-up.
