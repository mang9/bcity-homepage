/* 문의 모달 — 메인 `index.html` 의 폼 로직을 **그대로 옮긴 것**이다(2026-08-26 지시).
   ⚠ 메인 쪽을 고치면 여기도 함께 고쳐야 한다 — 두 벌이다.
   ⚠ 모달 열고 닫기도 여기서 한다(메인은 페이지 스크립트가 갖고 있다).
     `a[href="#contact"]` 클릭을 가로채 여는 방식이라, 링크만 그렇게 두면 어느 서브페이지에서도 열린다. */
(function () {
  const modal = document.getElementById('contact');
  if (!modal) return;

  /* ── 열고 닫기 ── */
  let returnTo = null;
  const lock = () => { document.body.style.overflow = 'hidden'; };
  const unlock = () => { document.body.style.overflow = ''; };
  function open(trigger) {
    returnTo = trigger || document.activeElement;
    modal.hidden = false; lock();
    void modal.offsetWidth;                 /* 리플로우 강제 → rAF 없이 전환 시작 */
    modal.classList.add('on');
    (modal.querySelector('.pv-x') || modal.querySelector('.pv-panel')).focus({ preventScroll: true });
  }
  function close() {
    modal.classList.remove('on');
    const panel = modal.querySelector('.pv-panel');
    let fired = false;
    const done = () => { if (fired) return; fired = true; modal.hidden = true; unlock(); };
    panel.addEventListener('transitionend', done, { once: true });
    setTimeout(done, 420);                  /* 전환이 없거나 끝나지 않는 환경 대비 */
    if (returnTo && returnTo.focus) returnTo.focus({ preventScroll: true });
  }
  modal.querySelectorAll('[data-pv-close]').forEach((b) => b.addEventListener('click', close));
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !modal.hidden) close();
  });
  /* 이 페이지의 `#contact` 링크 전부가 모달을 연다 — LNB · 버튼 · 푸터 어디서든 */
  document.querySelectorAll('a[href="#contact"], a[href$="#contact"]').forEach((a) => {
    if (/^https?:/.test(a.getAttribute('href'))) return;
    a.addEventListener('click', (e) => { e.preventDefault(); open(a); });
  });
  /* 패널 안 포커스 순환 */
  modal.addEventListener('keydown', (e) => {
    if (e.key !== 'Tab') return;
    const f = [...modal.querySelectorAll('.pv-panel a[href],.pv-panel button,.pv-panel input,.pv-panel textarea,.pv-panel [tabindex]:not([tabindex="-1"])')]
      .filter((n) => n.offsetParent !== null && !n.disabled);
    if (!f.length) return;
    const first = f[0], last = f[f.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  });
  window.bcityCloseModal = close;

  /* ── 폼 (메인에서 옮김) ── */
  const CT_ENDPOINT = '';
      const form = document.getElementById('contactForm');
      if (!form) return;
      const status = document.getElementById('ctStatus');
      const showErr = (key, on) => {
        const el = form.querySelector('[data-err="'+key+'"]');
        if (el) el.classList.toggle('on', on);
      };
      const setBad = (el, on) => el && el.classList.toggle('bad', on);

      // 휴대전화 자동 하이픈
      const tel = form.elements.tel;
      tel.addEventListener('input', () => {
        const d = tel.value.replace(/\D/g,'').slice(0,11);
        tel.value = d.length < 4 ? d
          : d.length < 8 ? d.slice(0,3)+'-'+d.slice(3)
          : d.slice(0,3)+'-'+d.slice(3,7)+'-'+d.slice(7);
      });

      const checks = {
        interest: () => [...form.querySelectorAll('input[name="interest"]')].some(c=>c.checked),
        name:     () => form.elements.name.value.trim().length > 0,
        tel:      () => /^01[016789]-?\d{3,4}-?\d{4}$/.test(form.elements.tel.value.replace(/\s/g,'')),
        email:    () => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(form.elements.email.value.trim()),
        message:  () => form.elements.message.value.trim().length > 0,
        agreeRequired: () => form.elements.agreeRequired.checked,
      };

      // 입력 중 에러 해제
      ['name','tel','email','message'].forEach(k=>{
        form.elements[k].addEventListener('input', ()=>{
          if (checks[k]()) { showErr(k,false); setBad(form.elements[k],false); }
        });
      });
      form.querySelectorAll('input[name="interest"]').forEach(c=>
        c.addEventListener('change', ()=>{ if(checks.interest()) showErr('interest',false); }));
      form.elements.agreeRequired.addEventListener('change', ()=>{
        if (checks.agreeRequired()) showErr('agreeRequired',false); });

      form.addEventListener('submit', e=>{
        e.preventDefault();
        status.className = 'ct-status';
        let firstBad = null;
        for (const key of Object.keys(checks)) {
          const ok = checks[key]();
          showErr(key, !ok);
          // name이 여러 개인 필드(interest)는 RadioNodeList가 오므로 focus 가능한 요소로 바꾼다
          let field = form.elements[key];
          if (!field || typeof field.focus !== 'function') field = form.querySelector('[name="'+key+'"]');
          if (field && field.classList.contains('ct-input')) setBad(field, !ok);
          if (!ok && !firstBad) firstBad = field;
        }
        if (firstBad) {
          firstBad.focus({ preventScroll:false });
          status.textContent = '입력하지 않은 필수 항목이 있습니다.';
          status.className = 'ct-status on ng';
          return;
        }

        const data = {
          관심분야: [...form.querySelectorAll('input[name="interest"]:checked')].map(c=>c.value).join(', '),
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
          fetch(CT_ENDPOINT, { method:'POST', headers:{'Content-Type':'application/json'},
                               body: JSON.stringify(data) })
            .then(r=>{ if(!r.ok) throw new Error(r.status); form.reset();
              status.textContent = '문의가 정상적으로 접수되었습니다. 담당자가 확인 후 연락드립니다.';
              status.className = 'ct-status on ok';
              setTimeout(()=>{ if (window.bcityCloseModal) close(); }, 1800); })
            .catch(()=>{ status.textContent = '전송에 실패했습니다. invest@biotech-iv.com 로 직접 보내주세요.';
              status.className = 'ct-status on ng'; })
            .finally(()=>{ btn.disabled = false; });
          return;
        }

        // 백엔드 미연결: 메일 본문으로 넘긴다
        const body = Object.entries(data).map(([k,v])=>k+' : '+v).join('\n');
        const subject = '[B-CITY 문의] ' + data['회사명/이름'] + ' - ' + data.관심분야;
        location.href = 'mailto:invest@biotech-iv.com?subject=' + encodeURIComponent(subject)
                      + '&body=' + encodeURIComponent(body);
        status.textContent = '메일 작성 창이 열립니다. 열리지 않으면 invest@biotech-iv.com 로 보내주세요.';
        status.className = 'ct-status on ok';
      });

      form.addEventListener('reset', ()=>{
        form.querySelectorAll('.ct-err.on').forEach(el=>el.classList.remove('on'));
        form.querySelectorAll('.ct-input.bad').forEach(el=>el.classList.remove('bad'));
        status.className = 'ct-status';
      });
})();
