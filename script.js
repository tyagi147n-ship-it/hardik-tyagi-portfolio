const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.section-label, .intro-grid, .stats, .work-heading, .project-card, .more-projects, .experience-row, .education-row, .skills-layout, .cert-strip, .contact h2, .contact-email').forEach((el) => {
  el.classList.add('reveal');
  observer.observe(el);
});

document.getElementById('year').textContent = new Date().getFullYear();

// Interactive, dependency-free 3D particle globe.
(() => {
  const canvas = document.getElementById('cosmos');
  const stage = document.querySelector('.three-stage');
  if (!canvas || !stage) return;
  const ctx = canvas.getContext('2d');
  const points = [];
  const rows = 13, columns = 28;
  for (let row = 1; row < rows; row++) {
    const latitude = -Math.PI / 2 + Math.PI * row / rows;
    for (let col = 0; col < columns; col++) {
      const longitude = Math.PI * 2 * col / columns;
      points.push({x: Math.cos(latitude) * Math.cos(longitude), y: Math.sin(latitude), z: Math.cos(latitude) * Math.sin(longitude), row, col});
    }
  }
  const stars = Array.from({length: 90}, () => ({x: Math.random()*2-1, y: Math.random()*2-1, z: Math.random(), r: Math.random()*1.5+.3, phase: Math.random()*7}));
  let width=0,height=0,dpr=1,drag=false,lastX=0,lastY=0,rotX=-.25,rotY=.3,targetX=rotX,targetY=rotY,frame=0;
  function resize(){const box=stage.getBoundingClientRect();dpr=Math.min(window.devicePixelRatio||1,2);width=box.width;height=box.height;canvas.width=Math.round(width*dpr);canvas.height=Math.round(height*dpr);ctx.setTransform(dpr,0,0,dpr,0,0)}
  const observer=new ResizeObserver(resize);observer.observe(stage);resize();
  function pointerMove(e){const box=stage.getBoundingClientRect();if(drag){targetY+=(e.clientX-lastX)*.008;targetX+=(e.clientY-lastY)*.008;lastX=e.clientX;lastY=e.clientY}else{targetY=(e.clientX-box.left-box.width/2)/box.width*.75;targetX=(e.clientY-box.top-box.height/2)/box.height*.48-.15}}
  stage.addEventListener('pointerdown',e=>{drag=true;lastX=e.clientX;lastY=e.clientY;stage.setPointerCapture?.(e.pointerId)});
  stage.addEventListener('pointermove',pointerMove);
  const stop=()=>{drag=false};stage.addEventListener('pointerup',stop);stage.addEventListener('pointercancel',stop);stage.addEventListener('pointerleave',()=>{if(!drag){targetX=-.25;targetY=.3}});
  function project(p,cx,cy,r){let x=p.x*Math.cos(rotY)-p.z*Math.sin(rotY),z=p.x*Math.sin(rotY)+p.z*Math.cos(rotY),y=p.y*Math.cos(rotX)-z*Math.sin(rotX);z=p.y*Math.sin(rotX)+z*Math.cos(rotX);const perspective=2.7/(2.7-z*.32);return{x:cx+x*r*perspective,y:cy+y*r*perspective,z,scale:perspective}}
  function draw(){frame+=.012;rotX+=(targetX-rotX)*.055;rotY+=(targetY-rotY)*.055;ctx.clearRect(0,0,width,height);const cx=width*.52,cy=height*.49,r=Math.min(width,height)*.36;
    for(const s of stars){const twinkle=(Math.sin(frame*1.8+s.phase)+1)/2;ctx.beginPath();ctx.fillStyle=`rgba(177,174,255,${.12+twinkle*.48})`;ctx.arc((s.x*.5+.5)*width,(s.y*.5+.5)*height,s.r*(.65+twinkle*.5),0,Math.PI*2);ctx.fill()}
    const projected=points.map(p=>project(p,cx,cy,r));ctx.lineWidth=.65;
    for(let i=0;i<points.length;i++){const p=points[i],a=projected[i];if(a.z<-.18)continue;for(const [nr,nc] of [[p.row,p.col+1],[p.row+1,p.col]]){const wrapped=nc%columns;const idx=(nr-1)*columns+wrapped;if(idx<0||idx>=points.length)continue;const b=projected[idx];if(b.z<-.24)continue;const alpha=Math.min(.55,Math.max(.08,(a.z+b.z+1.4)*.22));ctx.strokeStyle=`rgba(${Math.round(104+100*(p.col/columns))},${Math.round(128+45*(p.row/rows))},255,${alpha})`;ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.stroke()}}
    for(let i=0;i<projected.length;i++){const p=projected[i];if(p.z<-.35)continue;const alpha=.25+Math.max(0,p.z)*.65;ctx.beginPath();ctx.fillStyle=`rgba(${i%3===0?196:135},${i%3===0?139:151},255,${alpha})`;ctx.arc(p.x,p.y,(i%5===0?1.8:1.05)*p.scale,0,Math.PI*2);ctx.fill()}
    ctx.save();ctx.translate(cx,cy);ctx.rotate(-.35+Math.sin(frame*.22)*.04);ctx.beginPath();ctx.ellipse(0,0,r*1.23,r*.37,0,0,Math.PI*2);ctx.strokeStyle='rgba(158,117,255,.38)';ctx.lineWidth=1;ctx.stroke();ctx.beginPath();ctx.ellipse(0,0,r*1.34,r*.43,0,0,Math.PI*2);ctx.strokeStyle='rgba(91,124,255,.2)';ctx.stroke();ctx.restore();
    const glow=ctx.createRadialGradient(cx-r*.34,cy-r*.36,0,cx,cy,r*1.05);glow.addColorStop(0,'rgba(134,105,255,.10)');glow.addColorStop(.65,'rgba(70,89,255,.035)');glow.addColorStop(1,'rgba(0,0,0,0)');ctx.fillStyle=glow;ctx.beginPath();ctx.arc(cx,cy,r*1.05,0,Math.PI*2);ctx.fill();requestAnimationFrame(draw)}
  requestAnimationFrame(draw);
})();

// Subtle pointer tilt makes project panels feel like physical cards.
document.querySelectorAll('.project-card').forEach(card=>{
  card.addEventListener('pointermove',e=>{if(matchMedia('(prefers-reduced-motion: reduce)').matches)return;const r=card.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;const visual=card.querySelector('.project-visual');visual.style.transform=`perspective(850px) rotateX(${y*-3}deg) rotateY(${x*3}deg) translateY(-4px)`});
  card.addEventListener('pointerleave',()=>{card.querySelector('.project-visual').style.transform=''})
});
