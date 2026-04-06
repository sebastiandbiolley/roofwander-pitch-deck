/**
 * Roofwander — Navigation behaviors.
 * Mobile hamburger menu + desktop scroll spy, elevation, progress bar.
 * Works on all pages: home, how-it-works, and deck.
 */
(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', function () {

    /* ----------------------------------------------------------------
       1. MOBILE MENU
       ---------------------------------------------------------------- */
    var toggle = document.querySelector('.mobile-menu-toggle');
    var menu = document.querySelector('.mobile-menu');

    if (toggle && menu) {
      var closeBtn = menu.querySelector('.mobile-menu-close');
      var links = menu.querySelectorAll('.mobile-menu-nav a');

      function open() {
        toggle.setAttribute('aria-expanded', 'true');
        menu.classList.add('is-open');
        menu.setAttribute('aria-hidden', 'false');
        document.body.classList.add('mobile-menu-open');
      }

      function close() {
        toggle.setAttribute('aria-expanded', 'false');
        menu.classList.remove('is-open');
        menu.setAttribute('aria-hidden', 'true');
        document.body.classList.remove('mobile-menu-open');
      }

      toggle.addEventListener('click', function () { open(); });

      if (closeBtn) {
        closeBtn.addEventListener('click', function () { close(); });
      }

      links.forEach(function (link) {
        link.addEventListener('click', function (e) {
          var slideIdx = link.getAttribute('data-slide');
          if (slideIdx !== null) {
            e.preventDefault();
            var desktopLink = document.querySelector('.deck-nav-center a[data-slide="' + slideIdx + '"]');
            if (desktopLink) desktopLink.click();
          }
          close();
        });
      });

      document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && menu.classList.contains('is-open')) {
          close();
          toggle.focus();
        }
      });

      // Sync deck slide active states into mobile menu
      var deckProgress = menu.querySelector('.mobile-menu-progress');
      function syncMobileMenu() {
        var dp = document.querySelector('.deck-nav .deck-progress');
        if (dp && deckProgress) deckProgress.textContent = dp.textContent;

        document.querySelectorAll('.deck-nav-center a[data-slide]').forEach(function (dl) {
          var idx = dl.getAttribute('data-slide');
          var ml = menu.querySelector('a[data-slide="' + idx + '"]');
          if (ml) ml.classList.toggle('active', dl.classList.contains('active'));
        });
      }

      var navEl = document.querySelector('.deck-nav');
      if (navEl) {
        var observer = new MutationObserver(syncMobileMenu);
        observer.observe(navEl, { subtree: true, attributes: true, attributeFilter: ['class'], characterData: true, childList: true });
        // Initial sync
        syncMobileMenu();
      }
    }

    /* ----------------------------------------------------------------
       2. SCROLL ELEVATION (all pages)
       Add .is-scrolled to topbar/nav when user scrolls past threshold
       ---------------------------------------------------------------- */
    var topbar = document.querySelector('.home-topbar') || document.querySelector('.deck-nav');
    if (topbar) {
      var threshold = 10;
      function updateElevation() {
        var scrollY = window.scrollY || document.documentElement.scrollTop || 0;
        topbar.classList.toggle('is-scrolled', scrollY > threshold);
      }
      window.addEventListener('scroll', updateElevation, { passive: true });
      updateElevation();
    }

    /* ----------------------------------------------------------------
       3. SCROLL SPY (home pages only)
       Highlights the nav link matching the section currently in view
       ---------------------------------------------------------------- */
    var spyLinks = document.querySelectorAll('.home-nav a[data-scroll-spy]');
    if (spyLinks.length > 0) {
      var sections = [];
      spyLinks.forEach(function (a) {
        var href = a.getAttribute('href');
        if (href && href.charAt(0) === '#') {
          var target = document.querySelector(href);
          if (target) sections.push({ el: target, link: a });
        }
      });

      function updateSpy() {
        var scrollPos = window.scrollY + 120; // offset for sticky nav
        var activeLink = null;

        for (var i = sections.length - 1; i >= 0; i--) {
          if (sections[i].el.offsetTop <= scrollPos) {
            activeLink = sections[i].link;
            break;
          }
        }

        spyLinks.forEach(function (a) { a.classList.remove('is-active'); });
        if (activeLink) activeLink.classList.add('is-active');
      }

      window.addEventListener('scroll', updateSpy, { passive: true });
      updateSpy();
    }

    /* ----------------------------------------------------------------
       4. DECK PROGRESS BAR
       Thin green bar under deck-nav showing slide progression
       ---------------------------------------------------------------- */
    var progressFill = document.querySelector('.deck-nav-progress-fill');
    if (progressFill) {
      function updateProgressBar() {
        var progressText = document.querySelector('.deck-progress');
        if (!progressText) return;
        var parts = progressText.textContent.split('/');
        if (parts.length === 2) {
          var current = parseInt(parts[0].trim(), 10);
          var total = parseInt(parts[1].trim(), 10);
          if (total > 0) {
            progressFill.style.width = ((current / total) * 100) + '%';
          }
        }
      }

      // Observe changes to progress text
      var progressEl = document.querySelector('.deck-progress');
      if (progressEl) {
        var progObserver = new MutationObserver(updateProgressBar);
        progObserver.observe(progressEl, { childList: true, characterData: true, subtree: true });
        updateProgressBar();
      }
    }

  });
})();
