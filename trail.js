(() => {
  const storageKey = "gusu-trail-progress-v1";
  const arrivalRadius = 30;
  const maxAccuracy = 35;
  const byId = new Map(places.map(place => [place.id, place]));
  const routeById = new Map(trailRoutes.map(route => [route.id, route]));
  const dialog = $("trail-dialog");
  const content = $("trail-dialog-content");
  const workspace = $("trail-workspace");
  const routeMap = $("trail-map");
  const mapWrap = $("trail-map-wrap");
  const mobileLayout = window.matchMedia("(max-width: 680px)");
  const schematic = $("trail-schematic");
  const locationStatus = $("trail-location");

  function readProgress() {
    try {
      const data = JSON.parse(localStorage.getItem(storageKey));
      return { last: data?.last, trips: data?.trips || {} };
    } catch {
      return { trips: {} };
    }
  }

  const progress = readProgress();
  let route = routeById.get(progress.last?.id);
  let mode = ["field", "preview"].includes(progress.last?.mode) ? progress.last.mode : null;
  let journalMode = mode || "field";
  let task = null;
  let revealed = false;
  let cameraTask = null;
  let watchId = null;
  let watchVersion = 0;
  let fix = null;
  let fixTimer = null;
  let locationMessage = "";
  let mapView = null;
  let mapAttempted = false;
  let mapLoaded = false;
  const mapPins = new Map();
  let showRouteOnMap = false;
  let justLit = null;
  let positionPin = null;

  const name = id => byId.get(id).cn;
  const key = (walk, kind) => walk.id + ":" + kind;
  const emptyTrip = () => ({ arrived: {}, cards: {} });
  const trip = (walk = route, kind = mode) => progress.trips[key(walk, kind)] || emptyTrip();
  const nextStop = (walk = route, kind = mode) => walk.ids.find(id => !trip(walk, kind).cards[id]);
  const count = (walk, kind) => walk.ids.filter(id => trip(walk, kind).cards[id]).length;
  const labelFor = kind => kind === "field" ? "现场漫步" : "线上体验";
  const canOpen = id => Boolean(route?.ids.includes(id) && mode && (trip().cards[id] || (id === nextStop() && (mode === "preview" || trip().arrived[id]))));
  const cardRoute = (id, kind) => trailRoutes.find(walk => trip(walk, kind).cards[id]);
  const pinStatus = id => visited.has(id) || cardRoute(id, "field") ? "field" : cardRoute(id, "preview") ? "preview" : "";
  const formatDay = date => new Intl.DateTimeFormat("zh-CN", { dateStyle: "medium" }).format(new Date(date));

  function writeProgress(last, update) {
    const current = readProgress();
    current.last = last;
    if (update) {
      const id = key(route, mode);
      current.trips[id] ||= emptyTrip();
      update(current.trips[id]);
    }
    try {
      localStorage.setItem(storageKey, JSON.stringify(current));
    } catch {
      return false;
    }
    Object.assign(progress, current);
    return true;
  }

  function renderOptions() {
    $("trail-options").innerHTML = trailRoutes.map(walk => {
      const place = byId.get(walk.cover);
      const status = count(walk, "field");
      const previewCount = count(walk, "preview");
      return `<button type="button" class="trail-route-card" data-route="${walk.id}" aria-pressed="${walk === route}" aria-controls="trail-workspace">
        <span class="trail-route-image"><img src="${place.oldPhoto}" loading="lazy" alt=""><span>${walk.number}</span><small>${place.oldCredit}</small></span>
        <span class="trail-route-body"><span class="trail-route-area">${walk.area}</span><strong>${walk.name}</strong><span>${walk.description}</span>
        <span class="trail-route-meta"><span>${walk.ids.length} 站 · ${walk.duration}</span><span aria-hidden="true">↗</span></span>
        ${status || previewCount ? `<span class="trail-route-progress">${status ? `现场 ${status}/${walk.ids.length}` : ""}${status && previewCount ? " · " : ""}${previewCount ? `线上 ${previewCount}/${walk.ids.length}` : ""}</span>` : ""}</span></button>`;
    }).join("");
  }

  function renderWorkspace(fit = false) {
    if (!route) {
      workspace.hidden = true;
      refreshMap(fit);
      return;
    }
    workspace.hidden = false;
    const done = mode ? count(route, mode) : 0;
    const length = route.ids.length;
    const next = mode ? nextStop() : null;
    $("trail-session-head").innerHTML = `<div><p class="trail-kicker">路线 ${route.number} / ${mode ? labelFor(mode) : "路线预览"}</p>
      <h3 id="trail-workspace-title" tabindex="-1">${route.name}</h3><p>${route.area} · ${length} 站 · 预计 ${route.duration}（含观察）</p></div>
      <div class="trail-session-controls">
      <a class="trail-btn trail-mobile-map-link" href="#trail-mobile-map">↑ 返回地图</a>
      ${mode ? `<span class="trail-meter"><progress max="${length}" value="${done}" aria-label="路线进度"></progress><b>${done} / ${length} 站</b></span>
      <button type="button" class="trail-btn" data-action="pause">暂停探索</button>`
      : `<button type="button" class="trail-btn trail-primary" data-mode="field">${count(route, "field") || route.ids.some(id => trip(route, "field").arrived[id]) ? "继续现场漫步" : "开始现场漫步"} →</button>
      <button type="button" class="trail-btn" data-mode="preview">${count(route, "preview") ? "继续线上体验" : "先在线上体验"}</button>`}</div>`;

    $("trail-stops").innerHTML = `<p class="trail-kicker">WALKING ORDER / 站点顺序</p><ol class="trail-stops">${route.ids.map((id, index) => {
      const complete = mode && trip().cards[id];
      const state = complete ? "已收集" : id === next ? (canOpen(id) ? "线索已解锁" : "前往此站") : mode ? "待解锁" : trailClues[id].type;
      return `<li class="${id === next ? "trail-next" : ""}"><span class="trail-stop-number">${complete ? "✓" : String(index + 1).padStart(2, "0")}</span>
        <span>${name(id)}</span><small>${state}</small>${complete ? `<button class="trail-text-btn" type="button" data-clue="${id}">看卡片</button>` : ""}</li>`;
    }).join("")}</ol>`;
    renderCurrent(next);
    refreshMap(fit);
  }

  function renderCurrent(next) {
    const panel = $("trail-current");
    if (!mode) {
      panel.innerHTML = `<p class="trail-note">现场模式按站解锁，约 ${arrivalRadius} 米内且定位精度足够时可打开线索。线上体验可直接看古今对照，进度单独保存。</p>`;
    } else if (!next) {
      panel.innerHTML = `<div class="trail-current-box"><p class="trail-kicker">WALK COMPLETE</p><h4>${mode === "field" ? "你走完了这条路线。" : "你读完了这条路线。"}</h4><p>${route.ids.length} 站 · ${route.ids.length} 张历史卡片</p><button class="trail-btn trail-primary" type="button" data-summary="${route.id}" data-kind="${mode}">查看探索记录 →</button></div>`;
    } else {
      const place = byId.get(next);
      const unlocked = canOpen(next);
      panel.innerHTML = `<div class="trail-current-box"><p class="trail-kicker">${unlocked ? (mode === "field" ? "已抵达 · 发现一条线索" : "线上 · 等待你的观察") : "下一站 · 到点解锁"}</p>
        <h4>${place.cn}</h4><p>${unlocked ? trailClues[next].type + " · " + trailClues[next].title : "走到照片的拍摄点附近，线索将自动解锁。"}</p>
        <div class="trail-actions">${unlocked ? `<button class="trail-btn trail-primary" type="button" data-clue="${next}">查看历史线索 →</button>` : `<button class="trail-btn trail-primary" type="button" data-action="locate">${watchId === null ? "开启定位" : "重新定位"}</button>`}
        ${mode === "field" ? '<a class="trail-btn" id="trail-directions" target="_blank" rel="noreferrer">百度地图 ↗</a>' : ""}</div></div>`;
    }
    renderLocation();
  }

  function makeMapPin(place) {
    return createPinElement(place, () => openMapPlace(place));
  }

  function styleMapPin(element, place, walk) {
    const status = pinStatus(place.id);
    const index = walk ? walk.ids.indexOf(place.id) : -1;
    const onRoute = index >= 0;
    const current = onRoute && mode && place.id === nextStop();
    element.classList.toggle("is-visited", Boolean(status));
    element.classList.toggle("is-online", status === "preview");
    element.classList.toggle("is-active", Boolean(current));
    element.classList.toggle("is-just-lit", place.id === justLit);
    element.classList.toggle("is-curated-stop", onRoute);
    element.classList.toggle("trail-context-pin", Boolean(walk && !onRoute));
    element.querySelector(".photo-pin-badge").textContent = status === "preview" ? "阅" : onRoute ? index + 1 : status ? "✦" : "";
    element.setAttribute("aria-label", `${onRoute ? `第 ${index + 1} 站，` : ""}${place.cn}，${status === "field" ? "现场已点亮" : status === "preview" ? "已线上探索" : "待探索"}`);
  }

  function drawSchematic(points, walk) {
    const longitudeScale = Math.cos(points[0].lat * Math.PI / 180);
    const xs = points.map(place => place.lng * longitudeScale);
    const ys = points.map(place => place.lat);
    const x0 = Math.min(...xs), y0 = Math.min(...ys);
    const scale = Math.min(320 / (Math.max(...xs) - x0 || 1), 160 / (Math.max(...ys) - y0 || 1));
    const cx = (400 - (Math.max(...xs) - x0) * scale) / 2;
    const cy = (230 - (Math.max(...ys) - y0) * scale) / 2;
    const coords = points.map((place, index) => [cx + (xs[index] - x0) * scale, 230 - cy - (ys[index] - y0) * scale]);
    const positions = new Map(points.map((place, index) => [place.id, coords[index]]));
    schematic.innerHTML = `<div class="trail-schematic-points"><svg viewBox="0 0 400 230" aria-hidden="true"><defs><pattern id="trail-grid" width="20" height="20" patternUnits="userSpaceOnUse"><path d="M20 0H0V20" fill="none" stroke="#b3bcb0" opacity=".35"/></pattern></defs>
      <rect width="400" height="230" fill="url(#trail-grid)"/><text x="29" y="34" text-anchor="middle" fill="#284d43" font-size="12">↑ 北</text>
      ${walk ? `<polyline points="${walk.ids.map(id => positions.get(id).join(",")).join(" ")}" fill="none" stroke="#497c6a" stroke-width="3" stroke-dasharray="6 6"/>` : ""}</svg></div><span>站点示意 · 底图加载中或暂不可用</span>`;
    const layer = schematic.querySelector(".trail-schematic-points");
    points.forEach((place, index) => {
      const pin = makeMapPin(place);
      styleMapPin(pin, place, walk);
      pin.style.left = coords[index][0] / 4 + "%";
      pin.style.top = coords[index][1] / 2.3 + "%";
      layer.append(pin);
    });
  }

  function refreshMap(fit = false) {
    const walk = showRouteOnMap ? route : null;
    const status = `${places.filter(place => pinStatus(place.id)).length} / ${places.length} 处点亮 · 点照片看地点`;
    $("trail-map-progress").textContent = status;
    $("trail-desktop-map-progress").textContent = status;
    for (const id of ["trail-map-scope", "trail-desktop-map-scope"]) {
      const scope = $(id);
      scope.hidden = !route;
      scope.textContent = walk ? "全部点位" : "当前路线";
    }
    $("trail-mobile-continue").textContent = route ? "继续探索 →" : "开始探索 →";
    const points = walk && mobileLayout.matches ? walk.ids.map(id => byId.get(id)) : places;
    $("trail-map-caption").textContent = walk ? "虚线表示站点顺序。步行请参考导航。" : "老照片 · 待探索　灯笼 · 已探索　阅 · 线上";
    if (!mapLoaded) drawSchematic(points, walk);
    updateMap(points, walk, fit);
  }

  function updateMap(points, walk, fit) {
    if (!mapAttempted) {
      mapAttempted = true;
      try {
        mapView = new maplibregl.Map({
          container: routeMap, style: "https://tiles.openfreemap.org/styles/positron",
          center: [120.624, 31.31], zoom: 14, maxZoom: 19, cooperativeGestures: !mobileLayout.matches,
          attributionControl: { compact: true }
        });
        mapView.scrollZoom.disable();
        mapView.addControl(new maplibregl.NavigationControl({ showCompass: false }));
        mapView.once("load", () => {
          mapLoaded = true;
          mapView.addSource("trail-path", { type: "geojson", data: { type: "FeatureCollection", features: [] } });
          mapView.addLayer({ id: "trail-path", type: "line", source: "trail-path", paint: {
            "line-color": "#285549", "line-width": 4, "line-dasharray": [1.2, 1.4]
          } });
          schematic.hidden = true;
          refreshMap(true);
        });
      } catch {
        routeMap.hidden = true;
      }
      return;
    }
    if (!mapLoaded) return;
    mapView.resize();
    const routeCoordinates = walk?.ids.map(id => {
      const place = byId.get(id);
      return [place.lng, place.lat];
    });
    mapView.getSource("trail-path").setData({
      type: "FeatureCollection",
      features: walk ? [{ type: "Feature", geometry: { type: "LineString", coordinates: routeCoordinates } }] : []
    });
    const shown = new Set(points.map(place => place.id));
    for (const [id, marker] of mapPins) {
      if (shown.has(id)) continue;
      marker.remove();
      mapPins.delete(id);
    }
    points.forEach(place => {
      let marker = mapPins.get(place.id);
      if (!marker) {
        marker = new maplibregl.Marker({ element: makeMapPin(place) }).setLngLat([place.lng, place.lat]).addTo(mapView);
        mapPins.set(place.id, marker);
      }
      styleMapPin(marker.getElement(), place, walk);
    });
    if (fit) {
      const bounds = new maplibregl.LngLatBounds();
      (routeCoordinates || points.map(place => [place.lng, place.lat])).forEach(point => bounds.extend(point));
      mapView.fitBounds(bounds, { padding: walk ? 48 : 32, maxZoom: 16.5, duration: 0 });
    }
    updatePositionPin();
  }

  function updatePositionPin() {
    if (!mapLoaded) return;
    if (!fix || !route || !isInsideSuzhou(fix)) {
      positionPin?.remove();
      positionPin = null;
      return;
    }
    if (!positionPin) {
      const element = document.createElement("span");
      element.className = "trail-position-pin";
      element.setAttribute("aria-label", "当前位置");
      positionPin = new maplibregl.Marker({ element }).setLngLat([fix.lng, fix.lat]).addTo(mapView);
    } else {
      positionPin.setLngLat([fix.lng, fix.lat]);
    }
  }

  function baiduTrailUrl(place, origin) {
    const url = new URL(origin ? "https://api.map.baidu.com/direction" : "https://api.map.baidu.com/marker");
    url.searchParams.set("coord_type", "wgs84");
    url.searchParams.set("output", "html");
    url.searchParams.set("src", "webapp.gusu.trails");
    if (origin) {
      url.searchParams.set("mode", "walking");
      url.searchParams.set("region", "苏州");
      url.searchParams.set("origin", `name:当前位置|latlng:${origin.lat},${origin.lng}`);
      url.searchParams.set("destination", `name:${place.cn}|latlng:${place.lat},${place.lng}`);
    } else {
      url.searchParams.set("location", `${place.lat},${place.lng}`);
      url.searchParams.set("title", place.cn);
      url.searchParams.set("content", "姑苏寻影探索点");
    }
    return url.href;
  }

  function renderLocation() {
    let message = locationMessage;
    const id = mode === "field" && nextStop();
    const pending = id && !canOpen(id);
    if (fix && pending) {
      message = `距下一站 ${formatDistance(distanceMeters(fix, byId.get(id)))} · 定位误差约 ${Math.ceil(fix.accuracy)} 米`;
      if (fix.accuracy > maxAccuracy) message += "。请在开阔处稍等。";
    }
    const link = $("trail-directions");
    if (id && link) {
      const origin = pending && fix && isInsideSuzhou(fix) ? fix : null;
      link.href = baiduTrailUrl(byId.get(id), origin);
      link.textContent = origin ? "百度步行导航 ↗" : "百度地图看点位 ↗";
      link.title = origin ? "用当前位置作为起点，在百度地图规划步行路线" : "";
    }
    if (locationStatus.textContent !== message) locationStatus.textContent = message;
  }

  function stopLocation(message = "") {
    watchVersion += 1;
    if (watchId !== null) navigator.geolocation.clearWatch(watchId);
    watchId = null;
    clearTimeout(fixTimer);
    fix = null;
    locationMessage = message;
    updatePositionPin();
    renderLocation();
  }

  function startLocation() {
    if (mode !== "field" || !nextStop() || canOpen(nextStop())) return;
    stopLocation();
    if (!window.isSecureContext || !navigator.geolocation) {
      locationMessage = "当前页面无法定位。请在 HTTPS 页面打开，或先使用线上体验。";
      renderLocation();
      return;
    }
    const version = watchVersion;
    locationMessage = "正在获取位置，请保持页面打开。";
    watchId = navigator.geolocation.watchPosition(position => {
      if (version !== watchVersion || document.hidden) return;
      const id = nextStop();
      const coords = position.coords;
      const latest = { lat: coords.latitude, lng: coords.longitude, accuracy: coords.accuracy };
      if (![latest.lat, latest.lng, latest.accuracy, position.timestamp].every(Number.isFinite) || Date.now() - position.timestamp > 15000) return;
      fix = latest;
      clearTimeout(fixTimer);
      fixTimer = setTimeout(() => {
        fix = null;
        locationMessage = "正在等待最新位置。";
        updatePositionPin();
        renderLocation();
      }, 15000);
      updatePositionPin();
      if (id && fix.accuracy <= maxAccuracy && distanceMeters(fix, byId.get(id)) <= arrivalRadius) {
        const saved = writeProgress({ id: route.id, mode }, record => { record.arrived[id] = new Date().toISOString(); });
        if (!saved) {
          stopLocation("无法保存到点记录。请检查浏览器存储设置后重试。");
        } else {
          stopLocation("已抵达 " + name(id) + "，可以打开历史线索。");
          renderWorkspace();
        }
      }
      renderLocation();
    }, error => {
      if (version !== watchVersion) return;
      stopLocation(error.code === 1 ? "定位权限未开启。可调整浏览器设置后重试，或暂停后选择线上体验。" : "暂时无法获取位置。请在开阔处重新定位。");
      renderCurrent(nextStop());
    }, { enableHighAccuracy: true, maximumAge: 0, timeout: 15000 });
    renderCurrent(nextStop());
  }

  function showDialog() {
    if (!dialog.open) dialog.showModal();
    $("trail-dialog-title").focus();
    dialog.scrollTop = 0;
  }

  function openMapPlace(place) {
    const { id } = place;
    if (canOpen(id)) {
      openTask(id);
      return;
    }
    const fieldWalk = cardRoute(id, "field");
    const previewWalk = cardRoute(id, "preview");
    const walks = trailRoutes.filter(walk => walk.ids.includes(id));
    const status = pinStatus(id);
    content.innerHTML = `<div class="trail-dialog-head"><div><p class="trail-kicker">${status === "field" ? "现场已点亮" : status === "preview" ? "已线上探索" : "姑苏寻影地图"}</p>
      <h2 id="trail-dialog-title" tabindex="-1">${place.cn}</h2></div><button type="button" class="trail-dialog-close" data-action="close" aria-label="关闭">×</button></div>
      <figure class="trail-card-archive"><img src="${place.oldPhoto}" alt="${place.cn}历史照片"><figcaption>${place.oldCredit}</figcaption></figure>
      <div class="trail-actions">
        ${fieldWalk ? `<button type="button" class="trail-btn trail-primary" data-card="${id}" data-walk="${fieldWalk.id}" data-kind="field">查看现场卡片</button>` : ""}
        ${previewWalk ? `<button type="button" class="trail-btn" data-card="${id}" data-walk="${previewWalk.id}" data-kind="preview">查看线上卡片</button>` : ""}
        ${walks.map(walk => `<button type="button" class="trail-btn" data-map-route="${walk.id}">${walk === route ? "继续当前路线" : walk.name} →</button>`).join("")}
        <button type="button" class="trail-btn" data-archive-place="${id}">古今照片对照</button>
      </div>`;
    showDialog();
  }

  function openTask(id) {
    if (!canOpen(id)) return;
    task = { route, mode, id };
    const saved = trip().cards[id];
    if (saved) {
      openCard(route, mode, id);
      return;
    }
    revealed = false;
    const place = byId.get(id);
    const clue = trailClues[id];
    const [x, y, width, height] = clue.region;
    content.innerHTML = `<div class="trail-dialog-head"><div><p class="trail-kicker">${labelFor(mode)} · 第 ${route.ids.indexOf(id) + 1} 站 · ${clue.type}</p>
      <h2 id="trail-dialog-title" tabindex="-1">${clue.title}</h2><p>${place.cn}</p></div><button type="button" class="trail-dialog-close" data-action="close" aria-label="关闭">×</button></div>
      <p class="trail-task-prompt">${clue.prompt}</p>
      <div class="trail-comparison"><figure><div class="trail-marked-photo"><img src="${place.oldPhoto}" alt="${place.cn}历史照片">
        <button type="button" class="trail-region" data-action="reveal" aria-label="查看照片里的线索" aria-controls="trail-reveal" aria-expanded="false" style="--x:${x}%;--y:${y}%;--w:${width}%;--h:${height}%"><span aria-hidden="true">+</span></button>
        </div><figcaption>${place.oldCredit}</figcaption></figure>
        <figure id="trail-modern" ${mode === "field" ? "hidden" : ""}><img src="${place.nowPhoto}" alt="${place.cn}现代重拍"><figcaption>${place.nowCredit}</figcaption></figure></div>
      <p class="trail-note trail-photo-hint">找到细节了吗？点照片里的标记看看。</p>
      <div class="trail-actions">${mode === "field" ? '<button type="button" class="trail-btn trail-primary" data-action="spatial-ar">开启空间 AR ◎</button><button type="button" class="trail-btn" data-action="camera">手动叠加</button>' : ""}
      <button type="button" class="trail-btn" data-action="reveal">揭示照片线索</button></div>
      ${mode === "field" ? '<p class="trail-note">空间 AR 可对准一块有纹理的墙面或地面，把整张旧照放在准星处。</p><p id="trail-ar-status" class="trail-note" tabindex="-1" role="status"></p>' : ""}
      <section id="trail-reveal" class="trail-reveal" hidden><p class="trail-kicker">你发现了 / DISCOVERED</p><h3 tabindex="-1">${clue.label}</h3><p>${clue.story}</p>
      <label for="trail-note-input">写下一句发现 <small>可选</small></label><textarea id="trail-note-input" rows="2" maxlength="140" placeholder="我注意到……"></textarea>
      <button type="button" class="trail-btn trail-primary" data-action="collect">收下历史卡片 →</button><p id="trail-dialog-status" role="status"></p></section>`;
    showDialog();
  }

  function revealTask() {
    revealed = true;
    $("trail-modern").hidden = false;
    $("trail-reveal").hidden = false;
    const marker = content.querySelector(".trail-region");
    marker.setAttribute("aria-expanded", "true");
    marker.querySelector("span").textContent = "✓";
    $("trail-reveal").querySelector("h3").focus();
  }

  function openCard(walk, kind, id, justCollected = false) {
    task = { route: walk, mode: kind, id };
    const place = byId.get(id);
    const clue = trailClues[id];
    const record = trip(walk, kind).cards[id];
    content.innerHTML = `<div class="trail-dialog-head"><div><p class="trail-kicker">${justCollected ? "新卡片已入册" : "历史卡片"} · ${labelFor(kind)} · ${formatDay(record.date)}</p>
      <h2 id="trail-dialog-title" tabindex="-1">${place.cn}</h2><p>${clue.label}</p></div><button type="button" class="trail-dialog-close" data-action="close" aria-label="关闭">×</button></div>
      <figure class="trail-card-archive"><img src="${place.oldPhoto}" alt="${place.cn}历史照片"><span class="trail-card-seal" aria-hidden="true">${kind === "field" ? "现场寻得" : "线上寻得"}</span><figcaption>${place.oldCredit}</figcaption></figure>
      <p class="trail-card-story">${clue.story}</p><p id="trail-personal-note" class="trail-personal-note" hidden></p>
      <div class="trail-actions"><button class="trail-btn trail-primary" type="button" data-action="${justCollected ? "continue" : "close"}">${justCollected ? (nextStop(walk, kind) ? "回到路线，前往下一站 →" : "查看路线总结 →") : "完成"}</button>
      <button type="button" class="trail-btn" data-action="download-card">保存卡片 ↓</button></div><p id="trail-dialog-status" role="status"></p>`;
    if (record.note) {
      $("trail-personal-note").hidden = false;
      $("trail-personal-note").textContent = "我的发现 · " + record.note;
    }
    showDialog();
  }

  function renderJournal() {
    document.querySelectorAll("[data-journal]").forEach(button => button.setAttribute("aria-pressed", button.dataset.journal === journalMode));
    const entries = trailRoutes.filter(walk => count(walk, journalMode));
    $("trail-journal-list").innerHTML = entries.length ? entries.map(walk => `<section class="trail-journal-entry">
      <div class="trail-journal-head"><div><h3>${walk.name}</h3><p>${count(walk, journalMode)} / ${walk.ids.length} 站 · ${labelFor(journalMode)}</p></div>
      <button type="button" class="trail-btn" data-summary="${walk.id}" data-kind="${journalMode}">查看路线记录 →</button></div>
      <div class="trail-mini-cards">${walk.ids.filter(id => trip(walk, journalMode).cards[id]).map(id => `<button type="button" data-card="${id}" data-walk="${walk.id}" data-kind="${journalMode}"><img src="${byId.get(id).thumbPhoto}" alt="" loading="lazy"><span>${name(id)}</span><small>${trailClues[id].label}</small></button>`).join("")}</div></section>`).join("")
      : `<div class="trail-empty"><span class="trail-empty-mark" aria-hidden="true">✧</span><div><b>等一张${journalMode === "field" ? "现场" : "线上"}探索卡片</b><p>打开第一条线索，给手记添上第一页。</p></div><a class="trail-btn" href="#trails">去选路线 ↗</a></div>`;
  }

  function openSummary(walk, kind) {
    task = { route: walk, mode: kind };
    const ids = walk.ids.filter(id => trip(walk, kind).cards[id]);
    content.innerHTML = `<div class="trail-dialog-head"><div><p class="trail-kicker">${labelFor(kind)} · ${ids.length === walk.ids.length ? "路线已完成" : "探索进行中"}</p>
      <h2 id="trail-dialog-title" tabindex="-1">${walk.name}</h2><p>已探索 ${ids.length} 处地点，收集 ${ids.length} 张历史卡片。</p></div><button type="button" class="trail-dialog-close" data-action="close" aria-label="关闭">×</button></div>
      <ol class="trail-summary-list">${walk.ids.map((id, index) => `<li><b>${index + 1}</b><span>${name(id)}</span><small>${ids.includes(id) ? trailClues[id].label : "待探索"}</small>
      ${ids.includes(id) ? `<button type="button" class="trail-text-btn" data-card="${id}" data-walk="${walk.id}" data-kind="${kind}">看卡片</button>` : ""}</li>`).join("")}</ol>
      <div class="trail-actions"><button type="button" class="trail-btn trail-primary" data-action="download-summary">保存路线纪念图 ↓</button><button type="button" class="trail-btn" data-action="summary-map">查看路线地图</button></div>
      <p id="trail-dialog-status" role="status"></p>`;
    showDialog();
  }

  async function exportRecord({ route: walk, mode: kind, id }, button) {
    const status = $("trail-dialog-status");
    const ids = id ? [id] : walk.ids.filter(item => trip(walk, kind).cards[item]);
    if (!ids.length) return;
    button.disabled = true;
    status.textContent = "正在生成纪念图…";
    try {
      const canvas = document.createElement("canvas");
      canvas.width = 900;
      canvas.height = id ? (trip(walk, kind).cards[id].note ? 1200 : 970) : 290 + 142 * ids.length;
      const ctx = canvas.getContext("2d");
      ctx.fillStyle = "#f6f0e4";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "#173c33";
      ctx.fillRect(0, 0, 900, 178);
      const print = (str, x, y, size, color = "#173c33", width = 780) => {
        ctx.font = `${size}px "Microsoft YaHei", "PingFang SC", sans-serif`;
        ctx.fillStyle = color;
        ctx.fillText(str, x, y, width);
      };
      const paragraph = (str, y) => {
        let line = "";
        ctx.font = '24px "Microsoft YaHei", "PingFang SC", sans-serif';
        for (const char of str) {
          if (char === "\n" || ctx.measureText(line + char).width > 770) {
            print(line, 60, y, 24);
            y += 35;
            line = "";
          }
          if (char !== "\n") line += char;
        }
        if (line) print(line, 60, y, 24);
        return y + 35;
      };
      print("GUSU FIELD NOTES  /  姑苏探索手记", 60, 61, 24, "#eed3a5");
      print(id ? name(id) : walk.name, 60, 128, 48, "#fff9ec");
      print(labelFor(kind) + " · " + (id ? formatDay(trip(walk, kind).cards[id].date) : `${ids.length} / ${walk.ids.length} 站`), 60, 222, 26);
      for (const [index, stop] of ids.entries()) {
        const place = byId.get(stop);
        const image = await loadImage(place.oldPhoto);
        if (id) {
          const ratio = Math.min(780 / image.width, 455 / image.height);
          ctx.drawImage(image, (900 - image.width * ratio) / 2, 244, image.width * ratio, image.height * ratio);
          print(place.oldCredit, 60, 733, 20);
          print(trailClues[id].label, 60, 781, 31);
          const y = paragraph(trailClues[id].story, 826);
          const note = trip(walk, kind).cards[id].note;
          if (note) paragraph("我的发现 · " + note.replace(/\s+/g, " "), y + 11);
        } else {
          const y = 250 + index * 142;
          drawCover(ctx, image, 60, y, 182, 107);
          print(name(stop), 265, y + 27, 30);
          print(trailClues[stop].label, 265, y + 62, 23);
          print(place.oldCredit, 265, y + 95, 18, "#5b6259", 570);
        }
      }
      const blob = await new Promise(resolve => canvas.toBlob(resolve, "image/png"));
      if (!blob) throw new Error("Canvas export failed");
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `gusu-${kind}-${id || walk.id}.png`;
      document.body.append(link);
      link.click();
      link.remove();
      setTimeout(() => URL.revokeObjectURL(url), 60000);
      status.textContent = "纪念图已生成。";
    } catch {
      status.textContent = "暂时无法生成图片，请稍后重试。";
    } finally {
      button.disabled = false;
    }
  }

  function chooseRoute(walk, kind = null) {
    stopLocation();
    route = walk;
    mode = kind;
    showRouteOnMap = true;
    const saved = writeProgress({ id: route.id, mode });
    renderOptions();
    renderWorkspace(true);
    if (!saved) locationStatus.textContent = "浏览器存储不可用，本次选择无法在刷新后恢复。";
    workspace.scrollIntoView({ block: "start" });
    $("trail-workspace-title").focus({ preventScroll: true });
  }

  function mountMap() {
    const mobile = mobileLayout.matches;
    $(mobile ? "trail-mobile-map-mount" : "trail-desktop-map-mount").append(mapWrap);
    if (mobile) mapView?.cooperativeGestures.disable();
    else mapView?.cooperativeGestures.enable();
  }

  function returnFromCamera(openClue = true) {
    if (!cameraTask) return;
    const returnTask = cameraTask;
    cameraTask = null;
    stopCamera();
    setTrailCameraMode(false);
    showPage("home");
    mapView?.resize();
    workspace.scrollIntoView({ block: "start" });
    if (openClue) openTask(returnTask.id);
  }

  async function openSpatialAR() {
    if (task?.mode !== "field" || !canOpen(task.id)) return;
    const currentTask = task;
    const place = byId.get(task.id);
    stopCamera();
    dialog.close();
    const result = await spatialAR.start(place);
    if (task !== currentTask || pages.home.classList.contains("hidden")) return;
    showDialog();
    const status = $("trail-ar-status");
    status.textContent = result.message || (result.placed ? "已返回历史线索。点照片上的标记，记录你看到的变化。" : "");
    if (status.textContent) status.focus();
  }

  function perform(action, button) {
    switch (action) {
      case "map-scope":
        showRouteOnMap = !showRouteOnMap;
        refreshMap(true);
        break;
      case "current-trail":
        if (route) chooseRoute(route, mode);
        else $("trails").scrollIntoView({ block: "start" });
        break;
      case "pause": chooseRoute(route); break;
      case "locate": startLocation(); break;
      case "close": dialog.close(); break;
      case "reveal": revealTask(); break;
      case "spatial-ar": openSpatialAR(); break;
      case "camera":
        cameraTask = task;
        selectPlace(byId.get(task.id), false, false);
        dialog.close();
        startField(trailClues[task.id]);
        break;
      case "collect": {
        if (!task || !revealed || task.route !== route || task.mode !== mode || task.id !== nextStop() || !canOpen(task.id)) return;
        const id = task.id;
        const note = $("trail-note-input").value.trim();
        if (!writeProgress({ id: route.id, mode }, record => {
          record.cards[id] ||= { date: new Date().toISOString(), note };
        })) {
          $("trail-dialog-status").textContent = "无法保存卡片。请检查浏览器存储设置后重试。";
          return;
        }
        justLit = id;
        journalMode = mode;
        renderOptions();
        renderWorkspace();
        renderJournal();
        openCard(route, mode, id, true);
        break;
      }
      case "continue":
        if (nextStop()) {
          dialog.close();
          workspace.scrollIntoView({ block: "start" });
          $("trail-workspace-title").focus({ preventScroll: true });
        } else openSummary(route, mode);
        break;
      case "summary-map":
        dialog.close();
        chooseRoute(task.route, task.mode);
        $(mobileLayout.matches ? "trail-mobile-map" : "trails").scrollIntoView({ block: "start" });
        break;
      case "download-card":
      case "download-summary":
        exportRecord(task, button);
        break;
    }
  }

  document.querySelector(".trail-site").addEventListener("click", event => {
    const button = event.target.closest("button");
    if (!button) return;
    const data = button.dataset;
    if (data.coverEra) {
      const isNow = data.coverEra === "now";
      $("trail-cover-then").hidden = isNow;
      $("trail-cover-now").hidden = !isNow;
      const place = byId.get("guanqian");
      $("trail-cover-credit").textContent = isNow ? place.nowCredit : place.oldCredit;
      document.querySelectorAll("[data-cover-era]").forEach(choice => choice.setAttribute("aria-pressed", choice === button));
    }
    if (data.route) chooseRoute(routeById.get(data.route), route?.id === data.route ? mode : null);
    if (data.mode) {
      chooseRoute(route, data.mode);
      if (data.mode === "field") startLocation();
    }
    if (data.clue) openTask(data.clue);
    if (data.summary) openSummary(routeById.get(data.summary), data.kind);
    if (data.card) openCard(routeById.get(data.walk), data.kind, data.card);
    if (data.journal) {
      journalMode = data.journal;
      renderJournal();
    }
    if (data.action) perform(data.action, button);
  });
  dialog.addEventListener("click", event => {
    const button = event.target.closest("button");
    if (!button) return;
    if (button.dataset.card) openCard(routeById.get(button.dataset.walk), button.dataset.kind, button.dataset.card);
    if (button.dataset.mapRoute) {
      const walk = routeById.get(button.dataset.mapRoute);
      dialog.close();
      chooseRoute(walk, walk === route ? mode : null);
    }
    if (button.dataset.archivePlace) {
      dialog.close();
      $("trail-archive").open = true;
      openRemote(byId.get(button.dataset.archivePlace));
    }
    if (button.dataset.action) perform(button.dataset.action, button);
  });
  $("trail-camera-back").addEventListener("click", () => returnFromCamera());
  $("trail-camera-finish").addEventListener("click", () => {
    returnFromCamera();
    if ($("trail-reveal")) revealTask();
  });
  document.querySelectorAll("[data-trail-jump], .brand").forEach(link => link.addEventListener("click", () => {
    if (cameraTask) returnFromCamera(false);
    if (pages.home.classList.contains("hidden")) {
      stopCamera();
      showPage("home");
    }
  }));
  document.addEventListener("visibilitychange", () => {
    if (document.hidden && watchId !== null) {
      stopLocation("定位已暂停，回到页面后可重新开启。");
      renderCurrent(nextStop());
    }
  });
  window.addEventListener("pagehide", () => stopLocation());
  window.addEventListener("storage", event => {
    if (event.key !== storageKey) return;
    Object.assign(progress, readProgress());
    renderOptions();
    renderWorkspace();
    renderJournal();
  });
  document.addEventListener("gusu:archive-visits", () => refreshMap());
  mobileLayout.addEventListener("change", () => {
    mountMap();
    refreshMap(true);
  });
  mountMap();
  renderOptions();
  renderWorkspace(true);
  renderJournal();
})();
