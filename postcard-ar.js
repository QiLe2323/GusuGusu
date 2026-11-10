const postcardScenes = {
  guanqian: "street", xuanmiao: "gate", miluo: "gate", xuanqiao: "street",
  lujia: "bridge", pingjiang: "canal", wuwang: "bridge", twinpagodas: "towers",
  shiquan: "street", xingzao: "canal", wuyachang: "canal", brickbridge: "bridge"
};

function postcardForeground(riverside) {
  if (riverside) return `<svg viewBox="0 0 146 62" preserveAspectRatio="none" aria-hidden="true">
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
  return `<svg viewBox="0 0 100 76" preserveAspectRatio="none" aria-hidden="true">
    <defs><radialGradient id="postcard-lantern-light"><stop stop-color="#ffd696" stop-opacity=".74"/><stop offset="1" stop-color="#fdb469" stop-opacity="0"/></radialGradient></defs>
    <path d="M12 5q32 10 73 1M30 9v11m40-10v14" fill="none" stroke="#b99463" stroke-width="1.25"/>
    <g class="paper-lanterns">
      <ellipse class="paper-lantern-light" cx="48" cy="37" rx="45" ry="33" fill="url(#postcard-lantern-light)"/>
      <path d="M22 21h16l1 5H21zM25 48h10v5H25zm39-24h12l1 5H63zm1 23h10v4H65z" fill="#6e5238" stroke="#dfbc7b"/>
      <ellipse cx="30" cy="36" rx="13" ry="13" fill="#ae4a3a" stroke="#e7a776" stroke-width="1.2"/><ellipse cx="70" cy="37" rx="10" ry="10" fill="#b75d42" stroke="#e4af78"/>
      <path d="M30 24q-12 12 0 24 11-12 0-24zm0 1v21m40-19q-8 10 0 19 8-9 0-19zm0 0v18m-42 9-1 10m4-10 1 13m37-15-2 9m5-9 2 10" fill="none" stroke="#f5c386" stroke-width=".85"/>
    </g>
  </svg>`;
}

function createPostcardAR(view, place, clue) {
  const kind = postcardScenes[place.id] || "street";
  const riverside = kind === "bridge" || kind === "canal";
  const scene = view.querySelector(".postcard-ar-scene");
  scene.innerHTML = `
    <div class="postcard-ar-plane postcard-ar-ground ${riverside ? "is-water" : ""}"><div class="postcard-ar-paper"><i></i></div></div>
    <div class="postcard-ar-plane postcard-ar-building"><img src="images/postcard-ar/${kind}.webp" alt="" draggable="false"></div>
    <div class="postcard-ar-plane postcard-ar-detail">${postcardForeground(riverside)}</div>
    <figure class="postcard-ar-plane postcard-ar-photo" hidden><img alt="${place.cn}现代重拍"><figcaption>今日重拍</figcaption></figure>
    <button type="button" class="postcard-ar-marker" data-action="postcard-clue" aria-expanded="false" aria-controls="postcard-ar-note" aria-label="查看线索：${clue.label}" title="${clue.label}"><span aria-hidden="true">✦</span><span class="postcard-ar-marker-label">看线索</span></button>`;
  const ground = scene.querySelector(".postcard-ar-ground");
  const building = scene.querySelector(".postcard-ar-building");
  const detail = scene.querySelector(".postcard-ar-detail");
  const photo = scene.querySelector(".postcard-ar-photo");
  const marker = scene.querySelector(".postcard-ar-marker");
  const surfaces = [
    [ground, .03, .51, .94, .38, 0, 0, 180],
    [building, .04, -.15, .92, .86, .36, .025, 180],
    [detail, riverside ? .18 : .13, riverside ? .67 : .37, riverside ? .43 : .24, .24, .15, .035],
    [photo, .56, .12, .40, .48, .36, .14, 140]
  ];
  const motion = matchMedia("(prefers-reduced-motion: reduce)");
  const artwork = building.querySelector("img");
  let lastCorners;
  let played = false;
  let entrance = [];

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
    entrance.forEach(animation => animation.cancel());
    const sequence = [
      [ground.firstElementChild, "translateY(-5%) scaleY(.08)", 0, 650],
      [artwork, "translateY(12%) scaleY(.04)", 170, 960],
      [detail.firstElementChild, "translate(-10%, 9%) scale(.84)", 580, 710],
      [marker, "translate(-50%, -50%) scale(.82)", 920, 490]
    ];
    entrance = sequence.map(([element, from, delay, duration]) => element.animate?.([
      { transform: from, opacity: 0 }, { transform: element === marker ? "translate(-50%, -50%)" : "none", opacity: 1 }
    ], { duration, delay, easing: "cubic-bezier(.18,.75,.25,1)", fill: "backwards" })).filter(Boolean);
  }

  function revealArtwork() {
    if (played || scene.hidden || !artwork.complete || !artwork.naturalWidth) return;
    played = true;
    replay();
  }
  artwork.addEventListener("load", revealArtwork, { once: true });

  function update(corners, aspect) {
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
    const [x, y, depth] = project(.78, .78, .09);
    // Keep the tap target legible even when the physical card is tilted.
    marker.style.left = `${Math.min(width - inset, Math.max(inset, x / depth))}px`;
    marker.style.top = `${Math.min(height - 24, Math.max(24, y / depth))}px`;
    revealArtwork();
    return true;
  }

  return { update, showPhoto, replay };
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
  const heightScale = Math.min(1, minDepth * .45 / Math.max(1e-8, Math.abs(nz) * .36));
  return (x, y, lift) => {
    // Bound the height shift to keep lifted artwork in front of the camera.
    const planeDepth = g * x + h * y + 1;
    const raised = lift * heightScale;
    return [a * x + b * y + c + z[0] * raised, d * x + e * y + f + z[1] * raised, planeDepth + z[2] * raised];
  };
}
