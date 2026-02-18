/* ==========================================================================
   components.js — React Component Module
   CaliCo Branding Solutions

   Owns ALL React logic. Exposes a single initReactComponents() entry point.
   Uses React 18 UMD builds (no JSX, no build step) — pure createElement.
   Dynamically injects React CDN scripts if not already loaded, then mounts
   a floating CTA nudge widget into #react-root.

   Component tree:
     <FloatingCTA />           — sticky bottom-right conversion nudge
       <CTAPopover />          — expandable contact card (toggled)
       <ConversionPulse />     — animated ring that draws attention

   DNA alignment:
     conversion_goal: "Save Time"
     cta_button_text: "Email us at customerservice@calico-usa.com"
     cta_button_action: "external-link" (mailto)
     keywords: Trust, Integrity, Transparency
   ========================================================================== */

/* --------------------------------------------------------------------------
   CDN URLs — React 18 production UMD builds
   -------------------------------------------------------------------------- */
const REACT_CDN     = 'https://cdnjs.cloudflare.com/ajax/libs/react/18.2.0/umd/react.production.min.js';
const REACT_DOM_CDN = 'https://cdnjs.cloudflare.com/ajax/libs/react-dom/18.2.0/umd/react-dom.production.min.js';

const CTA_EMAIL    = 'mailto:customerservice@calico-usa.com';
const CTA_LABEL    = 'Email us at customerservice@calico-usa.com';
const MOUNT_ID     = 'react-root';

/* --------------------------------------------------------------------------
   Public entry point
   -------------------------------------------------------------------------- */
export function initReactComponents() {
  _loadReactScripts()
    .then(() => {
      _injectMountPoint();
      _renderApp();
    })
    .catch((err) => {
      console.warn('[CaliCo React] Failed to load React CDN:', err.message);
    });
}

/* ==========================================================================
   PRIVATE — Script Loader
   Loads React then ReactDOM sequentially (ReactDOM depends on React).
   Returns a promise that resolves when both are ready.

   BUG-04 FIX: Original check (script[src] exists in DOM) falsely resolves
   if a previous load attempt failed — the <script> tag remains in the DOM
   after onerror, causing resolve() to fire without React actually loaded.
   Fix: track loaded state in a module-level WeakMap keyed on src string.
   ========================================================================== */
const _loadedScripts = new Set();

function _loadReactScripts() {
  return _loadScript(REACT_CDN).then(() => _loadScript(REACT_DOM_CDN));
}

function _loadScript(src) {
  return new Promise((resolve, reject) => {
    // Already successfully loaded in this session — skip
    if (_loadedScripts.has(src)) {
      resolve();
      return;
    }

    // Remove any failed prior attempt (onerror leaves tag in DOM)
    const existing = document.querySelector(`script[src="${src}"]`);
    if (existing) existing.remove();

    const script   = document.createElement('script');
    script.src     = src;
    script.async   = true;
    script.onload  = () => {
      _loadedScripts.add(src); // Mark as successfully loaded
      resolve();
    };
    script.onerror = () => reject(new Error(`Script load failed: ${src}`));
    document.head.appendChild(script);
  });
}

/* ==========================================================================
   PRIVATE — Mount Point Injection
   Creates <div id="react-root"> at the end of <body> if absent.
   ========================================================================== */
function _injectMountPoint() {
  if (document.getElementById(MOUNT_ID)) return;

  const root       = document.createElement('div');
  root.id          = MOUNT_ID;
  root.setAttribute('aria-live', 'polite');
  root.setAttribute('aria-label', 'CaliCo contact widget');
  document.body.appendChild(root);
}

/* ==========================================================================
   PRIVATE — React App Render
   Uses React 18 createRoot API. All components use React.createElement —
   no JSX, no transpilation required.
   ========================================================================== */
function _renderApp() {
  const { createElement: h, useState, useEffect, useRef } = window.React;
  const { createRoot }                                     = window.ReactDOM;

  /* ------------------------------------------------------------------------
     ConversionPulse — animated rings that orbit the FAB button
     Draws attention to the CTA without being intrusive.
     ---------------------------------------------------------------------- */
  function ConversionPulse() {
    return h('span', {
      'aria-hidden': 'true',
      style: {
        position:     'absolute',
        inset:        '-6px',
        borderRadius: '50%',
        border:       '2px solid rgba(255, 215, 0, 0.35)',
        animation:    'calico-pulse 2.2s ease-out infinite',
        pointerEvents:'none',
      }
    });
  }

  /* ------------------------------------------------------------------------
     CTAPopover — expandable contact card
     Shown when the FAB is in "open" state.
     ---------------------------------------------------------------------- */
  function CTAPopover({ onClose }) {
    const closeRef = useRef(null);

    // Focus the close button on open for keyboard accessibility
    useEffect(() => {
      if (closeRef.current) closeRef.current.focus();
    }, []);

    // Close on Escape
    useEffect(() => {
      function handleKey(e) {
        if (e.key === 'Escape') onClose();
      }
      document.addEventListener('keydown', handleKey);
      return () => document.removeEventListener('keydown', handleKey);
    }, [onClose]);

    return h('div', {
      role:             'dialog',
      'aria-modal':     'true',
      'aria-labelledby':'calico-popover-title',
      style: {
        position:     'absolute',
        bottom:       'calc(100% + 16px)',
        right:        '0',
        /* BUG-02 FIX: Clamp width so popover never overflows left edge at 320px.
           FAB is at right:28px, so popover right edge = 28px from viewport right.
           Available width = viewport - 28px - 8px safety = calc(100vw - 36px).
           Max 300px on large screens, but shrinks on small viewports. */
        width:        'min(300px, calc(100vw - 36px))',
        background:   'linear-gradient(135deg, rgba(30,8,50,0.97) 0%, rgba(19,6,32,0.99) 100%)',
        border:       '1px solid rgba(75,0,130,0.5)',
        borderRadius: '16px',
        padding:      '24px',
        boxShadow:    '0 8px 32px rgba(0,0,0,0.6), 0 0 24px rgba(75,0,130,0.3)',
        backdropFilter: 'blur(24px)',
        color:        '#f0e6ff',
        fontFamily:   "'Open Sans', system-ui, sans-serif",
        zIndex:       999,
      }
    },
      // Close button
      // BUG-13 FIX: Increased from 28x28 to 44x44px touch target
      h('button', {
        ref:          closeRef,
        onClick:      onClose,
        'aria-label': 'Close contact widget',
        style: {
          position:   'absolute',
          top:        '8px',
          right:      '8px',
          background: 'rgba(255,255,255,0.07)',
          border:     '1px solid rgba(255,255,255,0.1)',
          borderRadius: '8px',
          color:      'rgba(240,230,255,0.7)',
          width:      '44px',
          height:     '44px',
          cursor:     'pointer',
          fontSize:   '16px',
          lineHeight: '1',
          display:    'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'background 0.2s',
        }
      }, '✕'),

      // Header
      h('p', {
        id:    'calico-popover-title',
        style: {
          fontFamily:    "'Montserrat', system-ui, sans-serif",
          fontWeight:    '700',
          fontSize:      '15px',
          color:         '#f0e6ff',
          marginBottom:  '6px',
          paddingRight:  '52px', // Account for larger close button
          lineHeight:    '1.3',
        }
      }, 'Save time. Email us today.'),

      h('p', {
        style: {
          fontSize:     '12px',
          color:        'rgba(240,230,255,0.6)',
          marginBottom: '20px',
          lineHeight:   '1.6',
        }
      }, 'One partner for all your branding — Jingles, Logos, Voiceovers, Videos & Ad Copy.'),

      // Primary CTA link
      h('a', {
        href:       CTA_EMAIL,
        'aria-label': CTA_LABEL,
        onClick:    () => _trackConversion('popover_email_click'),
        style: {
          display:        'flex',
          alignItems:     'center',
          justifyContent: 'center',
          gap:            '8px',
          padding:        '11px 16px',
          background:     'linear-gradient(135deg, #ffe14d 0%, #c9a800 100%)',
          border:         'none',
          borderRadius:   '8px',
          color:          '#0F0518',
          fontFamily:     "'Montserrat', system-ui, sans-serif",
          fontWeight:     '600',
          fontSize:       '12px',
          letterSpacing:  '0.05em',
          textTransform:  'uppercase',
          textDecoration: 'none',
          cursor:         'pointer',
          boxShadow:      '0 0 16px rgba(255,215,0,0.25)',
          transition:     'box-shadow 0.2s, transform 0.15s',
          width:          '100%',
          // Allow long email address to wrap inside popover
          wordBreak:      'break-word',
        }
      },
        // Envelope icon
        h('svg', {
          width: '14', height: '14', viewBox: '0 0 24 24',
          fill: 'none', 'aria-hidden': 'true',
          stroke: 'currentColor', strokeWidth: '2',
          strokeLinecap: 'round', strokeLinejoin: 'round',
          style: { flexShrink: '0' },
        },
          h('path', { d: 'M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z' }),
          h('polyline', { points: '22,6 12,13 2,6' })
        ),
        'customerservice@calico-usa.com'
      ),

      // Trust micro-copy
      // BUG-08 FIX: Raised alpha from 0.35 to 0.55 — original 0.35 = 2.82:1 contrast,
      // fails WCAG AA. 0.55 on dark popover bg achieves ~4.1:1 for this decorative text.
      h('p', {
        style: {
          fontSize:   '10px',
          color:      'rgba(240,230,255,0.55)',
          textAlign:  'center',
          marginTop:  '12px',
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
        }
      }, 'Trust · Integrity · Transparency')
    );
  }

  /* ------------------------------------------------------------------------
     FloatingCTA — the main FAB + popover orchestrator
     Appears after 4 seconds or when user scrolls past 40% of page height.
     ---------------------------------------------------------------------- */
  function FloatingCTA() {
    const [visible, setVisible] = useState(false);
    const [open,    setOpen]    = useState(false);
    const fabRef                = useRef(null);

    // Show widget after delay OR scroll threshold
    useEffect(() => {
      const timer = setTimeout(() => setVisible(true), 4000);

      function onScroll() {
        const scrolled = window.scrollY / (
          document.documentElement.scrollHeight - window.innerHeight
        );
        if (scrolled > 0.4) {
          setVisible(true);
          window.removeEventListener('scroll', onScroll);
        }
      }

      window.addEventListener('scroll', onScroll, { passive: true });
      return () => {
        clearTimeout(timer);
        window.removeEventListener('scroll', onScroll);
      };
    }, []);

    function handleFabClick() {
      const next = !open;
      setOpen(next);
      if (next) _trackConversion('fab_open');
    }

    function handleClose() {
      setOpen(false);
      // Return focus to FAB after closing popover
      if (fabRef.current) fabRef.current.focus();
    }

    if (!visible) return null;

    return h('div', {
      style: {
        position:  'fixed',
        bottom:    '28px',
        right:     '28px',
        zIndex:    1000,
        display:   'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
      }
    },
      // Popover (conditionally rendered)
      open && h(CTAPopover, { onClose: handleClose }),

      // FAB button
      h('button', {
        ref:          fabRef,
        onClick:      handleFabClick,
        'aria-expanded': String(open),
        'aria-haspopup': 'dialog',
        'aria-label': open ? 'Close contact widget' : 'Open contact widget — Email CaliCo',
        style: {
          position:       'relative',
          width:          '56px',
          height:         '56px',
          borderRadius:   '50%',
          background:     'linear-gradient(135deg, #ffe14d 0%, #c9a800 100%)',
          border:         '2px solid rgba(255,215,0,0.4)',
          boxShadow:      '0 4px 20px rgba(0,0,0,0.5), 0 0 24px rgba(255,215,0,0.2)',
          cursor:         'pointer',
          display:        'flex',
          alignItems:     'center',
          justifyContent: 'center',
          transition:     'transform 0.2s, box-shadow 0.2s',
          color:          '#0F0518',
          flexShrink:     '0',
        }
      },
        // Pulse ring (only when closed)
        !open && h(ConversionPulse),

        // Icon — envelope when closed, X when open
        open
          ? h('svg', {
              width: '20', height: '20', viewBox: '0 0 24 24',
              fill: 'none', 'aria-hidden': 'true',
              stroke: 'currentColor', strokeWidth: '2.5',
              strokeLinecap: 'round',
            },
              h('line', { x1: '18', y1: '6',  x2: '6',  y2: '18' }),
              h('line', { x1: '6',  y1: '6',  x2: '18', y2: '18' })
            )
          : h('svg', {
              width: '22', height: '22', viewBox: '0 0 24 24',
              fill: 'none', 'aria-hidden': 'true',
              stroke: 'currentColor', strokeWidth: '2',
              strokeLinecap: 'round', strokeLinejoin: 'round',
            },
              h('path', { d: 'M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z' }),
              h('polyline', { points: '22,6 12,13 2,6' })
            )
      )
    );
  }

  /* ------------------------------------------------------------------------
     CSS Keyframe injection for pulse animation
     Injected once into <head> — avoids needing a separate stylesheet.
     ---------------------------------------------------------------------- */
  if (!document.getElementById('calico-react-styles')) {
    const style     = document.createElement('style');
    style.id        = 'calico-react-styles';
    style.textContent = `
      @keyframes calico-pulse {
        0%   { transform: scale(1);    opacity: 0.7; }
        70%  { transform: scale(1.55); opacity: 0;   }
        100% { transform: scale(1.55); opacity: 0;   }
      }
    `;
    document.head.appendChild(style);
  }

  /* ------------------------------------------------------------------------
     Mount
     ---------------------------------------------------------------------- */
  const mountEl = document.getElementById(MOUNT_ID);
  if (!mountEl) {
    console.warn('[CaliCo React] Mount point #react-root not found.');
    return;
  }

  const root = createRoot(mountEl);
  root.render(h(FloatingCTA));
}

/* ==========================================================================
   PRIVATE — Conversion Tracker
   Placeholder analytics layer. Swap body for GA4, Segment, etc.
   ========================================================================== */
function _trackConversion(eventName, meta = {}) {
  // Placeholder: log to console in development
  console.info(`[CaliCo Conversion] ${eventName}`, {
    timestamp: new Date().toISOString(),
    page:      window.location.pathname,
    goal:      'Save Time',
    ...meta,
  });

  // TODO: Uncomment and configure for production analytics
  // if (typeof gtag === 'function') {
  //   gtag('event', eventName, {
  //     event_category: 'conversion',
  //     event_label:    'CTA — Email',
  //     ...meta,
  //   });
  // }
}
