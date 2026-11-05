// =========================================================
// 스튜디오 나나 — 움직임과 기능 (script.js)
// =========================================================

// ▼▼▼ 나중에 여기 두 줄만 바꾸면 돼요 ▼▼▼
const FORM_URL = "";                         // 구글 폼 주소를 따옴표 안에 넣으세요 (비어 있으면 '준비 중' 안내)
const EMAIL = "hello@studionana.example";    // 진짜 이메일 주소로 바꾸세요
// ▲▲▲ 여기까지 ▲▲▲


// --- 화면에 나오는 안내 문구 (한국어 / 영어) ---
const MESSAGES = {
  ko: {
    title: "스튜디오 나나",
    formSoon: "신청서 주소를 준비 중이에요. 우선 메일로 연락 주세요!",
    copied: "주소를 복사했어요!",
    copyFail: "주소를 선택해 두었어요. Ctrl+C 를 눌러 복사하세요.",
    menuOpen: "메뉴 열기",
    menuClose: "메뉴 닫기",
    photo: "사진",
    viewBig: "크게 보기",
    noPhoto: "사진 자리",
  },
  en: {
    title: "Studio Nana",
    formSoon: "Our application form is coming soon. Please email us for now!",
    copied: "Email address copied!",
    copyFail: "The address is selected. Press Ctrl+C to copy it.",
    menuOpen: "Open menu",
    menuClose: "Close menu",
    photo: "Photo",
    viewBig: "view larger",
    noPhoto: "Photo coming soon",
  },
};

// 지금 고른 언어 ("ko" 또는 "en")
let currentLang = "ko";
const t = (key) => MESSAGES[currentLang][key];


// =========================================================
// 1. 알림 말풍선 (잠깐 보였다 사라짐)
// =========================================================
const toast = document.getElementById("toast");
let toastTimer;
function showToast(text) {
  toast.textContent = text;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 3500);
}


// =========================================================
// 2. '협업 문의하기' 버튼 → 구글 폼 (새 창)
// =========================================================
document.querySelectorAll(".js-form-btn").forEach((button) => {
  if (FORM_URL) {
    button.href = FORM_URL;
    button.target = "_blank";
    button.rel = "noopener";
  } else {
    // 주소가 아직 없으면 이동하지 않고 '준비 중' 안내만 보여 줌
    button.addEventListener("click", (event) => {
      event.preventDefault();
      showToast(t("formSoon"));
    });
  }
});


// =========================================================
// 3. 이메일: 메일 쓰기 링크 + 글자 표시 + 주소 복사
// =========================================================
const emailText = document.getElementById("emailText");
const copyMsg = document.getElementById("copyMsg");
document.getElementById("mailBtn").href = "mailto:" + EMAIL;
emailText.textContent = EMAIL;

let copyTimer;
document.getElementById("copyBtn").addEventListener("click", async () => {
  let ok = false;
  try {
    await navigator.clipboard.writeText(EMAIL);
    ok = true;
  } catch (error) {
    ok = false;
  }
  if (!ok) {
    // 복사가 막힌 브라우저: 주소를 선택해 두고 직접 복사하도록 안내
    const range = document.createRange();
    range.selectNodeContents(emailText);
    const selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
  }
  copyMsg.textContent = ok ? t("copied") : t("copyFail");
  clearTimeout(copyTimer);
  copyTimer = setTimeout(() => (copyMsg.textContent = ""), 4000);
});


// =========================================================
// 4. 햄버거 메뉴 (휴대폰)
// =========================================================
const nav = document.getElementById("nav");
const menuBtn = document.getElementById("menuBtn");

function setMenu(open) {
  nav.classList.toggle("open", open);
  menuBtn.setAttribute("aria-expanded", String(open));
  menuBtn.setAttribute("aria-label", open ? t("menuClose") : t("menuOpen"));
}
menuBtn.addEventListener("click", () => setMenu(!nav.classList.contains("open")));

// 메뉴 글자를 누르면 메뉴를 닫음
nav.querySelectorAll("a").forEach((link) => link.addEventListener("click", () => setMenu(false)));

// Esc 키를 누르면 메뉴를 닫고 햄버거 버튼으로 돌아감
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && nav.classList.contains("open")) {
    setMenu(false);
    menuBtn.focus();
  }
});

// 메뉴 바깥을 누르면 닫음
document.addEventListener("click", (event) => {
  if (nav.classList.contains("open") && !nav.contains(event.target) && !menuBtn.contains(event.target)) {
    setMenu(false);
  }
});

// 화면이 넓어지면(컴퓨터 크기) 열린 메뉴 정리
window.matchMedia("(min-width: 901px)").addEventListener("change", (event) => {
  if (event.matches) setMenu(false);
});


// =========================================================
// 5. 부드러운 이동 (메뉴를 누르면 그 섹션으로)
//    CSS 의 scroll-behavior 로 움직이고, 도착한 곳으로 키보드 초점도 옮김
// =========================================================
document.querySelectorAll('a[href^="#"]:not(.js-form-btn)').forEach((link) => {
  link.addEventListener("click", () => {
    const target = document.querySelector(link.getAttribute("href"));
    if (!target) return;
    // 스크린리더·키보드 사용자가 도착한 섹션부터 읽을 수 있게
    if (!target.hasAttribute("tabindex")) target.setAttribute("tabindex", "-1");
    setTimeout(() => target.focus({ preventScroll: true }), 0);
  });
});


// =========================================================
// 6. 한국어 / 영어 바꾸기 (고른 언어는 브라우저가 기억)
// =========================================================
const textItems = document.querySelectorAll("[data-en]");
textItems.forEach((el) => (el.dataset.ko = el.innerHTML));   // 처음 한국어 글을 보관
const labelItems = document.querySelectorAll("[data-en-label]");
const altItems = document.querySelectorAll("[data-en-alt]");
const langButtons = document.querySelectorAll("[data-lang]");

function setLang(lang) {
  currentLang = lang === "en" ? "en" : "ko";
  const isEn = currentLang === "en";

  textItems.forEach((el) => (el.innerHTML = isEn ? el.dataset.en : el.dataset.ko));
  labelItems.forEach((el) => el.setAttribute("aria-label", isEn ? el.dataset.enLabel : el.dataset.koLabel));
  altItems.forEach((el) => (el.alt = isEn ? el.dataset.enAlt : el.dataset.koAlt));

  document.documentElement.lang = currentLang;
  document.title = t("title");
  langButtons.forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.lang === currentLang)));
  setMenu(nav.classList.contains("open"));   // 햄버거 버튼 이름도 언어에 맞게
  updateGalleryLabels();

  try { localStorage.setItem("lang", currentLang); } catch (error) { /* 저장이 막혀도 괜찮음 */ }
}
langButtons.forEach((b) => b.addEventListener("click", () => setLang(b.dataset.lang)));


// =========================================================
// 7. 사진이 없으면 회색 자리로 보여 주기
// =========================================================
function markEmpty(img) {
  img.closest(".photo").classList.add("is-empty");
}
document.querySelectorAll(".photo img").forEach((img) => {
  // 이미 실패한 사진(스크립트보다 먼저 불러오기 끝난 경우)도 챙김
  if (img.complete && img.naturalWidth === 0) markEmpty(img);
  img.addEventListener("error", () => markEmpty(img));
});


// =========================================================
// 8. 갤러리: 누르면 크게 보기 (닫기: 바깥 누르기 · 닫기 버튼 · Esc)
// =========================================================
const galleryItems = document.querySelectorAll(".gallery-item");
const lightbox = document.getElementById("lightbox");
const lightboxPhoto = document.getElementById("lightboxPhoto");
const lightboxCaption = document.getElementById("lightboxCaption");
let lastOpened = null;

// 스크린리더가 읽을 버튼 이름 (예: "사진 1 크게 보기")
function updateGalleryLabels() {
  galleryItems.forEach((item) => {
    item.setAttribute("aria-label", `${t("photo")} ${item.dataset.num} ${t("viewBig")}`);
  });
}

function openLightbox(item) {
  lastOpened = item;
  lightboxPhoto.innerHTML = "";
  lightboxPhoto.classList.remove("is-empty");

  const img = item.querySelector("img");
  if (img && !item.classList.contains("is-empty")) {
    const big = img.cloneNode();
    lightboxPhoto.appendChild(big);
  } else {
    lightboxPhoto.classList.add("is-empty");   // 사진이 없으면 회색 자리
    const label = document.createElement("span");
    label.className = "photo-label";
    label.textContent = t("noPhoto");
    lightboxPhoto.appendChild(label);
  }
  lightboxCaption.textContent = `${t("photo")} ${item.dataset.num}`;
  lightbox.showModal();                         // 열리면 초점이 창 안으로 들어감
}

function closeLightbox() {
  if (lightbox.open) lightbox.close();
}

galleryItems.forEach((item) => item.addEventListener("click", () => openLightbox(item)));
document.getElementById("lightboxClose").addEventListener("click", closeLightbox);
lightbox.addEventListener("click", (event) => {
  if (event.target === lightbox) closeLightbox();   // 사진 바깥(어두운 곳)을 누르면 닫힘
});
// Esc 키는 브라우저가 알아서 닫아 줌. 닫히면 눌렀던 사진으로 초점을 되돌림
lightbox.addEventListener("close", () => {
  if (lastOpened) lastOpened.focus();
});


// =========================================================
// 9. 맨 위로 가기 버튼
// =========================================================
const toTop = document.getElementById("toTop");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

function updateToTop() {
  toTop.classList.toggle("show", window.scrollY > 400);
}
window.addEventListener("scroll", updateToTop, { passive: true });
updateToTop();

toTop.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: reduceMotion.matches ? "auto" : "smooth" });
  document.querySelector(".logo").focus({ preventScroll: true });   // 초점도 맨 위로
});


// =========================================================
// 시작: 저장된 언어가 있으면 그 언어로 보여 주기
// =========================================================
let savedLang = "ko";
try { savedLang = localStorage.getItem("lang") || "ko"; } catch (error) { /* 무시 */ }
setLang(savedLang);
