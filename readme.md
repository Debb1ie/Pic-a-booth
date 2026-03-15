# 📸 SnapBooth — Mall Photo Booth App

A modern, mobile-first photo booth web application built with React. Mimics the in-mall kiosk experience — choose a template, pick a filter, take multiple shots, and download your custom photo strip.

---

##  Features

- **8 Premium Templates** — Classic Strip, Neon Nights, Pastel Dream, Polaroid Party, Dark Glam, Retro Pop, Fairy Tale, Mint Fresh
- **8 Photo Filters** — Original, B&W, Sepia, Vivid, Faded, Cool, Warm, Dramatic
- **Live Camera Feed** — Real-time preview with filter overlay
- **Countdown Timer** — 3-2-1 countdown before each shot
- **Auto Capture Sequence** — Takes all frames automatically (3–4 shots)
- **Custom Label** — Personalize the strip with your own text
- **One-tap Download** — Saves your strip as a PNG
- **No backend required** — 100% client-side

---

##  Demo Flow

```
Home → Choose Template & Filter → Camera Capture (auto-sequence) → Preview Strip → Download
```

---

## 🛠️ Tech Stack

| Layer        | Technology                        |
|--------------|-----------------------------------|
| Framework    | React 18                          |
| Build Tool   | Vite                              |
| Styling      | CSS-in-JS (inline `<style>` tag)  |
| Camera API   | `navigator.mediaDevices.getUserMedia` |
| Rendering    | HTML5 Canvas API                  |
| Fonts        | Google Fonts (Playfair Display, DM Sans) |
| Dependencies | None (zero external UI libraries) |

---

##  Project Structure

```
photobooth-app/
├── public/
│   └── vite.svg
├── src/
│   ├── App.jsx          # Main application (all components + styles)
│   └── main.jsx         # React entry point
├── index.html
├── package.json
├── vite.config.js
├── README.md            # ← You are here
└── SETUP.md             # Developer setup documentation
```

---

##  Quick Start

```bash
# 1. Clone / copy the project
cd photobooth-app

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev

# 4. Open in browser
# http://localhost:5173
```

>  Camera access requires HTTPS in production. Use `localhost` for local dev.

---

##  Mobile Support

The app is designed as a **480px-max mobile-first** layout. Works on:

- Chrome (desktop + Android)
- Safari (iOS 14.5+)
- Firefox (desktop)
- Edge (desktop)

---

##  Customization

### Adding a New Template

In `App.jsx`, add an entry to the `TEMPLATES` array:

```js
{
  id: "my-template",         // unique slug
  name: "My Template",       // display name
  tag: "Custom",             // badge label (e.g. Party, Cute, Luxury)
  color: "#ffffff",          // base color
  accent: "#ff0000",         // accent / highlight color
  bg: "#ffffff",             // strip background (hex or CSS gradient)
  frames: 4,                 // number of photos (3 or 4)
  layout: "vertical-strip",  // layout type (future use)
  border: 12,                // frame border thickness in px
  borderColor: "#ffffff",    // frame border color
  outerBg: "#222222",        // outer strip background
  font: "Georgia, serif",    // label font
  labelColor: "#333333",     // label text color
}
```

### Adding a New Filter

```js
{ id: "my-filter", name: "My Filter", css: "hue-rotate(90deg) saturate(200%)" }
```

The `css` value is a standard CSS `filter` string applied to both the live video and the canvas capture.

---

##  Build for Production

```bash
npm run build
# Output: dist/
```

Deploy the `dist/` folder to any static host (Netlify, Vercel, GitHub Pages, S3, etc.).

---

##  Permissions

The app requests **camera access only**. No data is sent anywhere — all photo processing happens in the browser.

---

## License

MIT — free to use, modify, and deploy commercially.
