/**
 * Roofwander Pitch Deck — Slide-based deck
 * Handles: slide navigation, hash sync, card details, dropdowns, disclosure, Ask donut
 */
(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', function () {

    // ——— Slide state & DOM ———
    var SLIDE_COUNT = 13;
    var activeIndex = -1;
    var track = document.querySelector('.deck-track');
    var slides = document.querySelectorAll('.deck-slide');
    var prevBtn = document.querySelector('.deck-arrow--prev');
    var nextBtn = document.querySelector('.deck-arrow--next');
    var navLinks = document.querySelectorAll('.deck-nav a[data-slide]');
    var progressEl = document.querySelector('.deck-progress');

    function setSlide(index) {
      index = Math.max(0, Math.min(index, SLIDE_COUNT - 1));
      activeIndex = index;
      if (track) {
        track.style.transform = 'translateX(-' + (index * 100) + 'vw)';
      }
      navLinks.forEach(function (a) {
        var i = parseInt(a.getAttribute('data-slide'), 10);
        a.classList.toggle('active', i === index);
      });
      if (progressEl) {
        progressEl.textContent = (index + 1) + ' / ' + SLIDE_COUNT;
      }
      var hash = '#slide-' + index;
      if (window.location.hash !== hash) {
        history.replaceState(null, '', hash);
      }

      slides.forEach(function (s) { s.classList.remove('anim-active'); });
      var target = slides[index];
      if (target) {
        var inner = target.querySelector('.deck-slide-inner');
        if (inner) inner.scrollTop = 0;
        void target.offsetHeight;
        window.requestAnimationFrame(function () {
          window.requestAnimationFrame(function () {
            target.classList.add('anim-active');
          });
        });
      }
    }

    function goToSlide(index) {
      setSlide(index);
    }

    function goPrev() {
      if (activeIndex > 0) goToSlide(activeIndex - 1);
    }

    function goNext() {
      if (activeIndex < SLIDE_COUNT - 1) goToSlide(activeIndex + 1);
    }

    function readHash() {
      var hash = window.location.hash;
      var m = hash && hash.match(/^#slide-(\d+)$/);
      if (m) {
        var i = parseInt(m[1], 10);
        if (i >= 0 && i < SLIDE_COUNT) {
          setSlide(i);
          return;
        }
      }
      setSlide(0);
    }

    if (track) {
      window.addEventListener('hashchange', readHash);
      if (prevBtn) prevBtn.addEventListener('click', goPrev);
      if (nextBtn) nextBtn.addEventListener('click', goNext);
      navLinks.forEach(function (a) {
        a.addEventListener('click', function (e) {
          e.preventDefault();
          var i = parseInt(a.getAttribute('data-slide'), 10);
          if (!isNaN(i)) goToSlide(i);
        });
      });
      document.addEventListener('keydown', function (e) {
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
        if (e.key === 'ArrowLeft') { e.preventDefault(); goPrev(); }
        if (e.key === 'ArrowRight') { e.preventDefault(); goNext(); }
      });
      readHash();
    }

    /* Disclosure (hero) is handled by the inline script in the hero slide. */

    // ——— Generic dropdown (defined but not called; inline scripts per slide handle dropdowns) ———
    function initDropdowns(selector, headerSel, bodySel, closeOthers) {
      var dropdowns = document.querySelectorAll(selector);
      if (!dropdowns.length) return;
      function closeAll(except) {
        dropdowns.forEach(function (dd) {
          if (dd === except) return;
          dd.classList.remove('open');
          var h = dd.querySelector(headerSel);
          var b = dd.querySelector(bodySel);
          if (h) h.setAttribute('aria-expanded', 'false');
          if (b) b.setAttribute('aria-hidden', 'true');
        });
      }
      dropdowns.forEach(function (dd) {
        var header = dd.querySelector(headerSel);
        var body = dd.querySelector(bodySel);
        if (!header || !body) return;
        header.addEventListener('click', function () {
          var isOpen = dd.classList.contains('open');
          if (isOpen) {
            dd.classList.remove('open');
            header.setAttribute('aria-expanded', 'false');
            body.setAttribute('aria-hidden', 'true');
          } else {
            if (closeOthers) closeAll(dd);
            dd.classList.add('open');
            header.setAttribute('aria-expanded', 'true');
            body.setAttribute('aria-hidden', 'false');
          }
        });
      });
    }

    /* Dropdowns, ask donut, and card clicks are handled by inline scripts in each slide.
       deck.js initDropdowns/initAskDonut/initCardClick caused duplicate handlers and
       broke Solution, Roadmap, Traction, UE, Finance, Team slides. */

    // ——— Clickable deck-cards with detail panel ———
    (function initCardDetails() {
      var cards = document.querySelectorAll('.deck-card[data-detail], [data-detail].deck-card');
      cards = Array.prototype.filter.call(cards, function (c) { return !c.closest('.system-section'); });
      cards.forEach(function (card) {
        var group = card.closest('.deck-card-group');
        var detail = group ? group.querySelector('.deck-card-detail') : card.nextElementSibling;
        if (!detail || !detail.classList.contains('deck-card-detail')) return;
        var dataDetail = card.getAttribute('data-detail');
        var hasContent = detail.innerHTML.trim().length > 0;

        function showDetail() {
          if (!hasContent && dataDetail) {
            detail.textContent = dataDetail;
            detail.dataset.populatedFromAttr = 'true';
          }
          card.classList.add('deck-card--active');
          detail.classList.add('is-visible');
        }

        function hideDetail() {
          card.classList.remove('deck-card--active');
          if (detail.dataset.populatedFromAttr === 'true') {
            detail.textContent = '';
            delete detail.dataset.populatedFromAttr;
          }
          detail.classList.remove('is-visible');
        }

        function toggleDetail() {
          var isActive = card.classList.contains('deck-card--active');
          var slide = card.closest('.deck-slide');
          if (slide) {
            slide.querySelectorAll('.deck-card--active').forEach(function (c) {
              if (c !== card) {
                var g = c.closest('.deck-card-group');
                var d = g ? g.querySelector('.deck-card-detail') : c.nextElementSibling;
                if (d && d.classList.contains('deck-card-detail')) {
                  if (d.dataset.populatedFromAttr === 'true') {
                    d.textContent = '';
                    delete d.dataset.populatedFromAttr;
                  }
                  d.classList.remove('is-visible');
                }
                c.classList.remove('deck-card--active');
              }
            });
          }
          if (isActive) hideDetail();
          else showDetail();
        }

        card.addEventListener('click', toggleDetail);
        card.addEventListener('keydown', function (e) {
          if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggleDetail(); }
        });
      });
    })();

  });
})();
