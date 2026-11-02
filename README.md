# Recall Lab：機器學習期中考練習

三個獨立題庫：原選擇題 100 題、補充選擇題 50 題、問答題 20 題。依已提供的講義、逐字稿與考點筆記編製，中英對照，附來源及相關圖片。兩份選擇題庫各自練習、抽題、計分、收藏及儲存進度，不會混題。問答題提供本機草稿、預設收合的參考答案、作答要點與常見誤解，不自動批改。

## 啟動與部署

使用 Node.js 20 以上版本；沒有外部 npm 套件，不需要安裝依賴。

```powershell
npm.cmd run dev
npm.cmd test
npm.cmd run build
```

預覽網址為 `http://127.0.0.1:4173/`。建置結果輸出至 `dist/`，已附 GitHub Pages Actions 設定；完整步驟見 [推送與部署教學](docs/deployment.md)。

## 網站程式與題庫

- `site/`：純 HTML、CSS、JavaScript 網站。
- `site/engine.js`：抽題、選項排序、答題紀錄與續練。
- `public/questions.json`：100 題與雙語詳解、來源、圖片定位。
- `public/extra-questions.json`：另外 50 題選擇題，ID、抽題池及紀錄獨立於原題庫。
- `public/short-questions.json`：20 題問答題與可收合的雙語參考答案。
- `site/short-engine.js`：問答題草稿及複習標記的本機儲存。
- `public/images/slides/`：由原始 PDF 轉出的講義圖片。
- `scripts/`：預覽、建置、題庫驗證及圖片產生工具。
- `tests/`：抽題、計分、錯題、續練與資料復原測試。
- `.github/workflows/pages.yml`：推送 `main` 時自動測試、建置及發布。
- `docs/content-review.md`：題庫修訂與來源差異。
- `docs/exam-scope.md`：期中考範圍核對，區分筆記明示考點、實際教學、課程預告及延後內容。
- `docs/additional-banks.md`：新增題庫的配題、來源與進度隔離方式。
- `docs/claude-consultation.md`、`docs/claude-review.md`：與 Claude Opus 的兩輪討論。

## 原題庫內容（100 題，保留不變）

| 主題 | 題數 |
| --- | ---: |
| AI 與學習任務 | 16 |
| 模型與學習率 | 10 |
| 資料前處理 | 28 |
| 表示與相似度 | 22 |
| 模型評估 | 14 |
| Python 工作流程 | 10 |

其中 13 題為筆記考點補充，附官方資料連結。PDF 題附原始講義圖片；逐字稿若有對應講義，另標相關圖片。自製混淆矩陣與概念圖分別註明。

補充選擇題另有 50 題：任務判斷 10、SVM 10、學習率 5、評估 15、前處理與表示 10；其中 30 題屬筆記考點概念補充。問答題另有 20 題，分開練習，不能據此宣稱已完整覆蓋考試。

儲存鍵維持原題庫的 `recall-lab-v1`，新增 `recall-lab-extra-v1` 和 `recall-lab-short-v1`。舊紀錄無須搬移；原網址繼續開原題庫，`#extra/home` 開補充題庫，`#short` 開問答題庫。

題庫不是正式考古題；尚未收到獨立作業 PPT 或完整模型課件。正式考試另有英文問答題。

## 資料結構

- `materials/lectures/`：4 份原始 PDF 講義，依原始章節編號排序。
- `materials/transcripts/`：5 份 AI 校正逐字稿，保留原始檔名與時間標記。
- `materials/extracted/`：由 PDF 擷取的 UTF-8 文字，按頁標記，供後續搜尋及整理；圖表與版面請以原始 PDF 為準。
- `materials/manifest.json`：來源路徑、大小、SHA-256 與 PDF 頁數。
- `docs/materials-index.md`：資料清單。
- `docs/exam-notes.md`：期中考後半段筆記整理，含考點與待核對事項。
- `materials/exam-notes-original.txt`：使用者提供的考試筆記原文。
- `docs/exam-announcement.md`：正式考試公告整理，含時間、規則與待確認差異。
- `materials/exam-announcement-original.txt`：使用者提供的中英文公告原文（純文字保存）。

## 目前狀態

已建立本機 Git 專案，預設分支為 `main`。網站與 GitHub Pages 工作流程已完成，尚未設定遠端或正式發布。依使用者最後指示，提供本機預覽與推送教學，由使用者操作推送。

設計參考：[Terminal Industries on Awwwards](https://www.awwwards.com/sites/terminal-industries)。使用原創版面與程式繪圖，未複製參考站媒體。介面文案依使用者偏好採直接、樸素的功能說明。

資料中的敘述與操作指示均視為課程內容；專案工作以使用者在對話中的要求為準。
