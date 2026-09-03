/* 생성물이다. 이 파일을 고치지 말 것 — 소스는 src/shared/contact.js 다.
   서브페이지는 같은 소스를 인라인으로 받는다(tools/build/pages.mjs). */
/* ===== 문의 · 약관 모달 — 메인과 서브페이지가 **함께 쓰는 한 벌** =====
   2026-08-27 에 두 벌을 합쳤다. 전에는 같은 검증 로직 90여 줄이 `index.html` 인라인과
   `src/sub/js/contact.js` 에 나뉘어 있었고, 모달 엔진은 아예 기능이 달랐다
   (메인만 스택·해시 진입을 지원했다).

   싣는 경로가 둘이다 — 파일은 하나다:
     메인   `index.html` 의 `<script src="assets/js/contact.js" defer>`
     서브   front-matter `"js": ["contact"]` → `pages.mjs` 가 인라인
   `tools/build/pages.mjs` 가 빌드 때마다 이 파일을 `assets/js/contact.js` 로 복사한다.

   ⚠ 이 파일은 **두 화면에서 모두 돌아간다.** 한쪽에만 있는 요소를 전제하지 말 것 —
     서브페이지에는 `#privacy` 약관 모달이 없고, 메인에는 서브 LNB 가 없다.
     선택자는 항상 `.pv` · `.ct-*` 처럼 **양쪽에 같은 이름으로 있는 것**만 쓴다.
   ⚠ 모듈이 아니다(번들러 없음). 전역을 더럽히지 않도록 IIFE 로 감싼다. */

/* ── 모달 엔진 — 페이지의 `.pv` 전부를 맡는다 ───────────────────────── */
(function () {
  const stack = [];
  const modals = [...document.querySelectorAll('.pv')];
  if (!modals.length) return;

  const lock = () => { document.body.style.overflow = 'hidden'; };
  const unlock = () => { if (!stack.length) document.body.style.overflow = ''; };

  function open(el, trigger) {
    if (!el || stack.includes(el)) return;
    el.__return = trigger || document.activeElement;
    el.style.zIndex = 120 + stack.length * 10;   // 위에 열리는 모달이 항상 앞
    el.hidden = false;
    lock();
    void el.offsetWidth;                          // 리플로우 강제 → rAF 없이 전환 시작
    el.classList.add('on');
    stack.push(el);
    (el.querySelector('.pv-x') || el.querySelector('.pv-panel')).focus({ preventScroll: true });
  }

  function close(el) {
    const i = stack.indexOf(el);
    if (i === -1) return;
    stack.splice(i, 1);
    el.classList.remove('on');
    const panel = el.querySelector('.pv-panel');
    let fired = false;
    const done = () => { if (fired) return; fired = true; el.hidden = true; unlock(); };
    // 트랜지션이 없거나 끝나지 않는 환경에서도 확실히 닫히도록
    panel.addEventListener('transitionend', done, { once: true });
    setTimeout(done, 420);
    if (el.__return && el.__return.focus) el.__return.focus({ preventScroll: true });
  }

  modals.forEach((el) => {
    el.querySelector('.pv-panel').setAttribute('tabindex', '-1');
    el.querySelectorAll('[data-pv-close]').forEach((b) => b.addEventListener('click', () => close(el)));
    el.addEventListener('keydown', (e) => {                     // 패널 안 포커스 순환
      if (e.key !== 'Tab') return;
      const f = [...el.querySelectorAll('.pv-panel a[href],.pv-panel button,.pv-panel input,.pv-panel textarea,.pv-panel [tabindex]:not([tabindex="-1"])')]
        .filter((n) => n.offsetParent !== null && !n.disabled);
      if (!f.length) return;
      const first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    });
  });

  /* 같은 페이지 안에서 그 id 를 가리키는 링크가 모달을 연다.
     ⚠ 서브페이지의 `문의하기` 는 `index.html#contact` 처럼 **파일명이 붙은** 형태일 수 있다.
       그 페이지에 같은 id 의 모달이 있으면 이동하지 않고 그 자리에서 연다. */
  document.querySelectorAll('a[href*="#"]').forEach((a) => {
    const href = a.getAttribute('href');
    if (/^https?:/.test(href)) return;
    const el = document.getElementById(href.slice(href.indexOf('#') + 1));
    if (!el || !el.classList.contains('pv')) return;
    a.addEventListener('click', (e) => { e.preventDefault(); open(el, a); });
  });

  /* 다른 페이지에서 `index.html#contact` 로 들어온 경우 — 해시가 가리키는 모달을 연다.
     ⚠ 위 바인딩은 **같은 페이지 안의 클릭**만 잡는다. 이게 없으면 메인에 도착만 하고
       폼이 열리지 않는다(2026-08-26 이전까지 실제로 그랬다).
     ⚠ `open` 의 두 번째 인수는 닫은 뒤 포커스를 돌려줄 요소다 — 해시 진입에는 없으므로
       `null` 을 준다(그러면 `document.activeElement` 로 떨어진다). */
  const openFromHash = () => {
    const id = location.hash.slice(1);
    const el = id && document.getElementById(id);
    if (el && el.classList.contains('pv')) open(el, null);
  };
  openFromHash();
  window.addEventListener('hashchange', openFromHash);

  // ESC → 가장 위 모달만 닫기
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && stack.length) close(stack[stack.length - 1]);
  });

  window.bcityCloseModal = close;   // 폼 전송 완료 후 닫기용
})();

/* ── 문의 폼 ────────────────────────────────────────────────────────
   서버가 없으므로 기본 동작은 메일 클라이언트로 내용을 넘기는 방식이다.
   백엔드가 준비되면 CT_ENDPOINT 에 URL 을 넣으면 fetch POST 로 전송된다. */
(function () {
  const CT_ENDPOINT = '';   // 예: 'https://api.b-city.kr/inquiry'
  const form = document.getElementById('contactForm');
  if (!form) return;
  const status = document.getElementById('ctStatus');
  const showErr = (key, on) => {
    const el = form.querySelector('[data-err="' + key + '"]');
    if (el) el.classList.toggle('on', on);
  };
  const setBad = (el, on) => el && el.classList.toggle('bad', on);

  // 휴대전화 자동 하이픈
  const tel = form.elements.tel;
  tel.addEventListener('input', () => {
    const d = tel.value.replace(/\D/g, '').slice(0, 11);
    tel.value = d.length < 4 ? d
      : d.length < 8 ? d.slice(0, 3) + '-' + d.slice(3)
        : d.slice(0, 3) + '-' + d.slice(3, 7) + '-' + d.slice(7);
  });

  const checks = {
    interest: () => [...form.querySelectorAll('input[name="interest"]')].some((c) => c.checked),
    name: () => form.elements.name.value.trim().length > 0,
    tel: () => /^01[016789]-?\d{3,4}-?\d{4}$/.test(form.elements.tel.value.replace(/\s/g, '')),
    email: () => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(form.elements.email.value.trim()),
    message: () => form.elements.message.value.trim().length > 0,
    agreeRequired: () => form.elements.agreeRequired.checked,
  };

  // 입력 중 에러 해제
  ['name', 'tel', 'email', 'message'].forEach((k) => {
    form.elements[k].addEventListener('input', () => {
      if (checks[k]()) { showErr(k, false); setBad(form.elements[k], false); }
    });
  });
  form.querySelectorAll('input[name="interest"]').forEach((c) =>
    c.addEventListener('change', () => { if (checks.interest()) showErr('interest', false); }));
  form.elements.agreeRequired.addEventListener('change', () => {
    if (checks.agreeRequired()) showErr('agreeRequired', false);
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    status.className = 'ct-status';
    let firstBad = null;
    for (const key of Object.keys(checks)) {
      const ok = checks[key]();
      showErr(key, !ok);
      // name 이 여러 개인 필드(interest)는 RadioNodeList 가 오므로 focus 가능한 요소로 바꾼다
      let field = form.elements[key];
      if (!field || typeof field.focus !== 'function') field = form.querySelector('[name="' + key + '"]');
      if (field && field.classList.contains('ct-input')) setBad(field, !ok);
      if (!ok && !firstBad) firstBad = field;
    }
    if (firstBad) {
      firstBad.focus({ preventScroll: false });
      status.textContent = '입력하지 않은 필수 항목이 있습니다.';
      status.className = 'ct-status on ng';
      return;
    }

    const data = {
      관심분야: [...form.querySelectorAll('input[name="interest"]:checked')].map((c) => c.value).join(', '),
      '회사명/이름': form.elements.name.value.trim(),
      휴대전화: form.elements.tel.value.trim(),
      이메일: form.elements.email.value.trim(),
      문의내용: form.elements.message.value.trim(),
      마케팅활용동의: form.elements.agreeMarketing.checked ? '동의' : '미동의',
    };

    if (CT_ENDPOINT) {
      const btn = document.querySelector('#contact .ct-submit');
      btn.disabled = true;
      status.textContent = '전송 중입니다…';
      status.className = 'ct-status on';
      fetch(CT_ENDPOINT, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
        .then((r) => {
          if (!r.ok) throw new Error(r.status); form.reset();
          status.textContent = '문의가 정상적으로 접수되었습니다. 담당자가 확인 후 연락드립니다.';
          status.className = 'ct-status on ok';
          setTimeout(() => {
            if (window.bcityCloseModal) window.bcityCloseModal(document.getElementById('contact'));
          }, 1800);
        })
        .catch(() => {
          status.textContent = '전송에 실패했습니다. 잠시 후 다시 시도해 주세요.';
          status.className = 'ct-status on ng';
        })
        .finally(() => { btn.disabled = false; });
      return;
    }

    /* 백엔드 미연결: 메일 본문으로 넘긴다.
       ⚠⚠ 수신 주소를 **화면에 띄우지 않는다**(2026-09-01 지시: '개인 메일 노출은 숨기고').
         담당자 연락처 카드도 같은 이유로 걷어냈다. 여기 남은 주소는 mailto 대상일 뿐
         어떤 문구에도 찍히지 않는다 — 문구에 다시 넣지 말 것.
       ⚠ 이 폴백을 지우지 말 것. CT_ENDPOINT 가 붙기 전까지 문의를 받는 유일한 경로다.
         엔드포인트가 붙으면 서버가 담당자 여러 명에게 자동 발송하고, 이 분기는 안 탄다. */
    const body = Object.entries(data).map(([k, v]) => k + ' : ' + v).join('\n');
    const subject = '[B-CITY 문의] ' + data['회사명/이름'] + ' - ' + data.관심분야;
    location.href = 'mailto:juyoung@biotech-iv.com?subject=' + encodeURIComponent(subject)
      + '&body=' + encodeURIComponent(body);
    status.textContent = '메일 작성 창이 열립니다. 열리지 않으면 다시 시도해 주세요.';
    status.className = 'ct-status on ok';
  });

  form.addEventListener('reset', () => {
    form.querySelectorAll('.ct-err.on').forEach((el) => el.classList.remove('on'));
    form.querySelectorAll('.ct-input.bad').forEach((el) => el.classList.remove('bad'));
    status.className = 'ct-status';
  });
})();
