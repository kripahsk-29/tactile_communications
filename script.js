(function () {
  const root = document.documentElement;
  root.classList.add('js');

  const store = {
    get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }
  };

  /* ---------- Text size: normal → large → extra large ---------- */
  const sizes = ['normal', 'lg', 'xl'];
  const sizeLabels = { normal: 'normal', lg: 'large', xl: 'extra large' };
  const sizeBtn = document.getElementById('text-size');

  function applySize(size) {
    if (size === 'normal') root.removeAttribute('data-text');
    else root.setAttribute('data-text', size);
    sizeBtn.setAttribute('aria-label', 'Text size: ' + sizeLabels[size] + '. Activate to change.');
  }
  let size = sizes.includes(store.get('text-size')) ? store.get('text-size') : 'normal';
  applySize(size);
  sizeBtn.addEventListener('click', () => {
    size = sizes[(sizes.indexOf(size) + 1) % sizes.length];
    applySize(size);
    store.set('text-size', size);
  });

  /* ---------- Dark / high-contrast mode ---------- */
  const themeBtn = document.getElementById('theme-toggle');
  function applyTheme(dark) {
    if (dark) root.setAttribute('data-theme', 'dark');
    else root.removeAttribute('data-theme');
    themeBtn.setAttribute('aria-pressed', String(dark));
  }
  applyTheme(store.get('theme') === 'dark');
  themeBtn.addEventListener('click', () => {
    const dark = root.getAttribute('data-theme') !== 'dark';
    applyTheme(dark);
    store.set('theme', dark ? 'dark' : 'light');
  });

  /* ---------- Header border on scroll ---------- */
  const header = document.querySelector('.site-header');
  const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 8);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Reveal on scroll ---------- */
  const reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    reveals.forEach((el) => io.observe(el));
  } else {
    reveals.forEach((el) => el.classList.add('in'));
  }

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Process video ----------
     Plays muted only while on screen; never autoplays with reduced motion. */
  document.querySelectorAll('.stamp-video').forEach((wrap) => {
    const video = wrap.querySelector('video');
    const btn = wrap.querySelector('.video-toggle');
    let userPaused = reduceMotion;

    const sync = () => {
      const playing = !video.paused;
      btn.dataset.playing = String(playing);
      btn.setAttribute('aria-label', playing ? 'Pause video' : 'Play video');
    };
    video.addEventListener('play', sync);
    video.addEventListener('pause', sync);

    btn.addEventListener('click', () => {
      if (video.paused) { userPaused = false; video.play().catch(() => {}); }
      else { userPaused = true; video.pause(); }
    });

    if ('IntersectionObserver' in window) {
      new IntersectionObserver((entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting && !userPaused) video.play().catch(() => {});
          else if (!e.isIntersecting) video.pause();
        });
      }, { threshold: 0.4 }).observe(video);
    }
  });

  /* ---------- Partners slideshow ---------- */
  document.querySelectorAll('.partners-slides').forEach((show) => {
    const track = show.querySelector('.slides-track');
    const slides = [...show.querySelectorAll('.slide')];
    const dots = [...show.querySelectorAll('.dot')];
    let index = 0;

    const go = (i) => {
      index = (i + slides.length) % slides.length;
      track.style.transform = 'translateX(' + (-index * 100) + '%)';
      slides.forEach((s, n) => {
        const active = n === index;
        s.setAttribute('aria-hidden', String(!active));
        s.inert = !active;
      });
      dots.forEach((d, n) => d.setAttribute('aria-current', String(n === index)));
    };

    show.querySelectorAll('.slide-btn').forEach((b) =>
      b.addEventListener('click', () => go(index + Number(b.dataset.dir))));
    dots.forEach((d, n) => d.addEventListener('click', () => go(n)));

    show.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight') go(index + 1);
      if (e.key === 'ArrowLeft') go(index - 1);
    });

    // Swipe on touch screens
    const viewport = show.querySelector('.slides-viewport');
    let startX = null;
    viewport.addEventListener('pointerdown', (e) => { startX = e.clientX; });
    viewport.addEventListener('pointerup', (e) => {
      if (startX === null) return;
      const dx = e.clientX - startX;
      if (Math.abs(dx) > 40) go(index + (dx < 0 ? 1 : -1));
      startX = null;
    });

    go(0);
  });

  /* ---------- Gallery detail view ----------
     Fill in descriptions and images here as artwork is added. */
  const items = [
    { group: 'Textile', title: 'Chicken Little', artist: 'Nellie Mae Rowe', materials: 'Needle felting (fiber, felt sheet)', desc: '',
      photos: [
        { src: 'images/chicken-little.jpg', alt: 'Needle-felted tactile on purple felt: a light blue bird holding an orange shape with a small white animal inside, beside a green plant stem.' }
      ] },
    { group: 'Textile', title: 'Hand Embroidery Swatches', materials: 'Felt sheet, embroidery floss', desc: '',
      photos: [
        { src: 'images/embroidery-swatches.jpg', alt: 'Pink felt swatch with stitched lines, French knots, small stars, purple felted shapes, and blue felt cutouts outlined in red stitching.' }
      ] },
    { group: 'Swell', title: 'LUAG Map Variants', materials: 'Swell Machine, used at different gradients', desc: '',
      photos: [
        { src: 'images/luag-map-swell.jpg', alt: 'Two swell paper versions of the LUAG Lower Gallery map, stacked, each with raised walls, a key, and braille labels.' }
      ] },
    { group: '3D', title: '3D Frog', materials: '3D filament', desc: '', photos: [] },
    { group: 'What We Carry', title: 'Every Cotton Ball is a Moment of Pain', artist: 'Gary Graves', materials: 'Swell paper and embroidery', desc: '',
      photos: [
        { src: 'images/cotton-ball-swell.jpg', label: 'Swell Paper', alt: 'Four swell paper prints of a standing figure in a doorway, each with a different amount of raised texture.' },
        { src: 'images/cotton-ball-embroidery.jpg', label: 'Embroidery', alt: 'Felt tactile of a standing figure made of raised white cotton-like bumps, in a dark doorway, with a stitched floor and frame.' }
      ] },
    { group: 'What We Carry', title: 'Head of Man', artist: 'Leonard Baskin', materials: 'Swell Paper, two different gradients', desc: '',
      photos: [
        { src: 'images/head-of-man-swell.jpg', alt: 'Two swell paper prints of a large rounded head side by side, made at two different gradients.' }
      ] }
  ];

  const dialog = document.getElementById('detail');
  const $ = (id) => document.getElementById(id);
  let opener = null;

  document.querySelectorAll('.card').forEach((card) => {
    card.addEventListener('click', () => {
      const item = items[Number(card.dataset.item)];
      $('detail-group').textContent = item.group;
      $('detail-title').textContent = item.artist ? item.title + ' (after ' + item.artist + ')' : item.title;
      $('detail-materials').textContent = 'Materials: ' + item.materials;
      $('detail-desc').textContent = item.desc || 'Description coming soon.';

      const art = $('detail-art');
      art.replaceChildren();
      art.className = 'detail-art';
      if (item.photos.length) {
        art.classList.add('has-photos', 'count-' + item.photos.length);
        item.photos.forEach((p) => {
          const fig = document.createElement('figure');
          fig.className = 'detail-photo';
          const img = document.createElement('img');
          img.src = p.src;
          img.alt = p.alt;
          fig.append(img);
          if (p.label) {
            const cap = document.createElement('figcaption');
            cap.textContent = p.label;
            fig.append(cap);
          }
          art.append(fig);
        });
      }
      opener = card;
      dialog.showModal();
    });
  });

  dialog.querySelector('.detail-close').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', (e) => { if (e.target === dialog) dialog.close(); });
  dialog.addEventListener('close', () => { if (opener) opener.focus(); });
})();
