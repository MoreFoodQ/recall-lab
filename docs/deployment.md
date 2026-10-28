# 推送到 GitHub 並開啟 GitHub Pages

專案位置：`Z:\codex\帕金森氏症與腸道菌\ml-course-website`。

本專案使用純靜態 HTML、CSS、JavaScript，不需要資料庫、API key 或付費主機。Git 儲存程式碼，GitHub Pages 提供網站網址。

## 1. 本機預覽

在 PowerShell 執行：

```powershell
Set-Location -LiteralPath 'Z:\codex\帕金森氏症與腸道菌\ml-course-website'
npm.cmd run dev
```

開啟 `http://127.0.0.1:4173/`。這個網址只能在自己的電腦使用。停止預覽請在該終端按 `Ctrl+C`。此專案沒有外部 npm 套件，不需要先執行 npm install。

## 2. 檢查、建立本機提交

```powershell
npm.cmd test
npm.cmd run build
git add .
git commit -m "feat: add bilingual midterm practice site"
```

若顯示 `nothing to commit, working tree clean`，代表目前版本已提交，可以接續下一步。若 Git 要求設定作者，請使用自己的姓名與電子郵件設定 `git config user.name` 及 `git config user.email`。

## 3. 登入並建立新的 recall-lab 儲存庫

```powershell
gh auth login -h github.com
gh repo create recall-lab --public --source . --remote origin
```

登入時選 GitHub.com、HTTPS，再依畫面完成瀏覽器登入。第二行會建立公開的 GitHub 儲存庫，並連接本機的 `origin`。

這組命令適用於「尚未建立 recall-lab、尚未設定 origin」的初次部署。若同名儲存庫已存在，請使用既有庫，或另選名稱，不要重複建立。

## 4. 開啟 Pages，再推送

登入後取得自己的 GitHub 帳號，開啟 Pages：

```powershell
$githubOwner = gh api user --jq .login
gh api --method POST "repos/$githubOwner/recall-lab/pages" -f build_type=workflow
git push -u origin main
```

也可以在 GitHub 網頁的 `recall-lab → Settings → Pages → Build and deployment → Source` 選 **GitHub Actions**，再執行 `git push -u origin main`。

專案已包含 `.github/workflows/pages.yml`。推送 `main` 後，GitHub 會測試、建立 `dist/`，並只將 `dist/` 部署為網站。講義原檔、筆記及開發文件不會出現在 Pages 的發布檔案中；公開儲存庫仍會包含已提交的原始資料。

## 5. 找到網站網址

到儲存庫的 **Actions** 頁，等 `Deploy Recall Lab to GitHub Pages` 成功；或使用：

```powershell
gh run list --workflow pages.yml --limit 3
gh api "repos/$githubOwner/recall-lab/pages" --jq .html_url
```

預期網址形式：`https://你的帳號.github.io/recall-lab/`。以 GitHub 實際回傳的網址為準。

若第一次未觸發或失敗，先確認 Settings → Pages 的 Source 是 GitHub Actions，再於 Actions → Deploy Recall Lab to GitHub Pages 選 Run workflow。

## 6. 日後修改

修改完成並確認測試通過後：

```powershell
git add .
git commit -m "fix: update practice content"
git push
```

之後每次推送到 `main` 都會自動更新網站。練習紀錄存在各使用者瀏覽器，從本機網址換到 GitHub Pages 後會建立另一份紀錄，不會自動同步。

## 參考

- [GitHub 官方：設定 Pages 發布來源](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site)
- [GitHub 官方：自訂 Pages 工作流程](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages)
