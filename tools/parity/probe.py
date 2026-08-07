#!/usr/bin/env python3
"""계산된 스타일·기하를 JSON 으로 덤프. 리팩터 전/후 비교용.

    python3 tools/parity/probe.py out.json                 # index.html (기본)
    python3 tools/parity/probe.py out.json overview.html   # 서브페이지 (셀렉터 세트 자동 전환)

⚠ SEL_INDEX 와 PROPS 는 건드리지 말 것 — baseline.json 이 그 형식으로 굳어 있다.
  서브페이지 셀렉터를 늘리는 것은 안전하다(없는 셀렉터는 count:0 으로 남아 0→0 비교된다).
"""
import io, json, re, subprocess, sys, os

M = '/Users/lyj/bcity-homepage'
CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'

# ── index.html (메인) — 2026-08-05 회귀로 추가된 셀렉터가 섞여 있다. 빼지 말 것 ──────────
SEL_INDEX = [
    'body', '#gnb', '#gnb nav', '.gnb-logo', '#gnbMenu', '.gnb-item', '.gnb-link',
    '#hero', '#hero h1', '.cta-solid', '.cta-ghost', '#dotNav', '#floatDock', '#fdContact',
    '#location', '.lo-grid', '.lo-no', '.lo-title', '.lo-tabs', '.lo-tab', '.lm',
    '.lm-bg', '.lm-fg', '.lm-svg', '.lo-mapcol',                    # 2026-08-05 회귀로 추가
    '#partnerTrack img', '.pt-item', '.pt-item img', '#zonesBg', '.az-map-plate', '.az-map-base',
    '#business', '.ov-eyebrow', '.ov-title', '.ov-desc', '.ov-stats', '.ov-stat', '.ov-stat dt b',
    '.ov-bottom', '.cine-dots',
    '#concept', '.cn-dia', '.cn-hub', '.cn-card', '.cn-tt', '.cn-ds',
    '#zones', '#areaGrid', '.az-card', '.az-map', '.az-map-hl', '.az-note',
    '#districts', '.dz-grid', '.dz-left', '.dz-right', '.dz-vid', '#dzDots',
    '#pr', '.pv-head', '#footer', '.marquee-track', '#partnerTrack', '.foot-nav',
]

# ── 서브페이지 공용 — 5개 서브페이지를 한 목록으로 덮는다 ────────────────────────────
#    공통 셸(GNB·히어로·LNB·섹션·푸터)은 빌드로 공유되므로 회귀가 나면 전 페이지에 번진다.
#    그래서 셸 셀렉터를 페이지 컴포넌트보다 촘촘히 넣었다.
SEL_SUB = [
    # 공통 셸
    'body', '.wrap', '.gnb', '.gnb .wrap', '.gnb-menu', '.gnb-menu a', '.logo',
    '.gnb-side', '.gnb-lang', '.gnb-sns', '.gnb-sns a', '.burger',
    '.mnav', '.mnav-panel', '.mnav h2', '.mnav a',
    '.hero', '.hero-bg', '.hero-scrim', '.hero .wrap', '.crumb', '.hero-eyebrow', '.hero h1',
    '.lnb', '.lnb .wrap', '.lnb a', '.lnb a.is-on',
    'main', '.sec', '.sec--surface', '.eyebrow', '.h2', '.lede', '.rv',
    '.foot', '.foot-top', '.foot .logo', '.foot-addr', '.foot-dis', '.foot-bot', '.foot-nav',
    # 사업개요 — 표 · 이미지 3컷 · 특화단지 지도/말풍선
    '.spec', '.spec thead th', '.spec tbody th', '.spec td', '.spec .k',
    '.shots', '.shot', '.shot img', '.shot figcaption',
    '.bc', '.bc-label', '.bc-maps', '.bc-panel--kr', '.bc-panel--gw', '.bc-frame',
    '.bc-panel--kr .bc-frame img', '.bc-call', '.bc-call-in', '.bc-call b', '.bc-lead', '.cl-note',
    # 입지
    '.tr-block', '.tr-no', '.tr-head', '.tr-sub', '.dtab', '.dtab th', '.dtab td', '.dtab caption',
    '.infra', '.infra-item', '.infra-item b', '.chips', '.chip', '.closer', '.closer p',
    # 기대효과
    '.kpi', '.kpi-item', '.kpi-v', '.kpi-l', '.kpi-d',
    '.eff', '.eff-card', '.eff-card h3', '.eff-list', '.eff-list li',
    # 추진일정
    '.tl', '.tl-year', '.tl-y', '.tl-items', '.tl-item', '.tl-d', '.tl-t',
    # 사업주체
    '.pfv', '.pfv-box', '.pfv-note', '.merit', '.merit-item', '.merit-item b',
    '.docs', '.docs li', '.ptn-group', '.ptn-gh', '.ptn-card', '.ptn-logo', '.ptn-card b',
]

JS = r"""
<script>
addEventListener('load',function(){setTimeout(function(){
  var st=document.createElement('style');
  st.textContent='*{transition:none!important;animation:none!important}';
  document.head.appendChild(st);
  document.querySelectorAll('.reveal,.lr,.anim,.az-card,.cn-dia,.rv').forEach(function(e){e.classList.add('in')});
  void document.body.offsetHeight;
  var PROPS=['display','position','fontFamily','fontSize','fontWeight','lineHeight','letterSpacing',
             'color','backgroundColor','borderTopWidth','borderTopColor','borderRadius','opacity',
             'paddingTop','paddingLeft','marginTop','gap','gridTemplateColumns','flexDirection',
             'zIndex','overflow','textAlign','maxWidth','width','height'];
  var SEL=__SEL__;
  var out={};
  SEL.forEach(function(sel){
    var els=[].slice.call(document.querySelectorAll(sel));
    out[sel]={count:els.length};
    if(!els.length) return;
    var e=els[0], cs=getComputedStyle(e), r=e.getBoundingClientRect();
    var o={box:[Math.round(r.left),Math.round(r.top),Math.round(r.width),Math.round(r.height)]};
    PROPS.forEach(function(p){ o[p]=cs[p]; });
    out[sel].first=o;
  });
  out.__meta={
    vw:innerWidth, vh:innerHeight,
    docH:document.documentElement.scrollHeight,
    docOvf:Math.max(0,document.documentElement.scrollWidth-innerWidth),
    nodes:document.getElementsByTagName('*').length,
    sheets:document.styleSheets.length,
    imgFail:[].slice.call(document.images).filter(function(i){return i.complete&&i.naturalWidth===0}).length,
    jsErr:(window.__e||[]).length
  };
  var rules=0; try{[].slice.call(document.styleSheets).forEach(function(ss){try{rules+=ss.cssRules.length}catch(e){}})}catch(e){}
  out.__meta.cssRules=rules;
  var pre=document.createElement('pre'); pre.id='PROBE';
  pre.textContent='###'+JSON.stringify(out)+'###';
  document.body.appendChild(pre);
},3000)});
</script>
</body>"""


def run(page, sel, width, height):
    js = JS.replace('__SEL__', json.dumps(sel))
    s = io.open(os.path.join(M, page), encoding='utf-8').read()
    s = '<script>window.__e=[];addEventListener("error",function(e){window.__e.push(String(e.message||e))});</script>' + s
    io.open(os.path.join(M, '_probe.html'), 'w', encoding='utf-8').write(s.replace('</body>', js, 1))
    p = subprocess.run([CHROME, '--headless=new', '--disable-gpu', '--no-sandbox', '--hide-scrollbars',
        f'--window-size={width},{height}', '--virtual-time-budget=14000', '--dump-dom',
        'http://localhost:8893/_probe.html'], capture_output=True, text=True)
    m = re.search(r'###(\{.*?\})###', p.stdout, re.S)
    os.remove(os.path.join(M, '_probe.html'))
    if not m:
        return None
    import html
    return json.loads(html.unescape(m.group(1)))


if __name__ == '__main__':
    page = sys.argv[2] if len(sys.argv) > 2 else 'index.html'
    sel = SEL_INDEX if page == 'index.html' else SEL_SUB
    print(f'  대상: {page} · 셀렉터 {len(sel)}개')
    out = {}
    for w, h in [(1920, 1080), (1440, 900), (768, 1024), (390, 844)]:
        r = run(page, sel, w, h)
        out[f'{w}x{h}'] = r
        print(f'  {w}x{h}: ' + ('OK ' + str(len(r) - 1) + '개 셀렉터' if r else '실패'))
    io.open(sys.argv[1], 'w', encoding='utf-8').write(json.dumps(out, ensure_ascii=False, indent=1))
    print('  저장:', sys.argv[1])
