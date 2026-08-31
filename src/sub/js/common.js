    /* GNB: 히어로 위에서는 투명, 스크롤하면 흰 배경 */
    (function () {
      var gnb = document.getElementById('gnb');
      var onScroll = function () { gnb.classList.toggle('is-solid', window.scrollY > 40); };
      onScroll();
      addEventListener('scroll', onScroll, { passive: true });
    })();

    /* 대메뉴 호버 — 하위 메뉴 펼치기(2026-08-27 지시).
       ⚠ 바(`#gnb`) 전체에 걸어야 한다. 항목마다 걸면 항목 사이 빈틈에서 닫혔다 열리며 깜빡인다.
       ⚠ 포커스로도 열어야 키보드로 하위 메뉴에 닿는다 — 그래서 focusin/focusout 을 함께 쓴다.
       ⚠ 좁은 화면(대메뉴가 숨는 구간)에서는 아무것도 하지 않는다. `.gnb-menu` 가
         `display: none` 이라 열어 봐야 보이지 않고, 바 높이만 늘어난다. */
    (function () {
      var gnb = document.getElementById('gnb');
      if (!gnb || !gnb.querySelector('.gnb-sub')) return;
      var wide = function () { return matchMedia('(min-width: 1024px)').matches; };
      var set = function (on) { gnb.classList.toggle('is-open', on && wide()); };
      gnb.addEventListener('mouseenter', function () { set(true); });
      gnb.addEventListener('mouseleave', function () { set(false); });
      gnb.addEventListener('focusin', function () { set(true); });
      gnb.addEventListener('focusout', function (e) {
        if (!gnb.contains(e.relatedTarget)) set(false);
      });
      document.addEventListener('keydown', function (e) { if (e.key === 'Escape') set(false); });
      addEventListener('resize', function () { if (!wide()) set(false); });
    })();

    /* KO / EN — 영문은 아직 없다. 호버·포커스에 안내를 띄운다(2026-08-27 지시).
       ⚠ `title` 속성을 쓰지 않는다 — 뜨는 데 1초 넘게 걸리고 모양을 정할 수 없다. */
    (function () {
      var lang = document.querySelector('.gnb-lang');
      if (!lang) return;
      var en = lang.querySelector('.gnb-en');
      if (!en || en.textContent.trim() !== 'EN') return;
      en.setAttribute('tabindex', '0');
      en.setAttribute('role', 'button');
      en.setAttribute('aria-disabled', 'true');
      var tip = document.createElement('span');
      tip.className = 'gnb-tip';
      tip.textContent = '준비중입니다';
      en.appendChild(tip);
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

    /* 카카오맵 길찾기 — 휴대폰에서는 주소를 갈아끼운다.
       ⚠⚠ 카카오는 **길찾기 주소만** 모바일에서 `applink.map.kakao.com/route`(앱 설치 벽)로
         강제로 보낸다(2026-08-31 실측). 그 화면에는 도착지가 표시되지 않아 어디로 가는
         길찾기인지 알 수 없다. `link/map`(지도 보기)은 정상적으로 모바일 뷰로 간다 —
         즉 PC 주소를 그대로 두면 길찾기만 쓸 수 없게 된다.
       ⚠ `href` 의 기본값은 **PC 주소**다. 여기서 못 바꿔도 데스크톱은 정상이어야 하기
         때문이다. 반대로 두면 데스크톱에서 지도 없는 모바일 화면이 늘어나 보인다(실측).
       ⚠ 좌표는 WCONGNAMUL 이다(`data-kx`/`data-ky`). href 안의 위경도(WGS84)와 같은
         지점이며 **함께 고쳐야 한다** — 환산법은 about 페이지 소스 주석에 있다. */
    (function () {
      var as = [].slice.call(document.querySelectorAll('a[data-kakao-route]'));
      if (!as.length || !window.matchMedia) return;
      if (!window.matchMedia('(hover: none) and (pointer: coarse)').matches) return;
      as.forEach(function (a) {
        var d = a.dataset;
        if (!d.kx || !d.ky || !d.kname) return;
        a.href = 'https://m.map.kakao.com/actions/routeView?startLoc=&startX=&startY=' +
          '&endLoc=' + encodeURIComponent(d.kname) + '&endX=' + d.kx + '&endY=' + d.ky;
      });
    })();
