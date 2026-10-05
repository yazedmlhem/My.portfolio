const reduced=matchMedia('(prefers-reduced-motion: reduce)');
const menu=document.querySelector('.menu-toggle'),nav=document.querySelector('#navigation');
function closeMenu(){nav.classList.remove('open');menu.setAttribute('aria-expanded','false');menu.querySelector('span').textContent='＋';}
menu.addEventListener('click',()=>{const open=menu.getAttribute('aria-expanded')!=='true';nav.classList.toggle('open',open);menu.setAttribute('aria-expanded',String(open));menu.querySelector('span').textContent=open?'−':'＋';});
nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',closeMenu));
// A single glass surface travels between navigation items.
const navLiquid=nav.querySelector('.nav-liquid'),navLinks=[...nav.querySelectorAll('a')];
let navActive=navLinks.find(a=>a.hash===location.hash)||navLinks.at(-1),navLockUntil=0,navFrame=0;
function positionNavLiquid(){if(!navActive||!nav.offsetWidth)return;const r=navActive.getBoundingClientRect(),n=nav.getBoundingClientRect();if(!r.width)return;navLiquid.style.width=r.width+'px';navLiquid.style.height=r.height+'px';navLiquid.style.transform=`translate3d(${r.left-n.left-nav.clientLeft}px,${r.top-n.top-nav.clientTop}px,0)`;navLiquid.classList.add('ready');}
function selectNav(a){navActive=a;navLinks.forEach(link=>{if(link===a)link.setAttribute('aria-current','location');else link.removeAttribute('aria-current');});positionNavLiquid();}
navLinks.forEach(a=>a.addEventListener('click',()=>{navLockUntil=performance.now()+1400;selectNav(a);}));
menu.addEventListener('click',()=>requestAnimationFrame(positionNavLiquid));
function trackNav(){navFrame=0;if(performance.now()<navLockUntil)return;let active=null;navLinks.forEach(a=>{const section=document.querySelector(a.hash);if(section&&section.getBoundingClientRect().top<=innerHeight*.38)active=a;});if(active&&active!==navActive)selectNav(active);}
addEventListener('scroll',()=>{if(!navFrame)navFrame=requestAnimationFrame(trackNav);},{passive:true});
addEventListener('resize',positionNavLiquid);addEventListener('hashchange',()=>{const a=navLinks.find(link=>link.hash===location.hash);if(a)selectNav(a);});
document.fonts.ready.then(positionNavLiquid);selectNav(navActive);
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&nav.classList.contains('open')){closeMenu();menu.focus();}});
matchMedia('(min-width:701px)').addEventListener('change',closeMenu);
document.querySelector('#year').textContent=new Date().getFullYear();
const galleries=[
{title:'Identity in motion',category:'LOGO ANIMATION / MOTION',image:'assets/work-logo-motion.jpg',description:'Explore logo animation and motion design in the original YouTube gallery.',url:'https://www.youtube.com/playlist?list=PLLVuZKUC12Qq2UqEyCkW-pnu5Jl_9pcJ0'},
{title:'Designed to connect',category:'GRAPHIC DESIGN / BRANDING',image:'assets/work-designs.jpg',description:'Browse graphic design and brand visuals in the original Google Drive gallery.',url:'https://drive.google.com/drive/folders/1bQDdXAf_wJ9ELHpCj0GLN5t_gw8y8d1W'},
{title:'Beyond the ordinary',category:'BLENDER / AI VISUALS',image:'assets/blender-ai-thumb.jpg',description:'Explore Blender and AI visual works in the original YouTube gallery.',url:'https://www.youtube.com/watch?v=x_m1fFWCgEw&list=PLLVuZKUC12QoCF6CKY_N4pdofCUiRCBo5'},
{title:'Ehdeniyat Festival',category:'CAMPAIGN / VIDEO',image:'assets/ehdeniyat-thumb.jpg',description:'View the Ehdeniyat Festival campaign in the original YouTube gallery.',url:'https://www.youtube.com/watch?v=B72xbkbJAdo&list=PLLVuZKUC12Qr4weWerlJtRsZaD_8ozsQB'}];
const dialog=document.querySelector('.preview-dialog');let previewIndex=0,opener=null;
function renderPreview(i){previewIndex=(i+4)%4;const g=galleries[previewIndex];document.querySelector('.preview-image').src=g.image;document.querySelector('.preview-image').alt=g.title+' gallery cover';document.querySelector('#preview-title').textContent=g.title;document.querySelector('.preview-category').textContent=g.category;document.querySelector('.preview-description').textContent=g.description;document.querySelector('.preview-link').href=g.url;}
function preview(i){stopScroll();opener=document.activeElement;renderPreview(i);dialog.showModal();document.body.classList.add('modal-open');}
document.querySelectorAll('[data-preview]').forEach(b=>b.addEventListener('click',()=>preview(Number(b.dataset.preview))));
document.querySelector('.preview-close').addEventListener('click',()=>dialog.close());document.querySelector('.preview-prev').addEventListener('click',()=>renderPreview(previewIndex-1));document.querySelector('.preview-next').addEventListener('click',()=>renderPreview(previewIndex+1));
dialog.addEventListener('keydown',e=>{if(e.key==='ArrowLeft'||e.key==='ArrowRight'){e.preventDefault();renderPreview(previewIndex+(e.key==='ArrowRight'?1:-1));}});
dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close();}});
dialog.addEventListener('close',()=>{document.body.classList.remove('modal-open');opener?.focus();});
const filters=document.querySelectorAll('[data-filter]'),projects=document.querySelectorAll('.project');
filters.forEach(b=>b.addEventListener('click',()=>{filters.forEach(x=>x.setAttribute('aria-pressed',String(x===b)));let n=0;projects.forEach(p=>{p.hidden=b.dataset.filter!=='all'&&b.dataset.filter!==p.dataset.category;if(!p.hidden){p.classList.add('visible');n++;}});document.querySelector('.filter-status').textContent=`${n} ${n===1?'gallery':'galleries'} shown`;}));
document.querySelectorAll('.service-item').forEach(d=>d.addEventListener('toggle',()=>{if(d.open)document.querySelectorAll('.service-item').forEach(other=>{if(other!==d)other.open=false;});}));
if('IntersectionObserver' in window&&!reduced.matches){const observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');observer.unobserve(e.target);}}),{threshold:.07});document.querySelectorAll('.project,.section-heading,.about-copy,.learning-grid article').forEach(e=>{e.classList.add('reveal-ready');observer.observe(e);});}

function stopScroll(){}
const clamp=(v,a=0,b=1)=>Math.max(a,Math.min(b,v)),ease=v=>{v=clamp(v);return v*v*(3-2*v);};
const sequences=[...document.querySelectorAll('[data-sequence]')].map(el=>({el,p:0,target:0}));
const depthCanvas=document.querySelector('.depth-canvas'),ctx=depthCanvas.getContext('2d');
let width=1,height=1,raf=0,last=0;
const orbitSpace=document.querySelector('.gallery-space'),orbitCards=[...document.querySelectorAll('.fan-card')];
let orbitRotation=0,orbitTarget=0,orbitAuto=!reduced.matches,orbitHover=false,orbitFocus=false,orbitDrag=null,orbitMoved=false;
function orbitVisible(){const r=document.querySelector('.reference-gallery').getBoundingClientRect();return r.top<innerHeight&&r.bottom>0;}
function orbitRunning(){return orbitAuto&&!orbitHover&&!orbitFocus&&!orbitDrag&&!dialog.open&&!document.hidden&&orbitVisible();}
function toggleOrbit(){const b=document.querySelector('.orbit-toggle');b.setAttribute('aria-pressed',String(orbitAuto));b.setAttribute('aria-label',orbitAuto?'Pause automatic gallery rotation':'Start automatic gallery rotation');b.textContent=orbitAuto?'Ⅱ':'▷';}
document.querySelector('.orbit-prev').addEventListener('click',()=>{orbitTarget-=Math.PI/2;start();});
document.querySelector('.orbit-next').addEventListener('click',()=>{orbitTarget+=Math.PI/2;start();});
document.querySelector('.orbit-toggle').addEventListener('click',()=>{orbitAuto=!orbitAuto;toggleOrbit();start();});
orbitCards.forEach(el=>{el.addEventListener('pointerenter',()=>{orbitHover=true;});el.addEventListener('pointerleave',()=>{orbitHover=false;start();});});
orbitSpace.addEventListener('focusin',()=>{orbitFocus=true;});orbitSpace.addEventListener('focusout',e=>{orbitFocus=orbitSpace.contains(e.relatedTarget);start();});
orbitSpace.addEventListener('pointerdown',e=>{if(e.button!==0)return;orbitMoved=false;orbitDrag={id:e.pointerId,x:e.clientX,y:e.clientY,angle:orbitTarget};});
orbitSpace.addEventListener('pointermove',e=>{if(!orbitDrag||e.pointerId!==orbitDrag.id)return;const dx=e.clientX-orbitDrag.x,dy=e.clientY-orbitDrag.y;if(Math.abs(dx)>7&&Math.abs(dx)>Math.abs(dy)){orbitMoved=true;orbitSpace.setPointerCapture(e.pointerId);orbitTarget=orbitDrag.angle+dx/180;start();}});
function endOrbitDrag(e){if(orbitDrag&&e.pointerId===orbitDrag.id){orbitDrag=null;start();}}
orbitSpace.addEventListener('pointerup',endOrbitDrag);orbitSpace.addEventListener('pointercancel',endOrbitDrag);
orbitSpace.addEventListener('click',e=>{if(orbitMoved){e.preventDefault();e.stopPropagation();orbitMoved=false;}},true);
orbitSpace.addEventListener('keydown',e=>{if(e.key==='ArrowRight'||e.key==='ArrowLeft'){e.preventDefault();orbitTarget+=(e.key==='ArrowRight'?1:-1)*Math.PI/2;start();}});
dialog.addEventListener('close',start);addEventListener('visibilitychange',start);toggleOrbit();
const particles=Array.from({length:150},(_,i)=>({x:Math.sin(i*23.17)*2,y:Math.cos(i*17.31)*1.6,z:(i*.618033)%1,size:1+(i%4)*.6}));
function resizeDepth(){const r=depthCanvas.getBoundingClientRect();width=r.width;height=r.height;const dpr=Math.min(devicePixelRatio,2);depthCanvas.width=width*dpr;depthCanvas.height=height*dpr;ctx.setTransform(dpr,0,0,dpr,0,0);}
function drawDepth(p){ctx.clearRect(0,0,width,height);const cx=width/2,cy=height/2,unit=Math.min(width,height)*.2;const glow=ctx.createRadialGradient(cx,cy,10,cx,cy,width*.6);glow.addColorStop(0,'#bfff5720');glow.addColorStop(.25,'#25382050');glow.addColorStop(.7,'#a5ff3a08');glow.addColorStop(1,'#ffffff00');ctx.fillStyle=glow;ctx.fillRect(0,0,width,height);
 for(let i=0;i<11;i++){const z=((i/11-p*.9)%1+1)%1,depth=.15+z*2.5,radius=unit/depth;ctx.strokeStyle=`rgba(169,255,74,${.08*(1-z)})`;ctx.lineWidth=1;ctx.beginPath();ctx.ellipse(cx,cy,radius*1.9,radius,0,0,Math.PI*2);ctx.stroke();}
 particles.forEach(q=>{const z=((q.z-p*1.6)%1+1)%1,depth=.12+z*2.8,x=cx+q.x*unit/depth,y=cy+q.y*unit/depth,trail=1+clamp(p*.8)*7;ctx.strokeStyle=`rgba(157,255,66,${(1-z)*.3})`;ctx.lineWidth=q.size*(1-z);ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x+(x-cx)*trail*.017,y+(y-cy)*trail*.017);ctx.stroke();ctx.fillStyle=`rgba(255,255,255,${(1-z)*.9})`;ctx.beginPath();ctx.arc(x,y,q.size*(1-z)+.4,0,Math.PI*2);ctx.fill();});
}
function paint(s){const p=s.p,mobile=innerWidth<=700,travel=mobile?innerWidth*.85:innerWidth*.55;
 if(s.el.dataset.sequence==='intro'){const build=ease(p/.88),finish=ease((p-.8)/.2);document.querySelector('.held-timeline').style.setProperty('--fill',build*100+'%');document.querySelector('.hero-playhead').style.left=build*100+'%';document.querySelector('.edit-progress').textContent=Math.round(build*100)+'%';const frames=Math.round(build*18*30);document.querySelector('.held-time').textContent='00:'+String(Math.floor(frames/30)).padStart(2,'0')+':'+String(frames%30).padStart(2,'0');document.querySelector('.timeline-state').textContent=build>.98?'THE STORY IS READY':build>.55?'ADDING THE FINAL DETAILS':build>.08?'BUILDING THE STORY':'SCROLL TO BEGIN THE EDIT';document.querySelector('.hero-hand').style.transform=`translate3d(${p*18}px,${-p*22}px,0) rotate(${p*2}deg)`;document.querySelector('.held-timeline').style.transform=`translateX(-50%) perspective(1200px) rotateX(${reduced.matches?0:10-p*7}deg) rotateZ(${reduced.matches?0:-5+p*4}deg)`;document.querySelector('.held-preview img').style.filter=`saturate(${.2+build*.8}) brightness(${.6+build*.35})`;}
 if(s.el.dataset.sequence==='editing'){const cut=ease(p/.35),grade=ease((p-.28)/.34),render=ease((p-.65)/.35),stage=p<.33?0:p<.67?1:2;document.querySelector('.console-stage').textContent=['01 / CUT & RHYTHM','02 / COLOUR & FEELING','03 / FINISH & EXPORT'][stage];document.querySelector('.trim-left').style.left=(5+cut*10)+'%';document.querySelector('.trim-right').style.right=(5+cut*10)+'%';document.querySelector('.console-preview>img').style.filter=`saturate(${.15+grade*1.1}) contrast(${.9+grade*.2}) brightness(${.85+grade*.15})`;document.querySelector('.grade-overlay').style.opacity=grade*.18;document.querySelector('.export-overlay').style.opacity=ease((p-.63)/.08);document.querySelector('.export-meter i').style.transform=`scaleX(${render})`;document.querySelector('.export-percent').textContent=Math.round(render*100)+'%';document.querySelectorAll('.console-tools>div').forEach((el,i)=>el.classList.toggle('active',i===stage));document.querySelectorAll('.lab-explanation p').forEach((el,i)=>{el.style.opacity=i===stage?1:0;el.style.visibility=i===stage?'visible':'hidden';});document.querySelector('.lab-timeline>i').style.left=(p*94)+'%';}
 if(s.el.dataset.sequence==='dimension'){const grow=ease(p/.25);document.querySelector('.dimension-surface').style.clipPath=`inset(${(1-grow)*10}% ${(1-grow)*7}% round ${(1-grow)*55}px)`;document.querySelector('.dimension-copy h2').style.letterSpacing=(-.055+p*.012)+'em';drawDepth(p);}
 if(s.el.dataset.sequence==='skills'){document.querySelectorAll('.skill-ribbon').forEach((el,i)=>{const enter=ease((p-i*.15)/.5),direction=i%2?-1:1;el.style.transform=`translateX(${direction*(1-enter)*85}%)`;el.style.opacity=.25+enter*.75;el.querySelector('i').style.transform=`translateX(${(enter-.5)*35}px) rotate(${enter*90}deg)`;});}
 if(s.el.dataset.sequence==='gallery'){const radius=mobile?innerWidth*.3:Math.min(innerWidth*.27,360),depth=mobile?90:190,rotation=p*Math.PI*2+orbitRotation;orbitCards.forEach((el,i)=>{const angle=rotation+i*Math.PI/2,x=Math.sin(angle)*radius,z=Math.cos(angle)*depth,y=Math.cos(angle)*(mobile?28:45),yaw=-Math.sin(angle)*38,roll=Math.sin(angle)*5;el.style.transform=`translate3d(calc(-50% + ${x}px),calc(-50% + ${y}px),${z}px) rotateY(${reduced.matches?0:yaw}deg) rotateZ(${reduced.matches?0:roll}deg)`;el.style.zIndex=Math.round(z+300);el.style.opacity=.48+(Math.cos(angle)+1)*.26;});}
 if(s.el.dataset.sequence==='outro'){const el=document.querySelector('.horizontal-phrase'),distance=el.scrollWidth-innerWidth+innerWidth*.14;el.style.transform=`translate3d(${-p*distance}px,0,0)`;}
}
function mix(a,b,t){return a+(b-a)*t;}
function targets(){sequences.forEach(s=>{const r=s.el.getBoundingClientRect(),pin=s.el.querySelector('.reference-pin');s.target=clamp(-r.top/(s.el.offsetHeight-pin.offsetHeight));});start();}
function animate(now){const dt=Math.min((now-last)/1000,.05)||.016;last=now;let moving=false;const spinning=orbitRunning();if(spinning){orbitTarget+=dt*.2;moving=true;}orbitRotation=reduced.matches?orbitTarget:mix(orbitRotation,orbitTarget,1-Math.exp(-9*dt));if(Math.abs(orbitTarget-orbitRotation)>.0001)moving=true;sequences.forEach(s=>{const changed=Math.abs(s.p-s.target)>.0001;s.p=reduced.matches?s.target:mix(s.p,s.target,1-Math.exp(-12*dt));if(Math.abs(s.p-s.target)>.0001)moving=true;else s.p=s.target;if(changed||(s.el.dataset.sequence==='gallery'&&orbitVisible()))paint(s);});raf=moving?requestAnimationFrame(animate):0;}
function start(){if(!raf){last=performance.now();raf=requestAnimationFrame(animate);}}
addEventListener('scroll',targets,{passive:true});addEventListener('resize',()=>{resizeDepth();sequences.forEach(paint);targets();});resizeDepth();sequences.forEach(s=>{const r=s.el.getBoundingClientRect();s.p=s.target=clamp(-r.top/(s.el.offsetHeight-s.el.querySelector('.reference-pin').offsetHeight));paint(s);});


start();
