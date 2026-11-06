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

// --- 고양이 랜덤 동작: 마우스를 올리거나 누르면 ---
// 동작을 더 넣고 싶으면 이름을 여기에 추가하고, style.css 에 move-이름 · cat-이름 을 만드세요
const CAT_MOVES = ["jump", "wag", "spin", "squish", "shake", "hop"];
const cat = document.getElementById("cat");
const catImg = cat.querySelector("img");
let catBusy = false;
let lastMove = "";
function playCatMove() {
  if (catBusy || reduceMotion) return;           // 움직이는 중이거나 '움직임 줄이기'면 쉬기
  const choices = CAT_MOVES.filter((m) => m !== lastMove);  // 같은 동작이 연달아 나오지 않게
  lastMove = choices[Math.floor(Math.random() * choices.length)];
  catBusy = true;
  catImg.classList.add("move-" + lastMove);
  catImg.addEventListener("animationend", () => {
    catImg.classList.remove("move-" + lastMove);
    catBusy = false;
  }, { once: true });
}
cat.addEventListener("mouseenter", playCatMove);
cat.addEventListener("click", playCatMove);      // 휴대폰은 누르면 움직여요
cat.addEventListener("keydown", (event) => {     // 키보드: Enter · 튜페이튜
  if (event.key === "Enter" || event.key === " ") { event.preventDefault(); playCatMove(); }
});

// --- 맨 위로 가기 ---
const toTop = document.getElementById("toTop");
window.addEventListener("scroll", () => toTop.classList.toggle("show", window.scrollY > 500), { passive: true });
toTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" }));
