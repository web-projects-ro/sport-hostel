'use strict';

const scrollProgress = document.querySelector('.scroll-progress');
const backToTopBtn = document.getElementById('backToTop');
const stickyCta = document.querySelector('.mobile-sticky-cta');
const primaryCtas = document.querySelectorAll('.btn-primary, .btn-room, .tab-btn, .mobile-sticky-cta');
const galleryTrack = document.querySelector('.galerie-grid');
let ticking = false;

const updateScrollUI = () => {
  const scrollTop = window.scrollY;
  const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
  const progress = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;

  if (scrollProgress) {
    scrollProgress.style.width = `${progress}%`;
  }

  if (backToTopBtn) {
    backToTopBtn.classList.toggle('show', scrollTop > 420);
  }

  if (stickyCta && window.innerWidth <= 768) {
    stickyCta.classList.toggle('show', scrollTop > 260);
  } else if (stickyCta) {
    stickyCta.classList.remove('show');
  }
};

const onScroll = () => {
  if (!ticking) {
    window.requestAnimationFrame(() => {
      navbar.classList.toggle('scrolled', window.scrollY > 60);
      updateScrollUI();
      ticking = false;
    });
    ticking = true;
  }
};

/* ===== NAV SCROLL ===== */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', onScroll, { passive: true });

window.addEventListener('resize', updateScrollUI, { passive: true });
updateScrollUI();

/* ===== GALLERY AUTOPLAY (mobile) ===== */
if (galleryTrack) {
  let autoSlideTimer;
  let currentGalleryIdx = 0;
  let userTouching = false;

  const galleryCells = () => Array.from(galleryTrack.querySelectorAll('.galerie-cell'));

  const scrollToCell = (idx) => {
    const cells = galleryCells();
    if (!cells.length) return;
    currentGalleryIdx = ((idx % cells.length) + cells.length) % cells.length;
    galleryTrack.scrollTo({ left: cells[currentGalleryIdx].offsetLeft, behavior: 'smooth' });
  };

  const startGalleryAutoplay = () => {
    if (window.innerWidth > 768) return;
    clearInterval(autoSlideTimer);
    autoSlideTimer = setInterval(() => {
      if (!userTouching) scrollToCell(currentGalleryIdx + 1);
    }, 3500);
  };

  galleryTrack.addEventListener('touchstart', () => {
    userTouching = true;
    clearInterval(autoSlideTimer);
  }, { passive: true });

  galleryTrack.addEventListener('touchend', () => {
    userTouching = false;
    clearTimeout(autoSlideTimer);
    window.setTimeout(startGalleryAutoplay, 4000);
  }, { passive: true });

  const galerieSec = document.getElementById('galerie');
  if (galerieSec) {
    new IntersectionObserver((entries, obs) => {
      if (entries[0].isIntersecting && window.innerWidth <= 768) {
        window.setTimeout(() => {
          galleryTrack.scrollBy({ left: 44, behavior: 'smooth' });
          window.setTimeout(() => {
            galleryTrack.scrollBy({ left: -44, behavior: 'smooth' });
            window.setTimeout(startGalleryAutoplay, 700);
          }, 360);
        }, 900);
        obs.disconnect();
      }
    }, { threshold: 0.35 }).observe(galerieSec);
  }
}

/* ===== MOBILE MENU ===== */
const hamburger = document.getElementById('hamburgerBtn');
const mobileMenu = document.getElementById('mobileMenu');
const mobileClose = document.getElementById('mobileClose');

if(hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      mobileMenu.classList.add('open');
      document.body.style.overflow = 'hidden';
    });
    const closeMobile = () => {
      mobileMenu.classList.remove('open');
      document.body.style.overflow = '';
    };
    mobileClose.addEventListener('click', closeMobile);
    document.querySelectorAll('.mobile-link').forEach(l => l.addEventListener('click', closeMobile));
}

/* ===== SCROLL REVEAL ===== */
const revealObs = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');

      if (e.target.classList.contains('room-card')) {
        e.target.classList.add('in-view');
      }

      if (e.target.classList.contains('galerie-cell')) {
        e.target.classList.add('in-view');
      }

      revealObs.unobserve(e.target);
    }
  });
}, { threshold: 0.1 });
document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));

document.querySelectorAll('.room-card, .galerie-cell').forEach(el => revealObs.observe(el));

/* ===== ACTIVE NAV LINK ===== */
const navLinksAll = document.querySelectorAll('.nav-links a');
const activeObs = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      navLinksAll.forEach(a => {
        a.style.color = a.getAttribute('href') === '#' + e.target.id
          ? 'var(--gold)'
          : '';
      });
    }
  });
}, { threshold: 0.4 });
document.querySelectorAll('section[id]').forEach(s => activeObs.observe(s));

/* ===== REVIEWS TABS LOGIC ===== */
const tabBtns = document.querySelectorAll('.tab-btn');
const reviewContents = document.querySelectorAll('.review-content');

tabBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    // 1. Ștergem clasa 'active' de pe toate butoanele și secțiunile
    tabBtns.forEach(b => b.classList.remove('active'));
    reviewContents.forEach(c => c.classList.remove('active'));

    // 2. Punem clasa 'active' pe butonul apăsat
    btn.classList.add('active');
    
    // 3. Afișăm secțiunea corespunzătoare
    const targetId = btn.getAttribute('data-target');
    document.getElementById(targetId).classList.add('active');
  });
});

if (backToTopBtn) {
  backToTopBtn.addEventListener('click', () => {
    backToTopBtn.classList.add('spinning');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    window.setTimeout(() => backToTopBtn.classList.remove('spinning'), 420);
  });
}

primaryCtas.forEach((btn) => {
  btn.addEventListener('pointerdown', () => {
    btn.classList.add('tap-pop');
    window.setTimeout(() => btn.classList.remove('tap-pop'), 230);

    if (btn.classList.contains('btn-primary')) {
      btn.classList.add('is-shimmering');
      window.setTimeout(() => btn.classList.remove('is-shimmering'), 980);
    }
  }, { passive: true });
});

const countUp = (el) => {
  const target = parseFloat(el.dataset.count || '0');
  const decimal = Number.isInteger(target) ? 0 : 1;
  const duration = 1200;
  const startTime = performance.now();

  const animate = (now) => {
    const progress = Math.min((now - startTime) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = target * eased;
    el.textContent = current.toFixed(decimal);

    if (progress < 1) {
      requestAnimationFrame(animate);
    } else {
      el.textContent = target.toFixed(decimal);
    }
  };

  requestAnimationFrame(animate);
};

const stats = document.querySelectorAll('.hero-stat-value[data-count]');
if (stats.length) {
  const statsObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        countUp(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.8 });

  stats.forEach((stat) => statsObserver.observe(stat));
}

/* ===== ROOM IMAGE SLIDERS ===== */
document.querySelectorAll('.room-image').forEach(roomImage => {
  const slides = roomImage.querySelectorAll('.room-slide');
  const dots = roomImage.querySelectorAll('.rslide-dot');
  const prevBtn = roomImage.querySelector('.rslide-prev');
  const nextBtn = roomImage.querySelector('.rslide-next');
  if (slides.length < 2) return;

  let current = 0;
  let touchStartX = 0;

  const goTo = (idx) => {
    const next = ((idx % slides.length) + slides.length) % slides.length;
    if (next === current) return;

    slides[current].classList.add('leaving');
    slides[current].classList.remove('active');
    dots[current].classList.remove('active');

    current = next;
    slides[current].classList.remove('leaving');
    slides[current].classList.add('active');
    dots[current].classList.add('active');

    window.setTimeout(() => {
      slides.forEach(s => s.classList.remove('leaving'));
    }, 450);
  };

  if (prevBtn) prevBtn.addEventListener('click', e => { e.stopPropagation(); goTo(current - 1); });
  if (nextBtn) nextBtn.addEventListener('click', e => { e.stopPropagation(); goTo(current + 1); });

  dots.forEach((dot, i) => dot.addEventListener('click', e => { e.stopPropagation(); goTo(i); }));

  roomImage.addEventListener('touchstart', e => {
    touchStartX = e.touches[0].clientX;
  }, { passive: true });

  roomImage.addEventListener('touchend', e => {
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) goTo(current + (diff > 0 ? 1 : -1));
  }, { passive: true });
});

/* ===== FACILITY DETAILS TOGGLE ===== */
document.querySelectorAll('.facilitate-item').forEach(item => {
  item.addEventListener('click', () => {
    const isActive = item.classList.contains('active');
    document.querySelectorAll('.facilitate-item.active').forEach(a => a.classList.remove('active'));
    if (!isActive) item.classList.add('active');
  });

  item.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      item.click();
    }
  });
});

document.addEventListener('click', e => {
  if (!e.target.closest('.facilitate-item')) {
    document.querySelectorAll('.facilitate-item.active').forEach(a => a.classList.remove('active'));
  }
});
