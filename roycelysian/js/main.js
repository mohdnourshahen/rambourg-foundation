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
  <header class="hd" id="hd">
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
  const tones = $$('.hero,.arch,.dark,.cta,.phero,.pj-next,.ft');
  const onScroll = () => {
    const y = scrollY, th = page === 'home' || document.body.classList.contains('has-hero') ? innerHeight * .8 : 40;
    hd.classList.toggle('solid', page === 'contact' || (y > th && !inArch()));
    const hy = hd.offsetHeight / 2, under = tones.find(t => { const r = t.getBoundingClientRect(); return r.top <= hy && r.bottom > hy; });
    hd.classList.toggle('tone-light', !under);
    hd.classList.toggle('hide', y > lastY && y > innerHeight * 1.2 && !menu.classList.contains('open'));
    lastY = y;
    arch(); rail();
  };

  /* ---------- arch reveal (home) ---------- */
  const archEl = $('.arch'), win = $('.arch-win'), head = $('.arch-head'), flank = $('.arch-flank'), aCap = $('.arch-cap');
  function inArch() { if (!archEl) return false; const r = archEl.getBoundingClientRect(); return r.top <= 0 && r.bottom > innerHeight; }
  function arch() {
    if (!archEl) return;
    const r = archEl.getBoundingClientRect(), total = r.height - innerHeight;
    const p = Math.min(1, Math.max(0, -r.top / total));
    const e = p < .1 ? 0 : Math.min(1, (p - .1) / .7), k = 1 - Math.pow(1 - e, 3);
    const mob = innerWidth <= 720, w0 = innerWidth * (mob ? .62 : .26), h0 = innerHeight * (mob ? .52 : .44);
    const w = w0 + (innerWidth - w0) * k, h = h0 + (innerHeight - h0) * k, rad = (w0 / 2) * (1 - k);
    win.style.width = w + 'px'; win.style.height = h + 'px';
    win.style.borderRadius = `${rad}px ${rad}px 0 0`; win.style.outlineColor = `rgba(243,240,232,${.16 * (1 - k)})`;
    head.style.opacity = 1 - Math.min(1, k * 1.8); head.style.transform = `translateY(${-k * 60}px)`;
    if (flank) { flank.style.opacity = 1 - Math.min(1, k * 2.2); flank.style.letterSpacing = 0; flank.style.padding = `0 calc(var(--gut) + ${3 - k * 3}vw)`; }
    const c = Math.max(0, (p - .82) / .14); aCap.style.opacity = Math.min(1, c); aCap.style.transform = `translateY(${(1 - Math.min(1, c)) * 20}px)`;
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

  /* ---------- reveals ---------- */
  const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { rootMargin: '0px 0px -10% 0px' });
  $$('.rv,.rv-img').forEach(el => io.observe(el));

  /* ---------- parallax on cta ---------- */
  const px = $$('[data-parallax]');
  const parallax = () => px.forEach(el => { const r = el.parentElement.getBoundingClientRect(); el.style.transform = `translateY(${(r.top + r.height / 2 - innerHeight / 2) * -.08}px)`; });

  if (lenis) lenis.on('scroll', () => { onScroll(); parallax(); });
  else addEventListener('scroll', () => { onScroll(); parallax(); }, { passive: true });
  addEventListener('resize', () => { arch(); rail(); });
  onScroll(); parallax();

  /* ---------- load + page transitions ---------- */
  const loader = $('.loader');
  const start = () => requestAnimationFrame(() => document.documentElement.classList.add('ready'));
  if (loader) {
    if (sessionStorage.getItem('ry-seen')) { loader.remove(); start(); }
    else { try { sessionStorage.setItem('ry-seen', 1); } catch (e) {} setTimeout(() => { document.documentElement.classList.add('loaded'); setTimeout(start, 350); setTimeout(() => loader.remove(), 1400); }, 1300); }
  } else start();

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
