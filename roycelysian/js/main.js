/* Roycelysian — shared shell + motion */
(() => {
  const D = window.RY, $ = (s, c = document) => c.querySelector(s), $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const IMG = (k, sm) => `assets/img/${k}${sm ? '-sm' : ''}.jpg`;
  const page = document.body.dataset.page || '';
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

  /* ---------- shell ---------- */
  const NAV = [
    ['index.html', 'Home', 'zeryab-arcade'], ['work.html', 'Work', 'lazure-hall'], ['expertise.html', 'Expertise', 'riad-salon'],
    ['publications.html', 'Publications', 'zeryab-niche'], ['studio.html', 'Studio', 'zeryab-statue'], ['contact.html', 'Contact', 'nal-terrace']
  ];
  const C = D.contact;
  document.body.insertAdjacentHTML('afterbegin', `
  <header class="hd${page === 'home' ? ' off nologo' : ''}" id="hd">
    <button class="hd-menu" id="openMenu" aria-label="Open menu"><b></b><span class="label">Menu</span></button>
    <a class="hd-logo" href="index.html" aria-label="Roycelysian home">
      <img class="lt" src="assets/brand/wordmark-ivory.png" alt="Roycelysian" width="614" height="63">
      <img class="ink" src="assets/brand/wordmark-navy.png" alt="" width="614" height="63">
    </a>
    <div class="hd-right">
      <a class="label link hide-m" href="work.html">Selected Work</a>
      <a class="hd-cta" href="contact.html"><span class="label">Enquire</span></a>
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
    <div class="menu-r">${NAV.map((n, i) => `<img src="${IMG(n[2], 1)}" alt="" class="${i ? '' : 'on'}" loading="lazy">`).join('')}</div>
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
  const setMenu = o => { menu.classList.toggle('open', o); menu.setAttribute('aria-hidden', !o); o ? lenis?.stop() : lenis?.start(); };
  $('#openMenu').onclick = () => setMenu(true);
  $('#closeMenu').onclick = () => setMenu(false);
  addEventListener('keydown', e => e.key === 'Escape' && setMenu(false));
  const mImgs = $$('.menu-r img');
  $$('.menu nav a').forEach(a => a.addEventListener('mouseenter', () => mImgs.forEach((m, i) => m.classList.toggle('on', i == a.dataset.i))));

  /* ---------- page renders ---------- */
  const card = p => `<a class="card" href="project.html?p=${p.slug}">
      <div class="ph"><img src="${IMG(p.cover, 1)}" alt="${esc(p.name)}, ${esc(p.place)}" loading="lazy"></div>
      <div class="card-meta"><h3>${esc(p.name)}</h3><span class="label">${esc(p.place.split(',').pop().trim())}</span></div>
      <p>${esc(p.type)}</p></a>`;

  if (page === 'home') {
    // hero slides
    const hs = $('#heroSlides');
    hs.innerHTML = D.hero.map((s, i) => `<figure class="${i ? '' : 'on'}"><img src="${IMG(s.img)}" alt="${esc(s.caption)}, ${esc(s.place)}" ${i ? 'loading="lazy"' : 'fetchpriority="high"'}></figure>`).join('');
    $('#heroDots').innerHTML = D.hero.map((_, i) => `<button class="${i ? '' : 'on'}" aria-label="Slide ${i + 1}"></button>`).join('');
    let cur = 0, timer;
    const cap = $('#heroCap');
    const go = n => {
      const f = $$('figure', hs), d = $$('#heroDots button');
      f[cur].classList.remove('on'); d[cur].classList.remove('on');
      cur = (n + f.length) % f.length;
      f[cur].classList.add('on'); void d[cur].offsetWidth; d[cur].classList.add('on');
      cap.style.opacity = 0;
      setTimeout(() => { cap.innerHTML = `<span class="label dim">${esc(D.hero[cur].place)}</span><span class="serif">${esc(D.hero[cur].caption)}</span>`; cap.style.opacity = 1; }, 400);
      clearTimeout(timer); timer = setTimeout(() => go(cur + 1), 6500);
    };
    cap.style.transition = 'opacity .4s';
    cap.innerHTML = `<span class="label dim">${esc(D.hero[0].place)}</span><span class="serif">${esc(D.hero[0].caption)}</span>`;
    $$('#heroDots button').forEach((b, i) => b.onclick = () => i !== cur && go(i));
    timer = setTimeout(() => go(1), 6500);

    $('#rail').innerHTML = D.projects.slice(0, 4).map(card).join('') + '<span class="rail-end"></span>';
    $('#expList').innerHTML = D.expertise.map(e => `<a class="exp-row" href="expertise.html#${e.slug}" data-img="${IMG(e.img, 1)}">
      <span class="n">${e.n}</span><h3>${e.name}</h3><p class="items">${e.items.join(' · ')}</p><span class="arr">&rarr;</span></a>`).join('');
  }

  if (page === 'work') {
    $('#workList').innerHTML = D.projects.map((p, i) => `<a class="wl-item rv" href="project.html?p=${p.slug}">
      <div class="ph rv-img"><img src="${IMG(p.cover)}" alt="${esc(p.name)}" loading="lazy"></div>
      <div class="wl-t"><span class="label">0${i + 1} — ${esc(p.place)}</span><h2>${esc(p.name)}</h2><p>${esc(p.title)}.</p>
      <div class="scope">${p.scope.join(' · ')}</div><span class="btn ghost"><span>View project</span><i></i></span></div></a>`).join('');
  }

  if (page === 'project') {
    const slug = new URLSearchParams(location.search).get('p');
    const i = Math.max(0, D.projects.findIndex(p => p.slug === slug)), p = D.projects[i], nx = D.projects[(i + 1) % D.projects.length];
    document.title = `${p.name} — ${p.place} | Roycelysian`;
    $('#pj').innerHTML = `
    <section class="phero"><img src="${IMG(p.cover)}" alt="${esc(p.name)}" fetchpriority="high">
      <div class="phero-in"><div><span class="label">${esc(p.place)} — ${esc(p.type)}</span><h1 class="display">${esc(p.name)}</h1></div>
      <div class="phero-meta"><p class="serif" style="font-size:22px;line-height:1.3">${esc(p.line)}</p></div></div></section>
    <section class="sec wrap"><div class="grid">
      <div style="grid-column:1/4" class="rv"><span class="label">The project</span></div>
      <div style="grid-column:4/13" class="intro-text-pj">
        <h2 class="statement rv">${esc(p.title)}</h2>
        <p class="lead rv d1" style="margin-top:36px">${esc(p.intro)}</p>
        <div class="pj-meta rv d2"><div><span class="label">Location</span><p>${esc(p.place)}</p></div><div><span class="label">Sector</span><p>${esc(p.type)}</p></div><div><span class="label">Our role</span><p>${p.scope.join('<br>')}</p></div></div>
      </div></div></section>
    ${p.gallery.length ? `<section class="wrap" style="padding-bottom:clamp(96px,14vw,200px)"><div class="pj-gal">${p.gallery.map(g => `<figure class="ph rv-img ${g.f}"><img src="${IMG(g.img)}" alt="${esc(p.name)}" loading="lazy"></figure>`).join('')}</div></section>` : ''}
    <a class="pj-next" href="project.html?p=${nx.slug}"><img src="${IMG(nx.cover)}" alt="" loading="lazy">
      <div><span class="label">Next project</span><span class="display" style="font-size:clamp(40px,6vw,96px)">${esc(nx.name)}</span><span class="label dim">${esc(nx.place)}</span></div></a>`;
    if (window.innerWidth < 1000) $('.intro-text-pj').style.gridColumn = '1/-1';
  }

  if (page === 'contact') {
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

  /* ---------- smooth scroll ---------- */
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let lenis = null;
  if (window.Lenis && !reduce) {
    lenis = new Lenis({ duration: 1.15, easing: t => 1 - Math.pow(1 - t, 4), smoothWheel: true });
    const raf = t => { lenis.raf(t); requestAnimationFrame(raf); };
    requestAnimationFrame(raf);
  }

  /* ---------- header state ---------- */
  const hd = $('#hd');
  let lastY = 0;
  const tones = $$('.open,.dark,.cta,.phero,.pj-next,.ft');
  const onScroll = () => {
    const y = scrollY, th = page === 'home' || document.body.classList.contains('has-hero') ? innerHeight * .8 : 40;
    hd.classList.toggle('solid', page === 'contact' || (y > th && !inArch()));
    const hy = hd.offsetHeight / 2, under = tones.find(t => { const r = t.getBoundingClientRect(); return r.top <= hy && r.bottom > hy; });
    hd.classList.toggle('tone-light', !under);
    if (openEl) hd.classList.toggle('nologo', openEl.getBoundingClientRect().bottom > hd.offsetHeight);
    hd.classList.toggle('hide', y > lastY && y > innerHeight * 1.2 && !menu.classList.contains('open'));
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
    if (!openEl) return;
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
    hd.classList.toggle('off', p < .72);
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

  /* ---------- floating image on expertise rows ---------- */
  const rows = $$('.exp-row[data-img]');
  if (rows.length && matchMedia('(hover:hover)').matches) {
    const fl = document.createElement('div'); fl.className = 'float-img'; fl.innerHTML = '<img alt="">'; document.body.appendChild(fl);
    const fi = $('img', fl); let tx = 0, ty = 0, x = 0, y = 0;
    rows.forEach(r => {
      r.addEventListener('mouseenter', () => { fi.src = r.dataset.img; fl.classList.add('on'); });
      r.addEventListener('mouseleave', () => fl.classList.remove('on'));
    });
    addEventListener('mousemove', e => { tx = e.clientX + 170; ty = e.clientY; });
    (function loop() { x += (tx - x) * .14; y += (ty - y) * .14; fl.style.left = x + 'px'; fl.style.top = y + 'px'; requestAnimationFrame(loop); })();
  }

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
          [...part].forEach(ch => { const s = document.createElement('span'); s.className = 'ch'; s.textContent = ch; s.style.setProperty('--i', Math.min(k++, 34)); w.appendChild(s); });
          frag.appendChild(w);
        });
        c.replaceWith(frag);
      } else if (c.nodeType === 1 && c.tagName !== 'BR') walk(c);
    });
    walk(el);
  };
  $$('.display,.h2,.exp-row h3,.wl-t h2').forEach(el => {
    if (el.closest('.open')) return;
    el.setAttribute('aria-label', el.textContent.replace(/\s+/g, ' ').trim());
    const al = getComputedStyle(el).textAlign;
    const cx = document.createElement('span'); cx.className = 'cx' + (al === 'center' ? ' c' : al === 'right' ? ' r' : ''); cx.setAttribute('aria-hidden', 'true');
    while (el.firstChild) cx.appendChild(el.firstChild);
    el.appendChild(cx);
    if (!el.closest('.exp-row') && !el.closest('.wl-item')) { splitText(cx); el.classList.remove('rv'); el.classList.add('split'); if (el.closest('.phero')) el.style.setProperty('--d', '250ms'); }
  });
  $$('.menu nav a').forEach(a => { const s = a.lastChild; if (s && s.nodeType === 3) { const sp = document.createElement('span'); sp.className = 'cx'; sp.textContent = s.textContent; s.replaceWith(sp); } });

  /* ---------- reveals ---------- */
  const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { rootMargin: '0px 0px -10% 0px' });
  $$('.rv,.rv-img,.split').forEach(el => io.observe(el));

  /* ---------- parallax on cta ---------- */
  const px = $$('[data-parallax]');
  const parallax = () => px.forEach(el => { const r = el.parentElement.getBoundingClientRect(); el.style.transform = `translateY(${(r.top + r.height / 2 - innerHeight / 2) * -.08}px)`; });

  if (lenis) lenis.on('scroll', () => { onScroll(); parallax(); });
  else addEventListener('scroll', () => { onScroll(); parallax(); }, { passive: true });
  addEventListener('resize', () => { arch(); rail(); });
  onScroll(); parallax();

  /* ---------- load + page transitions ---------- */
  const start = () => requestAnimationFrame(() => { document.documentElement.classList.add('ready', 'go'); });
  (document.fonts && document.fonts.ready ? Promise.race([document.fonts.ready, new Promise(r => setTimeout(r, 1800))]) : Promise.resolve()).then(() => setTimeout(start, 120));

  document.addEventListener('click', e => {
    const a = e.target.closest('a'); if (!a || e.defaultPrevented || e.metaKey || e.ctrlKey || a.target === '_blank') return;
    const href = a.getAttribute('href'); if (!href || href.startsWith('#') || href.startsWith('mailto') || href.startsWith('http')) return;
    if (a.closest('.rail.drag')) { e.preventDefault(); return; }
    const u = new URL(href, location.href);
    if (u.pathname === location.pathname && u.search === location.search && u.hash) return;
    e.preventDefault(); document.documentElement.classList.add('leaving'); setTimeout(() => location.href = href, 450);
  });
  addEventListener('pageshow', e => { if (e.persisted) document.documentElement.classList.remove('leaving'); });
})();
