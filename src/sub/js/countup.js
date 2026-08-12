    /* 수치 카운트업 — [data-count] 를 가진 요소가 화면에 들어올 때 0 에서 목표값까지 센다.

       원칙 두 가지.
         1) **마크업에는 최종값이 그대로 적혀 있다.** JS 가 없거나 실패해도 숫자는 보인다.
            여기서는 애니메이션만 얹는다(진행 중에만 값을 덮어쓴다).
         2) `prefers-reduced-motion` 이면 아무것도 하지 않는다 — 최종값 그대로 둔다.

       속성:
         data-count="15917"   목표값(숫자만. 표시용 콤마는 여기 넣지 않는다)
         data-dec="1"         소수 자릿수(기본 0). 1.5 조원처럼 소수가 있는 값에 쓴다

       ⚠ 한 번 세고 끝낸다(unobserve). 스크롤을 오르내릴 때마다 다시 세면 시선을 뺏는다. */
    (function () {
      var els = [].slice.call(document.querySelectorAll('[data-count]'));
      if (!els.length) return;
      if (window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      if (!('IntersectionObserver' in window)) return;   // 최종값이 이미 있으므로 그냥 둔다

      var DUR = 1100;
      var fmt = function (v, dec) {
        return v.toFixed(dec).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
      };

      var run = function (el) {
        var to = parseFloat(el.dataset.count);
        var dec = parseInt(el.dataset.dec || '0', 10);
        if (!isFinite(to)) return;
        var t0 = null;
        var step = function (t) {
          if (t0 === null) t0 = t;
          var p = Math.min(1, (t - t0) / DUR);
          // easeOutCubic — 끝에서 부드럽게 멈춘다
          var e = 1 - Math.pow(1 - p, 3);
          el.textContent = fmt(to * e, dec);
          if (p < 1) requestAnimationFrame(step);
          else el.textContent = fmt(to, dec);   // 마지막은 목표값으로 정확히 맞춘다
        };
        requestAnimationFrame(step);
      };

      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (!en.isIntersecting) return;
          io.unobserve(en.target);
          run(en.target);
        });
      }, { threshold: 0.4 });

      els.forEach(function (el) { io.observe(el); });
    })();
