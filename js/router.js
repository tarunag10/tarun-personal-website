/* ═══════════════════════════════════════
   HASH-BASED ROUTER
   Handles page navigation, article deep-links,
   back/forward support, and URL state.
═══════════════════════════════════════ */

(function() {
  'use strict';

  var VALID_PAGES = ['home', 'apps', 'legal', 'writing', 'about', 'contact'];

  /**
   * Parse the current hash into a route object.
   * Returns { page: string, article: string|null }
   */
  function parseHash() {
    var hash = location.hash.replace(/^#\/?/, '') || 'home';
    var parts = hash.split('/');
    var page = parts[0] || 'home';

    // Validate page
    if (VALID_PAGES.indexOf(page) === -1) {
      page = 'home';
    }

    var article = null;
    if (page === 'writing' && parts[1]) {
      article = parts[1];
    }

    return { page: page, article: article };
  }

  /**
   * Show a page by id, with fade transition.
   * Manages active states, animations, and focus.
   */
  function showPage(pageId, skipTransition) {
    var current = document.querySelector('.page.active');
    var target = document.getElementById('page-' + pageId);
    if (!target) return;

    // Close mobile menu
    document.querySelector('nav').classList.remove('nav-open');
    var hamburger = document.querySelector('.hamburger');
    if (hamburger) {
      hamburger.classList.remove('active');
      hamburger.setAttribute('aria-expanded', 'false');
    }

    // Update nav active state + aria-current
    document.querySelectorAll('.nav-links a').forEach(function(a) {
      a.classList.remove('active');
      a.removeAttribute('aria-current');
    });
    var navLink = document.getElementById('n-' + pageId);
    if (navLink) {
      navLink.classList.add('active');
      navLink.setAttribute('aria-current', 'page');
    }

    // Update aria-hidden on pages
    document.querySelectorAll('.page').forEach(function(p) {
      p.setAttribute('aria-hidden', 'true');
    });

    if (current === target && !skipTransition) return;

    if (skipTransition || !current) {
      // Initial load — no animation
      if (current && current !== target) {
        current.classList.remove('active');
      }
      target.classList.add('active');
      target.removeAttribute('aria-hidden');
      window.scrollTo(0, 0);
      window._observeFadeUps();
      focusPageHeading(target);
      return;
    }

    // Fade transition
    current.classList.add('fade-out');
    setTimeout(function() {
      current.classList.remove('active', 'fade-out');
      current.setAttribute('aria-hidden', 'true');
      target.classList.add('active');
      target.removeAttribute('aria-hidden');
      window.scrollTo(0, 0);

      // Re-trigger fade-up animations
      target.querySelectorAll('.fade-up').forEach(function(el) {
        el.classList.remove('visible');
        el.style.animation = 'none';
        void el.offsetWidth;
        el.style.animation = '';
      });
      window._observeFadeUps();
      focusPageHeading(target);
    }, 200);
  }

  /**
   * Move focus to the first heading in a page for screen readers.
   */
  function focusPageHeading(pageEl) {
    var heading = pageEl.querySelector('h1, h2');
    if (heading) {
      heading.setAttribute('tabindex', '-1');
      heading.focus({ preventScroll: true });
    }
  }

  /**
   * Main route handler — called on hashchange and initial load.
   */
  function handleRoute(skipTransition) {
    var route = parseHash();

    // Show the page
    showPage(route.page, skipTransition);

    // Handle article deep-link
    if (route.page === 'writing' && route.article) {
      // Small delay to ensure page is visible
      setTimeout(function() {
        window.showArticle(route.article);
      }, skipTransition ? 0 : 250);
    } else if (route.page === 'writing') {
      // Make sure we're showing the list, not an article
      window.backToWriting(true);
    }
  }

  /**
   * Navigate to a page. Sets the hash which triggers handleRoute.
   */
  function go(id) {
    location.hash = '#/' + id;
  }

  /**
   * Navigate to an article. Sets the hash which triggers handleRoute.
   */
  function goArticle(slug) {
    location.hash = '#/writing/' + slug;
  }

  // Expose globally
  window.go = go;
  window.goArticle = goArticle;
  window.handleRoute = handleRoute;

  // Listen for hash changes (back/forward buttons)
  window.addEventListener('hashchange', function() {
    handleRoute(false);
  });

  // Initial route on page load
  document.addEventListener('DOMContentLoaded', function() {
    // Set initial hash if none
    if (!location.hash || location.hash === '#' || location.hash === '#/') {
      // Don't push state, just handle as home
      handleRoute(true);
    } else {
      handleRoute(true);
    }
  });
})();
