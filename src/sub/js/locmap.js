    /* 광역 교통망 지도 — 네 카드(철도·도로·항공·항만) 선택에 따라 경로를 강조한다.

       구조: 래스터 배경 1장 + SVG 4겹(경로 · 흐름 · 마커 · 라벨).
       네 겹 모두 viewBox `0 0 1672 941` 로 같은 프레임을 공유한다.
       마크업은 src/sub/partials/transit-*.svg, 자산 출처는 web-package-3008(2026-08-11).

       동작 (사용자 지시 2026-08-11)
         · 기본 = **전체**. 모든 경로가 선명한 **정지** 상태로 보인다. 흐름 애니메이션 없음
         · 카드 선택 = 그 교통수단만 살리고 나머지는 흐리게. **선택한 경로 위에서만** 흐름이 흐른다
         · 같은 카드를 다시 누르면 전체로 돌아온다 — '전체' 버튼을 따로 두지 않기 위한 장치다

       ⚠ 이 파일은 좌표를 갖지 않는다. 경로·마커·라벨의 위치는 전부 SVG 안에 있고
         여기서는 `data-transport` 값으로 클래스만 토글한다. 지도를 갈아끼울 때
         **이 파일은 손댈 필요가 없다** — SVG 네 장만 바꾸면 된다.
         (이전 버전은 좌표와 경로 d 를 JS 안에 들고 있어 지도가 바뀌면 전부 다시 재야 했다.)

       ⚠ 흐름(tmap-flow)의 경로 d 는 tmap-routes 와 **같아야 한다.** 한쪽만 고치면
         하이라이트가 선을 벗어나 떠다닌다. */
    (function () {
      var stage = document.getElementById('tmap');
      if (!stage) return;

      /* 배경을 AVIF 로 올려 쓴다. 실패하면 마크업의 JPEG 로 한 번만 되돌린다.
         ⚠ <picture> 를 쓰지 않는다 — inline 요소가 흐름에 끼어들어 absolute 겹침 전제를
           깨뜨린다(CLAUDE.md §11.5-4 의 실제 회귀 이력). */
      var img = stage.querySelector('.tmap-img');
      if (img) {
        var fallback = img.getAttribute('src');
        img.addEventListener('error', function () {
          if (img.dataset.fell) return;          // 무한 루프 방지
          img.dataset.fell = '1';
          img.src = fallback;
        });
        img.src = 'assets/img/transit-map.avif';
      }

      var cards = [].slice.call(document.querySelectorAll('.tmode'));
      if (!cards.length) return;

      var routeGroups = [].slice.call(stage.querySelectorAll('.tmap-routes [data-transport]'));
      var flowGroups = [].slice.call(stage.querySelectorAll('.tmap-flow [data-transport]'));
      var pointGroups = [].slice.call(
        stage.querySelectorAll('.tmap-markers [data-transport], .tmap-labels [data-transport]'));

      var apply = function (mode) {
        var all = mode === 'all';

        routeGroups.forEach(function (g) {
          g.classList.toggle('is-muted', !all && g.dataset.transport !== mode);
        });
        // 마커·라벨의 common(B-CITY)은 어떤 모드에서도 흐려지지 않는다
        pointGroups.forEach(function (g) {
          var keep = all || g.dataset.transport === mode || g.dataset.transport === 'common';
          g.classList.toggle('is-muted', !keep);
        });
        // 흐름은 **선택 상태에서만** 돈다. 전체일 때는 정지가 요구사항이다
        flowGroups.forEach(function (g) {
          g.classList.toggle('is-on', !all && g.dataset.transport === mode);
        });

        cards.forEach(function (b) {
          var on = b.dataset.mode === mode;
          b.classList.toggle('is-on', on);
          b.setAttribute('aria-pressed', on ? 'true' : 'false');
        });
        stage.dataset.mode = mode;
      };

      cards.forEach(function (b) {
        b.addEventListener('click', function () {
          // 같은 카드를 다시 누르면 전체로
          apply(stage.dataset.mode === b.dataset.mode ? 'all' : b.dataset.mode);
        });
      });

      /* 카드 바깥을 누르면 전체로 돌아온다(사용자 지시 2026-08-13).
         '전체' 버튼이 따로 없어서, 되돌아갈 길을 카드 재클릭 하나에만 두면 좁다.

         ⚠ 카드 자신의 핸들러와 부딪히지 않는다 — 둘 다 버블 단계이고 여기서는
           e.target 이 .tmode 안인지 먼저 보므로, 카드 클릭은 여기서 걸러진다.
         ⚠ document 에 건다. 지도(#tmap)만으로는 부족하다 —
           "카드 밖"에는 지도도 페이지 여백도 모두 포함된다. */
      document.addEventListener('click', function (e) {
        if (stage.dataset.mode === 'all') return;
        if (e.target.closest('.tmode')) return;
        apply('all');
      });

      // 키보드에서도 빠져나갈 수 있어야 한다
      document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && stage.dataset.mode !== 'all') apply('all');
      });

      apply('all');
    })();
