/* Small, pausable motion; no third-party runtime. Content remains usable without it. */
(() => {
 const reduced=matchMedia('(prefers-reduced-motion: reduce)'),root=document.documentElement;
 let manual;try{manual=localStorage.getItem('beaver-motion');}catch{}
 let enabled=manual?manual==='on':!reduced.matches;
 const toggle=document.querySelector('#motionToggle');
 function apply(){root.classList.toggle('motion-paused',!enabled);toggle.textContent=enabled?'Ⅱ 暫停動畫':'▷ 開啟動畫';toggle.setAttribute('aria-pressed',String(enabled));}
 toggle.addEventListener('click',()=>{enabled=!enabled;try{localStorage.setItem('beaver-motion',enabled?'on':'off');}catch{}apply();});
 reduced.addEventListener('change',e=>{enabled=!e.matches;apply();});apply();
 if(!('IntersectionObserver' in window))return;
 const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('is-visible');observer.unobserve(entry.target);}}),{threshold:.07,rootMargin:'0px 0px 30px 0px'});
 function observe(){document.querySelectorAll('.card:not([data-motion]),.section-top:not([data-motion]),.quiz-layout:not([data-motion]),.source-section:not([data-motion])').forEach((el,i)=>{el.dataset.motion='';el.style.setProperty('--reveal-delay',`${el.classList.contains('card')?(i%3)*70:0}ms`);el.classList.add('reveal');observer.observe(el);});}
 observe();new MutationObserver(observe).observe(document.querySelector('#cards'),{childList:true});
 new MutationObserver(observe).observe(document.querySelector('#storyCards'),{childList:true});
 const scene=document.querySelector('.hero-art'),fine=matchMedia('(hover:hover) and (pointer:fine)');
 
 const phases=[['day','白天 · 窩邊休息'],['dusk','黃昏 · 啃啃枝條'],['night','夜晚 · 游水搬枝'],['dawn','晨光 · 整理毛皮']];let phaseIndex=0,phaseTime=0,lastFrame=0;
 function paintPhase(){scene.dataset.dayPhase=phases[phaseIndex][0];document.querySelector('#dayPhaseLabel').textContent=phases[phaseIndex][1];}
 paintPhase();document.querySelector('#changeDayPhase').addEventListener('click',()=>{phaseIndex=(phaseIndex+1)%phases.length;phaseTime=0;paintPhase();window.beaverAnalytics?.event('day_phase_select',{phase:phases[phaseIndex][0]});});
 setInterval(()=>{if(!enabled||reduced.matches||document.hidden)return;phaseTime+=1000;if(phaseTime>=9000){phaseTime=0;phaseIndex=(phaseIndex+1)%phases.length;paintPhase();}},1000);

 scene.addEventListener('pointermove',e=>{if(!enabled||!fine.matches)return;const r=scene.getBoundingClientRect();scene.style.setProperty('--scene-x',`${((e.clientX-r.left)/r.width-.5)*7}px`);scene.style.setProperty('--scene-y',`${((e.clientY-r.top)/r.height-.5)*5}px`);});
 scene.addEventListener('pointerleave',()=>{scene.style.setProperty('--scene-x','0px');scene.style.setProperty('--scene-y','0px');});
 document.addEventListener('visibilitychange',()=>root.classList.toggle('tab-hidden',document.hidden));
 // A small action tied to the river, rather than decoration over the text.
 const waterButton=document.querySelector('#waterPlay');let splashTimer;
 waterButton.addEventListener('click',()=>{
  if(!enabled||reduced.matches){document.querySelector('#motionMessage').textContent='開啟動畫後，可以看看河狸拍水的樣子。';return;}
  scene.classList.remove('splashing');void scene.offsetWidth;scene.classList.add('splashing');
  document.querySelector('#motionMessage').textContent='啪！河狸拍拍水面，漣漪散開了。';
  clearTimeout(splashTimer);splashTimer=setTimeout(()=>scene.classList.remove('splashing'),1600);
 });
 // Keep tilts subtle and local to the card being pointed at.
 document.addEventListener('pointermove',e=>{
  if(!enabled||!fine.matches||reduced.matches)return;
  const card=e.target.closest('.card');if(!card)return;const r=card.getBoundingClientRect();
  card.style.setProperty('--tilt-x',`${-((e.clientY-r.top)/r.height-.5)*3}deg`);
  card.style.setProperty('--tilt-y',`${((e.clientX-r.left)/r.width-.5)*3}deg`);
 },{passive:true});
 document.addEventListener('pointerout',e=>{const card=e.target.closest('.card');if(card&&!card.contains(e.relatedTarget)){card.style.setProperty('--tilt-x','0deg');card.style.setProperty('--tilt-y','0deg');}},{passive:true});
 const bar=document.querySelector('#pageProgress');let scrollQueued=false;
 function progress(){const height=root.scrollHeight-innerHeight;bar.style.transform=`scaleX(${height>0?Math.min(1,Math.max(0,scrollY/height)):0})`;scrollQueued=false;}
 addEventListener('scroll',()=>{if(!scrollQueued){scrollQueued=true;requestAnimationFrame(progress);}},{passive:true});
 addEventListener('resize',progress,{passive:true});progress();
})();
