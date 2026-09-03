/* 원페이지 앵커 내비게이션 — 상단 LNB 가 현재 보고 있는 섹션을 따라간다.
   투자·입주가 세 섹션을 한 페이지에 담으면서 필요해졌다(§11.62).

   LNB 의 링크는 `nav.json` 이 만든다(`invest.html#land` 처럼). 여기서는 그 링크 중
   **이 페이지의 앵커를 가리키는 것만** 골라 대상 섹션과 짝지운다. 다른 페이지로 가는
   항목(문의하기 등)은 건드리지 않는다.

   ⚠ IntersectionObserver 의 `isIntersecting` 만으로 고르면 두 섹션이 동시에 걸릴 때
     아래쪽이 이긴다. **화면 위쪽 기준선을 지난 마지막 섹션**을 현재로 삼는다 —
     읽고 있는 곳과 표시가 어긋나지 않는다.
   ⚠ 기준선은 GNB + LNB 아래여야 한다. 그 위는 바에 가려 보이지 않는 영역이다.
   ⚠ `aria-current` 도 함께 옮긴다. 빌드가 첫 항목에 넣어 둔 것을 그대로 두면
     스크린리더에는 항상 첫 섹션이 현재로 읽힌다. */
(function () {
  var lnb = document.querySelector('.lnb');
  if (!lnb) return;

  var here = location.pathname.split('/').pop() || 'index.html';
  var pairs = [];
  [].forEach.call(lnb.querySelectorAll('a[href*="#"]'), function (a) {
    var href = a.getAttribute('href') || '';
    var hash = href.slice(href.indexOf('#') + 1);
    var file = href.slice(0, href.indexOf('#'));
    if (file && file !== here) return;          // 다른 페이지 앵커는 대상이 아니다
    var sec = document.getElementById(hash);
    /* ⚠ 모달을 섹션으로 오인하지 않는다. 문의 모달의 id 가 `contact` 라 LNB 의 `#contact`
         가 그걸 집어 온다 — `hidden` 요소의 rect.top 은 0 이라 "기준선을 지났다" 로 읽히고,
         목록 마지막이라 **문의하기가 늘 현재로 표시된다**(2026-08-26 실측). */
    if (!sec || sec.classList.contains('pv') || sec.hasAttribute('aria-modal')) return;
    pairs.push({ a: a, sec: sec });
  });
  if (pairs.length < 2) return;

  function barBottom() {
    var cs = getComputedStyle(document.documentElement);
    var gnb = parseFloat(cs.getPropertyValue('--gnb-h')) || 0;
    var lnbH = parseFloat(cs.getPropertyValue('--lnb-h')) || 0;
    return gnb + lnbH;
  }

  var cur = -1;
  function tick() {
    var line = barBottom() + 8;
    var i = 0;
    for (var k = 0; k < pairs.length; k++) {
      if (pairs[k].sec.getBoundingClientRect().top - line <= 0) i = k;
    }
    /* 문서 맨 아래에 닿으면 마지막 섹션을 현재로 — 짧은 마지막 섹션은 기준선을
       넘지 못한 채 끝날 수 있다. */
    if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2) {
      i = pairs.length - 1;
    }
    if (i === cur) return;
    cur = i;
    for (var j = 0; j < pairs.length; j++) {
      var on = j === i;
      pairs[j].a.classList.toggle('is-on', on);
      if (on) pairs[j].a.setAttribute('aria-current', 'true');
      else pairs[j].a.removeAttribute('aria-current');
    }
  }

  var queued = false;
  function onScroll() {
    if (queued) return;
    queued = true;
    requestAnimationFrame(function () { queued = false; tick(); });
  }
  addEventListener('scroll', onScroll, { passive: true });
  addEventListener('resize', onScroll);
  tick();
})();
