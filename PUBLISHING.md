# Rambourg Foundation website — publishing notes

## What to upload
`rambourg-foundation-site.zip` (or the `dist/` folder) is the complete site: plain HTML, CSS and JavaScript,
no server code and no database. Upload its contents to the root of any static host.

Good options: Netlify (drag the `dist` folder onto app.netlify.com/drop), Cloudflare Pages, Vercel,
GitHub Pages, or the current web host's `public_html`. Point `rambourg-foundation.com` at it.

- `404.html` is the "page not found" page (Netlify and Cloudflare pick it up automatically).
- `sitemap.xml` and `robots.txt` assume the site lives at https://rambourg-foundation.com.
  If the address changes, update them and the `canonical` / `og:` tags at the top of each page.

## Updating content
All text for pillars, news, press and the Marwan works lives in `js/data.js`; gallery photos in `js/gallery.js`.
Edit those files, then rebuild:

    python3 build.py        # writes dist/ and rambourg-foundation-site.zip
    python3 serve.py        # preview locally at http://localhost:8795

## To confirm with the foundation before launch
1. Image rights — Marwan artworks are © Estate MARWAN, courtesy of the lenders (credited on the site);
   confirm with Christie's that the foundation may show them. Le Monde photos of L'Éveil d'une Nation are
   credited "Fondation Rambourg Tunisie". Instagram photos are the foundation's own.
2. Founding line — the site follows the current Instagram bio ("founded in 2011 by Guillaume Rambourg").
   Le Monde (2016) credits Olfa Rambourg as founder; agree the wording.
3. Guillaume Rambourg's bio (from Wikipedia) and the Human Rights Watch line.
4. Posters for The Man Who Sold His Skin and L'Éveil d'une Nation: replace
   `assets/img/posters/man-who-sold-his-skin.svg` with the real poster file.
5. Social links — Instagram and LinkedIn are linked; add X / Facebook if they exist.
6. The contact form opens the visitor's email app (no data stored). To receive messages directly,
   connect a form service (Netlify Forms, Formspree) — a 10-minute change.
7. A privacy notice page (recommended for a UK charity, even with no cookies).

## Old addresses
The old WordPress site used addresses like `/arts/`, `/education/`, `/guillaume-rambourg/`.
These redirects are already in `_redirects` (used by Netlify and Cloudflare Pages); on other hosts, set them up the same way:

    /arts/                 /pillar.html?p=arts                 301
    /cultural-activities/  /pillar.html?p=cultural-activities  301
    /festivals/            /pillar.html?p=festivals            301
    /education/            /pillar.html?p=education            301
    /scholarships/         /pillar.html?p=scholarships         301
    /human-rights/         /pillar.html?p=human-rights         301
    /entrepreneurship/     /pillar.html?p=entrepreneurship     301
    /craftsmanship-2/      /pillar.html?p=craftsmanship        301
    /sport/                /pillar.html?p=sport                301
    /guillaume-rambourg    /guillaume.html                     301

## Writing for the Journal (house style)
- First person, the foundation's voice ("we"), the person before the foundation.
- Each story in `js/data.js` → `news`: a type (`cat`), a pillar, a one-line summary (`excerpt`), three short paragraphs,
  a real quote when there is one (never invented), and a captioned main photo (`imgCap`) of at least 1,600 px.
- Event photos go in `photos` (3–5 per story).

## Things to update by hand
- **From Instagram** strip: `instagram` in `js/data.js` (newest first). It does not update itself; for a live feed,
  connect a service such as Behold or SnapWidget later.
- **Posters** live in `assets/img/posters/` (`eveil.jpg`, `man-who-sold-his-skin.jpg`). Posters are always shown
  whole (never cropped); to replace one, overwrite the file with the same name and rebuild.

## SEO
- `python3 build.py` runs `prerender.py` first. It writes a real page for every pillar (`/pillars/<slug>/`) and
  every journal story (`/journal/<slug>/`) with its own title, description, canonical link, social image,
  structured data (schema.org) and the full text, plus `sitemap.xml` (with images) and `robots.txt`.
  **Always rebuild after editing `js/data.js`**, so new stories get their page and enter the sitemap.
- Pre-rendered pages use `<base href="/">`, so the site must live at the root of the domain
  (https://rambourg-foundation.com/), not in a sub-folder.
- Page titles and descriptions for the main pages are set in `prerender.py` (`MAIN` and `PILLAR_TITLE`).
  Keep titles under ~65 characters and descriptions around 140–155.

### After launch — Google Search Console (free, no cookies on the site)
1. Go to https://search.google.com/search-console and add the property `rambourg-foundation.com` (Domain).
2. Verify it with the DNS TXT record Google gives you (at the domain registrar).
3. In **Sitemaps**, submit `https://rambourg-foundation.com/sitemap.xml`.
4. In **URL inspection**, request indexing for the home page, `/films.html`, `/eveil.html` and the newest story.
5. Check **Pages** and **Enhancements** a week later for errors; test any page at https://search.google.com/test/rich-results
6. Also add the site in Bing Webmaster Tools (it can import from Search Console in one click).

### Keeping the ranking growing
- Publish a journal story at least once a month (residencies, screenings, scholarships) and share it on Instagram and LinkedIn with the link.
- Ask partners (Delfina Foundation, Christie's, Columbia SIPA, festivals) to link to the relevant page — links from trusted sites matter most.
- Keep the Instagram and LinkedIn profiles pointing to https://rambourg-foundation.com.
