// ===== 나나캣 그림 (코드로 그린 캐릭터) =====
// 몸 부분(꼬리 · 귀 · 눈 · 입 · 다리)이 따로 있어서 동작(걷기 · 하품 · 점프 …)을 만들 수 있어요.
// 사용: const cat = NanaCat.create("stand");  →  화면에 붙이고, cat.dataset.pose = "walk" 처럼 동작을 바꿔요.
// 동작 이름: stand(서 있기) · walk(걷기) · yawn(하품) · jump(점프) · wag(꼬리 흔들기) · wave(손 흔들기) · surprise(깜짝) · sleep(쿨쿨)
// 동작의 움직임은 nanacat.css 에 있어요.
(function () {
  // 색을 모아 둔 부분 (그림 전체의 색은 여기서 고쳐요)
  const COLOR = {
    furLight: "#FFFBF6", furMid: "#FDEBDD", furShade: "#F2D2BF",
    pawFill: "#FDEEE3", pawLine: "#E8C3AE",
    earIn1: "#FFB6A6", earIn2: "#F58F7E",
    blush: "#FF9C94", tail: "#FBE6D8", tailTip: "#F99B8B",
    ink: "#241C1C", nose: "#F28B82", mouthIn: "#5A2323", tongue: "#FF8E8E",
    zzz: "#8A7FD6"
  };

  // 여러 곳에서 같이 쓰는 그라데이션 (한 번만 페이지에 넣어요)
  const DEFS = `
<svg width="0" height="0" style="position:absolute" aria-hidden="true" focusable="false"><defs>
  <radialGradient id="ncFur" cx="0.38" cy="0.28" r="0.95">
    <stop offset="0" stop-color="${COLOR.furLight}"/><stop offset="0.55" stop-color="${COLOR.furMid}"/><stop offset="1" stop-color="${COLOR.furShade}"/>
  </radialGradient>
  <linearGradient id="ncEarIn" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="${COLOR.earIn1}"/><stop offset="1" stop-color="${COLOR.earIn2}"/>
  </linearGradient>
  <radialGradient id="ncBlush" cx="0.5" cy="0.5" r="0.5">
    <stop offset="0" stop-color="${COLOR.blush}" stop-opacity="0.95"/><stop offset="1" stop-color="${COLOR.blush}" stop-opacity="0"/>
  </radialGradient>
</defs></svg>`;

  // 나나캣 본체 (200 x 200 칸 안에 그림)
  const CAT = `
<svg class="nanacat" viewBox="0 0 200 200" aria-hidden="true" focusable="false">
  <ellipse class="nc-shadow" cx="100" cy="193" rx="54" ry="8" fill="rgba(34,34,34,0.16)"/>
  <g class="nc-all">

    <!-- 꼬리 (몸 뒤) -->
    <g class="nc-tail">
      <path d="M136 170 C176 178 194 146 177 120" fill="none" stroke="${COLOR.tail}" stroke-width="19" stroke-linecap="round"/>
      <path d="M181.4 144.3 C185 141.8 183.8 130.4 177 120" fill="none" stroke="${COLOR.tailTip}" stroke-width="19" stroke-linecap="round"/>
    </g>

    <!-- 몸 -->
    <g class="nc-body">
      <path d="M58 168 C58 128 80 114 100 114 C120 114 142 128 142 168 C142 189 122 195 100 195 C78 195 58 189 58 168Z" fill="url(#ncFur)"/>
    </g>

    <!-- 앞발 -->
    <g class="nc-leg nc-leg-l">
      <ellipse cx="82" cy="188" rx="15" ry="9.5" fill="${COLOR.pawFill}"/>
      <path d="M78 186v5M86 186v5" stroke="${COLOR.pawLine}" stroke-width="2" stroke-linecap="round"/>
    </g>
    <g class="nc-leg nc-leg-r">
      <ellipse cx="118" cy="188" rx="15" ry="9.5" fill="${COLOR.pawFill}"/>
      <path d="M114 186v5M122 186v5" stroke="${COLOR.pawLine}" stroke-width="2" stroke-linecap="round"/>
    </g>

    <!-- 머리 -->
    <g class="nc-head">
      <g class="nc-ear nc-ear-l">
        <path d="M50 70 C45 40 55 20 67 22 C82 27 93 44 95 58Z" fill="url(#ncFur)" stroke="${COLOR.furShade}" stroke-width="1.5" stroke-linejoin="round"/>
        <path d="M61 62 C58 46 62 35 68 35 C77 39 85 48 87 57Z" fill="url(#ncEarIn)" stroke-linejoin="round"/>
      </g>
      <g class="nc-ear nc-ear-r">
        <g transform="translate(200 0) scale(-1 1)">
          <path d="M50 70 C45 40 55 20 67 22 C82 27 93 44 95 58Z" fill="url(#ncFur)" stroke="${COLOR.furShade}" stroke-width="1.5" stroke-linejoin="round"/>
          <path d="M61 62 C58 46 62 35 68 35 C77 39 85 48 87 57Z" fill="url(#ncEarIn)" stroke-linejoin="round"/>
        </g>
      </g>

      <ellipse cx="100" cy="95" rx="59" ry="50" fill="url(#ncFur)"/>

      <circle cx="64" cy="109" r="12" fill="url(#ncBlush)"/>
      <circle cx="136" cy="109" r="12" fill="url(#ncBlush)"/>

      <!-- 눈: 평소 · 감은 눈 · 웃는 눈 -->
      <g class="nc-eye nc-eye-l"><ellipse cx="78" cy="96" rx="5.5" ry="8" fill="${COLOR.ink}"/><circle cx="76.2" cy="92.4" r="2.1" fill="#fff"/></g>
      <g class="nc-eye nc-eye-r"><ellipse cx="122" cy="96" rx="5.5" ry="8" fill="${COLOR.ink}"/><circle cx="120.2" cy="92.4" r="2.1" fill="#fff"/></g>
      <path class="nc-eye-closed" d="M70 98 Q78 106 86 98 M114 98 Q122 106 130 98" fill="none" stroke="${COLOR.ink}" stroke-width="3.4" stroke-linecap="round"/>
      <path class="nc-eye-happy" d="M70 101 Q78 90 86 101 M114 101 Q122 90 130 101" fill="none" stroke="${COLOR.ink}" stroke-width="3.4" stroke-linecap="round"/>

      <!-- 코 · 입 -->
      <ellipse cx="100" cy="106" rx="3.6" ry="2.5" fill="${COLOR.nose}"/>
      <path class="nc-smile" d="M91 111 Q95.5 118 100 112 Q104.5 118 109 111" fill="none" stroke="${COLOR.ink}" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"/>
      <g class="nc-mouth-open">
        <ellipse cx="100" cy="118" rx="11" ry="13" fill="${COLOR.mouthIn}"/>
        <ellipse cx="100" cy="126" rx="7" ry="5" fill="${COLOR.tongue}"/>
      </g>

      <!-- 수염 -->
      <path class="nc-whisk" d="M44 98 L12 91 M44 107 L14 112 M156 98 L188 91 M156 107 L186 112" fill="none" stroke="${COLOR.ink}" stroke-width="4.4" stroke-linecap="round"/>
    </g>

    <!-- 흔드는 손 (평소엔 안 보여요. 머리 앞에 그려서 항상 보여요) -->
    <g class="nc-wave">
      <path d="M69 154 L61 176" fill="none" stroke="${COLOR.pawLine}" stroke-width="23" stroke-linecap="round"/>
      <path d="M69 154 L61 176" fill="none" stroke="${COLOR.pawFill}" stroke-width="20" stroke-linecap="round"/>
      <path d="M57 180v4M64 180v4" stroke="${COLOR.pawLine}" stroke-width="2" stroke-linecap="round"/>
    </g>

    <!-- 쿨쿨 z (자는 동작에서만 보여요) -->
    <g class="nc-zzz" fill="${COLOR.zzz}" font-family="Jua, sans-serif" font-weight="700">
      <text class="nc-z1" x="142" y="62" font-size="26">z</text>
      <text class="nc-z2" x="156" y="42" font-size="20">z</text>
      <text class="nc-z3" x="166" y="26" font-size="15">z</text>
    </g>
  </g>
</svg>`;

  let defsReady = false;
  function ensureDefs() {
    if (defsReady) return;
    document.body.insertAdjacentHTML("afterbegin", DEFS);
    defsReady = true;
  }

  function create(pose) {
    ensureDefs();
    const holder = document.createElement("template");
    holder.innerHTML = CAT.trim();
    const svg = holder.content.firstElementChild;
    svg.dataset.pose = pose || "stand";
    return svg;
  }

  window.NanaCat = { create, COLOR };
})();
