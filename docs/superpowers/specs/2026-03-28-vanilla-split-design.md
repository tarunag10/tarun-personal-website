# Vanilla Split: Routing, Accessibility, Forms & File Organization

**Date:** 2026-03-28
**Status:** Approved
**Approach:** A — Vanilla Split (zero dependencies, no build step)

---

## Summary

Split the 1,862-line single-file SPA into separate CSS/JS files. Add hash-based URL routing for bookmarkable pages and shareable article links. Overhaul accessibility with semantic HTML, ARIA attributes, keyboard navigation, and focus management. Fix contact forms to show honest placeholder messaging instead of fake "Message sent!" confirmations. Clean up stale files and inconsistent data attributes.

---

## File Structure

```
index.html                  → HTML shell + all page content (semantic markup)
css/styles.css              → All CSS extracted from <style> block
js/router.js                → Hash-based page routing + navigation
js/app.js                   → Filters, forms, animations, hero rotator
files/*.md                  → Article source files (unchanged, for reference)
docs/superpowers/specs/     → This spec
```

**Files to delete:**
- `personal-brand-site.html` — stale 1,543-line duplicate of an earlier version
- `.gitignore 2` — accidental duplicate gitignore

---

## 1. Hash-Based Routing (`js/router.js`)

### URL Scheme

| Hash | Page |
|------|------|
| `#/` or `#/home` | Home |
| `#/apps` | Apps |
| `#/legal` | Legal |
| `#/writing` | Writing list |
| `#/writing/<slug>` | Article deep-link |
| `#/about` | About |
| `#/contact` | Contact |

### Behavior

- On page load: read `window.location.hash`, show the corresponding page. Default to `#/home` if empty or invalid.
- Navigation: `go('apps')` sets `location.hash = '#/apps'`. The `hashchange` event listener handles the actual page transition (fade-out current, fade-in target, scroll to top).
- Article deep-links: `#/writing/legal-search` navigates to the writing page and opens the article with slug `legal-search`.
- Back/forward buttons work natively — the `hashchange` event fires on browser navigation.
- Nav active state updates based on current hash.
- Invalid hashes fall back to home page.

### Implementation Details

- Single `handleRoute()` function parses the hash and delegates to page show or article show.
- `go(id)` becomes a thin wrapper: `location.hash = '#/' + id`.
- Article navigation: `goArticle(slug)` sets `location.hash = '#/writing/' + slug`.
- `window.addEventListener('hashchange', handleRoute)` — the single entry point for all navigation.
- `window.addEventListener('DOMContentLoaded', handleRoute)` — initial route on page load.
- Page transition logic (fade-out/fade-in, scroll reset, observer re-trigger) moves from inline `go()` to `handleRoute()`.

---

## 2. Accessibility Overhaul

### Semantic HTML

- Each `<div class="page">` wraps its content in `<main id="main-content">` (only the active page's main is in the DOM flow).
- Article view uses `<article>` element.
- `<nav>` gets `aria-label="Main navigation"`.
- `<footer>` already semantic — no changes needed.
- Heading hierarchy is correct (h1 in hero, h2 for sections) — keep as-is.

### Skip Navigation

Add as the first child of `<body>`:
```html
<a href="#main-content" class="skip-link">Skip to content</a>
```

CSS: visually hidden, becomes visible on focus. Positioned absolutely at top-left.

### Remove Inline Event Handlers

Replace all `onclick` attributes with data attributes + JS event delegation:

| Current | New |
|---------|-----|
| `onclick="go('apps')"` | `data-navigate="apps"` |
| `onclick="filterCat(this, 'legal')"` | `data-filter="legal"` |
| `onclick="filterWriting(this, 'ai')"` | `data-wfilter="ai"` |
| `onclick="showArticle('legal-search')"` | `data-article="legal-search"` |
| `onclick="backToWriting()"` | `data-action="back-to-writing"` |
| `onclick="submitForm(this, 'product')"` | `data-submit="product"` |
| `onclick="toggleMenu()"` | `data-action="toggle-menu"` |
| `onclick="scrollTo(0,0)"` (back-to-top) | `data-action="scroll-top"` |

Event delegation in `js/app.js`:
```js
document.addEventListener('click', function(e) {
  var el = e.target.closest('[data-navigate]');
  if (el) { go(el.dataset.navigate); return; }
  // ... similar for other data attributes
});
```

### Keyboard Navigation

- All interactive elements (cards, filter buttons, nav links) get `tabindex="0"` and `role="button"` where they aren't already `<a>` or `<button>` elements.
- `keydown` listener on delegated elements: Enter and Space trigger click.
- Filter buttons become actual `<button>` elements (they may already be — verify during implementation).

### ARIA Attributes

| Element | Attribute |
|---------|-----------|
| Active nav link | `aria-current="page"` |
| Hamburger button | `aria-label="Toggle navigation menu"`, `aria-expanded="true/false"` |
| Back-to-top button | `aria-label="Back to top"` |
| Category filter group | `role="group"`, `aria-label="Filter by category"` |
| Form message area | `aria-live="polite"` for screen reader announcements |
| Page containers | `aria-hidden="true"` on inactive pages |

### Focus Management

- On page transition: after fade-in completes, set focus to the page's first heading (`h1` or `h2`).
- On article open: focus the article title.
- On article close (back to writing): return focus to the writing list heading.
- Focus outlines: ensure `:focus-visible` styles are present (gold outline for keyboard users, no outline for mouse clicks).

---

## 3. Contact Form Fixes

### Current Problem

`submitForm()` displays "Message sent! I'll get back to you soon." but never actually sends data. Users believe their message was delivered.

### Solution

- Wrap form fields in `<form novalidate>` elements (JS handles validation).
- Keep HTML5 `required` and `type="email"` for baseline accessibility.
- JS validation shows inline error messages per field (not just red border):
  - Empty required field: "This field is required"
  - Invalid email: "Please enter a valid email address"
  - Unchecked acknowledgment (legal form): "Please acknowledge the disclaimer"
- Error messages appear below each field in a `<span class="field-error">` element.
- On "submit" with valid data, show an **honest info message**:
  > "Form submission is not yet connected. For now, please reach out directly at [email] or via LinkedIn."
- Style this as `.form-msg.info` (blue/neutral tone, not green success).
- Add a visible `mailto:` link in each contact lane as a reliable fallback.
- Remove the misleading "Message sent!" text entirely.

### Validation Behavior

- Validate on submit attempt (not on blur — too aggressive for a simple contact form).
- Clear field errors when user starts typing in that field.
- Clear all errors when form is reset.

---

## 4. CSS Extraction (`css/styles.css`)

Move the entire `<style>...</style>` block (585 lines) to `css/styles.css`. No CSS changes beyond:

- Add `.skip-link` styles (visually hidden, visible on focus).
- Add `.field-error` styles (inline form error messages).
- Add `.form-msg.info` styles (blue/neutral info message).
- Add `:focus-visible` outline styles for keyboard navigation.

Load via `<link rel="stylesheet" href="css/styles.css">` in the `<head>`.

---

## 5. JS Extraction

### `js/router.js`
- `handleRoute()` — parse hash, show page or article
- `go(id)` — set hash for page navigation
- `goArticle(slug)` — set hash for article deep-link
- Page transition logic (fade-out/fade-in/scroll/observer)
- `hashchange` and `DOMContentLoaded` listeners

### `js/app.js`
- Event delegation handler (click + keydown)
- `toggleMenu()` — hamburger menu
- `filterCat()` — apps category filter
- `filterWriting()` — writing category filter
- `showArticle()` / `backToWriting()` — article view (called by router)
- `submitForm()` — form validation with honest messaging
- `_observeFadeUps()` — IntersectionObserver for animations
- `_rotateHero()` — hero text rotator
- Back-to-top scroll listener
- DOMContentLoaded init

Load order in `index.html`:
```html
<script src="js/router.js"></script>
<script src="js/app.js"></script>
```

Both at the end of `<body>`, before `</body>`.

---

## 6. Data Cleanup

### Normalize `data-cat` Values

Current inconsistency:
- `"legal"` vs `"Legal Tech · AI"` vs `"AI · Search"`
- `"ai productivity"` vs `"Arbitration · India"`

Normalize all to lowercase, space-separated tokens:
- `"legal"`, `"legal-tech ai"`, `"ai search"`, `"ai productivity"`, `"arbitration"`, `"edtech legal"`, `"finance"`, `"finance legal"`, `"extension productivity"`, `"lifestyle productivity"`, `"product legal-tech"`, `"product indie"`

Update filter button `onclick`/`data-filter` values to match.

### Normalize `data-wcat` Values

Already lowercase — no changes needed.

---

## Out of Scope

- No framework migration (staying vanilla)
- No build step or bundler
- No actual form submission backend (placeholder messaging only)
- No markdown rendering at runtime (articles stay as inline HTML)
- No new pages or content
- No design system changes (colors, fonts, layout remain the same)

---

## Verification Checklist

- [ ] All 6 pages reachable via hash URLs
- [ ] Articles open via `#/writing/<slug>` — shareable link works on fresh page load
- [ ] Browser back/forward navigates correctly between pages and articles
- [ ] Default route (`#/` or no hash) shows home page
- [ ] Invalid hash falls back to home
- [ ] Tab through entire site — all interactive elements reachable
- [ ] Screen reader announces page transitions and form errors
- [ ] Skip-nav link visible on focus, jumps to main content
- [ ] Hamburger button announces expanded/collapsed state
- [ ] No `onclick` attributes remain in HTML
- [ ] Contact form shows field-level errors for invalid input
- [ ] Contact form shows honest "not connected" message on valid submit
- [ ] CSS loads from `css/styles.css` — no inline `<style>` block
- [ ] JS loads from `js/router.js` and `js/app.js` — no inline `<script>` blocks (except Vercel analytics)
- [ ] `personal-brand-site.html` and `.gitignore 2` deleted
- [ ] Category filters work with normalized `data-cat` values
- [ ] Site renders identically before and after split (visual regression check)
