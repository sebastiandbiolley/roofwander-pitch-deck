/**
 * Roofwander Pitch Deck — Slide chrome only (horizontal deck).
 * Shared interactions live in deck-behaviors.js.
 */
(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', function () {
    var track = document.querySelector('.deck-track');
    var slides = document.querySelectorAll('.deck-slide');
    var SLIDE_COUNT = slides.length;
    var activeIndex = -1;
    var prevBtn = document.querySelector('.deck-arrow--prev');
    var nextBtn = document.querySelector('.deck-arrow--next');
    var navLinks = document.querySelectorAll('.deck-nav a[data-slide]');
    var progressEl = document.querySelector('.deck-progress');

    // Mobile bottom bar
    var bottomPrev = document.querySelector('.deck-bottom-bar-prev');
    var bottomNext = document.querySelector('.deck-bottom-bar-next');
    var bottomCounter = document.querySelector('.deck-bottom-bar-counter');
    var bottomFill = document.querySelector('.deck-bottom-bar-fill');
    var swipeHint = document.querySelector('.deck-swipe-hint');

    function updateArrows() {
      if (prevBtn) prevBtn.classList.toggle('deck-arrow--hidden', activeIndex <= 0);
      if (nextBtn) nextBtn.classList.toggle('deck-arrow--hidden', activeIndex >= SLIDE_COUNT - 1);
      if (bottomPrev) bottomPrev.classList.toggle('is-disabled', activeIndex <= 0);
      if (bottomNext) bottomNext.classList.toggle('is-disabled', activeIndex >= SLIDE_COUNT - 1);
    }

    function setSlide(index) {
      if (SLIDE_COUNT < 1) return;
      index = Math.max(0, Math.min(index, SLIDE_COUNT - 1));
      activeIndex = index;
      if (track) {
        track.style.transform = 'translateX(-' + (index * 100) + 'vw)';
      }
      var activeLink = null;
      navLinks.forEach(function (a) {
        var i = parseInt(a.getAttribute('data-slide'), 10);
        var isActive = i === index;
        a.classList.toggle('active', isActive);
        if (isActive) activeLink = a;
      });
      // Scroll active link into view in the nav
      if (activeLink) {
        var center = activeLink.closest('.deck-nav-center');
        if (center) {
          var linkLeft = activeLink.offsetLeft - center.offsetLeft;
          var scrollTarget = linkLeft - (center.clientWidth / 2) + (activeLink.offsetWidth / 2);
          center.scrollTo({ left: scrollTarget, behavior: 'smooth' });
        }
      }
      if (progressEl) {
        progressEl.textContent = (index + 1) + ' / ' + SLIDE_COUNT;
      }
      // Sync mobile bottom bar
      if (bottomCounter) {
        bottomCounter.textContent = (index + 1) + ' / ' + SLIDE_COUNT;
      }
      if (bottomFill) {
        bottomFill.style.width = (((index + 1) / SLIDE_COUNT) * 100) + '%';
      }
      var hash = '#slide-' + index;
      if (window.location.hash !== hash) {
        history.replaceState(null, '', hash);
      }
      updateArrows();

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
        if (SLIDE_COUNT > 0 && i >= 0 && i < SLIDE_COUNT) {
          setSlide(i);
          return;
        }
      }
      setSlide(0);
    }

    if (track && SLIDE_COUNT > 0) {
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

      // Mobile bottom bar buttons
      if (bottomPrev) bottomPrev.addEventListener('click', goPrev);
      if (bottomNext) bottomNext.addEventListener('click', goNext);

      // Dismiss swipe hint on first interaction
      function dismissHint() {
        if (swipeHint) {
          swipeHint.style.opacity = '0';
          setTimeout(function () { swipeHint.style.display = 'none'; }, 300);
          swipeHint = null;
        }
      }

      // Touch swipe support
      var touchStartX = 0;
      var touchStartY = 0;
      var swiping = false;
      var SWIPE_THRESHOLD = 50;

      document.addEventListener('touchstart', function (e) {
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
        swiping = true;
      }, { passive: true });

      document.addEventListener('touchend', function (e) {
        if (!swiping) return;
        swiping = false;
        var dx = e.changedTouches[0].clientX - touchStartX;
        var dy = e.changedTouches[0].clientY - touchStartY;
        if (Math.abs(dx) < SWIPE_THRESHOLD || Math.abs(dy) > Math.abs(dx)) return;
        dismissHint();
        if (dx < 0) goNext();
        else goPrev();
      }, { passive: true });

      readHash();
    }
  });
})();
