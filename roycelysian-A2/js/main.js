/* Roycelysian — shared shell + motion */
(() => {
  const D = window.RY, $ = (s, c = document) => c.querySelector(s), $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const R = window.RYR, IMG = R.IMG;
  const page = document.body.dataset.page || '';
  const esc = R.esc;

  /* ---------- shell ---------- */
  const ON_HOME = page === 'home';
  const H = id => ON_HOME ? `#${id}` : `index.html#${id}`;
  const NAV = [
    [ON_HOME ? '#top' : 'index.html', 'Home', 'zeryab-pool'], ['work.html', 'Work', 'lazure-hall'], ['studio.html', 'Studio', 'zeryab-statue'],
    ['publications.html', 'Publications', 'zeryab-niche'], [H('contact'), 'Contact', 'skyline-living']
  ];
  const C = D.contact;
  document.body.insertAdjacentHTML('afterbegin', `
  <header class="hd${page === 'home' ? ' nologo' : ''}" id="hd">
    <button class="hd-menu" id="openMenu" aria-label="Open menu"><b></b><span class="label">Menu</span></button>
    <a class="hd-logo" href="${NAV[0][0]}" aria-label="Roycelysian home">
      <img class="lt" src="assets/brand/wordmark-ivory.png" alt="Roycelysian" width="614" height="63">
      <img class="ink" src="assets/brand/wordmark-navy.png" alt="" width="614" height="63">
    </a>
    <div class="hd-right">
      <a class="label link hide-m" href="work.html">Selected Work</a>
      <a class="hd-cta" href="${H('contact')}"><span class="label">Enquire</span></a>
    </div>
  </header>
  <div class="menu" id="menu" aria-hidden="true">
    <div class="menu-l">
      <button class="menu-close label" id="closeMenu"><b></b>Close</button>
      <nav>${NAV.map((n, i) => `<a href="${n[0]}" data-i="${i}" style="transition-delay:${.25 + i * .06}s"><small>0${i + 1}</small>${n[1]}</a>`).join('')}</nav>
      <div class="menu-foot label">
        <a class="link" href="mailto:${C.email}">${C.email}</a>
        <a class="link" href="${C.instagram}" target="_blank" rel="noopener">Instagram</a>
        <span class="dim">${C.city}</span>
      </div>
    </div>
    <div class="menu-r">${NAV.map((n, i) => `<img ${R.IMGS(n[2], '48vw')} alt="" class="${i ? '' : 'on'}" loading="lazy" decoding="async">`).join('')}</div>
  </div>
  <div class="veil"></div>`);

  document.body.insertAdjacentHTML('beforeend', `
  <footer class="ft">
    <div class="ft-top">
      <div><p class="statement">Every place has a character. <em>Every brand has a story.</em></p></div>
      <div class="ft-col"><span class="label">Studio</span>${NAV.slice(1).map(n => `<a href="${n[0]}">${n[1]}</a>`).join('')}</div>
      <div class="ft-col"><span class="label">Enquiries</span><a href="mailto:${C.email}">${C.email}</a><p>${C.city}</p><p>Working across MENA &amp; Europe</p></div>
      <div class="ft-col"><span class="label">Follow</span><a href="${C.instagram}" target="_blank" rel="noopener">Instagram</a><a href="${C.behance}" target="_blank" rel="noopener">Behance</a><a href="${C.linkedin}" target="_blank" rel="noopener">LinkedIn</a></div>
    </div>
    <div class="ft-mark"><img src="assets/brand/wordmark-ivory.png" alt="Roycelysian" loading="lazy" width="614" height="63"></div>
    <div class="ft-bot label"><span>© ${new Date().getFullYear()} Roycelysian</span><span>Photography · Branding · Editorial Design</span></div>
  </footer>`);

  /* menu */
  const menu = $('#menu');
  const setMenu = o => { menu.classList.toggle('is-open', o); menu.setAttribute('aria-hidden', !o); o ? lenis?.stop() : lenis?.start(); };
  $('#openMenu').onclick = () => setMenu(true);
  $('#closeMenu').onclick = () => setMenu(false);
  addEventListener('keydown', e => e.key === 'Escape' && setMenu(false));
  const mImgs = $$('.menu-r img');
  $$('.menu nav a').forEach(a => a.addEventListener('mouseenter', () => mImgs.forEach((m, i) => m.classList.toggle('on', i == a.dataset.i))));

  /* ---------- page renders (skipped where build.js already rendered the HTML) ---------- */
  const fill = (el, html) => { if (el && !el.children.length) el.innerHTML = html; };

  if (page === 'home') {
    const hero = $('#open'), win = $('#openWin'), rings = $$('.open-ring'), sl = $('#slides');
    fill(sl, R.slides(D));
    const S = $$('.slide', sl), N = S.length;
    $('#sTot').textContent = String(N).padStart(2, '0');
    let seen = false; try { seen = !!sessionStorage.getItem('ry-intro'); sessionStorage.setItem('ry-intro', '1'); } catch (e) {}
    const fast = seen || matchMedia('(prefers-reduced-motion: reduce)').matches;

    // the window: hidden below → small arch → full screen
    let stage = 0;
    const geo = () => {
      const W = innerWidth, H = innerHeight, mob = W <= 720;
      const w0 = mob ? W * .74 : Math.min(W * .3, H * .56), h0 = mob ? H * .6 : H * .8;
      const full = stage >= 2, w = full ? W : w0, h = full ? H : h0, rad = full ? 0 : w0 / 2, ty = stage === 0 ? h0 + 60 : 0;
      [win, ...rings].forEach((el, i) => {
        const o = i * (mob ? 12 : 18);
        el.style.width = (w + o * 2) + 'px'; el.style.height = (h + o) + 'px';
        el.style.borderRadius = `${rad + o}px ${rad + o}px 0 0`; el.style.transform = `translate(-50%, ${ty}px)`;
        if (i) el.style.opacity = full ? 0 : .9;
      });
    };
    const to = n => { stage = n; hero.classList.add('st' + n); geo(); };
    hero.classList.add('notrans'); geo(); void hero.offsetWidth; requestAnimationFrame(() => hero.classList.remove('notrans'));
    addEventListener('resize', () => { hero.classList.add('notrans'); geo(); requestAnimationFrame(() => hero.classList.remove('notrans')); });

    // slideshow
    let si = 0, timer = null, paused = false, started = false;
    const bar = $('#sBar'), cur = $('#sCur'), DUR = 6000;
    const wake = im => { if (im && im.dataset.src) { im.sizes = im.dataset.sizes; im.srcset = im.dataset.srcset; im.src = im.dataset.src; im.removeAttribute('data-src'); } };
    const runBar = () => {
      bar.style.transition = 'none'; bar.style.transform = 'scaleX(0)'; void bar.offsetWidth;
      if (!paused) { bar.style.transition = `transform ${DUR}ms linear`; bar.style.transform = 'scaleX(1)'; }
    };
    const tick = () => { clearTimeout(timer); runBar(); if (!paused) timer = setTimeout(() => show(si + 1), DUR); };
    const show = n => {
      S[si].classList.remove('is-on'); si = (n + N) % N;
      wake($('img', S[si])); S[si].classList.add('is-on'); wake($('img', S[(si + 1) % N]));
      cur.textContent = String(si + 1).padStart(2, '0');
      if (started) tick();
    };
    const play = () => { started = true; wake($('img', S[1 % N])); tick(); };
    $('#sNext').onclick = () => started && show(si + 1);
    $('#sPrev').onclick = () => started && show(si - 1);
    if (matchMedia('(hover:hover)').matches) {
      // pause only while reading a project's details or using the controls (the hero fills the screen)
      const hold = () => { paused = true; clearTimeout(timer); const t = getComputedStyle(bar).transform; bar.style.transition = 'none'; bar.style.transform = t; };
      const release = () => { paused = false; if (started) tick(); };
      [$('#sNav'), ...$$('.s-cap', sl)].forEach(el => { el.addEventListener('mouseenter', hold); el.addEventListener('mouseleave', release); });
    }
    let tx = null;
    hero.addEventListener('touchstart', e => { tx = e.touches[0].clientX; }, { passive: true });
    hero.addEventListener('touchend', e => { if (tx === null || !started) return; const dx = e.changedTouches[0].clientX - tx; if (Math.abs(dx) > 50) show(si + (dx < 0 ? 1 : -1)); tx = null; });
    addEventListener('keydown', e => { if (!started || scrollY > innerHeight * .5) return; if (e.key === 'ArrowRight') show(si + 1); if (e.key === 'ArrowLeft') show(si - 1); });
    document.addEventListener('visibilitychange', () => { if (document.hidden) clearTimeout(timer); else if (started && !paused) tick(); });

    // timeline starts once the entrance animation is running
    const T = fast ? [150, 750, 1900] : [1800, 3900, 5200];
    addEventListener('ry-go', () => {
      setTimeout(() => to(1), T[0]);
      setTimeout(() => { to(2); $('#hd').classList.remove('nologo'); }, T[1]);
      setTimeout(() => { hero.classList.add('ui'); play(); }, T[2]);
    }, { once: true });
    fill($('#expList'), R.expList(D));
  }

  if (page === 'work') fill($('#workList'), R.workList(D));

  if (page === 'project') {
    const pj = $('#pj');
    if (!pj.children.length) {
      // legacy project.html?p=slug: render, then hand the visitor the real URL
      const slug = new URLSearchParams(location.search).get('p');
      const p = D.projects.find(x => x.slug === slug) || D.projects[0];
      document.title = `${p.name} — ${p.place} | Roycelysian`;
      pj.innerHTML = R.project(D, p);
    }
    if (window.innerWidth < 1000) $('.intro-text-pj').style.gridColumn = '1/-1';
  }

  if ($('#form')) {
    const f = $('#form');
    f.addEventListener('submit', e => {
      e.preventDefault();
      const v = n => (f.elements[n]?.value || '').trim();
      const types = $$('input[name=type]:checked', f).map(x => x.value).join(', ');
      const body = `Name: ${v('name')}\nEmail: ${v('email')}\nCompany / Property: ${v('company')}\nLocation: ${v('location')}\nInterested in: ${types}\n\n${v('message')}`;
      location.href = `mailto:${C.email}?subject=${encodeURIComponent('Project enquiry — ' + (v('company') || v('name')))}&body=${encodeURIComponent(body)}`;
      $('.form-ok').style.display = 'block';
    });
    $$('[data-email]').forEach(a => { a.href = 'mailto:' + C.email; a.textContent = C.email; });
  }

  /* ---------- start every new page at the top ---------- */
  const navType = (performance.getEntriesByType && performance.getEntriesByType('navigation')[0] || {}).type;
  const freshPage = navType !== 'back_forward' && !location.hash;
  if ('scrollRestoration' in history) history.scrollRestoration = freshPage ? 'manual' : 'auto';
  const toTop = () => {
    if (!freshPage) return;
    window.scrollTo(0, 0);
    // when the site is shown inside a frame that grows with the page, the frame keeps the old scroll: bring it up too
    if (window.top !== window) { try { document.documentElement.scrollIntoView({ block: 'start' }); } catch (e) {} }
  };
  toTop();

  /* ---------- smooth scroll ---------- */
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let lenis = null;
  if (window.Lenis && !reduce) {
    lenis = new Lenis({ duration: 1.15, easing: t => 1 - Math.pow(1 - t, 4), smoothWheel: true });
    const raf = t => { lenis.raf(t); requestAnimationFrame(raf); };
    requestAnimationFrame(raf);
    if (freshPage) lenis.scrollTo(0, { immediate: true, force: true });
  }

  /* ---------- header state ---------- */
  const hd = $('#hd');
  let lastY = 0;
  const tones = $$('.open,.dark,.forest,.cta,.phero,.pj-next,.ft,.zb-close');
  const onScroll = () => {
    const y = scrollY, th = page === 'home' || document.body.classList.contains('has-hero') ? innerHeight * .8 : 40;
    hd.classList.toggle('solid', page === 'contact' || (y > th && !inArch()));
    const hy = hd.offsetHeight / 2, under = tones.find(t => { const r = t.getBoundingClientRect(); return r.top <= hy && r.bottom > hy; });
    hd.classList.toggle('tone-light', !under);
    if (openEl && !openEl.classList.contains('auto')) hd.classList.toggle('nologo', openEl.getBoundingClientRect().bottom > hd.offsetHeight);
    hd.classList.toggle('hide', y > lastY && y > innerHeight * 1.2 && !menu.classList.contains('is-open'));
    lastY = y;
    arch(); rail();
  };

  /* ---------- opening (home) ---------- */
  const openEl = $('#open'), win = $('#openWin'), rings = $$('.open-ring'), oTitle = $('#openTitle'),
        oBg = $('.open-bg'), oFrame = $('.open-frame'), oFoot = $('.open-foot'), oMono = $('.open-mono'), oUi = $('#openUi'), oScript = $('.open-script');
  let openP = 0;
  function inArch() { return false; }
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v)), seg = (p, a, b) => clamp((p - a) / (b - a)),
        eio = t => t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2, eo = t => 1 - Math.pow(1 - t, 3);
  function arch() {
    if (!openEl || openEl.classList.contains('auto')) return;
    const r = openEl.getBoundingClientRect(), total = r.height - innerHeight;
    const p = openP = clamp(-r.top / total);
    const W = innerWidth, H = innerHeight, mob = W <= 720;
    const w0 = mob ? W * .74 : Math.min(W * .3, H * .56), h0 = mob ? H * .6 : H * .8;
    const rise = eo(seg(p, 0, .32)), grow = eio(seg(p, .3, .7));
    const w = w0 + (W - w0) * grow, h = h0 + (H - h0) * grow, rad = (w0 / 2) * (1 - grow);
    const ty = (1 - rise) * (h0 + 40);
    const set = (el, ww, hh, rr, op) => { el.style.width = ww + 'px'; el.style.height = hh + 'px'; el.style.borderRadius = `${rr}px ${rr}px 0 0`; el.style.transform = `translate(-50%, ${ty}px)`; if (op !== undefined) el.style.opacity = op; };
    set(win, w, h, rad);
    const ro = (1 - grow) * .9;
    rings.forEach((g, i) => { const o = (i + 1) * (mob ? 12 : 18); set(g, w + o * 2, h + o, rad + o, ro); });
    oFrame.style.opacity = 1 - seg(p, .36, .62);
    oBg.style.opacity = 1 - seg(p, .05, .34);
    oFoot.style.opacity = 1 - seg(p, .02, .14);
    oMono.style.opacity = .9 * (1 - seg(p, .2, .4));
    // title drifts up once the arch has filled the screen
    const up = eio(seg(p, .62, .92)), th = oTitle.offsetHeight, topTarget = mob ? H * .15 : H * .11;
    const off = (H / 2 - topTarget - th / 2) * up;
    oTitle.style.transform = `translateY(calc(-50% - ${off}px)) scale(${1 - up * .12})`;
    const u = seg(p, .74, .9);
    oUi.style.opacity = u; oUi.style.transform = `translateY(${(1 - u) * 20}px)`; oUi.classList.toggle('on', u > .5);
  }

  /* ---------- drag rail ---------- */
  const railEl = $('#rail'), bar = $('.progress i');
  function rail() {
    if (!railEl || !bar) return;
    const m = railEl.scrollWidth - railEl.clientWidth, v = railEl.clientWidth / railEl.scrollWidth;
    bar.style.width = v * 100 + '%'; bar.style.left = (m ? railEl.scrollLeft / m : 0) * (1 - v) * 100 + '%';
  }
  if (railEl) {
    let down = false, sx = 0, sl = 0, moved = 0;
    railEl.addEventListener('pointerdown', e => { if (e.pointerType !== 'mouse') return; down = true; moved = 0; sx = e.clientX; sl = railEl.scrollLeft; });
    addEventListener('pointermove', e => { if (!down) return; const dx = e.clientX - sx; moved = Math.abs(dx); if (moved > 5) railEl.classList.add('drag'); railEl.scrollLeft = sl - dx; });
    addEventListener('pointerup', () => { down = false; setTimeout(() => railEl.classList.remove('drag'), 0); });
    railEl.addEventListener('scroll', rail, { passive: true });
    $$('[data-rail]').forEach(b => b.onclick = () => railEl.scrollBy({ left: (+b.dataset.rail) * railEl.clientWidth * .6, behavior: 'smooth' }));
  }

  /* ---------- expertise: details open on hover (desktop) or tap (touch) ---------- */
  $$('.exp-col').forEach(col => {
    const btn = $('.exp-btn', col), set = on => { col.classList.toggle('is-on', on); btn.setAttribute('aria-expanded', on); };
    btn.addEventListener('click', () => set(!col.classList.contains('is-on')));
    if (matchMedia('(hover:hover)').matches) { col.addEventListener('mouseenter', () => set(true)); col.addEventListener('mouseleave', () => set(false)); }
  });

  /* ---------- condensed display + letter split ---------- */
  const logo = $('.open-logo');
  if (logo) {
    const t = logo.textContent, mid = (t.length - 1) / 2;
    logo.innerHTML = [...t].map((ch, i) => `<span class="ch" style="--d:${(450 + Math.abs(i - mid) * 85) | 0}ms">${ch}</span>`).join('');
  }
  const splitText = el => {
    let k = 0;
    const walk = n => [...n.childNodes].forEach(c => {
      if (c.nodeType === 3) {
        const frag = document.createDocumentFragment();
        c.textContent.split(/(\s+)/).forEach(part => {
          if (!part) return;
          if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(' ')); return; }
          const w = document.createElement('span'); w.className = 'wd';
          // whole words animate together so the typeface keeps its kerning
          const s = document.createElement('span'); s.className = 'ch'; s.textContent = part; s.style.setProperty('--i', Math.min(k, 12) * 3); k++; w.appendChild(s);
          frag.appendChild(w);
        });
        c.replaceWith(frag);
      } else if (c.nodeType === 1 && c.tagName !== 'BR') walk(c);
    });
    walk(el);
  };
  const typeset = root => $$('.display,.h2,.exp-row h3,.wl-t h2', root).forEach(el => {
    if (el.closest('.open') || el.dataset.ty) return;
    el.dataset.ty = 1;
    el.setAttribute('aria-label', el.innerHTML.replace(/<br\s*\/?>/gi, ' ').replace(/<[^>]+>/g, '').replace(/&amp;/g, '&').replace(/\s+/g, ' ').trim());
    const al = getComputedStyle(el).textAlign;
    const cx = document.createElement('span'); cx.className = 'cx' + (al === 'center' ? ' c' : al === 'right' ? ' r' : ''); cx.setAttribute('aria-hidden', 'true');
    while (el.firstChild) cx.appendChild(el.firstChild);
    el.appendChild(cx);
    if (!el.closest('.exp-row') && !el.closest('.wl-item')) { splitText(cx); el.classList.remove('rv'); el.classList.add('sx'); if (el.closest('.phero')) el.style.setProperty('--d', '250ms'); }
  });
  typeset(document);
  $$('.menu nav a').forEach(a => { const s = a.lastChild; if (s && s.nodeType === 3) { const sp = document.createElement('span'); sp.className = 'cx'; sp.textContent = s.textContent; s.replaceWith(sp); } });

  /* ---------- reveals ---------- */
  const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { rootMargin: '0px 0px -10% 0px' });
  const observe = root => $$('.rv,.rv-img,.sx', root).forEach(el => io.observe(el));
  observe(document);

  /* ---------- parallax on cta ---------- */
  const px = $$('[data-parallax]');
  const parallax = () => px.forEach(el => { const r = el.parentElement.getBoundingClientRect(); el.style.transform = `translateY(${(r.top + r.height / 2 - innerHeight / 2) * -.08}px)`; });

  if (lenis) lenis.on('scroll', () => { onScroll(); parallax(); });
  else addEventListener('scroll', () => { onScroll(); parallax(); }, { passive: true });
  addEventListener('resize', () => { arch(); rail(); });
  addEventListener('load', () => { if (freshPage && scrollY < innerHeight) toTop(); });
  onScroll(); parallax();


  /* ---------- one-page navigation ---------- */
  const ease = t => 1 - Math.pow(1 - t, 4);
  const goTo = (id, immediate) => {
    const el = id === 'top' ? null : document.getElementById(id);
    if (id !== 'top' && !el) return false;
    // shown inside a frame that grows with the page: the frame scrolls, not this window
    if (document.documentElement.scrollHeight <= innerHeight + 2) { (el || document.body).scrollIntoView({ behavior: immediate ? 'auto' : 'smooth', block: 'start' }); return true; }
    const y = el ? el.getBoundingClientRect().top + scrollY : 0;
    if (lenis) lenis.scrollTo(y, immediate ? { immediate: true, force: true } : { duration: Math.min(2.2, .9 + Math.abs(y - scrollY) / 6000), easing: ease, force: true });
    else window.scrollTo({ top: y, behavior: immediate ? 'auto' : 'smooth' });
    return true;
  };

  // capture phase: runs before the page-transition handler below
  document.addEventListener('click', e => {
    const a = e.target.closest('a'); if (!a || e.metaKey || e.ctrlKey || e.shiftKey || a.target === '_blank') return;
    const href = a.getAttribute('href') || '';
    if (a.closest('.rail.drag')) { e.preventDefault(); e.stopPropagation(); return; }
    if (!ON_HOME || !href.startsWith('#') || href.length < 2) return;
    const id = href.slice(1);
    if (id !== 'top' && !document.getElementById(id)) return;
    e.preventDefault(); e.stopPropagation(); setMenu(false); goTo(id);
  }, true);

  // arriving with a hash: old project links go to the project page, sections scroll into place
  if (ON_HOME && location.hash.length > 1) {
    const h = decodeURIComponent(location.hash.slice(1));
    if (D.projects.some(p => p.slug === h)) location.replace(h + '.html');
    else addEventListener('load', () => goTo(h, true));
  }

  /* ---------- load + page transitions ---------- */
  const start = () => requestAnimationFrame(() => { document.documentElement.classList.add('ready', 'go'); dispatchEvent(new Event('ry-go')); });
  (document.fonts && document.fonts.ready ? Promise.race([document.fonts.ready, new Promise(r => setTimeout(r, 1800))]) : Promise.resolve()).then(() => setTimeout(start, 120));

  const VT = window.CSS && CSS.supports && CSS.supports('view-transition-name', 'none');
  document.addEventListener('click', e => {
    const a = e.target.closest('a'); if (!a || e.defaultPrevented || e.metaKey || e.ctrlKey || a.target === '_blank') return;
    const href = a.getAttribute('href'); if (!href || href.startsWith('#') || href.startsWith('mailto') || href.startsWith('http')) return;
    if (a.closest('.rail.drag')) { e.preventDefault(); return; }
    const u = new URL(href, location.href);
    if (u.pathname === location.pathname && u.search === location.search && u.hash) return;
    if (VT) return;                                   // the browser cross-fades the pages itself
    e.preventDefault(); document.documentElement.classList.add('leaving'); setTimeout(() => location.href = href, 380);
  });
  addEventListener('pageshow', e => { if (e.persisted) document.documentElement.classList.remove('leaving'); });
})();
