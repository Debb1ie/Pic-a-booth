import { useState, useRef, useEffect, useCallback } from "react";

// ─── TEMPLATE DEFINITIONS ───────────────────────────────────────────────────
const TEMPLATES = [
  {
    id: "classic-strip",
    name: "Classic Strip",
    tag: "Timeless",
    color: "#f5e6d3",
    accent: "#c8956c",
    bg: "linear-gradient(135deg, #f5e6d3 0%, #e8d5b7 100%)",
    frames: 4,
    layout: "vertical-strip",
    border: 14,
    borderColor: "#fff",
    outerBg: "#1a1a1a",
    font: "Georgia, serif",
    labelColor: "#7a5c3a",
  },
  {
    id: "neon-nights",
    name: "Neon Nights",
    tag: "Party",
    color: "#0d0d1a",
    accent: "#ff00ff",
    bg: "linear-gradient(135deg, #0d0d1a 0%, #1a0033 100%)",
    frames: 4,
    layout: "vertical-strip",
    border: 12,
    borderColor: "#ff00ff",
    outerBg: "#000010",
    font: "'Courier New', monospace",
    labelColor: "#ff00ff",
  },
  {
    id: "pastel-dream",
    name: "Pastel Dream",
    tag: "Cute",
    color: "#fff0f5",
    accent: "#ff9eb5",
    bg: "linear-gradient(135deg, #fff0f5 0%, #ffe4f0 100%)",
    frames: 3,
    layout: "grid-2x2",
    border: 10,
    borderColor: "#fff",
    outerBg: "#ffb3cc",
    font: "Georgia, serif",
    labelColor: "#cc6688",
  },
  {
    id: "polaroid-party",
    name: "Polaroid Party",
    tag: "Vintage",
    color: "#fffff0",
    accent: "#e8c84a",
    bg: "#fffff0",
    frames: 4,
    layout: "polaroid-grid",
    border: 8,
    borderColor: "#fffff0",
    outerBg: "#d4c5a9",
    font: "Georgia, serif",
    labelColor: "#5a4a2a",
  },
  {
    id: "dark-glam",
    name: "Dark Glam",
    tag: "Luxury",
    color: "#0a0a0a",
    accent: "#d4af37",
    bg: "linear-gradient(135deg, #0a0a0a 0%, #1c1408 100%)",
    frames: 4,
    layout: "vertical-strip",
    border: 16,
    borderColor: "#d4af37",
    outerBg: "#050505",
    font: "Georgia, serif",
    labelColor: "#d4af37",
  },
  {
    id: "retro-pop",
    name: "Retro Pop",
    tag: "Fun",
    color: "#fff5e0",
    accent: "#ff4444",
    bg: "linear-gradient(135deg, #fff5e0 0%, #ffe0b2 100%)",
    frames: 4,
    layout: "vertical-strip",
    border: 12,
    borderColor: "#ff4444",
    outerBg: "#ff4444",
    font: "'Courier New', monospace",
    labelColor: "#cc2200",
  },
  {
    id: "fairy-tale",
    name: "Fairy Tale",
    tag: "Magical",
    color: "#f0e8ff",
    accent: "#9b5de5",
    bg: "linear-gradient(135deg, #f0e8ff 0%, #e0d0ff 100%)",
    frames: 3,
    layout: "vertical-strip",
    border: 14,
    borderColor: "#9b5de5",
    outerBg: "#6a0dad",
    font: "Georgia, serif",
    labelColor: "#6a0dad",
  },
  {
    id: "mint-fresh",
    name: "Mint Fresh",
    tag: "Clean",
    color: "#e8fff8",
    accent: "#00b894",
    bg: "linear-gradient(135deg, #e8fff8 0%, #d0f5ea 100%)",
    frames: 4,
    layout: "grid-2x2",
    border: 10,
    borderColor: "#fff",
    outerBg: "#00b894",
    font: "Georgia, serif",
    labelColor: "#007a63",
  },
];

const FILTERS = [
  { id: "none", name: "Original", css: "none" },
  { id: "bw", name: "B&W", css: "grayscale(100%)" },
  { id: "sepia", name: "Sepia", css: "sepia(80%)" },
  { id: "vivid", name: "Vivid", css: "saturate(180%) contrast(110%)" },
  { id: "fade", name: "Faded", css: "brightness(110%) contrast(80%) saturate(70%)" },
  { id: "cool", name: "Cool", css: "hue-rotate(30deg) saturate(120%)" },
  { id: "warm", name: "Warm", css: "sepia(30%) saturate(140%) brightness(105%)" },
  { id: "dramatic", name: "Dramatic", css: "contrast(140%) brightness(90%)" },
];

// ─── COUNTDOWN COMPONENT ─────────────────────────────────────────────────────
function Countdown({ count }) {
  return (
    <div className="countdown-overlay">
      <div className="countdown-number" key={count}>{count}</div>
    </div>
  );
}

// ─── TEMPLATE PREVIEW ────────────────────────────────────────────────────────
function TemplateCard({ template, selected, onSelect }) {
  return (
    <button
      className={`template-card ${selected ? "selected" : ""}`}
      onClick={() => onSelect(template)}
      style={{ "--accent": template.accent, "--card-bg": template.outerBg }}
    >
      <div className="template-preview" style={{ background: template.outerBg }}>
        <div className="template-strip" style={{ background: template.bg, border: `3px solid ${template.borderColor}` }}>
          {[...Array(Math.min(template.frames, 3))].map((_, i) => (
            <div key={i} className="template-frame-preview" style={{ borderColor: template.borderColor }}>
              <div className="frame-placeholder" style={{ background: `${template.accent}22` }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill={template.accent} opacity="0.5">
                  <path d="M20 5h-3.17L15 3H9L7.17 5H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm-8 13c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5z"/>
                </svg>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="template-info">
        <span className="template-tag" style={{ background: `${template.accent}22`, color: template.accent }}>{template.tag}</span>
        <span className="template-name">{template.name}</span>
      </div>
      {selected && <div className="selected-badge">✓</div>}
    </button>
  );
}

// ─── PHOTO STRIP CANVAS RENDERER ─────────────────────────────────────────────
function PhotoStrip({ photos, template, filter, customText }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!canvasRef.current || photos.length === 0) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const W = 320, PH = 240, PAD = template.border, GAP = 8;
    const STRIP_H = PAD + (PH + GAP) * photos.length - GAP + PAD + 48;

    canvas.width = W;
    canvas.height = STRIP_H;

    // Outer background
    ctx.fillStyle = template.outerBg;
    ctx.fillRect(0, 0, W, STRIP_H);

    // Inner strip background
    const grd = ctx.createLinearGradient(0, 0, W, STRIP_H);
    if (template.bg.startsWith("linear-gradient")) {
      const colors = template.bg.match(/#[a-fA-F0-9]{6}/g) || [template.color, template.accent];
      grd.addColorStop(0, colors[0] || template.color);
      grd.addColorStop(1, colors[1] || template.color);
    } else {
      grd.addColorStop(0, template.bg);
      grd.addColorStop(1, template.bg);
    }
    ctx.fillStyle = grd;
    ctx.roundRect(4, 4, W - 8, STRIP_H - 8, 8);
    ctx.fill();

    // Draw photos
    photos.forEach((src, i) => {
      const img = new Image();
      img.onload = () => {
        const y = PAD + i * (PH + GAP);
        ctx.save();
        ctx.roundRect(PAD, y, W - PAD * 2, PH, 4);
        ctx.clip();

        // Apply filter manually for canvas (approximate)
        if (filter.id === "bw") {
          ctx.filter = "grayscale(100%)";
        } else if (filter.id === "sepia") {
          ctx.filter = "sepia(80%)";
        } else if (filter.id === "vivid") {
          ctx.filter = "saturate(180%) contrast(110%)";
        } else {
          ctx.filter = "none";
        }

        ctx.drawImage(img, PAD, y, W - PAD * 2, PH);
        ctx.restore();
        ctx.filter = "none";

        // Frame border
        ctx.strokeStyle = template.borderColor;
        ctx.lineWidth = 2;
        ctx.roundRect(PAD, y, W - PAD * 2, PH, 4);
        ctx.stroke();
      };
      img.src = src;
    });

    // Label text
    setTimeout(() => {
      ctx.font = `bold 14px ${template.font}`;
      ctx.fillStyle = template.labelColor;
      ctx.textAlign = "center";
      ctx.fillText(customText || "✦ PHOTO BOOTH ✦", W / 2, STRIP_H - 20);

      const date = new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
      ctx.font = `10px ${template.font}`;
      ctx.fillStyle = template.labelColor;
      ctx.globalAlpha = 0.6;
      ctx.fillText(date, W / 2, STRIP_H - 6);
      ctx.globalAlpha = 1;
    }, 300);
  }, [photos, template, filter, customText]);

  return <canvas ref={canvasRef} className="photo-strip-canvas" />;
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function App() {
  const [step, setStep] = useState("home"); // home | setup | capture | strip | download
  const [selectedTemplate, setSelectedTemplate] = useState(TEMPLATES[0]);
  const [selectedFilter, setSelectedFilter] = useState(FILTERS[0]);
  const [photos, setPhotos] = useState([]);
  const [countdown, setCountdown] = useState(null);
  const [capturing, setCapturing] = useState(false);
  const [stream, setStream] = useState(null);
  const [customText, setCustomText] = useState("");
  const [cameraError, setCameraError] = useState(false);
  const [flashActive, setFlashActive] = useState(false);

  const videoRef = useRef(null);
  const totalFrames = selectedTemplate.frames;

  // Start camera
  const startCamera = useCallback(async () => {
    try {
      const s = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user", width: 1280, height: 720 }, audio: false });
      setStream(s);
      setCameraError(false);
      if (videoRef.current) {
        videoRef.current.srcObject = s;
      }
    } catch {
      setCameraError(true);
    }
  }, []);

  // Stop camera
  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach(t => t.stop());
      setStream(null);
    }
  }, [stream]);

  useEffect(() => {
    if (step === "capture") startCamera();
    if (step !== "capture") stopCamera();
    return () => { if (step !== "capture") stopCamera(); };
  }, [step]);

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  // Take a single photo
  const snapPhoto = useCallback(() => {
    const video = videoRef.current;
    if (!video) return null;
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    const ctx = canvas.getContext("2d");
    ctx.filter = selectedFilter.css;
    ctx.save();
    ctx.translate(canvas.width, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(video, 0, 0);
    ctx.restore();
    return canvas.toDataURL("image/jpeg", 0.92);
  }, [selectedFilter]);

  // Capture sequence
  const startCapture = useCallback(async () => {
    if (capturing) return;
    setCapturing(true);
    const taken = [];

    for (let i = 0; i < totalFrames; i++) {
      // Countdown 3,2,1
      for (let c = 3; c >= 1; c--) {
        setCountdown(c);
        await new Promise(r => setTimeout(r, 1000));
      }
      setCountdown("📸");
      setFlashActive(true);
      await new Promise(r => setTimeout(r, 120));

      const photo = snapPhoto();
      if (photo) taken.push(photo);
      setFlashActive(false);
      setCountdown(null);

      if (i < totalFrames - 1) await new Promise(r => setTimeout(r, 900));
    }

    setPhotos(taken);
    setCapturing(false);
    setCountdown(null);
    setStep("strip");
  }, [capturing, totalFrames, snapPhoto]);

  // Download
  const downloadStrip = () => {
    const canvas = document.querySelector(".photo-strip-canvas");
    if (!canvas) return;
    const link = document.createElement("a");
    link.download = `photobooth-${selectedTemplate.id}-${Date.now()}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  const retake = () => {
    setPhotos([]);
    setStep("capture");
  };

  return (
    <div className="app">
      <style>{CSS}</style>

      {/* ── HOME ── */}
      {step === "home" && (
        <div className="screen home-screen">
          <div className="home-bg">
            <div className="bg-circle c1" />
            <div className="bg-circle c2" />
            <div className="bg-circle c3" />
          </div>
          <div className="home-content">
            <div className="home-logo">
              <div className="logo-icon">📸</div>
              <h1 className="logo-title">SnapBooth</h1>
              <p className="logo-sub">Mall Photo Experience</p>
            </div>
            <div className="home-features">
              <div className="feat">
                <span>🎨</span>
                <span>{TEMPLATES.length} Templates</span>
              </div>
              <div className="feat">
                <span>✨</span>
                <span>{FILTERS.length} Filters</span>
              </div>
              <div className="feat">
                <span>⚡</span>
                <span>Instant Print</span>
              </div>
            </div>
            <button className="btn-primary" onClick={() => setStep("setup")}>
              Start Session
            </button>
          </div>
        </div>
      )}

      {/* ── SETUP ── */}
      {step === "setup" && (
        <div className="screen setup-screen">
          <div className="screen-header">
            <button className="btn-back" onClick={() => setStep("home")}>← Back</button>
            <h2>Choose Your Style</h2>
            <div className="step-pill">Step 1 of 3</div>
          </div>

          <div className="section-label">Select Template</div>
          <div className="templates-grid">
            {TEMPLATES.map(t => (
              <TemplateCard
                key={t.id}
                template={t}
                selected={selectedTemplate.id === t.id}
                onSelect={setSelectedTemplate}
              />
            ))}
          </div>

          <div className="section-label">Select Filter</div>
          <div className="filters-row">
            {FILTERS.map(f => (
              <button
                key={f.id}
                className={`filter-btn ${selectedFilter.id === f.id ? "active" : ""}`}
                onClick={() => setSelectedFilter(f)}
              >
                <div className="filter-preview" style={{ filter: f.css, background: "linear-gradient(135deg,#e0b0ff,#ffd6e0,#fffacd)" }} />
                <span>{f.name}</span>
              </button>
            ))}
          </div>

          <div className="section-label">Custom Label (optional)</div>
          <input
            className="text-input"
            placeholder="e.g. Sarah's Birthday 🎂"
            value={customText}
            onChange={e => setCustomText(e.target.value)}
            maxLength={40}
          />

          <div className="setup-footer">
            <div className="template-summary">
              <strong>{selectedTemplate.name}</strong>
              <span>{totalFrames} photos · {selectedFilter.name} filter</span>
            </div>
            <button className="btn-primary" onClick={() => setStep("capture")}>
              Open Camera →
            </button>
          </div>
        </div>
      )}

      {/* ── CAPTURE ── */}
      {step === "capture" && (
        <div className="screen capture-screen" style={{ "--template-accent": selectedTemplate.accent }}>
          {flashActive && <div className="flash-overlay" />}
          {countdown !== null && <Countdown count={countdown} />}

          <div className="camera-header">
            <button className="btn-back-dark" onClick={() => setStep("setup")}>← Back</button>
            <div className="progress-dots">
              {[...Array(totalFrames)].map((_, i) => (
                <div key={i} className={`dot ${i < photos.length ? "done" : ""}`} />
              ))}
            </div>
            <span className="shots-left">{photos.length}/{totalFrames}</span>
          </div>

          <div className="camera-container">
            {cameraError ? (
              <div className="camera-error">
                <div className="error-icon">📷</div>
                <p>Camera not available</p>
                <small>Please allow camera access or use a device with a camera</small>
              </div>
            ) : (
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="camera-feed"
                style={{ filter: selectedFilter.css }}
              />
            )}
            <div className="camera-frame-overlay" style={{ borderColor: selectedTemplate.accent }} />
          </div>

          <div className="capture-footer">
            <div className="template-badge" style={{ background: selectedTemplate.accent }}>
              {selectedTemplate.name}
            </div>
            <button
              className="shutter-btn"
              onClick={startCapture}
              disabled={capturing || cameraError}
              style={{ "--accent": selectedTemplate.accent }}
            >
              <div className="shutter-inner" />
            </button>
            <div className="filter-badge">{selectedFilter.name}</div>
          </div>
        </div>
      )}

      {/* ── STRIP ── */}
      {step === "strip" && (
        <div className="screen strip-screen">
          <div className="screen-header">
            <button className="btn-back" onClick={() => setStep("setup")}>← New</button>
            <h2>Your Photo Strip</h2>
            <div className="step-pill done">Done!</div>
          </div>

          <div className="strip-preview-container">
            <div className="strip-glow" style={{ background: selectedTemplate.accent }} />
            <PhotoStrip
              photos={photos}
              template={selectedTemplate}
              filter={selectedFilter}
              customText={customText}
            />
          </div>

          <div className="strip-actions">
            <button className="btn-secondary" onClick={retake}>🔄 Retake</button>
            <button className="btn-primary" onClick={downloadStrip}>⬇ Download</button>
          </div>

          <div className="strip-info">
            <span>📅 {new Date().toLocaleDateString()}</span>
            <span>🎨 {selectedTemplate.name}</span>
            <span>✨ {selectedFilter.name}</span>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── STYLES ───────────────────────────────────────────────────────────────────
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=DM+Sans:wght@300;400;500;600&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --pink: #ff4f93;
    --purple: #8b5cf6;
    --gold: #f59e0b;
    --dark: #0f0f14;
    --card: #1a1a24;
    --border: rgba(255,255,255,0.08);
    --text: #f0f0f5;
    --muted: rgba(240,240,245,0.5);
    --radius: 16px;
  }

  body { background: var(--dark); color: var(--text); font-family: 'DM Sans', sans-serif; }

  .app {
    min-height: 100vh;
    max-width: 480px;
    margin: 0 auto;
    background: var(--dark);
    position: relative;
    overflow-x: hidden;
  }

  .screen {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    padding: 0;
    animation: fadeIn 0.3s ease;
  }

  @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: none; } }

  /* ─ HOME ─ */
  .home-screen { background: var(--dark); position: relative; justify-content: center; align-items: center; padding: 40px 24px; }
  .home-bg { position: absolute; inset: 0; overflow: hidden; pointer-events: none; }
  .bg-circle { position: absolute; border-radius: 50%; filter: blur(80px); opacity: 0.15; }
  .c1 { width: 300px; height: 300px; background: var(--pink); top: -80px; right: -80px; animation: drift 8s ease-in-out infinite; }
  .c2 { width: 250px; height: 250px; background: var(--purple); bottom: 20px; left: -60px; animation: drift 10s ease-in-out infinite reverse; }
  .c3 { width: 180px; height: 180px; background: var(--gold); top: 40%; left: 40%; animation: drift 12s ease-in-out infinite 2s; }
  @keyframes drift { 0%,100% { transform: translate(0,0); } 50% { transform: translate(20px,-20px); } }

  .home-content { position: relative; z-index: 1; text-align: center; display: flex; flex-direction: column; align-items: center; gap: 32px; }

  .logo-icon { font-size: 64px; line-height: 1; filter: drop-shadow(0 0 20px rgba(255,79,147,0.5)); animation: pulse 2s ease-in-out infinite; }
  @keyframes pulse { 0%,100% { transform: scale(1); } 50% { transform: scale(1.05); } }

  .logo-title { font-family: 'Playfair Display', serif; font-size: 52px; font-weight: 700; background: linear-gradient(135deg, #ff4f93, #f59e0b); -webkit-background-clip: text; -webkit-text-fill-color: transparent; line-height: 1.1; }
  .logo-sub { color: var(--muted); font-size: 15px; letter-spacing: 3px; text-transform: uppercase; margin-top: 4px; }

  .home-features { display: flex; gap: 20px; }
  .feat { display: flex; flex-direction: column; align-items: center; gap: 6px; background: rgba(255,255,255,0.05); border: 1px solid var(--border); border-radius: 12px; padding: 12px 16px; font-size: 13px; color: var(--muted); }
  .feat span:first-child { font-size: 22px; }

  /* ─ BUTTONS ─ */
  .btn-primary {
    background: linear-gradient(135deg, var(--pink), #c42c7a);
    color: white;
    border: none;
    padding: 16px 40px;
    border-radius: 50px;
    font-size: 16px;
    font-weight: 600;
    font-family: 'DM Sans', sans-serif;
    cursor: pointer;
    box-shadow: 0 8px 30px rgba(255,79,147,0.35);
    transition: all 0.2s;
    letter-spacing: 0.3px;
  }
  .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 12px 36px rgba(255,79,147,0.45); }
  .btn-primary:active { transform: translateY(0); }

  .btn-secondary {
    background: rgba(255,255,255,0.08);
    color: var(--text);
    border: 1px solid var(--border);
    padding: 14px 28px;
    border-radius: 50px;
    font-size: 15px;
    font-weight: 500;
    font-family: 'DM Sans', sans-serif;
    cursor: pointer;
    transition: all 0.2s;
  }
  .btn-secondary:hover { background: rgba(255,255,255,0.12); }

  .btn-back { background: none; border: none; color: var(--muted); font-size: 14px; cursor: pointer; padding: 4px 0; font-family: 'DM Sans', sans-serif; }
  .btn-back:hover { color: var(--text); }
  .btn-back-dark { background: rgba(0,0,0,0.4); border: 1px solid rgba(255,255,255,0.15); color: white; font-size: 13px; cursor: pointer; padding: 8px 14px; border-radius: 8px; font-family: 'DM Sans', sans-serif; }

  /* ─ SETUP ─ */
  .setup-screen { padding: 0 0 120px 0; overflow-y: auto; }
  .screen-header { display: flex; align-items: center; justify-content: space-between; padding: 20px 20px 16px; border-bottom: 1px solid var(--border); position: sticky; top: 0; background: var(--dark); z-index: 10; }
  .screen-header h2 { font-family: 'Playfair Display', serif; font-size: 20px; }
  .step-pill { background: rgba(255,79,147,0.15); color: var(--pink); border: 1px solid rgba(255,79,147,0.3); border-radius: 20px; padding: 4px 12px; font-size: 12px; font-weight: 600; }
  .step-pill.done { background: rgba(16,185,129,0.15); color: #10b981; border-color: rgba(16,185,129,0.3); }

  .section-label { padding: 20px 20px 10px; font-size: 11px; font-weight: 600; letter-spacing: 2px; text-transform: uppercase; color: var(--muted); }

  .templates-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; padding: 0 16px; }

  .template-card {
    background: var(--card);
    border: 2px solid var(--border);
    border-radius: 12px;
    cursor: pointer;
    padding: 8px 8px 6px;
    transition: all 0.2s;
    position: relative;
    text-align: center;
  }
  .template-card:hover { border-color: rgba(255,255,255,0.2); transform: translateY(-2px); }
  .template-card.selected { border-color: var(--accent); box-shadow: 0 0 0 3px color-mix(in srgb, var(--accent) 25%, transparent); }

  .template-preview { height: 90px; border-radius: 8px; padding: 6px; display: flex; align-items: center; justify-content: center; }
  .template-strip { width: 44px; border-radius: 4px; padding: 4px; display: flex; flex-direction: column; gap: 3px; }
  .template-frame-preview { border-radius: 2px; border: 1.5px solid; overflow: hidden; }
  .frame-placeholder { height: 18px; display: flex; align-items: center; justify-content: center; }
  .template-info { display: flex; flex-direction: column; gap: 2px; margin-top: 6px; }
  .template-tag { font-size: 9px; font-weight: 700; border-radius: 4px; padding: 1px 5px; text-transform: uppercase; letter-spacing: 0.5px; }
  .template-name { font-size: 10px; color: var(--muted); font-weight: 500; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .selected-badge { position: absolute; top: 5px; right: 5px; background: var(--accent); color: white; width: 16px; height: 16px; border-radius: 50%; font-size: 9px; display: flex; align-items: center; justify-content: center; font-weight: 700; }

  .filters-row { display: flex; gap: 8px; padding: 0 16px; overflow-x: auto; scrollbar-width: none; padding-bottom: 4px; }
  .filters-row::-webkit-scrollbar { display: none; }

  .filter-btn {
    flex: none;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 5px;
    background: var(--card);
    border: 2px solid var(--border);
    border-radius: 10px;
    padding: 8px 10px;
    cursor: pointer;
    transition: all 0.2s;
    color: var(--muted);
    font-size: 11px;
    font-family: 'DM Sans', sans-serif;
  }
  .filter-btn.active { border-color: var(--pink); color: var(--text); }
  .filter-preview { width: 40px; height: 30px; border-radius: 6px; }

  .text-input {
    margin: 0 16px;
    padding: 12px 16px;
    background: var(--card);
    border: 1px solid var(--border);
    border-radius: 12px;
    color: var(--text);
    font-size: 14px;
    font-family: 'DM Sans', sans-serif;
    width: calc(100% - 32px);
    outline: none;
    transition: border-color 0.2s;
  }
  .text-input:focus { border-color: var(--pink); }
  .text-input::placeholder { color: var(--muted); }

  .setup-footer {
    position: fixed;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 100%;
    max-width: 480px;
    padding: 16px 20px;
    background: linear-gradient(to top, var(--dark) 70%, transparent);
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
  }
  .template-summary { display: flex; flex-direction: column; gap: 2px; }
  .template-summary strong { font-size: 15px; }
  .template-summary span { font-size: 12px; color: var(--muted); }

  /* ─ CAPTURE ─ */
  .capture-screen { background: #000; padding: 0; }
  .flash-overlay { position: fixed; inset: 0; background: white; z-index: 100; animation: flashAnim 0.15s ease; pointer-events: none; }
  @keyframes flashAnim { 0%,100% { opacity: 0; } 50% { opacity: 1; } }

  .camera-header { display: flex; align-items: center; justify-content: space-between; padding: 16px 16px 8px; z-index: 10; }
  .progress-dots { display: flex; gap: 8px; }
  .dot { width: 10px; height: 10px; border-radius: 50%; background: rgba(255,255,255,0.2); border: 2px solid rgba(255,255,255,0.3); transition: all 0.3s; }
  .dot.done { background: var(--template-accent, var(--pink)); border-color: var(--template-accent, var(--pink)); transform: scale(1.2); }
  .shots-left { font-size: 12px; color: rgba(255,255,255,0.5); }

  .camera-container { flex: 1; position: relative; display: flex; align-items: center; justify-content: center; overflow: hidden; }
  .camera-feed { width: 100%; height: 100%; object-fit: cover; transform: scaleX(-1); }
  .camera-frame-overlay { position: absolute; inset: 20px; border: 2px solid; border-radius: 8px; opacity: 0.6; pointer-events: none; }

  .camera-error { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 12px; color: rgba(255,255,255,0.5); padding: 40px; text-align: center; }
  .error-icon { font-size: 64px; }

  .capture-footer { padding: 20px; display: flex; align-items: center; justify-content: space-between; background: #000; }
  .template-badge, .filter-badge { background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.15); border-radius: 20px; padding: 6px 14px; font-size: 12px; color: rgba(255,255,255,0.7); }

  .shutter-btn {
    width: 76px;
    height: 76px;
    border-radius: 50%;
    background: white;
    border: 4px solid var(--accent, var(--pink));
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.15s;
    box-shadow: 0 0 0 6px rgba(255,79,147,0.2);
  }
  .shutter-btn:hover { transform: scale(1.05); }
  .shutter-btn:active { transform: scale(0.95); }
  .shutter-btn:disabled { opacity: 0.4; cursor: not-allowed; }
  .shutter-inner { width: 58px; height: 58px; border-radius: 50%; background: white; border: 3px solid #ddd; }

  .countdown-overlay { position: fixed; inset: 0; display: flex; align-items: center; justify-content: center; z-index: 50; background: rgba(0,0,0,0.4); pointer-events: none; }
  .countdown-number { font-family: 'Playfair Display', serif; font-size: 120px; font-weight: 700; color: white; text-shadow: 0 4px 40px rgba(255,79,147,0.8); animation: countAnim 0.5s ease; }
  @keyframes countAnim { from { transform: scale(1.5); opacity: 0; } to { transform: scale(1); opacity: 1; } }

  /* ─ STRIP ─ */
  .strip-screen { padding: 0 0 20px; overflow-y: auto; }
  .strip-preview-container { flex: 1; display: flex; align-items: center; justify-content: center; padding: 24px 20px; position: relative; }
  .strip-glow { position: absolute; width: 200px; height: 200px; border-radius: 50%; opacity: 0.12; filter: blur(60px); pointer-events: none; }
  .photo-strip-canvas { max-width: 280px; border-radius: 8px; box-shadow: 0 20px 60px rgba(0,0,0,0.6); }

  .strip-actions { display: flex; gap: 12px; padding: 0 20px; justify-content: center; }
  .strip-info { display: flex; gap: 16px; justify-content: center; padding: 16px 20px 0; flex-wrap: wrap; }
  .strip-info span { font-size: 12px; color: var(--muted); background: rgba(255,255,255,0.05); border-radius: 6px; padding: 4px 10px; }

  /* ─ SCROLLBAR ─ */
  ::-webkit-scrollbar { width: 4px; } ::-webkit-scrollbar-track { background: transparent; } ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 2px; }
`;
