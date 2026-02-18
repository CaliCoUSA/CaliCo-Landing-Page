/* ==========================================================================
   animations.js — GSAP Animation Module
   CaliCo Branding Solutions

   Owns ALL GSAP logic. Exposes a single initAnimations() entry point.
   Called exclusively by main.js — no GSAP code lives outside this file.

   Targets CSS classes defined in components.css:
     .js-fade-up    → opacity 0, translateY 32px → resolved
     .js-fade-in    → opacity 0 → resolved
     .js-slide-left → opacity 0, translateX -32px → resolved
     .js-slide-right→ opacity 0, translateX  32px → resolved

   Animation strategy:
     • Hero section  → fires immediately on load (no ScrollTrigger)
     • All other     → ScrollTrigger, start: "top 82%"
     • Stagger       → applied to grid children automatically
     • Reduced motion→ checked FIRST; if true, skip all animations
       and immediately show all content.
   ========================================================================== */

export function initAnimations() {

  /* ------------------------------------------------------------------
     0. REDUCED MOTION GUARD
     WCAG 2.1 SC 2.3.3 — respect prefers-reduced-motion at the JS level.
     CSS @media handles the static fallback; this handles GSAP.
     ------------------------------------------------------------------ */
  const prefersReduced = window.matchMedia(
    '(prefers-reduced-motion: reduce)'
  ).matches;

  if (prefersReduced) {
    _revealAllImmediately();
    return; // Exit — no GSAP registered
  }

  /* ------------------------------------------------------------------
     1. GSAP PLUGIN REGISTRATION
     ScrollTrigger is loaded via CDN before main.js (see index.html).
     Guard against missing plugin gracefully.
     ------------------------------------------------------------------ */
  if (typeof gsap === 'undefined') {
    console.warn('[CaliCo Animations] GSAP not found. Revealing content.');
    _revealAllImmediately();
    return;
  }

  if (typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
  } else {
    console.warn('[CaliCo Animations] ScrollTrigger not found. Scroll animations disabled.');
  }

  /* ------------------------------------------------------------------
     2. GSAP DEFAULTS
     Applied globally to keep all tweens consistent.
     ------------------------------------------------------------------ */
  gsap.defaults({
    ease: 'power3.out',
    duration: 0.75,
  });

  /* ------------------------------------------------------------------
     3. HERO ENTRANCE ANIMATIONS
     Fire on load — no ScrollTrigger.
     Sequence: badge → title → subtitle → actions → micro-copy
     ------------------------------------------------------------------ */
  const heroTl = gsap.timeline({ delay: 0.1 });

  // Badge fade-in
  const heroBadge = document.querySelector('.hero__badge.js-fade-in');
  if (heroBadge) {
    heroTl.fromTo(heroBadge,
      { opacity: 0, y: 12 },
      { opacity: 1, y: 0, duration: 0.5 }
    );
  }

  // Title — word-level stagger for premium feel
  const heroTitle = document.querySelector('.hero__title.js-fade-up');
  if (heroTitle) {
    heroTl.fromTo(heroTitle,
      { opacity: 0, y: 40 },
      { opacity: 1, y: 0, duration: 0.8, ease: 'power4.out' },
      '-=0.2'
    );
  }

  // Subtitle
  const heroSubtitle = document.querySelector('.hero__subtitle.js-fade-up');
  if (heroSubtitle) {
    heroTl.fromTo(heroSubtitle,
      { opacity: 0, y: 24 },
      { opacity: 1, y: 0, duration: 0.7 },
      '-=0.4'
    );
  }

  // CTA action buttons — staggered
  const heroActions = document.querySelector('.hero__actions.js-fade-up');
  if (heroActions) {
    heroTl.fromTo(heroActions,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.6 },
      '-=0.35'
    );
  }

  // Micro-copy pill list
  const heroPill = document.querySelector('.hero .js-fade-in:not(.hero__badge)');
  if (heroPill) {
    heroTl.fromTo(heroPill,
      { opacity: 0 },
      { opacity: 1, duration: 0.5 },
      '-=0.2'
    );
  }

  // Glow orb — slow breathe-in
  const heroGlow = document.querySelector('.hero__glow');
  if (heroGlow) {
    gsap.fromTo(heroGlow,
      { opacity: 0, scale: 0.85 },
      { opacity: 1, scale: 1, duration: 1.6, ease: 'power2.out', delay: 0.05 }
    );
  }

  /* ------------------------------------------------------------------
     4. SCROLL-TRIGGERED SECTION REVEALS
     Batch registration for performance — one ScrollTrigger observer
     per class type rather than one per element.
     ------------------------------------------------------------------ */
  if (typeof ScrollTrigger === 'undefined') return;

  // --- 4a. Generic fade-up elements (excluding hero, already animated) ---
  const fadeUpEls = document.querySelectorAll(
    'section:not(.hero) .js-fade-up, footer .js-fade-up'
  );

  fadeUpEls.forEach((el) => {
    gsap.fromTo(el,
      { opacity: 0, y: 36 },
      {
        opacity: 1,
        y: 0,
        duration: 0.75,
        scrollTrigger: {
          trigger: el,
          start: 'top 82%',
          once: true,           // Fire once and detach — better performance
        },
      }
    );
  });

  // --- 4b. Generic fade-in elements (excluding hero) ---
  const fadeInEls = document.querySelectorAll(
    'section:not(.hero) .js-fade-in, footer .js-fade-in'
  );

  fadeInEls.forEach((el) => {
    gsap.fromTo(el,
      { opacity: 0 },
      {
        opacity: 1,
        duration: 0.6,
        scrollTrigger: {
          trigger: el,
          start: 'top 85%',
          once: true,
        },
      }
    );
  });

  // --- 4c. Slide-left elements ---
  const slideLeftEls = document.querySelectorAll('.js-slide-left');
  slideLeftEls.forEach((el) => {
    gsap.fromTo(el,
      { opacity: 0, x: -36 },
      {
        opacity: 1,
        x: 0,
        duration: 0.75,
        scrollTrigger: {
          trigger: el,
          start: 'top 82%',
          once: true,
        },
      }
    );
  });

  // --- 4d. Slide-right elements ---
  const slideRightEls = document.querySelectorAll('.js-slide-right');
  slideRightEls.forEach((el) => {
    gsap.fromTo(el,
      { opacity: 0, x: 36 },
      {
        opacity: 1,
        x: 0,
        duration: 0.75,
        scrollTrigger: {
          trigger: el,
          start: 'top 82%',
          once: true,
        },
      }
    );
  });

  /* ------------------------------------------------------------------
     5. FEATURE GRID — Staggered card entrance
     Cards animate as a coordinated group, not individually.
     ------------------------------------------------------------------ */
  const featureCards = document.querySelectorAll('.feature-grid .card');
  if (featureCards.length) {
    // BUG-05 FIX: ScrollTrigger.getById() requires a string ID, not a DOM element.
    // Kill any triggers by querying the ScrollTrigger instances array instead.
    ScrollTrigger.getAll().forEach((trigger) => {
      if (trigger.vars?.trigger && featureCards.length) {
        const el = typeof trigger.vars.trigger === 'string'
          ? document.querySelector(trigger.vars.trigger)
          : trigger.vars.trigger;
        if (el && [...featureCards].includes(el)) trigger.kill();
      }
    });

    // Clear inline GSAP state so stagger takes full control
    gsap.set(featureCards, { clearProps: 'all' });

    gsap.fromTo(featureCards,
      { opacity: 0, y: 48, scale: 0.97 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.65,
        stagger: {
          amount: 0.5,          // Total stagger time spread across all 6 cards
          from: 'start',
        },
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.feature-grid',
          start: 'top 78%',
          once: true,
        },
      }
    );
  }

  /* ------------------------------------------------------------------
     6. CTA BLOCK — Scale + fade entrance
     ------------------------------------------------------------------ */
  const ctaBlock = document.querySelector('.cta-block');
  if (ctaBlock) {
    gsap.fromTo(ctaBlock,
      { opacity: 0, y: 48, scale: 0.98 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.85,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: ctaBlock,
          start: 'top 80%',
          once: true,
        },
      }
    );
  }

  /* ------------------------------------------------------------------
     7. NAV LOGO — Subtle entrance on load
     ------------------------------------------------------------------ */
  const navBrand = document.querySelector('.nav__brand');
  if (navBrand) {
    gsap.fromTo(navBrand,
      { opacity: 0, x: -16 },
      { opacity: 1, x: 0, duration: 0.6, delay: 0.2, ease: 'power2.out' }
    );
  }

  const navLinks = document.querySelectorAll('.nav__link, .nav__cta');
  if (navLinks.length) {
    gsap.fromTo(navLinks,
      { opacity: 0, y: -10 },
      {
        opacity: 1,
        y: 0,
        duration: 0.45,
        stagger: 0.08,
        delay: 0.3,
        ease: 'power2.out',
      }
    );
  }

  /* ------------------------------------------------------------------
     8. FOOTER — Staggered column reveal
     ------------------------------------------------------------------ */
  const footerCols = document.querySelectorAll('.footer__grid > *');
  if (footerCols.length) {
    gsap.fromTo(footerCols,
      { opacity: 0, y: 28 },
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '.footer__grid',
          start: 'top 88%',
          once: true,
        },
      }
    );
  }

  /* ------------------------------------------------------------------
     9. AMBIENT GLOW PULSE — Hero glow breathes slowly (loop)
     Only runs if user hasn't indicated reduced motion preference.
     ------------------------------------------------------------------ */
  const glowEl = document.querySelector('.hero__glow');
  if (glowEl) {
    gsap.to(glowEl, {
      opacity: 0.7,
      scale: 1.06,
      duration: 4,
      ease: 'sine.inOut',
      yoyo: true,
      repeat: -1,
    });
  }

  /* ------------------------------------------------------------------
     10. BUTTON HOVER MAGNETIC EFFECT
     Subtle cursor-tracking pull on primary CTA buttons.
     ------------------------------------------------------------------ */
  _initMagneticButtons();

} // end initAnimations()


/* ==========================================================================
   PRIVATE HELPERS
   ========================================================================== */

/**
 * Immediately reveal all animated elements.
 * Called when GSAP is unavailable or reduced-motion is preferred.
 */
function _revealAllImmediately() {
  const animated = document.querySelectorAll(
    '.js-fade-up, .js-fade-in, .js-slide-left, .js-slide-right'
  );
  animated.forEach((el) => {
    el.style.opacity = '1';
    el.style.transform = 'none';
  });
}

/**
 * Magnetic button effect — primary CTAs gently follow the cursor.
 * Resets on mouseleave. Desktop only (pointer: fine).
 */
function _initMagneticButtons() {
  if (!window.matchMedia('(pointer: fine)').matches) return;
  if (typeof gsap === 'undefined') return;

  const magnetBtns = document.querySelectorAll('.btn-primary');

  magnetBtns.forEach((btn) => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const deltaX = (e.clientX - centerX) * 0.22;
      const deltaY = (e.clientY - centerY) * 0.22;

      gsap.to(btn, {
        x: deltaX,
        y: deltaY,
        duration: 0.35,
        ease: 'power2.out',
      });
    });

    btn.addEventListener('mouseleave', () => {
      gsap.to(btn, {
        x: 0,
        y: 0,
        duration: 0.55,
        ease: 'elastic.out(1, 0.4)',
      });
    });
  });
}
