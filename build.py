# Builds the publish-ready site into dist/ and dist.zip: only pages, css, js and the assets they use.
# Run: python3 build.py
import os, glob, shutil, zipfile, subprocess
os.chdir(os.path.dirname(os.path.abspath(__file__)))
subprocess.run(["python3", "prerender.py"], check=True)  # SEO pages, titles, schema, sitemap
src = "".join(open(f).read() for f in glob.glob("*.html") + glob.glob("js/*.js") + ["css/style.css", "sitemap.xml"])
assets = [f for f in glob.glob("assets/**/*.*", recursive=True) if not os.path.basename(f).startswith("._")]
# fonts are referenced from css
used = [f for f in assets if os.path.basename(f) in src or "/fonts/" in f]
shutil.rmtree("dist", ignore_errors=True)
os.makedirs("dist")
for f in glob.glob("*.html") + ["robots.txt", "sitemap.xml", "_redirects"]:
    shutil.copy2(f, "dist")
for d in ("css", "js", "pillars", "journal"):
    shutil.copytree(d, f"dist/{d}", ignore=shutil.ignore_patterns("._*", ".DS_Store"))
for f in used:
    os.makedirs(os.path.dirname(f"dist/{f}"), exist_ok=True)
    shutil.copy2(f, f"dist/{f}")
with zipfile.ZipFile("rambourg-foundation-site.zip", "w", zipfile.ZIP_DEFLATED) as z:
    for root, _, files in os.walk("dist"):
        for x in files:
            if not x.startswith("._") and x != ".DS_Store":
                z.write(os.path.join(root, x), os.path.relpath(os.path.join(root, x), "dist"))
size = sum(os.path.getsize(os.path.join(r, x)) for r, _, fs in os.walk("dist") for x in fs)
print(f"dist: {sum(len(fs) for _, _, fs in os.walk('dist'))} files, {size / 1e6:.1f} MB; skipped {len(assets) - len(used)} unused assets")
print(f"zip: {os.path.getsize('rambourg-foundation-site.zip') / 1e6:.1f} MB")
