// ===== 튜튜디오 나나 2 — 기능 =====

// 나중에 여기 두 줄만 바꾸면 됩니다
const FORM_URL = "";                      // 구글 폼 주소를 따옴표 안에 넣으세요
const EMAIL = "hello@studionana.example"; // 진짜 이메일 주소로 바꾸세요

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// --- 말풍선 안내 ---
const toast = document.getElementById("toast");
let toastTimer;
function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 3200);
}

// --- 협업 문의하기 버튼: 구글 폼을 새 창으로 ---
document.querySelectorAll(".js-form-btn").forEach((button) => {
  if (FORM_URL) {
    button.href = FORM_URL;
    button.target = "_blank";
    button.rel = "noopener";
  } else {
    button.addEventListener("click", (event) => {
      event.preventDefault();
      showToast("신청서 주소를 준비 중이에요. 아래 이메일로 연락 주세요!");
    });
  }
});

// --- 이메일 표시 · 복사 ---
const emailText = document.getElementById("emailText");
emailText.textContent = EMAIL;
emailText.href = "mailto:" + EMAIL;
const copyMsg = document.getElementById("copyMsg");
document.getElementById("copyBtn").addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText(EMAIL);
    copyMsg.textContent = "복사했어요!";
  } catch (error) {
    const range = document.createRange();   // 복사가 막히면 주소를 선택해 두기
    range.selectNodeContents(emailText);
    const selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
    copyMsg.textContent = "주소를 선택했어요. Ctrl+C 로 복사하세요.";
  }
  setTimeout(() => (copyMsg.textContent = ""), 3000);
});

// --- 햄버거 메뉴 ---
const nav = document.getElementById("nav");
const menuBtn = document.getElementById("menuBtn");
function closeMenu() {
  nav.classList.remove("open");
  menuBtn.setAttribute("aria-expanded", "false");
  menuBtn.textContent = "☰";
}
menuBtn.addEventListener("click", () => {
  const open = nav.classList.toggle("open");
  menuBtn.setAttribute("aria-expanded", open);
  menuBtn.textContent = open ? "✕" : "☰";
});
nav.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeMenu));
document.addEventListener("keydown", (event) => { if (event.key === "Escape") closeMenu(); });

// --- 튜크롤하면 아래에서 위로 떠오르기 ---
const reveals = document.querySelectorAll(".reveal");
if ("IntersectionObserver" in window && !reduceMotion) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("in");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  reveals.forEach((el) => observer.observe(el));
} else {
  reveals.forEach((el) => el.classList.add("in"));
}

// --- 큰 원이 튜크롤에 맞춰 천천히 움직이기 ---
const circles = document.querySelectorAll(".circle");
let ticking = false;
function moveCircles() {
  circles.forEach((c) => {
    c.style.transform = `translateY(${window.scrollY * Number(c.dataset.speed)}px)`;
  });
  ticking = false;
}
if (!reduceMotion) {
  window.addEventListener("scroll", () => {
    if (!ticking) { requestAnimationFrame(moveCircles); ticking = true; }
  }, { passive: true });
}

// ===== 나나캣 (nanacat.js 로 그린 캐릭터, 동작은 nanacat.css) =====
// 동작 이름: stand(서 있기) · walk(걷기) · run(달리기) · jump(점프) · wave(손 흔들기) · excited(신남) · sad(슬픔) · heart(하트 안기) · yawn(하품) · sleep(쿨쿨) · surprise(깜짝)
const hasNanaCat = Boolean(window.NanaCat);

// 같은 동작을 처음부터 다시 보여 주기
function restartPose(el, pose) {
  NanaCat.set(el, "stand");
  void el.getBoundingClientRect();
  NanaCat.set(el, pose);
}

// --- 1) 첫 화면의 나나캣 (처음 캐릭터 사진): 마우스를 올리거나 누르면 랜덤 동작, 가만히 있어도 가끔 움직여요 ---
// 동작을 더 넣고 싶으면 이름을 여기에 추가하고, style.css 에 move-이름 · cat-이름 을 만드세요
const cat = document.getElementById("cat");
const catImg = cat.querySelector("img");
const HERO_MOVES = ["jump", "wag", "spin", "squish", "shake", "hop"];
let heroBusy = false;
let heroLast = "";
function playHeroMove() {
  if (heroBusy || reduceMotion) return;                           // 움직이는 중이거나 '움직임 줄이기'면 쉬기
  const choices = HERO_MOVES.filter((m) => m !== heroLast);       // 같은 동작이 연달아 나오지 않게
  heroLast = choices[Math.floor(Math.random() * choices.length)];
  heroBusy = true;
  catImg.classList.add("move-" + heroLast);
  catImg.addEventListener("animationend", () => {
    catImg.classList.remove("move-" + heroLast);
    heroBusy = false;
  }, { once: true });
}
cat.addEventListener("mouseenter", playHeroMove);
cat.addEventListener("click", playHeroMove);          // 휴대폰은 누르면 움직여요
cat.addEventListener("keydown", (event) => {          // 키보드: Enter · 스페이스
  if (event.key === "Enter" || event.key === " ") { event.preventDefault(); playHeroMove(); }
});
function scheduleHeroIdle() {                         // 7~13초마다 혼자서도 한 번씩 움직여요
  setTimeout(() => {
    if (!document.hidden && window.scrollY < 700) playHeroMove();
    scheduleHeroIdle();
  }, 7000 + Math.random() * 6000);
}
if (!reduceMotion) scheduleHeroIdle();
// --- 2) 마우스 포인터 나나캣: 컴퓨터 마우스에서만, 움직임 줄이기 설정이 아닐 때만 ---
//   움직이면 걷기(빠르게 움직이면 달리기) · 멈추면 서 있기 · 링크 위에서 신남 · 클릭하면 점프 · 4초 가만히 있으면 하품 후 쿨쿨
const canFollow = hasNanaCat && !reduceMotion && window.matchMedia("(hover: hover) and (pointer: fine)").matches;
if (canFollow) {
  const SIZE = 48;                                    // 포인터 크기(px). 클릭 위치는 나나캣 가운데
  const follower = document.createElement("div");
  follower.className = "nana-cursor";
  follower.setAttribute("aria-hidden", "true");
  const flipBox = document.createElement("div");
  flipBox.className = "nana-cursor-flip";
  const pointerCat = NanaCat.create("stand");
  flipBox.append(pointerCat);
  follower.append(flipBox);
  document.body.append(follower);

  let pose = "stand";
  let oneShot = "";                                   // 지금 하는 한 번짜리 동작(jump · yawn), 없으면 ""
  let oneShotTimer, stopTimer, sleepTimer, lastX = null, lastY = 0, lastTime = 0, excited = false;

  function setPose(next) {
    if (pose === next) return;
    pose = next;
    NanaCat.set(pointerCat, next);
  }
  function endOneShot() {
    clearTimeout(oneShotTimer);
    oneShot = "";
  }
  function playOnce(name, ms, after) {
    clearTimeout(oneShotTimer);
    oneShot = name;
    pose = name;
    restartPose(pointerCat, name);
    oneShotTimer = setTimeout(() => { oneShot = ""; after(); }, ms);
  }
  function restingPose() { setPose(excited ? "excited" : "stand"); }
  function armSleep() {                               // 4초 가만히 있으면 하품하고 쿨쿨
    clearTimeout(sleepTimer);
    if (excited) return;
    sleepTimer = setTimeout(() => {
      playOnce("yawn", 2700, () => setPose("sleep"));
    }, 4000);
  }

  document.addEventListener("pointermove", (event) => {
    if (event.pointerType && event.pointerType !== "mouse") return;
    if (!follower.classList.contains("show")) {
      follower.classList.add("show");
      document.documentElement.classList.add("nana-cursor-on");   // 진짜 포인터는 숨김
    }
    follower.style.transform = `translate3d(${event.clientX - SIZE / 2}px, ${event.clientY - SIZE / 2}px, 0)`;
    if (lastX !== null && Math.abs(event.clientX - lastX) > 1) {
      flipBox.classList.toggle("flip", event.clientX > lastX);    // 가는 쪽으로 몸을 돌려요
    }
    const now = performance.now();                                // 마우스가 빠른지 재 보기 (빠르면 달리기)
    const speed = lastX === null ? 0 : Math.hypot(event.clientX - lastX, event.clientY - lastY) / Math.max(now - lastTime, 1);
    lastX = event.clientX;
    lastY = event.clientY;
    lastTime = now;
    clearTimeout(sleepTimer);
    clearTimeout(stopTimer);
    if (oneShot !== "jump") {                                     // 점프 중이 아니면 걷기 (하품 · 쿨쿨은 깨워요)
      if (oneShot) endOneShot();
      setPose(speed > 1.4 ? "run" : "walk");
    }
    stopTimer = setTimeout(() => {
      if (oneShot) return;
      restingPose();
      armSleep();
    }, 160);
  });

  document.addEventListener("pointerover", (event) => {           // 링크 · 버튼 위에서는 신나요
    excited = Boolean(event.target.closest && event.target.closest("a, button, [role='button']"));
    if (!oneShot && pose !== "walk" && pose !== "run") { restingPose(); if (excited) clearTimeout(sleepTimer); else armSleep(); }
  });

  document.addEventListener("pointerdown", (event) => {           // 클릭하면 점프!
    if (event.button !== 0) return;
    clearTimeout(sleepTimer);
    playOnce("jump", 900, () => { restingPose(); armSleep(); });
  });

  document.documentElement.addEventListener("mouseleave", () => follower.classList.remove("show"));
  document.documentElement.addEventListener("mouseenter", () => { if (lastX !== null) follower.classList.add("show"); });
}

// --- 맨 위로 가기 ---
const toTop = document.getElementById("toTop");
window.addEventListener("scroll", () => toTop.classList.toggle("show", window.scrollY > 500), { passive: true });
toTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" }));
