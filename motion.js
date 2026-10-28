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
 const scene=document.querySelector('.hero-art'),fine=matchMedia('(hover:hover) and (pointer:fine)');
 scene.addEventListener('pointermove',e=>{if(!enabled||!fine.matches)return;const r=scene.getBoundingClientRect();scene.style.setProperty('--scene-x',`${((e.clientX-r.left)/r.width-.5)*7}px`);scene.style.setProperty('--scene-y',`${((e.clientY-r.top)/r.height-.5)*5}px`);});
 scene.addEventListener('pointerleave',()=>{scene.style.setProperty('--scene-x','0px');scene.style.setProperty('--scene-y','0px');});
 document.addEventListener('visibilitychange',()=>root.classList.toggle('tab-hidden',document.hidden));
})();
