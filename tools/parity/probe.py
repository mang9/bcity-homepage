#!/usr/bin/env python3
"""index.html 의 계산된 스타일·기하를 JSON 으로 덤프. 리팩터 전/후 비교용."""
import io, json, re, subprocess, sys, os
M = '/Users/lyj/bcity-homepage'
CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
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
  var SEL=['body','#gnb','#gnb nav','.gnb-logo','#gnbMenu','.gnb-item','.gnb-link',
    '#hero','#hero h1','.cta-solid','.cta-ghost','#dotNav','#floatDock','#fdContact',
    '#location','.lo-grid','.lo-no','.lo-title','.lo-tabs','.lo-tab','.lm',
    '.lm-bg','.lm-fg','.lm-svg','.lo-mapcol',   /* 2026-08-05 회귀로 추가 */
    '#partnerTrack img','.pt-item','.pt-item img','#zonesBg','.az-map-plate','.az-map-base',
    '#business','.ov-eyebrow','.ov-title','.ov-desc','.ov-stats','.ov-stat','.ov-stat dt b','.ov-bottom','.cine-dots',
    '#concept','.cn-dia','.cn-hub','.cn-card','.cn-tt','.cn-ds',
    '#zones','#areaGrid','.az-card','.az-map','.az-map-hl','.az-note',
    '#districts','.dz-grid','.dz-left','.dz-right','.dz-vid','#dzDots',
    '#pr','.pv-head','#footer','.marquee-track','#partnerTrack','.foot-nav'];
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
def run(width, height):
    s = io.open(os.path.join(M,'index.html'), encoding='utf-8').read()
    s = '<script>window.__e=[];addEventListener("error",function(e){window.__e.push(String(e.message||e))});</script>' + s
    io.open(os.path.join(M,'_probe.html'),'w',encoding='utf-8').write(s.replace('</body>', JS, 1))
    p = subprocess.run([CHROME,'--headless=new','--disable-gpu','--no-sandbox','--hide-scrollbars',
        f'--window-size={width},{height}','--virtual-time-budget=14000','--dump-dom',
        'http://localhost:8893/_probe.html'], capture_output=True, text=True)
    m = re.search(r'###(\{.*?\})###', p.stdout, re.S)
    os.remove(os.path.join(M,'_probe.html'))
    if not m: return None
    import html
    return json.loads(html.unescape(m.group(1)))
if __name__ == '__main__':
    out = {}
    for w,h in [(1920,1080),(1440,900),(768,1024),(390,844)]:
        r = run(w,h)
        out[f'{w}x{h}'] = r
        print(f'  {w}x{h}: ' + ('OK ' + str(len(r)-1) + '개 셀렉터' if r else '실패'))
    io.open(sys.argv[1],'w',encoding='utf-8').write(json.dumps(out,ensure_ascii=False,indent=1))
    print('  저장:', sys.argv[1])
