/* 배경/비주얼 영상 지연 로딩 — 화면에 들어올 때 받고, 벗어나면 멈춘다.
   마크업은 `data-src` 로 두고 `src` 를 비워 둔다. 그래야 `preload="none"` 이어도
   브라우저가 미리 손대지 않는다.

   ⚠ `prefers-reduced-motion: reduce` 에서는 **영상을 아예 걸지 않는다.**
     poster 이미지가 그대로 남으므로 정보가 빠지지 않는다.
   ⚠ IntersectionObserver 가 없는 환경(구형)에서는 즉시 로드한다 — 없는 것보다 낫다. */
(function () {
  var vids = [].slice.call(document.querySelectorAll('video[data-src]'));
  if (!vids.length) return;

  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce) return;                       // poster 만 남긴다

  function load(v) {
    if (v.dataset.loaded) return;
    v.dataset.loaded = '1';
    v.src = v.dataset.src;
    v.load();
  }
  function play(v) {
    load(v);
    var p = v.play();
    if (p && p.catch) p.catch(function () {});   // 자동재생 차단은 조용히 넘긴다
  }

  if (!('IntersectionObserver' in window)) {
    vids.forEach(play);
    return;
  }

  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) play(e.target);
      else if (e.target.dataset.loaded) e.target.pause();
    });
  }, { rootMargin: '200px 0px', threshold: 0.01 });

  vids.forEach(function (v) { io.observe(v); });
})();
