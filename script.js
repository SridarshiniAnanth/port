/* ============================================================
   Portfolio Script — Sridarshini A
   Features:
   - Nav shrink + active-link highlight on scroll
   - Scroll-reveal for sections
   - Animated stat counters
   ============================================================ */

/* ── 1. NAV: shrink on scroll + active section highlight ── */
const nav = document.getElementById('navbar');
const navLinks = document.querySelectorAll('.nav-links a');
const sections = document.querySelectorAll('section[id], div[id]');

function updateNav() {
  /* Shrink nav */
  if (window.scrollY > 60) {
    nav.classList.add('scrolled');
  } else {
    nav.classList.remove('scrolled');
  }

  /* Active link highlighting */
  let currentId = '';
  sections.forEach(section => {
    const top = section.offsetTop - 120;
    if (window.scrollY >= top) {
      currentId = section.getAttribute('id');
    }
  });

  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${currentId}`) {
      link.classList.add('active');
    }
  });
}

window.addEventListener('scroll', updateNav, { passive: true });
updateNav(); // run once on load


/* ── 2. SCROLL REVEAL ── */
const revealElements = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        /* Stagger children if multiple enter at once */
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, index * 80);
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
);

revealElements.forEach(el => revealObserver.observe(el));


/* ── 3. ANIMATED STAT COUNTERS ── */
function animateCounter(el, target, suffix = '', decimals = 0) {
  const duration = 1600;
  const start = performance.now();

  function step(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    /* Ease-out cubic */
    const eased = 1 - Math.pow(1 - progress, 3);
    const value = eased * target;

    el.textContent = decimals > 0
      ? value.toFixed(decimals) + suffix
      : Math.floor(value) + suffix;

    if (progress < 1) requestAnimationFrame(step);
    else el.textContent = decimals > 0
      ? target.toFixed(decimals) + suffix
      : target + suffix;
  }
  requestAnimationFrame(step);
}

const statNums = document.querySelectorAll('.stat-num');
let countersFired = false;

const statsObserver = new IntersectionObserver(
  (entries) => {
    if (entries[0].isIntersecting && !countersFired) {
      countersFired = true;
      statNums.forEach(el => {
        const raw = el.dataset.target || el.textContent.trim();
        const hasPlus = raw.endsWith('+');
        const suffix = hasPlus ? '+' : '';
        const num = parseFloat(raw);
        const decimals = (raw.includes('.') && !hasPlus) ? 2 : 0;
        /* Store original for re-use */
        el.dataset.target = raw;
        el.textContent = decimals > 0 ? '0.00' : '0' + suffix;
        animateCounter(el, num, suffix, decimals);
      });
      statsObserver.disconnect();
    }
  },
  { threshold: 0.5 }
);

const statsBar = document.querySelector('.stats-bar');
if (statsBar) statsObserver.observe(statsBar);


/* ── 4. SMOOTH SCROLL for nav links (fallback for older browsers) ── */
navLinks.forEach(link => {
  link.addEventListener('click', (e) => {
    const href = link.getAttribute('href');
    if (href.startsWith('#')) {
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  });
});
/* ── 5. CERTIFICATE LIGHTBOX ── */
const certCards = document.querySelectorAll('.cert-hover-trigger, .cert-card');
const lightbox = document.getElementById('cert-lightbox');
const lightboxImg = document.getElementById('lightbox-img');

if (certCards && lightbox && lightboxImg) {
  certCards.forEach(card => {
    card.addEventListener('mouseenter', () => {
      // Find the image source from the specific card
      let imgSrc = '';

      // For Experience/Internship card
      if (card.classList.contains('exp-card')) {
        imgSrc = 'internship.png';
      }
      // For Zscaler Certification
      else if (card.innerText.includes('Zscaler')) {
        imgSrc = 'global_cert.png';
      }
      // For Oracle Certification
      else if (card.innerText.includes('Oracle')) {
        imgSrc = 'Oracle.png';
      }

      if (imgSrc) {
        lightboxImg.src = imgSrc;
        lightbox.classList.add('active');
      }
    });

    card.addEventListener('mouseleave', () => {
      lightbox.classList.remove('active');
    });
  });
}
