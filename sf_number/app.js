// app.js
(() => {
  const $ = (id) => document.getElementById(id);

  const state = {
    numText: "0",
    gradTop: "#E9FFFF",
    gradBottom: "#1BCBFF",
    numSize: 560,
    numGlow: 3.0,
    previewSize: 576,
    previewScale: 100,
    
    crossColor: "#B8F5FF",
    crossWidth: 2.0,
    previewMode: "fit",   // "fit" | "actual"
    showGuide: true,
    clipMode: "clip",     // "clip" | "noclip"
    // 背景一括移動
    bgX: 0,
    bgY: 0,

    c1Color: "#77ECFF", c1R: 92,  c1X: 0, c1Y: 0,
    c2Color: "#77ECFF", c2R: 126, c2X: 0, c2Y: 0,
    c3Color: "#77ECFF", c3R: 160, c3X: 0, c3Y: 0,

    // ⑥追加
    c3Stroke: 2,
    c3Opacity: 0.12,
    c3RingWidth: 22,
    c3RingOpacity: 0.85,

    bgGlow: 1.4,
    sparkCount: 12
  };
// 右カラム：プレビュー高さをドラッグで変更（堅牢版）
function initPreviewResizer(){
  const rightPane = document.getElementById("rightPane");
  const resizer = document.getElementById("resizer");
  const previewCard = document.getElementById("previewCard");
  if (!rightPane || !resizer || !previewCard) return;

  let previewH = null;
  const clamp = (v, min, max) => Math.max(min, Math.min(max, v));

  const setPreviewHeight = (px) => {
    rightPane.style.gridTemplateRows = `${px}px 10px 1fr`;
  };

  const getPreviewHeightNow = () => {
    // previewCard の実測を使う（gridTemplateRows解析より確実）
    return previewCard.getBoundingClientRect().height;
  };

  const onDown = (e) => {
    e.preventDefault();

    const rect = rightPane.getBoundingClientRect();
    const startY = e.clientY;

    if (previewH === null) previewH = getPreviewHeightNow();
    const startH = previewH;

    const onMove = (ev) => {
      const dy = ev.clientY - startY;
      const next = startH + dy;

      const min = 220;
      const max = rect.height - 200;
      previewH = clamp(next, min, max);
      setPreviewHeight(previewH);
    };

    const onUp = () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
  };

  resizer.addEventListener("mousedown", onDown);
}

// DOMができてから必ず初期化
window.addEventListener("DOMContentLoaded", initPreviewResizer);


  function render() {
    const setText = (id, v) => {
    const el = $(id);
    if (el) el.textContent = v;
  };
    const svg = window.buildSVG(state);
    $("preview").innerHTML = svg;
    const svgEl = document.querySelector("#preview svg");
  if (svgEl) {
    const size  = state.previewSize;
    const scale = state.previewScale / 100;

const box = document.querySelector(".previewBox");
if (svgEl && box) {
  // 表示の基準は「576×576」の絵
  const base = 576;

  // 100%（実寸）は 576px を基準
  if (state.previewMode === "actual") {
    svgEl.style.width = `${base}px`;
    svgEl.style.height = `${base}px`;
    svgEl.style.transform = `scale(${state.previewScale / 100})`;
    svgEl.style.transformOrigin = "center center";
    return;
  }

  // Fit（全体表示）：プレビュー枠に収まる倍率を自動計算
  const pad = 28; // previewBox padding(14*2)相当
  const availW = Math.max(50, box.clientWidth - pad);
  const availH = Math.max(50, box.clientHeight - pad);

  const fit = Math.min(availW / base, availH / base);
  svgEl.style.width = `${base}px`;
  svgEl.style.height = `${base}px`;
  svgEl.style.transform = `scale(${fit})`;
  svgEl.style.transformOrigin = "center center";
}

    svgEl.style.transformOrigin = "center center";
  }

    setText("numSizeVal", state.numSize);
    setText("numGlowVal", state.numGlow);
    setText("crossWidthVal", state.crossWidth);

    setText("bgXVal", state.bgX);
    setText("bgYVal", state.bgY);

    setText("c1RVal", state.c1R);
    setText("c1XVal", state.c1X);
    setText("c1YVal", state.c1Y);

    setText("c2RVal", state.c2R);
    setText("c2XVal", state.c2X);
    setText("c2YVal", state.c2Y);

    setText("c3RVal", state.c3R);
    setText("c3XVal", state.c3X);
    setText("c3YVal", state.c3Y);

    setText("c3StrokeVal", state.c3Stroke);
    setText("c3OpacityVal", state.c3Opacity);
    setText("c3RingWidthVal", state.c3RingWidth);
    setText("c3RingOpacityVal", state.c3RingOpacity);

    setText("bgGlowVal", state.bgGlow);
    setText("sparkCountVal", state.sparkCount);

    setText("previewSizeVal", state.previewSize);
    setText("previewScaleVal", state.previewScale);

    return svg;
  }

  function bind(id, key, parser = (v) => v) {
    const el = $(id);
    const handler = () => { state[key] = parser(el.value); render(); };
    el.addEventListener("input", handler);
    el.addEventListener("change", handler);
  }

  // bind
  bind("numText", "numText", (v) => v);
  bind("gradTop", "gradTop");
  bind("gradBottom", "gradBottom");
  bind("numSize", "numSize", Number);
  bind("numGlow", "numGlow", Number);

  bind("crossColor", "crossColor");
  bind("crossWidth", "crossWidth", Number);

  bind("bgX", "bgX", Number);
  bind("bgY", "bgY", Number);

  bind("c1Color", "c1Color"); bind("c1R", "c1R", Number); bind("c1X", "c1X", Number); bind("c1Y", "c1Y", Number);
  bind("c2Color", "c2Color"); bind("c2R", "c2R", Number); bind("c2X", "c2X", Number); bind("c2Y", "c2Y", Number);
  bind("c3Color", "c3Color"); bind("c3R", "c3R", Number); bind("c3X", "c3X", Number); bind("c3Y", "c3Y", Number);

  bind("c3Stroke", "c3Stroke", Number);
  bind("c3Opacity", "c3Opacity", Number);
  bind("c3RingWidth", "c3RingWidth", Number);
  bind("c3RingOpacity", "c3RingOpacity", Number);

  bind("bgGlow", "bgGlow", Number);
  bind("sparkCount", "sparkCount", Number);
  bind("previewSize", "previewSize", Number);
  bind("previewScale", "previewScale", Number);
// プレビュー関連
bind("clipMode", "clipMode", (v) => v);

// checkbox は value ではなく checked を読む
const showGuideEl = document.getElementById("showGuide");
if (showGuideEl) {
  showGuideEl.addEventListener("change", () => {
    state.showGuide = showGuideEl.checked;
    render();
  });
}
$("btnFit")?.addEventListener("click", () => {
  state.previewMode = "fit";
  render();
});

$("btnActual")?.addEventListener("click", () => {
  state.previewMode = "actual";
  render();
});


  // buttons
  $("btnShow").addEventListener("click", () => {
    $("code").value = window.buildSVG(state);
    $("code").focus();
    $("code").select();
  });

  $("btnCopy").addEventListener("click", async () => {
    const txt = window.buildSVG(state);
    try {
      await navigator.clipboard.writeText(txt);
      $("code").value = txt;
    } catch {
      $("code").value = txt;
      $("code").focus();
      $("code").select();
      document.execCommand("copy");
    }
  });

  $("btnDl").addEventListener("click", () => {
    const svg = window.buildSVG(state);
    const blob = new Blob([svg], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    const safeNum = (state.numText ?? "0").toString().trim().replace(/[^0-9a-zA-Z_-]/g, "_") || "0";
    a.href = url;
    a.download = `touch-num-${safeNum}.svg`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  });

  $("btnReset").addEventListener("click", () => {
    // 簡単に：ページリロード
    location.reload();
  });

  // init
  render();
})();
