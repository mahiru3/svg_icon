// app.js
(() => {
  const $ = (id) => document.getElementById(id);

  const state = {
    // 出力：固定576（svg.js側で固定）
    numText: "0",
    gradTop: "#E9FFFF",
    gradBottom: "#1BCBFF",

    // 3. 文字
    numSize: 560,
    numGlow: 3.0,      // 1
    numScaleX: 1.0,    // 2
    numScaleY: 1.0,    // 2
    numX: 0,           // 6
    numY: 0,           // 6

    // プレビュー
    previewMode: "fit", // "fit" | "actual"
    previewScale: 100,  // 4（actual時のみ適用）
    showGuide: true,

    // 出力
    clipMode: "clip",   // "clip" | "noclip"

    // 4. 背景
    crossColor: "#B8F5FF",
    crossWidth: 2.0,

    bgX: 0,
    bgY: 0,
    bgScale: 1.0,       // 3

    c1Color: "#77ECFF", c1R: 92,  c1X: 0, c1Y: 0,
    c2Color: "#77ECFF", c2R: 126, c2X: 0, c2Y: 0,
    c3Color: "#77ECFF", c3R: 160, c3X: 0, c3Y: 0,

    c3Stroke: 2,
    c3Opacity: 0.12,
    c3RingWidth: 22,
    c3RingOpacity: 0.85,

    bgGlow: 1.4,
    sparkCount: 12,

    // 5. 設定カラム幅
    leftWidth: 420
  };

  const setText = (id, v) => {
    const el = $(id);
    if (el) el.textContent = v;
  };

  const applyLeftWidth = () => {
    document.documentElement.style.setProperty("--leftW", `${state.leftWidth}px`);
    setText("leftWidthVal", state.leftWidth);
  };

  // プレビュー変形（svg/ガイド共通）
  const applyPreviewTransform = (el) => {
    if (!el) return;
    const base = 576;

    if (state.previewMode === "actual") {
      el.style.width = `${base}px`;
      el.style.height = `${base}px`;
      el.style.transform = `scale(${state.previewScale / 100})`;
      el.style.transformOrigin = "center center";
      return;
    }

    const box = $("previewBox");
    if (!box) return;
    const pad = 28; // 14*2
    const availW = Math.max(50, box.clientWidth - pad);
    const availH = Math.max(50, box.clientHeight - pad);
    const fit = Math.min(availW / base, availH / base);

    el.style.width = `${base}px`;
    el.style.height = `${base}px`;
    el.style.transform = `scale(${fit})`;
    el.style.transformOrigin = "center center";
  };

  function render() {
    applyLeftWidth();

    const svg = window.buildSVG(state);
    $("preview").innerHTML = svg;

    const svgEl = document.querySelector("#preview svg");
    const guideEl = $("guideOverlay");

    applyPreviewTransform(svgEl);
    applyPreviewTransform(guideEl);

    if (guideEl) guideEl.style.display = state.showGuide ? "block" : "none";

    // 表示値
    setText("numSizeVal", state.numSize);
    setText("numGlowVal", state.numGlow.toFixed(1));
    setText("numScaleXVal", state.numScaleX.toFixed(2));
    setText("numScaleYVal", state.numScaleY.toFixed(2));
    setText("numXVal", state.numX);
    setText("numYVal", state.numY);

    setText("crossWidthVal", state.crossWidth.toFixed(1));

    setText("bgXVal", state.bgX);
    setText("bgYVal", state.bgY);
    setText("bgScaleVal", state.bgScale.toFixed(2));

    setText("c1RVal", state.c1R);
    setText("c1XVal", state.c1X);
    setText("c1YVal", state.c1Y);

    setText("c2RVal", state.c2R);
    setText("c2XVal", state.c2X);
    setText("c2YVal", state.c2Y);

    setText("c3RVal", state.c3R);
    setText("c3XVal", state.c3X);
    setText("c3YVal", state.c3Y);

    setText("c3StrokeVal", state.c3Stroke.toFixed(1));
    setText("c3OpacityVal", state.c3Opacity.toFixed(2));
    setText("c3RingWidthVal", state.c3RingWidth);
    setText("c3RingOpacityVal", state.c3RingOpacity.toFixed(2));

    setText("bgGlowVal", state.bgGlow.toFixed(1));
    setText("sparkCountVal", state.sparkCount);

    setText("previewScaleVal", state.previewScale);

    return svg;
  }

  function bind(id, key, parser = (v) => v) {
    const el = $(id);
    if (!el) return;
    const handler = () => {
      state[key] = parser(el.value);
      render();
    };
    el.addEventListener("input", handler);
    el.addEventListener("change", handler);
  }

  // bind：レイアウト
  bind("leftWidth", "leftWidth", Number);

  // bind：文字
  bind("numText", "numText", (v) => v);
  bind("gradTop", "gradTop");
  bind("gradBottom", "gradBottom");
  bind("numSize", "numSize", Number);
  bind("numGlow", "numGlow", Number);
  bind("numScaleX", "numScaleX", Number);
  bind("numScaleY", "numScaleY", Number);
  bind("numX", "numX", Number);
  bind("numY", "numY", Number);

  // 背景
  bind("crossColor", "crossColor");
  bind("crossWidth", "crossWidth", Number);
  bind("bgX", "bgX", Number);
  bind("bgY", "bgY", Number);
  bind("bgScale", "bgScale", Number);

  bind("c1Color", "c1Color"); bind("c1R", "c1R", Number); bind("c1X", "c1X", Number); bind("c1Y", "c1Y", Number);
  bind("c2Color", "c2Color"); bind("c2R", "c2R", Number); bind("c2X", "c2X", Number); bind("c2Y", "c2Y", Number);
  bind("c3Color", "c3Color"); bind("c3R", "c3R", Number); bind("c3X", "c3X", Number); bind("c3Y", "c3Y", Number);

  bind("c3Stroke", "c3Stroke", Number);
  bind("c3Opacity", "c3Opacity", Number);
  bind("c3RingWidth", "c3RingWidth", Number);
  bind("c3RingOpacity", "c3RingOpacity", Number);

  bind("bgGlow", "bgGlow", Number);
  bind("sparkCount", "sparkCount", Number);

  // プレビュー
  bind("previewScale", "previewScale", Number);
  bind("clipMode", "clipMode", (v) => v);

  // showGuide（checkbox）
  const showGuideEl = $("showGuide");
  if (showGuideEl) {
    showGuideEl.addEventListener("change", () => {
      state.showGuide = showGuideEl.checked;
      render();
    });
  }

  // Fit / 100%
  $("btnFit")?.addEventListener("click", () => {
    state.previewMode = "fit";
    render();
  });
  $("btnActual")?.addEventListener("click", () => {
    state.previewMode = "actual";
    render();
  });

  // ボタン
  $("btnShow")?.addEventListener("click", () => {
    $("code").value = window.buildSVG(state);
    $("code").focus();
    $("code").select();
  });

  $("btnCopy")?.addEventListener("click", async () => {
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

  $("btnDl")?.addEventListener("click", () => {
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

  $("btnReset")?.addEventListener("click", () => location.reload());

  // 右カラム：プレビュー高さドラッグ
  function initPreviewResizer(){
    const rightPane = $("rightPane");
    const resizer = $("resizer");
    const previewCard = $("previewCard");
    if (!rightPane || !resizer || !previewCard) return;

    let previewH = null;
    const clamp = (v, min, max) => Math.max(min, Math.min(max, v));
    const setPreviewHeight = (px) => { rightPane.style.gridTemplateRows = `${px}px 10px 1fr`; };
    const getPreviewHeightNow = () => previewCard.getBoundingClientRect().height;

    const onDown = (e) => {
      e.preventDefault();
      const rect = rightPane.getBoundingClientRect();
      const startY = e.clientY;
      if (previewH === null) previewH = getPreviewHeightNow();
      const startH = previewH;

      const onMove = (ev) => {
        const dy = ev.clientY - startY;
        const next = startH + dy;
        previewH = clamp(next, 220, rect.height - 200);
        setPreviewHeight(previewH);
        render();
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

  // 5. 左カラム幅ドラッグ（colResizer）
  function initColumnResizer(){
    const bar = $("colResizer");
    const main = $("mainGrid");
    if (!bar || !main) return;

    const clamp = (v, min, max) => Math.max(min, Math.min(max, v));

    const onDown = (e) => {
      e.preventDefault();
      const rect = main.getBoundingClientRect();
      const startX = e.clientX;
      const startW = state.leftWidth;

      const onMove = (ev) => {
        const dx = ev.clientX - startX;
        const next = clamp(startW + dx, 320, 760);
        state.leftWidth = Math.round(next / 10) * 10;

        const slider = $("leftWidth");
        if (slider) slider.value = String(state.leftWidth);

        applyLeftWidth();
        render();
      };

      const onUp = () => {
        window.removeEventListener("mousemove", onMove);
        window.removeEventListener("mouseup", onUp);
      };

      window.addEventListener("mousemove", onMove);
      window.addEventListener("mouseup", onUp);
    };

    bar.addEventListener("mousedown", onDown);
  }

  window.addEventListener("DOMContentLoaded", () => {
    initPreviewResizer();
    initColumnResizer();
    render();
  });

  window.addEventListener("resize", () => render());
})();
