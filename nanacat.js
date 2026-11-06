// ===== 나나캣 그림 (캐릭터 시트 `images/귀여운 고양이 캐릭터 모델 시트.png` 를 보고 코드로 그린 캐릭터) =====
// 몸 부분(꼬리 · 귀 · 팔 · 다리 · 표정)이 따로 있어서 동작(걷기 · 달리기 · 점프 …)을 만들 수 있어요.
//
// 사용:  const cat = NanaCat.create("stand");   // 그림 만들기
//        NanaCat.set(cat, "walk");               // 동작 바꾸기 (표정은 동작에 맞게 자동)
//        NanaCat.set(cat, "stand", "love");      // 표정만 따로 고르기
//
// 동작: stand(서 있기) · walk(걷기) · run(달리기) · jump(점프) · wave(손 흔들기) · excited(신남)
//       · sad(슬픔) · heart(하트 안기) · yawn(하품) · sleep(쿨쿨) · surprise(깜짝)
// 표정: open(기본) · happy(웃음) · wink(윙크) · squint(찡긋) · surprise(놀람) · shy(부끄러움)
//       · sad(우울) · angry(화남) · love(사랑) · confused(당황) · sleep(잠)
// 동작의 움직임은 nanacat.css 에 있어요.
(function () {
  // 색을 모아 둔 부분 (그림 전체의 색은 여기서 고쳐요)
  const COLOR = {
    furLight: "#FFF8F3", furMid: "#FCE9E0", furShade: "#F1CEC2",
    earLine: "#EBC3B6", pawLine: "#E9C4B6", paw: "#FDEDE5",
    earIn1: "#FDB4A4", earIn2: "#F58F80", blush: "#F9A29B", tailTip1: "#FDB1A2", tailTip2: "#F58E80",
    ink: "#1D1818", mouthIn: "#5A2323", tongue: "#FF8E8E", ring: "#F7959A",
    heart1: "#FF86A6", heart2: "#FF4F7E", zzz: "#8A7FD6"
  };

  // 동작마다 기본 표정
  const FACE_OF = {
    stand: "open", walk: "open", run: "squint", jump: "happy", wave: "happy", excited: "wink",
    sad: "sad", heart: "wink", yawn: "open", sleep: "sleep", surprise: "surprise"
  };

  // 여러 곳에서 같이 쓰는 그라데이션 · 부품 (한 번만 페이지에 넣어요)
  const DEFS = `
<svg width="0" height="0" style="position:absolute" aria-hidden="true" focusable="false"><defs>
  <radialGradient id="ncFur" cx="0.42" cy="0.25" r="0.92">
    <stop offset="0" stop-color="${COLOR.furLight}"/><stop offset="0.6" stop-color="${COLOR.furMid}"/><stop offset="1" stop-color="${COLOR.furShade}"/>
  </radialGradient>
  <linearGradient id="ncEarIn" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="${COLOR.earIn1}"/><stop offset="1" stop-color="${COLOR.earIn2}"/>
  </linearGradient>
  <radialGradient id="ncBlush" cx="0.5" cy="0.5" r="0.5">
    <stop offset="0" stop-color="${COLOR.blush}" stop-opacity="1"/><stop offset="0.7" stop-color="${COLOR.blush}" stop-opacity="0.85"/><stop offset="1" stop-color="${COLOR.blush}" stop-opacity="0"/>
  </radialGradient>
  <radialGradient id="ncTip" cx="0.38" cy="0.3" r="0.85">
    <stop offset="0" stop-color="${COLOR.tailTip1}"/><stop offset="1" stop-color="${COLOR.tailTip2}"/>
  </radialGradient>
  <radialGradient id="ncHeart" cx="0.35" cy="0.3" r="0.9">
    <stop offset="0" stop-color="${COLOR.heart1}"/><stop offset="1" stop-color="${COLOR.heart2}"/>
  </radialGradient>
  <path id="ncHeartPath" d="M0 6 C-14 -4 -9 -14 0 -7 C9 -14 14 -4 0 6Z"/>
  <g id="ncNoseMouth">
    <path d="M95.2 97.6 Q100 96.2 104.8 97.6 Q103.4 101.6 100 103 Q96.6 101.6 95.2 97.6Z" fill="${COLOR.ink}" stroke="${COLOR.ink}" stroke-width="1.4" stroke-linejoin="round"/>
    <path d="M90.5 104 Q95.2 111.5 100 104.6 Q104.8 111.5 109.5 104" fill="none" stroke="${COLOR.ink}" stroke-width="3.6" stroke-linecap="round" stroke-linejoin="round"/>
  </g>
</defs></svg>`;

  // 나나캣 본체 (200 x 200 칸 안에 그림)
  const CAT = `
<svg class="nanacat" viewBox="0 0 200 200" aria-hidden="true" focusable="false">
  <ellipse class="nc-shadow" cx="100" cy="195" rx="52" ry="7" fill="rgba(34,34,34,0.16)"/>
  <g class="nc-all">

    <!-- 꼬리: 끝이 동그란 산호색 방울 -->
    <g class="nc-tail">
      <path d="M130 187 C152 194 172 178 165 152" fill="none" stroke="${COLOR.furMid}" stroke-width="16" stroke-linecap="round"/>
      <ellipse cx="165" cy="148" rx="13" ry="15.5" fill="url(#ncTip)" transform="rotate(8 165 148)"/>
    </g>

    <!-- 팔 (몸 뒤에 붙어 있어서, 내려 있을 땐 몸 옆으로 살짝만 보여요) -->
    <g class="nc-arm nc-arm-l">
      <path d="M68 142 L62 160" fill="none" stroke="${COLOR.furShade}" stroke-width="15" stroke-linecap="round"/>
      <path d="M68 142 L62 160" fill="none" stroke="${COLOR.paw}" stroke-width="12.5" stroke-linecap="round"/>
    </g>
    <g class="nc-arm nc-arm-r">
      <path d="M132 142 L138 160" fill="none" stroke="${COLOR.furShade}" stroke-width="15" stroke-linecap="round"/>
      <path d="M132 142 L138 160" fill="none" stroke="${COLOR.paw}" stroke-width="12.5" stroke-linecap="round"/>
    </g>

    <!-- 몸통 -->
    <g class="nc-body">
      <path d="M62 192 C52 170 60 132 100 126 C140 132 148 170 138 192 C128 198 72 198 62 192Z" fill="url(#ncFur)"/>
      <path d="M100 166 V192" stroke="${COLOR.furShade}" stroke-width="1.6" stroke-linecap="round" opacity="0.7"/>
    </g>

    <!-- 앞발 -->
    <g class="nc-leg nc-leg-l">
      <ellipse cx="82" cy="184" rx="15" ry="12" fill="${COLOR.paw}" stroke="${COLOR.pawLine}" stroke-width="1.4"/>
      <path d="M77 186v5M83 187v5M89 186v5" stroke="${COLOR.pawLine}" stroke-width="1.8" stroke-linecap="round"/>
    </g>
    <g class="nc-leg nc-leg-r">
      <ellipse cx="118" cy="184" rx="15" ry="12" fill="${COLOR.paw}" stroke="${COLOR.pawLine}" stroke-width="1.4"/>
      <path d="M111 186v5M117 187v5M123 186v5" stroke="${COLOR.pawLine}" stroke-width="1.8" stroke-linecap="round"/>
    </g>

    <!-- 하트 안기 (그 동작에서만 보여요) -->
    <g class="nc-heart">
      <use href="#ncHeartPath" transform="translate(100 156) scale(2)" fill="url(#ncHeart)"/>
      <ellipse cx="78" cy="158" rx="9" ry="8" fill="${COLOR.paw}" stroke="${COLOR.pawLine}" stroke-width="1.4"/>
      <ellipse cx="122" cy="158" rx="9" ry="8" fill="${COLOR.paw}" stroke="${COLOR.pawLine}" stroke-width="1.4"/>
    </g>

    <!-- 머리 -->
    <g class="nc-head">
      <g class="nc-ear nc-ear-l">
        <path d="M42 76 C33 50 37 24 50 20 C66 20 88 38 95 58Z" fill="url(#ncFur)" stroke="${COLOR.earLine}" stroke-width="1.6" stroke-linejoin="round"/>
        <path d="M52 64 C48 47 50 35 57 33 C67 35 80 47 85 58Z" fill="url(#ncEarIn)" stroke-linejoin="round"/>
      </g>
      <g class="nc-ear nc-ear-r">
        <g transform="translate(200 0) scale(-1 1)">
          <path d="M42 76 C33 50 37 24 50 20 C66 20 88 38 95 58Z" fill="url(#ncFur)" stroke="${COLOR.earLine}" stroke-width="1.6" stroke-linejoin="round"/>
          <path d="M52 64 C48 47 50 35 57 33 C67 35 80 47 85 58Z" fill="url(#ncEarIn)" stroke-linejoin="round"/>
        </g>
      </g>

      <path d="M38 88 C38 52 66 38 100 38 C134 38 162 52 162 88 C162 112 140 126 100 126 C60 126 38 112 38 88Z" fill="url(#ncFur)"/>

      <ellipse class="nc-blush" cx="62" cy="109" rx="12.5" ry="8.5" fill="url(#ncBlush)"/>
      <ellipse class="nc-blush" cx="138" cy="109" rx="12.5" ry="8.5" fill="url(#ncBlush)"/>

      <!-- 표정들: 같은 때에 하나만 보여요 (data-face) -->
      <g class="nc-face nc-face-open">
        <g class="nc-eyes-open">
          <ellipse cx="74" cy="92" rx="5.2" ry="9.2" fill="${COLOR.ink}"/><circle cx="72.4" cy="88" r="1.8" fill="#fff"/>
          <ellipse cx="126" cy="92" rx="5.2" ry="9.2" fill="${COLOR.ink}"/><circle cx="124.4" cy="88" r="1.8" fill="#fff"/>
        </g>
        <use href="#ncNoseMouth"/>
      </g>
      <g class="nc-face nc-face-happy">
        <path d="M66 97 Q74 85 82 97 M118 97 Q126 85 134 97" fill="none" stroke="${COLOR.ink}" stroke-width="3.6" stroke-linecap="round"/>
        <use href="#ncNoseMouth"/>
      </g>
      <g class="nc-face nc-face-wink">
        <ellipse cx="74" cy="92" rx="5.2" ry="9.2" fill="${COLOR.ink}"/><circle cx="72.4" cy="88" r="1.8" fill="#fff"/>
        <path d="M121 85 L131 92 L121 99" fill="none" stroke="${COLOR.ink}" stroke-width="3.6" stroke-linecap="round" stroke-linejoin="round"/>
        <use href="#ncNoseMouth"/>
      </g>
      <g class="nc-face nc-face-squint">
        <path d="M69 85 L81 92 L69 99 M131 85 L119 92 L131 99" fill="none" stroke="${COLOR.ink}" stroke-width="3.6" stroke-linecap="round" stroke-linejoin="round"/>
        <use href="#ncNoseMouth"/>
      </g>
      <g class="nc-face nc-face-surprise">
        <ellipse cx="74" cy="91" rx="5.6" ry="10.5" fill="${COLOR.ink}"/><circle cx="72.2" cy="86.4" r="2" fill="#fff"/>
        <ellipse cx="126" cy="91" rx="5.6" ry="10.5" fill="${COLOR.ink}"/><circle cx="124.2" cy="86.4" r="2" fill="#fff"/>
        <ellipse cx="100" cy="104" rx="3.6" ry="4.4" fill="${COLOR.ring}"/>
      </g>
      <g class="nc-face nc-face-shy">
        <circle cx="74" cy="93" r="3.6" fill="${COLOR.ink}"/><circle cx="126" cy="93" r="3.6" fill="${COLOR.ink}"/>
        <use href="#ncNoseMouth"/>
      </g>
      <g class="nc-face nc-face-confused">
        <circle cx="74" cy="93" r="3.6" fill="${COLOR.ink}"/><circle cx="126" cy="93" r="3.6" fill="${COLOR.ink}"/>
        <ellipse cx="100" cy="104" rx="3.4" ry="4.2" fill="${COLOR.ring}"/>
      </g>
      <g class="nc-face nc-face-sad">
        <path d="M63 83 L82 77 M137 83 L118 77" fill="none" stroke="${COLOR.ink}" stroke-width="3" stroke-linecap="round"/>
        <ellipse cx="74" cy="94" rx="4.6" ry="7" fill="${COLOR.ink}"/><circle cx="72.8" cy="91" r="1.5" fill="#fff"/>
        <ellipse cx="126" cy="94" rx="4.6" ry="7" fill="${COLOR.ink}"/><circle cx="124.8" cy="91" r="1.5" fill="#fff"/>
        <path d="M95.2 97.6 Q100 96.2 104.8 97.6 Q103.4 101.6 100 103 Q96.6 101.6 95.2 97.6Z" fill="${COLOR.ink}" stroke="${COLOR.ink}" stroke-width="1.4" stroke-linejoin="round"/>
        <path d="M93 110 Q100 103.5 107 110" fill="none" stroke="${COLOR.ink}" stroke-width="3.4" stroke-linecap="round"/>
      </g>
      <g class="nc-face nc-face-angry">
        <path d="M62 78 L84 86 M138 78 L116 86" fill="none" stroke="${COLOR.ink}" stroke-width="3.4" stroke-linecap="round"/>
        <ellipse cx="74" cy="94" rx="4.8" ry="7.4" fill="${COLOR.ink}"/>
        <ellipse cx="126" cy="94" rx="4.8" ry="7.4" fill="${COLOR.ink}"/>
        <path d="M95.2 97.6 Q100 96.2 104.8 97.6 Q103.4 101.6 100 103 Q96.6 101.6 95.2 97.6Z" fill="${COLOR.ink}" stroke="${COLOR.ink}" stroke-width="1.4" stroke-linejoin="round"/>
        <path d="M93 110 Q100 104 107 110" fill="none" stroke="${COLOR.ink}" stroke-width="3.4" stroke-linecap="round"/>
      </g>
      <g class="nc-face nc-face-love">
        <use href="#ncHeartPath" transform="translate(74 93) scale(1.05)" fill="url(#ncHeart)"/>
        <use href="#ncHeartPath" transform="translate(126 93) scale(1.05)" fill="url(#ncHeart)"/>
        <path d="M95.2 97.6 Q100 96.2 104.8 97.6 Q103.4 101.6 100 103 Q96.6 101.6 95.2 97.6Z" fill="${COLOR.ink}" stroke="${COLOR.ink}" stroke-width="1.4" stroke-linejoin="round"/>
        <path d="M93 103 Q100 118 107 103Z" fill="${COLOR.mouthIn}" stroke="${COLOR.ink}" stroke-width="2" stroke-linejoin="round"/>
        <ellipse cx="100" cy="110" rx="4" ry="2.6" fill="${COLOR.tongue}"/>
      </g>
      <g class="nc-face nc-face-sleep">
        <path d="M66 94 Q74 102 82 94 M118 94 Q126 102 134 94" fill="none" stroke="${COLOR.ink}" stroke-width="3.4" stroke-linecap="round"/>
        <use href="#ncNoseMouth"/>
      </g>

      <!-- 하품할 때 눈 감기 · 입 크게 -->
      <path class="nc-yawn-eyes" d="M66 94 Q74 102 82 94 M118 94 Q126 102 134 94" fill="none" stroke="${COLOR.ink}" stroke-width="3.4" stroke-linecap="round"/>
      <g class="nc-mouth-open">
        <path d="M89 101 Q100 130 111 101Z" fill="${COLOR.mouthIn}" stroke="${COLOR.ink}" stroke-width="2" stroke-linejoin="round"/>
        <ellipse cx="100" cy="113" rx="6.5" ry="4.2" fill="${COLOR.tongue}"/>
      </g>

      <!-- 수염: 짧고 굵은 두 줄씩 -->
      <path class="nc-whisk" d="M18 99 L51 99 M22 113 L53 109 M149 109 L178 113 M149 99 L182 99" fill="none" stroke="${COLOR.ink}" stroke-width="5" stroke-linecap="round"/>
    </g>

    <!-- 떠오르는 하트 (하트 안기에서만) · 쿨쿨 z (자는 동작에서만) -->
    <g class="nc-hearts">
      <use class="nc-fh1" href="#ncHeartPath" transform="translate(150 70) scale(0.7)" fill="url(#ncHeart)"/>
      <use class="nc-fh2" href="#ncHeartPath" transform="translate(48 60) scale(0.55)" fill="url(#ncHeart)"/>
      <use class="nc-fh3" href="#ncHeartPath" transform="translate(166 40) scale(0.45)" fill="url(#ncHeart)"/>
    </g>
    <g class="nc-zzz" fill="${COLOR.zzz}" font-family="Jua, sans-serif" font-weight="700">
      <text class="nc-z1" x="150" y="52" font-size="26">z</text>
      <text class="nc-z2" x="164" y="32" font-size="20">z</text>
      <text class="nc-z3" x="174" y="16" font-size="15">z</text>
    </g>
  </g>
</svg>`;

  let defsReady = false;
  function ensureDefs() {
    if (defsReady) return;
    document.body.insertAdjacentHTML("afterbegin", DEFS);
    defsReady = true;
  }

  // 동작(과 표정) 바꾸기
  function set(svg, pose, face) {
    svg.dataset.pose = pose;
    svg.dataset.face = face || FACE_OF[pose] || "open";
  }

  function create(pose, face) {
    ensureDefs();
    const holder = document.createElement("template");
    holder.innerHTML = CAT.trim();
    const svg = holder.content.firstElementChild;
    set(svg, pose || "stand", face);
    return svg;
  }

  window.NanaCat = { create, set, COLOR, FACE_OF };
})();
