/* 두 칸의 **중심**이 맞는지 잰다. 윗변 정렬(제목↕지도)이 아니라 중심차가 판정 기준이다. */
const PORT=9222, BASE='http://127.0.0.1:8893/';
const rpc=(ws)=>{let id=0;const w=new Map();
 ws.addEventListener('message',e=>{const m=JSON.parse(e.data);
  if(m.id&&w.has(m.id)){const{res,rej}=w.get(m.id);w.delete(m.id);
   m.error?rej(new Error(JSON.stringify(m.error))):res(m.result);}});
 return(method,params={})=>new Promise((res,rej)=>{const n=++id;
  w.set(n,{res,rej});ws.send(JSON.stringify({id:n,method,params}));
  setTimeout(()=>w.has(n)&&(w.delete(n),rej(new Error(method))),40000);});};
const list=await(await fetch(`http://127.0.0.1:${PORT}/json/list`)).json();
const pages=list.filter(x=>x.type==='page');
const ws=new WebSocket(((pages.find(x=>x.url==='about:blank')||pages[0]||list[0])).webSocketDebuggerUrl);
await new Promise(r=>ws.addEventListener('open',r));
const send=rpc(ws);await send('Page.enable');await send('Runtime.enable');await send('Network.enable');
await send('Network.setCacheDisabled',{cacheDisabled:true});
const ev=async e=>{const r=await send('Runtime.evaluate',{expression:e,awaitPromise:true,returnByValue:true});
 if(r.exceptionDetails)throw new Error(r.exceptionDetails.exception?.description||'ev');return r.result.value;};
let fail=0;
console.log('  폭    중심차  섹션위/아래 여백   지도위↕제목위  가로넘침');
for (const W of [1024,1152,1280,1366,1440,1600,1728,1800,1920,2048,2304,2560,899,768,390]) {
  await send('Emulation.setDeviceMetricsOverride',{width:W,height:1000,deviceScaleFactor:1,mobile:W<700});
  await send('Page.navigate',{url:BASE+'about.html?cc='+process.argv[2]+W});
  await new Promise(r=>setTimeout(r,1900));
  await ev(`(()=>{const s=document.createElement('style');
    s.textContent='*,*::before,*::after{transition:none!important;animation:none!important}.rv{opacity:1!important;transform:none!important}';
    document.head.appendChild(s);return 1})()`);
  await new Promise(r=>setTimeout(r,300));
  const r=JSON.parse(await ev(`(()=>{
    const s=document.querySelector('#contact-info'),col=document.querySelector('.ab-col'),
          m=document.querySelector('.ab-map'),t=document.querySelector('#contact-info .sub-t');
    const S=s.getBoundingClientRect(),C=col.getBoundingClientRect(),
          M=m.getBoundingClientRect(),T=t.getBoundingClientRect();
    return JSON.stringify({d:Math.round((M.top+M.bottom)/2-(C.top+C.bottom)/2),
      top:Math.round(M.top-S.top),bot:Math.round(S.bottom-M.bottom),
      tm:Math.round(M.top-T.top),
      stack:M.left<=C.left+2, over:document.documentElement.scrollWidth-innerWidth})})()`));
  const ok = (r.stack ? true : Math.abs(r.d)<=1) && r.over<=0;
  if(!ok)fail++;
  console.log(`  ${String(W).padStart(4)} ${r.stack?' [쌓임]':String(r.d).padStart(6)}  ${String(r.top).padStart(5)}/${String(r.bot).padEnd(5)}      ${String(r.tm).padStart(6)}       ${r.over}  ${ok?'':'✗'}`);
}
console.log(fail?`\n  ✗ ${fail}건`:'\n  ✓ 전 폭 중심 일치 · 넘침 0');
ws.close();
