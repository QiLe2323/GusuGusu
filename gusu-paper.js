import { createPaperPostcard as createPingjiangPaper } from './pingjiang-paper.js?v=1';
import { paperScenes } from './gusu-paper-scenes.js?v=1';
import { paperLayout } from './gusu-paper-layout.js?v=1';

export function createPaperPostcard(container, { placeId = 'pingjiang', tracking = false } = {}) {
  if (placeId === 'pingjiang') return createPingjiangPaper(container, { tracking });
  const profile = paperScenes[placeId];
  if (!profile) throw new Error('Unknown paper postcard: ' + placeId);
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const host = document.createElement('div');
  host.className = 'pingjiang-canvas';
  host.dataset.place = placeId;
  host.setAttribute('aria-label', profile.title + '，分层纸艺动画，拖动轻移视角');
  host.style.cssText='display:block;width:100%;height:100%;position:relative;touch-action:pan-y';
  const shadow=host.attachShadow({mode:'open'});
  shadow.innerHTML=`<style>
    :host{display:block}*{box-sizing:border-box}.frame{position:absolute;inset:0;overflow:hidden;display:grid;place-items:center;background:#ece8df;perspective:1200px}
    .paper{position:relative;width:100%;aspect-ratio:1.5;transform-origin:50% 75%;transform-style:preserve-3d;isolation:isolate}
    .layer{position:absolute;inset:0;pointer-events:none;transform-origin:50% 90%;will-change:transform}
    img{display:block;width:100%;height:100%;object-fit:fill;user-select:none;pointer-events:none}
    .moving{position:absolute;inset:0;transform-origin:50% 70%;animation:leaves 10s ease-in-out infinite alternate;will-change:transform}
    [data-name=foliage] .moving{transform-origin:15% 10%;animation:bough 12s ease-in-out infinite alternate}
    .effect{position:absolute;inset:0;pointer-events:none;opacity:0;transition:opacity 1.3s;mix-blend-mode:soft-light}
    .sun{background:linear-gradient(120deg,transparent 22%,#ffe8a066 35%,transparent 52%);background-size:220% 100%}
    .warm{background:radial-gradient(ellipse at 52% 53%,#ffd28666,transparent 65%)}
    .lantern{background:radial-gradient(ellipse at 74% 35%,#ffb34088,transparent 26%)}
    .windows{background:repeating-linear-gradient(90deg,transparent 0 12%,#ffc86e77 13% 15%,transparent 16% 23%);clip-path:polygon(18% 33%,78% 25%,78% 57%,18% 69%)}
    .water{background:repeating-radial-gradient(ellipse at 50% 54%,transparent 0 18px,#e5f8ee66 19px,transparent 20px 35px);clip-path:polygon(45% 52%,56% 52%,87% 94%,14% 94%)}
    .mist{background:linear-gradient(0deg,#ecf3e7aa,transparent 55%);mix-blend-mode:screen}
    .tunnel{background:radial-gradient(ellipse at 65% 55%,#ffe3a588,transparent 30%)}
    .detail .effect{opacity:.7;animation:light 12s ease-in-out infinite alternate}
    .detail .moving{animation-duration:5s}.paused *{animation-play-state:paused!important}
    .message{position:absolute;inset:0;display:grid;place-items:center;color:#5e6b5b;background:#ece8df;font:13px system-ui;padding:24px;text-align:center;z-index:10}.message[hidden]{display:none}
    @keyframes leaves{from{transform:rotate(-.15deg)}to{transform:rotate(.45deg) translateY(-.12%)}}
    @keyframes bough{to{transform:rotate(.55deg) translateY(.12%)}}
    @keyframes cloud{from{transform:translateX(-1.8%)}to{transform:translateX(2.1%)}}
    @keyframes cart{from{transform:translateX(-1.5%) translateY(.3%)}to{transform:translateX(2.2%) translateY(-.3%)}}
    @keyframes willow{to{transform:skewX(.65deg) rotate(.2deg)}}
    @keyframes incense{from{transform:translateY(1%);opacity:.4}to{transform:translateY(-2%);opacity:.8}}
    @keyframes lantern{from{transform:rotate(-.6deg)}to{transform:rotate(.9deg)}}
    @keyframes bamboo{to{transform:skewX(.5deg) rotate(-.25deg)}}
    @keyframes reflection{from{transform:scaleX(.98);opacity:.5}to{transform:scaleX(1.025) translateY(.4%);opacity:.95}}
    @keyframes falling{from{transform:translate(-1%,-1.8%) rotate(-.8deg);opacity:.25}45%{opacity:1}to{transform:translate(1.2%,2.5%) rotate(1.5deg);opacity:.2}}
    @keyframes laundry{from{transform:skewX(-.45deg)}to{transform:skewX(.65deg)}}
    @keyframes floating{from{transform:translate(-.7%,.5%) rotate(-.3deg)}to{transform:translate(1.4%,-1%) rotate(.8deg)}}
    @keyframes book{from{transform:perspective(900px) rotateY(-2deg)}to{transform:perspective(900px) rotateY(3deg)}}
    @keyframes washing{from{transform:rotate(-.25deg) scaleY(.997)}to{transform:rotate(.35deg) scaleY(1.006)}}
    @keyframes mist{from{transform:translateX(-2%);opacity:.35}to{transform:translateX(2%);opacity:.9}}
    @keyframes flag{from{transform:skewX(-.7deg) scaleX(.995)}to{transform:skewX(1deg) scaleX(1.005)}}
    @keyframes traveler{from{transform:translate(-1.3%,.1%)}to{transform:translate(1.5%,-.2%)}}
    @keyframes light{to{background-position:100% 0;opacity:.4}}
    .hidden{visibility:hidden}.hidden *{animation-play-state:paused!important}
    @media(prefers-reduced-motion:reduce){*{animation:none!important;transition:none!important}}
  </style><div class="frame"><div class="paper">
    <div class="layer" data-name="backdrop"><img alt="${profile.title}纸艺全景"></div>
    <div class="layer" data-name="subject"><div class="moving" style="animation-name:${profile.motion}"><img alt="地点专属动态纸层"></div></div>
    <div class="layer" data-name="foliage"><div class="moving"><img alt="前景纸层"></div></div>
    <div class="effect ${profile.effect}"></div>
  </div><div class="message" role="status">正在展开纸上姑苏…</div></div>`;
  container.append(host);
  const frame=shadow.querySelector('.frame'),paper=shadow.querySelector('.paper');
  const layers=[...shadow.querySelectorAll('.layer')], message=shadow.querySelector('.message');
  for(const layer of layers){
    const position=paperLayout[placeId]?.[layer.dataset.name];
    if(position){const image=layer.querySelector('img');image.style.transformOrigin='0 0';image.style.transform=`translate(${position.x}%,${position.y}%) scale(${position.scale})`;}
  }
  if(tracking) frame.style.background='transparent';
  let disposed=false,visible=true,ready=false,detail=false,dragging=false,entrance=[];
  let x=0,y=0,targetX=0,targetY=0,pointer,raf;
  function replay(){
    if(!ready||disposed||reduced)return;
    entrance.forEach(a=>a.cancel());
    const from=profile.entry==='side'?'translateX(-2%) scaleX(.97)':profile.entry==='depth'?'translateY(1.5%) scale(.96)':profile.entry==='bridge'?'translateY(2%) scaleY(.86)':'translateY(3%) scaleY(.88)';
    entrance=layers.map((layer,i)=>layer.animate([{opacity:0,transform:from},{opacity:1,transform:'none'}],{duration:1100+i*130,delay:i*250,easing:'cubic-bezier(.2,.7,.2,1)',fill:'backwards'}));
  }
  Promise.all(layers.map(layer=>new Promise((resolve,reject)=>{
    const image=layer.querySelector('img');image.onload=resolve;image.onerror=()=>reject(new Error('Missing paper layer '+placeId+'/'+layer.dataset.name));
    image.src=new URL(`./images/paper-gusu/${placeId}/${layer.dataset.name}.webp`,import.meta.url).href;
  }))).then(()=>{if(disposed)return;ready=true;host.dataset.ready='true';message.hidden=true;replay()}).catch(error=>{if(disposed)return;host.dataset.ready='error';message.textContent='纸艺素材暂时未加载完整，请刷新重试。';console.error(error)});
  function resize(){paper.style.width=Math.min(host.clientWidth,host.clientHeight*1.5)+'px'}
  const observer=new ResizeObserver(resize);observer.observe(host);resize();
  function draw(){
    if(disposed)return;
    if(visible&&!document.hidden&&!tracking&&!reduced){x+=(targetX-x)*.075;y+=(targetY-y)*.075;paper.style.transform=`rotateY(${x*2.2}deg) rotateX(${-y*1.6}deg)`;layers.forEach((l,i)=>{l.style.transform=`translate(${x*i*.15}%,${y*i*.1}%)`})}
    if(Math.abs(targetX-x)+Math.abs(targetY-y)>.0005)raf=requestAnimationFrame(draw);
    else raf=0;
  }
  function down(e){if(tracking||reduced)return;dragging=true;pointer=[e.clientX,e.clientY];host.setPointerCapture(e.pointerId)}
  function move(e){if(!dragging)return;targetX=Math.max(-1,Math.min(1,(e.clientX-pointer[0])/120));targetY=Math.max(-1,Math.min(1,(e.clientY-pointer[1])/120));if(!raf)raf=requestAnimationFrame(draw)}
  function up(){dragging=false}
  function visibility(){frame.classList.toggle('paused',document.hidden)}
  document.addEventListener('visibilitychange',visibility);
  host.addEventListener('pointerdown',down);host.addEventListener('pointermove',move);host.addEventListener('pointerup',up);host.addEventListener('pointercancel',up);
  return {actionLabel:profile.action,replay,
    toggleDetail(){detail=!detail;frame.classList.toggle('detail',detail);host.dataset.detail=String(detail);return detail},
    setVisible(value){visible=Boolean(value);frame.classList.toggle('hidden',!visible)},
    track(corners){
      visible=Boolean(corners);frame.classList.toggle('hidden',!visible);
      if(!corners||!host.clientWidth||!host.clientHeight)return;
      const unit=[[0,0],[1,0],[1,1],[0,1]],width=host.clientWidth,height=host.clientHeight;
      const h=window.computeHomography(corners.map(([a,b],i)=>({old:{x:unit[i][0]*paper.clientWidth,y:unit[i][1]*paper.clientHeight},new:{x:a*width,y:b*height}})));
      if(!h)return;frame.style.display='block';paper.style.position='absolute';paper.style.left=paper.style.top='0';paper.style.transformOrigin='0 0';
      paper.style.transform=`matrix3d(${[h[0],h[3],0,h[6],h[1],h[4],0,h[7],0,0,1,0,h[2],h[5],0,1].join(',')})`;
    },
    dispose(){if(disposed)return;disposed=true;observer.disconnect();cancelAnimationFrame(raf);entrance.forEach(a=>a.cancel());document.removeEventListener('visibilitychange',visibility);host.removeEventListener('pointerdown',down);host.removeEventListener('pointermove',move);host.removeEventListener('pointerup',up);host.removeEventListener('pointercancel',up);host.remove()}
  };
}
