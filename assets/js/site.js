/* =============================================================
   DIRECTION D — SHARED JAVASCRIPT
   Covers: header scroll state, mobile menu, reveal on scroll
   (no-JS fallback: content stays visible without this script),
   FAQ accordion, form mock handling.
   Generated: 2026-10-14
   ============================================================= */
(function () {
  'use strict';

  var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ── No-JS class removal ──────────────────────────────────────────
     Add class="no-js" to <html>; this script removes it on load.   */
  document.documentElement.classList.remove('no-js');

  /* ── Header scroll state ──────────────────────────────────────── */
  var header = document.getElementById('site-header');
  if (header) {
    function handleHeaderScroll() {
      header.classList.toggle('scrolled', window.scrollY > 60);
    }
    window.addEventListener('scroll', handleHeaderScroll, { passive: true });
    handleHeaderScroll();
  }

  /* ── Mobile nav ───────────────────────────────────────────────── */
  var navToggle = document.getElementById('navToggle');
  var mobileNav = document.getElementById('mobileNav');
  if (navToggle && mobileNav) {
    window.closeMobileNav = function () {
      mobileNav.classList.remove('open');
      mobileNav.setAttribute('aria-hidden', 'true');
      navToggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
      var subToggle = document.querySelector('.mobile-nav-toggle');
      var sub = document.getElementById('mobileServices');
      if (subToggle && sub) { subToggle.setAttribute('aria-expanded', 'false'); sub.hidden = true; }
    };
    navToggle.addEventListener('click', function () {
      var open = mobileNav.classList.toggle('open');
      mobileNav.setAttribute('aria-hidden', String(!open));
      navToggle.setAttribute('aria-expanded', String(open));
      document.body.style.overflow = open ? 'hidden' : '';
    });
    /* Close mobile nav on Escape */
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') { window.closeMobileNav(); }
    });
  }

  /* ── Services menu: desktop dropdown ──────────────────────────── */
  var menuItem = document.querySelector('.nav-item.has-menu');
  if (menuItem) {
    var menuToggle = menuItem.querySelector('.nav-menu-toggle');
    var menuTimer;
    var setMenu = function (open) {
      clearTimeout(menuTimer);
      menuItem.classList.toggle('is-open', open);
      menuToggle.setAttribute('aria-expanded', String(open));
    };
    /* a mouse click on the chevron of a menu the hover already opened keeps it open;
       touch and keyboard still toggle */
    var lastPointer = '';
    menuToggle.addEventListener('pointerdown', function (e) { lastPointer = e.pointerType; });
    menuToggle.addEventListener('click', function (e) {
      var open = menuItem.classList.contains('is-open');
      if (open && e.detail > 0 && lastPointer === 'mouse') { return; }
      setMenu(!open);
    });
    menuItem.addEventListener('pointerenter', function (e) {
      if (e.pointerType === 'mouse') { setMenu(true); }
    });
    menuItem.addEventListener('pointerleave', function (e) {
      if (e.pointerType === 'mouse') {
        clearTimeout(menuTimer);
        menuTimer = setTimeout(function () { setMenu(false); }, 160);
      }
    });
    menuItem.addEventListener('focusout', function (e) {
      if (!menuItem.contains(e.relatedTarget)) { setMenu(false); }
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && menuItem.classList.contains('is-open')) {
        setMenu(false);
        menuToggle.focus();
      }
    });
    document.addEventListener('click', function (e) {
      if (!menuItem.contains(e.target)) { setMenu(false); }
    });
  }

  /* ── Services menu: mobile accordion ──────────────────────────── */
  var mobileSubToggle = document.querySelector('.mobile-nav-toggle');
  var mobileSub = document.getElementById('mobileServices');
  if (mobileSubToggle && mobileSub) {
    mobileSubToggle.addEventListener('click', function () {
      var open = mobileSubToggle.getAttribute('aria-expanded') !== 'true';
      mobileSubToggle.setAttribute('aria-expanded', String(open));
      mobileSub.hidden = !open;
    });
  }

  /* ── Scroll reveal (IntersectionObserver; no-JS fallback = visible) */
  if (prefersReduced) {
    document.querySelectorAll('.reveal').forEach(function (el) {
      el.classList.add('is-visible');
    });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add('is-visible');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
    document.querySelectorAll('.reveal').forEach(function (el) {
      io.observe(el);
    });
  }

  /* ── FAQ accordion ────────────────────────────────────────────── */
  document.querySelectorAll('.faq-item').forEach(function (item) {
    var btn = item.querySelector('.faq-question');
    var answer = item.querySelector('.faq-answer');
    if (!btn || !answer) return;
    btn.addEventListener('click', function () {
      var isOpen = item.getAttribute('data-open') === 'true';
      /* Close all */
      document.querySelectorAll('.faq-item').forEach(function (i) {
        i.setAttribute('data-open', 'false');
        var q = i.querySelector('.faq-question');
        var a = i.querySelector('.faq-answer');
        if (q) q.setAttribute('aria-expanded', 'false');
        if (a) a.hidden = true;
      });
      /* Open this one if it was closed */
      if (!isOpen) {
        item.setAttribute('data-open', 'true');
        btn.setAttribute('aria-expanded', 'true');
        answer.hidden = false;
      }
    });
  });

  /* ── Form mock handling ───────────────────────────────────────── */
  document.querySelectorAll('form[data-mock]').forEach(function (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var successEl = form.querySelector('.form-success');
      if (successEl) {
        form.querySelectorAll('.form-row, .form-consent, .form-disclaimer, button[type="button"], button[type="submit"]').forEach(function (el) {
          el.style.display = 'none';
        });
        successEl.style.display = 'block';
      }
    });
  });
  /* Also handle the onclick="return false" pattern */
  document.querySelectorAll('form[onsubmit]').forEach(function (form) {
    form.addEventListener('submit', function (e) { e.preventDefault(); });
  });

})();

/* =============================================================
   HOME MOTION (2026-11-05)
   Runs only when <body class="page-home">; every other page exits here.
   Opening word intro, pinned hero curtain (--e), header state over the
   dark stage, scroll-driven office strip (--x), first-visit dial (--rot).
   body.home-motion is added only on desktop (min-width 1025px) with
   motion allowed and no Save-Data; otherwise the CSS static layout shows
   and nothing here hides content.
   ============================================================= */
(function () {
  'use strict';
  var body = document.body;
  if (!body || !body.classList.contains('page-home')) return;

  var root = document.documentElement;
  var rm = window.matchMedia('(prefers-reduced-motion: reduce)');
  var desk = window.matchMedia('(min-width: 1025px)');
  var saveData = !!(navigator.connection && navigator.connection.saveData);
  var header = document.getElementById('site-header');
  var pin = document.querySelector('.home-hero-pin');
  var hero = document.querySelector('.home-hero');
  var h1 = document.querySelector('.home-hero-h1');
  var rail = document.querySelector('.home-strip-rail');
  var track = document.querySelector('.home-strip-track');
  var jPin = document.querySelector('.home-journey-pin');
  var wheel = document.querySelector('.home-dial-wheel');
  var steps = Array.prototype.slice.call(document.querySelectorAll('.home-jstep'));
  var STEP_DEG = 40;
  var pts = [];

  function live() { return desk.matches && !rm.matches && !saveData; }
  function clamp01(v) { return Math.min(1, Math.max(0, v)); }

  /* ── Opening sequence: H1 words arrive one by one (motion allowed only) ── */
  function runIntro() {
    var n = 0;
    (function split(node) {
      Array.prototype.slice.call(node.childNodes).forEach(function (c) {
        if (c.nodeType === 3) {
          var parts = c.textContent.split(/(\s+)/);
          var frag = document.createDocumentFragment();
          parts.forEach(function (p) {
            if (!p) return;
            if (/^\s+$/.test(p)) { frag.appendChild(document.createTextNode(p)); return; }
            var s = document.createElement('span');
            s.className = 'home-hw';
            s.textContent = p;
            s.style.animationDelay = (0.9 + n++ * 0.18).toFixed(2) + 's';
            frag.appendChild(s);
          });
          node.replaceChild(frag, c);
        } else if (c.nodeType === 1) {
          split(c);
        }
      });
    })(h1);
    root.classList.remove('home-fonts-wait');
    root.classList.add('home-intro');
  }
  if (h1 && !rm.matches && !saveData) {
    /* Hold the hero copy until the web fonts are in, so the font swap cannot
       shift the headline during the intro (CLS). Capped at 1.2 s. */
    root.classList.add('home-fonts-wait');
    var introStarted = false;
    var startIntro = function () { if (introStarted) return; introStarted = true; runIntro(); };
    var fontLink = document.querySelector('link[href*="fonts.googleapis.com"]');
    var fontsIn = function () {
      if (!document.fonts || !document.fonts.load) { startIntro(); return; }
      Promise.all([
        document.fonts.load('500 1em "Cormorant Garamond"'),
        document.fonts.load('italic 400 1em "Cormorant Garamond"'),
        document.fonts.load('400 1em "DM Sans"')
      ]).then(startIntro, startIntro);
    };
    if (fontLink && !fontLink.sheet) { fontLink.addEventListener('load', fontsIn); fontLink.addEventListener('error', fontsIn); }
    else { fontsIn(); }
    setTimeout(startIntro, 1500);
  }

  /* ── Dial points: one per step, placed around the wheel ── */
  if (wheel) {
    steps.forEach(function (st, i) {
      var pt = document.createElement('span');
      pt.className = 'home-dial-pt';
      pt.style.setProperty('--a', (i * STEP_DEG) + 'deg');
      pt.innerHTML = '<span class="home-dial-dot"></span><span class="home-dial-badge">' + (i + 1) + '</span>';
      wheel.appendChild(pt);
      pts.push(pt);
    });
  }

  function setMode() {
    var on = live();
    body.classList.toggle('home-motion', on);
    if (!on) {
      if (hero) { hero.style.removeProperty('--e'); hero.classList.remove('is-done'); }
      if (track) track.style.removeProperty('--x');
      if (wheel) wheel.style.removeProperty('--rot');
      steps.forEach(function (st) { st.classList.remove('on'); st.removeAttribute('aria-current'); });
      pts.forEach(function (pt) { pt.classList.remove('on'); });
    }
  }

  var ticking = false;
  function update() {
    ticking = false;
    var vh = window.innerHeight;
    var on = live();
    var heroBottom = hero ? hero.getBoundingClientRect().bottom : 0;

    /* hero curtain: 0 at the top, 1 when the opener has lifted away */
    if (on && pin && hero) {
      var travel = Math.max(1, pin.offsetHeight - vh);
      /* linear on purpose: the uncovered area must always fall inside the
         strip that sits under the pin (an eased curve runs ahead of the scroll
         near the end and would expose the page background) */
      var e = clamp01(-pin.getBoundingClientRect().top / travel);
      hero.style.setProperty('--e', e.toFixed(4));
      hero.classList.toggle('is-done', e > 0.98);
      heroBottom = Math.min(heroBottom, (1 - e) * vh);
    }

    /* header: transparent while the dark opener is still under it (desktop only) */
    if (header) header.classList.toggle('home-on-dark', desk.matches && heroBottom > 90);

    /* office strip: slides sideways as the section crosses the viewport */
    if (on && rail && track) {
      var r = rail.getBoundingClientRect();
      var q = clamp01((vh - r.top) / (vh + r.height));
      var maxX = Math.max(0, track.scrollWidth - rail.clientWidth);
      track.style.setProperty('--x', (-q * maxX).toFixed(1) + 'px');
    }

    /* first-visit dial: one step at a time */
    if (on && jPin && wheel && steps.length) {
      var jr = jPin.getBoundingClientRect();
      var jq = clamp01(-jr.top / Math.max(1, jPin.offsetHeight - vh));
      var pos = jq * (steps.length - 1);
      var active = Math.round(pos);
      wheel.style.setProperty('--rot', (-pos * STEP_DEG).toFixed(2) + 'deg');
      steps.forEach(function (st, i) {
        var isOn = i === active;
        st.classList.toggle('on', isOn);
        if (isOn) st.setAttribute('aria-current', 'step'); else st.removeAttribute('aria-current');
      });
      pts.forEach(function (pt, i) { pt.classList.toggle('on', i === active); });
    }
  }
  function onScroll() { if (!ticking) { ticking = true; window.requestAnimationFrame(update); } }
  function onChange() { setMode(); onScroll(); }

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  if (desk.addEventListener) {
    desk.addEventListener('change', onChange);
    rm.addEventListener('change', onChange);
  } else if (desk.addListener) {
    desk.addListener(onChange);
    rm.addListener(onChange);
  }
  setMode();
  update();
})();
