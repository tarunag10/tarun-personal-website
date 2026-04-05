/* ═══════════════════════════════════════
   APP.JS — Event delegation, filters,
   forms, animations, hero rotator
═══════════════════════════════════════ */

(function() {
  'use strict';

  /* ── EVENT DELEGATION ── */
  document.addEventListener('click', function(e) {
    var el;

    // Navigation: data-navigate
    el = e.target.closest('[data-navigate]');
    if (el) {
      e.preventDefault();
      go(el.dataset.navigate);
      return;
    }

    // Article links: data-article
    el = e.target.closest('[data-article]');
    if (el) {
      e.preventDefault();
      goArticle(el.dataset.article);
      return;
    }

    // App filter: data-filter
    el = e.target.closest('[data-filter]');
    if (el) {
      e.preventDefault();
      filterCat(el, el.dataset.filter);
      return;
    }

    // Writing filter: data-wfilter
    el = e.target.closest('[data-wfilter]');
    if (el) {
      e.preventDefault();
      filterWriting(el, el.dataset.wfilter);
      return;
    }

    // Actions: data-action
    el = e.target.closest('[data-action]');
    if (el) {
      e.preventDefault();
      var action = el.dataset.action;
      if (action === 'toggle-menu') toggleMenu();
      else if (action === 'back-to-writing') {
        location.hash = '#/writing';
      }
      else if (action === 'scroll-top') window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    // Form submit: data-submit
    el = e.target.closest('[data-submit]');
    if (el) {
      e.preventDefault();
      submitForm(el, el.dataset.submit);
      return;
    }
  });

  // Keyboard: Enter/Space on interactive data-* elements
  document.addEventListener('keydown', function(e) {
    if (e.key !== 'Enter' && e.key !== ' ') return;
    var el = e.target;
    if (el.closest('[data-navigate], [data-article], [data-filter], [data-wfilter], [data-action]')) {
      if (e.key === ' ') e.preventDefault(); // prevent scroll
      el.click();
    }
  });

  /* ── NAV ── */
  function toggleMenu() {
    var nav = document.querySelector('nav');
    var hamburger = document.querySelector('.hamburger');
    nav.classList.toggle('nav-open');
    hamburger.classList.toggle('active');
    var expanded = nav.classList.contains('nav-open');
    hamburger.setAttribute('aria-expanded', expanded ? 'true' : 'false');
  }

  /* ── CATEGORY FILTERS ── */
  var appFilterState = { cat: 'all', query: '' };

  function filterCat(btn, cat) {
    document.querySelectorAll('#page-apps .cat-btn').forEach(function(b) { b.classList.remove('active'); });
    btn.classList.add('active');
    appFilterState.cat = cat;
    applyAppFilters();
  }

  function applyAppFilters() {
    var query = appFilterState.query;
    document.querySelectorAll('#page-apps .proj-card').forEach(function(card) {
      var cardCats = card.dataset.cat || '';
      var categoryMatch = appFilterState.cat === 'all' || cardCats.includes(appFilterState.cat);
      var titleEl = card.querySelector('.proj-title');
      var title = titleEl ? titleEl.textContent.toLowerCase() : '';
      var queryMatch = !query || title.indexOf(query) !== -1;
      card.style.display = (categoryMatch && queryMatch) ? '' : 'none';
    });
  }

  function syncAppSearchControls() {
    var clearBtn = document.getElementById('apps-search-clear');
    if (clearBtn) clearBtn.disabled = !appFilterState.query;
  }

  function bindAppSearch() {
    var searchInput = document.getElementById('apps-search-input');
    var clearBtn = document.getElementById('apps-search-clear');
    if (!searchInput) return;

    searchInput.addEventListener('input', function(e) {
      appFilterState.query = (e.target.value || '').trim().toLowerCase();
      applyAppFilters();
      syncAppSearchControls();
    });

    if (clearBtn) {
      clearBtn.addEventListener('click', function() {
        if (!searchInput.value) return;
        searchInput.value = '';
        appFilterState.query = '';
        applyAppFilters();
        syncAppSearchControls();
        searchInput.focus();
      });
    }

    syncAppSearchControls();
  }

  function filterWriting(btn, cat) {
    document.querySelectorAll('#page-writing .cat-btn').forEach(function(b) { b.classList.remove('active'); });
    btn.classList.add('active');
    document.querySelectorAll('.wf-item').forEach(function(i) {
      i.style.display = (cat === 'all' || (i.dataset.wcat || '').includes(cat)) ? '' : 'none';
    });
  }

  /* ── ARTICLE VIEW ── */
  function showArticle(slug) {
    var src = document.getElementById('article-' + slug);
    if (!src) return;
    document.querySelector('.wf-filters').style.display = 'none';
    document.getElementById('writing-list').style.display = 'none';
    document.getElementById('article-cat').textContent = src.dataset.cat;
    document.getElementById('article-title').textContent = src.dataset.title;
    document.getElementById('article-meta').textContent = src.dataset.meta;
    document.getElementById('article-body').innerHTML = src.innerHTML;
    var detail = document.getElementById('article-detail');
    detail.style.display = 'block';
    window.scrollTo(0, 0);

    // Focus article title for screen readers
    var titleEl = document.getElementById('article-title');
    if (titleEl) {
      titleEl.setAttribute('tabindex', '-1');
      titleEl.focus({ preventScroll: true });
    }
  }

  function backToWriting(silent) {
    var detail = document.getElementById('article-detail');
    if (!detail) return;
    detail.style.display = 'none';
    document.getElementById('article-body').innerHTML = '';
    var filters = document.querySelector('.wf-filters');
    if (filters) filters.style.display = '';
    var list = document.getElementById('writing-list');
    if (list) list.style.display = '';
    if (!silent) {
      window.scrollTo(0, 0);
      // Return focus to writing heading
      var heading = document.querySelector('#page-writing .page-h');
      if (heading) {
        heading.setAttribute('tabindex', '-1');
        heading.focus({ preventScroll: true });
      }
    }
  }

  // Expose for router
  window.showArticle = showArticle;
  window.backToWriting = backToWriting;

  /* ── CONTACT FORM VALIDATION ── */
  function submitForm(btn, type) {
    var lane = btn.closest('.contact-lane');
    var form = lane.querySelector('form');

    // Clear previous errors
    lane.querySelectorAll('.field-error').forEach(function(e) { e.remove(); });
    lane.querySelectorAll('.has-error').forEach(function(e) { e.classList.remove('has-error'); });
    var existingMsg = lane.querySelector('.form-msg');
    if (existingMsg) existingMsg.remove();

    var valid = true;

    // Validate required fields
    lane.querySelectorAll('.fi[required], .fta[required]').forEach(function(inp) {
      if (!inp.value.trim()) {
        valid = false;
        inp.classList.add('has-error');
        addFieldError(inp, 'This field is required');
      }
    });

    // Check email format
    var email = lane.querySelector('input[type="email"]');
    if (email && email.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
      valid = false;
      email.classList.add('has-error');
      // Remove existing required error if any
      var prev = email.parentElement.querySelector('.field-error');
      if (prev) prev.remove();
      addFieldError(email, 'Please enter a valid email address');
    }

    // Legal form: check acknowledgment
    if (type === 'legal') {
      var ack = document.getElementById('ack');
      if (ack && !ack.checked) {
        valid = false;
        ack.parentElement.classList.add('has-error');
        addFieldError(ack.parentElement, 'Please acknowledge the disclaimer');
      }
    }

    var msg = document.createElement('div');
    msg.className = 'form-msg';
    msg.setAttribute('role', 'alert');
    msg.setAttribute('aria-live', 'polite');

    if (!valid) {
      msg.classList.add('error');
      msg.textContent = 'Please fix the errors above.';
    } else {
      msg.classList.add('info');
      msg.innerHTML = 'Form submission is not yet connected. For now, please reach out via <a href="https://www.linkedin.com/in/tarunagarwal10/" target="_blank">LinkedIn</a>, <a href="https://x.com/tarunag10" target="_blank">X / Twitter</a>, or <a href="https://linktr.ee/tarunag10" target="_blank">Linktree</a>.';
      // Reset form fields
      lane.querySelectorAll('.fi, .fta').forEach(function(f) { f.value = ''; });
      var sel = lane.querySelector('.fsel');
      if (sel) sel.selectedIndex = 0;
      var ackBox = lane.querySelector('#ack');
      if (ackBox) ackBox.checked = false;
    }

    btn.insertAdjacentElement('afterend', msg);
    setTimeout(function() { if (msg.parentNode) msg.remove(); }, 7000);
  }

  function addFieldError(el, message) {
    var span = document.createElement('span');
    span.className = 'field-error';
    span.setAttribute('role', 'alert');
    span.textContent = message;
    el.parentElement.appendChild(span);
  }

  // Clear field errors on input
  document.addEventListener('input', function(e) {
    var el = e.target;
    if (el.classList.contains('has-error')) {
      el.classList.remove('has-error');
      var err = el.parentElement.querySelector('.field-error');
      if (err) err.remove();
    }
  });

  /* ── INTERSECTION OBSERVER (scroll-triggered animations) ── */
  var _fadeObserver;
  function _observeFadeUps() {
    if (!_fadeObserver) {
      _fadeObserver = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            _fadeObserver.unobserve(entry.target);
          }
        });
      }, { threshold: 0.1 });
    }
    document.querySelectorAll('.page.active .fade-up:not(.visible)').forEach(function(el) {
      _fadeObserver.observe(el);
    });
  }
  window._observeFadeUps = _observeFadeUps;

  /* ── HERO TEXT ROTATOR ── */
  var _heroWords = ['builds', 'ships', 'designs'];
  var _heroIdx = 0;
  function _rotateHero() {
    var el = document.getElementById('hero-word');
    if (!el) return;
    el.classList.add('swap');
    setTimeout(function() {
      _heroIdx = (_heroIdx + 1) % _heroWords.length;
      el.textContent = _heroWords[_heroIdx];
      el.classList.remove('swap');
    }, 400);
  }
  setInterval(_rotateHero, 3000);

  /* ── BACK-TO-TOP BUTTON ── */
  window.addEventListener('scroll', function() {
    var btn = document.getElementById('back-to-top');
    if (btn) btn.classList.toggle('show', window.scrollY > 400);
  });

  /* ── INIT ── */
  document.addEventListener('DOMContentLoaded', function() {
    bindAppSearch();
    applyAppFilters();
    _observeFadeUps();
    // Make hero elements visible immediately
    document.querySelectorAll('.hero .fade-up, .hero-badge, .hero-h1, .hero-sub, .hero-actions, .hero-stats').forEach(function(el) {
      el.classList.add('visible');
    });
  });
})();
