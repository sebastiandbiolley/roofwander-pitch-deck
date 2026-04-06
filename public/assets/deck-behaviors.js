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
    var card = document.getElementById('mc-main-card');
    if (!card) return;
    var panel = document.getElementById('mc-chart-panel');
    var actionText = card.querySelector('.mc-card-action-text');
    var legends = card.querySelectorAll('.mc-legend[data-series]');
    var chartLines = card.querySelectorAll('.market-chart-line');

    function setActionLabel(open) {
      if (!actionText) return;
      var openLabel = actionText.getAttribute('data-open-label') || 'Hide chart';
      var closedLabel = actionText.getAttribute('data-closed-label') || 'Show chart';
      actionText.textContent = open ? openLabel : closedLabel;
    }

    function setOpenState(open) {
      card.classList.toggle('is-open', open);
      card.setAttribute('aria-expanded', String(open));
      if (panel) panel.setAttribute('aria-hidden', open ? 'false' : 'true');
      setActionLabel(open);
    }

    function clearSeriesFocus() {
      card.classList.remove('has-series-focus');
      chartLines.forEach(function (line) {
        line.classList.remove('is-emphasis');
      });
      legends.forEach(function (legend) {
        legend.classList.remove('is-emphasis');
        legend.setAttribute('aria-pressed', 'false');
      });
    }

    function applySeriesFocus(series) {
      if (!series) return;
      var targetLine = card.querySelector('.market-chart-line--' + series);
      if (!targetLine) return;

      card.classList.add('has-series-focus');
      chartLines.forEach(function (line) {
        line.classList.toggle('is-emphasis', line === targetLine);
      });
      legends.forEach(function (legend) {
        var isTarget = legend.getAttribute('data-series') === series;
        legend.classList.toggle('is-emphasis', isTarget);
        legend.setAttribute('aria-pressed', isTarget ? 'true' : 'false');
      });
    }

    function toggle() {
      setOpenState(!card.classList.contains('is-open'));
    }

    card.addEventListener('click', function (e) {
      if (e.target.closest('.mc-chart-panel')) return;
      toggle();
    });
    card.addEventListener('keydown', function (e) {
      if (e.target !== card) return;
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggle();
      }
    });

    legends.forEach(function (legend) {
      var series = legend.getAttribute('data-series');
      legend.setAttribute('aria-pressed', 'false');

      legend.addEventListener('mouseenter', function () {
        applySeriesFocus(series);
      });
      legend.addEventListener('focus', function () {
        applySeriesFocus(series);
      });
      legend.addEventListener('mouseleave', clearSeriesFocus);
      legend.addEventListener('blur', clearSeriesFocus);
      legend.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        if (legend.classList.contains('is-emphasis')) {
          clearSeriesFocus();
          return;
        }
        applySeriesFocus(series);
      });
    });

    setOpenState(false);
  }

  function initStatCountUp() {
    var els = document.querySelectorAll('[data-count-to]');
    if (!els.length) return;
    els.forEach(function (el) {
      var target = parseFloat(el.getAttribute('data-count-to'));
      var suffix = el.getAttribute('data-count-suffix') || '';
      var decimals = (String(target).split('.')[1] || '').length;
      var duration = 1200;
      var startTime = null;
      var started = false;

      function animate(ts) {
        if (!startTime) startTime = ts;
        var progress = Math.min((ts - startTime) / duration, 1);
        var eased = 1 - Math.pow(1 - progress, 3);
        var current = (eased * target).toFixed(decimals);
        el.textContent = current + suffix;
        if (progress < 1) requestAnimationFrame(animate);
      }

      // Start when the slide becomes active (anim-active class on ancestor)
      function tryStart() {
        if (started) return;
        var slide = el.closest('.deck-slide');
        if (slide && slide.classList.contains('anim-active')) {
          started = true;
          requestAnimationFrame(animate);
        }
      }

      // Observe the slide for anim-active — restart on re-entry
      var slide = el.closest('.deck-slide');
      if (slide) {
        var obs = new MutationObserver(function () {
          if (slide.classList.contains('anim-active')) {
            started = false;
            startTime = null;
            tryStart();
          } else {
            el.textContent = '0' + suffix;
            started = false;
            startTime = null;
          }
        });
        obs.observe(slide, { attributes: true, attributeFilter: ['class'] });
        tryStart();
      } else {
        // Standalone page — start after delay
        setTimeout(function () { requestAnimationFrame(animate); }, 400);
      }
    });
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

  function initSharetribeUserCount() {
    var el = document.getElementById('sharetribe-user-count');
    if (!el) return;

    fetch('data/user-stats.json')
    .then(function (res) { return res.json(); })
    .then(function (data) {
      if (!data.totalUsers) return;

      // Update main KPI card
      el.textContent = data.totalUsers;
      var card = el.closest('.traction-card');
      if (card) card.setAttribute('aria-label', data.totalUsers + ' users');

      // Update owner/renter modules
      var ownerEl = document.getElementById('sharetribe-owner-count');
      var renterEl = document.getElementById('sharetribe-renter-count');
      var noteEl = document.getElementById('sharetribe-total-note');
      if (ownerEl) ownerEl.textContent = data.owners;
      if (renterEl) renterEl.textContent = data.renters;
      if (noteEl) noteEl.innerHTML = 'Total: <strong>' + data.totalUsers + ' users</strong> — live from Sharetribe API.';

      // Draw monthly line chart
      var svg = document.getElementById('sharetribe-chart');
      if (!svg || !data.timeline || !data.timeline.length) return;

      var tl = data.timeline;
      var maxVal = 0;
      for (var i = 0; i < tl.length; i++) {
        if (tl[i].owner > maxVal) maxVal = tl[i].owner;
        if (tl[i].renter > maxVal) maxVal = tl[i].renter;
      }
      maxVal = Math.ceil(maxVal / 10) * 10 || 10;

      var w = 520, h = 220;
      var mL = 50, mR = 20, mT = 30, mB = 40;
      var plotW = w - mL - mR;
      var plotH = h - mT - mB;
      var html = '';
      var pts = tl.length;

      // Horizontal grid lines
      for (var g = 0; g <= 4; g++) {
        var gy = mT + (plotH / 4) * g;
        var gv = Math.round(maxVal - (maxVal / 4) * g);
        html += '<line x1="' + mL + '" y1="' + gy + '" x2="' + (w - mR) + '" y2="' + gy + '" stroke="var(--border)" stroke-width="0.5" opacity="0.5"/>';
        html += '<text x="' + (mL - 8) + '" y="' + (gy + 4) + '" class="traction-chart-axis-y" text-anchor="end">' + gv + '</text>';
      }

      // Axes
      html += '<line x1="' + mL + '" y1="' + mT + '" x2="' + mL + '" y2="' + (h - mB) + '" stroke="var(--border)" stroke-width="1"/>';
      html += '<line x1="' + mL + '" y1="' + (h - mB) + '" x2="' + (w - mR) + '" y2="' + (h - mB) + '" stroke="var(--border)" stroke-width="1"/>';

      // Legend
      html += '<line x1="' + (mL + 10) + '" y1="14" x2="' + (mL + 26) + '" y2="14" stroke="var(--accent)" stroke-width="2"/>';
      html += '<text x="' + (mL + 30) + '" y="17" class="traction-chart-axis-y" style="font-size:10px">Owners</text>';
      html += '<line x1="' + (mL + 90) + '" y1="14" x2="' + (mL + 106) + '" y2="14" stroke="#2563eb" stroke-width="2"/>';
      html += '<text x="' + (mL + 110) + '" y="17" class="traction-chart-axis-y" style="font-size:10px">Renters</text>';

      // Build line paths and area fills
      var ownerPath = '';
      var renterPath = '';
      var ownerArea = '';
      var renterArea = '';
      for (var j = 0; j < pts; j++) {
        var x = Math.round(mL + (j / (pts - 1)) * plotW);
        var yO = Math.round(mT + plotH * (1 - tl[j].owner / maxVal));
        var yR = Math.round(mT + plotH * (1 - tl[j].renter / maxVal));
        ownerPath += (j ? ' L ' : 'M ') + x + ' ' + yO;
        renterPath += (j ? ' L ' : 'M ') + x + ' ' + yR;
        if (j === 0) {
          ownerArea = 'M ' + x + ' ' + (h - mB) + ' L ' + x + ' ' + yO;
          renterArea = 'M ' + x + ' ' + (h - mB) + ' L ' + x + ' ' + yR;
        } else {
          ownerArea += ' L ' + x + ' ' + yO;
          renterArea += ' L ' + x + ' ' + yR;
        }
        if (j === pts - 1) {
          ownerArea += ' L ' + x + ' ' + (h - mB) + ' Z';
          renterArea += ' L ' + x + ' ' + (h - mB) + ' Z';
        }

        // Month labels (skip some if too many)
        if (pts <= 7 || j % 2 === 0 || j === pts - 1) {
          var parts = tl[j].month.split('-');
          var label = parts[1] + '/' + parts[0].slice(2);
          html += '<text x="' + x + '" y="' + (h - mB + 16) + '" class="traction-chart-axis-x" text-anchor="middle">' + label + '</text>';
        }
      }

      // Area fills
      html += '<path d="' + ownerArea + '" fill="var(--accent)" opacity="0.1"/>';
      html += '<path d="' + renterArea + '" fill="#2563eb" opacity="0.1"/>';
      // Lines
      html += '<path d="' + ownerPath + '" fill="none" stroke="var(--accent)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>';
      html += '<path d="' + renterPath + '" fill="none" stroke="#2563eb" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>';

      // Dots
      for (var k = 0; k < pts; k++) {
        var dx = Math.round(mL + (k / (pts - 1)) * plotW);
        var dyO = Math.round(mT + plotH * (1 - tl[k].owner / maxVal));
        var dyR = Math.round(mT + plotH * (1 - tl[k].renter / maxVal));
        html += '<circle cx="' + dx + '" cy="' + dyO + '" r="3" fill="var(--accent)"/>';
        html += '<circle cx="' + dx + '" cy="' + dyR + '" r="3" fill="#2563eb"/>';
      }

      svg.innerHTML = html;
    })
    .catch(function () {
      // Keep static fallback
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

    initAccordionGroup('.market-dd', '.market-dd-header', '.market-dd-body', { mode: 'toggle', scrollOnOpen: false });
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
    initStatCountUp();
    initPositioningSlide();
    initAskSlide();
    initFinanceSlide();
    initTractionSlide();
    initSharetribeUserCount();
    initCardDetails();
  });
})();
