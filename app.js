(() => {
 const facts=[...(window.BEAVER_ARCHIVE||[]),...window.BEAVER_FACTS], sources=window.BEAVER_SOURCES, $=s=>document.querySelector(s);
 const safeRead=(k,d)=>{try{return JSON.parse(localStorage.getItem(k))??d;}catch{return d;}};
 let saved=new Set(safeRead('beaver-saved',[]).filter(id=>facts.some(f=>f.id===id))),category='全部知識',savedOnly=false,speciesFilter='全部河狸';
 const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const track=(n,p)=>window.beaverAnalytics?.event(n,p);
 const speciesOf=f=>{const text=[f.title,f.species,f.body].join(' ');const north=/北美河狸|加拿大河狸|Castor canadensis/i.test(text),eurasia=/歐亞河狸|歐洲河狸|Castor fiber/i.test(text);return north&&!eurasia?'北美河狸':eurasia&&!north?'歐亞河狸':'未明確標示';};
 const contentType=id=>facts.find(f=>f.id===id)?.category==='河狸事件簿'?'long_story':'short_fact';
 const copyTimers=new WeakMap();
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
 function toggleSave(id){saved.has(id)?saved.delete(id):saved.add(id);persist();track('fact_bookmark',{fact_id:id,content_type:contentType(id),saved:saved.has(id)});render();const btn=$('#detail [data-save]');if(btn){btn.textContent=saved.has(id)?'已收藏 ♥':'收藏這則知識 ♡';btn.setAttribute('aria-pressed',saved.has(id));}}
 function reset(){speciesFilter='全部河狸';category='全部知識';savedOnly=false;$('#search').value='';render();}
 function render(){
  const q=$('#search').value.trim().toLocaleLowerCase();
  const matches=f=>(speciesFilter==='全部河狸'||speciesOf(f)===speciesFilter)&&(!savedOnly||saved.has(f.id))&&(!q||[f.title,f.summary,f.body,f.species].join(' ').toLocaleLowerCase().includes(q));
  const filtered=facts.filter(f=>f.category!=='河狸事件簿'&&(category==='全部知識'||f.category===category)&&matches(f));
  const stories=facts.filter(f=>f.category==='河狸事件簿'&&matches(f));
  $('#speciesFilters').innerHTML=['全部河狸','北美河狸','歐亞河狸','未明確標示'].map(label=>`<button data-species="${label}" aria-pressed="${speciesFilter===label}" class="${speciesFilter===label?'active':''}">${label}</button>`).join('');
  $('.filters').innerHTML=['全部知識','Threads 河狸短篇','身體祕密','生活日常','築壩工程','生態影響'].map(c=>`<button class="${category===c?'active':''}" aria-pressed="${category===c}" data-category="${c}">${c}</button>`).join('');
  $('#cards').innerHTML=filtered.map(f=>`<article class="card"><div class="card-visual"><span class="card-no">NOTE ${String(facts.indexOf(f)+1).padStart(3,'0')}</span>${icon(f)}<button class="save" data-save="${f.id}" aria-label="${saved.has(f.id)?'取消收藏':'收藏'}：${esc(f.title)}" aria-pressed="${saved.has(f.id)}">${saved.has(f.id)?'♥':'♡'}</button></div><div class="card-body"><span class="card-category">${f.category}${f.publishedDate?` · ${f.publishedDate}`:''}</span><h3>${esc(f.title)}</h3><p>${esc(f.summary)}</p><div class="card-bottom"><span>${f.species}</span><button class="plain" data-open="${f.id}">閱讀筆記 ↗</button></div></div></article>`).join('');
  $('#storyCards').innerHTML=stories.map((f,i)=>`<article class="card story-card"><div class="story-art"><span class="story-number">CHRONICLE / ${String(i+1).padStart(2,'0')}</span>${icon(f)}<button class="save" data-save="${f.id}" aria-label="${saved.has(f.id)?'取消收藏':'收藏'}：${esc(f.title)}" aria-pressed="${saved.has(f.id)}">${saved.has(f.id)?'♥':'♡'}</button><span class="story-type">河狸事件簿</span></div><div class="story-body"><div class="story-meta">${f.publishedDate} · 約 ${Math.max(1,Math.ceil(f.body.length/400))} 分鐘閱讀</div><h3>${esc(f.title)}</h3><p>${esc(f.summary)}</p><div class="story-location">${esc(f.species)}</div><button class="plain story-read" data-open="${f.id}">讀完整個故事 <span>↗</span></button></div></article>`).join('');
  $('#storyCount').textContent=`${stories.length} 篇長篇故事`;$('#storiesEmpty').hidden=stories.length>0;
  $('#results').textContent=`${savedOnly?'我的收藏 · ':''}共 ${filtered.length} 則知識筆記`;
  $('#savedCount').textContent=saved.size;$('#savedNav').setAttribute('aria-pressed',savedOnly);$('#clear').hidden=category==='全部知識'&&!savedOnly&&!q&&speciesFilter==='全部河狸';$('#empty').hidden=filtered.length>0;
 }
 function openFact(id){const f=facts.find(x=>x.id===id);if(!f)return;
  $('#detailContent').innerHTML=`<p class="eyebrow">FIELD NOTE ${String(facts.indexOf(f)+1).padStart(3,'0')} / ${f.category}</p><h2>${esc(f.title)}</h2><span class="detail-species">${f.scopeLabel||'適用範圍'}：${esc(f.species)}${f.publishedDate?` · Threads 發布 ${f.publishedDate}`:''}</span>${f.eventDate?`<p class="detail-species">事件時間：${esc(f.eventDate)}</p>`:''}${f.archive?'':`<p><b>${esc(f.summary)}</b></p>`}${(f.paragraphs||[f.body]).map(p=>`<p>${esc(p).replace(/\n/g,'<br>')}</p>`).join('')}${(f.sourceIds||[f.source]).map(id=>`<a class="source-link" href="${esc(sources[id].url)}" target="_blank" rel="noopener">參考來源：${esc(sources[id].name)} ↗</a>`).join('')}${f.threadsUrl?`<a class="source-link" href="${esc(f.threadsUrl)}" target="_blank" rel="noopener">閱讀 Threads 原文 ↗</a>`:''}<div class="hero-actions"><button class="button" data-save="${f.id}" aria-pressed="${saved.has(f.id)}">${saved.has(f.id)?'已收藏 ♥':'收藏這則知識 ♡'}</button><button class="plain" data-share="${f.id}">複製分享連結 ↗</button></div>`;
  $('#detail').classList.toggle('story-detail',f.category==='河狸事件簿');
  if(!$('#detail').open)$('#detail').showModal();track('fact_open',{fact_id:id,category:f.category,content_type:contentType(id)});
 }
 
 function refreshTicker(){
  const pool=facts.filter(f=>f.category!=='河狸事件簿');
  for(let i=pool.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[pool[i],pool[j]]=[pool[j],pool[i]];}
  const newest=facts.filter(f=>f.archive&&f.category!=='河狸事件簿').slice(0,2);
  const chosen=[...newest,...pool.filter(f=>!newest.some(n=>n.id===f.id))].slice(0,6);
  const group=duplicate=>`<div class="ticker-group"${duplicate?' aria-hidden="true"':''}>${chosen.map(f=>`<button class="ticker-fact plain" data-open="${esc(f.id)}" data-ticker="true"${duplicate?' tabindex="-1"':''}><span aria-hidden="true">✳</span> ${esc(f.title)}｜${esc(f.summary)} <span class="ticker-read" aria-hidden="true">↗</span></button>`).join('')}</div>`;
  $('#factTicker').innerHTML=group(false)+group(true);
  const characters=chosen.reduce((total,f)=>total+f.title.length+f.summary.length,0);
  $('#factTicker').style.animationDuration=`${Math.max(55,characters*.65)}s`;
 }
 $('#refreshTicker').onclick=()=>{refreshTicker();track('ticker_refresh');};
 refreshTicker();

 document.addEventListener('click',async e=>{const t=e.target.closest('button');if(!t)return;
  if(t.dataset.species){speciesFilter=t.dataset.species;track('species_filter',{species:speciesFilter});render();}
  if(t.dataset.category){category=t.dataset.category;savedOnly=false;track('category_select',{category});render();}
  if(t.dataset.open){openFact(t.dataset.open);if(t.dataset.ticker)track('ticker_fact_open',{fact_id:t.dataset.open});}
  if(t.dataset.save)toggleSave(t.dataset.save);
  if(t.dataset.share){const url=location.origin+location.pathname+'#fact='+t.dataset.share;try{await navigator.clipboard.writeText(url);clearTimeout(copyTimers.get(t));t.textContent='✓ 已複製連結';t.classList.remove('copy-success');void t.offsetWidth;t.classList.add('copy-success');t.setAttribute('aria-label','分享連結已複製');toast('分享連結已複製');track('share',{method:'copy',content_id:t.dataset.share,content_type:contentType(t.dataset.share)});}catch{toast('無法自動複製，請使用瀏覽器分享功能。');}}
  if(t.classList.contains('close'))t.closest('dialog').close();
 });
 let searchTimer;$('#search').addEventListener('input',()=>{render();clearTimeout(searchTimer);if($('#search').value.trim())searchTimer=setTimeout(()=>{track('knowledge_search',{result_count:$('#cards').children.length+$('#storyCards').children.length});},700);});$('#clear').onclick=reset;$('#reset').onclick=reset;
 $('#savedNav').onclick=()=>{savedOnly=!savedOnly;speciesFilter='全部河狸';category='全部知識';$('#search').value='';render();$('#explore').scrollIntoView();};
 $('#random').onclick=()=>{const pool=facts.filter(f=>f.category!=='河狸事件簿');const id=pool[Math.floor(Math.random()*pool.length)].id;openFact(id);track('random_fact',{fact_id:id,content_type:'short_fact'});};
 const baseQuizzes=[
  ['河狸的門牙為什麼是橘色？',['常喝紅茶','琺瑯質含有鐵','沾到樹皮','年紀太大'],1,'鐵讓琺瑯質呈深橘色，也能強化牙齒。','orange'],
  ['河狸主要吃什麼？',['魚和蝦','水生昆蟲','樹皮與植物','其他小動物'],2,'河狸是草食性動物，住水邊也不代表吃魚。','plants'],
  ['每個河狸棲地都有水壩嗎？',['一定都有','只有冬天有','水深足夠可能不築壩','只有北美河狸築壩'],2,'是否築壩，與河道寬度、水位和棲地條件有關。','notall'],
  ['尾巴用力拍水通常表示？',['危險警報','準備冬眠','正在捕魚','發現新樹木'],0,'拍水聲會提醒同伴，附近可能有危險。','alarm'],
  ['壩與巢穴的功能有何不同？',['完全相同','壩蓄水，巢穴用來居住','壩用來存魚','巢穴讓水流加速'],1,'壩改變水位，巢穴則提供休息與繁殖的空間。','dams']
 ];
 const freshQuizzes=facts.filter(f=>f.archive&&f.quiz).map(f=>[f.quiz.question,f.quiz.options,f.quiz.answer,f.quiz.explanation,f.id]);
 function quizRound(){const fresh=freshQuizzes.slice(0,3),pool=[...baseQuizzes];for(let i=pool.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[pool[i],pool[j]]=[pool[j],pool[i]];}return [...fresh,...pool].slice(0,5);}
 let quizzes=quizRound(),qi=0,score=0,answered=false;
 function renderQuiz(){answered=false;const c=$('#quizCard');if(qi>=quizzes.length){c.innerHTML=`<p class="eyebrow">CHALLENGE COMPLETE</p><h3>你答對了 ${score} / 5 題！</h3><p>${score===5?'你已經是河狸觀察家了！':'每一次好奇，都讓你更靠近河狸的世界。'}</p><button class="button" id="again">再挑戰一次 ↻</button>`;$('#again').onclick=()=>{quizzes=quizRound();qi=0;score=0;track('quiz_restart');renderQuiz();};track('quiz_complete',{score,total:5});return;}
 const q=quizzes[qi];c.innerHTML=`<div class="progress"><span>QUESTION ${String(qi+1).padStart(2,'0')}</span><span>${qi+1} / 5</span></div><h3>${esc(q[0])}</h3><div class="answers">${q[1].map((a,i)=>`<button data-answer="${i}">${String.fromCharCode(65+i)}. ${esc(a)}</button>`).join('')}</div><div class="quiz-feedback" aria-live="polite"></div>`;
 c.querySelectorAll('[data-answer]').forEach(b=>b.onclick=()=>{if(answered)return;if(qi===0)track('quiz_start');answered=true;const a=Number(b.dataset.answer),right=a===q[2];if(right)score++;c.querySelectorAll('[data-answer]').forEach(x=>{x.disabled=true;if(Number(x.dataset.answer)===q[2])x.classList.add('correct');});if(!right)b.classList.add('wrong');c.querySelector('.quiz-feedback').innerHTML=`<p>${right?'答對了！':'再認識一點：'}${esc(q[3])}</p><button class="plain" data-open="${q[4]}">閱讀相關筆記 ↗</button> · <button class="plain" id="next">${qi===4?'查看結果':'下一題'} →</button>`;$('#next').onclick=()=>{qi++;renderQuiz();};track('quiz_answer',{question_id:q[4],correct:right});});
 }
 $('#privacy').onclick=()=>{$('#analyticsStatus').textContent=window.BEAVER_CONFIG?.gaId?`目前設定：${window.beaverAnalytics.allowed()?'已允許分析':'尚未允許分析'}。`:'網站分析尚未啟用，等待管理者設定 GA4。';$('#privacyDialog').showModal();};
 $('#allow').onclick=()=>{window.beaverAnalytics.consent(true);$('#privacyDialog').close();toast('已儲存分析偏好');};$('#deny').onclick=()=>{window.beaverAnalytics.consent(false);$('#privacyDialog').close();toast('已停用網站分析');};
 document.addEventListener('click',e=>{const a=e.target.closest('a');if(!a)return;const href=a.getAttribute('href')||'';if(href.startsWith('#'))track('section_navigate',{section:href.slice(1)});if(a.classList.contains('source-link')||a.classList.contains('species-source'))track('reference_click',{link_url:a.href});});
 if('IntersectionObserver' in window){const observer=new IntersectionObserver(entries=>{for(const entry of entries)if(entry.isIntersecting&&window.beaverAnalytics?.allowed()){track('species_view',{species:entry.target.classList.contains('eurasian')?'Castor fiber':'Castor canadensis'});observer.unobserve(entry.target);}},{threshold:.5});document.querySelectorAll('.species-card').forEach(el=>observer.observe(el));}
 
 document.querySelectorAll('[data-compare]').forEach(button=>button.addEventListener('click',()=>{
  const mode=button.dataset.compare;let count=0;
  document.querySelectorAll('[data-compare-kind]').forEach(row=>{row.hidden=mode!=='all'&&row.dataset.compareKind!==mode;if(!row.hidden)count++;});
  document.querySelectorAll('[data-compare]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));
  $('#compareStatus').textContent=`顯示${mode==='all'?'全部':mode==='different'?'不同之處':'共同本領'} ${count} 個比較項目`;
  track('species_compare',{mode});
 }));

 
 const seasonNotes={"spring": {"name": "春天", "tag": "新生命，住進小窩", "title": "春末到初夏，窩裡多了小小河狸", "body": "在北半球許多溫帶棲地，河狸幼獸會在春末至初夏出生，由家庭成員照顧。確切時點會隨緯度、氣候與族群改變。", "food": "植物恢復生長，嫩葉、草本及水生植物逐漸成為可用食物。", "home": "育幼期間的小窩與岸邊洞穴，是家庭休息及照顧幼獸的重要空間。", "observe": "可以留意岸邊新鮮的啃痕與活動跡象；保持距離，別靠近窩口。", "source": "https://www.nature.scot/doc/beavers-scotland-faq", "sourceLabel": "NatureScot · 蘇格蘭河狸常見問題"}, "summer": {"name": "夏天", "tag": "湖邊的植物自助餐", "title": "夏日菜單，多了新鮮的綠色選擇", "body": "北美河狸在春夏會利用較多草本與水生植物；歐亞河狸也會利用這些季節性食物。牠們以植物為食，住在湖裡不代表吃魚。", "food": "葉片、草本、水生植物及其根莖等；實際菜單取決於當地植物。", "home": "成獸覓食、照顧幼獸，幼獸也逐漸接觸窩外環境；不是所有家庭都照同一張行事曆活動。", "observe": "從遠處留意水面的游動路線。別餵食，也別為了拍照擋住牠們回水裡的路。", "source": "https://research.fs.usda.gov/feis/species-reviews/caca", "sourceLabel": "美國林務局 · 北美河狸物種綜述"}, "autumn": {"name": "秋天", "tag": "把冬季糧倉準備好", "title": "寒冬將近，枝條先存進水裡", "body": "在冬季可能結冰的棲地，河狸常在結冰前儲備可食用的枝條，讓冬季也有機會取得食物。並不是每個族群都需要同樣的儲糧方式。", "food": "木本植物的重要性提高；寒冷地區可能在窩附近的水下建立枝條食物庫。", "home": "築壩與修繕是因應棲地需要的工作，不是只限秋天才進行的固定儀式。", "observe": "水裡堆著的枝條可能是糧食，也可能是建材；不要移動或拆除。", "source": "https://fwp.mt.gov/conservation/living-with-wildlife/beavers", "sourceLabel": "蒙大拿州魚類、野生動物與公園局 · 與河狸共處"}, "winter": {"name": "冬天", "tag": "不冬眠，繼續過日子", "title": "湖面結冰，也不是一覺睡到春天", "body": "河狸不冬眠。在寒冷、池塘結冰的地區，牠們可能減少外出，利用窩、冰下水道與儲存的枝條生活；牠們仍需要活動與進食。", "food": "可利用水下儲存的枝條或其他可取得的植物；冰封情況會影響覓食方式。", "home": "窩內休息空間位於水面之上；入口可通向水下，不是整個冬天都泡在水裡。", "observe": "看不到河狸，不代表窩裡沒住戶。別踩上窩或薄冰，從安全岸邊遠距離觀察即可。", "source": "https://www.nps.gov/bela/learn/nature/beaver.htm", "sourceLabel": "美國國家公園署 · 白令陸橋國家保護區河狸介紹"}};

 const seasonKeys=Object.keys(seasonNotes),seasonCarousel=$('#seasonCarousel');let activeSeason=0,seasonScrollTimer;
 seasonCarousel.innerHTML=seasonKeys.map((key,index)=>{const note=seasonNotes[key];return `<article class="season-slide" data-season-slide="${key}" role="group" aria-roledescription="投影片" aria-label="${note.name}，第 ${index+1} 季，共 4 季"><div class="season-layout" data-current-season="${key}"><div class="season-scene supplied-season"><span class="season-sun"></span><span class="season-leaf leaf-one"></span><span class="season-leaf leaf-two"></span><span class="season-snow">✳ · ✳ · ✳</span><img src="assets/season-${key}.png" width="1254" height="1254" alt="${note.name}：${note.tag}的河狸生活插畫" loading="lazy"><span class="season-scene-label">${note.name}的湖邊 · 示意插畫</span></div><div class="season-story"><p class="eyebrow">${note.name} · ${note.tag}</p><h3>${note.title}</h3><p>${note.body}</p><dl><dt>這季吃什麼</dt><dd>${note.food}</dd><dt>窩裡忙什麼</dt><dd>${note.home}</dd><dt>湖邊觀察提醒</dt><dd>${note.observe}</dd></dl><a class="species-source" href="${note.source}" target="_blank" rel="noopener">參考來源：${note.sourceLabel} ↗</a></div></div></article>`;}).join('');
 function updateSeason(index){activeSeason=index;const key=seasonKeys[index];document.querySelectorAll('[data-season]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.season===key)));$('#seasonPrev').disabled=index===0;$('#seasonNext').disabled=index===seasonKeys.length-1;$('#seasonPosition').textContent=`${seasonNotes[key].name} · ${index+1} / ${seasonKeys.length}`;}
 function showSeason(key){const index=seasonKeys.indexOf(key);if(index<0)return;const slide=seasonCarousel.children[index];seasonCarousel.scrollTo({left:slide.offsetLeft,behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});updateSeason(index);track('season_select',{season:key});}
 document.querySelectorAll('[data-season]').forEach(button=>button.addEventListener('click',()=>showSeason(button.dataset.season)));
 $('#seasonPrev').onclick=()=>showSeason(seasonKeys[Math.max(0,activeSeason-1)]);$('#seasonNext').onclick=()=>showSeason(seasonKeys[Math.min(seasonKeys.length-1,activeSeason+1)]);
 seasonCarousel.addEventListener('scroll',()=>{clearTimeout(seasonScrollTimer);seasonScrollTimer=setTimeout(()=>{let index=0,distance=Infinity;[...seasonCarousel.children].forEach((slide,i)=>{const value=Math.abs(slide.offsetLeft-seasonCarousel.scrollLeft);if(value<distance){distance=value;index=i;}});if(index!==activeSeason){updateSeason(index);track('season_select',{season:seasonKeys[index],method:'swipe'});}},140);},{passive:true});
 seasonCarousel.addEventListener('keydown',e=>{if(e.target!==seasonCarousel)return;if(e.key==='ArrowRight'){e.preventDefault();showSeason(seasonKeys[Math.min(3,activeSeason+1)]);}if(e.key==='ArrowLeft'){e.preventDefault();showSeason(seasonKeys[Math.max(0,activeSeason-1)]);}});
 updateSeason(0);


 
 // Native details keep long sections compact and remain keyboard accessible.
 const foldSpecs=[['species','認識河狸','物種介紹與超級比一比'],['compare','河狸物種超級比一比','9 個比較項目'],['seasons','河狸的四季','春夏秋冬，左右滑動'],['explore','河狸冷知識','短篇筆記與物種篩選'],['stories','河狸事件簿','長篇故事，慢慢讀'],['quiz','河狸小測驗','5 題挑戰'],['about','資料與來源','認識我們的參考資料']];
 const defaultOpenSections=new Set(['species','compare','seasons','explore']);
 foldSpecs.forEach(([id,label,description])=>{
  const section=document.getElementById(id);if(!section)return;
  const fold=document.createElement('details');fold.className='content-fold'+(id==='compare'?' nested-fold':'');fold.id=id;section.removeAttribute('id');
  fold.open=defaultOpenSections.has(id);
  const summary=document.createElement('summary');summary.className='fold-summary'+(id==='compare'?'':' wrap');
  const heading=section.querySelector('h2,h3');const title=heading||document.createElement('h2');title.textContent=label;
  const info=document.createElement('div');info.className='fold-info';info.append(title);const hint=document.createElement('span');hint.textContent=description;info.append(hint);
  const indicator=document.createElement('span');indicator.className='fold-indicator';indicator.setAttribute('aria-hidden','true');summary.append(info,indicator);
  section.before(fold);fold.append(summary,section);section.classList.add('fold-body');
  fold.addEventListener('toggle',()=>track('section_fold',{section:id,expanded:fold.open}));
 });
 function openSection(target){if(!target)return;if(target.matches('details'))target.open=true;let parent=target.parentElement;while(parent){if(parent.matches('details'))parent.open=true;parent=parent.parentElement;}}
 function openHashSection(){const id=decodeURIComponent(location.hash.slice(1));if(!id||id.startsWith('fact='))return;const target=document.getElementById(id);openSection(target);if(target)requestAnimationFrame(()=>target.scrollIntoView({block:'start'}));}
 document.addEventListener('click',e=>{const a=e.target.closest('a[href^="#"]');if(a){const target=document.getElementById(a.getAttribute('href').slice(1));openSection(target);}if(e.target.closest('#savedNav'))openSection(document.getElementById('explore'));},{capture:true});
 addEventListener('hashchange',openHashSection);openHashSection();
 const foldTools=document.createElement('div');foldTools.className='fold-tools wrap';foldTools.innerHTML='<span>預設先展開三個主要區塊，也可以一次調整全部。</span><div><button type="button" data-fold-all="open">全部展開</button><button type="button" data-fold-all="close">全部收合</button></div>';
 document.querySelector('#species').before(foldTools);
 foldTools.addEventListener('click',e=>{const button=e.target.closest('[data-fold-all]');if(!button)return;document.querySelectorAll('details.content-fold').forEach(fold=>fold.open=button.dataset.foldAll==='open');});

 
 const menuToggle=$('#mobileMenuToggle'),mainNav=$('#mainNavigation');
 function closeMobileMenu(){document.querySelector('.nav').classList.remove('mobile-menu-open');menuToggle.setAttribute('aria-expanded','false');menuToggle.textContent='☰ 選單';}
 menuToggle.addEventListener('click',()=>{const open=menuToggle.getAttribute('aria-expanded')!=='true';document.querySelector('.nav').classList.toggle('mobile-menu-open',open);menuToggle.setAttribute('aria-expanded',String(open));menuToggle.textContent=open?'× 收起':'☰ 選單';});
 mainNav.addEventListener('click',e=>{if(e.target.closest('a,button'))closeMobileMenu();});
 document.addEventListener('keydown',e=>{if(e.key==='Escape'&&menuToggle.getAttribute('aria-expanded')==='true'){closeMobileMenu();menuToggle.focus();}});

 $('#totalFacts').textContent=facts.length;render();renderQuiz();
 if(location.hash.startsWith('#fact='))openFact(decodeURIComponent(location.hash.slice(6)));
})();

// User-supplied illustrations: change the complete scene and its explanation together.
(() => {
 const scenes={
 rest:{title:'白天 · 在窩裡好好休息',body:'河狸多在黃昏與夜間活動，白天常待在窩或岸邊洞穴中休息。',alt:'白天，河狸蜷縮在枝條搭成的窩裡睡覺'},
 groom:{title:'醒來 · 整理自己的毛皮',body:'河狸會梳理毛皮，保持毛髮狀態。梳毛是日常保養，不只發生在剛醒來的時候。',alt:'河狸坐在窩中，用前腳整理臉部與毛皮'},
 forage:{title:'黃昏 · 出門找植物吃',body:'天色漸暗時，河狸常開始外出覓食。樹皮、嫩枝、葉片與水生植物，都是牠們可能利用的食物。',alt:'夕陽下，河狸在湖岸叼著帶葉枝條覓食'},
 build:{title:'夜間 · 搬枝條、修整住家',body:'夜間也是河狸常見的活動時段。牠們會依棲地需要搬運枝條、修整窩或水壩，也會覓食與游泳。',alt:'月亮與星星下，河狸搬運木頭修整水壩'}
 };
 document.querySelectorAll('[data-daily]').forEach(button=>button.addEventListener('click',()=>{
  const key=button.dataset.daily,scene=scenes[key];
  document.querySelectorAll('[data-daily]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));
  const image=document.querySelector('#dailyImage');image.src=`assets/daily-${key}.png`;image.alt=scene.alt;
  document.querySelector('#dailyHeading').textContent=scene.title;
  document.querySelector('#dailyBody').textContent=scene.body;
 }));
})();
