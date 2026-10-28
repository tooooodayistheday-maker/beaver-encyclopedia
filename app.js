(() => {
 const facts=[...(window.BEAVER_ARCHIVE||[]),...window.BEAVER_FACTS], sources=window.BEAVER_SOURCES, $=s=>document.querySelector(s);
 const safeRead=(k,d)=>{try{return JSON.parse(localStorage.getItem(k))??d;}catch{return d;}};
 let saved=new Set(safeRead('beaver-saved',[]).filter(id=>facts.some(f=>f.id===id))),category='全部知識',savedOnly=false;
 const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const track=(n,p)=>window.beaverAnalytics?.event(n,p);
 const icons={
 teeth:'<path d="M39 20q21 5 42 0l-5 55q-14 12-22 0l-8 0z" fill="#f4d4a3"/><path d="M60 25v48" stroke="#ae663e" stroke-width="3"/><path d="M41 24l5 30h31l2-30" fill="#ca8651"/>',
 tail:'<ellipse cx="61" cy="48" rx="24" ry="38" transform="rotate(28 61 48)" fill="#a7825c"/><path d="M45 24l30 40M40 37l28 37M48 63l32-32M43 47l27-27" stroke="#795e43" stroke-width="2"/>',
 feet:'<path d="M37 70q-12-22-8-32l17 11 5-24 11 23 19-16-2 24 14 5-24 17z" fill="#9d7954"/><path d="M47 58l11 12m4-17l1 16m13-11l-9 12" stroke="#e5c294" stroke-width="2"/>',
 water:'<path d="M60 10q-36 42-30 57 28 34 58 0 7-17-28-57" fill="#7fa89e"/><path d="M43 57q-5 15 9 17M24 84h73" stroke="#edf2e8" stroke-width="4" fill="none"/>',
 leaf:'<path d="M30 75Q15 20 93 15q10 68-58 63" fill="#7e9566"/><path d="M27 84l48-49M44 65l-1-23m15 8l22 0" stroke="#d6ddbb" stroke-width="3" fill="none"/>',
 home:'<path d="M15 68Q30 10 63 18q35 0 47 50" fill="#a88a5d"/><path d="M26 57l67-20M29 35l63 26M36 21l44 45M17 58l76-33" stroke="#755e40" stroke-width="4"/><path d="M7 72q21-9 42 0t43 0t22 0" stroke="#739c8c" stroke-width="5" fill="none"/>',
 dam:'<path d="M12 69l18-35 66 4 13 33z" fill="#8e7852"/><path d="M19 55l77-10M25 40l76 22M30 32l43 38M15 69l84-22" stroke="#c6a671" stroke-width="7"/><path d="M8 78q24-8 47 0t55 0" stroke="#719d91" stroke-width="4" fill="none"/>'
 };
 const icon=f=>`<svg aria-hidden="true" viewBox="0 0 120 100">${icons[f.icon]||icons.water}</svg>`;
 function persist(){try{localStorage.setItem('beaver-saved',JSON.stringify([...saved]));}catch{toast('目前無法儲存收藏，請檢查瀏覽器設定。');}}
 let toastTimer;function toast(text){$('#toast').textContent=text;$('#toast').hidden=false;clearTimeout(toastTimer);toastTimer=setTimeout(()=>$('#toast').hidden=true,2300);}
 function toggleSave(id){saved.has(id)?saved.delete(id):saved.add(id);persist();track('fact_bookmark',{fact_id:id,saved:saved.has(id)});render();const btn=$('#detail [data-save]');if(btn){btn.textContent=saved.has(id)?'已收藏 ♥':'收藏這則知識 ♡';btn.setAttribute('aria-pressed',saved.has(id));}}
 function reset(){category='全部知識';savedOnly=false;$('#search').value='';render();}
 function render(){
  const q=$('#search').value.trim().toLocaleLowerCase();
  const filtered=facts.filter(f=>(category==='全部知識'||f.category===category)&&(!savedOnly||saved.has(f.id))&&(!q||[f.title,f.summary,f.body,f.species].join(' ').toLocaleLowerCase().includes(q)));
  $('.filters').innerHTML=['全部知識','Threads 河狸短篇','河狸事件簿','萬物冷知識','身體祕密','生活日常','築壩工程','生態影響'].map(c=>`<button class="${category===c?'active':''}" aria-pressed="${category===c}" data-category="${c}">${c}</button>`).join('');
  $('#cards').innerHTML=filtered.map(f=>`<article class="card"><div class="card-visual"><span class="card-no">NOTE ${String(facts.indexOf(f)+1).padStart(3,'0')}</span>${icon(f)}<button class="save" data-save="${f.id}" aria-label="${saved.has(f.id)?'取消收藏':'收藏'}：${esc(f.title)}" aria-pressed="${saved.has(f.id)}">${saved.has(f.id)?'♥':'♡'}</button></div><div class="card-body"><span class="card-category">${f.category}${f.publishedDate?` · ${f.publishedDate}`:''}</span><h3>${esc(f.title)}</h3><p>${esc(f.summary)}</p><div class="card-bottom"><span>${f.species}</span><button class="plain" data-open="${f.id}">閱讀筆記 ↗</button></div></div></article>`).join('');
  $('#results').textContent=`${savedOnly?'我的收藏 · ':''}共 ${filtered.length} 則知識筆記`;
  $('#savedCount').textContent=saved.size;$('#savedNav').setAttribute('aria-pressed',savedOnly);$('#clear').hidden=category==='全部知識'&&!savedOnly&&!q;$('#empty').hidden=filtered.length>0;
 }
 function openFact(id){const f=facts.find(x=>x.id===id);if(!f)return;
  $('#detailContent').innerHTML=`<p class="eyebrow">FIELD NOTE ${String(facts.indexOf(f)+1).padStart(3,'0')} / ${f.category}</p><h2>${esc(f.title)}</h2><span class="detail-species">${f.scopeLabel||'適用範圍'}：${esc(f.species)}${f.publishedDate?` · Threads 發布 ${f.publishedDate}`:''}</span>${f.eventDate?`<p class="detail-species">事件時間：${esc(f.eventDate)}</p>`:''}${f.archive?'':`<p><b>${esc(f.summary)}</b></p>`}${(f.paragraphs||[f.body]).map(p=>`<p>${esc(p).replace(/\n/g,'<br>')}</p>`).join('')}${(f.sourceIds||[f.source]).map(id=>`<a class="source-link" href="${esc(sources[id].url)}" target="_blank" rel="noopener">參考來源：${esc(sources[id].name)} ↗</a>`).join('')}${f.threadsUrl?`<a class="source-link" href="${esc(f.threadsUrl)}" target="_blank" rel="noopener">閱讀 Threads 原文 ↗</a>`:''}<div class="hero-actions"><button class="button" data-save="${f.id}" aria-pressed="${saved.has(f.id)}">${saved.has(f.id)?'已收藏 ♥':'收藏這則知識 ♡'}</button><button class="plain" data-share="${f.id}">複製分享連結 ↗</button></div>`;
  if(!$('#detail').open)$('#detail').showModal();track('fact_open',{fact_id:id,category:f.category});
 }
 document.addEventListener('click',async e=>{const t=e.target.closest('button');if(!t)return;
  if(t.dataset.category){category=t.dataset.category;savedOnly=false;track('category_select',{category});render();}
  if(t.dataset.open)openFact(t.dataset.open);
  if(t.dataset.save)toggleSave(t.dataset.save);
  if(t.dataset.share){const url=location.origin+location.pathname+'#fact='+t.dataset.share;try{await navigator.clipboard.writeText(url);toast('分享連結已複製');track('share',{method:'copy',content_id:t.dataset.share});}catch{toast('無法自動複製，請使用瀏覽器分享功能。');}}
  if(t.classList.contains('close'))t.closest('dialog').close();
 });
 $('#search').addEventListener('input',render);$('#clear').onclick=reset;$('#reset').onclick=reset;
 $('#savedNav').onclick=()=>{savedOnly=!savedOnly;category='全部知識';$('#search').value='';render();$('#explore').scrollIntoView();};
 $('#random').onclick=()=>{openFact(facts[Math.floor(Math.random()*facts.length)].id);track('random_fact');};
 const quizzes=[
  ['河狸的門牙為什麼是橘色？',['常喝紅茶','琺瑯質含有鐵','沾到樹皮','年紀太大'],1,'鐵讓琺瑯質呈深橘色，也能強化牙齒。','orange'],
  ['河狸主要吃什麼？',['魚和蝦','水生昆蟲','樹皮與植物','其他小動物'],2,'河狸是草食性動物，住水邊也不代表吃魚。','plants'],
  ['每個河狸棲地都有水壩嗎？',['一定都有','只有冬天有','水深足夠可能不築壩','只有北美河狸築壩'],2,'是否築壩，與河道寬度、水位和棲地條件有關。','notall'],
  ['尾巴用力拍水通常表示？',['危險警報','準備冬眠','正在捕魚','發現新樹木'],0,'拍水聲會提醒同伴，附近可能有危險。','alarm'],
  ['壩與巢穴的功能有何不同？',['完全相同','壩蓄水，巢穴用來居住','壩用來存魚','巢穴讓水流加速'],1,'壩改變水位，巢穴則提供休息與繁殖的空間。','dams']
 ];let qi=0,score=0,answered=false;
 function renderQuiz(){answered=false;const c=$('#quizCard');if(qi>=quizzes.length){c.innerHTML=`<p class="eyebrow">CHALLENGE COMPLETE</p><h3>你答對了 ${score} / 5 題！</h3><p>${score===5?'你已經是河狸觀察家了！':'每一次好奇，都讓你更靠近河狸的世界。'}</p><button class="button" id="again">再挑戰一次 ↻</button>`;$('#again').onclick=()=>{qi=0;score=0;renderQuiz();};track('quiz_complete',{score,total:5});return;}
 const q=quizzes[qi];c.innerHTML=`<div class="progress"><span>QUESTION ${String(qi+1).padStart(2,'0')}</span><span>${qi+1} / 5</span></div><h3>${q[0]}</h3><div class="answers">${q[1].map((a,i)=>`<button data-answer="${i}">${String.fromCharCode(65+i)}. ${a}</button>`).join('')}</div><div class="quiz-feedback" aria-live="polite"></div>`;
 c.querySelectorAll('[data-answer]').forEach(b=>b.onclick=()=>{if(answered)return;answered=true;const a=Number(b.dataset.answer),right=a===q[2];if(right)score++;c.querySelectorAll('[data-answer]').forEach(x=>{x.disabled=true;if(Number(x.dataset.answer)===q[2])x.classList.add('correct');});if(!right)b.classList.add('wrong');c.querySelector('.quiz-feedback').innerHTML=`<p>${right?'答對了！':'再認識一點：'}${q[3]}</p><button class="plain" data-open="${q[4]}">閱讀相關筆記 ↗</button> · <button class="plain" id="next">${qi===4?'查看結果':'下一題'} →</button>`;$('#next').onclick=()=>{qi++;renderQuiz();};track('quiz_answer',{question_id:q[4],correct:right});});
 }
 $('#privacy').onclick=()=>{$('#analyticsStatus').textContent=window.BEAVER_CONFIG?.gaId?`目前設定：${window.beaverAnalytics.allowed()?'已允許分析':'尚未允許分析'}。`:'網站分析尚未啟用，等待管理者設定 GA4。';$('#privacyDialog').showModal();};
 $('#allow').onclick=()=>{window.beaverAnalytics.consent(true);$('#privacyDialog').close();toast('已儲存分析偏好');};$('#deny').onclick=()=>{window.beaverAnalytics.consent(false);$('#privacyDialog').close();toast('已停用網站分析');};
 $('#totalFacts').textContent=facts.length;render();renderQuiz();
 if(location.hash.startsWith('#fact='))openFact(decodeURIComponent(location.hash.slice(6)));
})();
