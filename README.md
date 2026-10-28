# 河狸冷冷冷冷冷知識

全繁體中文靜態網站，部署至 GitHub Pages。原創 SVG 插畫；20 則有來源的河狸知識，加上已發布的 Threads 短篇與河狸事件簿典藏、分類搜尋、裝置本機收藏、分享連結及五題測驗。不需建置或安裝套件。

## 維護

- 知識內容：`facts.js`。新增資料應附可靠來源及物種適用範圍，避免推廣活動內容。
- Threads 典藏：`archive.js` 由本機 `sync_beaver_site.py` 產生。只匯出已完成且所有段落皆經驗證的發文，保留日期、來源與原文連結。草稿、預覽、憑證及內部查核資料不會匯出。
- 僅收錄河狸主題；早期其他題材的冷知識不匯入。冷知識採淺色插圖卡片，長篇「河狸事件簿」為獨立深綠色區塊，使用書封式橫向卡片及閱讀時間。搜尋與收藏可跨兩區使用。
- 每日短篇與每週事件簿發文成功後立即呼叫網站同步；本機 Windows「Beaver Website Sync」每 30 分鐘另行補同步。電腦需開機、登入並可連網；不另發 Threads 貼文。
- SUPER 8 聊天：`chat.js`，組織 ID `zbKDXBGe2WgwKw==`，若服務拒絕來源網站須至 SUPER 8 管理介面設定允許網址。
- GA4：`config.js` 的 `gaId`。分析在使用者允許後才載入，本機預覽不送出；不收集搜尋原文。
- 目前 GA4 評估 ID：`G-3NP76T1YXT`（河狸網站專用）。
- 自訂事件：`category_select`、`fact_open`、`fact_bookmark`、`random_fact`、`share`、`quiz_answer`、`quiz_complete`。
- 動態效果：`motion.js` / `motion.css`；原創河狸呼吸、眨眼、漣漪、卡片進場、橫向主題帶與輕量視差。支援動畫暫停、系統減少動態偏好及隱藏分頁停止動畫。
- GA 實際報表收件請至相應資源的即時報表確認。
- 本機預覽：`python -m http.server 8791`。
- 發布：提交至 `main`，GitHub Pages 從根目錄部署。

## 資料與授權

資料查核 2026-10-28。參考 Smithsonian’s National Zoo、U.S. National Park Service、NatureScot，各卡片連回原始頁面。插畫為本站原創示意。外部來源文字、機構名稱及 Google Fonts 分別遵循原權利人的授權。
