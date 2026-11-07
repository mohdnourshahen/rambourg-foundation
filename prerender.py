# SEO pre-rendering. Writes one real HTML page per pillar (/pillars/<slug>/) and per journal story
# (/journal/<slug>/) — each with its own <title>, description, canonical, social tags, structured data
# and readable text for search engines — then tunes the main pages' titles and schema, and writes
# sitemap.xml and robots.txt. The browser still builds the animated page from js/data.js.
# Run: python3 prerender.py   (build.py runs it first)
import json, os, re, html, subprocess, datetime

SITE = "https://rambourg-foundation.com"
ROOT = os.path.dirname(os.path.abspath(__file__))
TODAY = datetime.date.today().isoformat()
ORG_ID = SITE + "/#org"
e = lambda t: html.escape(t, quote=True)
strip = lambda t: re.sub(r"<[^>]+>", "", t)


def load_data():
    """Evaluate js/data.js + js/gallery.js with JavaScript for Automation and return window.RF."""
    js = f'''ObjC.import("Foundation");
      function read(p) {{ return $.NSString.stringWithContentsOfFileEncodingError(p, 4, null).js; }}
      var window = {{}};
      eval(read("{ROOT}/js/data.js")); eval(read("{ROOT}/js/gallery.js"));
      JSON.stringify(window.RF);'''
    out = subprocess.run(["osascript", "-l", "JavaScript", "-e", js], capture_output=True, text=True, check=True)
    return json.loads(out.stdout)


RF = load_data()
ABS = lambda p: p if p.startswith("http") else f"{SITE}/{p.lstrip('/')}"
MONTHS = {m: i for i, m in enumerate("Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec".split(), 1)}


def iso(date):  # "May 2026" -> "2026-05-01"
    m = re.match(r"([A-Z][a-z]{2}) (\d{4})", date)
    return f"{m.group(2)}-{MONTHS[m.group(1)]:02d}-01" if m else date


ORG = {
    "@type": "NGO", "@id": ORG_ID, "name": "Rambourg Foundation",
    "alternateName": ["Fondation Rambourg", "مؤسسة رامبورغ"],
    "url": SITE + "/", "logo": ABS("assets/logo/apple-touch-icon.png"), "image": ABS("assets/img/og-share.jpg"),
    "description": "UK registered charity, established in London in 2011, that creates and fosters paths to justice and fairness through culture, art, sport, education and human rights, working internationally.",
    "foundingDate": "2011-02", "foundingLocation": {"@type": "Place", "name": "London, United Kingdom"},
    "founder": {"@type": "Person", "name": "Guillaume Rambourg", "url": SITE + "/leadership.html"},
    "member": [{"@type": "OrganizationRole", "roleName": "President", "startDate": "2023", "member": {"@type": "Person", "name": "Sarah Rambourg", "url": SITE + "/leadership.html"}}],
    "address": {"@type": "PostalAddress", "addressLocality": "London", "addressCountry": "GB"},
    "email": "info@rambourg-foundation.com",
    "identifier": {"@type": "PropertyValue", "propertyID": "Charity Commission for England and Wales", "value": "1140347"},
    "areaServed": "Worldwide",
    "sameAs": ["https://www.instagram.com/rambourg.foundation/", "https://www.linkedin.com/company/rambourgfoundation"],
    "knowsAbout": ["Contemporary art", "Arab art", "Arts philanthropy", "Scholarships", "Film production", "Cultural heritage", "Human rights", "Craftsmanship"],
}


def crumbs(*items):
    return {"@type": "BreadcrumbList", "itemListElement": [
        {"@type": "ListItem", "position": i + 1, "name": n, "item": u} for i, (n, u) in enumerate(items)]}


def ld(*objs):
    return '<script type="application/ld+json" data-gen>' + json.dumps(
        {"@context": "https://schema.org", "@graph": list(objs)}, ensure_ascii=False) + "</script>"


def set_head(s, title, desc, url, image, og_type="website", schema=""):
    """Replace or insert title, description, canonical, Open Graph / Twitter tags and generated schema."""
    s = re.sub(r'\s*<script type="application/ld\+json" data-gen>.*?</script>', "", s, flags=re.S)
    s = re.sub(r"<title>.*?</title>", f"<title>{e(title)}</title>", s, count=1)
    tags = {
        r'<meta name="description" content="[^"]*">': f'<meta name="description" content="{e(desc)}">',
        r'<link rel="canonical" href="[^"]*">': f'<link rel="canonical" href="{url}">',
        r'<meta property="og:type" content="[^"]*">': f'<meta property="og:type" content="{og_type}">',
        r'<meta property="og:title" content="[^"]*">': f'<meta property="og:title" content="{e(title)}">',
        r'<meta property="og:description" content="[^"]*">': f'<meta property="og:description" content="{e(desc)}">',
        r'<meta property="og:url" content="[^"]*">': f'<meta property="og:url" content="{url}">',
        r'<meta property="og:image" content="[^"]*">': f'<meta property="og:image" content="{image}">',
    }
    for pat, rep in tags.items():
        if re.search(pat, s):
            s = re.sub(pat, rep.replace("\\", "\\\\"), s, count=1)
        else:  # missing on the template: add it after the viewport tag
            s = s.replace('<meta name="viewport" content="width=device-width, initial-scale=1">',
                          '<meta name="viewport" content="width=device-width, initial-scale=1">\n  ' + rep, 1)
    if 'name="twitter:image"' not in s:
        s = s.replace('<meta name="twitter:card" content="summary_large_image">',
                      f'<meta name="twitter:card" content="summary_large_image">\n  <meta name="twitter:image" content="{image}">', 1)
    else:
        s = re.sub(r'<meta name="twitter:image" content="[^"]*">', f'<meta name="twitter:image" content="{image}">', s, count=1)
    return s.replace("</head>", f"  {schema}\n</head>", 1) if schema else s


# ---------- 1. pillar pages: /pillars/<slug>/ ----------
PILLAR_TITLE = {  # keep "<title>" under ~65 characters so Google shows it in full
    "arts": "Arts, Exhibitions & Artists",
    "cultural-activities": "Culture & the Jbel Semmama Centre",
    "festivals": "Festivals & Film",
    "education": "Education & Learning",
    "scholarships": "Scholarships for Talented Students",
    "human-rights": "Human Rights & Free Expression",
    "entrepreneurship": "Entrepreneurship & the CORE Hub",
    "craftsmanship": "Craftsmanship & Artisans",
    "sport": "Sport & Young Athletes",
}
tpl = open(os.path.join(ROOT, "pillar.html")).read()
pages = []  # (url, lastmod, [images])
for p in RF["pillars"]:
    url = f"{SITE}/pillars/{p['slug']}/"
    title = f"{PILLAR_TITLE.get(p['slug'], p['name'])} — Rambourg Foundation"
    desc = strip(p["desc"] + " " + p["intro"])[:157].rsplit(" ", 1)[0] + "…"
    schema = ld({"@type": "WebPage", "@id": url, "url": url, "name": title, "description": desc,
                 "isPartOf": {"@id": SITE + "/#website"}, "about": {"@id": ORG_ID}, "primaryImageOfPage": ABS(p["img"])},
                crumbs(("Home", SITE + "/"), ("Pillars", SITE + "/#pillars"), (p["name"], url)))
    s = set_head(tpl, title, desc, url, ABS(p["img"]), schema=schema)
    s = s.replace('<meta charset="utf-8">', '<meta charset="utf-8">\n  <base href="/">', 1)
    s = s.replace('<body data-page="pillar">', f'<body data-page="pillar" data-slug="{p["slug"]}">', 1)
    text = "".join(f"<h3>{t}</h3><p>{d}</p>" for t, d, *_ in p["items"])
    s = s.replace('<main id="pillar"></main>', f'<main id="pillar"><article class="seo-text"><h1>{e(p["name"])}</h1>'
                  f'<p>{p["desc"]}</p><p>{p["intro"]}</p><h2>Selected projects</h2>{text}</article></main>', 1)
    os.makedirs(os.path.join(ROOT, "pillars", p["slug"]), exist_ok=True)
    open(os.path.join(ROOT, "pillars", p["slug"], "index.html"), "w").write(s)
    pages.append((url, TODAY, [ABS(p["img"])] + [ABS(i[2]) for i in p["items"] if len(i) > 2 and i[2]]))

# ---------- 2. journal stories: /journal/<slug>/ ----------
tpl = open(os.path.join(ROOT, "article.html")).read()
for n in RF["news"]:
    url = f"{SITE}/journal/{n['slug']}/"
    title = n["title"] if len(n["title"]) > 42 else f"{n['title']} — Rambourg Foundation"
    desc = n["excerpt"] if len(n["excerpt"]) >= 110 else (n["excerpt"] + " " + strip(n["body"][0]))[:156].rsplit(" ", 1)[0] + "…"
    imgs = [ABS(n["img"])] + [ABS(x[0]) for x in n.get("photos", [])]
    art = {"@type": "NewsArticle", "@id": url + "#article", "headline": n["title"][:110], "description": n["excerpt"],
           "image": imgs, "datePublished": iso(n["date"]), "dateModified": iso(n["date"]),
           "author": {"@id": ORG_ID}, "publisher": {"@id": ORG_ID}, "mainEntityOfPage": url,
           "articleSection": n["cat"], "inLanguage": "en"}
    schema = ld(art, ORG, crumbs(("Home", SITE + "/"), ("Journal", SITE + "/news.html"), (n["title"], url)))
    s = set_head(tpl, title, desc, url, ABS(n["img"]), og_type="article", schema=schema)
    s = s.replace('<meta charset="utf-8">', '<meta charset="utf-8">\n  <base href="/">', 1)
    s = s.replace('<body data-page="article">', f'<body data-page="article" data-slug="{n["slug"]}">', 1)
    body = "".join(f"<p>{x}</p>" for x in n["body"])
    quote = f'<blockquote><p>{e(n["quote"][0])}</p><cite>{e(n["quote"][1])}</cite></blockquote>' if n.get("quote") else ""
    s = s.replace('<main id="article"></main>', f'<main id="article"><article class="seo-text"><h1>{e(n["title"])}</h1>'
                  f'<p>{e(n["excerpt"])}</p><p>{e(n["cat"])} · {e(n["date"])}</p>'
                  f'<img src="{n["img"]}" alt="{e(n.get("imgCap", n["title"]))}">{body}{quote}</article></main>', 1)
    os.makedirs(os.path.join(ROOT, "journal", n["slug"]), exist_ok=True)
    open(os.path.join(ROOT, "journal", n["slug"], "index.html"), "w").write(s)
    pages.append((url, iso(n["date"]) if iso(n["date"]) > "2026-11-01" else TODAY, imgs))

# ---------- 3. main pages: keyword titles, descriptions and schema ----------
WEBSITE = {"@type": "WebSite", "@id": SITE + "/#website", "url": SITE + "/", "name": "Rambourg Foundation",
           "alternateName": "Fondation Rambourg", "publisher": {"@id": ORG_ID}, "inLanguage": "en"}
f0 = RF["films"]
MAIN = {
    "index.html": ("Rambourg Foundation — Arts, Culture & Education Charity Since 2011",
                   "The Rambourg Foundation (Fondation Rambourg) is a UK charity, established in London in 2011, backing artists, culture, education and human rights worldwide.",
                   SITE + "/", "assets/img/og-share.jpg", [ORG, WEBSITE]),
    "about.html": ("About the Rambourg Foundation — Our Story Since 2011",
                   "Established in London in 2011 by Guillaume Rambourg and presided over by Sarah Rambourg, the Rambourg Foundation backs artists, students and citizens.",
                   SITE + "/about.html", "assets/img/og-share.jpg",
                   [ORG, {"@type": "AboutPage", "url": SITE + "/about.html", "about": {"@id": ORG_ID}},
                    crumbs(("Home", SITE + "/"), ("About", SITE + "/about.html"))]),
    "leadership.html": ("Our Founder & Our President — Rambourg Foundation",
                        "Guillaume Rambourg founded the Rambourg Foundation in London in 2011; Sarah Rambourg presides over it. Together they lead its international work.",
                        SITE + "/leadership.html", "assets/img/events/oscars-2026.jpg",
                        [{"@type": "Person", "name": "Guillaume Rambourg", "url": SITE + "/leadership.html", "image": ABS("assets/img/guillaume/ph4.jpg"),
                          "jobTitle": "Founder", "founder": {"@id": ORG_ID}, "sameAs": ["https://en.wikipedia.org/wiki/Guillaume_Rambourg"]},
                         {"@type": "Person", "name": "Sarah Rambourg", "url": SITE + "/leadership.html", "jobTitle": "President",
                          "worksFor": {"@id": ORG_ID}, "sameAs": ["https://www.instagram.com/sarah_rambourg/"]},
                         crumbs(("Home", SITE + "/"), ("Founder & President", SITE + "/leadership.html"))]),
    "eveil.html": ("L'Éveil d'une Nation (عهد الأمان) — Ksar Saïd, Tunis",
                   "Ahd al-Aman / L'Éveil d'une Nation: 300 restored works on the dawn of modern Tunisia (1837–1881), at the Palais Ksar Saïd, Tunis, from 27 November 2016.",
                   SITE + "/eveil.html", "assets/img/posters/eveil.jpg",
                   [{"@type": "ExhibitionEvent", "name": "L'Éveil d'une Nation", "alternateName": ["عهد الأمان", "Ahd al-Aman"],
                     "description": "Art at the dawn of modern Tunisia (1837–1881). 300 works restored and shown to the public at the Palais Ksar Saïd.",
                     "startDate": "2016-11-27", "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode",
                     "eventStatus": "https://schema.org/EventScheduled", "image": [ABS("assets/img/posters/eveil.jpg"), ABS("assets/img/eveil/old-salon2.jpg"), ABS("assets/img/eveil/ahmad-bey-gleyre.jpg")],
                     "location": {"@type": "Place", "name": "Palais Ksar Saïd", "address": {"@type": "PostalAddress", "addressLocality": "Le Bardo, Tunis", "addressCountry": "TN"}},
                     "organizer": {"@id": ORG_ID}, "url": SITE + "/eveil.html"},
                    ORG, crumbs(("Home", SITE + "/"), ("L'Éveil d'une Nation", SITE + "/eveil.html"))]),
    "films.html": ("Films: The Voice of Hind Rajab & More — Rambourg Foundation",
                   "Films produced and supported by the Rambourg Foundation: The Voice of Hind Rajab (Silver Lion, Oscar nominee), The Man Who Sold His Skin, Papa Hedi and more.",
                   SITE + "/films.html", "assets/img/04b_Silver_Lion_Photo.jpg",
                   [{"@type": "ItemList", "itemListElement": [
                       {"@type": "ListItem", "position": i + 1, "item": {k: v for k, v in {
                           "@type": "Movie", "name": f["title"], "dateCreated": f["year"] or None,
                           "director": {"@type": "Person", "name": f["by"]} if f["by"] else None,
                           "image": ABS(f["poster"]) if f["poster"] else None, "description": f["text"],
                           "award": f["honours"] or None, "url": f"{SITE}/films.html#{f['slug']}"}.items() if v}}
                       for i, f in enumerate(f0)]},
                    crumbs(("Home", SITE + "/"), ("Films", SITE + "/films.html"))]),
    "news.html": ("Journal: News & Stories — Rambourg Foundation",
                  "News and stories from the Rambourg Foundation: residencies, films, exhibitions and scholarships, plus press coverage of our work since 2011.",
                  SITE + "/news.html", "assets/img/events/oscars-2026.jpg",
                  [{"@type": "Blog", "name": "Rambourg Foundation Journal", "url": SITE + "/news.html", "publisher": {"@id": ORG_ID},
                    "blogPost": [{"@type": "BlogPosting", "headline": n["title"][:110], "url": f"{SITE}/journal/{n['slug']}/", "datePublished": iso(n["date"])} for n in RF["news"]]},
                   crumbs(("Home", SITE + "/"), ("Journal", SITE + "/news.html"))]),
    "gallery.html": ("Gallery: Our Projects in Photos — Rambourg Foundation",
                     "Photographs from Rambourg Foundation projects and events: Jbel Semmama, Ksar Saïd, scholarships, tennis courts, festivals and London exhibitions.",
                     SITE + "/gallery.html", "assets/img/p_cultural.jpg",
                     [crumbs(("Home", SITE + "/"), ("Gallery", SITE + "/gallery.html"))]),
    "contact.html": ("Contact the Rambourg Foundation",
                     "Get in touch with the Rambourg Foundation about partnerships, programmes, open calls, scholarships or press. info@rambourg-foundation.com",
                     SITE + "/contact.html", "assets/img/og-share.jpg",
                     [{"@type": "ContactPage", "url": SITE + "/contact.html", "about": {"@id": ORG_ID}},
                      {**ORG, "contactPoint": {"@type": "ContactPoint", "email": "info@rambourg-foundation.com", "contactType": "general enquiries", "availableLanguage": ["English", "French", "Arabic"]}},
                      crumbs(("Home", SITE + "/"), ("Contact", SITE + "/contact.html"))]),
}
for f, (title, desc, url, img, objs) in MAIN.items():
    p = os.path.join(ROOT, f)
    s = set_head(open(p).read(), title, desc, url, ABS(img), schema=ld(*objs))
    open(p, "w").write(s)
    pages.insert(0, (url, TODAY, [ABS(img)]))

# ---------- 4. sitemap.xml (with images) and robots.txt ----------
pages.sort(key=lambda x: (0 if x[0] == SITE + "/" else 1, x[0]))
rows = []
for url, mod, imgs in pages:
    pri = "1.0" if url == SITE + "/" else "0.9" if "/pillars/" in url or url.endswith(("films.html", "eveil.html", "about.html")) else "0.8"
    im = "".join(f"<image:image><image:loc>{e(i)}</image:loc></image:image>" for i in dict.fromkeys(imgs) if not i.endswith(".svg"))
    rows.append(f"  <url><loc>{e(url)}</loc><lastmod>{mod}</lastmod><priority>{pri}</priority>{im}</url>")
open(os.path.join(ROOT, "sitemap.xml"), "w").write(
    '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" '
    'xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n' + "\n".join(rows) + "\n</urlset>\n")
open(os.path.join(ROOT, "robots.txt"), "w").write(
    f"User-agent: *\nAllow: /\nDisallow: /pillar.html\nDisallow: /article.html\n\nSitemap: {SITE}/sitemap.xml\n")
print(f"prerendered {len(RF['pillars'])} pillars + {len(RF['news'])} stories; sitemap: {len(pages)} urls")
