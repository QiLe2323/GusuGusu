const postcardScenes = {
  liaojia: { title: "一线巷光", motion: "light", origin: [67, 44], focus: [67, 58], label: "白墙和巷口",
    story: "顺着右侧白墙往巷里看。墙顶瓦檐和不规则的小窗，把旧照里的巷道衬得格外窄。" },
  beisi: { title: "塔影入云", motion: "cloud", origin: [49, 31], focus: [51, 43], rise: .40, label: "塔尖与街轴",
    story: "塔尖是老照片里最容易找到的参照。再沿塔身往下看，塔下的屋檐与开阔街面衬出它的高度。" },
  guanqian: { title: "长街开市", motion: "awning", origin: [39, 53], focus: [69, 71] },
  lujia: { title: "巷底旧桥", motion: "trace", origin: [55, 71], focus: [70, 72], water: true },
  miluo: { title: "宝阁重现", motion: "trace", origin: [49, 41], focus: [65, 62], rise: .40 },
  pingjiang: { title: "水巷行舟", motion: "boat", origin: [45, 74], focus: [77, 77], water: true },
  xuanmiao: { title: "翘檐灯影", motion: "lantern", origin: [64, 40], focus: [77, 61] },
  xuanqiao: { title: "悬桥巷深", motion: "light", origin: [53, 58], focus: [64, 73] },
  anchashi: { title: "照壁月门", motion: "arch", origin: [48, 55], focus: [59, 67], label: "照壁中央的圆门",
    story: "照壁在旧照中横向展开，中央圆形开口打断了整面白墙。可以用开口和墙顶的线条辨认当时的拍摄方向。" },
  twinpagodas: { title: "双塔破雾", motion: "cloud", origin: [42, 27], focus: [67, 57], rise: .42 },
  wuwang: { title: "桥下回波", motion: "ripple", origin: [51, 67], focus: [74, 74], water: true },
  boxi: { title: "砖窗透光", motion: "window", origin: [58, 48], focus: [68, 66], label: "砖墙与窗列",
    story: "留意博习医院旧照里层层排开的窗洞。砖墙的转角、屋檐的弧线和窗列节奏，可以帮助读出这栋建筑的体量。" },
  shiquan: { title: "树荫穿街", motion: "leaves", origin: [63, 36], focus: [71, 68] },
  wuyachang: { title: "两岸照水", motion: "reflection", origin: [62, 65], focus: [76, 73], water: true },
  brickbridge: { title: "百步听潮", motion: "ripple", origin: [48, 67], focus: [70, 75], water: true },
  wuxianlibrary: { title: "书阁印痕", motion: "trace", origin: [52, 43], focus: [71, 65], rise: .39, label: "旧馆中央的楼塔",
    story: "照片里，图书馆的中央楼塔比两翼更高。先找中轴，再看两侧排列的窗列，可以读出旧馆在空地边缘的完整轮廓。" },
  xingzao: { title: "石阶近水", motion: "reflection", origin: [35, 73], focus: [62, 74], water: true },
  panmen: { title: "城楼起雾", motion: "cloud", origin: [52, 34], focus: [70, 64], rise: .39, label: "城楼与门洞",
    story: "盘门旧照里，城楼的双重屋檐正压在宽大的门洞上方。沿门洞边缘看过去，还能看到街市曾经如何贴着城门生长。" },
  jinmen: { title: "金门旌影", motion: "awning", origin: [66, 46], focus: [73, 66], label: "门洞与街角",
    story: "旧照里的拱门与左侧街角建筑形成一组参照。比较两者的相对位置，可以找到当年从市街望向城门的视角。" },
  xumen: { title: "城门回声", motion: "arch", origin: [56, 57], focus: [69, 71], label: "瓮城里的拱券",
    story: "城门的拱券和两侧石墙围出一条较暗的通道。注意拱口由亮转暗的位置，那里最容易看清门洞的深度。" }
};

function postcardForeground(motion) {
  if (motion === "boat") return `<svg viewBox="0 0 146 62" preserveAspectRatio="none" aria-hidden="true">
    <g class="paper-boat-wake" fill="none" stroke="#e4dcc0" stroke-linecap="round">
      <path d="M5 48c16-4 32-2 56-2s45 3 67 1" opacity=".44"/><path d="M18 53q18 3 36 0m22 2q15 3 30-2" opacity=".37"/>
      <path d="M35 59h25m48-6h20" opacity=".24"/>
    </g>
    <g class="paper-boat">
      <ellipse cx="72" cy="47" rx="50" ry="4" fill="#162e2b" opacity=".28"/>
      <path d="M12 37q7 6 19 8h84q12-1 21-11l-19 6H32z" fill="#263731" stroke="#c6a579"/>
      <path d="M26 42q37 4 90-1m-77 5h63" fill="none" stroke="#a17a50" stroke-width=".9"/>
      <path d="M37 39V30q8-17 28-19 22 0 33 19v10z" fill="#7a6148" stroke="#383528" stroke-width="1.3"/>
      <path d="M33 32q10-21 29-23 23-1 38 21M41 29q22-13 48-3m-46 7 49-3m-43 6 47-3" fill="none" stroke="#d5bb89" stroke-width="1.3"/>
      <path d="M52 23q-5 6-7 16m19-23q-3 8-4 23m14-23 2 23m8-18q6 7 6 17" fill="none" stroke="#494034" stroke-width="1.1"/>
      <path d="M110 31v9m0-6 18 18" fill="none" stroke="#d4b382" stroke-width="1.6" stroke-linecap="round"/>
    </g>
  </svg>`;
  if (motion === "lantern") return `<svg viewBox="0 0 100 76" preserveAspectRatio="none" aria-hidden="true">
    <defs><radialGradient id="postcard-lantern-light"><stop stop-color="#ffd696" stop-opacity=".74"/><stop offset="1" stop-color="#fdb469" stop-opacity="0"/></radialGradient></defs>
    <path d="M12 5q32 10 73 1M30 9v11m40-10v14" fill="none" stroke="#b99463" stroke-width="1.25"/>
    <g class="paper-lanterns">
      <ellipse class="paper-lantern-light" cx="48" cy="37" rx="45" ry="33" fill="url(#postcard-lantern-light)"/>
      <path d="M22 21h16l1 5H21zM25 48h10v5H25zm39-24h12l1 5H63zm1 23h10v4H65z" fill="#6e5238" stroke="#dfbc7b"/>
      <ellipse cx="30" cy="36" rx="13" ry="13" fill="#ae4a3a" stroke="#e7a776" stroke-width="1.2"/><ellipse cx="70" cy="37" rx="10" ry="10" fill="#b75d42" stroke="#e4af78"/>
      <path d="M30 24q-12 12 0 24 11-12 0-24zm0 1v21m40-19q-8 10 0 19 8-9 0-19zm0 0v18m-42 9-1 10m4-10 1 13m37-15-2 9m5-9 2 10" fill="none" stroke="#f5c386" stroke-width=".85"/>
    </g>
  </svg>`;
  const accents = {
    cloud: '<g class="paper-mist"><path d="M-6 27C12 8 30 27 40 16S70 7 91 17L109 19 107 32H-7Z"/><path d="M-8 58C9 41 29 55 47 44S77 46 110 39V60H-8Z"/></g>',
    light: '<path class="paper-daylight" d="M16 3h19L85 80H40Z"/><path class="paper-daylight" d="M42 1h7l46 77H80Z"/><path class="paper-dust" d="M43 32h1m15 21h1M38 57h1m22 6h1m-9-23h1"/>',
    trace: '<g class="paper-trace"><path pathLength="1" d="M5 64q25-2 39-20t35-20l17 6"/><path pathLength="1" d="M11 70q25-5 43-23t39-13"/><path d="M73 19v12m-6-6h12"/></g>',
    ripple: '<g class="paper-ring"><ellipse cx="46" cy="44" rx="22" ry="9"/><ellipse cx="46" cy="44" rx="33" ry="14"/><ellipse cx="46" cy="44" rx="45" ry="18"/></g>',
    reflection: '<g class="paper-reflection"><path d="M4 44l17 1m7 5h26m9 5 25-1M7 59l31 1m11 5h15m7-27h20M28 35h13m29 29h19M16 49h5"/><path d="M23 69h25m17-20h10M30 40h18m7-10h27"/></g>',
    arch: '<g class="paper-trace paper-arch"><path pathLength="1" d="M18 70V41a32 32 0 0 1 64 0v29"/><path pathLength="1" d="M26 67V41a24 24 0 0 1 48 0v26"/><path d="M9 69h17m48 0h17"/></g>',
    window: '<g class="paper-window"><rect x="17" y="35" width="10" height="17" rx="1"/><rect x="42" y="34" width="10" height="17" rx="1"/><rect x="67" y="33" width="10" height="17" rx="1"/></g>',
    awning: '<path d="M7 16q48 20 86 4" fill="none" stroke="#9d7b52" stroke-width=".6"/><g class="paper-banners"><path d="M13 19l13 5-5 15-6-6-7 1z"/><path d="M36 26l14 2-1 16-7-5-7 4z"/><path d="M63 27l13-2 4 15-7-3-6 6z"/><path d="M82 24l10-4 7 13-6-1-4 6z"/></g>',
    leaves: '<g class="paper-leaf-fall"><path d="M12 19q10-6 15 6-11 4-15-6Z"/><path d="M51 9q7-4 13 5-8 5-13-5Z"/><path d="M68 34q10-6 15 6-9 5-15-6Z"/><path d="M42 53q8-5 13 4-7 4-13-4Z"/></g>'
  };
  return `<svg viewBox="0 0 100 76" preserveAspectRatio="none" aria-hidden="true">${accents[motion]}</svg>`;
}

function createPostcardAR(view, place, clue) {
  const profile = postcardScenes[place.id];
  const rise = profile.rise ?? .32;
  const artUrl = `images/postcard-ar/${place.id}.webp`;
  const scene = view.querySelector(".postcard-ar-scene");
  scene.classList.remove('has-pingjiang-diorama');
  scene.dataset.motion = profile.motion;
  scene.innerHTML = `
    <div class="postcard-ar-plane postcard-ar-archive"><img src="${view.classList.contains('is-preview') ? place.thumbPhoto : place.oldPhoto}" alt=""><i></i></div>
    <div class="postcard-ar-plane postcard-ar-ground ${profile.water ? "is-water" : ""}"><div class="postcard-ar-paper"><i></i></div></div>
    <div class="postcard-ar-plane postcard-ar-building"><div class="postcard-ar-fold"><img src="${artUrl}" alt="" draggable="false">
      <i class="postcard-ar-gilding" style="--postcard-art:url('${artUrl}')"></i></div></div>
    <div class="postcard-ar-plane postcard-ar-detail">${postcardForeground(profile.motion)}</div>
    <figure class="postcard-ar-plane postcard-ar-photo" hidden><img alt="${place.cn}现代重拍"><figcaption>今日重拍</figcaption></figure>
    <div class="postcard-ar-title" aria-hidden="true"><b>${profile.title}</b><small>${place.cn}</small></div>
    <button type="button" class="postcard-ar-marker" data-action="postcard-clue" aria-expanded="false" aria-controls="postcard-ar-note" aria-label="查看线索：${clue.label}" title="${clue.label}"><span aria-hidden="true">✦</span></button>`;
  const archive = scene.querySelector(".postcard-ar-archive");
  const ground = scene.querySelector(".postcard-ar-ground");
  const building = scene.querySelector(".postcard-ar-building");
  const detail = scene.querySelector(".postcard-ar-detail");
  const photo = scene.querySelector(".postcard-ar-photo");
  const title = scene.querySelector(".postcard-ar-title");
  const marker = scene.querySelector(".postcard-ar-marker");
  const [originX, originY] = profile.origin.map(value => value / 100);
  const [focusX, focusY] = profile.focus.map(value => value / 100);
  const wideEffect = ["cloud", "reflection", "leaves", "light"].includes(profile.motion);
  const detailWidth = wideEffect ? .56 : .38;
  const detailHeight = wideEffect ? .33 : .27;
  const surfaces = [
    [archive, 0, 0, 1, 1, 0, 0, 180],
    [ground, .03, profile.water ? .51 : .59, .94, profile.water ? .38 : .25, 0, 0, 180],
    [building, .04, -.16, .92, .88, rise, .025, 180],
    [detail, originX - detailWidth / 2, originY - detailHeight / 2, detailWidth, detailHeight, .16, .055],
    [photo, .56, .12, .40, .48, .36, .14, 140]
  ];
  const motion = matchMedia("(prefers-reduced-motion: reduce)");
  const artwork = building.querySelector("img");
  let lastCorners;
  let played = false;
  let entrance = [];
  let diorama;
  let lastPose;
  let stopped = false;
  {
    import('./gusu-paper.js?v=2').then(module => {
      if (stopped) return;
      try {
        const preview = view.classList.contains('is-preview');
        const createScene=module.createPaperPostcard;
        diorama = createScene(scene, { tracking: !preview, placeId: place.id });
        const feature=view.closest('.postcard-task-panel').querySelector('#postcard-ar-feature');
        feature.textContent=diorama.actionLabel;
        feature.hidden=false;
        scene.classList.add('has-pingjiang-diorama');
        if (preview) diorama.setVisible(!scene.hidden);
        else diorama.track(lastPose);
      } catch (error) {
        console.warn('The 3D scene could not start.', error);
      }
    }).catch(error => console.warn('The 3D scene could not load.', error));
  }

  function showPhoto(show) {
    const image = photo.querySelector("img");
    if (show && !image.hasAttribute("src")) image.src = place.nowPhoto;
    photo.hidden = !show;
    if (show && !motion.matches) photo.animate?.([
      { opacity: 0, translate: "0 9px" }, { opacity: 1, translate: "0 0" }
    ], { duration: 380, easing: "cubic-bezier(.16,1,.3,1)" });
  }

  function replay() {
    if (scene.hidden || motion.matches) return;
    diorama?.replay();
    entrance.forEach(animation => animation.cancel());
    const sequence = [
      [ground.firstElementChild, "translateY(-5%) scaleY(.08)", 110, 710],
      [building.firstElementChild, "translateY(9%) scaleY(.06)", 310, 1040],
      [detail.firstElementChild, "translate(-5%, 8%) scale(.84)", 780, 850],
      [title, "translateY(8px)", 1140, 550],
      [marker, "translate(-50%, -50%) scale(.82)", 1240, 490]
    ];
    entrance = sequence.map(([element, from, delay, duration]) => element.animate?.([
      { transform: from, opacity: 0 }, { transform: element === marker ? "translate(-50%, -50%)" : "none", opacity: 1 }
    ], { duration, delay, easing: "cubic-bezier(.18,.75,.25,1)", fill: "backwards" })).filter(Boolean);
    const accents = [
      [archive.lastElementChild, 40, 890],
      [building.querySelector(".postcard-ar-gilding"), 760, 1100]
    ];
    for (const [element, delay, duration] of accents) {
      const animation = element.animate?.([
        { opacity: 0, backgroundPosition: "125% 0" },
        { opacity: .75, offset: .45 },
        { opacity: 0, backgroundPosition: "-35% 0" }
      ], { duration, delay, fill: "backwards" });
      if (animation) entrance.push(animation);
    }
  }

  function revealArtwork() {
    if (stopped || played || scene.hidden || !artwork.complete || !artwork.naturalWidth) return;
    played = true;
    replay();
  }
  artwork.addEventListener("load", revealArtwork, { once: true });

  function update(corners, aspect) {
    lastPose = corners;
    if (diorama) {
      if (view.classList.contains('is-preview')) diorama.setVisible(Boolean(corners));
      else diorama.track(corners);
    }
    if (!corners) {
      lastCorners = null;
      scene.hidden = true;
      return false;
    }
    // Filter small frame-to-frame shifts while snapping to deliberate moves.
    const points = corners.map(([x, y], index) => {
      const previous = lastCorners?.[index];
      if (!previous || Math.hypot(x - previous[0], y - previous[1]) > .10) return [x, y];
      return [previous[0] * .26 + x * .74, previous[1] * .26 + y * .74];
    });
    lastCorners = points;
    const width = view.clientWidth;
    const height = view.clientHeight;
    if (!width || !height) return false;
    const project = postcardProjection(points, width, height, aspect);
    if (!project) return update(null);
    scene.hidden = false;
    const inset = marker.offsetWidth / 2 + 5;

    for (const [element, x, y, w, h, top, bottom, planeWidth = 100] of surfaces) {
      const base = project(x, y, top);
      const across = project(x + w, y, top).map((value, i) => (value - base[i]) / planeWidth);
      const down = project(x, y + h, bottom).map((value, i) => (value - base[i]) / 100);
      element.style.transform = `matrix3d(${[
        across[0], across[1], 0, across[2], down[0], down[1], 0, down[2],
        0, 0, 1, 0, base[0], base[1], 0, base[2]
      ].map(value => value / base[2]).join(",")})`;
    }
    const [x, y, depth] = project(focusX, focusY, .09);
    // Keep the tap target legible even when the physical card is tilted.
    marker.style.left = `${Math.min(width - inset, Math.max(inset, x / depth))}px`;
    marker.style.top = `${Math.min(height - 24, Math.max(24, y / depth))}px`;
    revealArtwork();
    return true;
  }

  return { update, showPhoto, replay, toggleDetail() {return diorama?.toggleDetail() ?? false;}, dispose() {
    stopped = true;
    entrance.forEach(animation => animation.cancel());
    diorama?.dispose();
  } };
}

function postcardProjection(corners, width, height, aspect = 1.5) {
  const unit = [[0, 0], [1, 0], [1, 1], [0, 1]];
  const homography = computeHomography(corners.map(([x, y], index) => ({
    old: { x: unit[index][0], y: unit[index][1] }, new: { x: x * width, y: y * height }
  })));
  if (!homography) return null;
  const [a, b, c, d, e, f, g, h] = homography;
  // Use approximate intrinsics to recover the card normal. The flat plane
  // still fits the observed corners exactly, even if the camera FOV differs.
  const cx = width / 2;
  const cy = height / 2;
  const focal = Math.max(width, height) * .9;
  const u = [(a - cx * g) / focal, (d - cy * g) / focal, g];
  const v = [(b - cx * h) / focal, (e - cy * h) / focal, h];
  const normal = [u[1] * v[2] - u[2] * v[1], u[2] * v[0] - u[0] * v[2], u[0] * v[1] - u[1] * v[0]];
  const length = Math.hypot(...normal);
  if (length < 1e-8) return null;
  const scale = -(Math.hypot(...u) + aspect * Math.hypot(...v)) / (2 * length);
  const [nx, ny, nz] = normal.map(value => value * scale);
  const z = [focal * nx + cx * nz, focal * ny + cy * nz, nz];
  const minDepth = Math.min(...unit.map(([x, y]) => g * x + h * y + 1));
  if (minDepth <= 0) return null;
  const heightScale = Math.min(1, minDepth * .45 / Math.max(1e-8, Math.abs(nz) * .42));
  return (x, y, lift) => {
    // Bound the height shift to keep lifted artwork in front of the camera.
    const planeDepth = g * x + h * y + 1;
    const raised = lift * heightScale;
    return [a * x + b * y + c + z[0] * raised, d * x + e * y + f + z[1] * raised, planeDepth + z[2] * raised];
  };
}
