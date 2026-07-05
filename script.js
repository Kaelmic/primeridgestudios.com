const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");
const navbar = document.querySelector(".navbar");

/* ── 1. Close menu helper ── */
function closeMenu() {
  if (!menuToggle || !navLinks) return;

  menuToggle.classList.remove("open");
  navLinks.classList.remove("open");
  menuToggle.setAttribute("aria-expanded", "false");
}

/* ── 2. Keep mobile dropdown top aligned with navbar ── */
function syncNavTop() {
  if (!navbar || !navLinks) return;
  navLinks.style.top = `${navbar.offsetHeight}px`;
}

syncNavTop();
window.addEventListener("resize", syncNavTop, { passive: true });

/* ── 3. Burger toggle ── */
if (menuToggle && navLinks) {
  menuToggle.addEventListener("click", (e) => {
    e.stopPropagation();

    const isOpen = navLinks.classList.toggle("open");

    menuToggle.classList.toggle("open", isOpen);
    menuToggle.setAttribute("aria-expanded", String(isOpen));
  });
}

/* ── 4. Close on outside tap/click ── */
document.addEventListener("click", (e) => {
  if (navbar && !navbar.contains(e.target)) {
    closeMenu();
  }
});

/* ── 5. Close on Escape ── */
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    closeMenu();
  }
});

/* ── 6. Smooth scroll using CSS scroll-margin-top ── */
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", (e) => {
    const targetId = anchor.getAttribute("href");
    const target = document.querySelector(targetId);

    if (!target) return;

    e.preventDefault();
    closeMenu();

    target.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });
  });
});

/* ── 7. Navbar scroll state ── */
let ticking = false;

function onScroll() {
  if (navbar) {
    navbar.classList.toggle("scrolled", window.scrollY > 40);
  }

  /* Close mobile menu on scroll */
  closeMenu();

  syncNavTop();

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

/* ── 8. Reveal on scroll ── */
const reveals = document.querySelectorAll(".reveal");

if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("active");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.1,
    rootMargin: "0px 0px -80px 0px"
  }
);

  reveals.forEach((el) => revealObserver.observe(el));
} else {
  reveals.forEach((el) => el.classList.add("active"));
}
