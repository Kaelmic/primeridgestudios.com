const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");
const navbar = document.querySelector(".navbar");

const capabilityBuildEnd = 0.92;

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



document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", (e) => {
    const targetId = anchor.getAttribute("href");
    const target = document.querySelector(targetId);

    if (!target) return;

    e.preventDefault();
    closeMenu();

    /* Services: jump to completed card stack (desktop-only pinned stack) */
    if (targetId === "#services" && window.innerWidth > 1100) {
      const sectionTop = target.offsetTop;

      const scrollable =
        target.offsetHeight - window.innerHeight;

      const completedStackPosition =
        sectionTop + (scrollable * capabilityBuildEnd);

      window.scrollTo({
        top: completedStackPosition,
        behavior: "smooth"
      });

      return;
    }

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

const capabilitiesSection = document.querySelector(".services");
const capabilitiesStage = document.querySelector(".capabilities-list");
const capabilityCards = [
  ...document.querySelectorAll(".capability-item")
];

function updateCapabilityStack() {
  if (
    !capabilitiesSection ||
    !capabilitiesStage ||
    !capabilityCards.length
  ) return;

  if (window.innerWidth <= 1100) return;

  const sectionRect =
    capabilitiesSection.getBoundingClientRect();

  const scrollable =
    capabilitiesSection.offsetHeight -
    window.innerHeight;

  if (scrollable <= 0) return;

  const rawProgress = Math.min(
  Math.max(-sectionRect.top / scrollable, 0),
  1
);

const progress = Math.min(
  rawProgress / capabilityBuildEnd,
  1
);

 const cardHeight = 230;

/*
  Dynamically calculate how much of each previous
  card can remain visible while keeping card 6
  completely inside the viewport.
*/
const availableHeight = capabilitiesStage.clientHeight;

const desiredStep = 60;

const stackStep = Math.min(
  desiredStep,
  (availableHeight - cardHeight - 12) / 5
);

/* Waiting cards begin completely below the stage */
const startY = availableHeight + 40;

  capabilityCards.forEach((card, index) => {

    const finalY = index * stackStep;

    /*
      Card 1 is already present.
      Cards 2–6 each get their own scroll segment.
    */
    if (index === 0) {
      card.style.setProperty("--card-y", "0");
      return;
    }

    const start =
      (index - 1) / (capabilityCards.length - 1);

    const end =
      index / (capabilityCards.length - 1);

    let localProgress =
      (progress - start) / (end - start);

    localProgress = Math.min(
      Math.max(localProgress, 0),
      1
    );

    const y =
      startY +
      (finalY - startY) * localProgress;

    card.style.setProperty(
      "--card-y",
      y.toFixed(2)
    );
  });
}

let capabilityTicking = false;

function requestCapabilityUpdate() {
  if (capabilityTicking) return;

  capabilityTicking = true;

  requestAnimationFrame(() => {
    updateCapabilityStack();
    capabilityTicking = false;
  });
}

window.addEventListener(
  "scroll",
  requestCapabilityUpdate,
  { passive: true }
);

window.addEventListener(
  "resize",
  requestCapabilityUpdate,
  { passive: true }
);

/* Set the correct initial positions immediately */
updateCapabilityStack();

/* ── 10. Capabilities accordion (mobile) ──
   Cards show only their title by default. Tapping a title expands
   its paragraph; opening one closes any other that's open. This is
   purely a mobile enhancement — on desktop the panel's neutral CSS
   (max-height: none) always applies, so nothing here has any visual
   effect there. Inline max-height is explicitly cleared whenever the
   viewport crosses back to desktop width, so a leftover value from a
   mobile session can never clip the desktop paragraph. */
const capabilityToggles = document.querySelectorAll(".capability-toggle");

function openCapabilityPanel(btn) {
  const item = btn.closest(".capability-item");
  const panel = document.getElementById(btn.getAttribute("aria-controls"));
  if (!item || !panel) return;

  item.classList.add("is-open");
  btn.setAttribute("aria-expanded", "true");
  panel.style.maxHeight = `${panel.scrollHeight}px`;
}

function closeCapabilityPanel(btn) {
  const item = btn.closest(".capability-item");
  const panel = document.getElementById(btn.getAttribute("aria-controls"));
  if (!item || !panel) return;

  item.classList.remove("is-open");
  btn.setAttribute("aria-expanded", "false");
  panel.style.maxHeight = "0px";
}

capabilityToggles.forEach((btn) => {
  btn.addEventListener("click", () => {
    const item = btn.closest(".capability-item");
    if (!item) return;

    const wasOpen = item.classList.contains("is-open");

    /* Accordion: only one card open at a time */
    capabilityToggles.forEach((otherBtn) => {
      if (otherBtn !== btn) closeCapabilityPanel(otherBtn);
    });

    if (wasOpen) {
      closeCapabilityPanel(btn);
    } else {
      openCapabilityPanel(btn);
    }
  });
});

window.addEventListener(
  "resize",
  () => {
    const isMobile = window.innerWidth <= 1100;

    capabilityToggles.forEach((btn) => {
      const item = btn.closest(".capability-item");
      const panel = document.getElementById(btn.getAttribute("aria-controls"));
      if (!panel) return;

      if (!isMobile) {
        panel.style.maxHeight = "";
        return;
      }

      if (item && item.classList.contains("is-open")) {
        panel.style.maxHeight = `${panel.scrollHeight}px`;
      }
    });
  },
  { passive: true }
);
