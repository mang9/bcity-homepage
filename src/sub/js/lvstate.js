/* 정주환경 — 스크롤 진행률로 [전폭 이미지] → [좌 이미지 | 우 콘텐츠] 로 전환한다.
   레퍼런스(드파인 아르티아)의 1번 → 2번 상태와 같은 움직임이다.

   하는 일은 하나뿐 — 섹션마다 `--p`(0~1)를 넣는다. 폭 · 투명도 · 이동은 CSS 가 계산한다.
     p = 0  이미지가 화면 전폭, 제목만 얹혀 있다
     p = 1  이미지가 왼쪽 칸으로 좁아지고 오른쪽 콘텐츠가 드러난다

   ⚠ 전환에 `transition` 을 걸지 않는다. 진행률이 매 프레임 값을 주므로 전환을 얹으면
     값을 뒤따라가 지연이 생기고, 전환이 진행되지 않는 환경(헤드리스 · 숨겨진 프레임)에서는
     계산된 값이 시작값에 머물러 "움직이지 않는 것" 으로 측정된다(§11.55 에서 겪었다).
   ⚠ `prefers-reduced-motion: reduce` 와 좁은 화면에서는 아무 것도 하지 않는다.
     CSS 가 런웨이를 걷고 두 칸을 세로로 쌓으므로 내용이 전부 그대로 보인다.
     **CSS 의 조건과 여기 조건이 같아야 한다.** */
(function () {
  /* 도입부(`.lv-intro`)도 같은 방식으로 진행률을 받는다 — 카피가 물러나는 데 쓴다.
     ⚠ 도입부의 CSS 되돌림 값은 0, 축 섹션은 1 이다. 여기서는 값만 넣으므로 상관없다. */
  var secs = [].slice.call(document.querySelectorAll('.lv-intro, .lv-ed'));
  if (!secs.length) return;

  var mqReduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)');
  /* ⚠ CSS 의 `@media (max-width: 1023px), (max-height: 679px)` 와 **같은 조건**이다.
     한쪽만 바꾸면 JS 는 진행률을 넣는데 레이아웃은 쌓기라 내용이 반투명하게 남는다. */
  var mqNarrow = window.matchMedia
    && window.matchMedia('(max-width: 1023px), (max-height: 679px)');

  function off() {
    return (mqReduce && mqReduce.matches) || (mqNarrow && mqNarrow.matches);
  }

  function clear() {
    for (var i = 0; i < secs.length; i++) secs[i].style.removeProperty('--p');
  }

  function tick() {
    if (off()) { clear(); return; }
    for (var i = 0; i < secs.length; i++) {
      var sec = secs[i];
      var run = sec.offsetHeight - window.innerHeight;
      if (run <= 0) { sec.style.setProperty('--p', '1'); continue; }
      var top = sec.getBoundingClientRect().top;
      var p = Math.min(1, Math.max(0, -top / run));
      /* 런웨이를 그대로 쓰지 않고 세 토막으로 나눈다 —
           앞 8%   전폭 이미지를 그대로 보여 주는 구간
           가운데 60%  이미지가 좁혀지고 오른쪽 내용이 들어오는 구간
           뒤 32%  완성된 2단 화면을 볼 수 있는 구간
         뒤 토막이 없으면 전환이 끝나는 순간 다음 섹션이 밀고 들어와서
         만들어진 화면을 볼 틈이 없다. */
      var e = Math.min(1, Math.max(0, (p - .08) / .60));
      sec.style.setProperty('--p', e.toFixed(3));
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
  if (mqReduce && mqReduce.addEventListener) mqReduce.addEventListener('change', onScroll);
  if (mqNarrow && mqNarrow.addEventListener) mqNarrow.addEventListener('change', onScroll);
  tick();
})();
