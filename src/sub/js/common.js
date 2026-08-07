    /* GNB: 히어로 위에서는 투명, 스크롤하면 흰 배경 */
    (function () {
      var gnb = document.getElementById('gnb');
      var onScroll = function () { gnb.classList.toggle('is-solid', window.scrollY > 40); };
      onScroll();
      addEventListener('scroll', onScroll, { passive: true });
    })();

    /* 모바일 메뉴 */
    (function () {
      var nav = document.getElementById('mnav'), btn = document.getElementById('burger');
      var open = function (on) {
        nav.hidden = !on;
        nav.classList.toggle('is-open', on);
        btn.setAttribute('aria-expanded', on ? 'true' : 'false');
        document.body.style.overflow = on ? 'hidden' : '';
      };
      btn.addEventListener('click', function () { open(nav.hidden); });
      document.getElementById('mnavClose').addEventListener('click', function () { open(false); });
      nav.addEventListener('click', function (e) { if (e.target === nav) open(false); });
      addEventListener('keydown', function (e) { if (e.key === 'Escape' && !nav.hidden) open(false); });
    })();

    /* 등장 모션 */
    (function () {
      var items = [].slice.call(document.querySelectorAll('.rv'));
      if (!('IntersectionObserver' in window)) {
        items.forEach(function (el) { el.classList.add('in'); });
        return;
      }
      var io = new IntersectionObserver(function (es) {
        es.forEach(function (e) {
          if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
        });
      }, { rootMargin: '0px 0px -12% 0px', threshold: 0.08 });
      items.forEach(function (el, i) {
        el.style.transitionDelay = (i % 4) * 0.07 + 's';
        io.observe(el);
      });
    })();
