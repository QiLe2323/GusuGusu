const places = [
  { id: "niujia", name: "Niujia Lane", cn: "钮家巷", type: "STREET LIFE", storyTitle: "The street that changed its rhythm", hook: "Shopfronts, plane trees and bicycles reveal how everyday movement through the city has changed.", lat: 31.31218, lng: 120.62598, oldPhoto: "images/niujia_old.jpg", nowPhoto: "images/niujia_now.jpg", description: "Niujia Lane runs east from Lindun Road to Pingjiang Road. Its archival view preserves the intimate scale of a lived-in commercial street.", focus: "Street width, shopfronts and the pace of movement", shotTip: "Stand safely on the south-west side and face north-east. Align the road's vanishing line before matching the right-hand roofline.", anchors: ["The road edge receding to the left", "The continuous roofline on the right", "The tree and shopfront rhythm"], insight: "A slower street became a clearer traffic corridor.", detail: "Compare how the road is separated, how storefronts meet the pavement and how bicycles, pedestrians and cars occupy the frame.", query: "苏州市姑苏区临顿路钮家巷口" },
  { id: "daru", name: "Daru Lane", cn: "大儒巷", type: "URBAN EDGE", storyTitle: "A lane hidden behind the new city", hook: "The narrow entrance survives while larger buildings redraw the street around it.", lat: 31.31427, lng: 120.62552, oldPhoto: "images/daru_old.jpg", nowPhoto: "images/daru_new.jpg", description: "Daru Lane runs 403 metres from Lindun Road to Pingjiang Road. Its western entrance records a sharp change in building scale and street frontage.", focus: "The lane entrance against a transformed building edge", shotTip: "From the west pavement of Lindun Road, face east and centre the lane entrance. Use the right corner building as your strongest reference.", anchors: ["The narrow opening of Daru Lane", "The right-hand corner of the junction", "The vertical edge beside the lane"], insight: "The lane remained; the architecture around it grew.", detail: "The entrance still fixes the historic route, even as taller, broader façades change the proportion and visual weight of the junction.", query: "苏州市姑苏区临顿路大儒巷口" },
  { id: "wuxu", name: "Xinfu Li", cn: "信孚里 · 十梓街五卅路口", type: "SURVIVING HERITAGE", storyTitle: "The shikumen corner that endured", hook: "A 1933 residential compound still anchors a junction transformed by traffic and new street furniture.", lat: 31.30362, lng: 120.62277, oldPhoto: "images/wuxu_old.jpg", nowPhoto: "images/wuxu_new.jpg", description: "Xinfu Li stands east of the Shizi Street and Wusa Road junction. The shikumen compound, street trees and daily life form a rare surviving urban ensemble.", focus: "The surviving roofline, trees and corner frontage", shotTip: "Stand safely on the south-west side and face north-east. Keep Xinfu Li on the left while Shizi Street recedes towards the right.", anchors: ["Xinfu Li's roofline on the left", "The corner tree trunks", "Shizi Street receding to the right"], insight: "The buildings endured while the street learned new rules.", detail: "Look at what remains in the roofline and plot edge, then notice the newer signals, barriers and traffic systems layered around them.", query: "苏州市姑苏区十梓街五卅路口信孚里" }
];

const $ = id => document.getElementById(id);
const pages = { home: $("home-page"), camera: $("camera-page"), align: $("align-page"), preview: $("preview-page") };
const el = {
  storyGrid: $("story-grid"), routeStops: $("route-stops"), placeCard: $("place-card"), oldPhoto: $("old-photo"), nowPhoto: $("now-photo"), placeIndex: $("place-index"), placeName: $("place-name"), placeCn: $("place-cn"), placeDesc: $("place-desc"), changeFocus: $("change-focus"), shotTip: $("shot-tip"), distanceBadge: $("distance-badge"), navLink: $("nav-link"), remoteBtn: $("remote-btn"), startBtn: $("start-btn"), locateBtn: $("locate-btn"), locationToast: $("location-toast"), tryDemoBtn: $("try-demo-btn"), heroSlider: $("hero-slider"), heroOldWrap: $("hero-old-wrap"), heroHandle: $("hero-handle"),
  camera: $("camera"), cameraContainer: document.querySelector(".camera-container"), overlayPhoto: $("overlay-photo"), cameraPlaceholder: $("camera-placeholder"), cameraError: $("camera-error"), cameraErrorText: $("camera-error-text"), opacitySlider: $("opacity-slider"), opacityValue: $("opacity-value"), zoomSlider: $("zoom-slider"), zoomValue: $("zoom-value"), rotationSlider: $("rotation-slider"), rotationValue: $("rotation-value"), fitBtn: $("fit-btn"), lockBtn: $("lock-btn"), resetOverlayBtn: $("reset-overlay-btn"), ghostModeLabel: $("ghost-mode-label"), captureBtn: $("capture-btn"), uploadInput: $("upload-input"), referenceBtn: $("reference-btn"), backHomeBtn: $("back-home-btn"), canvas: $("canvas"), cameraStep: $("camera-step"), cameraPlaceName: $("camera-place-name"), proximityStatus: $("proximity-status"), anchorList: $("anchor-list"),
  alignBackBtn: $("align-back-btn"), alignPlaceName: $("align-place-name"), pairCount: $("pair-count"), alignStepNumber: $("align-step-number"), alignInstructionTitle: $("align-instruction-title"), alignInstructionCopy: $("align-instruction-copy"), oldPointStage: $("old-point-stage"), newPointStage: $("new-point-stage"), alignOld: $("align-old"), alignNew: $("align-new"), oldPointLayer: $("old-point-layer"), newPointLayer: $("new-point-layer"), undoPointBtn: $("undo-point-btn"), clearPointsBtn: $("clear-points-btn"), alignmentReview: $("alignment-review"), reviewTitle: $("review-title"), alignmentQuality: $("alignment-quality"), alignPreviewNew: $("align-preview-new"), warpCanvas: $("warp-canvas"), alignOpacitySlider: $("align-opacity-slider"), alignOpacityValue: $("align-opacity-value"), skipAlignBtn: $("skip-align-btn"), confirmAlignBtn: $("confirm-align-btn"),
  previewOld: $("preview-old"), previewNew: $("preview-new"), previewPlaceName: $("preview-place-name"), previewBackBtn: $("preview-back-btn"), retakeBtn: $("retake-btn"), downloadBtn: $("download-btn"), finishBtn: $("finish-btn"), compareSlider: $("compare-slider"), compareOldWrap: $("compare-old-wrap"), compareHandle: $("compare-handle"), resultInsight: $("result-insight"), resultDetail: $("result-detail"), visitedCount: $("visited-count")
};

let selectedPlace = places[0], cameraStream = null, userPosition = null, userMarker = null, referenceOnly = false, remoteMode = false, map = null, fieldImageSrc = "";
const markers = new Map();
const visited = new Set(JSON.parse(localStorage.getItem("gusu-visited") || "[]"));
const pointColors = ["#b84937", "#187567", "#c38b26", "#315aa0", "#8b4da0", "#227c9d"];
const overlayState = { x: 0, y: 0, scale: 1, rotation: 0, fit: "cover", locked: false };
const activePointers = new Map();
let pinchStart = null;
const alignment = { pairs: [], pending: null, oldImage: null, newImage: null, homography: null };

function setCompare(value, wrap, handle) { wrap.style.clipPath = `inset(0 ${100 - value}% 0 0)`; handle.style.left = `${value}%`; }
function buildStories() { places.forEach((place, index) => { const card = document.createElement("article"); card.className = "story-card"; card.dataset.id = place.id; card.innerHTML = `<div class="story-image"><img src="${place.oldPhoto}" alt="Archival view of ${place.name}"><span class="story-number">0${index + 1}</span><span class="story-era">ARCHIVE</span></div><div class="story-body"><span class="story-type">${place.type}</span><h3>${place.storyTitle}</h3><div class="story-cn">${place.name} · ${place.cn}</div><p class="story-hook">${place.hook}</p><div class="story-actions"><button class="story-preview" type="button">See the change</button><button class="story-route" type="button">Map ↓</button></div></div>`; card.querySelector(".story-preview").addEventListener("click", () => openRemote(place)); card.querySelector(".story-route").addEventListener("click", () => { selectPlace(place); $("route").scrollIntoView({ behavior: "smooth" }); }); el.storyGrid.appendChild(card); }); }
function buildRouteStops() {
  places.forEach((place, index) => {
    const card = document.createElement("article");
    card.className = "route-stop";
    card.dataset.id = place.id;
    card.innerHTML = `<button class="route-stop-main" type="button" aria-label="Show ${place.name} on the map"><span class="route-thumb"><img src="${place.oldPhoto}" alt=""></span><span class="route-stop-copy"><small class="route-status"></small><strong>${place.name}</strong><span>${place.cn}</span></span></button><div class="route-stop-actions"><button class="route-preview" type="button">Compare</button><button class="route-capture" type="button">Camera</button></div>`;
    card.querySelector(".route-stop-main").addEventListener("click", () => selectPlace(place, true));
    card.querySelector(".route-preview").addEventListener("click", () => openRemote(place));
    card.querySelector(".route-capture").addEventListener("click", () => { selectPlace(place); startField(); });
    el.routeStops.appendChild(card);
  });
}

const SUZHOU_BOUNDS = [[120.32, 31.02], [120.98, 31.62]];
function isInsideSuzhou(position) { return position.lng >= SUZHOU_BOUNDS[0][0] && position.lng <= SUZHOU_BOUNDS[1][0] && position.lat >= SUZHOU_BOUNDS[0][1] && position.lat <= SUZHOU_BOUNDS[1][1]; }
function createPinElement(index, place) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = "place-pin";
  button.setAttribute("aria-label", `${place.name}, ${visited.has(place.id) ? "visited" : "not visited"}`);
  button.innerHTML = `<span><b>${visited.has(place.id) ? "✓" : `0${index + 1}`}</b></span>`;
  button.addEventListener("click", event => { event.stopPropagation(); selectPlace(place, true); });
  return button;
}
function updateMarkerVisuals() {
  places.forEach((place, index) => {
    const marker = markers.get(place.id);
    if (!marker) return;
    const node = marker.getElement();
    const isVisited = visited.has(place.id);
    node.classList.toggle("is-active", place.id === selectedPlace.id);
    node.classList.toggle("is-visited", isVisited);
    node.querySelector("b").textContent = isVisited ? "✓" : `0${index + 1}`;
    node.setAttribute("aria-label", `${place.name}, ${isVisited ? "visited" : "not visited"}`);
  });
}
function initMap() {
  map = new maplibregl.Map({
    container: "map",
    style: "https://tiles.openfreemap.org/styles/positron",
    center: [120.6245, 31.31],
    zoom: 14,
    minZoom: 11.5,
    maxZoom: 18,
    maxBounds: SUZHOU_BOUNDS,
    attributionControl: false
  });
  map.scrollZoom.disable();
  map.addControl(new maplibregl.NavigationControl({ showCompass: false }), "bottom-right");
  map.addControl(new maplibregl.AttributionControl({ compact: true }), "top-right");
  map.on("load", () => {
    const order = [places[1], places[0], places[2]];
    map.addSource("field-route", { type: "geojson", data: { type: "Feature", geometry: { type: "LineString", coordinates: order.map(place => [place.lng, place.lat]) } } });
    map.addLayer({ id: "field-route", type: "line", source: "field-route", paint: { "line-color": "#a54b38", "line-width": 2.5, "line-opacity": .58, "line-dasharray": [2, 3] } });
  });
  places.forEach((place, index) => {
    const node = createPinElement(index, place);
    const marker = new maplibregl.Marker({ element: node, anchor: "bottom" }).setLngLat([place.lng, place.lat]).addTo(map);
    markers.set(place.id, marker);
  });
  const bounds = new maplibregl.LngLatBounds();
  places.forEach(place => bounds.extend([place.lng, place.lat]));
  map.fitBounds(bounds, { padding: { top: 90, right: 55, bottom: 155, left: 55 }, maxZoom: 14.3, duration: 0 });
}
function selectPlace(place, scroll = false) {
  selectedPlace = place;
  updateMarkerVisuals();
  document.querySelectorAll(".route-stop").forEach(item => item.classList.toggle("is-active", item.dataset.id === place.id));
  const index = places.indexOf(place);
  el.oldPhoto.src = place.oldPhoto; el.nowPhoto.src = place.nowPhoto;
  el.placeIndex.textContent = `VIEWPOINT 0${index + 1} · ${place.type}`;
  el.placeName.textContent = place.name; el.placeCn.textContent = place.cn; el.placeDesc.textContent = place.description;
  el.changeFocus.textContent = place.focus; el.shotTip.textContent = place.shotTip;
  el.navLink.href = `https://uri.amap.com/search?keyword=${encodeURIComponent(place.query)}&city=苏州&callnative=1`;
  el.placeCard.classList.remove("hidden");
  updateDistance();
  map?.flyTo({ center: [place.lng, place.lat], zoom: 16, duration: 650, essential: true });
  const activeCard = document.querySelector(`.route-stop[data-id="${place.id}"]`);
  if (activeCard) el.routeStops.scrollTo({ left: activeCard.offsetLeft - (el.routeStops.clientWidth - activeCard.offsetWidth) / 2, behavior: "smooth" });
  if (scroll && window.matchMedia("(min-width: 681px)").matches) setTimeout(() => el.placeCard.scrollIntoView({ behavior: "smooth", block: "center" }), 300);
}function showPage(name) { Object.entries(pages).forEach(([key, page]) => page.classList.toggle("hidden", key !== name)); window.scrollTo({ top: 0, behavior: "smooth" }); if (name === "home") setTimeout(() => map?.resize(), 120); }
function distanceMeters(a, b) { const rad = value => value * Math.PI / 180, dLat = rad(b.lat - a.lat), dLng = rad(b.lng - a.lng), x = Math.sin(dLat / 2) ** 2 + Math.cos(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.sin(dLng / 2) ** 2; return 6371000 * 2 * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x)); }
const formatDistance = distance => distance < 1000 ? `About ${Math.round(distance / 10) * 10} m away` : `About ${(distance / 1000).toFixed(1)} km away`;
function updateDistance() { if (!userPosition) { el.distanceBadge.textContent = "Locate yourself to see distance"; el.proximityStatus.querySelector("b").textContent = "Location optional"; return; } const distance = distanceMeters(userPosition, selectedPlace); el.distanceBadge.textContent = formatDistance(distance); el.proximityStatus.classList.toggle("is-far", distance > 120); el.proximityStatus.querySelector("b").textContent = distance <= 120 ? "Within the suggested viewpoint" : formatDistance(distance); }
function toast(message) { el.locationToast.textContent = message; el.locationToast.classList.remove("hidden"); clearTimeout(toast.timer); toast.timer = setTimeout(() => el.locationToast.classList.add("hidden"), 3800); }
function locateUser() {
  if (!navigator.geolocation) { toast("Location is unavailable here. You can still explore every story."); return; }
  el.locateBtn.disabled = true; el.locateBtn.innerHTML = "<span>⌖</span> Locating…";
  navigator.geolocation.getCurrentPosition(position => {
    userPosition = { lat: position.coords.latitude, lng: position.coords.longitude };
    userMarker?.remove(); userMarker = null;
    if (isInsideSuzhou(userPosition)) {
      const node = document.createElement("div"); node.className = "user-pin"; node.setAttribute("aria-label", "Your location");
      userMarker = new maplibregl.Marker({ element: node }).setLngLat([userPosition.lng, userPosition.lat]).addTo(map);
      map.flyTo({ center: [userPosition.lng, userPosition.lat], zoom: 16, duration: 650, essential: true });
      toast("Location found. Each viewpoint now shows its distance.");
    } else {
      toast("You are outside the Suzhou map area. Distances are shown, but the map stays in Suzhou.");
    }
    updateDistance(); resetLocate();
  }, error => { toast(error.code === 1 ? "Location permission was not granted. The remote experience still works." : "Your location could not be determined."); resetLocate(); }, { enableHighAccuracy: true, timeout: 10000, maximumAge: 30000 });
}
function resetLocate() { el.locateBtn.disabled = false; el.locateBtn.innerHTML = "<span>⌖</span> Locate me"; }

function applyOverlayTransform() { el.overlayPhoto.style.transform = `translate3d(${overlayState.x}px,${overlayState.y}px,0) rotate(${overlayState.rotation}deg) scale(${overlayState.scale})`; el.overlayPhoto.style.objectFit = overlayState.fit; el.zoomSlider.value = Math.round(overlayState.scale * 100); el.rotationSlider.value = overlayState.rotation; el.zoomValue.value = `${Math.round(overlayState.scale * 100)}%`; el.rotationValue.value = `${Number(overlayState.rotation).toFixed(overlayState.rotation % 1 ? 1 : 0)}°`; el.fitBtn.textContent = overlayState.fit === "cover" ? "Contain" : "Cover"; el.lockBtn.textContent = overlayState.locked ? "Unlock ghost" : "Lock ghost"; el.lockBtn.classList.toggle("is-active", overlayState.locked); el.cameraContainer.classList.toggle("is-locked", overlayState.locked); el.ghostModeLabel.textContent = overlayState.locked ? "GHOST LOCKED" : "GHOST UNLOCKED · DRAG TO POSITION"; }
function resetOverlay() { Object.assign(overlayState, { x: 0, y: 0, scale: 1, rotation: 0, fit: "cover", locked: false }); applyOverlayTransform(); }
function setOpacity(value) { const numeric = Number(value); el.overlayPhoto.style.opacity = referenceOnly ? 1 : numeric; el.opacityValue.value = `${Math.round(numeric * 100)}%`; }
const pointerDistance = points => Math.hypot(points[0].x - points[1].x, points[0].y - points[1].y);
const pointerAngle = points => Math.atan2(points[1].y - points[0].y, points[1].x - points[0].x) * 180 / Math.PI;
const pointerCenter = points => ({ x: (points[0].x + points[1].x) / 2, y: (points[0].y + points[1].y) / 2 });
function handleOverlayPointerDown(event) { if (overlayState.locked) return; el.cameraContainer.setPointerCapture?.(event.pointerId); activePointers.set(event.pointerId, { x: event.clientX, y: event.clientY, lastX: event.clientX, lastY: event.clientY }); el.cameraContainer.classList.add("is-dragging"); if (activePointers.size === 2) { const points = [...activePointers.values()]; pinchStart = { distance: pointerDistance(points), angle: pointerAngle(points), center: pointerCenter(points), scale: overlayState.scale, rotation: overlayState.rotation, x: overlayState.x, y: overlayState.y }; } }
function handleOverlayPointerMove(event) { if (!activePointers.has(event.pointerId) || overlayState.locked) return; const point = activePointers.get(event.pointerId); point.x = event.clientX; point.y = event.clientY; if (activePointers.size === 1) { overlayState.x += point.x - point.lastX; overlayState.y += point.y - point.lastY; } else if (activePointers.size === 2 && pinchStart) { const points = [...activePointers.values()], center = pointerCenter(points); overlayState.scale = Math.min(2.2, Math.max(.5, pinchStart.scale * pointerDistance(points) / Math.max(1, pinchStart.distance))); overlayState.rotation = Math.min(20, Math.max(-20, pinchStart.rotation + pointerAngle(points) - pinchStart.angle)); overlayState.x = pinchStart.x + center.x - pinchStart.center.x; overlayState.y = pinchStart.y + center.y - pinchStart.center.y; } point.lastX = point.x; point.lastY = point.y; applyOverlayTransform(); }
function handleOverlayPointerEnd(event) { activePointers.delete(event.pointerId); pinchStart = null; if (!activePointers.size) el.cameraContainer.classList.remove("is-dragging"); if (activePointers.size === 1) { const point = [...activePointers.values()][0]; point.lastX = point.x; point.lastY = point.y; } }

function prepareResult(place, newImage, isRemote, alignedOld = place.oldPhoto) { selectedPlace = place; remoteMode = isRemote; el.previewOld.src = alignedOld; el.previewNew.src = newImage; el.previewPlaceName.textContent = `${place.name} · ${place.cn}`; el.resultInsight.textContent = place.insight; el.resultDetail.textContent = place.detail; el.compareSlider.value = 50; setCompare(50, el.compareOldWrap, el.compareHandle); el.retakeBtn.textContent = isRemote ? "Choose another story" : "Retake photograph"; stopCamera(); showPage("preview"); }
function openRemote(place) { prepareResult(place, place.nowPhoto, true, place.oldPhoto); }
async function startField() { remoteMode = false; fieldImageSrc = ""; el.cameraStep.textContent = `VIEWPOINT 0${places.indexOf(selectedPlace) + 1} · ON-SITE COMPARISON`; el.cameraPlaceName.textContent = `${selectedPlace.name} · ${selectedPlace.cn}`; el.overlayPhoto.src = selectedPlace.oldPhoto; el.anchorList.innerHTML = selectedPlace.anchors.map((anchor, index) => `<li><b>${index + 1}</b> ${anchor}</li>`).join(""); el.opacitySlider.value = .5; referenceOnly = false; el.referenceBtn.textContent = "View archive"; resetOverlay(); setOpacity(.5); updateDistance(); showPage("camera"); await startCamera(); }
async function startCamera() { stopCamera(); el.cameraError.classList.add("hidden"); el.cameraPlaceholder.classList.remove("hidden"); el.cameraPlaceholder.querySelector("strong").textContent = "Opening the camera"; el.cameraPlaceholder.querySelector("p").textContent = "Allow access to your rear camera"; if (!navigator.mediaDevices?.getUserMedia) { showCameraError("Live camera access is not supported. Choose a photograph below to continue."); return; } try { cameraStream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: { ideal: "environment" }, width: { ideal: 1920 }, height: { ideal: 1280 } }, audio: false }); el.camera.srcObject = cameraStream; await el.camera.play(); el.cameraPlaceholder.classList.add("hidden"); } catch (error) { showCameraError(error.name === "NotAllowedError" ? "Camera permission is off. Allow it in browser settings, or choose a photograph instead." : "The camera could not be opened. Choose a photograph instead."); } }
function showCameraError(message) { el.cameraErrorText.textContent = message; el.cameraError.classList.remove("hidden"); el.cameraPlaceholder.querySelector("strong").textContent = "Continue with a photo"; el.cameraPlaceholder.querySelector("p").textContent = "Your image never leaves this device"; }
function stopCamera() { cameraStream?.getTracks().forEach(track => track.stop()); cameraStream = null; el.camera.srcObject = null; }
function capturePhoto() { if (!el.camera.videoWidth) { showCameraError("The camera is not ready. Wait a moment, or choose a photograph instead."); return; } const canvas = el.canvas, context = canvas.getContext("2d"); canvas.width = el.camera.videoWidth; canvas.height = el.camera.videoHeight; context.drawImage(el.camera, 0, 0, canvas.width, canvas.height); startAlignment(canvas.toDataURL("image/jpeg", .92)); }
function handleUpload(event) { const file = event.target.files?.[0]; if (!file?.type.startsWith("image/")) return; const reader = new FileReader(); reader.onload = () => startAlignment(reader.result); reader.readAsDataURL(file); event.target.value = ""; }
function loadImage(src) { return new Promise((resolve, reject) => { const image = new Image(); image.onload = () => resolve(image); image.onerror = reject; image.src = src; }); }

async function startAlignment(newImageSrc) { stopCamera(); fieldImageSrc = newImageSrc; alignment.pairs = []; alignment.pending = null; alignment.homography = null; el.alignOld.src = selectedPlace.oldPhoto; el.alignNew.src = newImageSrc; el.alignPreviewNew.src = newImageSrc; el.alignPlaceName.textContent = `${selectedPlace.name} · ${selectedPlace.cn}`; resetWarpCanvas(); showPage("align"); try { [alignment.oldImage, alignment.newImage] = await Promise.all([loadImage(selectedPlace.oldPhoto), loadImage(newImageSrc)]); updateAlignmentUI(); } catch { el.alignInstructionTitle.textContent = "One of the photographs could not be loaded."; el.alignInstructionCopy.textContent = "Return to the camera and try another photograph."; } }
function imageDisplayBox(stage, image) { const rect = stage.getBoundingClientRect(), naturalWidth = image.naturalWidth || image.width, naturalHeight = image.naturalHeight || image.height, scale = Math.min(rect.width / naturalWidth, rect.height / naturalHeight), width = naturalWidth * scale, height = naturalHeight * scale; return { rect, width, height, left: (rect.width - width) / 2, top: (rect.height - height) / 2 }; }
function eventToImagePoint(event, stage, image) { const box = imageDisplayBox(stage, image), x = event.clientX - box.rect.left - box.left, y = event.clientY - box.rect.top - box.top; if (x < 0 || y < 0 || x > box.width || y > box.height) return null; return { x: x / box.width, y: y / box.height }; }
function addPointMarker(layer, stage, image, point, index, pending = false) { const box = imageDisplayBox(stage, image), marker = document.createElement("span"); marker.className = `match-point${pending ? " is-pending" : ""}`; marker.textContent = index + 1; marker.style.setProperty("--point-color", pointColors[index % pointColors.length]); marker.style.left = `${(box.left + point.x * box.width) / box.rect.width * 100}%`; marker.style.top = `${(box.top + point.y * box.height) / box.rect.height * 100}%`; layer.appendChild(marker); }
function renderPointMarkers() { if (!alignment.oldImage || !alignment.newImage) return; el.oldPointLayer.replaceChildren(); el.newPointLayer.replaceChildren(); alignment.pairs.forEach((pair, index) => { addPointMarker(el.oldPointLayer, el.oldPointStage, alignment.oldImage, pair.old, index); addPointMarker(el.newPointLayer, el.newPointStage, alignment.newImage, pair.new, index); }); if (alignment.pending) addPointMarker(el.oldPointLayer, el.oldPointStage, alignment.oldImage, alignment.pending, alignment.pairs.length, true); }
function handlePointClick(side, event) { if (!alignment.oldImage || !alignment.newImage) return; if (alignment.pairs.length >= 6 && !alignment.pending) { el.alignInstructionTitle.textContent = "Six pairs are enough."; el.alignInstructionCopy.textContent = "Review the overlay below, or undo a point to replace it."; return; } if (side === "old") { const point = eventToImagePoint(event, el.oldPointStage, alignment.oldImage); if (!point) return; alignment.pending = point; } else { if (!alignment.pending) { el.alignInstructionTitle.textContent = "Start on the archive photograph."; el.alignInstructionCopy.textContent = "Tap a stable landmark on the left, then tap the same landmark here."; return; } const point = eventToImagePoint(event, el.newPointStage, alignment.newImage); if (!point) return; alignment.pairs.push({ old: alignment.pending, new: point }); alignment.pending = null; } updateAlignmentUI(); }
function updateAlignmentUI() { const count = alignment.pairs.length; el.pairCount.textContent = `${count} / 4`; if (alignment.pending) { el.alignStepNumber.textContent = count + 1; el.alignInstructionTitle.textContent = "Now tap the same landmark in the present photo."; el.alignInstructionCopy.textContent = "Be precise: choose the exact same corner or junction on the right."; } else if (count < 4) { el.alignStepNumber.textContent = count + 1; el.alignInstructionTitle.textContent = count ? "Choose another landmark in the archive." : "Tap a landmark in the archive."; el.alignInstructionCopy.textContent = "Spread points across the whole frame—near the corners and centre—not in one cluster."; } else if (count < 6) { el.alignStepNumber.textContent = "✓"; el.alignInstructionTitle.textContent = "The perspective alignment is ready."; el.alignInstructionCopy.textContent = "Add one or two more pairs for a steadier result, or inspect the transparency preview below."; } else { el.alignStepNumber.textContent = "✓"; el.alignInstructionTitle.textContent = "Maximum landmark set complete."; el.alignInstructionCopy.textContent = "Inspect the transparency preview and use the aligned comparison when it looks right."; } renderPointMarkers(); el.undoPointBtn.disabled = !alignment.pending && count === 0; el.clearPointsBtn.disabled = !alignment.pending && count === 0; if (count >= 4) renderAlignment(); else resetWarpCanvas(); }
function renewWarpCanvas() { const previous = el.warpCanvas, canvas = document.createElement("canvas"); canvas.id = "warp-canvas"; canvas.setAttribute("aria-label", "Warped archival photograph"); canvas.style.opacity = previous.style.opacity || el.alignOpacitySlider.value; previous.replaceWith(canvas); el.warpCanvas = canvas; return canvas; }
function resetWarpCanvas() { alignment.homography = null; renewWarpCanvas(); el.alignmentReview.classList.add("is-waiting"); el.reviewTitle.textContent = "Add four landmark pairs to preview the warp."; el.alignmentQuality.textContent = "WAITING FOR POINTS"; el.alignmentQuality.className = "quality-chip"; el.alignOpacitySlider.disabled = true; el.confirmAlignBtn.disabled = true; }

function solveLinear(matrix, vector) { const size = vector.length, augmented = matrix.map((row, index) => [...row, vector[index]]); for (let column = 0; column < size; column += 1) { let pivot = column; for (let row = column + 1; row < size; row += 1) if (Math.abs(augmented[row][column]) > Math.abs(augmented[pivot][column])) pivot = row; if (Math.abs(augmented[pivot][column]) < 1e-10) return null; [augmented[column], augmented[pivot]] = [augmented[pivot], augmented[column]]; const divisor = augmented[column][column]; for (let j = column; j <= size; j += 1) augmented[column][j] /= divisor; for (let row = 0; row < size; row += 1) { if (row === column) continue; const factor = augmented[row][column]; for (let j = column; j <= size; j += 1) augmented[row][j] -= factor * augmented[column][j]; } } return augmented.map(row => row[size]); }
function solveLeastSquares(matrix, vector) { const columns = matrix[0].length, ata = Array.from({ length: columns }, () => Array(columns).fill(0)), atb = Array(columns).fill(0); for (let row = 0; row < matrix.length; row += 1) for (let i = 0; i < columns; i += 1) { atb[i] += matrix[row][i] * vector[row]; for (let j = 0; j < columns; j += 1) ata[i][j] += matrix[row][i] * matrix[row][j]; } return solveLinear(ata, atb); }
function computeHomography(pairs) { const matrix = [], vector = []; pairs.forEach(pair => { const { x, y } = pair.old, u = pair.new.x, v = pair.new.y; matrix.push([x, y, 1, 0, 0, 0, -u * x, -u * y]); vector.push(u); matrix.push([0, 0, 0, x, y, 1, -v * x, -v * y]); vector.push(v); }); const solution = pairs.length === 4 ? solveLinear(matrix, vector) : solveLeastSquares(matrix, vector); return solution ? [...solution, 1] : null; }
function invert3x3(matrix) { const [a, b, c, d, e, f, g, h, i] = matrix, A = e * i - f * h, B = c * h - b * i, C = b * f - c * e, D = f * g - d * i, E = a * i - c * g, F = c * d - a * f, G = d * h - e * g, H = b * g - a * h, I = a * e - b * d, determinant = a * A + b * D + c * G; if (Math.abs(determinant) < 1e-10) return null; return [A, B, C, D, E, F, G, H, I].map(value => value / determinant); }
function projectPoint(homography, point) { const denominator = homography[6] * point.x + homography[7] * point.y + homography[8]; return { x: (homography[0] * point.x + homography[1] * point.y + homography[2]) / denominator, y: (homography[3] * point.x + homography[4] * point.y + homography[5]) / denominator }; }
function alignmentScore(homography) { const errors = alignment.pairs.map(pair => { const projected = projectPoint(homography, pair.old); return Math.hypot(projected.x - pair.new.x, projected.y - pair.new.y); }), rms = Math.sqrt(errors.reduce((sum, value) => sum + value * value, 0) / errors.length), xs = alignment.pairs.map(pair => pair.new.x), ys = alignment.pairs.map(pair => pair.new.y), coverage = (Math.max(...xs) - Math.min(...xs)) * (Math.max(...ys) - Math.min(...ys)), coverageScore = Math.min(1, coverage / .42), fitScore = Math.max(0, 1 - rms / .06); return Math.round((.58 * coverageScore + .42 * fitScore) * 100); }

function createShader(gl, type, source) { const shader = gl.createShader(type); gl.shaderSource(shader, source); gl.compileShader(shader); if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(shader)); return shader; }
function renderWarpWebGL(image, inverse, canvas, width, height) {
  canvas.width = width; canvas.height = height;
  const gl = canvas.getContext("webgl", { alpha: true, premultipliedAlpha: false, preserveDrawingBuffer: true });
  if (!gl) return false;
  const vertex = createShader(gl, gl.VERTEX_SHADER, "attribute vec2 a_position;varying vec2 v_target;void main(){gl_Position=vec4(a_position,0.0,1.0);v_target=vec2((a_position.x+1.0)*0.5,(1.0-a_position.y)*0.5);}");
  const fragment = createShader(gl, gl.FRAGMENT_SHADER, "precision highp float;uniform sampler2D u_image;uniform mat3 u_inverse;varying vec2 v_target;void main(){vec3 mapped=u_inverse*vec3(v_target,1.0);vec2 source=mapped.xy/mapped.z;if(mapped.z<=0.0||source.x<0.0||source.x>1.0||source.y<0.0||source.y>1.0)discard;gl_FragColor=texture2D(u_image,source);}");
  const program = gl.createProgram(); gl.attachShader(program, vertex); gl.attachShader(program, fragment); gl.linkProgram(program); if (!gl.getProgramParameter(program, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(program)); gl.useProgram(program);
  const buffer = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, buffer); gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1,1,-1,-1,1,-1,1,1,-1,1,1]), gl.STATIC_DRAW); const position = gl.getAttribLocation(program, "a_position"); gl.enableVertexAttribArray(position); gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);
  const texture = gl.createTexture(); gl.bindTexture(gl.TEXTURE_2D, texture); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR); gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
  const columnMajor = [inverse[0],inverse[3],inverse[6],inverse[1],inverse[4],inverse[7],inverse[2],inverse[5],inverse[8]]; gl.uniformMatrix3fv(gl.getUniformLocation(program, "u_inverse"), false, new Float32Array(columnMajor)); gl.viewport(0, 0, width, height); gl.clearColor(0,0,0,0); gl.clear(gl.COLOR_BUFFER_BIT); gl.drawArrays(gl.TRIANGLES, 0, 6); return true;
}
function renderAffineFallback(image, pairs, canvas, width, height) { const matrix = [], vector = []; pairs.slice(0, 3).forEach(pair => { matrix.push([pair.old.x,pair.old.y,1,0,0,0]); vector.push(pair.new.x); matrix.push([0,0,0,pair.old.x,pair.old.y,1]); vector.push(pair.new.y); }); const result = solveLinear(matrix, vector); if (!result) return false; canvas.width = width; canvas.height = height; const context = canvas.getContext("2d"); context.clearRect(0,0,width,height); context.setTransform(result[0]*width/image.width,result[3]*height/image.width,result[1]*width/image.height,result[4]*height/image.height,result[2]*width,result[5]*height); context.drawImage(image,0,0); return true; }
function renderWarpCPU(image, inverse, canvas, width, height) { const sourceScale = Math.min(1, 1600 / Math.max(image.width, image.height)), sourceWidth = Math.max(1, Math.round(image.width * sourceScale)), sourceHeight = Math.max(1, Math.round(image.height * sourceScale)), sourceCanvas = document.createElement("canvas"), sourceContext = sourceCanvas.getContext("2d", { willReadFrequently: true }); sourceCanvas.width = sourceWidth; sourceCanvas.height = sourceHeight; sourceContext.drawImage(image, 0, 0, sourceWidth, sourceHeight); const source = sourceContext.getImageData(0, 0, sourceWidth, sourceHeight).data; canvas.width = width; canvas.height = height; const context = canvas.getContext("2d"), output = context.createImageData(width, height), target = output.data; for (let y = 0; y < height; y += 1) { const v = y / Math.max(1, height - 1); for (let x = 0; x < width; x += 1) { const u = x / Math.max(1, width - 1), denominator = inverse[6] * u + inverse[7] * v + inverse[8]; if (denominator <= 0) continue; const sourceX = (inverse[0] * u + inverse[1] * v + inverse[2]) / denominator, sourceY = (inverse[3] * u + inverse[4] * v + inverse[5]) / denominator; if (sourceX < 0 || sourceX > 1 || sourceY < 0 || sourceY > 1) continue; const sx = sourceX * (sourceWidth - 1), sy = sourceY * (sourceHeight - 1), x0 = Math.floor(sx), y0 = Math.floor(sy), x1 = Math.min(sourceWidth - 1, x0 + 1), y1 = Math.min(sourceHeight - 1, y0 + 1), fx = sx - x0, fy = sy - y0, outputIndex = (y * width + x) * 4; for (let channel = 0; channel < 4; channel += 1) { const top = source[(y0 * sourceWidth + x0) * 4 + channel] * (1 - fx) + source[(y0 * sourceWidth + x1) * 4 + channel] * fx, bottom = source[(y1 * sourceWidth + x0) * 4 + channel] * (1 - fx) + source[(y1 * sourceWidth + x1) * 4 + channel] * fx; target[outputIndex + channel] = top * (1 - fy) + bottom * fy; } } } context.putImageData(output, 0, 0); return true; }
function renderAlignment() { const homography = computeHomography(alignment.pairs), inverse = homography && invert3x3(homography); if (!homography || !inverse) { el.reviewTitle.textContent = "These points cannot form a stable alignment."; el.alignmentQuality.textContent = "SPREAD POINTS FARTHER APART"; el.alignmentQuality.className = "quality-chip"; el.confirmAlignBtn.disabled = true; return; } alignment.homography = homography; const ratio = Math.min(1, 1400 / Math.max(alignment.newImage.width, alignment.newImage.height)), width = Math.max(1, Math.round(alignment.newImage.width * ratio)), height = Math.max(1, Math.round(alignment.newImage.height * ratio)); let canvas = renewWarpCanvas(), rendered = false, renderer = "WEBGL PERSPECTIVE"; try { rendered = renderWarpWebGL(alignment.oldImage, inverse, canvas, width, height); } catch { rendered = false; } if (!rendered) { canvas = renewWarpCanvas(); renderer = "CPU PERSPECTIVE"; try { rendered = renderWarpCPU(alignment.oldImage, inverse, canvas, width, height); } catch { rendered = false; } } if (!rendered) { el.reviewTitle.textContent = "This browser could not render the alignment."; el.confirmAlignBtn.disabled = true; return; } const score = alignmentScore(homography); el.alignmentReview.classList.remove("is-waiting"); el.reviewTitle.textContent = alignment.pairs.length > 4 ? "Refined perspective alignment" : "Perspective alignment preview"; el.alignmentQuality.textContent = score >= 75 ? `${renderer} · ${score}%` : `${renderer} · CHECK SPREAD · ${score}%`; el.alignmentQuality.className = `quality-chip ${score >= 75 ? "is-good" : "is-ready"}`; el.alignOpacitySlider.disabled = false; el.confirmAlignBtn.disabled = false; el.warpCanvas.style.opacity = el.alignOpacitySlider.value; }
function undoPoint() { if (alignment.pending) alignment.pending = null; else alignment.pairs.pop(); updateAlignmentUI(); }
function clearPoints() { alignment.pairs = []; alignment.pending = null; updateAlignmentUI(); }
function confirmAlignment() { if (!alignment.homography) return; let alignedOld; try { alignedOld = el.warpCanvas.toDataURL("image/png"); } catch { alignedOld = selectedPlace.oldPhoto; } prepareResult(selectedPlace, fieldImageSrc, false, alignedOld); }

function drawCover(context, image, x, y, width, height) { const scale = Math.max(width / image.width, height / image.height), sourceWidth = width / scale, sourceHeight = height / scale, sourceX = (image.width - sourceWidth) / 2, sourceY = (image.height - sourceHeight) / 2; context.drawImage(image, sourceX, sourceY, sourceWidth, sourceHeight, x, y, width, height); }
async function downloadPostcard() { const original = el.downloadBtn.textContent; el.downloadBtn.disabled = true; el.downloadBtn.textContent = "Preparing…"; try { const [oldImage,newImage] = await Promise.all([loadImage(el.previewOld.src),loadImage(el.previewNew.src)]), canvas = document.createElement("canvas"), context = canvas.getContext("2d"); canvas.width = 1600; canvas.height = 1000; context.fillStyle = "#f2efe7"; context.fillRect(0,0,canvas.width,canvas.height); drawCover(context,oldImage,70,70,710,650); drawCover(context,newImage,820,70,710,650); context.fillStyle = "#17231f"; context.font = "700 24px Arial"; context.fillText("ALIGNED ARCHIVE",70,758); context.fillText("PRESENT",820,758); context.fillStyle = "#a54b38"; context.font = "700 22px Arial"; context.fillText("GUSU, PAST & PRESENT",70,830); context.fillStyle = "#17231f"; context.font = "700 52px Georgia"; context.fillText(selectedPlace.name,70,895); context.fillStyle = "#66716b"; context.font = "24px Arial"; context.fillText(selectedPlace.cn,70,935); context.textAlign = "right"; context.font = "20px Arial"; context.fillText("One corner · Two moments",1530,894); context.fillText(new Date().toLocaleDateString("en-GB",{day:"2-digit",month:"short",year:"numeric"}),1530,932); context.textAlign = "left"; canvas.toBlob(blob => { const url = URL.createObjectURL(blob), link = document.createElement("a"); link.href = url; link.download = `gusu-${selectedPlace.id}-postcard.png`; link.click(); setTimeout(() => URL.revokeObjectURL(url),1000); },"image/png"); } catch { alert("The postcard could not be created. Please try again."); } finally { el.downloadBtn.disabled = false; el.downloadBtn.textContent = original; } }
function finishVisit() {
  visited.add(selectedPlace.id);
  localStorage.setItem("gusu-visited", JSON.stringify([...visited]));
  updateVisited(); showPage("home"); selectPlace(selectedPlace);
  if (window.matchMedia("(min-width: 681px)").matches) setTimeout(() => el.placeCard.scrollIntoView({ behavior: "smooth", block: "center" }), 200);
  toast("Revisit marked complete on this device.");
}
function updateVisited() {
  el.visitedCount.textContent = `${visited.size} / ${places.length}`;
  document.querySelectorAll(".route-stop").forEach(card => {
    const done = visited.has(card.dataset.id);
    card.classList.toggle("is-visited", done);
    const status = card.querySelector(".route-status");
    if (status) status.textContent = done ? "✓ VISITED" : "○ NOT VISITED";
  });
  updateMarkerVisuals();
}

el.heroSlider.addEventListener("input", event => setCompare(Number(event.target.value),el.heroOldWrap,el.heroHandle));
el.tryDemoBtn.addEventListener("click", () => { $("hero-demo").scrollIntoView({behavior:"smooth",block:"center"}); $("hero-demo").animate([{transform:"scale(1)"},{transform:"scale(1.018)"},{transform:"scale(1)"}],{duration:700}); });
el.locateBtn.addEventListener("click",locateUser); el.remoteBtn.addEventListener("click",() => openRemote(selectedPlace)); el.startBtn.addEventListener("click",startField);
el.backHomeBtn.addEventListener("click",() => { stopCamera(); showPage("home"); setTimeout(() => el.placeCard.scrollIntoView({behavior:"smooth",block:"center"}),150); });
el.opacitySlider.addEventListener("input",event => setOpacity(event.target.value));
el.zoomSlider.addEventListener("input",event => { overlayState.scale = Number(event.target.value)/100; applyOverlayTransform(); });
el.rotationSlider.addEventListener("input",event => { overlayState.rotation = Number(event.target.value); applyOverlayTransform(); });
el.fitBtn.addEventListener("click",() => { overlayState.fit = overlayState.fit === "cover" ? "contain" : "cover"; applyOverlayTransform(); });
el.lockBtn.addEventListener("click",() => { overlayState.locked = !overlayState.locked; activePointers.clear(); applyOverlayTransform(); });
el.resetOverlayBtn.addEventListener("click",resetOverlay); el.cameraContainer.addEventListener("pointerdown",handleOverlayPointerDown); el.cameraContainer.addEventListener("pointermove",handleOverlayPointerMove); el.cameraContainer.addEventListener("pointerup",handleOverlayPointerEnd); el.cameraContainer.addEventListener("pointercancel",handleOverlayPointerEnd);
el.captureBtn.addEventListener("click",capturePhoto); el.uploadInput.addEventListener("change",handleUpload); el.referenceBtn.addEventListener("click",() => { referenceOnly = !referenceOnly; setOpacity(el.opacitySlider.value); el.referenceBtn.textContent = referenceOnly ? "Restore overlay" : "View archive"; });
el.oldPointStage.addEventListener("click",event => handlePointClick("old",event)); el.newPointStage.addEventListener("click",event => handlePointClick("new",event)); el.undoPointBtn.addEventListener("click",undoPoint); el.clearPointsBtn.addEventListener("click",clearPoints);
el.alignOpacitySlider.addEventListener("input",event => { el.warpCanvas.style.opacity = event.target.value; el.alignOpacityValue.value = `${Math.round(Number(event.target.value)*100)}%`; });
el.alignBackBtn.addEventListener("click",async () => { showPage("camera"); await startCamera(); }); el.skipAlignBtn.addEventListener("click",() => prepareResult(selectedPlace,fieldImageSrc,false,selectedPlace.oldPhoto)); el.confirmAlignBtn.addEventListener("click",confirmAlignment);
el.compareSlider.addEventListener("input",event => setCompare(Number(event.target.value),el.compareOldWrap,el.compareHandle));
el.previewBackBtn.addEventListener("click",() => { if (remoteMode) { showPage("home"); $("stories").scrollIntoView({behavior:"smooth"}); } else { showPage("align"); renderPointMarkers(); } });
el.retakeBtn.addEventListener("click",async () => { if (remoteMode) { showPage("home"); $("stories").scrollIntoView({behavior:"smooth"}); } else { showPage("camera"); await startCamera(); } });
el.downloadBtn.addEventListener("click",downloadPostcard); el.finishBtn.addEventListener("click",finishVisit); window.addEventListener("resize",renderPointMarkers); window.addEventListener("beforeunload",stopCamera); document.addEventListener("visibilitychange",() => { if (document.hidden && !pages.camera.classList.contains("hidden")) stopCamera(); });

buildStories(); buildRouteStops(); initMap(); updateVisited(); selectPlace(places[0]); setCompare(52,el.heroOldWrap,el.heroHandle); applyOverlayTransform(); updateAlignmentUI();




