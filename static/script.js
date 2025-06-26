document.addEventListener('DOMContentLoaded', () => {
  const bgCanvas = document.getElementById('bgCanvas');
  const fgCanvas = document.getElementById('fgCanvas');
  const glass    = document.getElementById('glass');
  const labelLayer = document.getElementById('labels');
  const gridOverlay = document.getElementById('gridOverlay');
  const message = document.getElementById('message');
  const folderSelect = document.getElementById('folderSelect');

  // three.js setup
  const bgRenderer = new THREE.WebGLRenderer({ canvas: bgCanvas, antialias:true });
  bgRenderer.setClearColor(0xffffff);
  const fgRenderer = new THREE.WebGLRenderer({ canvas: fgCanvas, antialias:true, alpha:true });
  fgRenderer.setClearColor(0,0);
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(70, window.innerWidth/window.innerHeight, 0.1, 1000);
  camera.position.z = 16;
  function resize(){
    bgRenderer.setSize(window.innerWidth, window.innerHeight);
    fgRenderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth/window.innerHeight;
    camera.updateProjectionMatrix();
  }
  window.addEventListener('resize', resize);
  resize();

  scene.add(new THREE.AmbientLight(0xffffff, 0.9));
  const dirLight = new THREE.DirectionalLight(0xffffff, 0.1);
  dirLight.position.set(0,0,4);
  scene.add(dirLight);

  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();
  const cursor3D = new THREE.Vector3();
  let targetMouse = {x:0,y:0}, currentMouse = {x:0,y:0};
  window.addEventListener('mousemove', e => {
    const nx = (e.clientX/window.innerWidth - 0.5)*2;
    const ny = -(e.clientY/window.innerHeight - 0.5)*2;
    targetMouse.x = nx; targetMouse.y = ny;
    mouse.x = (e.clientX/window.innerWidth)*2 - 1;
    mouse.y = -(e.clientY/window.innerHeight)*2 + 1;
    raycaster.setFromCamera(mouse, camera);
    const d = -raycaster.ray.origin.z / raycaster.ray.direction.z;
    cursor3D.copy(raycaster.ray.origin.clone().add(raycaster.ray.direction.clone().multiplyScalar(d)));
  });

  const ease = t => t < 0.5 ? 2*t*t : (-1+(4-2*t)*t);

  function createFolder(name){
    const g = new THREE.Group();
    const frontMat = new THREE.MeshStandardMaterial({ color:0x89d8fd, roughness:0.4, metalness:0.2 });
    const backMat  = new THREE.MeshStandardMaterial({ color:0x5bbde9, roughness:0.45, metalness:0.15 });
    const w=2.5,h=1.8,r=0.15;
    const shape = new THREE.Shape();
    shape.moveTo(-w/2+r,-h/2).lineTo(w/2-r,-h/2).quadraticCurveTo(w/2,-h/2,w/2,-h/2+r)
         .lineTo(w/2,h/2-r).quadraticCurveTo(w/2,h/2,w/2-r,h/2)
         .lineTo(-w/2+r,h/2).quadraticCurveTo(-w/2,h/2,-w/2,h/2-r)
         .lineTo(-w/2,-h/2+r).quadraticCurveTo(-w/2,-h/2,-w/2+r,-h/2);
    const geom = new THREE.ExtrudeGeometry(shape, { depth:0.03, bevelEnabled:true, bevelThickness:0.025, bevelSize:0.025, bevelSegments:2 });
    const front = new THREE.Mesh(geom, frontMat);
    front.geometry.translate(0,0.9,0);
    front.position.z=0.015;
    front.castShadow=true;
    g.add(front);
    const back = new THREE.Mesh(geom.clone(), backMat);
    back.scale.y=1.07;
    back.position.set(0,0.05,-0.015);
    back.receiveShadow=true;
    g.add(back);
    const lipShape = new THREE.Shape();
    lipShape.moveTo(-1.25,0).quadraticCurveTo(-1.25,0.2,-1.1,0.2).lineTo(-0.6,0.2)
            .quadraticCurveTo(-0.45,0.2,-0.3,0).lineTo(-0.3,-0.3)
            .quadraticCurveTo(-0.32,-0.43,-0.6,-0.43).lineTo(-1.22,-0.42)
            .quadraticCurveTo(-1.28,-0.38,-1.24,-0.3).lineTo(-1.25,0);
    const lip = new THREE.Mesh(new THREE.ExtrudeGeometry(lipShape, { depth:0.03, bevelEnabled:true, bevelThickness:0.025, bevelSize:0.025, bevelSegments:2 }), backMat);
    lip.position.set(0,1.9,-0.015);
    lip.receiveShadow=true;
    g.add(lip);
    const dir = new THREE.Vector3((Math.random()-0.5)*2,(Math.random()-0.5)*2,0).normalize();
    g.userData = {
      front, name, dir,
      speed:0.002 + Math.random()*0.001,
      curvePhase:Math.random()*Math.PI*2,
      curveScale:0.005 + Math.random()*0.003,
      focused:false, clickStart:0, startPos:new THREE.Vector3(), targetPos:new THREE.Vector3(-4,1.8,8), duration:1000,
      innerR:1.2, hoverPhase:0,
      returning:false, returnStart:0, returnFrom:new THREE.Vector3(), returnTo:new THREE.Vector3(), returnDuration:1000
    };
    return g;
  }

  const folders = [];
  const labels = [];
  FOLDER_NAMES.forEach(name => {
    const f = createFolder(name);
    scene.add(f);
    folders.push(f);
    const label = document.createElement('div');
    label.className = 'folder-label';
    label.textContent = name;
    labelLayer.appendChild(label);
    labels.push(label);
  });

  const introDur=3000, scatterDur=2000;
  const startTime=performance.now();

  window.addEventListener('click', () => {
    raycaster.setFromCamera(mouse, camera);
    const hits = raycaster.intersectObjects(folders.map(f=>f.userData.front));
    if(!hits.length) return;
    const f = hits[0].object.parent, ud = f.userData;
    if(!ud.focused){
      ud.focused=true;
      ud.clickStart=performance.now();
      ud.startPos.copy(f.position);
      glass.classList.add('visible');
      gridOverlay.classList.add('show');
      folderSelect.value = ud.name;
      message.textContent = `Folder: ${ud.name}`;
      setupInteractiveText(ud.name);
    }else{
      ud.returning=true;
      ud.returnStart=performance.now();
      ud.returnFrom.copy(f.position);
      ud.returnTo.copy(ud.startPos);
      glass.classList.remove('visible');
      gridOverlay.classList.remove('show');
    }
  });

  function animate(){
    requestAnimationFrame(animate);
    const now=performance.now(), dt=now-startTime;
    if(dt < introDur){
      const a=(dt/introDur)*Math.PI*2;
      folders.forEach((f,i)=>{
        const th=(i/folders.length)*Math.PI*2+a;
        f.position.set(Math.cos(th)*5, Math.sin(th)*5, 0);
      });
    }else if(dt < introDur+scatterDur){
      const p=(dt-introDur)/scatterDur;
      folders.forEach((f,i)=>{
        const ti=Math.max(Math.min(p*folders.length-i,1),0), ei=ease(ti);
        const th=(i/folders.length)*Math.PI*2;
        const ctr=new THREE.Vector3(Math.cos(th)*5, Math.sin(th)*5, 0);
        f.position.copy(ctr.add(f.userData.dir.clone().multiplyScalar(ei*3)));
      });
    }else{
      raycaster.setFromCamera(mouse, camera);
      const hoverHits = raycaster.intersectObjects(folders.map(f=>f.userData.front));
      folders.forEach(f=>{
        const ud=f.userData;
        if(ud.returning){
          const t=Math.min((now-ud.returnStart)/ud.returnDuration,1);
          f.position.lerpVectors(ud.returnFrom, ud.returnTo, ease(t));
          if(t>=1){ud.returning=false; ud.focused=false;}
          return;
        }
        if(ud.focused){
          const t=Math.min((now-ud.clickStart)/ud.duration,1);
          f.position.lerpVectors(ud.startPos, ud.targetPos, ease(t));
          return;
        }
        if(hoverHits.find(h=>h.object===ud.front)) ud.front.rotation.x+=(THREE.MathUtils.degToRad(15)-ud.front.rotation.x)*0.1;
        else ud.front.rotation.x+=(0-ud.front.rotation.x)*0.1;
        ud.curvePhase+=0.01;
        const curveVec=new THREE.Vector3(
          Math.sin(ud.curvePhase),
          Math.sin(ud.curvePhase*0.9),
          Math.cos(ud.curvePhase*0.8)
        ).multiplyScalar(ud.curveScale);
        f.position.add(ud.dir.clone().multiplyScalar(ud.speed).add(curveVec));
        ['x','y'].forEach(a=>{ if(f.position[a]>5||f.position[a]<-5) ud.dir[a]*=-1; });
        f.position.z = Math.max(-0.4, Math.min(0.4, f.position.z));
      });
    }
    dirLight.position.x += (targetMouse.x*10 - dirLight.position.x)*0.1;
    dirLight.position.y += (targetMouse.y*10 - dirLight.position.y)*0.1;
    const a2=Math.hypot(targetMouse.x-currentMouse.x, targetMouse.y-currentMouse.y);
    currentMouse.x += (targetMouse.x-currentMouse.x)*0.02*a2;
    currentMouse.y += (targetMouse.y-currentMouse.y)*0.02*a2;
    camera.position.set(currentMouse.x*3,currentMouse.y*3,16);
    camera.lookAt(0,0,0);
    bgRenderer.render(scene,camera);
    const active=folders.find(f=>f.userData.focused);
    folders.forEach(f=>f.visible=!active||f===active);
    fgRenderer.render(scene,camera);
    folders.forEach(f=>f.visible=true);
    updateLabels();
  }

  function updateLabels(){
    folders.forEach((f,i)=>{
      const vector=f.position.clone();
      vector.project(camera);
      const x=(vector.x*0.5+0.5)*window.innerWidth;
      const y=(-vector.y*0.5+0.5)*window.innerHeight;
      labels[i].style.transform=`translate(-50%,0) translate(${x}px,${y+20}px)`;
      labels[i].style.display=f.userData.focused?'none':'block';
    });
  }

  animate();

  // ---- grid overlay script (adapted from grid.html) ----
  const cols=80, rows=45, gap=1;
  const gridContainer=document.getElementById('gridContainer');
  const grid=document.getElementById('grid');
  for(let i=0;i<cols*rows;i++){
    const c=document.createElement('div');
    c.className='cell';
    grid.appendChild(c);
  }
  function getSizes(){
    const cell=grid.querySelector('.cell');
    const rect=cell.getBoundingClientRect();
    return { size: rect.width, step: rect.width + gap };
  }

  let folder = FOLDER_NAMES[0];
  folderSelect.innerHTML = FOLDER_NAMES.map(f=>`<option value="${f}">${f}</option>`).join('');
  folderSelect.value=folder;
  setupInteractiveText(folder);
  message.textContent = `Folder: ${folder}`;

  folderSelect.addEventListener('change', () => {
    folder = folderSelect.value;
    setupInteractiveText(folder);
    message.textContent = `Folder: ${folder}`;
  });

  // placeholder for layout functions
  function setupInteractiveText(text){
    const C=document.querySelector('#rightBox .interactive-text');
    if(!C) return;
    C.textContent=text||'';
    const hoverScale=1.8, neighborScale=1.2, normalWght=400, neighborWght=600, hoverWght=900;
    const txt=C.textContent.trim();
    C.textContent='';
    for(const ch of txt){
      const out=document.createElement('span');
      out.className='letter';
      const inn=document.createElement('span');
      inn.className='char';
      inn.textContent=ch;
      out.appendChild(inn);
      C.appendChild(out);
    }
    const letters=Array.from(C.children); const n=letters.length; let base=[],scaled=[],sum=0,total=0;
    requestAnimationFrame(()=>{
      letters.forEach(o=>{const inn=o.firstElementChild; inn.style.transform='scaleX(1)'; const w=inn.getBoundingClientRect().width; base.push(w); sum+=w;});
      total=C.getBoundingClientRect().width; const S=total/sum; scaled=base.map(w=>w*S);
      letters.forEach((o,i)=>{const inn=o.firstElementChild; o.style.width=`${scaled[i]}px`; inn.style.width=`${base[i]}px`; inn.style.transform=`scaleX(${S})`; inn.style.fontVariationSettings=`'wght' ${normalWght}`;});
      letters.forEach((o,i)=>{o.onmouseenter=()=>{const Rh=hoverScale,Rn=neighborScale; const wH=scaled[i]; const wN=(i>0?scaled[i-1]:0)+(i<n-1?scaled[i+1]:0); const wO=total-wH-wN; const Ro=(total-wH*Rh-wN*Rn)/wO; letters.forEach((oo,j)=>{const ch=oo.firstElementChild; let R,wght; if(j===i){R=Rh;wght=hoverWght;}else if(j===i-1||j===i+1){R=Rn;wght=neighborWght;}else{R=Ro;wght=normalWght;} oo.style.width=`${scaled[j]*R}px`; ch.style.transform=`scaleX(${S*R})`; ch.style.fontVariationSettings=`'wght' ${wght}`;});}; o.onmouseleave=()=>{letters.forEach((oo,j)=>{const ch=oo.firstElementChild; oo.style.width=`${scaled[j]}px`; ch.style.transform=`scaleX(${S})`; ch.style.fontVariationSettings=`'wght' ${normalWght}`;});};});
    });
  }
});
