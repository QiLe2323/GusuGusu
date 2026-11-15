import * as THREE from './vendor/three-0.160.0.module.js';
import { gusuDioramaScenes } from './gusu-diorama-scenes.js?v=2';

// A small, hand-built scene inspired by the canal, rather than a reconstruction.
export function createPingjiangDiorama(container, options = {}) {
  return createGusuDiorama(container, { ...options, placeId: 'pingjiang' });
}

export function createGusuDiorama(container, { placeId = 'pingjiang', tracking = false, onReady } = {}) {
  const profile = gusuDioramaScenes[placeId];
  if (!profile) throw new Error('Unknown postcard scene: ' + placeId);
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'low-power' });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 1.7));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.25;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.localClippingEnabled = true;
  renderer.domElement.className = 'pingjiang-canvas';
  renderer.domElement.dataset.place = placeId;
  renderer.domElement.setAttribute('aria-label', profile.name + '可旋转的立体场景');
  container.append(renderer.domElement);
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(36, 1, .01, 30);
  const root = new THREE.Group();
  scene.add(root);
  const animated = [];
  const disposables = new Set();
  const clock = new THREE.Clock();
  let started = 0, elapsed = 0, disposed = false, visible = true;
  let yaw = profile.camera ?? -.20, pitch = .57, dragging = false, pointer;
  const movingDetails = [];
  const storyObjects = [];
  const windowPanes = [];
  const accents = [];
  let detailActive = false, detailAmount = 0;
  let sailingTime = 0;
  let landmarkModel;
  const longitudinal = profile.river === 'long';
  const materials = {};

  function material(name, color, roughness = .9) {
    if (!materials[name]) materials[name] = new THREE.MeshStandardMaterial({ color, roughness });
    return materials[name];
  }
  const plaster = material('plaster', '#e9dfc6');
  const timber = material('timber', '#443b2d');
  const wood = material('wood', '#7b6241');
  const stone = material('stone', '#a7997c');
  const tile = material('tile', '#303c37');
  const gild = material('gild', '#b2965d', .55);
  const glass = new THREE.MeshStandardMaterial({ color: '#d5ac70', emissive: '#b9843e', emissiveIntensity: .42, roughness: .6 });
  const palette = ['#a3977d', '#b3a88d', '#a89d86', '#c0b499', '#948d78'].map((c,i) => material('stone'+i,c));
  root.add(new THREE.HemisphereLight('#e7efdf', '#7a6957', 2.3));
  const sun = new THREE.DirectionalLight('#ffe2ad', 3.3);
  sun.position.set(-.7, 1.4, .9);
  sun.castShadow = true;
  sun.shadow.mapSize.set(1024, 1024);
  Object.assign(sun.shadow.camera, { left: -.85, right: .85, top: .85, bottom: -.85, near: .1, far: 4 });
  sun.shadow.bias = -.0007;
  sun.shadow.normalBias = .002;
  root.add(sun, sun.target);
  const fill = new THREE.DirectionalLight('#b5cabb', .65);
  fill.position.set(.8,.6,-1);
  root.add(fill);

  function box(parent, w, h, d, x, y, z, mat, shadow = true) {
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
    mesh.position.set(x,y,z);
    mesh.castShadow = shadow;
    mesh.receiveShadow = true;
    parent.add(mesh);
    return mesh;
  }
  function line(parent, points, radius, mat) {
    const curve = new THREE.CatmullRomCurve3(points.map(p=>new THREE.Vector3(...p)));
    const mesh = new THREE.Mesh(new THREE.TubeGeometry(curve, 14, radius, 5, false), mat);
    mesh.castShadow = true;
    parent.add(mesh);
    return mesh;
  }
  function register(group, delay, duration = 1.25, effect = profile.entry) {
    animated.push({ group, delay, duration, effect });
    return group;
  }

  // Small amounts of deterministic grain help retain an illustrated material.
  const textureCanvas = document.createElement('canvas');
  textureCanvas.width = textureCanvas.height = 128;
  const paint = textureCanvas.getContext('2d');
  paint.fillStyle = '#e8dfc7'; paint.fillRect(0,0,128,128);
  let seed = 17;
  for (let i=0; i<2200; i++) {
    seed = (seed * 16807) % 2147483647;
    const x = seed % 128;
    seed = (seed * 16807) % 2147483647;
    paint.fillStyle = i % 3 ? '#8a7a5821' : '#ffffff55';
    paint.fillRect(x,seed%128,1,1);
  }
  const plasterMap = new THREE.CanvasTexture(textureCanvas);
  plasterMap.colorSpace = THREE.SRGBColorSpace;
  plaster.map = plasterMap;
  disposables.add(plasterMap);

  const base = register(new THREE.Group(), 0, .9,'rise');
  root.add(base);
  box(base,1.04,.022,.69,0,-.031,0,material('edge','#5b5648'));
  box(base,1.055,.008,.70,0,-.046,0,gild);
  box(base,1.04,.009,.69,0,-.055,0,material('paper','#ded1ac'));
  // The base has a quiet engraved frame, with water over its forward half.
  if(longitudinal) {
    for(const side of [-1,1]) {
      box(base,.34,.016,.65,side*.33,-.006,0,material('earth','#8e8a70'));
      for(let i=0;i<18;i++)box(base,.025,.018,.032,side*.177,.005,-.30+i*.035,palette[i%5]);
    }
  } else box(base,1.00,.016,profile.water ? .34 : .65,0,-.006,profile.water ? -.156 : 0,material('earth','#8e8a70'));
  for (let row=0; row<(longitudinal ? 0 : 3); row++) for(let col=0; col<25; col++) {
    box(base,.038,.013,.025,-.486+col*.040+(row%2)*.009,.011,-.032+row*.027,palette[(row+col)%5]);
  }
  for(let row=0; row<(profile.water && !longitudinal ? 3 : 0); row++) for(let col=0; col<17; col++) {
    box(base,.057,.017,.024,-.48+col*.06,-.016+row*.017,.064,palette[(col+row*3)%5]);
  }
  if (!profile.water) {
    for (let row=0; row<8; row++) for(let col=0; col<15; col++) {
      box(base,.062,.006,.032,-.47+col*.066+(row%2)*.008,.006,.035+row*.036,palette[(row+col)%5],false);
    }
  }

  function roof(parent, w, d, y, z) {
    const roofGroup = new THREE.Group();
    roofGroup.position.set(0,y,z);
    parent.add(roofGroup);
    const roofHeight = .062;
    // Curved roof panels and individual round tile courses share the same curve.
    const profile = t => roofHeight*(1-t) + .010*Math.pow(t,5);
    const positions=[], indices=[];
    for (const sign of [-1,1]) {
      const offset=positions.length/3;
      for(let i=0;i<=9;i++) {
        const t=i/9;
        const lift=.007*Math.pow(t,5);
        positions.push(-w/2-.018,profile(t)+lift,sign*t*(d/2+.021),w/2+.018,profile(t)+lift,sign*t*(d/2+.021));
      }
      for(let i=0;i<9;i++) {
        const n=offset+i*2;
        if(sign===1) indices.push(n,n+2,n+1,n+1,n+2,n+3);
        else indices.push(n,n+1,n+2,n+1,n+3,n+2);
      }
    }
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position',new THREE.Float32BufferAttribute(positions,3));
    geometry.setIndex(indices); geometry.computeVertexNormals();
    const panel = new THREE.Mesh(geometry,tile);
    panel.material.side=THREE.DoubleSide;
    panel.castShadow=true; panel.receiveShadow=true; roofGroup.add(panel);
    const columns=Math.ceil(w/.013);
    const tileGeometry=new THREE.CylinderGeometry(.0035,.0035,1,5);
    const tiles=new THREE.InstancedMesh(tileGeometry,material('tile-detail','#46544b'),columns*2*6);
    const dummy=new THREE.Object3D(); let index=0;
    for(const sign of [-1,1]) for(let col=0;col<columns;col++) for(let row=0;row<6;row++) {
      const t1=row/6,t2=(row+1)/6;
      const a=new THREE.Vector3(-w/2+col*w/(columns-1),profile(t1)+.003,sign*t1*(d/2+.021));
      const b=new THREE.Vector3(a.x,profile(t2)+.003,sign*t2*(d/2+.021));
      const direction=b.clone().sub(a);
      dummy.position.copy(a).add(b).multiplyScalar(.5);
      dummy.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),direction.clone().normalize());
      dummy.scale.set(1,direction.length(),1);dummy.updateMatrix();
      tiles.setMatrixAt(index++,dummy.matrix);
    }
    tiles.castShadow=true; roofGroup.add(tiles);
    line(roofGroup,[[-w/2-.022,.073,0],[0,.067,0],[w/2+.022,.073,0]],.005,tile);
    for(const sign of [-1,1]) {
      line(roofGroup,[[-w/2-.022,.022,sign*(d/2+.021)],[0,.010,sign*(d/2+.021)],[w/2+.022,.022,sign*(d/2+.021)]],.004,timber);
    }
  }

  function lattice(parent,x,y,z,w,h) {
    box(parent,w+.010,h+.010,.007,x,y,z,timber);
    const paneMaterial=placeId==='boxi'?glass.clone():glass;
    box(parent,w,h,.004,x,y,z+.005,paneMaterial,false);
    if(placeId==='boxi')windowPanes.push(paneMaterial);
    for(let i=1;i<5;i++) box(parent,.0019,h,.003,x-w/2+w*i/5,y,z+.009,timber,false);
    for(let i=1;i<4;i++) box(parent,w,.0018,.003,x,y-h/2+h*i/4,z+.010,timber,false);
    for(let i=0;i<3;i++) {
      const bar=box(parent,w*.18,.0016,.003,x-w*.30+i*w*.3,y+h*.14,z+.012,timber,false);
      bar.rotation.z=Math.PI/4;
    }
    box(parent,w+.018,.006,.018,x,y-h/2-.009,z+.004,wood);
  }
  function house(x,z,w,d,h,delay,upper=false) {
    const group=register(new THREE.Group(),delay);
    group.position.set(x,.016,z);root.add(group);
    box(group,w,h,d,0,h/2,0,plaster);
    box(group,w+.004,.022,d+.006,0,.011,0,material('plinth','#6d7465'));
    const front=d/2+.004;
    for(const sx of [-1,1]) box(group,.010,h,.012,sx*(w/2-.008),h/2,front,timber);
    box(group,w,.009,.014,0,h-.009,front,timber);
    if(upper) {
      box(group,w,.009,.016,0,h*.48,front,timber);
      lattice(group,-w*.23,h*.71,front,w*.30,h*.25);
      lattice(group,w*.23,h*.71,front,w*.30,h*.25);
    }
    const doorH=upper?h*.38:h*.58;
    const doorW=w*.27;
    box(group,doorW+.012,doorH+.008,.010,-w*.17,doorH/2+.012,front,timber);
    box(group,doorW,doorH,.012,-w*.17,doorH/2+.012,front+.006,wood);
    for(let i=0;i<6;i++) box(group,.0015,doorH,.002,-w*.17-doorW/2+i*doorW/5,doorH/2+.012,front+.013,timber,false);
    for(const dx of [-.004,.004]) {
      const handle=new THREE.Mesh(new THREE.TorusGeometry(.0025,.0006,4,8),gild);
      handle.position.set(-w*.17+dx,.060,front+.016);group.add(handle);
    }
    lattice(group,w*.25,upper?h*.24:h*.46,front,w*.25,upper?h*.22:h*.33);
    // Side-wall windows and exposed rafters remain visible when the card turns.
    const side=new THREE.Group();side.position.set(-w/2-.004,h*.53,-d*.10);side.rotation.y=-Math.PI/2;
    group.add(side);lattice(side,0,0,0,d*.29,h*.23);
    roof(group,w,d,h,0);
    for(let i=0;i<5;i++) box(group,.006,.010,.027,-w*.4+i*w*.2,h-.009,front+.014,wood);
    return group;
  }
  function planting(x,z,size=.18) {
    const tree=register(new THREE.Group(),1.4,1.6);
    tree.position.set(x,.01,z);root.add(tree);
    const bark=material('street-bark','#756c51');
    line(tree,[[0,0,0],[.007,size*.5,0],[-.009,size*.96,.009]],.006,bark);
    const foliage=material('street-foliage','#8d9a6d');
    for(let i=0;i<7;i++) {
      const angle=i*2.4;
      const dx=Math.sin(angle)*size*.22,dz=Math.cos(angle)*size*.17;
      line(tree,[[0,size*.55,0],[dx,size*.86,dz]],.002,bark);
      const crown=new THREE.Mesh(new THREE.IcosahedronGeometry(size*.25,1),foliage);
      crown.position.set(dx,size*(.86+(i%2)*.11),dz);crown.scale.set(1,.9,.8);
      crown.castShadow=true;tree.add(crown);
    }
    movingDetails.push({group:tree,amount:.009,phase:x*8});
  }

  function masonryArch(parent,w,h,depth,radius,spring,mat) {
    const outline=new THREE.Shape();
    // The arch is an open notch in the outer contour, not a hole touching its edge.
    outline.moveTo(-w/2,0);outline.lineTo(-radius,0);outline.lineTo(-radius,spring);
    outline.absarc(0,spring,radius,Math.PI,0,true);
    outline.lineTo(radius,0);outline.lineTo(w/2,0);
    outline.lineTo(w/2,h);outline.lineTo(-w/2,h);outline.closePath();
    const mesh=new THREE.Mesh(new THREE.ExtrudeGeometry(outline,{depth,steps:1,bevelEnabled:false,curveSegments:18}),mat);
    mesh.position.z=-depth/2;mesh.castShadow=true;mesh.receiveShadow=true;parent.add(mesh);
    for(let i=0;i<15;i++) {
      const angle=Math.PI*i/14;
      const voussoir=box(parent,.018,.023,.005,Math.cos(angle)*(radius+.013),spring+Math.sin(angle)*(radius+.013),depth/2+.003,stone);
      voussoir.rotation.z=angle-Math.PI/2;
    }
    return mesh;
  }

  function pagoda(x,z,height,levels,delay) {
    const tower=new THREE.Group();tower.position.set(x,.018,z);root.add(tower);
    const brick=material('pagoda-brick','#a18b68');
    const stageHeight=height/(levels+1.6);
    for(let level=0;level<levels;level++) {
      const radius=.075*(1-level/(levels*1.55));
      const storey=register(new THREE.Group(),delay+level*.19,.8,'stack');tower.add(storey);
      const body=new THREE.Mesh(new THREE.CylinderGeometry(radius*.80,radius,stageHeight,8),brick);
      const y=level*stageHeight;
      body.position.y=y+stageHeight/2;body.castShadow=true;body.receiveShadow=true;storey.add(body);
      const eave=new THREE.Mesh(new THREE.CylinderGeometry(radius*.68,radius*1.34,.021,8),tile);
      eave.position.y=y+stageHeight; eave.castShadow=true;storey.add(eave);
      const lip=new THREE.Mesh(new THREE.CylinderGeometry(radius*1.34,radius*1.34,.004,8),gild);
      lip.position.y=y+stageHeight-.009;storey.add(lip);
      for(let side=0;side<8;side++) {
        const bay=new THREE.Group();bay.rotation.y=side*Math.PI/4; storey.add(bay);
        box(bay,.012,stageHeight*.44,.003,0,y+stageHeight*.47,radius*.90,timber);
      }
    }
    const top=levels*stageHeight;
    const spire=register(new THREE.Group(),delay+levels*.19,.8,'stack');tower.add(spire);
    const finial=new THREE.Mesh(new THREE.ConeGeometry(.014,stageHeight*.9,8),gild);
    finial.position.y=top+stageHeight*.42;spire.add(finial);
    line(spire,[[0,top,0],[0,top+stageHeight*1.4,0]],.0016,gild);
    storyObjects.push({kind:'tower',group:tower,x,z,height});
  }

  function hall(x,z,w,d,height,tiers,delay) {
    const pavilion=register(new THREE.Group(),delay,1.5);
    pavilion.position.set(x,.015,z);root.add(pavilion);
    const red=material('temple-red','#7c4434');
    box(pavilion,w+.05,.022,d+.04,0,.011,0,stone);
    box(pavilion,w,.045,d,0,.038,0,red);
    for(let floor=0;floor<tiers;floor++) {
      const tier=register(new THREE.Group(),delay+.25+floor*.4,.85,'fold');pavilion.add(tier);
      const width=w*(1-floor*.13),depth=d*(1-floor*.09);
      const y=.045+floor*height/tiers;
      box(tier,width,height/tiers,depth,0,y+height/tiers/2,0,red);
      for(let col=0;col<5;col++) {
        const px=-width*.40+col*width*.20;
        box(tier,.009,height/tiers,.012,px,y+height/tiers/2,depth/2+.004,timber);
        if(col<4) lattice(tier,px+width*.10,y+height/tiers*.5,depth/2+.008,width*.14,height/tiers*.52);
      }
      roof(tier,width+.04,depth+.015,y+height/tiers,0);
    }
    for(let i=0;i<4;i++) box(pavilion,w*.4,.007,.024,0,.008+i*.007,d/2+.074-i*.018,stone);
    return pavilion;
  }

  function banner(parent,x,y,z) {
    const pole=box(parent,.003,y,.003,x,y/2,z,wood);
    const cloth=register(new THREE.Group(),1.3+(x+.5)*.6,1,'fold');cloth.position.set(x,y-.015,z);parent.add(cloth);
    box(cloth,.046,.066,.002,.022,-.026,0,material('banner','#a56449'));
    box(cloth,.044,.003,.003,.022,.006,0,gild);
    movingDetails.push({group:cloth,amount:.07,phase:x*12});
    return pole;
  }

  function bridge(wooden=false) {
    const span=register(new THREE.Group(),1.15,1.5);span.position.set(.13,.008,.16);span.rotation.y=Math.PI/2;root.add(span);
    if(wooden) {
      for(let i=0;i<21;i++) {
        const plank=register(new THREE.Group(),1+i*.055,.65,'plank');span.add(plank);
        box(plank,.015,.012,.105,-.16+i*.016,.117,0,wood);
      }
      for(const side of [-1,1]) {
        box(span,.34,.014,.009,0,.11,side*.047,timber);
        for(let post=0;post<8;post++) box(span,.007,.065,.007,-.16+post*.046,.147,side*.048,wood);
        box(span,.35,.006,.008,0,.180,side*.048,timber);
        box(span,.34,.004,.006,0,.145,side*.048,wood);
      }
      for(const x of [-.15,.15]) box(span,.025,.12,.10,x,.06,0,stone);
    } else {
      masonryArch(span,.35,.155,.11,.111,.025,stone);
      for(const side of [-1,1]) {
        box(span,.365,.025,.012,0,.164,side*.053,stone);
        for(let i=0;i<12;i++) box(span,.001,.023,.002,-.16+i*.029,.164,side*.060,wood,false);
      }
    }
    if(longitudinal) { span.position.set(0,.008,.05);span.rotation.y=0; }
    else box(base,.15,.015,.048,.13,.010,.314,stone);
  }

  function cityGate(kind) {
    const gate=register(new THREE.Group(),.65,1.65);gate.position.set(kind==='crenelgate'?.12:0,.012,-.10);root.add(gate);
    const width=kind==='barbican'?.73:.66;
    const height=kind==='barbican'?.26:.23;
    masonryArch(gate,width,height,.18,.092,.077,material('fortification','#7d8171'));
    if(kind==='citygate') {
      for(const side of [-1,1]) {
        const hinge=new THREE.Group();hinge.position.set(side*.089,0,-.045);gate.add(hinge);
        box(hinge,.087,.150,.009,-side*.0435,.075,0,wood);
        for(let i=0;i<5;i++)box(hinge,.001,.145,.002,-side*(.008+i*.017),.075,.006,timber,false);
        for(let row=0;row<3;row++)for(let col=0;col<4;col++) {
          const stud=new THREE.Mesh(new THREE.SphereGeometry(.0015,4,3),gild);
          stud.position.set(-side*(.015+col*.019),.035+row*.038,.008);hinge.add(stud);
        }
        storyObjects.push({kind:'door',group:hinge,side});
      }
    }
    for(let row=0;row<7;row++) for(let col=0;col<17;col++) {
      const x=-width/2+col*width/16;
      const y=.022+row*.033;
      if(Math.abs(x)<.13 && y<.20) continue;
      box(gate,.030,.001,.002,x,y,.091,stone,false);
    }
    box(gate,width+.018,.012,.20,0,height,0,stone);
    if(kind==='citygate') {
      const building=hall(0,-.10,.41,.19,.15,2,1.1);building.position.y=height+.012;
      house(-.39,-.18,.14,.15,.12,1.3);
      house(.39,-.18,.14,.15,.11,1.4);
    } else if(kind==='crenelgate') {
      for(let i=0;i<10;i++) box(gate,.043,.033,.19,-width/2+.034+i*(width-.068)/9,height+.022,0,stone);
      house(-.32,-.11,.26,.21,.23,1.1,true);
    } else {
      box(gate,.045,.28,.024,-width/2+.02,.14,.10,stone);
      box(gate,.045,.28,.024,width/2-.02,.14,.10,stone);
      planting(-.43,-.21,.22);
    }
    banner(root,-.34,.19,.08);banner(root,.34,.17,.09);
  }

  function civicBuilding(hospital=false) {
    const building=register(new THREE.Group(),.65,1.65);building.position.set(0,.012,-.12);root.add(building);
    const brick=material('civic-brick',hospital?'#98795e':'#b3ad95');
    const width=hospital?.65:.70;
    const height=hospital?.24:.25;
    box(building,width,height,.23,0,height/2,0,brick);
    box(building,width+.02,.019,.25,0,.011,0,stone);
    for(const y of [.09,.19]) for(let col=0;col<8;col++) {
      lattice(building,-width*.43+col*width*.86/7,y,.12,.038,.057);
    }
    box(building,width+.01,.008,.24,0,.14,0,stone);
    for(let col=0;col<9;col++) box(building,.006,height,.008,-width/2+col*width/8,height/2,.122,stone);
    if(hospital) {
      roof(building,width,.23,height,0);
      box(building,.19,.026,.08,0,.008,.15,stone);
      for(const x of [-.075,.075]) box(building,.007,.14,.007,x,.075,.17,wood);
      roof(building,.19,.08,.15,.15);
    } else {
      box(building,width+.025,.018,.25,0,height+.008,0,stone);
      box(building,.15,.13,.16,0,height+.065,0,brick);
      box(building,.17,.012,.18,0,height+.135,0,stone);
      box(building,.12,.007,.13,0,height+.152,0,wood);
      const clockFace=new THREE.Mesh(new THREE.CircleGeometry(.028,24),plaster);
      clockFace.position.set(0,height+.073,.082);building.add(clockFace);
      box(building,.002,.021,.002,0,height+.083,.085,timber);
      box(building,.016,.002,.002,.007,height+.073,.085,timber);
      for(const x of [-.095,.095]) box(building,.013,.14,.014,x,.07,.158,plaster);
      box(building,.24,.013,.08,0,.144,.144,stone);
    }
    for(let i=0;i<3;i++) box(building,.24,.009,.025,0,.005+i*.009,.21-i*.024,stone);
    planting(-.42,-.16,.24);planting(.42,-.19,.23);
  }

  switch(profile.layout) {
    case 'pingjiang':
      house(-.34,-.16,.20,.18,.19,.55);
      house(-.12,-.19,.23,.20,.26,.76,true);
      house(.12,-.16,.21,.18,.18,1.00);
      house(.35,-.20,.24,.21,.23,1.18,true);
      break;
    case 'woodbridge':
      house(-.32,-.18,.25,.19,.19,.55);
      house(.32,-.19,.25,.20,.23,.82,true);
      bridge(true);
      break;
    case 'stonebridge':
      house(-.34,-.17,.24,.18,.17,.55);
      house(.35,-.19,.21,.19,.21,.85);
      bridge();planting(-.43,-.20,.27);
      break;
    case 'waterlane':
      for(const side of [-1,1])for(let i=0;i<3;i++) {
        const home=house(side*.32,-.22+i*.21,.18,.22,.17+(i%2)*.05,.55+i*.25+(side===1?.18:0),i===1);
        home.rotation.y=-side*Math.PI/2;
      }
      break;
    case 'canalbend':
      for(let i=0;i<3;i++) {
        const home=house(.33,-.23+i*.20,.17,.22,.18+(i%2)*.05,.55+i*.27,i===1);
        home.rotation.y=-Math.PI/2;
      }
      house(-.32,-.22,.22,.19,.14,.8);
      bridge();
      break;
    case 'waterside':
      for(let i=0;i<3;i++) {
        const home=house(.34,-.22+i*.20,.18,.23,.16+(i%2)*.07,.55+i*.28,i===2);home.rotation.y=-Math.PI/2;
      }
      house(-.32,-.20,.23,.19,.20,.7,true);
      for(let i=0;i<6;i++) {
        const step=register(new THREE.Group(),1.2+i*.11,.6,'steps');root.add(step);
        box(step,.027,.013,.095,-.22+i*.018,.043-i*.007,.15,stone);
      }
      break;
    case 'lane': {
      const left=house(-.28,-.08,.20,.42,placeId==='xuanqiao'?.23:.20,.55);
      left.rotation.y=Math.PI/2;
      const right=house(.27,-.08,.20,.44,placeId==='xuanqiao'?.17:.25,.85);
      right.rotation.y=-Math.PI/2;
      house(0,-.23,.25,.16,.14,1.1);
      box(base,.006,.30,.006,.15,.15,-.16,wood);
      break;
    }
    case 'market':
    case 'treestreet': {
      for(let i=0;i<3;i++) {
        if(profile.layout==='market') {
          for(const side of [-1,1]) {
            const shop=house(side*.33,-.22+i*.19,.17,.24,.19+(i%2)*.04,.55+i*.25,true);shop.rotation.y=-side*Math.PI/2;
          }
        } else house(-.32+i*.31,-.17,.26,.21,.20+(i%2)*.05,.55+i*.25,true);
        if(profile.layout==='market') {
          const stall=register(new THREE.Group(),1.4+i*.13);root.add(stall);stall.position.set(-.24,.01,-.20+i*.19);stall.rotation.y=Math.PI/2;
          box(stall,.17,.045,.05,0,.023,0,wood);
          const canopy=box(stall,.20,.006,.08,0,.115,0,material('awning','#ba9c72'));canopy.rotation.x=.14;
          for(const x of [-.087,.087])box(stall,.004,.12,.004,x,.06,-.025,wood);
          storyObjects.push({kind:'awning',group:canopy});
        } else planting(-.38+i*.34,.10,.27);
      }
      if(profile.layout==='market'){banner(root,-.43,.22,.11);banner(root,.43,.22,.11);}
      break;
    }
    case 'pagoda':
      pagoda(0,-.17,.46,9,.55);
      hall(0,.02,.38,.13,.085,1,1.1);
      planting(-.38,-.17,.24);planting(.38,-.18,.26);
      break;
    case 'twintowers':
      pagoda(-.15,-.17,.43,7,.55);
      pagoda(.15,-.20,.38,7,.90);
      house(-.32,.005,.22,.13,.09,1.25);
      house(.14,.025,.29,.14,.10,1.45);planting(.39,-.11,.24);
      break;
    case 'pavilion':
      landmarkModel=hall(0,-.10,.57,.25,.27,3,.65);planting(-.40,-.20,.23);
      break;
    case 'temple':
      hall(0,-.12,.40,.22,.21,2,.65);
      house(-.35,-.11,.20,.20,.12,1.1);house(.35,-.11,.20,.20,.12,1.3);
      banner(root,-.28,.18,.08);banner(root,.28,.18,.08);
      break;
    case 'screenwall': {
      const wall=register(new THREE.Group(),.65,1.4);wall.position.set(0,.012,-.11);root.add(wall);
      const outline=new THREE.Shape();outline.moveTo(-.39,0);outline.lineTo(.39,0);outline.lineTo(.39,.26);outline.lineTo(-.39,.26);outline.closePath();
      const opening=new THREE.Path();opening.absarc(0,.115,.091,0,Math.PI*2,true);outline.holes.push(opening);
      const mesh=new THREE.Mesh(new THREE.ExtrudeGeometry(outline,{depth:.026,bevelEnabled:false}),plaster);mesh.castShadow=true;mesh.receiveShadow=true;wall.add(mesh);
      const ring=new THREE.Mesh(new THREE.TorusGeometry(.095,.006,6,48),stone);ring.position.set(0,.115,.029);wall.add(ring);
      roof(wall,.78,.030,.26,.013);planting(-.40,-.15,.30);
      break;
    }
    case 'hospital':civicBuilding(true);break;
    case 'library':civicBuilding();break;
    case 'citygate':case 'crenelgate':case 'barbican':cityGate(profile.layout);break;
  }

  // Small stone steps connect the towpath to the water.
  const steps=profile.water && !longitudinal ? register(new THREE.Group(),1.45) : new THREE.Group();
  if(profile.water && !longitudinal)root.add(steps);
  for(let i=0;i<4;i++) box(steps,.092,.012,.025,.26,.023-i*.010,.065+i*.022,palette[i]);
  for(let i=0;i<(profile.water && !longitudinal ? 11 : 0);i++) {
    box(base,.008,.039,.008,-.47+i*.070,.042,.036,stone);
    if(i<10) box(base,.072,.005,.005,-.435+i*.070,.057,.036,stone);
  }

  const willow=profile.willow ? register(new THREE.Group(),1.4,1.7) : new THREE.Group();
  willow.position.set(-.455,.01,-.042);if(profile.willow)root.add(willow);
  if(longitudinal)willow.position.set(-.35,.01,-.10);
  const bark=material('bark','#665a3b');
  line(willow,[[0,0,0],[.011,.12,0],[-.006,.24,-.006],[.020,.34,-.016]],.011,bark);
  const leaves = new THREE.InstancedMesh(new THREE.SphereGeometry(.003,4,3),material('leaf','#8d9d60'),480);
  const leafDummy=new THREE.Object3D();let leafCount=0;
  const branchGroups=[];
  for(let branch=0;branch<12;branch++) {
    const angle=branch*2.399;
    const bx=Math.cos(angle)*(.06+(branch%3)*.014);
    const bz=Math.sin(angle)*.061;
    const by=.25+(branch%4)*.022;
    line(willow,[[.01,.23,0],[bx*.6,by+.025,bz*.6],[bx,by,bz]],.0028,bark);
    const twig=new THREE.Group();willow.add(twig);branchGroups.push(twig);
    const points=[[bx,by,bz],[bx*1.20,by-.065,bz*1.2],[bx*1.12,by-.15,bz*1.1]];
    line(twig,points,.0006,material('twig','#82965b'));
    for(let i=0;i<40;i++) {
      const t=i/40;
      leafDummy.position.set(bx*(1+.14*Math.sin(t*Math.PI))+(i%2?.004:-.004),by-t*.15,bz*(1+.15*t));
      leafDummy.rotation.z=i%2?.5:-.5;leafDummy.scale.set(1,2.9,.45);leafDummy.updateMatrix();leaves.setMatrixAt(leafCount++,leafDummy.matrix);
    }
  }
  willow.add(leaves);

  const lanternGroup=placeId==='pingjiang' ? register(new THREE.Group(),1.9) : new THREE.Group();
  if(placeId==='pingjiang')root.add(lanternGroup);
  const lanternMat=new THREE.MeshStandardMaterial({color:'#b85d3f',emissive:'#9b451c',emissiveIntensity:.45,roughness:.8});
  for(const x of [-.27,.045]) {
    const orb=new THREE.Mesh(new THREE.SphereGeometry(.011,12,8),lanternMat);
    orb.scale.set(1,1.35,1);orb.position.set(x,.135,-.041);lanternGroup.add(orb);
    line(lanternGroup,[[x,.163,-.041],[x,.155,-.041]],.0007,gild);
    line(lanternGroup,[[x,.120,-.041],[x,.108,-.041]],.0008,gild);
    for(let i=0;i<6;i++) {
      const ring=new THREE.Mesh(new THREE.TorusGeometry(.011,.0004,3,16),gild);
      ring.rotation.y=i*Math.PI/6;ring.position.copy(orb.position);ring.scale.y=1.35;lanternGroup.add(ring);
    }
  }

  const boat=profile.boat ? register(new THREE.Group(),2.1,1.25) : new THREE.Group();
  boat.position.set(-.23,.018,.215);if(profile.boat)root.add(boat);
  const hullShape=new THREE.Shape();hullShape.moveTo(-.092,0);hullShape.quadraticCurveTo(-.074,-.019,0,-.022);hullShape.quadraticCurveTo(.073,-.019,.092,0);hullShape.lineTo(-.092,0);
  const hull=new THREE.Mesh(new THREE.ExtrudeGeometry(hullShape,{depth:.037,bevelEnabled:true,bevelSize:.003,bevelThickness:.003,bevelSegments:2,steps:1}),timber);
  hull.position.z=-.019;boat.add(hull);
  box(boat,.142,.004,.033,0,.001,0,wood);
  const canopyMat=material('canopy','#8d7651');
  const canopy=new THREE.Mesh(new THREE.CylinderGeometry(.026,.026,.088,16,1,true,0,Math.PI),canopyMat);
  canopy.rotation.z=Math.PI/2;canopy.rotation.x=Math.PI/2;canopy.position.set(-.008,.007,0);boat.add(canopy);
  for(let i=0;i<6;i++) {
    const hoop=new THREE.Mesh(new THREE.TorusGeometry(.026,.001,4,16,Math.PI),gild);
    hoop.rotation.y=Math.PI/2;hoop.position.set(-.049+i*.016,.007,0);boat.add(hoop);
  }
  const oar=line(boat,[[.05,.011,0],[.12,-.012,.05]],.0016,wood);
  const wake=new THREE.Group();if(profile.boat)root.add(wake);
  const wakeMat=new THREE.MeshBasicMaterial({color:'#e7dfb6',transparent:true,opacity:.27,side:THREE.DoubleSide,depthWrite:false});
  for(let i=0;i<3;i++) {
    const ring=new THREE.Mesh(new THREE.RingGeometry(.033+i*.014,.034+i*.014,40,1,0,Math.PI*1.1),wakeMat);
    ring.rotation.x=-Math.PI/2;ring.scale.set(1,.42,1);ring.position.set(-.31,.004,.22);wake.add(ring);
  }

  // A planar reflection renders the geometry from beneath the water surface.
  const reflectionTarget=new THREE.WebGLRenderTarget(512,512,{depthBuffer:true});
  const reflectionCamera=new THREE.PerspectiveCamera();
  const reflectionMatrix=new THREE.Matrix4();
  const waterUniforms={time:{value:0},reflection:{value:reflectionTarget.texture},reflectionMatrix:{value:reflectionMatrix}};
  const waterMat=new THREE.ShaderMaterial({
    uniforms:waterUniforms,
    vertexShader:'varying vec4 projected; varying vec2 uvWater; uniform mat4 reflectionMatrix; void main(){uvWater=uv;vec4 world=modelMatrix*vec4(position,1.);projected=reflectionMatrix*world;gl_Position=projectionMatrix*viewMatrix*world;}',
    fragmentShader:'uniform float time;uniform sampler2D reflection;varying vec4 projected;varying vec2 uvWater;void main(){vec2 p=projected.xy/projected.w*.5+.5;float ripple=sin(uvWater.x*63.+time*.7+sin(uvWater.y*32.))*0.0018+sin(uvWater.y*87.-time*.5)*0.001;vec3 mirror=texture2D(reflection,p+vec2(ripple,ripple*.7)).rgb;vec3 teal=mix(vec3(.12,.25,.22),vec3(.26,.40,.32),uvWater.y);float gleam=pow(max(0.,sin(uvWater.y*161.+sin(uvWater.x*22.+time*.4))),36.)*.032;gl_FragColor=vec4(mix(teal,mirror,.34)+gleam,1.);#include <tonemapping_fragment>\n#include <colorspace_fragment>}',
    side:THREE.DoubleSide
  });
  // Shader preprocessor directives must start on a new line.
  waterMat.fragmentShader=waterMat.fragmentShader.replace(';#include',';\n#include').replace('<colorspace_fragment>}','<colorspace_fragment>\n}');
  waterMat.fragmentShader=waterMat.fragmentShader.replace('vec3(.12,.25,.22),vec3(.26,.40,.32)','vec3(.025,.08,.065),vec3(.07,.16,.12)');
  const water=new THREE.Mesh(new THREE.PlaneGeometry(longitudinal?.31:.998,longitudinal?.65:.276),waterMat);
  water.rotation.x=-Math.PI/2;water.position.set(0,.002,longitudinal?0:.199);if(profile.water)root.add(water);
  disposables.add(reflectionTarget);
  const waterNormal=new THREE.Vector3(0,1,0);
  const waterPoint=new THREE.Vector3();

  const storyGold=new THREE.LineBasicMaterial({color:'#ffe2a0',transparent:true,opacity:.78});
  disposables.add(storyGold);
  function luminousPath(points) {
    const geometry=new THREE.BufferGeometry().setFromPoints(points.map(p=>new THREE.Vector3(...p)));
    const trace=new THREE.Line(geometry,storyGold.clone());trace.frustumCulled=false;root.add(trace);
    accents.push({kind:'path',group:trace,count:points.length});return trace;
  }
  function waterRings(x,z) {
    const rings=new THREE.Group();root.add(rings);
    for(let i=0;i<4;i++) {
      const mat=new THREE.MeshBasicMaterial({color:'#e2ddb0',side:THREE.DoubleSide,transparent:true,opacity:.4,depthWrite:false});
      const ring=new THREE.Mesh(new THREE.RingGeometry(.018,.019,40),mat);
      ring.rotation.x=-Math.PI/2;ring.position.set(x,.005+i*.0003,z);rings.add(ring);
      accents.push({kind:'ring',group:ring,phase:i*.6});
    }
  }
  if(['liaojia','xuanqiao','xumen'].includes(placeId)) {
    const z=placeId==='xumen'?-.10:-.25;
    luminousPath([[0,.012,z],[0,.012,0],[0,.012,.27]]);
    const beamMat=new THREE.MeshBasicMaterial({color:'#ffdfa0',transparent:true,opacity:.12,side:THREE.DoubleSide,depthWrite:false});
    const beam=new THREE.Mesh(new THREE.PlaneGeometry(placeId==='liaojia'?.085:.035,.52),beamMat);
    beam.rotation.x=-Math.PI/2;beam.position.set(placeId==='liaojia'?-.05:0,.013,.03);root.add(beam);
    accents.push({kind:'beam',group:beam});
  }
  if(['beisi','twinpagodas'].includes(placeId)) {
    for(const tower of storyObjects.filter(item=>item.kind==='tower')) {
      const points=Array.from({length:70},(_,i)=>{
        const t=i/69,angle=t*Math.PI*5;
        return [tower.x+Math.cos(angle)*.105,(tower.height+.08)*t+.02,tower.z+Math.sin(angle)*.105];
      });luminousPath(points);
    }
    if(placeId==='twinpagodas')luminousPath([[-.15,.43,-.17],[0,.50,-.18],[.15,.38,-.20]]);
  }
  if(placeId==='miluo') {
    const ghost=register(new THREE.Group(),.1,.75,'frame');root.add(ghost);
    root.updateMatrixWorld(true);
    landmarkModel.traverse(mesh=>{
      if(!mesh.isMesh||mesh.isInstancedMesh)return;
      const edges=new THREE.LineSegments(new THREE.EdgesGeometry(mesh.geometry,35),storyGold.clone());
      edges.matrixAutoUpdate=false;edges.matrix.copy(mesh.matrixWorld);ghost.add(edges);
      accents.push({kind:'ghost',group:edges});
    });
    luminousPath([[-.31,.014,.05],[-.31,.014,-.25],[.31,.014,-.25],[.31,.014,.05],[-.31,.014,.05]]);
  }
  if(placeId==='anchashi') {
    const bamboo=register(new THREE.Group(),1.8,1.3,'slide');bamboo.position.set(0,.013,-.22);root.add(bamboo);
    for(let i=0;i<3;i++) {
      const x=-.04+i*.033;
      line(bamboo,[[x,0,0],[x+.007,.12,0],[x+.018,.22,0]],.002,material('bamboo','#758661'));
      for(let j=0;j<4;j++) {
        const leaf=new THREE.Mesh(new THREE.SphereGeometry(.012,4,3),material('bamboo-leaf','#758661'));
        leaf.scale.set(1,.18,.35);leaf.position.set(x+(j%2?-.014:.017),.08+j*.032,0);leaf.rotation.z=j%2?-.6:.6;bamboo.add(leaf);
      }
    }
    storyObjects.push({kind:'bamboo',group:bamboo});
  }
  if(placeId==='wuyachang') {
    const laundry=new THREE.Group();root.add(laundry);
    line(laundry,[[-.26,.15,-.03],[0,.12,-.03],[.26,.15,-.03]],.001,wood);
    for(let i=0;i<5;i++) {
      const cloth=new THREE.Group();cloth.position.set(-.13+i*.065,.13,-.03);laundry.add(cloth);
      const fabric=box(cloth,.037,.062,.002,0,-.029,0,material('cloth'+i,['#5b7974','#c4b68f','#977b69','#a5b49a','#637880'][i]));
      storyObjects.push({kind:'cloth',group:cloth,fabric,phase:i});
    }
  }
  if(placeId==='wuxianlibrary') {
    const book=register(new THREE.Group(),1.6,1,'pages');book.position.set(0,.04,.18);root.add(book);
    box(book,.22,.006,.12,0,0,0,material('book-cover','#4e6d62'));
    for(let i=0;i<7;i++) {
      const page=new THREE.Group();page.position.y=.007+i*.001;book.add(page);
      box(page,.10,.001,.108,.05,0,0,plaster);
      for(let row=0;row<6;row++)box(page,.065,.0005,.001,.05,.001,-.036+row*.013,wood,false);
      storyObjects.push({kind:'page',group:page,phase:i*.33});
    }
  }
  if(['wuwang','xingzao'].includes(placeId))waterRings(placeId==='xingzao'?-.08:.12,placeId==='xingzao'?.15:.21);
  if(placeId==='brickbridge')luminousPath([[0,.006,.31],[.025,.006,.10],[-.01,.006,-.15],[0,.006,-.30]]);
  if(placeId==='lujia') {
    const pavement=box(root,.998,.005,.276,0,.008,.199,stone);accents.push({kind:'pavement',group:pavement});
    luminousPath([[-.45,.013,.19],[-.20,.013,.19],[.20,.013,.19],[.45,.013,.19]]);
  }
  if(placeId==='xuanmiao') {
    const templeLights=new THREE.Group();root.add(templeLights);
    for(const x of [-.25,.25]) {
      const group=new THREE.Group();group.position.set(x,.13,.015);templeLights.add(group);
      const sphere=new THREE.Mesh(new THREE.SphereGeometry(.025,12,8),lanternMat);sphere.scale.y=1.3;group.add(sphere);
      line(group,[[0,.06,0],[0,.035,0]],.001,gild);line(group,[[0,-.033,0],[0,-.060,0]],.001,gild);
      storyObjects.push({kind:'temple-lantern',group});
    }
  }

  function resize() {
    const w=container.clientWidth,h=container.clientHeight;
    if(!w||!h)return;
    renderer.setSize(w,h,false);camera.aspect=w/h;camera.updateProjectionMatrix();
  }
  const observer=new ResizeObserver(resize);observer.observe(container);resize();
  function positionCamera(time) {
    const drift=reducedMotion||dragging?0:Math.sin(time*.09)*.045;
    const distance=Math.max(1.67,1.87/camera.aspect)*(profile.framing ?? 1);
    camera.position.set(Math.sin(yaw+drift)*Math.cos(pitch)*distance,Math.sin(pitch)*distance,Math.cos(yaw+drift)*Math.cos(pitch)*distance);
    camera.lookAt(0,.105,-.025);
  }
  function reflect() {
    root.updateMatrixWorld(true);water.getWorldPosition(waterPoint);
    waterNormal.set(0,1,0).transformDirection(root.matrixWorld);
    const normal=waterNormal;
    const view=camera.position.clone().sub(waterPoint);
    reflectionCamera.copy(camera,false);
    reflectionCamera.position.copy(camera.position).addScaledVector(normal,-2*view.dot(normal));
    const direction=new THREE.Vector3();camera.getWorldDirection(direction);
    direction.reflect(normal);
    reflectionCamera.up.copy(camera.up).reflect(normal);
    reflectionCamera.lookAt(reflectionCamera.position.clone().add(direction));
    reflectionCamera.updateMatrixWorld();
    reflectionMatrix.multiplyMatrices(reflectionCamera.projectionMatrix,reflectionCamera.matrixWorldInverse);
    const clippingPlane=new THREE.Plane().setFromNormalAndCoplanarPoint(waterNormal,waterPoint.clone().addScaledVector(waterNormal,.002));
    const clipMaterials=new Set();
    root.traverse(object=>{if(object.material && object!==water)clipMaterials.add(object.material);});
    clipMaterials.forEach(mat=>{mat.clippingPlanes=[clippingPlane];});
    water.visible=false;wake.visible=false;
    renderer.setRenderTarget(reflectionTarget);renderer.clear();renderer.render(scene,reflectionCamera);
    renderer.setRenderTarget(null);water.visible=true;wake.visible=Boolean(profile.boat);
    clipMaterials.forEach(mat=>{mat.clippingPlanes=null;});
  }
  function draw() {
    if(disposed)return;
    const delta=Math.min(clock.getDelta(),.06);
    if(!visible || document.hidden)return;
    elapsed+=delta;
    if(!tracking)positionCamera(elapsed);
    detailAmount=THREE.MathUtils.damp(detailAmount,detailActive?1:0,3.4,delta);
    for(const record of animated) {
      const {group,delay,duration,effect}=record;
      if(!record.origin)record.origin={position:group.position.clone(),rotation:group.rotation.clone(),scale:group.scale.clone()};
      const p=reducedMotion?1:THREE.MathUtils.clamp((elapsed-started-delay)/duration,0,1);
      const easing=1-Math.pow(1-p,3);
      const remaining=1-easing;
      group.position.copy(record.origin.position);group.rotation.copy(record.origin.rotation);group.scale.copy(record.origin.scale);group.visible=p>0;
      switch(effect) {
        case 'slide':case 'banks':
          group.position.x+=Math.sign(record.origin.position.x||1)*remaining*.16;break;
        case 'depth':case 'tunnel':group.scale.z=Math.max(.001,easing);break;
        case 'street':group.position.z-=remaining*.20;break;
        case 'stack':group.position.y+=remaining*.075;group.scale.multiplyScalar(.75+easing*.25);break;
        case 'fold':group.rotation.x-=remaining*Math.PI*.48;break;
        case 'plank':group.position.y+=remaining*.11;group.rotation.z+=remaining*.20;break;
        case 'frame':case 'arch':group.scale.x=Math.max(.001,easing);break;
        case 'canopy':group.scale.multiplyScalar(Math.max(.001,easing));break;
        case 'windows':group.position.z+=remaining*.12;break;
        case 'pages':group.rotation.x-=remaining*.4;group.position.y-=remaining*.04;break;
        case 'current':group.scale.z=Math.max(.001,easing);break;
        case 'steps':group.position.x-=remaining*.13;break;
        case 'banners':group.position.x+=Math.sign(record.origin.position.x||1)*remaining*.13;break;
        default:group.scale.y=Math.max(.001,easing);
      }
    }
    const t=reducedMotion?0:elapsed;
    sailingTime+=delta*(1-detailAmount);
    waterUniforms.time.value=t;
    boat.position.x=-.21+Math.sin((reducedMotion?0:sailingTime)*.13)*.22;
    boat.position.y=.018+Math.sin(t*1.2)*.0015;
    boat.rotation.z=Math.sin(t*.9)*.009;
    oar.rotation.x=Math.sin(t*.8)*.08;
    wake.position.x=boat.position.x+.23;
    wakeMat.opacity=.18+Math.sin(t*1.2)*.045;
    willow.rotation.z=Math.sin(t*.7)*.009;
    branchGroups.forEach((twig,i)=>twig.rotation.z=Math.sin(t*.9+i)*.015);
    movingDetails.forEach(({group,amount,phase})=>group.rotation.z=Math.sin(t*.8+phase)*amount*(1+detailAmount*(placeId==='shiquan'?3:1.5)));
    glass.emissiveIntensity=.38+Math.sin(t*.6)*.045;
    for(const [i,pane] of windowPanes.entries())pane.emissiveIntensity=.10+(.25+detailAmount)*Math.max(0,Math.sin(t*.8-i*.32));
    for(const item of storyObjects) {
      const {group}=item;
      switch(item.kind) {
        case 'door':group.rotation.y=-item.side*(.18+detailAmount*1.12);break;
        case 'awning':group.rotation.x=.14-detailAmount*.9;break;
        case 'bamboo':group.position.x=detailAmount*.04;group.rotation.z=Math.sin(t*.65)*.015;break;
        case 'cloth':group.scale.y=.15+detailAmount*.85;group.rotation.x=Math.sin(t*.9+item.phase)*.10;break;
        case 'page':group.rotation.z=.05+(.25+detailAmount*.65)*Math.max(0,Math.sin(t*.65-item.phase))*Math.PI;break;
        case 'temple-lantern':group.rotation.z=Math.sin(t*.8)*.06;lanternMat.emissiveIntensity=.12+detailAmount*.9;break;
      }
    }
    for(const item of accents) {
      const {group}=item;
      switch(item.kind) {
        case 'path': {
          const span=reducedMotion?1:(t*.22)%1;
          group.geometry.setDrawRange(0,Math.max(2,Math.ceil(item.count*(detailActive?1:span))));
          group.material.opacity=.20+detailAmount*.65;break;
        }
        case 'ring': {
          const wave=reducedMotion?.6:((t+item.phase)%3)/3;
          group.scale.setScalar(1+wave*(4+detailAmount*3));group.material.opacity=(1-wave)*(.12+detailAmount*.5);break;
        }
        case 'beam':group.material.opacity=.08+detailAmount*.38;group.position.z=.02+Math.sin(t*.24)*.08;break;
        case 'ghost':group.material.opacity=.12+detailAmount*.75;break;
        case 'pavement':group.visible=detailAmount<.45;break;
      }
    }
    if(profile.water)reflect();renderer.render(scene,camera);
  }
  function down(event) {
    if(tracking)return;
    dragging=true;pointer=[event.clientX,event.clientY];
    renderer.domElement.setPointerCapture(event.pointerId);
  }
  function move(event) {
    if(!dragging)return;
    yaw=THREE.MathUtils.clamp(yaw+(event.clientX-pointer[0])*.006,-.82,.82);
    pitch=THREE.MathUtils.clamp(pitch+(event.clientY-pointer[1])*.005,.26,1.0);
    pointer=[event.clientX,event.clientY];
  }
  function up(){dragging=false;}
  renderer.domElement.addEventListener('pointerdown',down);
  renderer.domElement.addEventListener('pointermove',move);
  renderer.domElement.addEventListener('pointerup',up);
  renderer.domElement.addEventListener('pointercancel',up);

  function track(corners) {
    visible=Boolean(corners);root.visible=visible;
    if(!corners)return;
    const width=container.clientWidth,height=container.clientHeight,f=Math.max(width,height)*.9;
    const unit=[[0,0],[1,0],[1,1],[0,1]];
    const h=window.computeHomography(corners.map(([x,y],i)=>({old:{x:unit[i][0],y:unit[i][1]},new:{x:x*width,y:y*height}})));
    if(!h)return;
    const [a,b,c,d,e,k,g,j]=h;
    const cx=width/2,cy=height/2;
    const u=new THREE.Vector3((a-cx*g)/f,(d-cy*g)/f,g);
    const v=new THREE.Vector3((b-cx*j)/f,(e-cy*j)/f,j).multiplyScalar(1/.66);
    const scale=2/(u.length()+v.length());
    u.normalize();v.addScaledVector(u,-v.dot(u)).normalize();
    const normal=new THREE.Vector3().crossVectors(u,v).negate();
    const convert=p=>new THREE.Vector3(p.x,-p.y,-p.z);
    const centerDepth=1+.5*g+.5*j;
    const center=new THREE.Vector3((c+.5*a+.5*b-cx*centerDepth)/f,(k+.5*d+.5*e-cy*centerDepth)/f,centerDepth).multiplyScalar(scale);
    const matrix=new THREE.Matrix4().makeBasis(convert(u),convert(normal),convert(v));
    matrix.setPosition(convert(center));root.matrixAutoUpdate=false;root.matrix.copy(matrix);
    camera.position.set(0,0,0);camera.quaternion.identity();camera.up.set(0,1,0);
    camera.fov=THREE.MathUtils.radToDeg(2*Math.atan(height/(2*f)));camera.aspect=width/height;camera.updateProjectionMatrix();
  }
  renderer.setAnimationLoop(draw);
  onReady?.();
  return {
    actionLabel: profile.action,
    replay(){started=elapsed;},
    toggleDetail(){detailActive=!detailActive;renderer.domElement.dataset.detail=String(detailActive);return detailActive;},
    track,
    setVisible(value){visible=value;},
    dispose(){
      if(disposed)return;disposed=true;observer.disconnect();renderer.setAnimationLoop(null);
      for(const group of [root,steps,willow,lanternGroup,boat,wake,water]) {
        group.traverse(object=>{if(object.shadow)object.shadow.dispose();if(object.geometry)disposables.add(object.geometry);const mats=Array.isArray(object.material)?object.material:[object.material];mats.filter(Boolean).forEach(m=>disposables.add(m));});
      }
      renderer.domElement.removeEventListener('pointerdown',down);
      renderer.domElement.removeEventListener('pointermove',move);
      renderer.domElement.removeEventListener('pointerup',up);
      renderer.domElement.removeEventListener('pointercancel',up);
      disposables.forEach(resource=>resource.dispose());renderer.dispose();renderer.forceContextLoss();renderer.domElement.remove();
    }
  };
}
