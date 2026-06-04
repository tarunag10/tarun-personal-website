/* ═══════════════════════════════════════
   MOTION GRAPHICS — frame-driven visuals
═══════════════════════════════════════ */

(function() {
  'use strict';

  var fps = 30;
  var durationFrames = 150;
  var prefersReducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
  }

  function easeOutCubic(t) {
    return 1 - Math.pow(1 - clamp(t, 0, 1), 3);
  }

  function progressBetween(frame, start, end) {
    return clamp((frame - start) / (end - start), 0, 1);
  }

  function setCounter(el, progress) {
    var target = Number(el.dataset.target || 0);
    el.textContent = Math.round(target * easeOutCubic(progress));
  }

  function setPath(path, progress) {
    var length = path.getTotalLength();
    path.style.strokeDasharray = String(length);
    path.style.strokeDashoffset = String(length * (1 - progress));
  }

  function setMarker(path, marker, progress) {
    var length = path.getTotalLength();
    var point = path.getPointAtLength(length * progress);
    marker.setAttribute('transform', 'translate(' + point.x.toFixed(2) + ' ' + point.y.toFixed(2) + ')');
  }

  function render(stage, frame) {
    var loopFrame = frame % durationFrames;
    var drawProgress = easeOutCubic(progressBetween(loopFrame, 8, 96));
    var path = stage.querySelector('[data-motion-path]');
    var marker = stage.querySelector('[data-motion-marker]');
    var frameLabel = stage.querySelector('[data-motion-frame]');

    if (frameLabel) frameLabel.textContent = 'F' + String(loopFrame).padStart(3, '0');
    if (path) setPath(path, drawProgress);
    if (path && marker) setMarker(path, marker, drawProgress);

    stage.querySelectorAll('[data-motion-counter]').forEach(function(el, i) {
      setCounter(el, progressBetween(loopFrame, 14 + i * 8, 70 + i * 8));
    });

    stage.querySelectorAll('.motion-bar span').forEach(function(bar, i) {
      var localProgress = easeOutCubic(progressBetween(loopFrame, 28 + i * 7, 78 + i * 7));
      var target = parseFloat(bar.style.getPropertyValue('--target')) || 0;
      bar.style.setProperty('--motion-width', (target * localProgress).toFixed(1) + '%');
    });

    stage.querySelectorAll('[data-motion-tick]').forEach(function(tick, i) {
      var tickProgress = easeOutCubic(progressBetween(loopFrame, i * 22, i * 22 + 34));
      tick.style.setProperty('--tick-progress', (tickProgress * 100).toFixed(1) + '%');
    });

    stage.querySelectorAll('[data-motion-node]').forEach(function(node, i) {
      var nodeProgress = easeOutCubic(progressBetween(loopFrame, 20 + i * 22, 52 + i * 22));
      node.style.opacity = String(0.42 + nodeProgress * 0.58);
    });
  }

  function initMotionStage(stage) {
    var frame = 0;

    if (prefersReducedMotion) {
      render(stage, 96);
      return;
    }

    function tick() {
      render(stage, frame);
      frame += 1;
      window.setTimeout(function() {
        window.requestAnimationFrame(tick);
      }, 1000 / fps);
    }

    tick();
  }

  document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('[data-motion-stage]').forEach(initMotionStage);
  });
})();
