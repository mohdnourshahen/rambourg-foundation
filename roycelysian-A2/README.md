# Roycelysian — website

Static site (HTML/CSS/JS, Lenis smooth scroll).

**Build:** run `node build.js` after any edit to `js/data.js` or a page. It prerenders the dynamic sections, writes each page's SEO head and structured data, generates one page per project (`<slug>.html`, served at `/<slug>`), and rewrites `sitemap.xml` and `robots.txt`. Templates live in `js/render.js` (shared by the browser and the build). Images are served as WebP with `-sm` (1100px) variants for phones; the `.jpg` files remain for social share images.

Preview: `python3 -m http.server 8796` inside this folder → http://localhost:8796

- Content and projects: `js/data.js` (contact details, hero slides, projects, expertise)
- Shared header, menu, footer and motion: `js/main.js`
- Styles and palette: `css/style.css` (Midnight Navy #17232D, Deep Forest #243A32, Warm Ivory #F3F0E8, Stone #B9B0A2)
- Type: Morison Display (headlines, self-hosted WOFF2 in assets/fonts — commercial font, needs a web licence), Hanken Grotesk (text, Google Fonts), Miller Banner (logo wordmark), Monsieur La Doulaise (script accent)
- Images: `assets/img/` (pulled from the previous roycelysian.com, resized; `-sm` = 1100px versions)
- Brand: `assets/brand/` (wordmark and R monogram extracted from the old logo, without "Luxury Solutions")

**One-page site:** `index.html` holds every section (studio, work, expertise, publications, contact). The menu glides between sections; projects open in a panel over the page (`/#<slug>`, Back closes it). Each project also has a standalone page (`<slug>.html`, served at `/<slug>`) for search engines and shared links. Old URLs (`/work`, `/studio`, `/contact`…) redirect to their section.

## To confirm before launch
- Email, Instagram, Behance and LinkedIn links (`RY.contact` in `js/data.js`) are placeholders.
- Exact scope ("Our role") for each project.
- The library interior (`riad-library.jpg`) was named "Zeryab" on the old server but captioned "Riad Elhob" on the old site; it is currently shown under Riad Elhob.
- The Signature Book on the home and Publications pages is a CSS concept render, not a produced book.
- Contact form opens the visitor's email app (mailto); connect a form service if needed.
