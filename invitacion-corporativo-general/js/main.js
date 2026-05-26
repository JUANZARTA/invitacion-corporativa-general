/* ============================================================
   CONFIGURACIÓN
   ============================================================ */
const EVENT = {
  name:       'Summit Tech 2026',
  company:    'TechCorp Colombia',
  phone:      '573128622945',
  eventDate:  new Date('2026-12-06T08:00:00'),
};

document.title = `${EVENT.name} · ${EVENT.company}`;

/* ============================================================
   HERO — DÍAS RESTANTES
   ============================================================ */
(function updateDaysRemaining() {
  const el = document.getElementById('hero-days-remaining');
  if (!el) return;
  const diff = EVENT.eventDate - Date.now();
  if (diff <= 0) {
    el.textContent = '';
    el.closest('.hero-badge').textContent = '¡Hoy es el evento!';
    return;
  }
  el.textContent = Math.ceil(diff / 86400000) + ' ';
})();

/* ============================================================
   CANVAS — RED DE PARTÍCULAS (NETWORKING)
   ============================================================ */
(function () {
  const canvas = document.getElementById('network-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');

  function resize() {
    canvas.width  = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  }
  resize();
  window.addEventListener('resize', resize, { passive: true });

  const NODE_COUNT      = 60;
  const MAX_DIST        = 140;
  const NODE_COLOR      = '#00BCD4';
  const LINE_COLOR_BASE = '0, 188, 212';
  const SPEED           = 0.35;

  class Node {
    constructor() { this.reset(true); }

    reset(randomY = false) {
      this.x  = Math.random() * canvas.width;
      this.y  = randomY ? Math.random() * canvas.height : Math.random() * canvas.height;
      this.vx = (Math.random() - 0.5) * SPEED;
      this.vy = (Math.random() - 0.5) * SPEED;
      this.r  = Math.random() * 1.8 + 0.8;
      this.alpha = Math.random() * 0.55 + 0.3;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      if (this.x < 0 || this.x > canvas.width)  this.vx *= -1;
      if (this.y < 0 || this.y > canvas.height)  this.vy *= -1;

      this.x = Math.max(0, Math.min(canvas.width,  this.x));
      this.y = Math.max(0, Math.min(canvas.height, this.y));
    }

    draw() {
      ctx.save();
      ctx.globalAlpha = this.alpha;
      ctx.shadowBlur  = 8;
      ctx.shadowColor = NODE_COLOR;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = NODE_COLOR;
      ctx.fill();
      ctx.restore();
    }
  }

  const nodes = Array.from({ length: NODE_COUNT }, () => new Node());

  function drawLines() {
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx   = nodes[i].x - nodes[j].x;
        const dy   = nodes[i].y - nodes[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < MAX_DIST) {
          const opacity = (1 - dist / MAX_DIST) * 0.25;
          ctx.save();
          ctx.globalAlpha = opacity;
          ctx.strokeStyle = `rgb(${LINE_COLOR_BASE})`;
          ctx.lineWidth   = 0.8;
          ctx.beginPath();
          ctx.moveTo(nodes[i].x, nodes[i].y);
          ctx.lineTo(nodes[j].x, nodes[j].y);
          ctx.stroke();
          ctx.restore();
        }
      }
    }
  }

  function loop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    nodes.forEach(n => { n.update(); n.draw(); });
    drawLines();
    requestAnimationFrame(loop);
  }

  loop();
})();

/* ============================================================
   NAVBAR
   ============================================================ */
const navbar    = document.getElementById('navbar');
const hamburger = document.getElementById('nav-hamburger');
const drawer    = document.getElementById('nav-drawer');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
}, { passive: true });

if (hamburger && drawer) {
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    drawer.classList.toggle('open');
    document.body.style.overflow = drawer.classList.contains('open') ? 'hidden' : '';
  });

  drawer.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      hamburger.classList.remove('open');
      drawer.classList.remove('open');
      document.body.style.overflow = '';
    });
  });
}

/* ── Active nav link on scroll ── */
(function () {
  const sections = document.querySelectorAll('section[id]');
  const links    = document.querySelectorAll('.nav-links a, .nav-drawer a');

  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        links.forEach(l => l.classList.remove('active'));
        links.forEach(l => {
          if (l.getAttribute('href') === '#' + e.target.id) {
            l.classList.add('active');
          }
        });
      }
    });
  }, { threshold: 0.4 });

  sections.forEach(s => io.observe(s));
})();

/* ============================================================
   SCROLL REVEAL
   ============================================================ */
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      revealObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

/* ============================================================
   GALLERY LIGHTBOX
   ============================================================ */
const GALLERY_SRCS = [
  'Fotos/img (1).png',
  'Fotos/img (2).png',
  'Fotos/img (3).png',
  'Fotos/img (4).png',
];

let lbIndex    = 0;
const lightbox = document.getElementById('lightbox');
const lbImg    = document.getElementById('lb-img');

function openLightbox(idx) {
  lbIndex   = ((idx % GALLERY_SRCS.length) + GALLERY_SRCS.length) % GALLERY_SRCS.length;
  lbImg.src = GALLERY_SRCS[lbIndex];
  lightbox.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  lightbox.classList.remove('active');
  document.body.style.overflow = '';
}

document.querySelectorAll('.gallery-item').forEach((item, i) => {
  item.addEventListener('click', () => openLightbox(i));
});

if (lightbox) {
  document.getElementById('lb-close').addEventListener('click', closeLightbox);
  document.getElementById('lb-prev').addEventListener('click', () => openLightbox(lbIndex - 1));
  document.getElementById('lb-next').addEventListener('click', () => openLightbox(lbIndex + 1));
  lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });
}

document.addEventListener('keydown', e => {
  if (!lightbox || !lightbox.classList.contains('active')) return;
  if (e.key === 'Escape')     closeLightbox();
  if (e.key === 'ArrowLeft')  openLightbox(lbIndex - 1);
  if (e.key === 'ArrowRight') openLightbox(lbIndex + 1);
});

/* ============================================================
   MODAL DRESS CODE
   ============================================================ */
const dressModal     = document.getElementById('dresscode-modal');
const btnDresscode   = document.getElementById('btn-dresscode');
const btnDressClose  = document.getElementById('dresscode-modal-close');

function openDressModal() {
  if (!dressModal) return;
  dressModal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeDressModal() {
  if (!dressModal) return;
  dressModal.classList.remove('active');
  document.body.style.overflow = '';
}

if (btnDresscode)  btnDresscode.addEventListener('click', openDressModal);
if (btnDressClose) btnDressClose.addEventListener('click', closeDressModal);
if (dressModal)    dressModal.addEventListener('click', e => { if (e.target === dressModal) closeDressModal(); });

document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && dressModal && dressModal.classList.contains('active')) {
    closeDressModal();
  }
});

/* ============================================================
   SMOOTH SCROLL
   ============================================================ */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    window.scrollTo({
      top: target.getBoundingClientRect().top + window.scrollY - 72,
      behavior: 'smooth'
    });
  });
});
