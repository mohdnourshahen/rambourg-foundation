# Rambourg Foundation website — notes for Claude

New site for rambourg-foundation.com (replacing the old WordPress/Oxpitan site), built Nov 2026.
The person working on it writes in Arabic (Jordanian dialect) or English — reply in their language.

## Run and build
- Preview: `python3 serve.py` → http://localhost:8795 (no-cache server with Range support for the video).
  Ports 8787/8788/8790 belong to other projects.
- Build: `python3 build.py` → runs `prerender.py`, then writes `dist/` and `rambourg-foundation-site.zip`.
  Always rebuild after editing `js/data.js`.
- The project sits on an exFAT drive that creates `._*` files: run `find . -name "._*" -delete` before building or committing.
- After every finished change, give the localhost link to the page that changed.

## Structure
- Static HTML/CSS/JS. GSAP 3.12.5 + ScrollTrigger (cdnjs), Lenis 1.1.13 (unpkg). Shared header, footer and motion in `js/main.js`.
- Content: `js/data.js` (`window.RF`: pillars, films, news, people, instagram, marwan, press); gallery in `js/gallery.js`.
- Pages: index, about, leadership (founder + president; `guillaume.html` redirects here), films, people,
  news ("Journal"), eveil (L'Éveil d'une Nation / عهد الأمان), gallery, contact, 404.
  `pillar.html` and `article.html` are templates.
- `prerender.py` reads `data.js` through osascript JXA (macOS only) and generates `/pillars/<slug>/` and `/journal/<slug>/`
  (with `<base href="/">`, so the site must live at the domain root), per-page SEO, `sitemap.xml` and `robots.txt`.
  Main-page titles and descriptions are in its `MAIN` dict.
- Fonts: Rowan Oak (logo serif, woff2), Work Sans (Google Fonts), Thmanyah Serif Display for Arabic (`:lang(ar)`).
- Colours: brand palette in `css/style.css`. Italic accents are blue; footer is #272F3D.
- Footer credit: "Developed & designed by Lon Visuals" → lonvisuals.com.

## Client rules (must follow)
- The foundation is a UK charity founded in London in February 2011 (Charity Commission no. 1140347) that works internationally.
  It is **not** Tunisian, and its creation is **not** linked to the Tunisian revolution. Never write "From Tunis to Venice",
  "born after the revolution", or "Rambourg Foundation Tunisie" as its name. Projects in Tunisia may be described factually.
- Always present **our founder (Guillaume Rambourg)** and **our president (Sarah Rambourg, since 2023)** together.
- Always write "Sarah Rambourg", never "Sarah Ben Hsouna".
- No personal or childhood photos of Guillaume ("it's not a personal blog").
- Journal house style: the foundation's voice ("we"), real quotes only (never invented), captioned photos.

## Sources
- The old-site content archive is in `old-site/CONTENT.md` and `old-site/images/` (not committed to git).
- Brand kit: `../RF_DesignKit/` (logos, fonts). Reference photos: `../RF_References/`.
- Instagram @rambourg.foundation. Its bio reads: founded in 2011 by Guillaume Rambourg, presided by Sarah Rambourg.
- Facts used and still to confirm are listed in `PUBLISHING.md`.

## Deployment (prepared, not yet live)
- `Dockerfile` (nginx:1.27-alpine serving `dist/` on 8080), `nginx.conf` (old WordPress URL redirects, caching, headers),
  `fly.toml` (app `rambourg-foundation`, London region), `.github/workflows/fly-deploy.yml`
  (deploys on push to `main` using the `FLY_API_TOKEN` secret).
- `dist/` is committed because the Docker image copies it. Run `python3 build.py` before pushing.
- Still to do: create the GitHub repo and the Fly.io app under the owner's account, add `FLY_API_TOKEN`
  (`fly tokens create deploy`) as a repository secret, push, and point the domain at Fly.
  The `gh` and `flyctl` CLIs were not installed. The owner signs in themselves.

## Open items
- A solo portrait of Sarah Rambourg; the date of the home hero photo (`assets/img/events/founder-president-stage.jpg`).
- Image rights for the Marwan artworks (Christie's); Google Search Console after launch (steps in `PUBLISHING.md`).
- The full log of the first build conversation is in `../RF_Handoff/session-export.zip` (outside git, 97 MB).
