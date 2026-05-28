# Reflow

Reflow 記帳應用，整合 **TIDE 原型 UI**（水波預算視覺）與完整功能的 HTML 應用（IndexedDB、AI 匯入、分析圖表等）。

## 本機執行（主要應用）

```bash
npm install
npm run dev
```

開啟 [http://localhost:5173](http://localhost:5173) — 根目錄 `index.html`，四個畫面皆已套用 TIDE 主題與**英文**標籤：

| Tab | 畫面 | 重點 |
|-----|------|------|
| **Tide** | 首頁 | REMAINING 水波 tank、STREAMS 分類列表 |
| **Pulse** | 分析 | 月支出 hero、BY STREAM / CUMULATIVE / DAILY PULSE |
| **Drops** | 明細 | By date / By stream |
| **Me** | 個人 | Profile 卡、BUDGET / STREAMS / EVENTS / BALANCE / DATA |

底部導航：**TIDE · PULSE · DROPS · ME**（圓點樣式）。

## React 原型（僅 UI 示範）

```bash
npm run dev:prototype
```

使用 `prototype/` 內的 Vite + React 互動原型（mock 資料），預設埠 **5174**。

## 假資料（Demo）

示範用資料已與主程式分離，預設**關閉**，適合上傳 GitHub：

| 檔案 | 說明 |
|------|------|
| `public/data/demo/config.json` | 示範月份、今日日期、總預算、分類預算 |
| `public/data/demo/expenses.json` | 示範消費明細（多月份） |
| `js/demo.config.js` | 開關 `TIDE_DEMO_ENABLED`（預設 `false`） |
| `js/demoLoader.js` | 啟用時以 `fetch` 載入上述 JSON |

**啟用方式（擇一）：**

1. 將 `js/demo.config.js` 內的 `TIDE_DEMO_ENABLED` 改為 `true`
2. 複製 `js/demo.config.example.js` → `js/demo.config.local.js`（已加入 `.gitignore`），設為 `true` 並在 `index.html` 於 `demo.config.js` 後多加一行 script（可選）
3. 網址加上 `?demo=1`（例如 `http://localhost:5173/?demo=1`）

關閉 demo 後會使用 IndexedDB／`initialData.js` 的真實資料流程。

## 專案結構

```
index.html           # 正式 PWA 入口
js/                  # tide-bridge.js, tide-ui.js, demoLoader.js, demo.config.js
public/data/demo/    # 示範用 JSON（config + expenses）
css/tide-theme.css   # TIDE 視覺
assets/              # Lottie 等
initialData.js       # 空陣列種子（非 demo）
manifest.json
prototype/           # React TIDE 原型（index.html + src/）
public/              # 靜態資源（字型等）
```

## 上傳 GitHub

```bash
cd "/Users/fanyungyi/Downloads/Reflow v.2"
git init
git add .
git commit -m "Initial commit: Reflow PWA with TIDE UI"
# 在 GitHub 建立 repo 後：
git remote add origin https://github.com/<你的帳號>/<repo>.git
git branch -M main
git push -u origin main
```

建議不要提交 `node_modules`（已在 `.gitignore`）。部署靜態站時執行 `npm run build`，輸出目錄為 `dist/`。

## 部署

```bash
npm run build
```

靜態檔輸出至 `dist/`，可部署至 Vercel / Netlify。
