/* Website-only follow-up notes. Kept separate from verified Threads text so
   routine archive synchronization does not erase later factual updates. */
(()=>{
  const article=(window.BEAVER_ARCHIVE||[]).find(f=>f.id==='threads-18102080066636871');
  if(!article||article.editorialUpdatedAt==='2026-11-01')return;
  const sourceId='parachuting-beavers-population-followup-2024';
  window.BEAVER_SOURCES[sourceId]={
    name:'Idaho Statesman｜75年後追蹤報導（2023-12-18刊登，2024-04-15更新）',
    url:'https://www.idahostatesman.com/news/northwest/idaho/article282932703.html'
  };
  const notes=[
    '補充查核（2026年11月1日）｜當年的數量：1948年共空投76隻河狸，其中75隻活過降落。這是當次運送的歷史數字，不是張伯倫盆地現在的族群數量。',
    '後來有多少隻？Idaho Statesman於2023年刊登、2024年4月15日更新的追蹤報導，引述愛達荷州主管機關：沒有進行精確的河狸族群估計，也無法確認原空投區是否仍有河狸，或現存河狸是否為Geronimo等空投河狸的直接後代。',
    '截至本次查核，未找到足以提供當地近期數量估計的資料。資料不足不代表沒有河狸；不能把1948年的75隻，或其他地區的總數，當成今日張伯倫盆地的數量。'
  ];
  article.paragraphs=[...(article.paragraphs||[article.body]),...notes];
  article.body=article.paragraphs.join('\n\n');
  article.sourceIds=[...new Set([...(article.sourceIds||[article.source]),sourceId])];
  article.editorialUpdatedAt='2026-11-01';
})();
