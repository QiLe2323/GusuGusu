const artwork = new URL('./images/paper-pingjiang/', import.meta.url);

export function createPaperPostcard(container, { tracking = false } = {}) {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const host = document.createElement('div');
  host.className = 'pingjiang-canvas';
  host.dataset.place = 'pingjiang';
  host.setAttribute('aria-label', '平江路分层立体纸艺，拖动可轻移视角');
  host.style.cssText = 'display:block;width:100%;height:100%;position:relative;touch-action:pan-y;';
  const shadow = host.attachShadow({ mode: 'open' });
  shadow.innerHTML = `<style>
    :host{display:block}*{box-sizing:border-box}.frame{position:absolute;inset:0;overflow:hidden;display:grid;place-items:center;background:#ece8df;perspective:1200px;touch-action:pan-y}
    .paper{width:100%;aspect-ratio:1.5;max-height:100%;position:relative;transform-style:preserve-3d;transform-origin:center 70%}
    .layer{position:absolute;inset:0;transform-origin:50% 90%;pointer-events:none;will-change:transform}
    img{display:block;width:100%;height:100%;object-fit:fill;user-select:none;pointer-events:none}
    .layer[data-name=left],.layer[data-name=right]{filter:drop-shadow(0 3px 2px #514a3620)}
    .branches{width:100%;height:84%;transform-origin:70% 75%;animation:branch-breeze 9s ease-in-out infinite alternate}
    .sailing{width:100%;height:100%;transform:translateX(3%);animation:boat-drift 13s ease-in-out infinite alternate;transform-origin:25% 76%}
    .ripples{position:absolute;left:18%;top:57%;width:50%;height:31%;opacity:.15;clip-path:polygon(42% 0,64% 0,100% 100%,0 100%);background:repeating-radial-gradient(ellipse at 52% -40%,transparent 0 14px,#f7f2d2 15px,transparent 16px 29px);animation:water 8s linear infinite alternate;mix-blend-mode:screen;pointer-events:none}
    .message{position:absolute;inset:0;display:grid;place-items:center;color:#5e6b5b;background:#ece8df;font:13px system-ui;padding:24px;text-align:center;z-index:10}.message[hidden]{display:none}
    @keyframes branch-breeze{from{transform:rotate(-.12deg)}to{transform:rotate(.22deg)}}
    @keyframes boat-drift{from{transform:translate(2.65%,.15%) rotate(-.15deg)}to{transform:translate(4.15%,-.45%) rotate(.20deg)}}
    @keyframes water{to{transform:translateY(3%);opacity:.28}}
    .paused .sailing{animation-play-state:paused}.still *{animation:none!important}.hidden{visibility:hidden}
    @media(prefers-reduced-motion:reduce){*{animation:none!important}}
  </style><div class="frame ${reduced ? 'still' : ''}"><div class="paper">
    <div class="layer" data-name="backdrop"><img alt="远处水巷与纸卡底座"></div>
    <div class="ripples"></div>
    <div class="layer" data-name="left"><img alt="左岸灰瓦白墙与石岸"></div>
    <div class="layer" data-name="right"><img alt="右岸房屋、步道和撑伞的人"></div>
    <div class="layer" data-name="boat"><div class="sailing"><img alt="乌篷纸船"></div></div>
    <div class="layer" data-name="branches"><div class="branches"><img alt="前景的纸艺树枝与柳叶"></div></div>
  </div><div class="message" role="status">正在展开纸上姑苏…</div></div>`;
  container.append(host);
  const frame = shadow.querySelector('.frame');
  const paper = shadow.querySelector('.paper');
  const layers = [...shadow.querySelectorAll('.layer')];
  const message = shadow.querySelector('.message');
  if (tracking) frame.style.background='transparent';
  let disposed = false, visible = true, ready = false, paused = false, dragging = false;
  let x = 0, y = 0, targetX = 0, targetY = 0, pointer, animation;
  let entrance = [];

  function replay() {
    if (!ready || reduced || disposed) return;
    entrance.forEach(item => item.cancel());
    entrance = layers.map((layer, i) => layer.animate([
      { opacity: 0, transform: `translateY(${i ? 3 : 0}%) scaleY(${i ? .87 : 1})` },
      { opacity: 1, transform: 'none' }
    ], { duration: 1000 + i * 80, delay: i * 230, easing: 'cubic-bezier(.2,.7,.2,1)', fill: 'backwards' }));
  }
  Promise.all(layers.map(layer => new Promise((resolve, reject) => {
    const image = layer.querySelector('img');
    image.decoding = 'async';
    image.onload = () => { if (!disposed && layer.dataset.name === 'backdrop') { message.hidden = true; host.dataset.ready = 'partial'; } resolve(); };
    image.onerror = () => reject(new Error('Missing paper layer: ' + layer.dataset.name));
    image.src = new URL(layer.dataset.name + '.webp', artwork).href;
  }))).then(() => {
    if (disposed) return;
    ready = true; host.dataset.ready = 'true'; message.hidden = true; replay();
  }).catch(error => {
    if (disposed) return;
    host.dataset.ready = 'error';
    message.textContent = '纸艺素材暂时未加载完整，请刷新重试。';
    console.error(error);
  });

  function resize() {
    const width = host.clientWidth, height = host.clientHeight;
    const cardWidth = Math.min(width, height * 1.5);
    paper.style.width = cardWidth + 'px';
  }
  const observer = new ResizeObserver(resize); observer.observe(host); resize();
  function draw() {
    if (disposed) return;
    if (visible && !document.hidden && !tracking) {
      x += (targetX - x) * .075; y += (targetY - y) * .075;
      paper.style.transform = `rotateY(${x * 2.2}deg) rotateX(${-y * 1.6}deg)`;
      layers.forEach((layer, i) => layer.style.transform = `translate(${x * i * .22}%,${y * i * .15}%)`);
    }
    animation = requestAnimationFrame(draw);
  }
  animation = requestAnimationFrame(draw);
  function down(event) {
    if (tracking || reduced) return;
    dragging = true; pointer = [event.clientX, event.clientY];
    host.setPointerCapture(event.pointerId);
  }
  function move(event) {
    if (!dragging) return;
    targetX = Math.max(-1, Math.min(1, (event.clientX - pointer[0]) / 120));
    targetY = Math.max(-1, Math.min(1, (event.clientY - pointer[1]) / 120));
  }
  function up() { dragging = false; }
  host.addEventListener('pointerdown', down); host.addEventListener('pointermove', move);
  host.addEventListener('pointerup', up); host.addEventListener('pointercancel', up);
  return {
    actionLabel: '让纸船停一停',
    replay,
    toggleDetail() { paused = !paused; frame.classList.toggle('paused', paused); host.dataset.detail = String(paused); return paused; },
    setVisible(value) { visible = value; frame.classList.toggle('hidden', !value); },
    track(corners) {
      visible = Boolean(corners); frame.classList.toggle('hidden', !visible);
      if (!corners || !host.clientWidth || !host.clientHeight) return;
      const width = host.clientWidth, height = host.clientHeight;
      const unit = [[0, 0], [1, 0], [1, 1], [0, 1]];
      const h = window.computeHomography(corners.map(([a, b], i) => ({ old: { x: unit[i][0] * paper.clientWidth, y: unit[i][1] * paper.clientHeight }, new: { x: a * width, y: b * height } })));
      if (!h) return;
      frame.style.display = 'block'; paper.style.position = 'absolute'; paper.style.left = paper.style.top = '0'; paper.style.transformOrigin = '0 0';
      paper.style.transform = `matrix3d(${[h[0],h[3],0,h[6],h[1],h[4],0,h[7],0,0,1,0,h[2],h[5],0,1].join(',')})`;
    },
    dispose() {
      if (disposed) return; disposed = true; observer.disconnect(); cancelAnimationFrame(animation);
      entrance.forEach(item => item.cancel());
      host.removeEventListener('pointerdown', down); host.removeEventListener('pointermove', move);
      host.removeEventListener('pointerup', up); host.removeEventListener('pointercancel', up); host.remove();
    }
  };
}
