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
      let t = seed += 0x6D2B79F5;
      t = Math.imul(t ^ t >>> 15, t | 1);
      t ^= t + Math.imul(t ^ t >>> 7, t | 61);
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
  }

  // stateを受け取ってSVG文字列を返す
  window.buildSVG = function buildSVG(state) {
    const W = 576, H = 576;
    const cx = 288, cy = 288;

    const numText = esc(clampText(state.numText));

    const rng = mulberry32(20260203);
    const sparks = [];
    for (let i = 0; i < state.sparkCount; i++) {
      const a = rng() * Math.PI * 2;
      const rad = 40 + rng() * 170;
      const x = cx + Math.cos(a) * rad;
      const y = cy + Math.sin(a) * rad;
      const r = 0.7 + rng() * 0.9;
      const op = 0.25 + rng() * 0.35;
      sparks.push({ x, y, r, op });
    }

    const c1 = { color: state.c1Color, r: state.c1R, x: state.c1X, y: state.c1Y };
    const c2 = { color: state.c2Color, r: state.c2R, x: state.c2X, y: state.c2Y };
    const c3 = { color: state.c3Color, r: state.c3R, x: state.c3X, y: state.c3Y };

    // ★背景素材 一括オフセット（十字＋円）
    const bgX = state.bgX;
    const bgY = state.bgY;

    // ★⑥リング
    const ringR = c3.r + 50; // いまは固定。必要ならUI化可能

    return `
<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" overflow="hidden">
  <defs>
    <filter id="thinGlow" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur stdDeviation="${state.bgGlow}" result="b"/>
      <feMerge>
        <feMergeNode in="b"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>

    <filter id="numGlow" x="-60%" y="-60%" width="220%" height="220%">
      <feGaussianBlur stdDeviation="${state.numGlow}" result="b"/>
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

    <clipPath id="clipAll">
      <rect x="0" y="0" width="${W}" height="${H}"/>
    </clipPath>
  </defs>

  <g clip-path="url(#clipAll)">
    <!-- 背景は描かない（透過） -->

    <!-- 背景素材（十字＋円）を一括移動 -->
    <g transform="translate(${bgX}, ${bgY})">
      <!-- ③ 十字 -->
      <g filter="url(#thinGlow)" stroke="${state.crossColor}" stroke-opacity="0.42" stroke-linecap="round">
        <line x1="${cx}" y1="56" x2="${cx}" y2="520" stroke-width="${state.crossWidth}"/>
        <line x1="56" y1="${cy}" x2="520" y2="${cy}" stroke-width="${state.crossWidth}"/>
      </g>

      <!-- ④〜⑥ 円 -->
      <g filter="url(#thinGlow)" fill="none">
        <circle cx="${cx + c1.x}" cy="${cy + c1.y}" r="${c1.r}" stroke="${c1.color}" stroke-opacity="0.16" stroke-width="2"/>
        <circle cx="${cx + c2.x}" cy="${cy + c2.y}" r="${c2.r}" stroke="${c2.color}" stroke-opacity="0.14" stroke-width="2"/>

        <circle cx="${cx + c3.x}" cy="${cy + c3.y}" r="${c3.r}"
                stroke="${c3.color}" stroke-opacity="${state.c3Opacity}"
                stroke-width="${state.c3Stroke}"/>

        ${state.c3RingWidth > 0 ? `
        <circle cx="${cx + c3.x}" cy="${cy + c3.y}" r="${ringR}"
                stroke="${c3.color}" stroke-opacity="${state.c3RingOpacity}"
                stroke-width="${state.c3RingWidth}" fill="none"/>`.trim() : ``}
      </g>
    </g>

    <!-- 微細粒子（背景に属するが、数字の背面に見えるのでここに置いている） -->
    <g filter="url(#thinGlow)" fill="${state.gradTop}" fill-opacity="0.35">
      ${sparks.map(s => `<circle cx="${s.x.toFixed(1)}" cy="${s.y.toFixed(1)}" r="${s.r.toFixed(2)}" opacity="${s.op.toFixed(2)}"/>`).join("\n      ")}
    </g>

    <!-- 数字（最大化＋中心一致） -->
    <g filter="url(#numGlow)">
      <text x="${cx}" y="${cy}" text-anchor="middle" dominant-baseline="central"
            font-size="${state.numSize}"
            font-family="system-ui, -apple-system, Segoe UI, Arial, sans-serif"
            font-weight="800"
            fill="none" stroke="${state.gradTop}" stroke-opacity="0.55" stroke-width="10" paint-order="stroke">${numText}</text>

      <text x="${cx}" y="${cy}" text-anchor="middle" dominant-baseline="central"
            font-size="${state.numSize}"
            font-family="system-ui, -apple-system, Segoe UI, Arial, sans-serif"
            font-weight="800"
            fill="url(#numGrad)">${numText}</text>

      <text x="${cx}" y="${cy}" text-anchor="middle" dominant-baseline="central"
            font-size="${state.numSize}"
            font-family="system-ui, -apple-system, Segoe UI, Arial, sans-serif"
            font-weight="800"
            fill="none" stroke="${state.gradBottom}" stroke-opacity="0.20" stroke-width="3">${numText}</text>
    </g>
  </g>
</svg>`.trim();
  };
})();
