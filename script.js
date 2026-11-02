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

  /* ---------- Gallery detail view ----------
     Fill in descriptions and images here as artwork is added. */
  const items = [
    { group: 'Textile', title: 'Chicken Little', artist: 'Nellie Mae Rowe', materials: 'Needle felting (fiber, felt sheet)', desc: '' },
    { group: 'Textile', title: 'Hand Embroidery Swatches', materials: 'Felt sheet, embroidery floss', desc: '' },
    { group: 'Swell', title: 'LUAG Map Variants', materials: 'Swell paper', desc: '' },
    { group: '3D', title: '3D Frog', materials: '3D filament', desc: '' },
    { group: 'What We Carry', title: 'Every Cotton Ball is a Moment of Pain', artist: 'Gary Graves', materials: 'Needle felting, embroidery floss', desc: '' },
    { group: 'What We Carry', title: 'Head of Man', artist: 'Leonard Baskin', materials: 'Muslin, thread, embroidery machine', desc: '' }
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
      $('detail-desc').textContent = item.desc || 'Photos and description coming soon.';
      opener = card;
      dialog.showModal();
    });
  });

  dialog.querySelector('.detail-close').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', (e) => { if (e.target === dialog) dialog.close(); });
  dialog.addEventListener('close', () => { if (opener) opener.focus(); });
})();
