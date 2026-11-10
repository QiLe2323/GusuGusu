const postcardScenes = {
  guanqian: "street", xuanmiao: "gate", miluo: "gate", xuanqiao: "street",
  lujia: "bridge", pingjiang: "canal", wuwang: "bridge", twinpagodas: "towers",
  shiquan: "street", xingzao: "canal", wuyachang: "canal", brickbridge: "bridge"
};

function postcardArtwork(kind) {
  const roof = '<path class="paper-ink" d="M-42 0Q-28-2-20-15H20Q28-2 42 0Q18 7 0 3Q-18 7-42 0Z"/><path class="paper-gold" d="M-33 1Q0 6 33 1"/>';
  const house = `<path class="paper-wall" d="M-29 0H29V31H-29Z"/><path class="paper-line" d="M-29 25H29M-18 8v13m5-13v13m-5-7h5m26-6v13m5-13v13m-5-7h5"/><path class="paper-door" d="M-5 31V13H5V31Z"/>${roof}`;
  const tower = `<path class="paper-gold" d="M0-12V-27"/>${[0, 16, 32, 48, 64, 80].map((y, i) =>
    `<g transform="translate(0 ${y}) scale(${.37 + i * .085} 1)"><path class="paper-door" d="M-24 0H24V18H-24Z"/><path class="paper-wall" d="M-4 6H4V15H-4Z"/>${roof}</g>`).reverse().join("")}`;
  const bridge = '<path class="paper-stone" d="M18 121V102L52 85Q130 43 208 85L242 102V121H186A56 43 0 0 0 74 121Z"/><path class="paper-line" d="M18 103L52 87Q130 46 208 87L242 103M26 113H64m132 0h38M64 84l9 16m14-25 8 13m16-19 4 12m34-12-4 12m28-6-8 13m31-4-9 16"/>';
  const shops = `<g transform="translate(54 86) scale(.94 1.15)">${house}</g><g transform="translate(203 90) scale(1.02 1)">${house}</g>`;
  const scenes = {
    street: `${shops}<g transform="translate(127 73) scale(.82 1.54)">${house}</g>`,
    gate: `${shops}<g transform="translate(130 66) scale(1.48 1.75)">${house}</g><g transform="translate(130 43) scale(.92 1.08)">${house}</g>`,
    bridge: `<g transform="translate(204 58) scale(.74 1.05)">${house}</g>${bridge}`,
    canal: `${shops}<g transform="translate(150 71) scale(.83 1.6)">${house}</g><path class="paper-line" d="M8 122H247M21 129h76m38 0h111"/>`,
    towers: `<g transform="translate(88 23)">${tower}</g><g transform="translate(164 38) scale(.78 .85)">${tower}</g><g transform="translate(207 98) scale(.72 .78)">${house}</g>`
  };
  return `<svg viewBox="0 0 260 134" preserveAspectRatio="none" aria-hidden="true">${scenes[kind]}</svg>`;
}

function createPostcardAR(view, place, clue) {
  const kind = postcardScenes[place.id] || "street";
  const riverside = kind === "bridge" || kind === "canal";
  const scene = view.querySelector(".postcard-ar-scene");
  scene.innerHTML = `
    <div class="postcard-ar-plane postcard-ar-ground ${riverside ? "is-water" : ""}"></div>
    <div class="postcard-ar-plane postcard-ar-building">${postcardArtwork(kind)}</div>
    <div class="postcard-ar-plane postcard-ar-detail"><svg viewBox="0 0 90 44" preserveAspectRatio="none" aria-hidden="true">${riverside
      ? '<path class="paper-ripples" d="M4 36h19m13 3h35m5-3h11"/><g class="paper-boat"><path class="paper-ink" d="M8 27h75L67 36H23Z"/><path class="paper-door" d="M25 26Q35 3 57 12L66 27Z"/><path class="paper-gold" d="M34 26v-7m11 7V15m12 11v-8M67 31l14-17"/></g>'
      : '<path class="paper-gold" d="M16 2h59M29 2v7m30-7v10"/><g class="paper-lanterns"><ellipse cx="29" cy="19" rx="11" ry="10"/><ellipse cx="59" cy="20" rx="9" ry="9"/><path class="paper-gold" d="M29 11v25m30-23v20"/></g>'}</svg>
    </div>
    <figure class="postcard-ar-plane postcard-ar-photo" hidden><img alt="${place.cn}现代重拍"><figcaption>今日重拍</figcaption></figure>
    <button type="button" class="postcard-ar-marker" data-action="postcard-clue" aria-expanded="false" aria-controls="postcard-ar-note"><span aria-hidden="true">✦</span>${clue.label}</button>`;
  const ground = scene.querySelector(".postcard-ar-ground");
  const building = scene.querySelector(".postcard-ar-building");
  const detail = scene.querySelector(".postcard-ar-detail");
  const photo = scene.querySelector(".postcard-ar-photo");
  const marker = scene.querySelector(".postcard-ar-marker");
  const surfaces = [
    [ground, .05, .42, .9, .49, 0, 0],
    [building, .13, .17, .74, .48, .24, 0],
    [detail, .21, .63, .30, .23, .12, .025],
    [photo, .49, .07, .43, .48, .31, .14, 140]
  ];
  let lastCorners;
  let played = false;

  function showPhoto(show) {
    const image = photo.querySelector("img");
    if (show && !image.hasAttribute("src")) image.src = place.nowPhoto;
    photo.hidden = !show;
  }

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
    const [x, y, depth] = project(.75, .65, .12);
    // Keep the tap target legible even when the physical card is tilted.
    marker.style.left = `${Math.min(width - inset, Math.max(inset, x / depth))}px`;
    marker.style.top = `${Math.min(height - 24, Math.max(24, y / depth))}px`;
    if (!played && !matchMedia("(prefers-reduced-motion: reduce)").matches) {
      for (const plane of [building, detail]) {
        plane.firstElementChild.animate?.([
          { transform: "scaleY(.08)", opacity: 0 }, { transform: "scaleY(1)", opacity: 1 }
        ], { duration: 540, delay: plane === detail ? 170 : 0, easing: "cubic-bezier(.2,.75,.3,1)", fill: "backwards" });
      }
      played = true;
    }
    return true;
  }

  return { update, showPhoto };
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
  const heightScale = Math.min(1, minDepth * .45 / Math.max(1e-8, Math.abs(nz) * .31));
  return (x, y, lift) => {
    // Bound the height shift to keep lifted artwork in front of the camera.
    const planeDepth = g * x + h * y + 1;
    const raised = lift * heightScale;
    return [a * x + b * y + c + z[0] * raised, d * x + e * y + f + z[1] * raised, planeDepth + z[2] * raised];
  };
}
