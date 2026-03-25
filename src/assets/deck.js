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

    function setSlide(index) {
      if (SLIDE_COUNT < 1) return;
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
      readHash();
    }
  });
})();
