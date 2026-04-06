'use strict';

/* ===== NAV SCROLL ===== */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
}, { passive: true });

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
      revealObs.unobserve(e.target);
    }
  });
}, { threshold: 0.1 });
document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));

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