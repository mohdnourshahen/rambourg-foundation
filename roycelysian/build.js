#!/usr/bin/env node
/* Roycelysian build: prerenders dynamic sections, writes per-page SEO, generates one static page per project,
   and writes sitemap.xml + robots.txt. Idempotent: run `node build.js` after every edit to js/data.js. */
const fs = require('fs'), path = require('path'), vm = require('vm');
const ROOT = __dirname, DOMAIN = 'https://roycelysian.com';
const read = f => fs.readFileSync(path.join(ROOT, f), 'utf8'), write = (f, s) => fs.writeFileSync(path.join(ROOT, f), s);

const ctx = { window: {} }; vm.createContext(ctx);
vm.runInContext(read('js/data.js'), ctx); vm.runInContext(read('js/render.js'), ctx);
const D = ctx.window.RY, R = ctx.window.RYR, esc = R.esc;

const real = u => u && !/^https?:\/\/[^/]+\/?$/.test(u);           // skip placeholder social links
const sameAs = ['instagram', 'behance', 'linkedin'].map(k => D.contact[k]).filter(real);
const ogImg = k => `${DOMAIN}/assets/img/${k}.jpg`;
const STUDIO_ID = `${DOMAIN}/#studio`;

const PAGES = {
  'index.html': { slug: '', name: 'Home', img: 'zeryab-pool',
    title: 'Roycelysian — Luxury Branding, Photography & Editorial Design Studio',
    desc: 'Creative studio for photography, branding and editorial design for exceptional properties, hotels and premium brands in Jordan, Saudi Arabia and beyond.' },
  'work.html': { slug: 'work', name: 'Work', img: 'nal-pool',
    title: 'Selected Work — Hospitality & Architectural Projects | Roycelysian',
    desc: 'Private estates, resorts and residences in Marrakech, Ibiza, Amman and Saudi Arabia, told through photography and brand identity by Roycelysian.' },
  'expertise.html': { slug: 'expertise', name: 'Expertise', img: 'zeryab-ceiling',
    title: 'Expertise — Photography, Branding & Editorial Publishing | Roycelysian',
    desc: 'Architectural and hospitality photography, brand identity and design, and bespoke editorial publishing, brought together by one creative direction.' },
  'publications.html': { slug: 'publications', name: 'Publications', img: 'riad-library',
    title: 'Luxury Coffee Table Books & Architectural Monographs | Roycelysian',
    desc: 'Bespoke coffee table books, architectural monographs, property books and brand books, from concept and photography to design and fine print production.' },
  'studio.html': { slug: 'studio', name: 'Studio', img: 'lazure-hall',
    title: 'Studio — A Creative Studio for Exceptional Places | Roycelysian',
    desc: 'Roycelysian is a boutique creative studio in Amman for photography, branding and editorial design, with work across Morocco, Spain, Saudi Arabia and Jordan.' },
  'contact.html': { slug: 'contact', name: 'Contact', img: 'zeryab-statue',
    title: 'Contact — Start a Project | Roycelysian',
    desc: 'Start a photography, branding or editorial publishing project with Roycelysian. Based in Amman, working across the Middle East and Europe.' },
  '404.html': { noindex: true, title: 'Page not found — Roycelysian', desc: 'This page could not be found.', img: 'zeryab-arches' },
  'project.html': { noindex: true, title: 'Project — Roycelysian', desc: 'A Roycelysian case study.', img: 'zeryab-pool' }
};

const trim = (s, n = 158) => { if (s.length <= n) return s; const cut = s.slice(0, n); return cut.slice(0, cut.lastIndexOf(' ')).replace(/[,.;:—-]+$/, '') + '…'; };
const crumbs = items => ({ '@type': 'BreadcrumbList', itemListElement: items.map((it, i) => ({ '@type': 'ListItem', position: i + 1, name: it[0], item: it[1] })) });
const studio = { '@type': 'ProfessionalService', '@id': STUDIO_ID, name: 'Roycelysian', url: `${DOMAIN}/`,
  logo: `${DOMAIN}/assets/brand/favicon.png`, image: ogImg('zeryab-pool'), slogan: 'Exceptional Places. Distinctive Stories.',
  description: PAGES['index.html'].desc,
  address: { '@type': 'PostalAddress', addressLocality: 'Amman', addressCountry: 'JO' },
  areaServed: ['Jordan', 'Saudi Arabia', 'Morocco', 'Spain', 'Middle East'],
  knowsAbout: ['Architectural photography', 'Hospitality photography', 'Interior photography', 'Brand identity', 'Art direction', 'Editorial design', 'Coffee table books', 'Architectural monographs'],
  ...(sameAs.length ? { sameAs } : {}) };

function head({ title, desc, img, canonical, type = 'website', noindex, ld }) {
  return `<!--seo-->
<title>${esc(title)}</title>
<meta name="description" content="${esc(desc)}">
${noindex ? '<meta name="robots" content="noindex, follow">' : `<link rel="canonical" href="${canonical}">`}
<meta name="theme-color" content="#17232D">
<meta property="og:site_name" content="Roycelysian">
<meta property="og:type" content="${type}">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(desc)}">
${canonical ? `<meta property="og:url" content="${canonical}">\n` : ''}<meta property="og:image" content="${ogImg(img)}">
<meta property="og:locale" content="en_GB">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${esc(title)}">
<meta name="twitter:description" content="${esc(desc)}">
<meta name="twitter:image" content="${ogImg(img)}">
<link rel="icon" type="image/png" href="assets/brand/favicon.png">
<link rel="apple-touch-icon" href="assets/brand/favicon.png">
${ld ? `<script type="application/ld+json">${JSON.stringify({ '@context': 'https://schema.org', '@graph': ld })}</script>\n` : ''}<!--/seo-->`;
}

function setHead(html, block) {
  html = html.replace(/<!--seo-->[\s\S]*?<!--\/seo-->\n?/, '')
    .replace(/<title>[\s\S]*?<\/title>\n?/, '')
    .replace(/<meta name="description"[^>]*>\n?/g, '')
    .replace(/<meta property="og:[^>]*>\n?/g, '')
    .replace(/<link rel="icon"[^>]*>\n?/g, '');
  return html.replace(/(<meta name="viewport"[^>]*>\n)/, `$1${block}\n`);
}

// fill a container: <tag ... id="X">…</tag> → content between <!--r:X--> markers
function region(html, id, content) {
  const marked = new RegExp(`<!--r:${id}-->[\\s\\S]*?<!--/r:${id}-->`);
  if (marked.test(html)) return html.replace(marked, `<!--r:${id}-->${content}<!--/r:${id}-->`);
  const empty = new RegExp(`(<[a-z]+[^>]*\\bid="${id}"[^>]*>)(</[a-z]+>)`);
  if (!empty.test(html)) throw new Error(`container #${id} not found or not empty`);
  return html.replace(empty, `$1<!--r:${id}-->${content}<!--/r:${id}-->$2`);
}

const common = html => html
  .replace(/(src|href)="assets\/img\/([a-z0-9-]+)\.jpg"/g, '$1="assets/img/$2.webp"')
  // full-size static images get a responsive srcset (skips -sm files and tags that already have one)
  .replace(/<img((?:(?!srcset)[^>])*?) src="assets\/img\/([a-z0-9-]+?)(?<!-sm)\.webp"((?:(?!srcset)[^>])*)>/g,
    (m, a, k, z) => `<img${a} ${R.IMGS(k)}${z}>`)
  .replace(/<img((?:(?!loading=)[^>])*?) src="assets\/brand\/monogram-(navy|ivory)\.png"((?:(?!loading=)[^>])*)>/g,
    (m, a, c, z) => m.includes('open-mono') ? m : `<img${a} src="assets/brand/monogram-${c}.png" loading="lazy"${z}>`)
  .replace(/<script src="js\/main\.js"><\/script>/, m => html.includes('js/render.js') ? m : `<script src="js/render.js"></script>\n${m}`);

// ---------- main pages ----------
for (const [file, p] of Object.entries(PAGES)) {
  let html = common(read(file));
  const canonical = p.noindex ? null : `${DOMAIN}/${p.slug}`;
  const ld = p.noindex ? null : file === 'index.html'
    ? [studio, { '@type': 'WebSite', '@id': `${DOMAIN}/#website`, name: 'Roycelysian', url: `${DOMAIN}/`, publisher: { '@id': STUDIO_ID } }]
    : [{ '@type': 'WebPage', name: p.title, url: canonical, description: p.desc, isPartOf: { '@id': `${DOMAIN}/#website` }, about: { '@id': STUDIO_ID } },
       crumbs([['Home', `${DOMAIN}/`], [p.name, canonical]])];
  html = setHead(html, head({ ...p, canonical, ld }));
  if (file === 'index.html') {
    html = region(html, 'heroSlides', R.heroSlides(D));
    html = region(html, 'heroDots', R.heroDots(D));
    html = region(html, 'heroCap', R.heroCap(D.hero[0]));
    html = region(html, 'rail', R.rail(D));
    html = region(html, 'expList', R.expList(D));
    html = html.replace(/<link rel="preload" as="image"[^>]*>/, `<link rel="preload" as="image" href="${R.IMG(D.hero[0].img)}" imagesrcset="${R.IMG(D.hero[0].img, 1)} 1100w, ${R.IMG(D.hero[0].img)} 2400w" imagesizes="100vw" fetchpriority="high">`);
  }
  if (file === 'work.html') html = region(html, 'workList', R.workList(D));
  write(file, html);
}

// ---------- one static page per project ----------
const tpl = read('project.html');
const urls = Object.values(PAGES).filter(p => !p.noindex).map(p => `${DOMAIN}/${p.slug}`);
for (const p of D.projects) {
  const city = p.place.split(',')[0];
  const kind = p.brand ? 'Photography & Brand Identity' : p.scope[0].replace(/ & Lifestyle| & Interior/, '');
  const canonical = `${DOMAIN}/${p.slug}`;
  const title = `${p.name}, ${city} — ${kind} | Roycelysian`;
  const desc = trim(p.intro);
  const ld = [
    { '@type': 'CreativeWork', '@id': `${canonical}#work`, name: p.name, headline: p.title, description: desc, url: canonical,
      image: [p.cover, ...p.gallery.map(g => g.img)].slice(0, 4).map(ogImg),
      creator: { '@id': STUDIO_ID }, contentLocation: { '@type': 'Place', name: p.place },
      genre: p.scope.join(', '), ...(p.client ? { sourceOrganization: { '@type': 'Organization', name: p.client } } : {}),
      ...(p.brand ? { contributor: { '@type': 'Organization', name: p.brand.partner, url: p.brand.link.replace(/\/work\/.*/, '') } } : {}) },
    crumbs([['Home', `${DOMAIN}/`], ['Work', `${DOMAIN}/work`], [p.name, canonical]])
  ];
  let html = common(tpl).replace('data-page="project"', `data-page="project" data-slug="${p.slug}"`);
  html = setHead(html, head({ title, desc, img: p.cover, canonical, type: 'article', ld }));
  html = region(html, 'pj', R.project(D, p));
  write(`${p.slug}.html`, html);
  urls.push(canonical);
}

// ---------- sitemap + robots ----------
const today = new Date().toISOString().slice(0, 10);
write('sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map(u => `  <url><loc>${u}</loc><lastmod>${today}</lastmod></url>`).join('\n')}\n</urlset>\n`);
write('robots.txt', `User-agent: *\nAllow: /\nDisallow: /project.html\n\nSitemap: ${DOMAIN}/sitemap.xml\n`);
console.log(`built ${Object.keys(PAGES).length} pages + ${D.projects.length} projects, ${urls.length} URLs in sitemap`);
