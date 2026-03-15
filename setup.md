# 🔧 Developer Setup Guide — SnapBooth

This guide covers everything needed to get SnapBooth running locally, understand the codebase, extend it, and deploy to production.

---

## Prerequisites

| Tool    | Version  | Notes                                |
|---------|----------|--------------------------------------|
| Node.js | 18+      | Use [nvm](https://github.com/nvm-sh/nvm) to manage versions |
| npm     | 9+       | Comes with Node                     |
| Git     | Any      | For version control                  |
| Browser | Chrome / Safari / Edge | With camera support   |

---

## 1. Local Development Setup

### Step 1 — Clone / initialize the project

```bash
git clone https://github.com/your-org/photobooth-app.git
cd photobooth-app
```

Or scaffold fresh:

```bash
npm create vite@latest photobooth-app -- --template react
cd photobooth-app
```

### Step 2 — Install dependencies

```bash
npm install
```

### Step 3 — Copy the source file

Replace `src/App.jsx` with the provided `App.jsx`.

Replace `src/main.jsx` with:

```jsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
```

Replace `index.html` `<title>` with:

```html
<title>SnapBooth</title>
```

### Step 4 — Start the dev server

```bash
npm run dev
```

Visit: **http://localhost:5173**

---

## 2. Project Architecture

```
src/App.jsx
│
├── TEMPLATES[]          → Array of 8 template config objects
├── FILTERS[]            → Array of 8 CSS filter definitions
│
├── <Countdown />        → Overlay that shows 3-2-1 countdown
├── <TemplateCard />     → Individual selectable template card
├── <PhotoStrip />       → Canvas-based strip renderer
│
└── <App />              → Root component, manages all state + steps
    ├── step: "home"
    ├── step: "setup"
    ├── step: "capture"
    └── step: "strip"
```

### State Flow

```
selectedTemplate  ─┐
selectedFilter    ─┼──→ capture → snapPhoto() → photos[] → PhotoStrip canvas
customText        ─┘
```

All state lives in the root `<App />` component. No context, no Redux — KISS principle.

---

## 3. Key APIs Used

### Camera Access

```js
const stream = await navigator.mediaDevices.getUserMedia({
  video: { facingMode: "user", width: 1280, height: 720 },
  audio: false
});
videoRef.current.srcObject = stream;
```

> Always stop tracks when leaving the capture screen to release the camera:
> ```js
> stream.getTracks().forEach(t => t.stop());
> ```

### Photo Capture (Canvas)

```js
const canvas = document.createElement("canvas");
canvas.width = video.videoWidth;
canvas.height = video.videoHeight;
const ctx = canvas.getContext("2d");

// Mirror the selfie (un-flip the mirrored video)
ctx.translate(canvas.width, 0);
ctx.scale(-1, 1);

// Apply CSS filter to canvas context
ctx.filter = selectedFilter.css;
ctx.drawImage(video, 0, 0);

const dataUrl = canvas.toDataURL("image/jpeg", 0.92);
```

### Strip Rendering

The `<PhotoStrip />` component draws everything onto a single `<canvas>` element:

1. Draw outer background rect
2. Draw gradient inner strip
3. For each photo: load `Image()` from dataURL, clip + draw
4. Draw border rect overlay per frame
5. Draw label text (name + date) at bottom

---

## 4. Adding Features

### Adding a Timer Delay Option

In the capture screen, add a `delaySeconds` state (e.g., 3 / 5 / 10) and pass it into the countdown loop inside `startCapture()`.

### Adding a Sticker Overlay

After drawing the photos in `PhotoStrip`'s `useEffect`, draw emoji or imported PNG images using:

```js
ctx.font = "40px serif";
ctx.fillText("⭐", x, y);
```

### Adding Print Support

```js
const printStrip = () => {
  const canvas = document.querySelector(".photo-strip-canvas");
  const w = window.open("", "_blank");
  w.document.write(`<img src="${canvas.toDataURL()}" style="max-width:100%"/>`);
  w.print();
};
```

### Multi-page / Gallery Mode

Store completed strips in `localStorage`:

```js
const history = JSON.parse(localStorage.getItem("snapbooth_history") || "[]");
history.push({ template: selectedTemplate.id, dataUrl: canvas.toDataURL(), date: Date.now() });
localStorage.setItem("snapbooth_history", JSON.stringify(history.slice(-20)));
```

---

## 5. Configuration Reference

### Template Object Schema

```ts
interface Template {
  id: string;           // Unique identifier (slug)
  name: string;         // Display name
  tag: string;          // Badge label shown in card
  color: string;        // Primary color (hex)
  accent: string;       // Accent color (hex)
  bg: string;           // Strip background (hex or CSS gradient string)
  frames: number;       // Number of photos: 3 or 4
  layout: string;       // "vertical-strip" | "grid-2x2" | "polaroid-grid"
  border: number;       // Frame padding in pixels
  borderColor: string;  // Frame border color (hex)
  outerBg: string;      // Outer strip / wrapper background
  font: string;         // CSS font stack for the label
  labelColor: string;   // Label text color
}
```

### Filter Object Schema

```ts
interface Filter {
  id: string;     // Unique identifier
  name: string;   // Display name
  css: string;    // CSS filter() string, e.g. "grayscale(100%)"
}
```

---

## 6. Environment Variables

Currently none required. If you extend the app (e.g. add cloud upload, analytics), use a `.env` file:

```env
# .env.local
VITE_API_BASE_URL=https://your-api.com
VITE_UPLOAD_ENDPOINT=https://your-api.com/upload
```

Access in code:

```js
const apiUrl = import.meta.env.VITE_API_BASE_URL;
```

> Never commit `.env.local` to version control.

---

## 7. Build & Deployment

### Build

```bash
npm run build
# Output directory: dist/
```

### Deploy to Vercel

```bash
npm i -g vercel
vercel --prod
```

### Deploy to Netlify

```bash
npm run build
# Drag and drop dist/ into Netlify dashboard
# Or use netlify CLI: netlify deploy --prod --dir=dist
```

### Deploy to GitHub Pages

```bash
# vite.config.js — add base:
export default defineConfig({ base: "/photobooth-app/", plugins: [react()] })

npm run build
npm i -g gh-pages
gh-pages -d dist
```

### HTTPS Requirement

Camera access (`getUserMedia`) requires **HTTPS** in production. All major static hosts (Vercel, Netlify, Cloudflare Pages) provide HTTPS automatically.

For local testing without HTTPS, `localhost` is always allowed by browsers.

---

## 8. Troubleshooting

| Problem | Cause | Fix |
|---------|-------|-----|
| Camera shows "not available" | No HTTPS or permission denied | Use localhost for dev; use HTTPS in prod |
| Photos appear mirrored | Video feed is CSS-mirrored but canvas isn't | Canvas applies `ctx.scale(-1,1)` to correct |
| Strip not downloading | Canvas blocked by CORS | Ensure photos are from same origin (webcam = OK) |
| Countdown doesn't fire | `capturing` state not cleared | Check `setCapturing(false)` in finally block |
| Fonts not loading | Network / CSP | Check Google Fonts is not blocked |

---

## 9. Browser Compatibility

| Browser       | Camera | Canvas | Download |
|---------------|--------|--------|----------|
| Chrome 90+    | ✅     | ✅     | ✅       |
| Firefox 90+   | ✅     | ✅     | ✅       |
| Safari 14.5+  | ✅     | ✅     | ✅       |
| Edge 90+      | ✅     | ✅     | ✅       |
| iOS Safari    | ✅     | ✅     | ⚠️ Share sheet |
| Android Chrome| ✅     | ✅     | ✅       |

---

## 10. Contribution Guidelines

1. Fork the repo and create a feature branch: `git checkout -b feature/my-template`
2. Keep all new templates in the `TEMPLATES` array in `App.jsx`
3. Test on both mobile (Chrome DevTools) and desktop
4. Verify camera cleanup on unmount / navigation
5. Open a PR with a screenshot of the new template

---

*Last updated: March 2026*
