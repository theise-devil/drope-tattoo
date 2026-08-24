/* ============================================================
   CONFIG
============================================================ */
const CONFIG = {
  whatsapp: '5521966805080',
  instagram: 'https://www.instagram.com/drope.tattoo777/',
  instagramHandle: '@drope.tattoo777',
  manifestUrl: 'images/manifest.json',
  // DROPE SOUND: informe aqui um arquivo de áudio ou URL quando estiver disponível.
  // Ex.: 'public/audio/drope-sound.mp3'. O site nunca inicia o áudio sozinho.
  audioSrc: '',
};

/* ============================================================
   UTILITÁRIOS
============================================================ */
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

/* ============================================================
   ANO DO RODAPÉ
============================================================ */
const yearEl = $('#year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

/* ============================================================
   DROPE SOUND — player nativo, sem autoplay e sem áudio artificial
============================================================ */
function initDropeSound() {
  const audio = $('#dropeSoundAudio');
  const play = $('#soundPlay');
  const volume = $('#soundVolume');
  const status = $('#soundStatus');
  const time = $('#soundTime');
  const note = $('#soundNote');
  if (!audio || !play || !volume) return;

  if (!CONFIG.audioSrc) return;

  audio.src = CONFIG.audioSrc;
  audio.volume = Number(volume.value) / 100;
  play.disabled = false;
  volume.disabled = false;
  if (note) note.textContent = 'PRONTO PARA TOCAR';

  play.addEventListener('click', async () => {
    if (audio.paused) await audio.play();
    else audio.pause();
  });
  volume.addEventListener('input', () => { audio.volume = Number(volume.value) / 100; });
  audio.addEventListener('play', () => {
    play.textContent = '⏸ PAUSE';
    if (status) status.textContent = 'SOUND ON';
  });
  audio.addEventListener('pause', () => {
    play.textContent = '▶ PLAY';
    if (status) status.textContent = 'SOUND OFF';
  });
  audio.addEventListener('timeupdate', () => {
    if (!time) return;
    const seconds = Math.floor(audio.currentTime || 0);
    time.textContent = `${String(Math.floor(seconds / 60)).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`;
  });
}

/* ============================================================
   NAVEGAÇÃO — STICKY + MOBILE
============================================================ */
const nav = $('#nav');
const navToggle = $('#navToggle');
const navLinks = $('#navLinks');

window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 60);
}, { passive: true });

navToggle.addEventListener('click', () => {
  const open = navToggle.classList.toggle('open');
  navLinks.classList.toggle('open', open);
  navToggle.setAttribute('aria-expanded', String(open));
});

$$('.nav__links a').forEach(link => {
  link.addEventListener('click', () => {
    navToggle.classList.remove('open');
    navLinks.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
  });
});

/* ============================================================
   HERO — ANIMAÇÕES DE ENTRADA
============================================================ */
function initHero() {
  const heroEls = [
    '.hero__eyebrow',
    '.hero__title-line',
    '.hero__meta',
    '.hero__ctas',
    '.hero__bottom',
  ];
  heroEls.forEach((sel, i) => {
    $$(sel).forEach((el, j) => {
      setTimeout(() => el.classList.add('visible'), 80 + i * 160 + j * 120);
    });
  });
}

/* ============================================================
   PARALLAX SUTIL NO HERO
============================================================ */
const heroBgImg = $('.hero__bg img');
if (heroBgImg && window.matchMedia('(min-width: 768px)').matches) {
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    if (y < window.innerHeight) {
      heroBgImg.style.transform = `translateY(${y * 0.28}px)`;
    }
  }, { passive: true });
}

/* ============================================================
   SCROLL REVEAL
============================================================ */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const siblings = $$('.reveal', entry.target.parentElement);
      const idx = siblings.indexOf(entry.target);
      entry.target.style.transitionDelay = `${idx * 80}ms`;
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

$$('.reveal').forEach(el => revealObserver.observe(el));

/* ============================================================
   CONTADOR DE NÚMEROS
============================================================ */
function animateCounter(el) {
  const target = parseInt(el.dataset.target, 10);
  if (!target || target === 0) return;
  const duration = 1800;
  const step = 16;
  const increment = target / (duration / step);
  let current = 0;
  const timer = setInterval(() => {
    current += increment;
    if (current >= target) { el.textContent = target; clearInterval(timer); }
    else el.textContent = Math.floor(current);
  }, step);
}

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCounter(entry.target);
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

$$('.numeros__value').forEach(el => counterObserver.observe(el));

/* ============================================================
   LIGHTBOX
============================================================ */
const lightbox = $('#lightbox');
const lightboxImg = $('#lightboxImg');
const lightboxClose = $('#lightboxClose');
const lightboxPrev = $('#lightboxPrev');
const lightboxNext = $('#lightboxNext');
let currentImages = [];
let currentIndex = 0;

function openLightbox(images, index) {
  currentImages = images;
  currentIndex = index;
  showLightboxImage();
  lightbox.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  lightbox.classList.remove('open');
  document.body.style.overflow = '';
}

function showLightboxImage() {
  const img = currentImages[currentIndex];
  lightboxImg.src = img.src;
  lightboxImg.alt = img.alt;
  lightboxPrev.style.display = currentImages.length > 1 ? 'flex' : 'none';
  lightboxNext.style.display = currentImages.length > 1 ? 'flex' : 'none';
  const counter = $('#lightboxCounter');
  if (counter) counter.textContent = `${currentIndex + 1} / ${currentImages.length}`;
}

lightboxClose.addEventListener('click', closeLightbox);
lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });
lightboxPrev.addEventListener('click', e => {
  e.stopPropagation();
  currentIndex = (currentIndex - 1 + currentImages.length) % currentImages.length;
  showLightboxImage();
});
lightboxNext.addEventListener('click', e => {
  e.stopPropagation();
  currentIndex = (currentIndex + 1) % currentImages.length;
  showLightboxImage();
});
document.addEventListener('keydown', e => {
  if (!lightbox.classList.contains('open')) return;
  if (e.key === 'Escape') closeLightbox();
  if (e.key === 'ArrowLeft') lightboxPrev.click();
  if (e.key === 'ArrowRight') lightboxNext.click();
});

// Touch swipe no lightbox
let touchStartX = 0;
lightbox.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
lightbox.addEventListener('touchend', e => {
  const diff = touchStartX - e.changedTouches[0].clientX;
  if (Math.abs(diff) > 50) {
    if (diff > 0) lightboxNext.click();
    else lightboxPrev.click();
  }
}, { passive: true });

/* ============================================================
   FILTROS + CLIQUE NO PORTFÓLIO
============================================================ */
function initPortfolio() {
  const filters = $$('.filter');
  const items = $$('.portfolio__item');

  filters.forEach(btn => {
    btn.addEventListener('click', () => {
      filters.forEach(f => f.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;
      items.forEach(item => {
        const shouldShow = filter === 'all' || item.dataset.category === filter;
        if (shouldShow) {
          item.classList.remove('hidden', 'portfolio__item--out');
          item.classList.add('portfolio__item--in');
          setTimeout(() => item.classList.remove('portfolio__item--in'), 180);
        } else if (!item.classList.contains('hidden')) {
          item.classList.add('portfolio__item--out');
          setTimeout(() => {
            if (btn.classList.contains('active') && filter !== 'all' && item.dataset.category !== filter) {
              item.classList.add('hidden');
            }
            item.classList.remove('portfolio__item--out');
          }, 160);
        }
      });
    });
  });

  items.forEach(item => {
    item.addEventListener('click', () => {
      const visible = $$('.portfolio__item').filter(i => !i.classList.contains('hidden'));
      const images = visible.map(i => i.querySelector('img'));
      const clicked = item.querySelector('img');
      const idx = images.indexOf(clicked);
      openLightbox(images, idx >= 0 ? idx : 0);
    });
  });
}

/* ============================================================
   CARREGAMENTO DINÂMICO VIA MANIFEST
============================================================ */
async function loadImagesFromManifest() {
  try {
    const res = await fetch(CONFIG.manifestUrl);
    if (!res.ok) throw new Error('manifest not found');
    const manifest = await res.json();

    // PORTFÓLIO
    const grid = $('#portfolioGrid');
    if (grid && manifest.portfolio && manifest.portfolio.length > 0) {
      grid.innerHTML = '';
      manifest.portfolio.forEach(item => {
        const div = document.createElement('div');
        div.className = 'portfolio__item';
        div.dataset.category = item.category;
        div.dataset.type = item.type;
        div.innerHTML = `
          <img src="${item.image}" alt="${item.title} — Drope Tattoo" loading="lazy" decoding="async" />
          <div class="portfolio__item-overlay"><span>${item.title}</span></div>
        `;
        grid.appendChild(div);
      });
    }

    // INSTAGRAM GRID
    const igGrid = $('#instagramGrid');
    if (igGrid && manifest.instagram && manifest.instagram.length > 0) {
      igGrid.innerHTML = '';
      manifest.instagram.forEach(src => {
        const div = document.createElement('div');
        div.className = 'instagram__item';
        div.innerHTML = `<img src="${src}" alt="Drope Tattoo — Instagram" loading="lazy" />`;
        igGrid.appendChild(div);
      });
    }

  } catch (e) {
    // Manifest não encontrado — grid fica vazio
  } finally {
    initPortfolio();
  }
}

/* ============================================================
   FORMULÁRIO DE ORÇAMENTO → WHATSAPP
============================================================ */
const orcamentoForm = $('#orcamentoForm');
if (orcamentoForm) {
  orcamentoForm.addEventListener('submit', e => {
    e.preventDefault();
    const nome      = $('#f-nome').value.trim();
    const whatsapp  = $('#f-whatsapp').value.trim();
    const instagram = $('#f-instagram').value.trim();
    const ideia     = $('#f-ideia').value.trim();
    const local     = $('#f-local').value.trim();
    const tamanho   = $('#f-tamanho').value.trim();
    const estilo    = $('#f-estilo').value.trim();
    const ref       = $('#f-referencia').value.trim();

    if (!nome || !whatsapp || !ideia || !local) {
      alert('Preencha os campos obrigatórios: nome, WhatsApp, ideia e local do corpo.');
      return;
    }

    const linhas = [
      `Olá, Drope! Quero fazer um orçamento para uma tatuagem.`,
      ``,
      `*Nome:* ${nome}`,
      whatsapp  ? `*WhatsApp:* ${whatsapp}`   : null,
      instagram ? `*Instagram:* ${instagram}` : null,
      ``,
      `*Ideia:* ${ideia}`,
      `*Local do corpo:* ${local}`,
      tamanho   ? `*Tamanho:* ${tamanho}`     : null,
      estilo    ? `*Estilo:* ${estilo}`        : null,
      ref       ? `*Referência:* ${ref}`       : null,
      ``,
      `Gostaria de saber disponibilidade e valores. Obrigado!`,
    ].filter(l => l !== null).join('\n');

    window.open(`https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(linhas)}`, '_blank', 'noopener');
  });
}

/* ============================================================
   SCROLL SUAVE PARA ÂNCORAS
============================================================ */
$$('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    const target = $(anchor.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const top = target.getBoundingClientRect().top + window.scrollY - nav.offsetHeight;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

/* ============================================================
   INICIALIZAÇÃO
============================================================ */
initHero();
initDropeSound();
loadImagesFromManifest();
