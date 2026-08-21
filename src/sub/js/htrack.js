/* 가로 트랙 — 세로 스크롤 진행률로 하단 내용을 가로로 밀어 전환한다.
   레퍼런스(드파인 아르티아)는 fullpage.js 로 화면을 가로채 260vw 트랙을 넘기지만,
   여기서는 **스크롤을 가로채지 않는다** — 섹션에 런웨이를 두고 sticky 무대 안에서
   트랙만 `translateX` 로 옮긴다. 스크롤은 평소대로 흐른다.

   마크업 전제
     <section class="lv-ed">            런웨이(높이는 CSS 가 정한다)
       <div class="lv-stage">           position: sticky
         …
         <div class="lv-vp">            overflow: hidden
           <ul class="lv-track"> <li> × n
         <nav class="lv-dots">          i × n (JS 가 채운다)

   ⚠ `prefers-reduced-motion: reduce` 에서는 아무 것도 하지 않는다. CSS 가 런웨이를
     걷고 트랙을 줄바꿈 격자로 되돌리므로 내용이 전부 그대로 보인다.
   ⚠ 좁은 화면(트랙이 넘치지 않는 경우)도 같다 — `overflow <= 0` 이면 손대지 않는다. */
(function () {
  var secs = [].slice.call(document.querySelectorAll('.lv-ed'));
  if (!secs.length) return;
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  var items = secs.map(function (sec) {
    var vp = sec.querySelector('.lv-vp');
    var track = sec.querySelector('.lv-track');
    if (!vp || !track) return null;
    var cells = [].slice.call(track.children);
    var dots = sec.querySelector('.lv-dots');
    if (dots && cells.length > 1) {
      dots.innerHTML = cells.map(function (_, i) {
        return '<i role="button" tabindex="0" aria-label="' + (i + 1) + '번째 항목으로 이동"'
             + (i === 0 ? ' class="on"' : '') + '></i>';
      }).join('');
      var go = function (i) {
        var run = sec.offsetHeight - window.innerHeight;
        if (run <= 0) return;
        window.scrollTo({
          top: sec.offsetTop + run * (cells.length > 1 ? i / (cells.length - 1) : 0),
          behavior: 'smooth'
        });
      };
      [].slice.call(dots.children).forEach(function (el, i) {
        el.addEventListener('click', function () { go(i); });
        el.addEventListener('keydown', function (e) {
          if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); go(i); }
        });
      });
    }
    return { sec: sec, vp: vp, track: track, cells: cells, dots: dots, cur: -1 };
  }).filter(Boolean);

  /* 런웨이 길이를 **넘치는 폭에 비례**해 정한다.
     ⚠ 고정 런웨이(130vh)로 두면 항목 수가 다른 섹션의 가로 속도가 달라진다 —
       4항목은 699px 를 130vh 동안 밀고 3항목은 222px 만 밀어 거의 멈춘 것처럼 보였다(실측).
     ⚠ 폭은 레이아웃(가로)에만 의존하므로 스크롤마다 재지 않는다 — 리사이즈·이미지 로드에만 잰다.
       매 프레임 재면 높이를 바꾸는 일이 스크롤 위치를 흔들어 되먹임이 생긴다. */
  var RATE = 1.6;              // 가로 1px 을 세로 몇 px 스크롤로 넘길지
  function measure() {
    for (var k = 0; k < items.length; k++) {
      var it = items[k];
      it.over = it.track.scrollWidth - it.vp.clientWidth;
      if (it.over > 0) it.sec.style.setProperty('--run', Math.round(it.over * RATE) + 'px');
      else it.sec.style.removeProperty('--run');
    }
  }

  function tick() {
    for (var k = 0; k < items.length; k++) {
      var it = items[k];
      var over = it.over != null ? it.over : it.track.scrollWidth - it.vp.clientWidth;
      var run = it.sec.offsetHeight - window.innerHeight;
      if (over <= 0 || run <= 0) {
        it.track.style.transform = '';
        continue;
      }
      var top = it.sec.getBoundingClientRect().top;
      var p = Math.min(1, Math.max(0, -top / run));
      it.track.style.transform = 'translate3d(' + (-p * over).toFixed(1) + 'px,0,0)';

      var i = Math.min(it.cells.length - 1, Math.round(p * (it.cells.length - 1)));
      if (i !== it.cur) {
        it.cur = i;
        for (var j = 0; j < it.cells.length; j++) it.cells[j].classList.toggle('is-on', j === i);
        if (it.dots) {
          var ds = it.dots.children;
          for (var m = 0; m < ds.length; m++) ds[m].classList.toggle('on', m === i);
        }
      }
    }
  }

  var queued = false;
  function onScroll() {
    if (queued) return;
    queued = true;
    requestAnimationFrame(function () { queued = false; tick(); });
  }
  function remeasure() { measure(); onScroll(); }
  addEventListener('scroll', onScroll, { passive: true });
  addEventListener('resize', remeasure);
  /* 이미지가 들어오면 폭이 바뀐다 — 로드 후 한 번 더 잰다 */
  addEventListener('load', remeasure);
  [].slice.call(document.images).forEach(function (im) {
    if (!im.complete) im.addEventListener('load', remeasure, { once: true });
  });
  remeasure();
})();
