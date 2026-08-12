    /* 화면 내 확대보기 — 갤러리 이미지 · 홍보영상 재생을 한 컴포넌트로 처리한다.
       새 창으로 내보내지 않고 같은 화면에서 연다.

       여는 대상은 트리거의 data-* 가 정한다.
         data-lb="image"  + data-src            → 큰 이미지
         data-lb="video"  + data-video-file     → 로컬 mp4 (<video controls>)
         data-lb="video"  + data-youtube        → 유튜브 iframe (nocookie 도메인)

       ⚠ 오버레이 DOM 은 여기서 만든다. 페이지마다 마크업을 넣으면 5곳이 어긋난다.
         클래스 이름은 page-pr.css 와 짝이므로 한쪽만 바꾸지 말 것
         (lint-classes 가 이 파일도 읽어서 죽은 CSS 판정에 반영한다). */
    (function () {
      var triggers = [].slice.call(document.querySelectorAll('[data-lb]'));
      if (!triggers.length) return;

      var box, media, caption, closeBtn, lastFocus = null;

      var build = function () {
        box = document.createElement('div');
        box.className = 'lb';
        box.hidden = true;
        box.innerHTML =
          '<div class="lb-back" data-lb-close></div>' +
          '<div class="lb-panel" role="dialog" aria-modal="true" aria-label="확대보기">' +
            '<button type="button" class="lb-close" data-lb-close aria-label="닫기">' +
              '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" ' +
              'stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>' +
            '</button>' +
            '<div class="lb-media"></div>' +
            '<p class="lb-cap"></p>' +
          '</div>';
        document.body.appendChild(box);
        media = box.querySelector('.lb-media');
        caption = box.querySelector('.lb-cap');
        closeBtn = box.querySelector('.lb-close');
        /* ⚠ closest 로 찾는다. hasAttribute 로는 닫기 버튼이 동작하지 않았다 —
           버튼 안에 <svg> 아이콘이 있어서 가운데를 누르면 e.target 이 <svg>(또는 <path>)이고
           그 노드에는 data-lb-close 가 없다. 버튼 면적의 대부분이 아이콘이라
           "닫기가 안 눌린다"로 나타났다(2026-08-10 신고). */
        box.addEventListener('click', function (e) {
          if (e.target.closest('[data-lb-close]')) close();
        });
      };

      var close = function () {
        if (!box || box.hidden) return;
        // 미디어를 비워야 영상이 계속 재생되지 않는다(iframe 은 제거해야 멈춘다)
        media.innerHTML = '';
        box.hidden = true;
        document.body.style.overflow = '';
        if (lastFocus && lastFocus.focus) lastFocus.focus();
        lastFocus = null;
      };

      var open = function (el) {
        if (!box) build();
        var kind = el.dataset.lb;
        var title = el.dataset.title || '';
        var html = '';

        if (kind === 'image') {
          html = '<img src="' + el.dataset.src + '" alt="' + title.replace(/"/g, '&quot;') + '">';
        } else if (el.dataset.videoFile) {
          // playsinline: iOS 가 전체화면으로 가로채지 않게 한다
          html = '<video src="' + el.dataset.videoFile + '" controls autoplay playsinline></video>';
        } else if (el.dataset.youtube) {
          html = '<div class="lb-embed"><iframe src="https://www.youtube-nocookie.com/embed/' +
                 el.dataset.youtube + '?autoplay=1&rel=0" title="' +
                 title.replace(/"/g, '&quot;') + '" frameborder="0" allowfullscreen ' +
                 'allow="accelerometer; autoplay; encrypted-media; picture-in-picture"></iframe></div>';
        } else {
          return;   // 재생할 것이 없으면 아무것도 하지 않는다
        }

        media.innerHTML = html;
        caption.textContent = title;
        caption.hidden = !title;
        lastFocus = document.activeElement;
        box.hidden = false;
        document.body.style.overflow = 'hidden';
        closeBtn.focus();
      };

      triggers.forEach(function (el) {
        el.addEventListener('click', function (e) {
          e.preventDefault();       // <a> 로 두어 JS 가 죽어도 원본으로 갈 수 있게 했다
          open(el);
        });
      });

      addEventListener('keydown', function (e) {
        if (!box || box.hidden) return;
        if (e.key === 'Escape') { close(); return; }
        // 포커스를 패널 안에 가둔다 — 닫기 버튼 하나뿐이라 Tab 을 되돌리면 충분하다
        if (e.key === 'Tab') { e.preventDefault(); closeBtn.focus(); }
      });
    })();
