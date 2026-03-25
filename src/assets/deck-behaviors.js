/**
 * Roofwander pitch deck — shared interactions for standalone slides and inlined deck bodies.
 * Loaded once per page; deck.html also loads deck.js for slide chrome only.
 */
(function () {
  'use strict';

  function closestScope(el) {
    return el.closest('.deck-slide') || el.closest('.deck-section') || document.body;
  }

  function initAccordionGroup(rootSel, headerSel, bodySel, options) {
    var opts = options || {};
    var mode = opts.mode || 'toggle';
    var scrollOnOpen = !!opts.scrollOnOpen;

    var dropdowns = document.querySelectorAll(rootSel);
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
        if (mode === 'swap') {
          var wasOpen = dd.classList.contains('open');
          if (wasOpen) {
            dd.classList.remove('open');
            header.setAttribute('aria-expanded', 'false');
            body.setAttribute('aria-hidden', 'true');
          } else {
            closeAll(dd);
            dd.classList.add('open');
            header.setAttribute('aria-expanded', 'true');
            body.setAttribute('aria-hidden', 'false');
            if (scrollOnOpen) {
              setTimeout(function () {
                body.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'nearest' });
              }, 100);
            }
          }
        } else {
          var isOpen = dd.classList.toggle('open');
          header.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
          body.setAttribute('aria-hidden', isOpen ? 'false' : 'true');
          if (isOpen) {
            closeAll(dd);
            if (scrollOnOpen) {
              setTimeout(function () {
                body.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'nearest' });
              }, 100);
            }
          }
        }
      });
    });
  }

  function initDisclosureDelegation() {
    document.addEventListener('click', function (e) {
      var trigger = e.target.closest('.disclosure-trigger');
      if (!trigger) return;
      var disclosure = trigger.closest('.disclosure');
      if (!disclosure) return;
      e.preventDefault();
      var open = disclosure.classList.toggle('open');
      trigger.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  }

  function initExclusivePin(cardSelector) {
    var cards = document.querySelectorAll(cardSelector);
    if (!cards.length) return;
    cards.forEach(function (card) {
      card.addEventListener('click', function (e) {
        e.preventDefault();
        var wasPinned = card.classList.contains('pinned');
        cards.forEach(function (c) { c.classList.remove('pinned'); });
        if (!wasPinned) card.classList.add('pinned');
      });
    });
  }

  function initSystemDiagramPins() {
    var cards = document.querySelectorAll('.system-diagram-root .card[data-detail]');
    if (!cards.length) return;
    cards.forEach(function (card) {
      var detail = card.querySelector('.card-detail');
      if (detail) detail.textContent = card.getAttribute('data-detail') || '';
      card.addEventListener('click', function (e) {
        e.preventDefault();
        var wasPinned = card.classList.contains('pinned');
        cards.forEach(function (c) { c.classList.remove('pinned'); });
        if (!wasPinned) card.classList.add('pinned');
      });
    });
  }

  function initMarketTrendsChart() {
    var svg = document.querySelector('.market-chart--trends');
    if (!svg) return;

    var de = [8,7,8,9,12,13,14,16,11,8,7,7,10,12,10,12,16,16,17,25,14,11,9,9,14,16,16,18,24,29,39,33,21,17,12,12,18,29,24,27,34,38,44,46,37,21,18,18,26,27,19,21,40,56,64,69,43,24,26,20,27,30,39,41,50,58,63,68,44,26,18,18,33,36,34,53,55,75,87,83,49,45,26,24,38,39,48,48,64,79,100,85,59,33,24,24,35,39,45,57,75,70,86,85,53,31,25,22];
    var fr = [4,5,5,11,8,7,11,12,9,5,4,5,7,6,7,7,9,10,15,15,8,7,5,5,6,7,8,10,12,11,13,19,11,7,7,5,8,9,10,12,14,18,19,24,14,11,7,6,11,10,9,15,19,25,36,37,19,9,15,11,12,15,21,22,29,30,49,77,31,23,14,12,20,37,28,34,50,61,87,100,38,26,19,17,20,30,30,46,64,56,80,99,42,22,18,18,23,25,29,33,44,43,57,83,40,20,18,15];
    var us = [11,11,13,15,17,16,19,16,14,12,12,14,22,21,26,25,25,26,35,35,21,18,18,17,20,22,24,25,30,36,37,29,27,23,21,19,24,23,28,33,33,39,39,39,31,27,24,23,26,32,28,31,50,58,72,59,53,46,42,41,52,48,59,58,65,63,65,61,58,44,46,38,48,57,54,63,65,74,76,72,65,56,48,39,49,60,58,66,76,83,88,75,65,56,55,52,59,59,79,80,84,95,86,81,72,60,51,49];
    var w = 920;
    var h = 220;
    var mLeft = 50;
    var mRight = 20;
    var mTop = 20;
    var mBottom = 30;
    var plotW = w - mLeft - mRight;
    var plotH = h - mTop - mBottom;
    var vals = [de, fr, us];
    var colors = ['var(--accent)', '#2563eb', '#ea580c'];
    var cls = ['de', 'fr', 'us'];
    var pts = de.length;
    var html = '';
    var g;
    for (g = 20; g <= 80; g += 20) {
      var gy = mTop + plotH * (1 - g / 100);
      html += '<line class="market-chart-grid" x1="' + mLeft + '" y1="' + gy + '" x2="' + (w - mRight) + '" y2="' + gy + '"/>';
    }
    html += '<line x1="' + mLeft + '" y1="' + mTop + '" x2="' + mLeft + '" y2="' + (h - mBottom) + '" stroke="var(--border)" stroke-width="1"/>';
    html += '<line x1="' + mLeft + '" y1="' + (h - mBottom) + '" x2="' + (w - mRight) + '" y2="' + (h - mBottom) + '" stroke="var(--border)" stroke-width="1"/>';
    html += '<text x="' + (mLeft - 8) + '" y="' + (mTop + 4) + '" class="market-chart-axis" text-anchor="end">100</text>';
    html += '<text x="' + (mLeft - 8) + '" y="' + (mTop + plotH / 2 + 4) + '" class="market-chart-axis" text-anchor="end">50</text>';
    html += '<text x="' + (mLeft - 8) + '" y="' + (h - mBottom) + '" class="market-chart-axis" text-anchor="end">0</text>';
    var r;
    for (r = 0; r < 3; r++) {
      var d = 'M ';
      var i;
      for (i = 0; i < pts; i++) {
        var x = mLeft + (i / (pts - 1)) * plotW;
        var y = mTop + plotH * (1 - vals[r][i] / 100);
        d += (i ? ' L ' : '') + Math.round(x) + ' ' + Math.round(y);
      }
      html += '<path class="market-chart-line market-chart-line--' + cls[r] + '" d="' + d + '" style="stroke:' + colors[r] + '"/>';
    }
    var y;
    for (y = 2016; y <= 2024; y += 2) {
      var yi = (y - 2016) * 12;
      var xx = mLeft + (yi / (pts - 1)) * plotW;
      html += '<text x="' + Math.round(xx) + '" y="' + (h - 8) + '" class="market-chart-axis" text-anchor="middle">' + y + '</text>';
    }
    svg.innerHTML = html;
  }

  function initMarketSearchTrendPanel() {
    var pill = document.querySelector('.market-card[data-market-panel="search-trend"]');
    var detail = document.getElementById('market-detail');
    var closeBtn = detail && detail.querySelector('.market-detail-close');
    if (!pill || !detail) return;

    function openDetail() {
      detail.classList.add('is-open');
      pill.classList.add('market-pill--active');
      setTimeout(function () {
        detail.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'nearest' });
      }, 100);
    }

    function closeDetail() {
      detail.classList.remove('is-open');
      pill.classList.remove('market-pill--active');
    }

    pill.addEventListener('click', function (e) {
      e.preventDefault();
      if (detail.classList.contains('is-open')) closeDetail();
      else openDetail();
    });
    pill.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); pill.click(); }
    });
    if (closeBtn) closeBtn.addEventListener('click', closeDetail);
  }

  function initPositioningSlide() {
    var points = document.querySelectorAll('.pos-point');
    var panel = document.getElementById('pos-panel');
    var titleEl = document.getElementById('pos-panel-title');
    var descEl = document.getElementById('pos-panel-desc');
    if (!points.length || !panel || !titleEl || !descEl) return;

    function selectPoint(point) {
      var wasActive = point.classList.contains('active');
      points.forEach(function (p) {
        p.classList.remove('active', 'faded');
      });
      if (wasActive) {
        panel.classList.remove('is-open');
      } else {
        point.classList.add('active');
        points.forEach(function (p) {
          if (p !== point) p.classList.add('faded');
        });
        titleEl.textContent = point.getAttribute('data-title') || '';
        descEl.textContent = point.getAttribute('data-desc') || '';
        panel.classList.add('is-open');
        panel.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'nearest' });
      }
    }

    points.forEach(function (point) {
      point.addEventListener('click', function (e) {
        e.preventDefault();
        selectPoint(point);
      });
    });
  }

  function initAskSlide() {
    var detail = document.getElementById('ask-detail');
    var closeBtn = detail && detail.querySelector('.ask-detail-close');
    var panels = detail && detail.querySelectorAll('.ask-detail-panel');
    var segments = document.querySelectorAll('[data-ask-segment]');
    var donutSvg = document.querySelector('.ask-donut-overlay');
    if (!detail || !panels || !panels.length) return;

    function openPanel(segmentId) {
      panels.forEach(function (p) {
        var match = p.id === 'panel-' + segmentId;
        p.classList.toggle('is-visible', match);
        p.setAttribute('aria-hidden', match ? 'false' : 'true');
      });
      detail.classList.add('is-open');
      if (donutSvg) {
        donutSvg.querySelectorAll('path').forEach(function (p) {
          p.classList.toggle('ask-segment--active', p.getAttribute('data-ask-segment') === segmentId);
        });
      }
      setTimeout(function () { detail.scrollIntoView({ behavior: 'smooth', block: 'nearest' }); }, 100);
    }

    function closePanel() {
      detail.classList.remove('is-open');
      panels.forEach(function (p) {
        p.classList.remove('is-visible');
        p.setAttribute('aria-hidden', 'true');
      });
      if (donutSvg) {
        donutSvg.querySelectorAll('path').forEach(function (p) {
          p.classList.remove('ask-segment--active');
        });
      }
    }

    segments.forEach(function (seg) {
      var segmentId = seg.getAttribute('data-ask-segment');
      if (!segmentId) return;
      seg.addEventListener('click', function () {
        var panelEl = document.getElementById('panel-' + segmentId);
        var isOpen = detail.classList.contains('is-open') && panelEl && panelEl.classList.contains('is-visible');
        if (isOpen) { closePanel(); return; }
        openPanel(segmentId);
      });
      seg.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); seg.click(); }
      });
    });
    if (closeBtn) closeBtn.addEventListener('click', closePanel);
  }

  function initFinanceSlide() {
    var detail = document.getElementById('finance-detail');
    var closeBtn = detail && detail.querySelector('.finance-detail-close');
    var panels = detail && detail.querySelectorAll('.finance-detail-panel');
    var clickables = document.querySelectorAll('[data-finance-panel]');
    if (!detail || !panels || !panels.length) return;

    function openPanel(panelId) {
      panels.forEach(function (p) {
        var match = p.id === 'panel-' + panelId;
        p.classList.toggle('is-visible', match);
        p.setAttribute('aria-hidden', match ? 'false' : 'true');
      });
      detail.classList.add('is-open');
      clickables.forEach(function (el) {
        el.classList.toggle('finance-panel--active', el.getAttribute('data-finance-panel') === panelId);
      });
      setTimeout(function () {
        detail.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'nearest' });
      }, 100);
    }

    function closePanel() {
      detail.classList.remove('is-open');
      panels.forEach(function (p) {
        p.classList.remove('is-visible');
        p.setAttribute('aria-hidden', 'true');
      });
      clickables.forEach(function (el) { el.classList.remove('finance-panel--active'); });
    }

    clickables.forEach(function (el) {
      el.addEventListener('click', function () {
        var panelId = el.getAttribute('data-finance-panel');
        if (!panelId) return;
        var panelEl = document.getElementById('panel-' + panelId);
        var isAlreadyOpen = detail.classList.contains('is-open') && panelEl && panelEl.classList.contains('is-visible');
        if (isAlreadyOpen) { closePanel(); return; }
        openPanel(panelId);
      });
      el.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); el.click(); }
      });
    });
    if (closeBtn) closeBtn.addEventListener('click', closePanel);
  }

  function initTractionSlide() {
    var detail = document.getElementById('traction-detail');
    var closeBtn = detail && detail.querySelector('.traction-detail-close');
    var cards = document.querySelectorAll('.traction-card[data-traction-panel]');
    var panels = detail && detail.querySelectorAll('.traction-detail-panel');
    var dropdowns = document.querySelectorAll('.traction-dd');
    if (!detail || !panels || !panels.length) return;

    function openPanel(panelId) {
      panels.forEach(function (p) {
        var match = p.id === 'panel-' + panelId;
        p.classList.toggle('is-visible', match);
        p.setAttribute('aria-hidden', match ? 'false' : 'true');
      });
      detail.classList.add('is-open');
      setTimeout(function () {
        detail.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'nearest' });
      }, 100);
    }

    function closePanel() {
      panels.forEach(function (p) {
        p.classList.remove('is-visible');
        p.setAttribute('aria-hidden', 'true');
      });
      detail.classList.remove('is-open');
      cards.forEach(function (c) { c.classList.remove('traction-card--active'); });
    }

    function handleCardClick(panelId) {
      var card = Array.prototype.find.call(cards, function (c) {
        return c.getAttribute('data-traction-panel') === panelId;
      });
      var isActive = card && card.classList.contains('traction-card--active');
      if (isActive) {
        closePanel();
        return;
      }
      cards.forEach(function (c) { c.classList.remove('traction-card--active'); });
      if (card) card.classList.add('traction-card--active');
      openPanel(panelId);
    }

    function closeAllDropdowns(except) {
      dropdowns.forEach(function (dd) {
        if (dd === except) return;
        dd.classList.remove('open');
        var h = dd.querySelector('.traction-dd-header');
        var b = dd.querySelector('.traction-dd-body');
        if (h) h.setAttribute('aria-expanded', 'false');
        if (b) b.setAttribute('aria-hidden', 'true');
      });
    }

    cards.forEach(function (card) {
      var panelId = card.getAttribute('data-traction-panel');
      if (!panelId) return;
      card.addEventListener('click', function () { handleCardClick(panelId); });
      card.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleCardClick(panelId); }
      });
    });

    if (closeBtn) closeBtn.addEventListener('click', closePanel);

    dropdowns.forEach(function (dd) {
      var header = dd.querySelector('.traction-dd-header');
      var body = dd.querySelector('.traction-dd-body');
      if (!header || !body) return;
      header.addEventListener('click', function () {
        var isOpen = dd.classList.contains('open');
        if (isOpen) {
          dd.classList.remove('open');
          header.setAttribute('aria-expanded', 'false');
          body.setAttribute('aria-hidden', 'true');
        } else {
          closeAllDropdowns(dd);
          dd.classList.add('open');
          header.setAttribute('aria-expanded', 'true');
          body.setAttribute('aria-hidden', 'false');
          setTimeout(function () {
            body.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'nearest' });
          }, 100);
        }
      });
    });
  }

  function initCardDetails() {
    var cards = document.querySelectorAll('.deck-card[data-detail], [data-detail].deck-card');
    cards = Array.prototype.filter.call(cards, function (c) {
      return !c.closest('.system-diagram-root');
    });
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
        var slide = closestScope(card);
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
        if (isActive) hideDetail();
        else showDetail();
      }

      card.addEventListener('click', toggleDetail);
      card.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggleDetail(); }
      });
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    initDisclosureDelegation();

    initAccordionGroup('.market-dd', '.market-dd-header', '.market-dd-body', { mode: 'toggle', scrollOnOpen: true });
    initAccordionGroup('.roadmap-dd', '.roadmap-dd-header', '.roadmap-dd-body', { mode: 'toggle', scrollOnOpen: true });
    initAccordionGroup('.ask-dd', '.ask-dd-header', '.ask-dd-body', { mode: 'toggle', scrollOnOpen: true });
    initAccordionGroup('.team-dd', '.team-dd-header', '.team-dd-body', { mode: 'toggle', scrollOnOpen: true });
    initAccordionGroup('.finance-dd', '.finance-dd-header', '.finance-dd-body', { mode: 'toggle', scrollOnOpen: true });
    initAccordionGroup('.market-size-dd', '.market-size-dd-header', '.market-size-dd-body', { mode: 'swap', scrollOnOpen: false });
    initAccordionGroup('.ue-dd', '.ue-dd-header', '.ue-dd-body', { mode: 'swap', scrollOnOpen: false });

    initExclusivePin('.roadmap-card[data-roadmap-card]');
    initExclusivePin('.market-size-card[data-market-size-card]');
    initExclusivePin('.problem-card[data-problem-card]');
    initExclusivePin('.solution-card[data-solution-card]');
    initExclusivePin('.ue-card[data-ue-card]');

    initSystemDiagramPins();
    initMarketTrendsChart();
    initMarketSearchTrendPanel();
    initPositioningSlide();
    initAskSlide();
    initFinanceSlide();
    initTractionSlide();
    initCardDetails();
  });
})();
