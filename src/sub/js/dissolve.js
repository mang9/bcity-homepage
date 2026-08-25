/* 스케치 → 실사 조감도 디졸브 (2026-08-25 · 납품 패키지 v2 를 이 프로젝트 규약으로 옮긴 것)
   두 장을 겹쳐 두고 위의 스케치를 걷어낸다. 여기서 하는 일은 **재생 시점을 잡는 것뿐**이고
   실제 전환은 CSS 애니메이션이 한다.

   ⚠ 두 장이 **모두 디코드된 뒤에** 시작한다. 스케치만 먼저 오면 실사가 들어오는 순간
     전환 중간부터 튀어 보인다.
   ⚠ `prefers-reduced-motion: reduce` 면 아무것도 하지 않는다 — CSS 가 그 조건에서
     스케치를 감춰 실사를 바로 보여 준다(§11.13 카운트업과 같은 원칙).
   ⚠ JS 가 없거나 실패하면 **스케치가 남는다.** 빈 화면이 아니라 완성된 그림 한 장이므로
     안전한 실패다. 카피 대비는 두 장 모두를 기준으로 재 두었다(page-city.css 참고). */
(function () {
  var stages = document.querySelectorAll('[data-dissolve]');
  if (!stages.length) return;
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  Array.prototype.forEach.call(stages, function (stage) {
    var imgs = Array.prototype.slice.call(stage.querySelectorAll('img'));
    if (!imgs.length) return;

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
