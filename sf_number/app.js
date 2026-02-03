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
    const svg = window.buildSVG(state);
    $("preview").innerHTML = svg;
    const svgEl = document.querySelector("#preview svg");
  if (svgEl) {
    const size  = state.previewSize;
    const scale = state.previewScale / 100;

    svgEl.style.width  = `${size}px`;
    svgEl.style.height = `${size}px`;
    svgEl.style.transform = `scale(${scale})`;
    svgEl.style.transformOrigin = "center center";
  }

    $("numSizeVal").textContent = state.numSize;
    $("numGlowVal").textContent = state.numGlow;
    $("crossWidthVal").textContent = state.crossWidth;

    $("bgXVal").textContent = state.bgX;
    $("bgYVal").textContent = state.bgY;

    $("c1RVal").textContent = state.c1R;
    $("c1XVal").textContent = state.c1X;
    $("c1YVal").textContent = state.c1Y;

    $("c2RVal").textContent = state.c2R;
    $("c2XVal").textContent = state.c2X;
    $("c2YVal").textContent = state.c2Y;

    $("c3RVal").textContent = state.c3R;
    $("c3XVal").textContent = state.c3X;
    $("c3YVal").textContent = state.c3Y;

    $("c3StrokeVal").textContent = state.c3Stroke;
    $("c3OpacityVal").textContent = state.c3Opacity;
    $("c3RingWidthVal").textContent = state.c3RingWidth;
    $("c3RingOpacityVal").textContent = state.c3RingOpacity;

    $("bgGlowVal").textContent = state.bgGlow;
    $("sparkCountVal").textContent = state.sparkCount;

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
