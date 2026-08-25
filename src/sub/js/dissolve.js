/* 스케치 → 실사 조감도 디졸브 (2026-08-25 · 납품 패키지 v2 를 이 프로젝트 규약으로 옮긴 것)
   두 장을 겹쳐 두고 위의 스케치를 걷어낸다. 여기서 하는 일은 **재생 시점을 잡는 것뿐**이고
   실제 전환은 CSS 애니메이션이 한다.

   ⚠ 두 장이 **모두 디코드된 뒤에** 시작한다. 스케치만 먼저 오면 실사가 들어오는 순간
     전환 중간부터 튀어 보인다.
   ⚠ `prefers-reduced-motion: reduce` 면 아무것도 하지 않는다 — CSS 가 그 조건에서
     스케치를 감춰 실사를 바로 보여 준다(§11.13 카운트업과 같은 원칙).
   ⚠ JS 가 없거나 실패하면 **스케치 + 카피**가 그대로 남는다. 빈 화면이 아니라 완성된
     그림 한 장에 글이 얹힌 상태라 안전한 실패다 — 중요한 내용을 JS 에 걸어 두지 않는다.
   ⚠ 카피는 전환이 끝난 뒤 올라온다. 감추는 일은 `is-armed`(즉시), 되살리는 일은
     `is-playing`(디코드 후)이 한다 — 둘을 한 클래스로 합치면 그 사이에 깜빡인다. */
(function () {
  var stages = document.querySelectorAll('[data-dissolve]');
  if (!stages.length) return;
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  Array.prototype.forEach.call(stages, function (stage) {
    var imgs = Array.prototype.slice.call(stage.querySelectorAll('img'));
    if (!imgs.length) return;

    /* ⚠ 카피·스크림을 **지금 바로** 감춘다. 아래에서 이미지 디코드를 기다리는데, 그 사이에
         카피가 보였다 사라지면 깜빡인다. 이 스크립트는 본문 끝에 인라인되어 파싱 중에
         실행되므로 첫 페인트 전에 걸린다. */
    stage.classList.add('is-armed');

    var ready = imgs.map(function (img) {
      /* ⚠ `decode()` 는 캐시된 이미지에서도 픽셀 준비를 보장한다. 미지원 브라우저는
           `complete` 로 떨어지고, 실패해도 재생은 막지 않는다(catch 로 통과시킨다). */
      if (img.complete && img.naturalWidth) {
        return img.decode ? img.decode().catch(function () {}) : Promise.resolve();
      }
      return new Promise(function (resolve) {
        img.addEventListener('load', resolve, { once: true });
        img.addEventListener('error', resolve, { once: true });
      });
    });

    Promise.all(ready).then(function () {
      stage.classList.add('is-playing');
    });
  });
})();
