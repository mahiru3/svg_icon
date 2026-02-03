// svg.js
(function () {
  function esc(s) {
    return String(s)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#39;");
  }

  function clampText(t) {
    t = (t ?? "").toString().trim();
    return t.length ? t : "0";
  }

  function mulberry32(seed) {
    return function () {
      let t = (seed += 0x6d2b79f5);
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  // stateを受け取ってSVG文字列を返す
  window.buildSVG = function buildSVG(state) {
    // 出力SVGは常に 576×576
    const W = 576,
      H = 576;
    const cx = 288,
      cy = 288;

    const numText = esc(clampText(state.numText));

    // clipMode: "clip" | "noclip"
    const useClip = (state.clipMode ?? "clip") !== "noclip";

    // showGuide: boolean
    const showGuide = !!state.showGuide;

    // 背景一括移動（十字＋円）
    const bgX = Number(state.bgX ?? 0);
    const bgY = Number(state.bgY ?? 0);

    // 微細粒子
    const rng = mulberry32(20260203);
    const sparks = [];
    const sparkCount = Number(state.sparkCount ?? 0);
    for (let i = 0; i < sparkCount; i++) {
      const a = rng() * Math.PI * 2;
      const rad = 40 + rng() * 170;
      const x = cx + Math.cos(a) * rad;
      const y = cy + Math.sin(a) * rad;
      const r = 0.7 + rng() * 0.9;
      const op = 0.25 + rng() * 0.35;
      sparks.push({ x, y, r, op });
    }

    const c1 = {
      color: state.c1Color,
      r: Number(state.c1R ?? 0),
      x: Number(state.c1X ?? 0),
      y: Number(state.c1Y ?? 0),
    };
    const c2 = {
      color: state.c2Color,
      r: Number(state.c2R ?? 0),
      x: Number(state.c2X ?? 0),
      y: Number(state.c2Y ?? 0),
    };
    const c3 = {
      color: state.c3Color,
      r: Number(state.c3R ?? 0),
      x: Number(state.c3X ?? 0),
      y: Number(state.c3Y ?? 0),
    };

    // ⑥リング（今は固定：円3半径 + 50）
    const ringR = c3.r + 50;

    // ガイド（576枠／安全枠／はみ出し目安）
    const guideSvg = showGuide
      ? `
  <!-- ガイド（プレビュー用） -->
  <g pointer-events="none" fill="none">
    <!-- 576枠 -->
    <rect x="0" y="0" width="576" height="576"
          stroke="rgba(255,80,80,0.9)" stroke-width="2"/>

    <!-- 安全枠（520） -->
    <rect x="28" y="28" width="520" height="520"
          stroke="rgba(255,220,120,0.8)" stroke-width="1"
          stroke-dasharray="6 6"/>

    <!-- はみ出し目安（640） -->
    <rect x="-32" y="-32" width="640" height="640"
          stroke="rgba(120,180,255,0.7)" stroke-width="1"
          stroke-dasharray="4 8"/>
  </g>`.trim()
      : "";

    return `
<svg xmlns="http://www.w3.org/2000/svg"
     width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs>
    <filter id="thinGlow" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur stdDeviation="${Number(state.bgGlow ?? 0)}" result="b"/>
      <feMerge>
        <feMergeNode in="b"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>

    <filter id="numGlow" x="-60%" y="-60%" width="220%" height="220%">
      <feGaussianBlur stdDeviation="${Number(state.numGlow ?? 0)}" result="b"/>
      <feColorMatrix in="b" type="matrix"
        values="1 0 0 0 0
                0 1 0 0 0
                0 0 1 0 0
                0 0 0 0.85 0" result="bg"/>
      <feMerge>
        <feMergeNode in="bg"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>

    <linearGradient id="numGrad" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="${state.gradTop}"/>
      <stop offset="1" stop-color="${state.gradBottom}"/>
    </linearGradient>

    ${useClip ? `
    <clipPath id="clipAll">
      <rect x="0" y="0" width="${W}" height="${H}"/>
    </clipPath>` : ``}
  </defs>

  <!-- メイン描画（背景は透過） -->
  <g ${useClip ? `clip-path="url(#clipAll)"` : ``}>
    <!-- 背景素材（十字＋円）を一括移動 -->
    <g transform="translate(${bgX}, ${bgY})">
      <!-- ③ 十字 -->
      <g filter="url(#thinGlow)"
         stroke="${state.crossColor}"
         stroke-opacity="0.42"
         stroke-linecap="round">
        <line x1="${cx}" y1="56" x2="${cx}" y2="520"
              stroke-width="${Number(state.crossWidth ?? 0)}"/>
        <line x1="56" y1="${cy}" x2="520" y2="${cy}"
              stroke-width="${Number(state.crossWidth ?? 0)}"/>
      </g>

      <!-- ④〜⑥ 円 -->
      <g filter="url(#thinGlow)" fill="none">
        <circle cx="${cx + c1.x}" cy="${cy + c1.y}" r="${c1.r}"
                stroke="${c1.color}" stroke-opacity="0.16" stroke-width="2"/>
        <circle cx="${cx + c2.x}" cy="${cy + c2.y}" r="${c2.r}"
                stroke="${c2.color}" stroke-opacity="0.14" stroke-width="2"/>

        <circle cx="${cx + c3.x}" cy="${cy + c3.y}" r="${c3.r}"
                stroke="${c3.color}"
                stroke-opacity="${Number(state.c3Opacity ?? 0)}"
                stroke-width="${Number(state.c3Stroke ?? 0)}"/>

        ${Number(state.c3RingWidth ?? 0) > 0 ? `
        <circle cx="${cx + c3.x}" cy="${cy + c3.y}" r="${ringR}"
                stroke="${c3.color}"
                stroke-opacity="${Number(state.c3RingOpacity ?? 0)}"
                stroke-width="${Number(state.c3RingWidth ?? 0)}"
                fill="none"/>`.trim() : ``}
      </g>
    </g>

    <!-- 微細粒子（背景に属するが数字の背面に見える） -->
    <g filter="url(#thinGlow)" fill="${state.gradTop}" fill-opacity="0.35">
      ${sparks
        .map(
          (s) =>
            `<circle cx="${s.x.toFixed(1)}" cy="${s.y.toFixed(1)}" r="${s.r.toFixed(
              2
            )}" opacity="${s.op.toFixed(2)}"/>`
        )
        .join("\n      ")}
    </g>

    <!-- 数字（最大化＋中心一致） -->
    <g filter="url(#numGlow)">
      <text x="${cx}" y="${cy}"
            text-anchor="middle" dominant-baseline="central"
            font-size="${Number(state.numSize ?? 0)}"
            font-family="system-ui, -apple-system, Segoe UI, Arial, sans-serif"
            font-weight="800"
            fill="none"
            stroke="${state.gradTop}" stroke-opacity="0.55"
            stroke-width="10"
            paint-order="stroke">${numText}</text>

      <text x="${cx}" y="${cy}"
            text-anchor="middle" dominant-baseline="central"
            font-size="${Number(state.numSize ?? 0)}"
            font-family="system-ui, -apple-system, Segoe UI, Arial, sans-serif"
            font-weight="800"
            fill="url(#numGrad)">${numText}</text>

      <text x="${cx}" y="${cy}"
            text-anchor="middle" dominant-baseline="central"
            font-size="${Number(state.numSize ?? 0)}"
            font-family="system-ui, -apple-system, Segoe UI, Arial, sans-serif"
            font-weight="800"
            fill="none"
            stroke="${state.gradBottom}" stroke-opacity="0.20"
            stroke-width="3">${numText}</text>
    </g>
  </g>

  ${guideSvg}
</svg>`.trim();
  };
})();
