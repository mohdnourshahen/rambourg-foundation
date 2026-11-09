/* Roycelysian — HTML templates shared by the browser (main.js) and the build (build.js). */
(function (root) {
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const IMG = (k, sm) => `assets/img/${k}${sm ? '-sm' : ''}.webp`;
  const url = p => `${p.slug}.html`;
  // responsive source: phones get the 1100px file, large screens the full-size one
  const IMGS = (k, sizes = '100vw') => `src="${IMG(k)}" srcset="${IMG(k, 1)} 1100w, ${IMG(k)} 2400w" sizes="${sizes}"`;

  const card = p => `<a class="card" href="${url(p)}">
      <div class="ph"><img src="${IMG(p.card || p.cover, 1)}" alt="${esc(p.name)}, ${esc(p.place)}" loading="lazy" width="1100" height="1375"></div>
      <div class="card-meta"><h3>${esc(p.name)}</h3><span class="label">${esc(p.place.split(',').pop().trim())}</span></div>
      <p>${esc(p.type)}</p></a>`;

  // first slide loads immediately; the rest wait for the page (main.js swaps data-* in after load)
  const heroSlides = D => D.hero.map((s, i) => i
    ? `<figure><img src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAAAAQABAAACAUwAOw==" data-${IMGS(s.img).replace(/ (srcset|sizes)=/g, ' data-$1=')} alt="${esc(s.caption)}, ${esc(s.place)}"></figure>`
    : `<figure class="on"><img ${IMGS(s.img)} alt="${esc(s.caption)}, ${esc(s.place)}" fetchpriority="high"></figure>`).join('');
  const heroDots = D => D.hero.map((_, i) => `<button class="${i ? '' : 'on'}" aria-label="Show slide ${i + 1}"></button>`).join('');
  const heroCap = s => `<span class="label dim">${esc(s.place)}</span><span class="serif">${esc(s.caption)}</span>`;

  const GIF = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAAAAQABAAACAUwAOw==';
  const slides = D => { const n = D.slides.length; return D.slides.map((s, i) => {
    const p = D.projects.find(x => x.slug === s.slug), role = p.brand ? 'Photography · Brand Identity' : p.scope[0];
    const alt = `${esc(p.name)}, ${esc(p.place)}`;
    const imgs = (s.imgs || [p.cover]).map((k, j) => (i === 0 && j === 0)
      ? `<img class="s-img is-on" ${IMGS(k)} fetchpriority="high" alt="${alt}">`
      : `<img class="s-img${j ? '' : ' is-on'}" src="${GIF}" data-${IMGS(k).replace(/ (srcset|sizes)=/g, ' data-$1=')} alt="${j ? '' : alt}">`).join('');
    return `<figure class="slide${i ? '' : ' is-on'}" data-i="${i}" role="group" aria-roledescription="slide" aria-label="${i + 1} of ${n}: ${esc(p.name)}">
      ${imgs}
      <div class="s-cap"><span class="label s-place">${String(i + 1).padStart(2, '0')} — ${esc(p.place)}</span>
        <h2 class="s-name">${esc(p.name)}</h2><p class="s-line">${esc(p.line)}</p>
        <div class="s-foot"><span class="label dim s-role">${esc(role)}</span><a class="btn ghost" href="${url(p)}"><span>View project</span><i></i></a></div></div></figure>`; }).join(''); };

  const rail = D => D.projects.map(card).join('') + '<span class="rail-end"></span>';
  const expList = D => D.expertise.map(e => `<article class="exp-col rv">
      <button class="exp-btn" type="button" aria-expanded="false" aria-controls="exp-${e.slug}">
        <span class="label dim">${e.n}</span><h3>${esc(e.name)}</h3><i class="exp-plus" aria-hidden="true"></i></button>
      <div class="exp-more" id="exp-${e.slug}"><div>
        <p>${esc(e.lead)}</p>
        <ul>${e.items.map(i => `<li>${esc(i)}</li>`).join('')}</ul></div></div></article>`).join('');

  const workList = D => D.projects.map((p, i) => `<a class="wl-item rv" href="${url(p)}">
      <div class="ph rv-img"><img ${IMGS(p.cover, '(max-width:1000px) 100vw, 66vw')} alt="${esc(p.name)}, ${esc(p.place)}" loading="lazy"></div>
      <div class="wl-t"><span class="label">0${i + 1} — ${esc(p.place)}</span><h2>${esc(p.name)}</h2><p>${esc(p.title)}.</p>
      <div class="scope">${p.scope.join(' · ')}</div><span class="btn ghost"><span>View project</span><i></i></span></div></a>`).join('');

  const fig = (g, cls = '', sm) => `<figure class="${cls} rv"><div class="ph rv-img"${g.r ? ` style="aspect-ratio:${g.r}"` : ''}><img ${sm ? `src="${IMG(g.img || g, 1)}"` : IMGS(g.img || g)} alt="${esc(g.alt || g.cap || '')}" loading="lazy"></div>${g.cap ? `<figcaption>${esc(g.cap)}</figcaption>` : ''}</figure>`;

  const brandBlock = p => { const b = p.brand; return `
    <section class="sec wrap dark zb">
      <div class="grid zb-head">
        <div class="zb-label rv"><span class="label dim">Brand Identity</span><span class="label">In collaboration with<br>${esc(b.partner)}</span></div>
        <div class="zb-intro"><h2 class="h2">${b.title}</h2>${b.text.map((t, i) => `<p class="rv${i ? ' d1' : ''}">${esc(t)}</p>`).join('')}</div>
      </div>
      ${b.lead ? fig(b.lead, 'zb-lead') : ''}
      ${b.pair ? `<div class="zb-pair">${b.pair.map(g => fig(g, '', 1)).join('')}</div>` : ''}
      ${b.palette ? `<div class="grid zb-pal">
        <div class="zb-pal-t rv"><span class="label dim">Palette</span><p>${esc(b.paletteText)}</p></div>
        <div class="zb-sw" style="grid-template-columns:repeat(${b.palette.length},1fr)">${b.palette.map((c, i) => `<div class="rv" style="transition-delay:${i * 70}ms"><i style="background:${c}"></i><span class="label">${c}</span></div>`).join('')}</div>
      </div>` : ''}
      ${b.textures ? `<div class="zb-tex">${b.textures.map(t => fig({ img: t, alt: `${p.name} brand mark on textured paper` }, '', 1)).join('')}</div>` : ''}
      ${b.craft ? fig(b.craft, 'zb-lead') : ''}
      ${b.objects ? `<div class="zb-pair">${b.objects.map(g => fig(g, '', 1)).join('')}</div>` : ''}
      ${b.extra ? fig(b.extra, 'zb-extra') : ''}
      <div class="zb-cred rv">
        ${b.credits.map(c => `<div><span class="label dim">${esc(c[0])}</span><p>${esc(c[1])}</p></div>`).join('')}
        <a class="btn ghost" href="${b.link}" target="_blank" rel="noopener"><span>Full identity case</span><i></i></a>
      </div>
    </section>
    ${b.close ? `<section class="zb-close"><img ${IMGS(b.close.img)} alt="${esc(b.close.cap)}" loading="lazy"></section>` : ''}`; };

  const project = (D, p) => {
    const i = D.projects.indexOf(p), nx = D.projects[(i + 1) % D.projects.length];
    return `
    <section class="phero"><img ${IMGS(p.cover)} alt="${esc(p.name)}, ${esc(p.place)}" fetchpriority="high">
      <div class="phero-in"><div><span class="label">${esc(p.place)} — ${esc(p.type)}</span><h1 class="display">${esc(p.name)}</h1></div>
      <div class="phero-meta"><p class="serif" style="font-size:22px;line-height:1.3">${esc(p.line)}</p></div></div></section>
    <section class="sec wrap"><div class="grid">
      <div style="grid-column:1/4" class="rv"><span class="label">The project</span></div>
      <div style="grid-column:4/13" class="intro-text-pj">
        <h2 class="statement rv">${esc(p.title)}</h2>
        <p class="lead rv d1" style="margin-top:36px">${esc(p.intro)}</p>
        <div class="pj-meta rv d2"><div><span class="label">Location</span><p>${esc(p.place)}</p></div>${p.client ? `<div><span class="label">Client</span><p>${esc(p.client)}</p></div>` : ''}<div><span class="label">Sector</span><p>${esc(p.type)}</p></div><div><span class="label">Our role</span><p>${p.scope.join('<br>')}</p></div></div>
      </div></div></section>
    ${p.gallery.length ? `<section class="wrap" style="padding-bottom:clamp(96px,14vw,200px)"><div class="pj-gal">${p.gallery.map(g => `<figure class="ph rv-img ${g.f}"><img ${IMGS(g.img, g.f === 'wide' ? '100vw' : '(max-width:720px) 100vw, 50vw')} alt="${esc(g.alt || p.name + ', ' + p.place)}" loading="lazy"></figure>`).join('')}</div></section>` : ''}
    ${p.brand ? brandBlock(p) : ''}
    <a class="pj-next" href="${url(nx)}"><img ${IMGS(nx.cover)} alt="" loading="lazy">
      <div><span class="label">Next project</span><span class="display" style="font-size:clamp(40px,6vw,96px)">${esc(nx.name)}</span><span class="label dim">${esc(nx.place)}</span></div></a>`;
  };

  root.RYR = { esc, IMG, IMGS, url, slides, card, heroSlides, heroDots, heroCap, rail, expList, workList, project };
})(typeof window !== 'undefined' ? window : globalThis);
