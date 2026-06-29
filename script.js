/* ============================================================
   PrimeRidge Studios — script.js
   ============================================================ */

const menuToggle = document.getElementById("menuToggle");
const navLinks   = document.getElementById("navLinks");
const navbar     = document.querySelector(".navbar");

/* ── 1. Close menu helper ── */
function closeMenu() {
  if (!menuToggle || !navLinks) return;
  menuToggle.classList.remove("open");
  navLinks.classList.remove("open");
  menuToggle.setAttribute("aria-expanded", "false");
}

/* ── 1b. Keep mobile dropdown top in sync with real navbar height ── */
function syncNavTop() {
  if (navbar && navLinks) {
    const h = navbar.getBoundingClientRect().height;
    navLinks.style.top = h + "px";
  }
}
syncNavTop();
window.addEventListener("resize", syncNavTop, { passive: true });
window.addEventListener("scroll", syncNavTop, { passive: true });

/* ── 2. Burger toggle ── */
if (menuToggle && navLinks) {
  menuToggle.addEventListener("click", (e) => {
    e.stopPropagation();
    const isOpen = navLinks.classList.toggle("open");
    menuToggle.classList.toggle("open", isOpen);
    menuToggle.setAttribute("aria-expanded", String(isOpen));
  });
}

/* ── 3. Close on outside tap/click ── */
document.addEventListener("click", (e) => {
  if (navbar && !navbar.contains(e.target)) closeMenu();
});

/* ── 4. Close on Escape ── */
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeMenu();
});

/* ── 5. Smooth scroll with navbar offset + close menu ──
   Replaces CSS scroll-behavior: smooth so we can account
   for the fixed navbar height and land on the section title,
   not behind it.                                           */
function getNavHeight() {
  return navbar ? navbar.getBoundingClientRect().height : 64;
}

/* Extra breathing room below the navbar (px) */
const SCROLL_GAP = 8;

function smoothScrollTo(target) {
  if (!target) return;
  const top =
    target.getBoundingClientRect().top +
    window.scrollY -
    getNavHeight() -
    SCROLL_GAP;

  window.scrollTo({ top, behavior: "smooth" });
}

document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", (e) => {
    const id = anchor.getAttribute("href").slice(1);
    const target = document.getElementById(id);
    if (!target) return;          // let browser handle unknown hashes
    e.preventDefault();
    closeMenu();                  // close mobile menu first
    smoothScrollTo(target);
  });
});

/* ── 6. Throttled scroll handler (rAF-throttled, passive) ──
   Avoids firing dozens of times per frame — the main cause
   of scroll jank on mid-range mobile devices.              */
let ticking = false;
let lastScrollY = window.scrollY;

function onScroll() {
  /* Scrolled class — glass navbar on scroll */
  if (navbar) {
    navbar.classList.toggle("scrolled", window.scrollY > 40);
  }

  /* Close mobile menu if user scrolls more than 10px */
  if (Math.abs(window.scrollY - lastScrollY) > 10) {
    closeMenu();
    lastScrollY = window.scrollY;
  }

  ticking = false;
}

window.addEventListener(
  "scroll",
  () => {
    if (!ticking) {
      requestAnimationFrame(onScroll);
      ticking = true;
    }
  },
  { passive: true }
);

/* ── 7. Reveal on scroll (IntersectionObserver) ── */
const reveals = document.querySelectorAll(".reveal");

if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("active");
          revealObserver.unobserve(entry.target); // fire once, then stop watching
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
  );

  reveals.forEach((el) => revealObserver.observe(el));
} else {
  reveals.forEach((el) => el.classList.add("active"));
}
