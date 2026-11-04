/* Rambourg Foundation — shared layout + motion (GSAP + ScrollTrigger + Lenis) */
(() => {
  const page = document.body.dataset.page;
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  document.documentElement.classList.add("js");

  /* ---------- shared layout ---------- */
  const nav = [["about.html", "About"], ["index.html#pillars", "Pillars"], ["people.html", "People"], ["films.html", "Films"], ["news.html", "Journal"], ["contact.html", "Contact"]];
  const header = document.createElement("header");
  header.className = "header";
  header.innerHTML = `
    <a class="header__logo" href="index.html" aria-label="Rambourg Foundation home">
      <img class="logo-c" src="assets/logo/RF_MasterLogo_C.svg" alt="">
      <img class="logo-w" src="assets/logo/RF_MasterLogo_W.svg" alt="">
    </a>
    <div class="header__right">
      <nav class="header__nav" aria-label="Main">${nav.map(([h, t]) => {
        const here = page === t.toLowerCase() || (page === "pillar" && t === "Pillars") || ((page === "article" || page === "news") && t === "Journal");
        return `<a href="${h}" aria-label="${t}"${here ? ' aria-current="page"' : ""}><span class="roll" aria-hidden="true"><span data-t="${t}">${t}</span></span></a>`;
      }).join("")}</nav>
      <div class="header__actions">
        <a class="btn btn--solid" href="contact.html">Get involved</a>
        <button class="menu-btn" aria-expanded="false" aria-controls="menu">Menu</button>
      </div>
    </div>`;
  document.body.prepend(header);

  const menu = document.createElement("div");
  menu.className = "menu"; menu.id = "menu";
  menu.innerHTML = `
    <button class="menu-btn menu__close" style="display:inline-flex;align-items:center">Close</button>
    <nav class="menu__links">${[...nav, ["eveil.html", "L'Éveil d'une Nation"], ["gallery.html", "Gallery"]].map(([h, t]) => `<a href="${h}"${location.pathname.endsWith(h) ? ' aria-current="page"' : ""}>${t}</a>`).join("")}</nav>
    <a class="btn btn--solid menu__cta" href="contact.html">Get involved</a>
    <div class="menu__foot"><span>UK registered charity no. 1140347</span><span><a href="https://www.instagram.com/rambourg.foundation/" target="_blank" rel="noopener">Instagram</a> · <a href="https://www.linkedin.com/company/rambourgfoundation" target="_blank" rel="noopener">LinkedIn</a></span></div>`;
  document.body.append(menu);
  const menuBtn = header.querySelector(".menu-btn");
  const toggleMenu = (open) => { menu.classList.toggle("is-open", open); menuBtn.setAttribute("aria-expanded", open); };
  menuBtn.addEventListener("click", () => toggleMenu(true));
  menu.querySelector(".menu__close").addEventListener("click", () => toggleMenu(false));
  menu.querySelectorAll("a").forEach(a => a.addEventListener("click", () => toggleMenu(false)));

  const footer = document.querySelector("footer.footer");
  if (footer) footer.innerHTML = `
    <div class="footer__hero" id="contact">
      <img src="${footer.dataset.img || "assets/img/06_Event_Reception_Library.jpg"}" alt="" data-parallax>
      <div class="footer__cta">
        <p>Partner with us, support a programme, or tell us about your work.</p>
        <a class="btn btn--line btn--inv" style="color:#fff" href="mailto:info@rambourg-foundation.com">info@rambourg-foundation.com</a>
      </div>
      <div class="footer__big"><a href="contact.html">Get <em>involved</em></a></div>
    </div>
    <div class="footer__main">
      <div><img class="footer__logo" src="assets/logo/RF_MasterLogo_W.svg" alt="Rambourg Foundation"></div>
      <div><h4>Foundation</h4><ul><li><a href="about.html">About</a></li><li><a href="leadership.html">Founder &amp; President</a></li><li><a href="index.html#initiatives">Initiatives</a></li><li><a href="people.html">Our people</a></li><li><a href="films.html">Films</a></li><li><a href="eveil.html">L'Éveil d'une Nation</a></li><li><a href="gallery.html">Gallery</a></li><li><a href="news.html">Journal</a></li><li><a href="contact.html">Contact</a></li></ul></div>
      <div><h4>Pillars</h4><ul>${RF.pillars.slice(0, 5).map(p => `<li><a href="pillars/${p.slug}/">${p.name}</a></li>`).join("")}</ul></div>
      <div><h4>&nbsp;</h4><ul>${RF.pillars.slice(5).map(p => `<li><a href="pillars/${p.slug}/">${p.name}</a></li>`).join("")}</ul></div>
      <div class="footer__legal"><span>Copyright - 2025 - Rambourg Foundation - All rights reserved. Developed &amp; designed by <a href="https://lonvisuals.com/" target="_blank" rel="noopener">lon visuals</a>.<br>UK registered charity no. 1140347</span><span><a href="https://www.instagram.com/rambourg.foundation/" target="_blank" rel="noopener">Instagram</a> · <a href="https://www.linkedin.com/company/rambourgfoundation" target="_blank" rel="noopener">LinkedIn</a></span></div>
    </div>`;

  /* ---------- helpers ---------- */
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];

  // wrap each word in .w, keeping inline elements (em, .chip) intact
  function splitWords(el, mask) {
    const walk = (node) => {
      [...node.childNodes].forEach(n => {
        if (n.nodeType === 3) {
          const frag = document.createDocumentFragment();
          n.textContent.split(/(\s+)/).forEach(part => {
            if (!part) return;
            if (/^\s+$/.test(part)) { frag.append(" "); return; }
            const w = document.createElement("span"); w.className = "w";
            if (mask) { const i = document.createElement("span"); i.textContent = part; w.append(i); } else w.textContent = part;
            frag.append(w);
          });
          n.replaceWith(frag);
        } else if (n.nodeType === 1 && n.classList.contains("chip")) {
          const w = document.createElement("span"); w.className = "w";
          n.replaceWith(w);
          if (mask) { const i = document.createElement("span"); i.append(n); w.append(i); } else w.append(n);
        } else if (n.nodeType === 1) walk(n);
      });
    };
    walk(el);
    el.classList.add("split"); if (mask) el.classList.add("split-mask");
    return $$(mask ? ".w > span" : ".w", el);
  }

  /* ---------- behaviour: works with or without motion ---------- */
  const motion = !!window.gsap && !reduce;
  const fx = fn => { if (motion) fn(); };          // run an animation only when motion is on
  const refresh = () => fx(() => ScrollTrigger.refresh());
  let lenis = null;

  // header: soft background once the page has scrolled, so it never sits on top of text
  const onScroll = () => header.classList.toggle("is-scrolled", scrollY > 60);
  addEventListener("scroll", onScroll, { passive: true }); onScroll();

  // accordions
  $$("button.acc__btn").forEach(b => b.addEventListener("click", () => {
    const acc = b.closest(".acc"), open = !acc.classList.contains("is-open");
    $$(".acc", acc.parentElement).forEach(a => { a.classList.remove("is-open"); $(".acc__btn", a).setAttribute("aria-expanded", "false"); });
    acc.classList.toggle("is-open", open); b.setAttribute("aria-expanded", open);
    // pillar pages: the side image follows the open project
    const view = acc.closest(".expect")?.querySelector(".pview");
    if (view && open) [...view.children].forEach((m, k) => m.classList.toggle("is-on", k === +acc.dataset.k));
    setTimeout(refresh, 650);
  }));

  // filter chips (news press list, gallery): hide non-matching items, matching ones rise back in
  function filters(btnSel, itemSel, key) {
    const btns = $$(btnSel), items = $$(itemSel);
    btns.forEach(b => b.addEventListener("click", () => {
      btns.forEach(x => x.setAttribute("aria-pressed", x === b));
      items.forEach(it => it.hidden = b.dataset.f !== "All" && it.dataset[key] !== b.dataset.f);
      fx(() => gsap.fromTo(items.filter(it => !it.hidden), { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: .7, ease: "expo.out", stagger: .04, overwrite: true }));
      refresh();
    }));
  }
  filters("#pfilters button", ".prow", "pillar");
  filters("#gfilters button", ".gitem", "tag");
  filters("#nfilters button", ".ncard", "cat");

  // gallery lightbox: steps through the photos currently shown
  const lb = $("#lightbox");
  if (lb) {
    const img = $("img", lb), cap = $(".lightbox__cap", lb), items = $$(".gitem");
    let list = [], k = 0, last;
    const show = n => {
      k = (n + list.length) % list.length;
      img.src = $("img", list[k]).src;
      cap.textContent = `${list[k].dataset.tag} · ${k + 1} / ${list.length}`;
      fx(() => gsap.fromTo(img, { opacity: 0, scale: .97 }, { opacity: 1, scale: 1, duration: .5, ease: "expo.out" }));
    };
    const open = it => { last = it; list = items.filter(x => !x.hidden); lb.classList.add("is-open"); lenis?.stop(); show(list.indexOf(it)); $(".lightbox__close", lb).focus(); };
    const close = () => { lb.classList.remove("is-open"); lenis?.start(); last?.focus(); };
    items.forEach(it => it.addEventListener("click", () => open(it)));
    $(".lightbox__close", lb).addEventListener("click", close);
    $(".lightbox__prev", lb).addEventListener("click", () => show(k - 1));
    $(".lightbox__next", lb).addEventListener("click", () => show(k + 1));
    lb.addEventListener("click", e => { if (e.target === lb) close(); });
    addEventListener("keydown", e => {
      if (!lb.classList.contains("is-open")) return;
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") show(k + 1);
      if (e.key === "ArrowLeft") show(k - 1);
    });
  }

  // inline films: play muted while on screen (only when motion is allowed), sound on request
  $$(".vplayer").forEach(pl => {
    const v = $("video", pl), btn = $(".vplayer__sound", pl);
    if (reduce) { v.controls = true; btn.remove(); return; }
    new IntersectionObserver(([e]) => { if (e.isIntersecting) v.play().catch(() => {}); else v.pause(); }, { threshold: .35 }).observe(v);
    btn.addEventListener("click", () => {
      v.muted = !v.muted;
      btn.setAttribute("aria-pressed", !v.muted);
      btn.textContent = v.muted ? "Sound on" : "Sound off";
      if (v.paused) v.play().catch(() => {});
    });
  });

  // YouTube: show the cover image, load the (privacy-enhanced) player only on click
  $$(".yt").forEach(yt => $(".yt__play", yt).addEventListener("click", () => {
    const f = document.createElement("iframe");
    f.src = `https://www.youtube-nocookie.com/embed/${yt.dataset.id}?autoplay=1&rel=0&start=${yt.dataset.start || 0}`;
    f.title = $(".yt__play", yt).getAttribute("aria-label").replace(/^Play: /, "");
    f.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
    f.referrerPolicy = "strict-origin-when-cross-origin";
    f.allowFullscreen = true;
    yt.replaceChildren(f);
  }));

  // big image frames: if the photo is too small for the frame (or is a poster), don't stretch it —
  // show it at its own size, centred over a soft blurred copy of itself
  $$(".hero__frame > img").forEach(img => {
    const fit = () => {
      const fr = img.parentElement, w = fr.clientWidth || innerWidth;
      if (!img.naturalWidth) return;
      const small = img.naturalWidth < w * .85 || img.naturalWidth / img.naturalHeight < 1.05;
      if (!small || fr.classList.contains("is-fit")) return;
      const bg = img.cloneNode(); bg.className = "hero__blur"; bg.alt = ""; bg.setAttribute("aria-hidden", "true");
      fr.prepend(bg); fr.classList.add("is-fit");
    };
    img.complete ? fit() : img.addEventListener("load", fit, { once: true });
  });

  // contact form, no backend yet: hand the message to the visitor's email app
  const form = $("#cform");
  form?.addEventListener("submit", e => {
    e.preventDefault();
    if (!form.reportValidity()) return;
    const d = new FormData(form);
    const topics = d.getAll("topic").join(", ");
    const body = `${d.get("message")}\n\n— ${d.get("name")}${d.get("org") ? ", " + d.get("org") : ""}\n${d.get("email")}`;
    location.href = `mailto:info@rambourg-foundation.com?subject=${encodeURIComponent("Website enquiry" + (topics ? ": " + topics : ""))}&body=${encodeURIComponent(body)}`;
    form.classList.add("is-sent");
    fx(() => gsap.from(".cform__thanks", { opacity: 0, y: 30, duration: 1, ease: "expo.out" }));
  });

  if (!window.gsap || reduce) { document.documentElement.classList.remove("js"); $(".loader")?.remove(); return; }
  gsap.registerPlugin(ScrollTrigger);

  /* ---------- smooth scroll ---------- */
  lenis = new Lenis({ lerp: 0.1 });
  lenis.on("scroll", ScrollTrigger.update);
  gsap.ticker.add(t => lenis.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);
  $$('a[href^="#"]').forEach(a => a.addEventListener("click", e => {
    const t = $(a.getAttribute("href")); if (t) { e.preventDefault(); lenis.scrollTo(t); }
  }));

  /* ---------- header: hide on scroll down, switch colour on dark sections ---------- */
  let lastY = 0;
  lenis.on("scroll", ({ scroll }) => {
    header.classList.toggle("is-hidden", scroll > lastY && scroll > 300 && !menu.classList.contains("is-open"));
    lastY = scroll;
  });
  $$("[data-theme='dark']").forEach(sec => ScrollTrigger.create({
    trigger: sec, start: "top 42px", end: "bottom 42px", refreshPriority: -1,
    onToggle: s => header.classList.toggle("on-dark", s.isActive)
  }));

  /* ---------- preloader (counter + logo wipe to the R square) ---------- */
  function intro(done) {
    const loader = $(".loader");
    if (!loader || sessionStorageGet("rf-seen")) { loader?.remove(); return done(); }
    sessionStorageSet("rf-seen", "1");
    lenis.stop();
    const count = $(".loader__count", loader), n = { v: 0 };
    gsap.timeline({ onComplete: () => { loader.remove(); lenis.start(); } })
      .from(".loader__logo", { opacity: 0, y: 20, duration: .8, ease: "power3.out" })
      .to(n, { v: 100, duration: 1.8, ease: "power2.inOut", onUpdate: () => count.textContent = Math.round(n.v) }, 0)
      .to(".loader__bar", { scaleX: 1, duration: 1.8, ease: "power2.inOut" }, 0)
      // wipe the wordmark away, leaving the R square (x 77–224 of 1920), and slide it to centre
      .to(".loader__logo", { clipPath: "inset(0 87.9% 0 0)", xPercent: 42.2, duration: 1, ease: "expo.inOut" }, 1.9)
      .to(".loader__count", { opacity: 0, duration: .4 }, 1.9)
      .add(done, 2.5)
      .to(loader, { clipPath: "inset(0 0 100% 0)", duration: 1.1, ease: "expo.inOut" }, 2.6);
  }
  function sessionStorageGet(k) { try { return sessionStorage.getItem(k); } catch { return null; } }
  function sessionStorageSet(k, v) { try { sessionStorage.setItem(k, v); } catch {} }

  /* ---------- generic reveals ---------- */
  $$("[data-reveal]").forEach(el => gsap.to(el, {
    opacity: 1, y: 0, duration: 1.1, ease: "expo.out",
    scrollTrigger: { trigger: el, start: "top 88%" }
  }));

  // headings that rise word by word
  $$("[data-split]").forEach(el => {
    const words = splitWords(el, true);
    gsap.from(words, { yPercent: 110, duration: 1.1, ease: "expo.out", stagger: .04, scrollTrigger: { trigger: el, start: "top 85%" } });
  });

  // paragraphs whose words light up as you scroll (GPG)
  $$("[data-scrub]").forEach(el => {
    const words = splitWords(el, false);
    gsap.to(words, { opacity: 1, stagger: .1, ease: "none", scrollTrigger: { trigger: el, start: "top 80%", end: "bottom 45%", scrub: true } });
  });

  // parallax images
  $$("[data-parallax]").forEach(img => gsap.fromTo(img, { yPercent: -8 }, {
    yPercent: 8, ease: "none", scrollTrigger: { trigger: img.parentElement, start: "top bottom", end: "bottom top", scrub: true }
  }));

  // count-up figures
  $$("[data-count]").forEach(el => {
    const end = +el.dataset.count, o = { v: +el.dataset.from || 0 };
    gsap.to(o, { v: end, duration: 2, ease: "power3.out", scrollTrigger: { trigger: el, start: "top 85%" },
      onUpdate: () => el.textContent = end >= 10000 ? Math.round(o.v).toLocaleString("en-GB") : Math.round(o.v) });
  });

  // horizontal pinned tracks
  $$(".hscroll").forEach(sec => {
    const track = $(".hscroll__track", sec), bar = $(".hscroll__progress i", sec);
    const dist = () => track.scrollWidth - innerWidth + parseFloat(getComputedStyle(track).paddingLeft);
    const tl = gsap.timeline({ scrollTrigger: { trigger: sec, pin: $(".hscroll__pin", sec), start: "top top", end: () => "+=" + dist(), scrub: 1, invalidateOnRefresh: true } });
    tl.to(track, { x: () => -dist(), ease: "none" });
    if (bar) tl.to(bar, { scaleX: 1, ease: "none" }, 0);
  });


  /* ---------- page-specific ---------- */
  const pages = {
    home() {
      // hero title + intro
      const words = splitWords($(".hero__title"), true);
      gsap.set(words, { yPercent: 110 });
      gsap.set(".hero__row > *", { opacity: 0, y: 24 });
      intro(() => {
        gsap.to(words, { yPercent: 0, duration: 1.3, ease: "expo.out", stagger: .045 });
        gsap.to(".hero__row > *", { opacity: 1, y: 0, duration: 1, ease: "expo.out", stagger: .1, delay: .6 });
      });
      // framed image opens to full bleed (GPG hero video)
      gsap.timeline({ scrollTrigger: { trigger: ".hero__media", start: "top 75%", end: "bottom bottom", scrub: true } })
        .to(".hero__frame", { clipPath: "inset(0% 0% 0% 0% round 0px)", ease: "none" })
        .to(".hero__frame img", { scale: 1, ease: "none" }, 0)
        .to(".hero__caption", { opacity: 1, ease: "none" }, .7);

      // orbits line draws in
      gsap.from(".orbits__line", { scaleX: 0, duration: 1.6, ease: "expo.inOut", scrollTrigger: { trigger: ".orbits", start: "top 75%" } });
      gsap.from(".orbit", { opacity: 0, y: 50, duration: 1.2, ease: "expo.out", stagger: .15, scrollTrigger: { trigger: ".orbits", start: "top 75%" } });

      // pillars: the colour panel wipes up to the next pillar as you scroll; names track it
      const slides = $$(".pslide"), names = $$(".plink-h");
      const setActive = i => names.forEach((n, k) => n.classList.toggle("is-active", k === i));
      ScrollTrigger.matchMedia({
        "(min-width: 1025px)": () => {
          const tl = gsap.timeline({ defaults: { ease: "none" }, scrollTrigger: {
            trigger: ".pillars", pin: ".pillars__pin", refreshPriority: 2, start: "top top", end: () => "+=" + innerHeight * .55 * (slides.length - 1), scrub: .6,
            onUpdate: s => setActive(Math.round(s.progress * (slides.length - 1))) } });
          slides.forEach((sl, i) => {
            if (!i) return;
            tl.to(sl, { clipPath: "inset(0% 0 0 0)", duration: 1 }, i - 1)
              .from($("img", sl), { scale: 1.25, duration: 1 }, i - 1);
          });
          tl.to(".pillars__bar i", { scaleX: 1, duration: slides.length - 1 }, 0);
          // clicking a name brings its pillar into the panel; clicking the active name opens its page
          names.forEach((n, i) => n.addEventListener("click", e => {
            if (n.classList.contains("is-active")) return;
            e.preventDefault();
            const st = tl.scrollTrigger;
            lenis.scrollTo(st.start + (st.end - st.start) * i / (slides.length - 1), { duration: 1.2 });
          }));
        }
      });

      // circle grows to full bleed (GPG "make your sales grow")
      const grow = $(".grow");
      gsap.timeline({ scrollTrigger: { trigger: grow, start: "top top", end: "bottom bottom", scrub: true,
        onUpdate: s => grow.classList.toggle("is-full", s.progress > .55) } })
        .to(".grow__circle", { width: "100vw", height: "100svh", borderRadius: 0, ease: "power2.in", duration: .6 })
        .to(".grow__circle img", { scale: 1, ease: "none", duration: .6 }, 0)
        .to(".grow__words span:first-child", { xPercent: -30, color: "#fff", ease: "none", duration: .6 }, 0)
        .to(".grow__words span:last-child", { xPercent: 30, color: "#fff", ease: "none", duration: .6 }, 0)
        .to(".grow__words", { opacity: 0, duration: .15 }, .62)
        .to(".grow__info", { opacity: 1, duration: .2 }, .7)
        .to({}, { duration: .2 });

      featured();

      // MARWAN: hero detail zooms out as it scrolls in; the two columns of works drift at different speeds
      gsap.fromTo(".marwan__hero > img", { scale: 1.25 }, { scale: 1, ease: "none", scrollTrigger: { trigger: ".marwan__hero", start: "top bottom", end: "bottom top", scrub: true } });
      gsap.from(".marwan__title h2 > *", { yPercent: 60, opacity: 0, duration: 1.4, ease: "expo.out", stagger: .12, scrollTrigger: { trigger: ".marwan__title", start: "top 85%" } });
      ScrollTrigger.matchMedia({ "(min-width: 641px)": () => {
        gsap.to(".marwan__col:first-child", { yPercent: 6, ease: "none", scrollTrigger: { trigger: ".marwan__works", start: "top bottom", end: "bottom top", scrub: true } });
        gsap.to(".marwan__col:last-child", { yPercent: -10, ease: "none", scrollTrigger: { trigger: ".marwan__works", start: "top bottom", end: "bottom top", scrub: true } });
      } });
    },
    about() {
      intro(() => {});
      // collage images drift apart as you scroll (Stellar about collage)
      const imgs = $$(".collage__img");
      const offsets = [[-12, -30], [-4, 34], [14, -24], [10, 40], [0, -50]];
      gsap.from(imgs, { opacity: 0, scale: .8, y: 80, duration: 1.4, ease: "expo.out", stagger: .08, delay: .2 });
      imgs.forEach((im, i) => gsap.to(im, { xPercent: offsets[i][0], yPercent: offsets[i][1], ease: "none",
        scrollTrigger: { trigger: ".collage", start: "top top", end: "bottom top", scrub: true } }));
    },
    pillar() {
      const w = splitWords($(".phero h1"), true);
      gsap.set(w, { yPercent: 110 });
      intro(() => gsap.to(w, { yPercent: 0, duration: 1.3, ease: "expo.out", stagger: .05 }));
      gsap.to(".phero__mono", { yPercent: -30, rotate: -6, ease: "none", scrollTrigger: { trigger: ".phero", start: "top top", end: "bottom top", scrub: true } });
    },
    news() {
      intro(() => {});
      // featured image wipes open from the top, then settles
      gsap.timeline({ scrollTrigger: { trigger: ".nfeat", start: "top 80%" } })
        .to(".nfeat__img", { clipPath: "inset(0 0 0% 0)", duration: 1.4, ease: "expo.inOut" })
        .from(".nfeat__img img", { scale: 1.4, duration: 1.8, ease: "expo.out" }, .2);
      gsap.from($$(".prow"), { opacity: 0, y: 30, duration: 1, ease: "expo.out", stagger: .05, scrollTrigger: { trigger: "#plist", start: "top 85%" } });
    },
    article() {
      intro(() => {});
      gsap.timeline({ scrollTrigger: { trigger: ".hero__media", start: "top 75%", end: "bottom bottom", scrub: true } })
        .to(".hero__frame", { clipPath: "inset(0% 0% 0% 0% round 0px)", ease: "none" })
        .to(".hero__frame img", { scale: 1, ease: "none" }, 0);
    },
    guillaume() {
      intro(() => {});
      gsap.to(".ghero__img", { clipPath: "inset(0% 0 0 0)", duration: 1.6, ease: "expo.inOut", delay: .3 });
      gsap.from(".ghero__img img", { scale: 1.3, duration: 2, ease: "expo.out", delay: .5 });
    },
    gallery() {
      intro(() => {});
      const items = $$(".gitem");
      // photos rise in as they enter (Stellar grid)
      ScrollTrigger.batch(items, { start: "top 92%", once: true,
        onEnter: b => gsap.from(b, { opacity: 0, y: 60, duration: 1.1, ease: "expo.out", stagger: .06 }) });
    },
    eveil() {
      intro(() => {});
      // the sticky image changes to match the chapter being read
      const imgs = $$(".echapters__img img");
      ScrollTrigger.matchMedia({ "(min-width: 1025px)": () => {
        $$(".echapter").forEach(ch => ScrollTrigger.create({ trigger: ch, start: "top 60%", end: "bottom 60%",
          onToggle: s => s.isActive && imgs.forEach((im, k) => gsap.to(im, { opacity: k === +ch.dataset.i ? 1 : 0, duration: .6 })) }));
      } });
      gsap.from(".ehero__ar", { yPercent: 40, opacity: 0, duration: 1.6, ease: "expo.out", delay: .3 });
    },
    contact() {
      // giant type slides in letter-group by letter-group (GPG footer type)
      const h = $(".chero h1");
      gsap.set(h, { yPercent: 100 });
      intro(() => gsap.to(h, { yPercent: 0, duration: 1.4, ease: "expo.out" }));
      gsap.to(h, { xPercent: -8, ease: "none", scrollTrigger: { trigger: ".chero", start: "top top", end: "bottom top", scrub: true } });
    }
  };

  /* featured slider (Stellar) */
  function featured() {
    const root = $(".featured"); if (!root) return;
    const bgs = $$(".featured__bg img", root), media = $$(".featured__media img", root);
    const name = $(".featured__name", root), sub = $(".featured__sub", root), idx = $(".featured__idx", root);
    let i = 0, timer;
    const show = (n) => {
      i = (n + bgs.length) % bgs.length;
      [bgs, media].forEach(list => list.forEach((im, k) => im.classList.toggle("is-active", k === i)));
      name.textContent = media[i].dataset.name; sub.textContent = media[i].dataset.sub;
      idx.textContent = String(i + 1).padStart(2, "0") + " / " + String(bgs.length).padStart(2, "0");
      clearTimeout(timer); timer = setTimeout(() => show(i + 1), 5500);
    };
    $(".featured__prev", root).addEventListener("click", () => show(i - 1));
    $(".featured__next", root).addEventListener("click", () => show(i + 1));
    ScrollTrigger.create({ trigger: root, start: "top 60%", once: true, onEnter: () => show(0) });
    show(0);
  }

  // pillar page builds its own DOM first (see pillar.html), so run after content exists
  (pages[page] || (() => intro(() => {})))();
  // theme triggers are created before pinned sections: sort so pin spacing is counted
  ScrollTrigger.sort(); ScrollTrigger.refresh();
  addEventListener("load", () => ScrollTrigger.refresh());
  // lazy images change the page height after load: re-measure so pinned sections start in the right place
  let lastH = 0, rt;
  new ResizeObserver(() => {
    const h = $("main").offsetHeight;
    if (Math.abs(h - lastH) < 2) return;
    lastH = h; clearTimeout(rt); rt = setTimeout(() => ScrollTrigger.refresh(), 150);
  }).observe($("main"));
})();
