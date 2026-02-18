/* ==========================================================================
   main.js — Application Bootstrap
   CaliCo Branding Solutions

   Responsibilities:
     1. Import and initialize all active modules (animations, react components)
     2. Nav: scroll-state class, mobile drawer toggle, smooth scroll
     3. Footer: dynamic copyright year
     4. CTA: event delegation for all conversion buttons + aria feedback
     5. Global: keyboard accessibility utilities

   Module boundary rule:
     → This file orchestrates. It does NOT contain GSAP or React logic.
     → All animation code lives in modules/animations.js
     → All React code lives in modules/components.js
   ========================================================================== */

import { initAnimations }       from './modules/animations.js';
import { initReactComponents }  from './modules/components.js';

/* ==========================================================================
   APP INIT — Entry point
   ========================================================================== */
document.addEventListener('DOMContentLoaded', () => {
  _initFooterYear();
  _initNav();
  _initSmoothScroll();
  _initCTAHandlers();
  _initAnimations();
  _initReact();

  console.info('[CaliCo] App initialized ✓');
});

/* ==========================================================================
   1. FOOTER — Dynamic copyright year
   Populates <span id="footer-year"> set in index.html.
   ========================================================================== */
function _initFooterYear() {
  const yearEl = document.getElementById('footer-year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
}

/* ==========================================================================
   2. NAVIGATION
   Handles three concerns independently:
     a) Scroll-state class (.nav--scrolled) for visual treatment change
     b) Mobile drawer toggle (open/close + ARIA sync)
     c) Active link highlighting based on current scroll position
   ========================================================================== */
function _initNav() {
  const nav        = document.getElementById('nav');
  const toggle     = document.getElementById('nav-toggle');
  const drawer     = document.getElementById('nav-drawer');
  const navLinks   = document.querySelectorAll('.nav__link');

  if (!nav) return;

  /* -----------------------------------------------------------------------
     2a. Scroll-state: add/remove .nav--scrolled class
     Uses IntersectionObserver on a sentinel element for performance
     (avoids scroll event listener for this concern).
     --------------------------------------------------------------------- */
  const sentinel = document.createElement('div');
  sentinel.style.cssText = 'position:absolute;top:80px;left:0;width:1px;height:1px;';
  document.body.prepend(sentinel);

  const navObserver = new IntersectionObserver(
    ([entry]) => {
      nav.classList.toggle('nav--scrolled', !entry.isIntersecting);
    },
    { threshold: 0 }
  );
  navObserver.observe(sentinel);

  /* -----------------------------------------------------------------------
     2b. Mobile drawer toggle
     Syncs aria-expanded on button and aria-hidden on drawer.
     Closes drawer on outside click and on Escape key.
     --------------------------------------------------------------------- */
  if (toggle && drawer) {
    // Toggle open/close
    toggle.addEventListener('click', () => {
      const isOpen = toggle.getAttribute('aria-expanded') === 'true';
      _setDrawerState(!isOpen, toggle, drawer);
    });

    // Close on Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
        _setDrawerState(false, toggle, drawer);
        toggle.focus();
      }
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
      if (
        toggle.getAttribute('aria-expanded') === 'true' &&
        !nav.contains(e.target)
      ) {
        _setDrawerState(false, toggle, drawer);
      }
    });

    // Close drawer when a drawer link is clicked
    drawer.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        _setDrawerState(false, toggle, drawer);
      });
    });
  }

  /* -----------------------------------------------------------------------
     2c. Active nav link — highlights link matching visible section
     Uses IntersectionObserver on each section with an id.
     --------------------------------------------------------------------- */
  const sections = document.querySelectorAll('section[id], footer[id]');

  if (sections.length && navLinks.length) {
    const sectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const activeId = entry.target.id;
            navLinks.forEach((link) => {
              const href = link.getAttribute('href');
              if (href === `#${activeId}`) {
                // BUG-12 FIX: Set active state
                link.setAttribute('aria-current', 'page');
              } else {
                // BUG-12 FIX: Remove attribute entirely — aria-current="false"
                // is redundant and inconsistently handled by assistive tech.
                link.removeAttribute('aria-current');
              }
            });
          }
        });
      },
      {
        rootMargin: '-30% 0px -60% 0px', // Trigger when section is in middle third
        threshold:  0,
      }
    );

    sections.forEach((section) => sectionObserver.observe(section));
  }
}

/**
 * Helper: Set mobile drawer open/closed state with full ARIA sync.
 * @param {boolean} open
 * @param {HTMLElement} toggle
 * @param {HTMLElement} drawer
 */
function _setDrawerState(open, toggle, drawer) {
  toggle.setAttribute('aria-expanded', String(open));
  drawer.setAttribute('aria-hidden',   String(!open));

  if (open) {
    drawer.classList.add('nav__drawer--open');
    // BUG-10 FIX: Remove inert so keyboard users can reach drawer links
    drawer.removeAttribute('inert');
    document.body.style.overflow = 'hidden'; // Prevent scroll while drawer open
  } else {
    drawer.classList.remove('nav__drawer--open');
    // BUG-10 FIX: Restore inert to block keyboard focus on hidden links
    drawer.setAttribute('inert', '');
    document.body.style.overflow = '';
  }
}

/* ==========================================================================
   3. SMOOTH SCROLL
   Intercepts all internal anchor links (#...) site-wide.
   Accounts for fixed nav height (72px) so sections aren't obscured.
   Uses native scrollIntoView with behavior:'smooth' — progressive
   enhancement (falls back to instant jump in older browsers).
   ========================================================================== */
function _initSmoothScroll() {
  const NAV_HEIGHT = 72; // px — must match nav height in components.css

  document.addEventListener('click', (e) => {
    const link = e.target.closest('a[href^="#"]');
    if (!link) return;

    const targetId = link.getAttribute('href').slice(1);
    if (!targetId) return;

    const target = document.getElementById(targetId);
    if (!target) return;

    e.preventDefault();

    const top = target.getBoundingClientRect().top
              + window.scrollY
              - NAV_HEIGHT
              - 8; // 8px breathing room

    window.scrollTo({ top, behavior: 'smooth' });

    // Update URL without triggering scroll
    history.pushState(null, '', `#${targetId}`);

    // Move focus to the section for screen readers
    target.setAttribute('tabindex', '-1');
    target.focus({ preventScroll: true });
    target.addEventListener('blur', () => target.removeAttribute('tabindex'), { once: true });
  });
}

/* ==========================================================================
   4. CTA HANDLERS
   Wires all conversion-related interactive elements.

   Handler inventory (Step 3 bridge):
     ┌─────────────────────────────────────────────────────────────────────┐
     │ Element                         │ Handler              │ File       │
     ├─────────────────────────────────┼──────────────────────┼────────────┤
     │ Nav "Get Started" btn           │ _onCtaClick()        │ main.js    │
     │ Hero primary CTA btn            │ _onCtaClick()        │ main.js    │
     │ Hero secondary "Explore" btn    │ _initSmoothScroll()  │ main.js    │
     │ CTA section email btn           │ _onCtaClick()        │ main.js    │
     │ Footer email link               │ _onCtaClick()        │ main.js    │
     │ FAB floating button (React)     │ handleFabClick()     │ components │
     │ FAB popover email link          │ _trackConversion()   │ components │
     └─────────────────────────────────┴──────────────────────┴────────────┘

   All mailto: links are natively functional as <a> elements.
   The JS layer adds:
     • Conversion event logging (analytics stub)
     • aria-live announcement for screen readers
     • Visual click-pulse feedback on the button
   ========================================================================== */
function _initCTAHandlers() {
  // Create aria-live region for screen reader feedback
  const liveRegion = _createLiveRegion();

  // Event delegation — single listener catches all CTA clicks
  document.addEventListener('click', (e) => {
    const ctaLink = e.target.closest('a[href^="mailto:"]');
    if (!ctaLink) return;

    // Fire conversion event
    _trackConversion('cta_email_click', {
      element:  ctaLink.getAttribute('aria-label') || ctaLink.textContent.trim().slice(0, 60),
      location: _getCtaLocation(ctaLink),
    });

    // Announce to screen readers
    liveRegion.textContent = 'Opening email client to contact CaliCo Branding Solutions.';
    setTimeout(() => { liveRegion.textContent = ''; }, 3000);

    // Visual feedback — pulse the button
    _pulseElement(ctaLink);
  });
}

/**
 * Determine which section a CTA lives in for analytics context.
 * @param {HTMLElement} el
 * @returns {string}
 */
function _getCtaLocation(el) {
  const section = el.closest('section[id], header, footer, nav');
  return section?.id || section?.tagName?.toLowerCase() || 'unknown';
}

/**
 * Create a visually hidden aria-live region for screen reader announcements.
 * @returns {HTMLElement}
 */
function _createLiveRegion() {
  const region = document.createElement('div');
  region.setAttribute('aria-live',   'polite');
  region.setAttribute('aria-atomic', 'true');
  region.className = 'sr-only';
  document.body.appendChild(region);
  return region;
}

/**
 * Add a brief CSS pulse class to an element on click for visual feedback.
 * BUG-06 FIX: Added setTimeout fallback. Under prefers-reduced-motion,
 * animation-duration is forced to 0.01ms — animationend may not fire reliably.
 * The fallback ensures .is-pulsing is always cleaned up within 700ms.
 * @param {HTMLElement} el
 */
function _pulseElement(el) {
  // Skip pulse entirely if user prefers reduced motion
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  el.classList.add('is-pulsing');

  // Primary cleanup: animationend event
  el.addEventListener('animationend', () => el.classList.remove('is-pulsing'), { once: true });

  // Fallback cleanup: remove after 700ms regardless (animation is 600ms)
  setTimeout(() => el.classList.remove('is-pulsing'), 700);

  // Inject keyframe if not present
  if (!document.getElementById('calico-pulse-style')) {
    const style       = document.createElement('style');
    style.id          = 'calico-pulse-style';
    style.textContent = `
      @keyframes calico-cta-pulse {
        0%   { box-shadow: 0 0 0 0    rgba(255, 215, 0, 0.55); }
        70%  { box-shadow: 0 0 0 14px rgba(255, 215, 0, 0);    }
        100% { box-shadow: 0 0 0 0    rgba(255, 215, 0, 0);    }
      }
      .is-pulsing {
        animation: calico-cta-pulse 0.6s ease-out forwards;
      }
    `;
    document.head.appendChild(style);
  }
}

/* ==========================================================================
   5. MODULE INIT — Delegates to imported modules
   ========================================================================== */

function _initAnimations() {
  try {
    initAnimations();
  } catch (err) {
    console.warn('[CaliCo] Animation init failed:', err.message);
    // Graceful degradation — page is still fully usable without animations
  }
}

function _initReact() {
  try {
    initReactComponents();
  } catch (err) {
    console.warn('[CaliCo] React component init failed:', err.message);
    // Graceful degradation — floating CTA is enhancement, not critical path
  }
}

/* ==========================================================================
   6. CONVERSION TRACKER — Shared across main.js
   Placeholder analytics stub. Mirrors the one in components.js.
   In production: replace with GA4 / Segment / custom endpoint.
   ========================================================================== */
function _trackConversion(eventName, meta = {}) {
  console.info(`[CaliCo Conversion] ${eventName}`, {
    timestamp: new Date().toISOString(),
    page:      window.location.pathname,
    goal:      'Save Time',
    ...meta,
  });

  // TODO: Wire to production analytics
  // if (typeof gtag === 'function') {
  //   gtag('event', eventName, {
  //     event_category: 'conversion',
  //     event_label:    'CTA — Email',
  //     ...meta,
  //   });
  // }
}

