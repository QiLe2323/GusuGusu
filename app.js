const imageVariant = (src, folder) => src.replace("images/", `images/${folder}/`).replace(/\.[^.]+$/, ".webp");
const makePlace = data => {
  const oldOriginal = data.oldPhoto, nowOriginal = data.nowPhoto;
  return {
    type: "URBAN MEMORY",
    storyTitle: `${data.name}: the same view, a changed city`,
    hook: `Compare the archival frame with the present-day photograph and follow the details that still anchor ${data.name}.`,
    description: `This matched pair returns to the recorded viewpoint at ${data.cn} and uses fixed architectural, street and waterside features to make change visible.`,
    shotTip: "Use the historic thumbnail as a framing guide. Match one strong vertical edge first, then the road, canal or roofline.",
    anchors: data.anchors || ["The main architectural edge", "The road or canal line", "The roofline and mature trees"],
    insight: data.insight || "The viewpoint remains legible even as the life around it changes.",
    detail: data.detail || "Compare building edges, vegetation, movement and the way public space meets the historic fabric.",
    query: `苏州市姑苏区${data.cn.split("·")[0]}`,
    ...data,
    oldOriginal,
    nowOriginal,
    oldPhoto: imageVariant(oldOriginal, "optimized"),
    nowPhoto: imageVariant(nowOriginal, "optimized"),
    thumbPhoto: imageVariant(oldOriginal, "thumbs")
  };
};

const places = [
  makePlace({ id:"liaojia", name:"Liaojia Lane", cn:"廖家巷", lat:31.3268207, lng:120.6073955, oldPhoto:"images/10002A-廖家巷-年代不详-苏州旧街巷图录.jpg", nowPhoto:"images/10002B-廖家巷-年代不详-苏州旧街巷图录-2024.jpg", oldCredit:"年代不详 · 选自《苏州旧街巷图录》", nowCredit:"2024 · 来源：古城阳面", focus:"The lane entrance, white wall and changing residential edge", anchors:["The lane opening on the left","The long white wall","The roofline behind the junction"] }),
  makePlace({ id:"beisi", name:"Beisi Pagoda", cn:"北寺塔", type:"CITY LANDMARK", lat:31.3231202, lng:120.6154597, oldPhoto:"images/20001A-北寺塔-1959-苏州旧街巷图录.jpg", nowPhoto:"images/20001B-北寺塔-1959-苏州旧街巷图录-2024.jpg", oldCredit:"1959 · 选自《苏州旧街巷图录》", nowCredit:"2024 · 来源：古城阳面", focus:"The pagoda silhouette and the road axis leading towards it", anchors:["The centreline of the pagoda","The lower temple roof","The road edges converging below"] }),
  makePlace({ id:"guanqian", name:"Guanqian Street", cn:"观前街", type:"COMMERCIAL STREET", lat:31.3132048, lng:120.6203610, oldPhoto:"images/20003A-观前街-1930年代-苏州通史.jpg", nowPhoto:"images/20003B-观前街-1930年代-苏州通史-2024.jpg", oldCredit:"1930年代 · 选自《苏州通史》", nowCredit:"2024 · 来源：古城阳面", focus:"The street's vanishing point, corner façades and changing crowd", anchors:["The street centreline","The left corner façade","The right-hand shopfront rhythm"] }),
  makePlace({ id:"lujia", name:"Lujia Lane", cn:"菉葭巷", type:"WATERWAY TRACE", lat:31.3176706, lng:120.6267512, oldPhoto:"images/20004A-菉葭巷-1950s-平江区志.jpg", nowPhoto:"images/20004B-菉葭巷-1950s-平江区志-2024.jpg", oldCredit:"1950年代 · 选自《平江区志》", nowCredit:"2024 · 来源：古城阳面", focus:"The former bridge and water edge beneath today's lane", anchors:["The lane's central axis","The large tree trunk","The building line on the right"] }),
  makePlace({ id:"miluo", name:"Miluo Pavilion", cn:"弥罗宝阁", type:"LOST ARCHITECTURE", lat:31.31465, lng:120.62250, oldPhoto:"images/20005A-弥罗宝阁-1905-影像苏州.jpg", nowPhoto:"images/20005B-弥罗宝阁-1905-影像苏州-20250809.jpg", oldCredit:"1905 · 选自《影像苏州》", nowCredit:"2025 · 来源：古城阳面", focus:"The vanished pavilion volume and the surviving temple enclosure", anchors:["The historic pavilion footprint","The enclosing wall","The framing roof corners"] }),
  makePlace({ id:"pingjiang", name:"Pingjiang Road", cn:"平江路", type:"CANAL LIFE", lat:31.3149294, lng:120.6296912, oldPhoto:"images/20006A-平江路-1988-比尔霍克.jpg", nowPhoto:"images/20006B-平江路-1988-比尔霍克-2024.jpg", oldCredit:"1988 · 摄影：比尔·霍克", nowCredit:"2024 · 来源：古城阳面", focus:"The canal edge, waterside houses and pedestrian path", anchors:["The canal's vanishing line","The waterside building wall","The path edge under the trees"] }),
  makePlace({ id:"xuanmiao", name:"Xuanmiao Temple Gate", cn:"玄妙观正山门", type:"TEMPLE FRONTAGE", lat:31.3143131, lng:120.6220290, oldPhoto:"images/20009A-玄妙观正山门-1949年前后-苏州旧街巷图录.jpg", nowPhoto:"images/20009B-玄妙观正山门-1949年前后-苏州旧街巷图录-2024.jpg", oldCredit:"1949年前后 · 选自《苏州旧街巷图录》", nowCredit:"2024 · 来源：古城阳面", focus:"The temple gate against the changing commercial frontage", anchors:["The temple eaves on the right","The open forecourt","The opposite building corner"] }),
  makePlace({ id:"xuanqiao", name:"Xuanqiao Lane", cn:"悬桥巷", type:"LANE FABRIC", lat:31.3164418, lng:120.6249365, oldPhoto:"images/20010A-悬桥巷-1958-苏州旧街巷图录.jpg", nowPhoto:"images/20010B-悬桥巷-1958-苏州旧街巷图录-2024.jpg", oldCredit:"1958 · 选自《苏州旧街巷图录》", nowCredit:"2024 · 来源：古城阳面", focus:"The narrow lane width, wall line and roof rhythm", anchors:["The lane's vanishing point","The right wall edge","The left roofline"] }),
  makePlace({ id:"anchashi", name:"Anchashi Yamen Screen Wall", cn:"按察使署照壁", type:"CIVIC MEMORY", lat:31.30070, lng:120.61620, oldPhoto:"images/30001A-按察使署照壁-年代不详-苏州旧街巷图录.jpg", nowPhoto:"images/30001B-按察使署照壁-年代不详-苏州旧街巷图录-2024.jpg", oldCredit:"年代不详 · 选自《苏州旧街巷图录》", nowCredit:"2024 · 来源：古城阳面", focus:"The circular gateway and the public street in front of the yamen", anchors:["The central gateway opening","The outer wall line","The mature trees framing the entrance"] }),
  makePlace({ id:"twinpagodas", name:"Twin Pagodas", cn:"双塔 · 定慧寺巷", type:"SKYLINE", lat:31.3088888, lng:120.6295591, oldPhoto:"images/40003A-双塔-贡院-定慧寺巷拍摄-1939年之前-苏州明信片图录p233.jpg", nowPhoto:"images/40003B2-双塔-贡院-定慧寺巷拍摄-20260801.jpg", oldCredit:"1939年以前 · 选自《苏州明信片图录》p.233", nowCredit:"2026 · 来源：古城阳面", focus:"The twin pagodas rising above the residential roofscape", anchors:["The two pagoda spires","The tiled roofs below","The large tree canopy"] }),
  makePlace({ id:"wuwang", name:"Wuwang Bridge", cn:"双塔吴王桥", type:"HISTORIC BRIDGE", lat:31.3084994, lng:120.6312141, oldPhoto:"images/40008A-双塔吴王桥-1953年之前-老苏州百年历程2.jpg", nowPhoto:"images/40008B-双塔吴王桥-1953年之前-20240910.jpg", oldCredit:"1953年以前 · 选自《老苏州百年历程2》", nowCredit:"2024 · 来源：古城阳面", focus:"The stone bridge profile, canal opening and adjoining houses", anchors:["The bridge parapet","The canal opening","The roofline behind the bridge"] }),
  makePlace({ id:"boxi", name:"Boxi Hospital", cn:"博习医院", type:"INSTITUTIONAL HERITAGE", lat:31.30155, lng:120.64260, oldPhoto:"images/40017A-博习医院-1922年后.jpg", nowPhoto:"images/40017B-博习医院-1922年后-2024.jpg", oldCredit:"1922年后 · 历史照片出处未标注", nowCredit:"2024 · 来源：古城阳面", focus:"The brick façade, projecting eaves and tree-lined hospital lane", anchors:["The building corner","The repeated window bays","The line of mature plane trees"] }),
  makePlace({ id:"shiquan", name:"Shiquan Street", cn:"十全街", type:"STREET LIFE", lat:31.3008050, lng:120.6258593, oldPhoto:"images/40027A-十全街-1980s-苏州旧街巷图录.jpg", nowPhoto:"images/40027B-十全街-1980s-苏州旧街巷图录-2024.jpg", oldCredit:"1980年代 · 选自《苏州旧街巷图录》", nowCredit:"2024 · 来源：古城阳面", focus:"The plane-tree canopy, storefront line and changing street use", anchors:["The road's vanishing point","The plane-tree trunks","The continuous shopfront edge"] }),
  makePlace({ id:"wuyachang", name:"Wuyachang Canal", cn:"十全街河 · 吴衙场", type:"CANAL EDGE", lat:31.3017537, lng:120.6350590, oldPhoto:"images/40028A-十全街河吴衙场-1980s-苏州旧街巷图录.jpg", nowPhoto:"images/40028B-十全街河吴衙场-1980s-苏州旧街巷图录-2024.jpg", oldCredit:"1980年代 · 选自《苏州旧街巷图录》", nowCredit:"2024 · 来源：古城阳面", focus:"The canal axis, white walls and rebuilt waterside façades", anchors:["The canal centreline","The right-hand eaves","The left wall edge"] }),
  makePlace({ id:"brickbridge", name:"Brick Bridge", cn:"十全河 · 砖桥 · 百步桥", type:"CANAL MEMORY", lat:31.3017563, lng:120.6369844, oldPhoto:"images/40029A-十全河-砖桥-百步桥向东拍摄-苏州旧住宅.jpg", nowPhoto:"images/40029B-十全河-砖桥-百步桥向东拍摄-苏州旧住宅-2024.jpg", oldCredit:"年代不详 · 选自《苏州旧住宅》", nowCredit:"2024 · 来源：古城阳面", focus:"The canal bend, waterside walls and tree canopy viewed east", anchors:["The canal's receding edge","The left residential wall","The overhanging trees"] }),
  makePlace({ id:"wuxianlibrary", name:"Wu County Library", cn:"吴县图书馆 · 大公园", type:"LOST LANDMARK", lat:31.3059618, lng:120.6224129, oldPhoto:"images/40034A-吴县图书馆-大公园-1934年-黄笃初.jpg", nowPhoto:"images/40034A-吴县图书馆-大公园-1934年-黄笃初-2024.jpg", oldCredit:"1934 · 摄影：黄笃初", nowCredit:"2024 · 来源：古城阳面", focus:"The park entrance and the absent mass of the former library", anchors:["The gate's central axis","The boundary wall","The open park ground behind"] }),
  makePlace({ id:"xingzao", name:"Xingzao Bridge", cn:"星造桥", type:"CANAL LIFE", lat:31.3014039, lng:120.6331779, oldPhoto:"images/40035A-星造桥-1970年-法国保罗·科克-影像苏州.jpg", nowPhoto:"images/40035B-星造桥-1970年-法国保罗·科克-影像苏州-2024.jpg", oldCredit:"1970 · 摄影：法国保罗·科克；选自《影像苏州》", nowCredit:"2024 · 来源：古城阳面", focus:"The canal, tiled roofs and the disappearance of everyday washing", anchors:["The canal centreline","The roof slope on the right","The opposing waterside walls"] }),
  makePlace({ id:"panmen", name:"Panmen Gate", cn:"盘门城楼 · 盘门市井", type:"CITY GATE", lat:31.2895554, lng:120.6119542, oldPhoto:"images/50014A-盘门城楼-盘门市井-影像苏州上p6.jpg", nowPhoto:"images/50014B-盘门城楼-盘门市井-影像苏州上p6-20260516.jpg", oldCredit:"年代不详 · 选自《影像苏州（上）》p.6", nowCredit:"2026 · 来源：古城阳面", focus:"The gate arch and tower after the market around it disappeared", anchors:["The centre of the gate arch","The upper tower roof","The masonry wall edges"] }),
  makePlace({ id:"jinmen", name:"Jinmen Gate", cn:"金门 · 新生活运动", type:"CITY GATE", lat:31.3126898, lng:120.6023948, oldPhoto:"images/50037A-金门-新生活运动-1934.jpg", nowPhoto:"images/50037B-金门-新生活运动-1934-2024.jpg", oldCredit:"1934 · 历史照片出处未标注", nowCredit:"2024 · 来源：古城阳面", focus:"The gate arch, corner building and transformed civic street", anchors:["The gate arch opening","The left corner building","The street edge leading through the gate"] }),
  makePlace({ id:"xumen", name:"Xumen Gate", cn:"胥门 · 瓮城内", type:"CITY GATE", lat:31.2995346, lng:120.6083074, oldPhoto:"images/50057A-胥门-瓮城内拍摄-1910-影像苏州p22.jpg", nowPhoto:"images/50057B-胥门-瓮城内拍摄-1910-影像苏州p22-20260815.jpg", oldCredit:"1910 · 选自《影像苏州》p.22", nowCredit:"2026 · 来源：古城阳面", focus:"The barbican arch, stonework and changing passage through the wall", anchors:["The arch opening","The lower stone courses","The inner passage centreline"] })
];

const $ = id => document.getElementById(id);
const pages = { home: $("home-page"), camera: $("camera-page"), align: $("align-page"), preview: $("preview-page") };
const el = {
  storyGrid: $("story-grid"), routeStops: $("route-stops"), placeCard: $("place-card"), oldPhoto: $("old-photo"), nowPhoto: $("now-photo"), placeIndex: $("place-index"), placeName: $("place-name"), placeCn: $("place-cn"), placeDesc: $("place-desc"), changeFocus: $("change-focus"), shotTip: $("shot-tip"), distanceBadge: $("distance-badge"), navLink: $("nav-link"), remoteBtn: $("remote-btn"), startBtn: $("start-btn"), locateBtn: $("locate-btn"), locationToast: $("location-toast"), tryDemoBtn: $("try-demo-btn"), heroSlider: $("hero-slider"), heroOldWrap: $("hero-old-wrap"), heroHandle: $("hero-handle"), themeOptions: $("theme-options"), walkOptions: $("walk-options"), walkDetail: $("walk-detail"), activeExploreLabel: $("active-explore-label"),
  camera: $("camera"), cameraContainer: document.querySelector(".camera-container"), overlayPhoto: $("overlay-photo"), cameraPlaceholder: $("camera-placeholder"), cameraError: $("camera-error"), cameraErrorText: $("camera-error-text"), opacitySlider: $("opacity-slider"), opacityValue: $("opacity-value"), zoomSlider: $("zoom-slider"), zoomValue: $("zoom-value"), rotationSlider: $("rotation-slider"), rotationValue: $("rotation-value"), fitBtn: $("fit-btn"), lockBtn: $("lock-btn"), resetOverlayBtn: $("reset-overlay-btn"), ghostModeLabel: $("ghost-mode-label"), segmentationStatus: $("segmentation-status"), captureBtn: $("capture-btn"), uploadInput: $("upload-input"), referenceBtn: $("reference-btn"), backHomeBtn: $("back-home-btn"), canvas: $("canvas"), cameraStep: $("camera-step"), cameraPlaceName: $("camera-place-name"), proximityStatus: $("proximity-status"), anchorList: $("anchor-list"),
  alignBackBtn: $("align-back-btn"), alignPlaceName: $("align-place-name"), pairCount: $("pair-count"), alignStepNumber: $("align-step-number"), alignInstructionTitle: $("align-instruction-title"), alignInstructionCopy: $("align-instruction-copy"), oldPointStage: $("old-point-stage"), newPointStage: $("new-point-stage"), alignOld: $("align-old"), alignNew: $("align-new"), oldPointLayer: $("old-point-layer"), newPointLayer: $("new-point-layer"), undoPointBtn: $("undo-point-btn"), clearPointsBtn: $("clear-points-btn"), alignmentReview: $("alignment-review"), reviewTitle: $("review-title"), alignmentQuality: $("alignment-quality"), alignPreviewNew: $("align-preview-new"), warpCanvas: $("warp-canvas"), alignOpacitySlider: $("align-opacity-slider"), alignOpacityValue: $("align-opacity-value"), skipAlignBtn: $("skip-align-btn"), confirmAlignBtn: $("confirm-align-btn"),
  previewOld: $("preview-old"), previewNew: $("preview-new"), previewPlaceName: $("preview-place-name"), previewBackBtn: $("preview-back-btn"), retakeBtn: $("retake-btn"), downloadBtn: $("download-btn"), finishBtn: $("finish-btn"), layerStackNote: $("layer-stack-note"), checkinTemplatePicker: $("checkin-template-picker"), compareStudio: $("compare-studio"), compareHint: $("compare-hint"), compareSlider: $("compare-slider"), compareOldWrap: $("compare-old-wrap"), compareHandle: $("compare-handle"), resultInsight: $("result-insight"), resultDetail: $("result-detail"), visitedCount: $("visited-count"), savedCount: $("saved-count"), savePlaceBtn: $("save-place-btn"), visitProof: $("visit-proof"), visitPhoto: $("visit-photo"), visitDate: $("visit-date"), collectionDrawer: $("collection-drawer"), collectionList: $("collection-list")
};

let selectedPlace = places[0], cameraStream = null, userPosition = null, userMarker = null, referenceOnly = false, remoteMode = false, map = null, fieldImageSrc = "";
const markers = new Map();
const visited = new Set(JSON.parse(localStorage.getItem("gusu-visited") || "[]"));
const savedPlaces = new Set(JSON.parse(localStorage.getItem("gusu-saved-route") || "[]"));
const visitRecords = JSON.parse(localStorage.getItem("gusu-visit-records") || "{}");
visited.forEach(id => { if (!visitRecords[id]) visitRecords[id] = { date:new Date().toISOString(), photo:"" }; });
Object.keys(visitRecords).forEach(id => visited.add(id));
localStorage.setItem("gusu-visited", JSON.stringify([...visited])); localStorage.setItem("gusu-visit-records", JSON.stringify(visitRecords));
const pointColors = ["#b84937", "#187567", "#c38b26", "#315aa0", "#8b4da0", "#227c9d"];
const overlayState = { x: 0, y: 0, scale: 1, rotation: 0, fit: "cover", locked: false };
const activePointers = new Map();
let pinchStart = null;
const alignment = { pairs: [], pending: null, oldImage: null, newImage: null, homography: null };
let comparisonMode = "reveal", blinkTimer = null, blinkVisible = true;
let heroCompareMode = "reveal", heroBlinkTimer = null, heroBlinkVisible = true;
const formatIndex = index => String(index + 1).padStart(2, "0");
const fieldCredit = () => `${new Date().getFullYear()} · Your field photograph`;
const featuredPlaces = ["guanqian", "pingjiang", "panmen"].map(id => places.find(place => place.id === id));
const placeThemes = [
  { id:"water", name:"水巷与桥", description:"沿河道、桥梁与水岸生活寻找姑苏", ids:["lujia","pingjiang","wuwang","wuyachang","brickbridge","xingzao"] },
  { id:"streets", name:"街巷生活", description:"看商业街、居民巷与日常空间的变化", ids:["liaojia","guanqian","xuanqiao","shiquan","anchashi"] },
  { id:"landmarks", name:"城门与地标", description:"寻找城门、寺观、塔楼与公共建筑", ids:["beisi","miluo","xuanmiao","twinpagodas","boxi","wuxianlibrary","panmen","jinmen","xumen"] }
];
const curatedRoutes = [
  { id:"shiquan-water", name:"十全水巷漫步", description:"从十全街走入河巷与桥边生活", distance:"约 1.7 km", duration:"约 40 分钟", ids:["shiquan","wuyachang","xingzao","brickbridge"] },
  { id:"pingjiang-memory", name:"平江旧影线", description:"从观前街走向平江路，串起寺观与街巷", distance:"约 2.5 km", duration:"约 55 分钟", ids:["guanqian","xuanmiao","miluo","xuanqiao","pingjiang","lujia"] },
  { id:"city-gates", name:"城门记忆线", description:"沿古城西南边界寻找三座城门", distance:"约 3.8 km", duration:"约 70 分钟", ids:["jinmen","xumen","panmen"] }
];
let activeBrowseIds = null, activeCuratedRoute = null, activeThemeId = "all";
function loadDesktopImages() { if (!window.matchMedia("(min-width: 681px)").matches) return; document.querySelectorAll("img[data-desktop-src]").forEach(image => { if (!image.src) image.src = image.dataset.desktopSrc; }); }
const onboardingSteps = [
  { icon:"⌖", kicker:"STEP 1 · DISCOVER", title:"Choose a photograph on the map.", copy:"Every thumbnail marks the viewpoint where an archival photograph was taken. Tap one to preview the place and its framing clues." },
  { icon:"◎", kicker:"STEP 2 · REPHOTOGRAPH", title:"Stand there and find the old frame.", copy:"Open the camera, match a roofline or street edge, then adjust the ghost photograph until the two moments line up." },
  { icon:"✓", kicker:"STEP 3 · COLLECT", title:"Complete the visit and keep the proof.", copy:"Your date and field photograph stay on this device. Revisited places turn green and receive a completion stamp." }
];
let onboardingIndex = 0;
let cameraFacingMode = "user";
let selfieSegmenterPromise = null;
let segmentationResolve = null;
let segmentationReject = null;
let isLayeredCheckin = false;
let activeCheckinTemplate = "split";
let layeredCheckinAssets = null;

function formatVisitDate(value) { return new Date(value).toLocaleDateString("en-GB", { day:"numeric", month:"short", year:"numeric" }); }
function persistSavedPlaces() { localStorage.setItem("gusu-saved-route", JSON.stringify([...savedPlaces])); }
function persistVisitRecords() { localStorage.setItem("gusu-visit-records", JSON.stringify(visitRecords)); }
function renderOnboardingStep() {
  const step = onboardingSteps[onboardingIndex];
  $("onboarding-visual").textContent = step.icon; $("onboarding-kicker").textContent = step.kicker; $("onboarding-title").textContent = step.title; $("onboarding-copy").textContent = step.copy;
  $("onboarding-dots").innerHTML = onboardingSteps.map((_, index) => `<i class="${index === onboardingIndex ? "is-active" : ""}"></i>`).join("");
  $("onboarding-next").innerHTML = onboardingIndex === onboardingSteps.length - 1 ? "Explore the map <span>→</span>" : "Next <span>→</span>";
}
function openOnboarding() { onboardingIndex = 0; renderOnboardingStep(); $("onboarding").classList.remove("hidden"); document.body.classList.add("modal-open"); }
function closeOnboarding() { $("onboarding").classList.add("hidden"); document.body.classList.remove("modal-open"); localStorage.setItem("gusu-onboarding-complete", "1"); setTimeout(() => map?.resize(), 80); }
function advanceOnboarding() { if (onboardingIndex < onboardingSteps.length - 1) { onboardingIndex += 1; renderOnboardingStep(); } else closeOnboarding(); }

function visitStatus(place) {
  const record = visitRecords[place.id];
  if (!record) return { label:"○ NOT VISITED", detail:"Visit to unlock your stamp" };
  return { label:"✓ REVISITED", detail:formatVisitDate(record.date) };
}
function updateSavedButton() {
  const saved = savedPlaces.has(selectedPlace.id);
  el.savePlaceBtn.classList.toggle("is-saved", saved); el.savePlaceBtn.setAttribute("aria-pressed", saved); el.savePlaceBtn.textContent = saved ? "♥ Saved to route" : "♡ Save to route";
}
function toggleSaved(place = selectedPlace) {
  if (savedPlaces.has(place.id)) savedPlaces.delete(place.id); else savedPlaces.add(place.id);
  persistSavedPlaces(); updateSavedButton(); updateCollection(); updateMapSelectionCard(selectedPlace); toast(savedPlaces.has(place.id) ? `${place.name} added to your route.` : `${place.name} removed from your route.`);
}
function updateRouteLine() {
  if (!map?.getSource("saved-route")) return;
  const points = [...savedPlaces].map(id => places.find(place => place.id === id)).filter(Boolean);
  map.getSource("saved-route").setData({ type:"Feature", geometry:{ type:"LineString", coordinates:points.map(place => [place.lng, place.lat]) } });
}
function renderCollection() {
  const routePlaces = [...savedPlaces].map(id => places.find(place => place.id === id)).filter(Boolean);
  $("collection-saved-total").textContent = routePlaces.length; $("collection-visited-total").textContent = visited.size;
  if (!routePlaces.length) {
    el.collectionList.innerHTML = `<div class="collection-empty"><span>♡</span><strong>Your route is empty.</strong><p>Save archival photographs from the map to build a personal Gusu walk.</p></div>`;
  } else {
    el.collectionList.innerHTML = routePlaces.map((place, index) => { const status = visitStatus(place), record = visitRecords[place.id]; return `<article class="collection-item ${record ? "is-visited" : ""}" data-id="${place.id}"><span class="collection-order">${String(index + 1).padStart(2,"0")}</span><img src="${record?.photo || place.thumbPhoto}" loading="lazy" decoding="async" alt=""><div><small>${status.label}</small><strong>${place.name}</strong><span>${place.cn} · ${status.detail}</span></div><button type="button" aria-label="Remove ${place.name} from route">×</button></article>`; }).join("");
    el.collectionList.querySelectorAll(".collection-item").forEach(item => {
      item.addEventListener("click", event => { const place = places.find(candidate => candidate.id === item.dataset.id); if (event.target.tagName === "BUTTON") { toggleSaved(place); renderCollection(); return; } closeCollection(); selectPlace(place, false, true); });
    });
  }
  $("show-route-btn").disabled = routePlaces.length === 0; $("clear-route-btn").disabled = routePlaces.length === 0;
}
function updateCollection() { el.savedCount.textContent = `${savedPlaces.size} saved`; $("open-route-btn").classList.toggle("is-active", savedPlaces.size > 0); renderCollection(); updateRouteLine(); }
function openCollection() { renderCollection(); el.collectionDrawer.classList.remove("hidden"); document.body.classList.add("modal-open"); }
function closeCollection() { el.collectionDrawer.classList.add("hidden"); document.body.classList.remove("modal-open"); }
function showSavedRoute() {
  const routePlaces = [...savedPlaces].map(id => places.find(place => place.id === id)).filter(Boolean); if (!routePlaces.length) return;
  closeCollection(); showPage("home"); const bounds = new maplibregl.LngLatBounds(); routePlaces.forEach(place => bounds.extend([place.lng, place.lat])); map.fitBounds(bounds, { padding:{ top:85, right:45, bottom:155, left:45 }, maxZoom:16, duration:650 }); selectPlace(routePlaces[0], false, false); toast(`${routePlaces.length}-stop route shown in saved order.`);
}

function placesFromIds(ids) { return ids.map(id => places.find(place => place.id === id)).filter(Boolean); }
function fitDiscoveryPlaces(routePlaces) {
  if (!map || !routePlaces.length) return;
  const bounds = new maplibregl.LngLatBounds(); routePlaces.forEach(place => bounds.extend([place.lng, place.lat]));
  map.fitBounds(bounds, { padding:{ top:90, right:55, bottom:165, left:55 }, maxZoom:15.8, duration:650 });
}
function updateCuratedRouteLine() {
  if (!map?.getSource("curated-route")) return;
  const routePlaces = activeCuratedRoute ? placesFromIds(activeCuratedRoute.ids) : [];
  const features = routePlaces.length > 1 ? [{ type:"Feature", geometry:{ type:"LineString", coordinates:routePlaces.map(place => [place.lng, place.lat]) } }] : [];
  map.getSource("curated-route").setData({ type:"FeatureCollection", features });
}
function updateExploreLabel(label) {
  el.activeExploreLabel.textContent = label || "";
  el.activeExploreLabel.classList.toggle("hidden", !label);
}
function applyDiscoverySelection(ids, label, route = null) {
  activeBrowseIds = ids ? new Set(ids) : null; activeCuratedRoute = route;
  updateMarkerVisuals(); updateCuratedRouteLine(); updateExploreLabel(label);
  const selected = ids ? placesFromIds(ids) : places;
  if (selected.length) { selectPlace(selected[0], false, false); fitDiscoveryPlaces(selected); }
}
function setDiscoveryMode(mode) {
  const themesActive = mode === "themes";
  $("themes-tab").classList.toggle("is-active", themesActive); $("walks-tab").classList.toggle("is-active", !themesActive);
  $("themes-tab").setAttribute("aria-selected", themesActive); $("walks-tab").setAttribute("aria-selected", !themesActive);
  $("themes-panel").classList.toggle("hidden", !themesActive); $("walks-panel").classList.toggle("hidden", themesActive);
  if (themesActive) {
    el.walkDetail.classList.add("hidden"); document.querySelectorAll(".walk-card").forEach(card => card.classList.remove("is-active"));
    const theme = placeThemes.find(item => item.id === activeThemeId); applyDiscoverySelection(theme?.ids || null, theme ? `主题 · ${theme.name}` : "");
  } else if (activeCuratedRoute) {
    applyDiscoverySelection(activeCuratedRoute.ids, `路线 · ${activeCuratedRoute.name}`, activeCuratedRoute);
  } else {
    applyDiscoverySelection(null, "");
  }
}
function selectTheme(themeId) {
  activeThemeId = themeId; activeCuratedRoute = null;
  document.querySelectorAll(".theme-chip").forEach(button => button.classList.toggle("is-active", button.dataset.themeId === themeId));
  const theme = placeThemes.find(item => item.id === themeId); applyDiscoverySelection(theme?.ids || null, theme ? `主题 · ${theme.name}` : "");
}
function renderWalkDetail(route) {
  const routePlaces = placesFromIds(route.ids);
  el.walkDetail.innerHTML = `<div class="walk-detail-head"><div><strong>${route.name}</strong><small>${route.description} · ${route.distance} · ${route.duration}</small></div><button id="start-curated-route" type="button">从第 1 站开始 →</button></div><div class="walk-sequence">${routePlaces.map((place,index) => `${index ? '<i class="walk-arrow">→</i>' : ''}<button class="walk-stop" type="button" data-id="${place.id}"><b>${index + 1}</b>${place.cn.split("·")[0]}</button>`).join("")}</div>`;
  el.walkDetail.classList.remove("hidden");
  el.walkDetail.querySelectorAll(".walk-stop").forEach(button => button.addEventListener("click", () => selectPlace(places.find(place => place.id === button.dataset.id), true)));
  $("start-curated-route").addEventListener("click", () => { selectPlace(routePlaces[0], true); toast(`${route.name}：第 1 站 ${routePlaces[0].cn}`); });
}
function selectCuratedRoute(routeId) {
  const route = curatedRoutes.find(item => item.id === routeId); if (!route) return;
  activeCuratedRoute = route; activeBrowseIds = new Set(route.ids);
  document.querySelectorAll(".walk-card").forEach(card => card.classList.toggle("is-active", card.dataset.routeId === routeId));
  renderWalkDetail(route); applyDiscoverySelection(route.ids, `路线 · ${route.name}`, route);
}
function renderDiscoveryBrowser() {
  el.themeOptions.innerHTML = `<button class="theme-chip is-active" type="button" data-theme-id="all"><strong>全部点位</strong><small>浏览古城中的全部历史影像</small><em>${places.length} 个地点</em></button>${placeThemes.map(theme => `<button class="theme-chip" type="button" data-theme-id="${theme.id}"><strong>${theme.name}</strong><small>${theme.description}</small><em>${theme.ids.length} 个地点</em></button>`).join("")}`;
  el.walkOptions.innerHTML = curatedRoutes.map(route => `<button class="walk-card" type="button" data-route-id="${route.id}"><strong>${route.name}</strong><small>${route.description}</small><span class="walk-meta"><i>${route.ids.length} 站</i><i>${route.distance}</i><i>${route.duration}</i></span></button>`).join("");
  el.themeOptions.querySelectorAll(".theme-chip").forEach(button => button.addEventListener("click", () => selectTheme(button.dataset.themeId)));
  el.walkOptions.querySelectorAll(".walk-card").forEach(button => button.addEventListener("click", () => selectCuratedRoute(button.dataset.routeId)));
  $("themes-tab").addEventListener("click", () => setDiscoveryMode("themes")); $("walks-tab").addEventListener("click", () => setDiscoveryMode("walks"));
}

function setCompare(value, wrap, handle) { wrap.style.clipPath = `inset(0 ${100 - value}% 0 0)`; handle.style.left = `${value}%`; }
function stopBlinkComparison() { if (blinkTimer) clearInterval(blinkTimer); blinkTimer = null; blinkVisible = true; if (el.compareOldWrap) el.compareOldWrap.style.opacity = 1; const button = $("blink-toggle"); if (button) button.textContent = "Play flashback"; }
function startBlinkComparison() { stopBlinkComparison(); $("blink-toggle").textContent = "Pause flashback"; blinkTimer = setInterval(() => { blinkVisible = !blinkVisible; el.compareOldWrap.style.opacity = blinkVisible ? 1 : 0; }, 720); }
function setLensPosition(x, y) { el.compareOldWrap.style.clipPath = `circle(22% at ${x}% ${y}%)`; const lens = $("lens-outline"); lens.style.left = `${x}%`; lens.style.top = `${y}%`; }
function setCompareMode(mode) {
  stopBlinkComparison(); comparisonMode = mode; $("compare-stage").dataset.mode = mode;
  document.querySelectorAll("[data-compare-mode]").forEach(button => { const active = button.dataset.compareMode === mode; button.classList.toggle("is-active", active); button.setAttribute("aria-pressed", active); });
  document.querySelector(".studio-control-row").classList.toggle("has-control", mode === "fade" || mode === "blink");
  $("comparison-opacity-control").classList.toggle("hidden", mode !== "fade");
  $("blink-toggle").classList.toggle("hidden", mode !== "blink");
  el.compareOldWrap.style.transition = mode === "blink" ? "opacity .18s ease" : "";
  if (mode === "reveal") { el.compareOldWrap.style.opacity = 1; setCompare(Number(el.compareSlider.value), el.compareOldWrap, el.compareHandle); $("compare-hint").textContent = "Drag across the image to reveal what changed — and what remained."; }
  if (mode === "fade") { el.compareOldWrap.style.clipPath = "inset(0)"; el.compareOldWrap.style.opacity = $("comparison-opacity").value; $("compare-hint").textContent = "Adjust archival visibility to inspect whether rooflines, streets and waterways still align."; }
  if (mode === "lens") { el.compareOldWrap.style.opacity = 1; setLensPosition(50, 50); $("compare-hint").textContent = "Move the time lens over the photograph to inspect one surviving detail at a time."; }
  if (mode === "blink") { el.compareOldWrap.style.clipPath = "inset(0)"; $("compare-hint").textContent = "Flashback alternates past and present, making small shifts in edges and massing easier to notice."; startBlinkComparison(); }
}
function updateTimeLens(event) { if (comparisonMode !== "lens") return; const rect = $("compare-stage").getBoundingClientRect(), x = Math.max(0, Math.min(100, (event.clientX - rect.left) / rect.width * 100)), y = Math.max(0, Math.min(100, (event.clientY - rect.top) / rect.height * 100)); setLensPosition(x, y); }
function stopHeroBlink() { if (heroBlinkTimer) clearInterval(heroBlinkTimer); heroBlinkTimer = null; heroBlinkVisible = true; el.heroOldWrap.style.opacity = 1; $("hero-blink-toggle").textContent = "Play flashback"; }
function startHeroBlink() { stopHeroBlink(); $("hero-blink-toggle").textContent = "Pause flashback"; heroBlinkTimer = setInterval(() => { heroBlinkVisible = !heroBlinkVisible; el.heroOldWrap.style.opacity = heroBlinkVisible ? 1 : 0; }, 720); }
function setHeroLensPosition(x, y) { el.heroOldWrap.style.clipPath = `circle(22% at ${x}% ${y}%)`; const lens = $("hero-lens-outline"); lens.style.left = `${x}%`; lens.style.top = `${y}%`; }
function setHeroMode(mode) {
  stopHeroBlink(); heroCompareMode = mode; $("hero-stage").dataset.mode = mode;
  document.querySelectorAll("[data-hero-mode]").forEach(button => { const active = button.dataset.heroMode === mode; button.classList.toggle("is-active", active); button.setAttribute("aria-pressed", active); });
  $("hero-control-row").classList.toggle("has-control", mode === "fade" || mode === "blink");
  $("hero-opacity-control").classList.toggle("hidden", mode !== "fade");
  $("hero-blink-toggle").classList.toggle("hidden", mode !== "blink");
  el.heroOldWrap.style.transition = mode === "blink" ? "opacity .18s ease" : "";
  if (mode === "reveal") { el.heroOldWrap.style.opacity = 1; setCompare(Number(el.heroSlider.value), el.heroOldWrap, el.heroHandle); $("hero-hint").textContent = "1930s → 2024 · Drag to reveal the changing street."; }
  if (mode === "fade") { el.heroOldWrap.style.clipPath = "inset(0)"; el.heroOldWrap.style.opacity = $("hero-opacity").value; $("hero-hint").textContent = "1930s → 2024 · Adjust the ghost image to check alignment."; }
  if (mode === "lens") { el.heroOldWrap.style.opacity = 1; setHeroLensPosition(50, 50); $("hero-hint").textContent = "1930s → 2024 · Move the time lens across surviving details."; }
  if (mode === "blink") { el.heroOldWrap.style.clipPath = "inset(0)"; $("hero-hint").textContent = "1930s → 2024 · Flash between the two moments."; startHeroBlink(); }
}
function updateHeroLens(event) { if (heroCompareMode !== "lens") return; const rect = $("hero-stage").getBoundingClientRect(), x = Math.max(0, Math.min(100, (event.clientX - rect.left) / rect.width * 100)), y = Math.max(0, Math.min(100, (event.clientY - rect.top) / rect.height * 100)); setHeroLensPosition(x, y); }
function buildStories() {
  featuredPlaces.forEach(place => {
    const index = places.indexOf(place), card = document.createElement("article");
    card.className = "story-card"; card.dataset.id = place.id;
    card.innerHTML = `<div class="story-image"><img data-desktop-src="${place.oldPhoto}" loading="lazy" decoding="async" alt="Archival view of ${place.name}"><span class="story-number">${formatIndex(index)}</span><span class="story-era">ARCHIVE</span><span class="story-source">${place.oldCredit}</span></div><div class="story-body"><span class="story-type">${place.type}</span><h3>${place.storyTitle}</h3><div class="story-cn">${place.name} · ${place.cn}</div><p class="story-hook">${place.hook}</p><div class="story-actions"><button class="story-preview" type="button">See the change</button><button class="story-route" type="button">Find on map ↓</button></div></div>`;
    card.querySelector(".story-preview").addEventListener("click", () => openRemote(place));
    card.querySelector(".story-route").addEventListener("click", () => { selectPlace(place); $("route").scrollIntoView({ behavior: "smooth" }); });
    el.storyGrid.appendChild(card);
  });
  const updatePosition = () => { const width = el.storyGrid.clientWidth || 1, index = Math.max(0, Math.min(featuredPlaces.length - 1, Math.round(el.storyGrid.scrollLeft / width))); $("story-position").textContent = `${index + 1} / ${featuredPlaces.length}`; };
  const moveStory = direction => { const width = el.storyGrid.clientWidth || 1, index = Math.round(el.storyGrid.scrollLeft / width), next = (index + direction + featuredPlaces.length) % featuredPlaces.length; el.storyGrid.scrollTo({ left: next * width, behavior: "smooth" }); };
  $("story-prev").addEventListener("click", () => moveStory(-1));
  $("story-next").addEventListener("click", () => moveStory(1));
  el.storyGrid.addEventListener("scroll", updatePosition, { passive: true });
}
function buildRouteStops() {
  const card = document.createElement("article");
  card.className = "route-stop map-selection-card";
  card.innerHTML = `<button class="route-stop-main" type="button"><span class="route-thumb"><img alt=""><i class="route-stamp">DONE</i></span><span class="route-stop-copy"><small class="route-status"></small><strong></strong><span class="route-name-cn"></span><span class="route-credit"></span><span class="route-visit-date"></span></span></button><div class="route-stop-actions"><button class="route-save" type="button" aria-label="Save this place">♡</button><button class="route-preview" type="button">看古今</button><button class="route-capture" type="button">合影打卡</button></div>`;
  card.querySelector(".route-stop-main").addEventListener("click", () => selectPlace(selectedPlace, true));
  card.querySelector(".route-preview").addEventListener("click", () => openRemote(selectedPlace));
  card.querySelector(".route-capture").addEventListener("click", () => startField());
  card.querySelector(".route-save").addEventListener("click", () => toggleSaved(selectedPlace));
  el.routeStops.appendChild(card);
}
function updateMapSelectionCard(place) {
  const card = el.routeStops.querySelector(".route-stop"); if (!card) return;
  const record = visitRecords[place.id], saved = savedPlaces.has(place.id), status = visitStatus(place);
  card.dataset.id = place.id; card.classList.toggle("is-visited", Boolean(record)); card.classList.toggle("is-saved", saved);
  card.querySelector(".route-stop-main").setAttribute("aria-label", `Open ${place.name}. ${place.oldCredit}`);
  card.querySelector("img").src = place.thumbPhoto;
  card.querySelector(".route-status").textContent = status.label;
  card.querySelector("strong").textContent = place.name;
  card.querySelector(".route-name-cn").textContent = place.cn;
  card.querySelector(".route-credit").textContent = place.oldCredit;
  card.querySelector(".route-visit-date").textContent = record ? `Completed ${formatVisitDate(record.date)}` : "";
  card.querySelector(".route-save").textContent = saved ? "♥" : "♡";
  card.querySelector(".route-save").setAttribute("aria-label", saved ? `Remove ${place.name} from saved route` : `Save ${place.name} to route`);
}

const SUZHOU_BOUNDS = [[119.90, 30.75], [121.35, 32.10]];
const GUSU_MAP_BOUNDS = [[120.585, 31.27], [120.665, 31.345]];
function isInsideBounds(position, bounds) { return position.lng >= bounds[0][0] && position.lng <= bounds[1][0] && position.lat >= bounds[0][1] && position.lat <= bounds[1][1]; }
function isInsideSuzhou(position) { return isInsideBounds(position, SUZHOU_BOUNDS); }
function isInsideGusuMap(position) { return isInsideBounds(position, GUSU_MAP_BOUNDS); }
function createPinElement(index, place) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = "place-pin photo-pin";
  button.setAttribute("aria-label", `${place.name}, archival photograph, ${place.oldCredit}, ${visited.has(place.id) ? "visited" : "not visited"}`);
  button.innerHTML = `<span class="photo-pin-frame"><img src="${place.thumbPhoto}" alt="" decoding="async" draggable="false"></span><b class="photo-pin-badge" aria-hidden="true">${visited.has(place.id) ? "✓" : ""}</b>`;
  button.addEventListener("click", event => { event.stopPropagation(); selectPlace(place, true); });
  return button;
}
function updateMarkerVisuals() {
  places.forEach((place, index) => {
    const marker = markers.get(place.id);
    if (!marker) return;
    const node = marker.getElement();
    const isVisited = visited.has(place.id);
    const curatedIndex = activeCuratedRoute ? activeCuratedRoute.ids.indexOf(place.id) : -1;
    node.classList.toggle("is-active", place.id === selectedPlace.id);
    node.classList.toggle("is-visited", isVisited);
    node.classList.toggle("is-filtered-out", Boolean(activeBrowseIds) && !activeBrowseIds.has(place.id));
    node.classList.toggle("is-curated-stop", curatedIndex >= 0);
    node.querySelector(".photo-pin-badge").textContent = curatedIndex >= 0 ? String(curatedIndex + 1) : (isVisited ? "✓" : "");
    node.setAttribute("aria-label", `${place.name}, archival photograph, ${place.oldCredit}, ${isVisited ? "visited" : "not visited"}`);
  });
}function initMap() {
  map = new maplibregl.Map({
    container: "map",
    style: "https://tiles.openfreemap.org/styles/positron",
    center: [120.6245, 31.31],
    zoom: 14,
    minZoom: 12.4,
    maxZoom: 18,
    maxBounds: SUZHOU_BOUNDS,
    attributionControl: false
  });
  map.scrollZoom.disable();
  map.addControl(new maplibregl.NavigationControl({ showCompass: false }), "bottom-right");
  map.addControl(new maplibregl.AttributionControl({ compact: true }), "top-right");
  const collapseAttribution = () => { const panel = document.querySelector(".maplibregl-ctrl-attrib"); if (panel?.tagName === "DETAILS") panel.open = false; };
  requestAnimationFrame(collapseAttribution);
  map.once("idle", collapseAttribution);
  const updateMarkerScale = () => $("map").classList.toggle("markers-compact", map.getZoom() < 14.2);
  map.on("load", () => {
    updateMarkerScale();
    map.addSource("saved-route", { type:"geojson", data:{ type:"Feature", geometry:{ type:"LineString", coordinates:[] } } });
    map.addLayer({ id:"saved-route-halo", type:"line", source:"saved-route", paint:{ "line-color":"#fffaf0", "line-width":7, "line-opacity":.9 } });
    map.addLayer({ id:"saved-route-line", type:"line", source:"saved-route", paint:{ "line-color":"#a54b38", "line-width":3, "line-dasharray":[1.2,1.2] } });
    map.addSource("curated-route", { type:"geojson", data:{ type:"FeatureCollection", features:[] } });
    map.addLayer({ id:"curated-route-halo", type:"line", source:"curated-route", paint:{ "line-color":"#fffaf0", "line-width":9, "line-opacity":.92 } });
    map.addLayer({ id:"curated-route-line", type:"line", source:"curated-route", paint:{ "line-color":"#173f34", "line-width":5, "line-opacity":.95 } });
    updateRouteLine();
    updateCuratedRouteLine();
  });
  map.on("zoom", updateMarkerScale);
  places.forEach((place, index) => {
    const node = createPinElement(index, place);
    const marker = new maplibregl.Marker({ element: node, anchor: "center" }).setLngLat([place.lng, place.lat]).addTo(map);
    markers.set(place.id, marker);
  });
  const bounds = new maplibregl.LngLatBounds();
  places.forEach(place => bounds.extend([place.lng, place.lat]));
  map.fitBounds(bounds, { padding: { top: 80, right: 24, bottom: 145, left: 24 }, maxZoom: 12.5, duration: 0 });
}
function selectPlace(place, scroll = false, moveMap = true) {
  selectedPlace = place;
  updateMarkerVisuals();
  updateMapSelectionCard(place);
  const index = places.indexOf(place);
  if (window.matchMedia("(min-width: 681px)").matches) { el.oldPhoto.src = place.oldPhoto; el.nowPhoto.src = place.nowPhoto; }
  el.placeIndex.textContent = `VIEWPOINT ${formatIndex(index)} · ${place.type}`;
  $("old-credit").textContent = place.oldCredit; $("now-credit").textContent = place.nowCredit;
  el.placeName.textContent = place.name; el.placeCn.textContent = place.cn; el.placeDesc.textContent = place.description;
  el.changeFocus.textContent = place.focus; el.shotTip.textContent = place.shotTip;
  el.navLink.href = `https://uri.amap.com/search?keyword=${encodeURIComponent(place.query)}&city=苏州&callnative=1`;
  el.placeCard.classList.remove("hidden");
  const record = visitRecords[place.id]; el.visitProof.classList.toggle("hidden", !record); el.visitPhoto.classList.toggle("hidden", !record?.photo); if (record) { el.visitPhoto.src = record.photo || place.nowPhoto; el.visitDate.textContent = `Completed ${formatVisitDate(record.date)}`; }
  updateSavedButton();
  updateDistance();
  if (moveMap) map?.flyTo({ center: [place.lng, place.lat], zoom: 16, duration: 650, essential: true });
  if (scroll && window.matchMedia("(min-width: 681px)").matches) setTimeout(() => el.placeCard.scrollIntoView({ behavior: "smooth", block: "center" }), 300);
}function showPage(name) { if (name !== "preview") stopBlinkComparison(); if (name !== "home") stopHeroBlink(); Object.entries(pages).forEach(([key, page]) => page.classList.toggle("hidden", key !== name)); window.scrollTo({ top: 0, behavior: "smooth" }); if (name === "home") setTimeout(() => map?.resize(), 120); }
function distanceMeters(a, b) { const rad = value => value * Math.PI / 180, dLat = rad(b.lat - a.lat), dLng = rad(b.lng - a.lng), x = Math.sin(dLat / 2) ** 2 + Math.cos(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.sin(dLng / 2) ** 2; return 6371000 * 2 * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x)); }
const formatDistance = distance => distance < 1000 ? `About ${Math.round(distance / 10) * 10} m away` : `About ${(distance / 1000).toFixed(1)} km away`;
function updateDistance() { if (!userPosition) { el.distanceBadge.textContent = "Locate yourself to see distance"; el.proximityStatus.querySelector("b").textContent = "Location optional"; return; } const distance = distanceMeters(userPosition, selectedPlace); el.distanceBadge.textContent = formatDistance(distance); el.proximityStatus.classList.toggle("is-far", distance > 120); el.proximityStatus.querySelector("b").textContent = distance <= 120 ? "Within the suggested viewpoint" : formatDistance(distance); }
function toast(message) { el.locationToast.textContent = message; el.locationToast.classList.remove("hidden"); clearTimeout(toast.timer); toast.timer = setTimeout(() => el.locationToast.classList.add("hidden"), 3800); }
function locateUser() {
  if (!navigator.geolocation) { toast("Location is unavailable here. You can still explore every story."); return; }
  clearTimeout(resetLocate.timer);
  el.locateBtn.disabled = true; el.locateBtn.innerHTML = "<span>⌖</span> Locating…";
  navigator.geolocation.getCurrentPosition(position => {
    const positionFound = { lat: position.coords.latitude, lng: position.coords.longitude };
    userMarker?.remove(); userMarker = null;
    if (!isInsideSuzhou(positionFound)) { resetLocate(); return; }
    userPosition = positionFound;
    const node = document.createElement("div"); node.className = "user-pin"; node.setAttribute("aria-label", "Your location in Suzhou");
    userMarker = new maplibregl.Marker({ element: node, anchor:"center" }).setLngLat([userPosition.lng, userPosition.lat]).addTo(map);
    const inGusu = isInsideGusuMap(userPosition), nearest = places.reduce((best, place) => distanceMeters(userPosition, place) < best.distance ? { place, distance:distanceMeters(userPosition, place) } : best, { place:places[0], distance:Infinity });
    map.flyTo({ center:[userPosition.lng, userPosition.lat], zoom:inGusu ? 16 : 12.5, duration:700, essential:true });
    updateDistance(); resetLocate(true);
    toast(inGusu ? "Located in Gusu. Viewpoint distances are now live." : `Located in Suzhou · nearest archive viewpoint is ${formatDistance(nearest.distance).replace("About ", "")} away.`);
  }, error => { toast(error.code === 1 ? "Location permission was not granted. The remote experience still works." : "Your location could not be determined."); resetLocate(); }, { enableHighAccuracy: true, timeout: 10000, maximumAge: 30000 });
}
function resetLocate(success = false) { el.locateBtn.disabled = false; el.locateBtn.classList.toggle("is-located", success); el.locateBtn.innerHTML = success ? "<span>✓</span> Located" : "<span>⌖</span> Locate me"; if (success) resetLocate.timer = setTimeout(() => resetLocate(false), 2400); }

function applyOverlayTransform() { el.overlayPhoto.style.transform = `translate3d(${overlayState.x}px,${overlayState.y}px,0) rotate(${overlayState.rotation}deg) scale(${overlayState.scale})`; el.overlayPhoto.style.objectFit = overlayState.fit; el.zoomSlider.value = Math.round(overlayState.scale * 100); el.rotationSlider.value = overlayState.rotation; el.zoomValue.value = `${Math.round(overlayState.scale * 100)}%`; el.rotationValue.value = `${Number(overlayState.rotation).toFixed(overlayState.rotation % 1 ? 1 : 0)}°`; el.fitBtn.textContent = overlayState.fit === "cover" ? "完整显示" : "铺满画面"; el.lockBtn.textContent = overlayState.locked ? "解锁旧影" : "锁定旧影"; el.lockBtn.classList.toggle("is-active", overlayState.locked); el.cameraContainer.classList.toggle("is-locked", overlayState.locked); el.ghostModeLabel.textContent = overlayState.locked ? "旧影已锁定" : "旧影可移动 · 拖动调整位置"; }
function resetOverlay() { Object.assign(overlayState, { x: 0, y: 0, scale: 1, rotation: 0, fit: "cover", locked: false }); applyOverlayTransform(); }
function setOpacity(value) { const numeric = Number(value); el.overlayPhoto.style.opacity = referenceOnly ? 1 : numeric; el.opacityValue.value = `${Math.round(numeric * 100)}%`; }
const pointerDistance = points => Math.hypot(points[0].x - points[1].x, points[0].y - points[1].y);
const pointerAngle = points => Math.atan2(points[1].y - points[0].y, points[1].x - points[0].x) * 180 / Math.PI;
const pointerCenter = points => ({ x: (points[0].x + points[1].x) / 2, y: (points[0].y + points[1].y) / 2 });
function handleOverlayPointerDown(event) { if (overlayState.locked) return; el.cameraContainer.setPointerCapture?.(event.pointerId); activePointers.set(event.pointerId, { x: event.clientX, y: event.clientY, lastX: event.clientX, lastY: event.clientY }); el.cameraContainer.classList.add("is-dragging"); if (activePointers.size === 2) { const points = [...activePointers.values()]; pinchStart = { distance: pointerDistance(points), angle: pointerAngle(points), center: pointerCenter(points), scale: overlayState.scale, rotation: overlayState.rotation, x: overlayState.x, y: overlayState.y }; } }
function handleOverlayPointerMove(event) { if (!activePointers.has(event.pointerId) || overlayState.locked) return; const point = activePointers.get(event.pointerId); point.x = event.clientX; point.y = event.clientY; if (activePointers.size === 1) { overlayState.x += point.x - point.lastX; overlayState.y += point.y - point.lastY; } else if (activePointers.size === 2 && pinchStart) { const points = [...activePointers.values()], center = pointerCenter(points); overlayState.scale = Math.min(2.2, Math.max(.5, pinchStart.scale * pointerDistance(points) / Math.max(1, pinchStart.distance))); overlayState.rotation = Math.min(20, Math.max(-20, pinchStart.rotation + pointerAngle(points) - pinchStart.angle)); overlayState.x = pinchStart.x + center.x - pinchStart.center.x; overlayState.y = pinchStart.y + center.y - pinchStart.center.y; } point.lastX = point.x; point.lastY = point.y; applyOverlayTransform(); }
function handleOverlayPointerEnd(event) { activePointers.delete(event.pointerId); pinchStart = null; if (!activePointers.size) el.cameraContainer.classList.remove("is-dragging"); if (activePointers.size === 1) { const point = [...activePointers.values()][0]; point.lastX = point.x; point.lastY = point.y; } }

function prepareResult(place, newImage, isRemote, alignedOld = place.oldPhoto, isLayered = false) {
  selectedPlace = place; remoteMode = isRemote; isLayeredCheckin = isLayered;
  const currentCredit = isRemote ? place.nowCredit : fieldCredit();
  el.previewOld.src = alignedOld; el.previewNew.src = newImage; el.previewPlaceName.textContent = `${place.name} · ${place.cn}`;
  el.resultInsight.textContent = place.insight; el.resultDetail.textContent = place.detail;
  el.layerStackNote.classList.toggle("hidden", !isLayered); el.checkinTemplatePicker.classList.toggle("hidden", !isLayered); el.compareStudio.classList.toggle("is-checkin", isLayered);
  $("preview-title").textContent = isRemote ? "一处地点，两段时光。" : (isLayered ? "我与姑苏的过去同框。" : "我在姑苏，遇见过去。");
  el.downloadBtn.textContent = isRemote ? "下载对比明信片 ↓" : "下载古今纪念卡 ↓";
  $("preview-old-credit").textContent = place.oldCredit; $("preview-new-credit").textContent = currentCredit;
  $("compare-old-year").textContent = place.oldCredit.split("·")[0].trim(); $("compare-new-year").textContent = currentCredit.split("·")[0].trim();
  $("source-note").textContent = isLayered ? `历史背景：${place.oldCredit}。现场照片与人物抠图均只在你的设备中处理。` : `Archive: ${place.oldCredit}. Present: ${currentCredit}. Supplied modern rephotographs © 古城阳面; HER Lab teaching and student graduation work only.`;
  el.compareSlider.value = 50; setCompareMode("reveal");
  el.compareHint.textContent = isLayered ? "选择一种构图，让你站在过去与现在之间。" : "Drag across the image to reveal what changed — and what remained.";
  el.retakeBtn.textContent = isRemote ? "选择另一个故事" : "重新拍摄"; el.finishBtn.textContent = isRemote ? (savedPlaces.has(place.id) ? "♥ 已加入路线" : "♡ 加入漫步路线") : "完成打卡并收集印章";
  stopCamera(); showPage("preview");
}
function openRemote(place) { prepareResult(place, place.nowPhoto, true, place.oldPhoto); }
async function startField() { remoteMode = false; isLayeredCheckin = false; layeredCheckinAssets = null; fieldImageSrc = ""; cameraFacingMode = "user"; el.cameraStep.textContent = `点位 ${formatIndex(places.indexOf(selectedPlace))} · 古今合影打卡`; el.cameraPlaceName.textContent = `${selectedPlace.name} · ${selectedPlace.cn}`; el.overlayPhoto.src = selectedPlace.oldPhoto; $("camera-credit").textContent = selectedPlace.oldCredit; el.anchorList.innerHTML = selectedPlace.anchors.map((anchor, index) => `<li><b>${index + 1}</b> ${anchor}</li>`).join(""); el.opacitySlider.value = .58; referenceOnly = false; el.referenceBtn.textContent = "切换到后置镜头"; resetOverlay(); setOpacity(.58); updateDistance(); showPage("camera"); await startCamera(); }
async function startCamera() { stopCamera(); el.camera.classList.toggle("is-selfie", cameraFacingMode === "user"); el.cameraError.classList.add("hidden"); el.cameraPlaceholder.classList.remove("hidden"); el.cameraPlaceholder.querySelector("strong").textContent = "正在打开相机"; el.cameraPlaceholder.querySelector("p").textContent = cameraFacingMode === "user" ? "把自己和街景一起放进画面" : "对准旧照片中的街景位置"; if (!navigator.mediaDevices?.getUserMedia) { showCameraError("当前浏览器无法直接使用相机，请从相册选择一张照片继续。"); return; } try { cameraStream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: { ideal: cameraFacingMode }, width: { ideal: 1920 }, height: { ideal: 1280 } }, audio: false }); el.camera.srcObject = cameraStream; await el.camera.play(); el.cameraPlaceholder.classList.add("hidden"); } catch (error) { showCameraError(error.name === "NotAllowedError" ? "相机权限尚未开启，请在浏览器设置中允许，或从相册选择照片。" : "无法打开相机，请从相册选择照片继续。"); } }
function showCameraError(message) { el.cameraErrorText.textContent = message; el.cameraError.classList.remove("hidden"); el.cameraPlaceholder.querySelector("strong").textContent = "Continue with a photo"; el.cameraPlaceholder.querySelector("p").textContent = "Your image never leaves this device"; }
function stopCamera() { cameraStream?.getTracks().forEach(track => track.stop()); cameraStream = null; el.camera.srcObject = null; }
async function capturePhoto() { if (!el.camera.videoWidth) { showCameraError("相机还没有准备好，请稍等片刻或选择已有照片。"); return; } const canvas = el.canvas, context = canvas.getContext("2d"); canvas.width = el.camera.videoWidth; canvas.height = el.camera.videoHeight; if (cameraFacingMode === "user") { context.translate(canvas.width, 0); context.scale(-1, 1); } context.drawImage(el.camera, 0, 0, canvas.width, canvas.height); const captured = canvas.toDataURL("image/jpeg", .92); if (cameraFacingMode === "user") await createLayeredCheckin(captured); else startAlignment(captured); }
function handleUpload(event) { const file = event.target.files?.[0]; if (!file?.type.startsWith("image/")) return; const reader = new FileReader(); reader.onload = async () => { if (cameraFacingMode === "user") await createLayeredCheckin(reader.result); else startAlignment(reader.result); }; reader.readAsDataURL(file); event.target.value = ""; }
function loadImage(src) { return new Promise((resolve, reject) => { const image = new Image(); image.onload = () => resolve(image); image.onerror = reject; image.src = src; }); }

const SELFIE_SEGMENTATION_VERSION = "0.1.1675465747";
const SELFIE_SEGMENTATION_BASE = `https://cdn.jsdelivr.net/npm/@mediapipe/selfie_segmentation@${SELFIE_SEGMENTATION_VERSION}`;
function loadExternalScript(src) { return new Promise((resolve, reject) => { const existing = document.querySelector(`script[src="${src}"]`); if (existing?.dataset.ready === "1") return resolve(); const script = existing || document.createElement("script"); const timeout = setTimeout(() => reject(new Error("人物分割组件加载超时")), 20000); script.src = src; script.crossOrigin = "anonymous"; script.onload = () => { clearTimeout(timeout); script.dataset.ready = "1"; resolve(); }; script.onerror = () => { clearTimeout(timeout); reject(new Error("人物分割组件加载失败")); }; if (!existing) document.head.appendChild(script); }); }
async function getSelfieSegmenter() {
  if (!selfieSegmenterPromise) selfieSegmenterPromise = (async () => {
    await loadExternalScript(`${SELFIE_SEGMENTATION_BASE}/selfie_segmentation.js`);
    if (!window.SelfieSegmentation) throw new Error("当前浏览器无法启动人物分割模型");
    const segmenter = new window.SelfieSegmentation({ locateFile: file => `${SELFIE_SEGMENTATION_BASE}/${file}` });
    segmenter.setOptions({ modelSelection: 1, selfieMode: false });
    segmenter.onResults(results => { if (!segmentationResolve) return; const resolve = segmentationResolve; segmentationResolve = null; segmentationReject = null; resolve(results); });
    return segmenter;
  })();
  return selfieSegmenterPromise;
}
async function extractPersonCutout(sourceCanvas) {
  const segmenter = await getSelfieSegmenter();
  const results = await new Promise((resolve, reject) => {
    const timeout = setTimeout(() => { segmentationResolve = null; segmentationReject = null; reject(new Error("人物识别超时，请换一张人物更清晰的照片")); }, 18000);
    segmentationResolve = value => { clearTimeout(timeout); resolve(value); };
    segmentationReject = error => { clearTimeout(timeout); reject(error); };
    segmenter.send({ image: sourceCanvas }).catch(error => { const fail = segmentationReject; segmentationResolve = null; segmentationReject = null; fail?.(error); });
  });
  if (!results.segmentationMask) throw new Error("没有识别到清晰的人物");
  const cutout = document.createElement("canvas"), context = cutout.getContext("2d");
  cutout.width = sourceCanvas.width; cutout.height = sourceCanvas.height;
  context.drawImage(results.segmentationMask, 0, 0, cutout.width, cutout.height);
  context.globalCompositeOperation = "source-in";
  context.drawImage(sourceCanvas, 0, 0, cutout.width, cutout.height);
  context.globalCompositeOperation = "source-over";
  return cutout.toDataURL("image/png");
}
function drawAlignedArchive(context, archiveImage, width, height, alpha = 1, clip = null) {
  const cameraRect = el.cameraContainer.getBoundingClientRect(), offsetScaleX = width / Math.max(1, cameraRect.width), offsetScaleY = height / Math.max(1, cameraRect.height);
  context.save();
  if (clip) { context.beginPath(); context.rect(clip.x, clip.y, clip.width, clip.height); context.clip(); }
  context.globalAlpha = alpha; context.filter = "grayscale(.18) sepia(.28) contrast(1.08)";
  context.translate(width / 2 + overlayState.x * offsetScaleX, height / 2 + overlayState.y * offsetScaleY);
  context.rotate(overlayState.rotation * Math.PI / 180); context.scale(overlayState.scale, overlayState.scale);
  drawCover(context, archiveImage, -width / 2, -height / 2, width, height);
  context.restore();
}
function drawCheckinFrame(context, width, height) {
  context.save(); context.strokeStyle = "#f2efe7"; context.lineWidth = 24; context.strokeRect(12, 12, width - 24, height - 24); context.strokeStyle = "rgba(165,75,56,.75)"; context.lineWidth = 2; context.strokeRect(29, 29, width - 58, height - 58); context.restore();
  const vignette = context.createLinearGradient(0, height * .62, 0, height); vignette.addColorStop(0,"rgba(11,24,19,0)"); vignette.addColorStop(1,"rgba(11,24,19,.66)"); context.fillStyle = vignette; context.fillRect(24,height * .56,width - 48,height * .42);
  context.fillStyle = "rgba(255,255,255,.95)"; context.font = "700 17px Microsoft YaHei, Arial"; context.fillText("我在姑苏，与过去同框", 48, height - 72);
  context.font = "700 32px Microsoft YaHei, Georgia"; context.fillText(selectedPlace.cn, 48, height - 35);
  context.textAlign = "right"; context.font = "700 14px Arial"; context.fillText("GUSU · PAST & PRESENT", width - 48, height - 67); context.font = "15px Microsoft YaHei, Arial"; context.fillText(`${selectedPlace.oldCredit.split("·")[0].trim()} × ${new Date().getFullYear()}`, width - 48, height - 36); context.textAlign = "left";
}
async function composeThreeLayers(personCutoutSrc, presentSource, template = activeCheckinTemplate) {
  const [presentImage, archiveImage, personImage] = await Promise.all([loadImage(presentSource), loadImage(selectedPlace.oldPhoto), loadImage(personCutoutSrc)]);
  const composite = document.createElement("canvas"), context = composite.getContext("2d"), width = 1200, height = 900;
  composite.width = width; composite.height = height;
  drawCover(context, presentImage, 0, 0, width, height);
  if (template === "split") {
    const splitX = Math.round(width * .54);
    drawAlignedArchive(context, archiveImage, width, height, 1, { x:0, y:0, width:splitX, height });
    const seam = context.createLinearGradient(splitX - 34, 0, splitX + 34, 0); seam.addColorStop(0,"rgba(242,239,231,0)"); seam.addColorStop(.48,"rgba(242,239,231,.95)"); seam.addColorStop(.52,"rgba(242,239,231,.95)"); seam.addColorStop(1,"rgba(242,239,231,0)"); context.fillStyle = seam; context.fillRect(splitX - 34, 24, 68, height - 48);
    context.fillStyle = "rgba(19,37,31,.82)"; context.font = "700 13px Microsoft YaHei, Arial"; context.fillText(`过去 · ${selectedPlace.oldCredit.split("·")[0].trim()}`, 48, 64); context.textAlign = "right"; context.fillText(`现在 · ${new Date().getFullYear()}`, width - 48, 64); context.textAlign = "left";
  } else if (template === "overlay") {
    drawAlignedArchive(context, archiveImage, width, height, Math.max(.5, Number(el.opacitySlider.value)));
    context.fillStyle = "rgba(242,239,231,.08)"; context.fillRect(0,0,width,height);
    context.fillStyle = "rgba(19,37,31,.82)"; context.font = "700 13px Microsoft YaHei, Arial"; context.fillText(`旧影叠合 · ${selectedPlace.oldCredit}`, 48, 64);
  } else {
    context.fillStyle = "rgba(15,32,26,.18)"; context.fillRect(0,0,width,height);
    context.save(); context.translate(62, 62); context.rotate(-1.8 * Math.PI / 180); context.shadowColor = "rgba(0,0,0,.34)"; context.shadowBlur = 28; context.shadowOffsetY = 14; context.fillStyle = "#f2efe7"; context.fillRect(0,0,690,610); context.shadowColor = "transparent"; drawCover(context, archiveImage, 16,16,658,526); context.fillStyle = "#a54b38"; context.fillRect(16,542,658,45); context.fillStyle = "white"; context.font = "700 15px Microsoft YaHei, Arial"; context.fillText(`历史旧影 · ${selectedPlace.oldCredit}`, 32,571); context.restore();
  }
  drawCover(context, personImage, 0, 0, width, height);
  drawCheckinFrame(context, width, height);
  return composite.toDataURL("image/jpeg", .94);
}
async function renderCheckinTemplate(template) {
  if (!layeredCheckinAssets) return;
  activeCheckinTemplate = template;
  const buttons = [...document.querySelectorAll("[data-checkin-template]")]; buttons.forEach(button => { button.disabled = true; button.classList.toggle("is-active", button.dataset.checkinTemplate === template); });
  el.compareHint.textContent = "正在重新生成古今合影…";
  try { const composite = await composeThreeLayers(layeredCheckinAssets.personCutout, layeredCheckinAssets.presentSource, template); fieldImageSrc = composite; el.previewNew.src = composite; el.compareHint.textContent = "人物始终位于最前层；可继续切换构图，直到画面自然。"; }
  catch { el.compareHint.textContent = "模板生成失败，请重新拍摄后再试。"; }
  finally { buttons.forEach(button => { button.disabled = false; }); }
}
async function createLayeredCheckin(source) {
  el.captureBtn.disabled = true; el.referenceBtn.disabled = true; el.segmentationStatus.classList.remove("hidden");
  try {
    const image = await loadImage(source), scale = Math.min(1, 1280 / Math.max(image.width, image.height)), input = document.createElement("canvas"), context = input.getContext("2d");
    input.width = Math.max(1, Math.round(image.width * scale)); input.height = Math.max(1, Math.round(image.height * scale)); context.drawImage(image, 0, 0, input.width, input.height);
    const cutout = await extractPersonCutout(input); activeCheckinTemplate = "split"; layeredCheckinAssets = { presentSource:source, personCutout:cutout };
    document.querySelectorAll("[data-checkin-template]").forEach(button => button.classList.toggle("is-active", button.dataset.checkinTemplate === activeCheckinTemplate));
    const composite = await composeThreeLayers(cutout, source, activeCheckinTemplate);
    fieldImageSrc = composite;
    prepareResult(selectedPlace, composite, false, selectedPlace.oldPhoto, true);
    el.resultInsight.textContent = "你不是在复刻一张空景照，而是在和这个地点的过去合影。";
    el.resultDetail.textContent = "现场街景位于底层，历史旧影成为清晰可见的背景，你的身影完整保留在最前面。可切换三种构图后下载纪念卡。";
  } catch (error) {
    showCameraError(`${error.message || "自动抠图失败"}。你可以换一张人物轮廓更清晰、光线更均匀的照片重试。`);
  } finally {
    el.segmentationStatus.classList.add("hidden"); el.captureBtn.disabled = false; el.referenceBtn.disabled = false;
  }
}

async function startAlignment(newImageSrc) { stopCamera(); fieldImageSrc = newImageSrc; alignment.pairs = []; alignment.pending = null; alignment.homography = null; el.alignOld.src = selectedPlace.oldPhoto; el.alignNew.src = newImageSrc; el.alignPreviewNew.src = newImageSrc; el.alignPlaceName.textContent = `${selectedPlace.name} · ${selectedPlace.cn}`; $("align-old-credit").textContent = selectedPlace.oldCredit; $("align-new-credit").textContent = fieldCredit(); $("warp-old-credit").textContent = selectedPlace.oldCredit; $("warp-new-credit").textContent = fieldCredit(); resetWarpCanvas(); showPage("align"); try { [alignment.oldImage, alignment.newImage] = await Promise.all([loadImage(selectedPlace.oldPhoto), loadImage(newImageSrc)]); updateAlignmentUI(); } catch { el.alignInstructionTitle.textContent = "One of the photographs could not be loaded."; el.alignInstructionCopy.textContent = "Return to the camera and try another photograph."; } }
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
async function downloadPostcard() {
  const original = el.downloadBtn.textContent;
  el.downloadBtn.disabled = true;
  el.downloadBtn.textContent = "正在生成纪念卡…";
  try {
    const [oldImage, newImage] = await Promise.all([loadImage(el.previewOld.src), loadImage(el.previewNew.src)]);
    const canvas = document.createElement("canvas"), context = canvas.getContext("2d"), currentCredit = remoteMode ? selectedPlace.nowCredit : fieldCredit();
    canvas.width = 1600; canvas.height = isLayeredCheckin ? 1200 : 1000;
    if (isLayeredCheckin) {
      drawCover(context, newImage, 0, 0, canvas.width, canvas.height);
    } else if (!remoteMode) {
      drawCover(context, newImage, 0, 0, canvas.width, canvas.height);
      const shade = context.createLinearGradient(0, 450, 0, 1000);
      shade.addColorStop(0, "rgba(12,22,18,0)"); shade.addColorStop(1, "rgba(12,22,18,.88)");
      context.fillStyle = shade; context.fillRect(0, 400, 1600, 600);
      context.fillStyle = "#f2efe7"; context.fillRect(64, 64, 552, 392);
      drawCover(context, oldImage, 76, 76, 528, 340);
      context.fillStyle = "#a54b38"; context.fillRect(76, 416, 528, 28);
      context.fillStyle = "white"; context.font = "700 15px Microsoft YaHei, Arial";
      context.fillText(`旧影 · ${selectedPlace.oldCredit}`, 92, 436);
      context.fillStyle = "white"; context.font = "700 27px Microsoft YaHei, Arial";
      context.fillText("古今合影打卡", 70, 770);
      context.font = "700 66px Microsoft YaHei, Georgia";
      context.fillText(selectedPlace.cn, 70, 850);
      context.font = "600 29px Microsoft YaHei, Arial";
      context.fillText(selectedPlace.name, 70, 900);
      context.fillStyle = "rgba(255,255,255,.72)"; context.font = "22px Microsoft YaHei, Arial";
      context.fillText(`拍摄于 ${new Date().toLocaleDateString("zh-CN", { year:"numeric", month:"long", day:"numeric" })}`, 70, 944);
      context.textAlign = "right"; context.font = "700 22px Arial";
      context.fillText("GUSU · PAST & PRESENT", 1530, 900);
      context.font = "18px Microsoft YaHei, Arial"; context.fillText("我在姑苏，遇见过去", 1530, 944);
      context.textAlign = "left";
    } else {
      context.fillStyle = "#f2efe7"; context.fillRect(0,0,canvas.width,canvas.height);
      drawCover(context,oldImage,70,70,710,650); drawCover(context,newImage,820,70,710,650);
      context.fillStyle = "#17231f"; context.font = "700 24px Arial"; context.fillText("ARCHIVE",70,758); context.fillText("PRESENT",820,758);
      context.fillStyle = "#66716b"; context.font = "18px Microsoft YaHei, Arial"; context.fillText(selectedPlace.oldCredit,70,790); context.fillText(currentCredit,820,790);
      context.fillStyle = "#a54b38"; context.font = "700 22px Arial"; context.fillText("GUSU, PAST & PRESENT",70,845);
      context.fillStyle = "#17231f"; context.font = "700 48px Georgia"; context.fillText(selectedPlace.name,70,905);
      context.fillStyle = "#66716b"; context.font = "23px Microsoft YaHei, Arial"; context.fillText(selectedPlace.cn,70,945);
      context.textAlign = "right"; context.font = "20px Arial"; context.fillText("One corner · Two moments",1530,905); context.fillText(new Date().toLocaleDateString("en-GB",{day:"2-digit",month:"short",year:"numeric"}),1530,945); context.textAlign = "left";
    }
    canvas.toBlob(blob => { const url = URL.createObjectURL(blob), link = document.createElement("a"); link.href = url; link.download = `gusu-${selectedPlace.id}-${remoteMode ? "postcard" : "checkin"}.png`; link.click(); setTimeout(() => URL.revokeObjectURL(url),1000); },"image/png");
  } catch { alert("纪念卡生成失败，请重试。"); }
  finally { el.downloadBtn.disabled = false; el.downloadBtn.textContent = original; }
}
async function makeVisitThumbnail(source) {
  try { const image = await loadImage(source), canvas = document.createElement("canvas"), context = canvas.getContext("2d"); canvas.width = 360; canvas.height = 270; drawCover(context, image, 0, 0, canvas.width, canvas.height); return canvas.toDataURL("image/jpeg", .72); } catch { return ""; }
}
async function finishVisit() {
  if (remoteMode) { toggleSaved(selectedPlace); el.finishBtn.textContent = savedPlaces.has(selectedPlace.id) ? "♥ Saved to route" : "♡ Save to route"; return; }
  el.finishBtn.disabled = true; el.finishBtn.textContent = "Saving field record…";
  const photo = await makeVisitThumbnail(el.previewNew.src);
  visited.add(selectedPlace.id);
  visitRecords[selectedPlace.id] = { date:new Date().toISOString(), photo };
  localStorage.setItem("gusu-visited", JSON.stringify([...visited]));
  try { persistVisitRecords(); } catch { visitRecords[selectedPlace.id].photo = ""; persistVisitRecords(); }
  if (!savedPlaces.has(selectedPlace.id)) { savedPlaces.add(selectedPlace.id); persistSavedPlaces(); }
  el.finishBtn.disabled = false;
  updateVisited(); showPage("home"); selectPlace(selectedPlace);
  if (window.matchMedia("(min-width: 681px)").matches) setTimeout(() => el.placeCard.scrollIntoView({ behavior: "smooth", block: "center" }), 200);
  toast("Revisit complete — date, photograph and stamp saved on this device.");
}
function updateVisited() {
  el.visitedCount.textContent = `${visited.size} / ${places.length}`;
  document.querySelectorAll(".route-stop").forEach(card => {
    const done = Boolean(visitRecords[card.dataset.id]);
    card.classList.toggle("is-visited", done);
    const status = card.querySelector(".route-status");
    if (status) status.textContent = done ? "✓ REVISITED" : "○ NOT VISITED";
    const date = card.querySelector(".route-visit-date");
    if (date) date.textContent = done ? `Completed ${formatVisitDate(visitRecords[card.dataset.id].date)}` : "";
  });
  updateMarkerVisuals(); updateCollection();
}

el.heroSlider.addEventListener("input", event => setCompare(Number(event.target.value),el.heroOldWrap,el.heroHandle));
document.querySelectorAll("[data-hero-mode]").forEach(button => button.addEventListener("click", () => setHeroMode(button.dataset.heroMode)));
$("hero-opacity").addEventListener("input", event => { const value = Number(event.target.value); el.heroOldWrap.style.opacity = value; $("hero-opacity-value").value = `${Math.round(value * 100)}%`; });
$("hero-stage").addEventListener("pointermove", updateHeroLens); $("hero-stage").addEventListener("pointerdown", updateHeroLens);
$("hero-blink-toggle").addEventListener("click", () => heroBlinkTimer ? stopHeroBlink() : startHeroBlink());
el.tryDemoBtn.addEventListener("click", () => { $("hero-demo").scrollIntoView({behavior:"smooth",block:"center"}); $("hero-demo").animate([{transform:"scale(1)"},{transform:"scale(1.018)"},{transform:"scale(1)"}],{duration:700}); });
$("guide-btn").addEventListener("click", openOnboarding); $("onboarding-skip").addEventListener("click", closeOnboarding); $("onboarding-next").addEventListener("click", advanceOnboarding);
$("collection-btn").addEventListener("click", openCollection); $("open-route-btn").addEventListener("click", openCollection); $("collection-close").addEventListener("click", closeCollection); $("collection-scrim").addEventListener("click", closeCollection);
$("show-route-btn").addEventListener("click", showSavedRoute); $("clear-route-btn").addEventListener("click", () => { savedPlaces.clear(); persistSavedPlaces(); updateSavedButton(); updateCollection(); updateMapSelectionCard(selectedPlace); }); el.savePlaceBtn.addEventListener("click", () => toggleSaved(selectedPlace));
el.locateBtn.addEventListener("click",locateUser); el.remoteBtn.addEventListener("click",() => openRemote(selectedPlace)); el.startBtn.addEventListener("click",startField);
el.backHomeBtn.addEventListener("click",() => { stopCamera(); showPage("home"); setTimeout(() => el.placeCard.scrollIntoView({behavior:"smooth",block:"center"}),150); });
el.opacitySlider.addEventListener("input",event => setOpacity(event.target.value));
el.zoomSlider.addEventListener("input",event => { overlayState.scale = Number(event.target.value)/100; applyOverlayTransform(); });
el.rotationSlider.addEventListener("input",event => { overlayState.rotation = Number(event.target.value); applyOverlayTransform(); });
el.fitBtn.addEventListener("click",() => { overlayState.fit = overlayState.fit === "cover" ? "contain" : "cover"; applyOverlayTransform(); });
el.lockBtn.addEventListener("click",() => { overlayState.locked = !overlayState.locked; activePointers.clear(); applyOverlayTransform(); });
el.resetOverlayBtn.addEventListener("click",resetOverlay); el.cameraContainer.addEventListener("pointerdown",handleOverlayPointerDown); el.cameraContainer.addEventListener("pointermove",handleOverlayPointerMove); el.cameraContainer.addEventListener("pointerup",handleOverlayPointerEnd); el.cameraContainer.addEventListener("pointercancel",handleOverlayPointerEnd);
el.captureBtn.addEventListener("click",capturePhoto); el.uploadInput.addEventListener("change",handleUpload); el.referenceBtn.addEventListener("click",async () => { cameraFacingMode = cameraFacingMode === "user" ? "environment" : "user"; el.referenceBtn.textContent = cameraFacingMode === "user" ? "切换到后置镜头" : "切换到前置镜头"; await startCamera(); });
el.oldPointStage.addEventListener("click",event => handlePointClick("old",event)); el.newPointStage.addEventListener("click",event => handlePointClick("new",event)); el.undoPointBtn.addEventListener("click",undoPoint); el.clearPointsBtn.addEventListener("click",clearPoints);
el.alignOpacitySlider.addEventListener("input",event => { el.warpCanvas.style.opacity = event.target.value; el.alignOpacityValue.value = `${Math.round(Number(event.target.value)*100)}%`; });
el.alignBackBtn.addEventListener("click",async () => { showPage("camera"); await startCamera(); }); el.skipAlignBtn.addEventListener("click",() => prepareResult(selectedPlace,fieldImageSrc,false,selectedPlace.oldPhoto)); el.confirmAlignBtn.addEventListener("click",confirmAlignment);
el.compareSlider.addEventListener("input",event => setCompare(Number(event.target.value),el.compareOldWrap,el.compareHandle));
document.querySelectorAll("[data-compare-mode]").forEach(button => button.addEventListener("click", () => setCompareMode(button.dataset.compareMode)));
document.querySelectorAll("[data-checkin-template]").forEach(button => button.addEventListener("click", () => renderCheckinTemplate(button.dataset.checkinTemplate)));
$("comparison-opacity").addEventListener("input", event => { const value = Number(event.target.value); el.compareOldWrap.style.opacity = value; $("comparison-opacity-value").value = `${Math.round(value * 100)}%`; });
$("compare-stage").addEventListener("pointermove", updateTimeLens); $("compare-stage").addEventListener("pointerdown", updateTimeLens);
$("blink-toggle").addEventListener("click", () => blinkTimer ? stopBlinkComparison() : startBlinkComparison());
$("compare-fullscreen").addEventListener("click", async () => { try { if (document.fullscreenElement) await document.exitFullscreen(); else await $("compare-studio").requestFullscreen(); } catch { toast("Full-screen view is unavailable in this browser."); } });
el.previewBackBtn.addEventListener("click",async () => { if (remoteMode) { showPage("home"); $("stories").scrollIntoView({behavior:"smooth"}); } else if (isLayeredCheckin) { showPage("camera"); await startCamera(); } else { showPage("align"); renderPointMarkers(); } });
el.retakeBtn.addEventListener("click",async () => { if (remoteMode) { showPage("home"); $("stories").scrollIntoView({behavior:"smooth"}); } else { showPage("camera"); await startCamera(); } });
el.downloadBtn.addEventListener("click",downloadPostcard); el.finishBtn.addEventListener("click",finishVisit); window.addEventListener("resize",() => { renderPointMarkers(); loadDesktopImages(); }); window.addEventListener("beforeunload",stopCamera); document.addEventListener("visibilitychange",() => { if (document.hidden && !pages.camera.classList.contains("hidden")) stopCamera(); });
document.addEventListener("keydown", event => { if (event.key !== "Escape") return; if (!el.collectionDrawer.classList.contains("hidden")) closeCollection(); else if (!$("onboarding").classList.contains("hidden")) closeOnboarding(); });

buildStories(); loadDesktopImages(); buildRouteStops(); renderDiscoveryBrowser(); initMap(); updateVisited(); selectPlace(places[0], false, false); setHeroMode("reveal"); applyOverlayTransform(); updateAlignmentUI(); if (!localStorage.getItem("gusu-onboarding-complete")) setTimeout(openOnboarding, 450);








