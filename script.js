const navbar = document.querySelector(".navbar");
const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");
const revealElements = document.querySelectorAll(".reveal");

const filterButtons = document.querySelectorAll(".filter-btn");
const workItems = document.querySelectorAll(".work-line");

function handleScroll() {
  if (navbar) {
    navbar.classList.toggle("scrolled", window.scrollY > 20);
  }

  revealElements.forEach((element) => {
    if (element.getBoundingClientRect().top < window.innerHeight - 90) {
      element.classList.add("active");
    }
  });
}

if (menuToggle && navLinks) {
  menuToggle.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("open");

    menuToggle.classList.toggle("open", isOpen);
    menuToggle.setAttribute("aria-expanded", String(isOpen));
  });

  navLinks.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      navLinks.classList.remove("open");
      menuToggle.classList.remove("open");
      menuToggle.setAttribute("aria-expanded", "false");
    });
  });
}

if (filterButtons.length && workItems.length) {
  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const selectedFilter = button.dataset.filter;

      filterButtons.forEach((btn) => {
        btn.classList.remove("active");
        btn.setAttribute("aria-selected", "false");
      });

      button.classList.add("active");
      button.setAttribute("aria-selected", "true");

      workItems.forEach((item) => {
        const itemCategory = item.dataset.category;
        const shouldShow =
          selectedFilter === "all" || itemCategory === selectedFilter;

        item.classList.toggle("hidden", !shouldShow);
      });
    });
  });
}

window.addEventListener("scroll", handleScroll);
window.addEventListener("load", handleScroll);

handleScroll();

/* =========================
   Hero Browser Showcase
========================= */

const showcase = document.querySelector("[data-browser-showcase]");
const showcaseSlides = document.querySelectorAll(".showcase-slide");
const showcaseDots = document.querySelectorAll(".showcase-dot");
const showcaseUrl = document.querySelector("[data-showcase-url]");

const showcaseUrls = [
  "primecare.primeridgestudios.com",
  "realty.primeridgestudios.com",
  "barbershop.primeridgestudios.com"
];

let activeShowcaseIndex = 0;
let showcaseTimer;

function showBrowserDemo(index) {
  if (!showcaseSlides.length) return;

  activeShowcaseIndex = index;

  showcaseSlides.forEach((slide, slideIndex) => {
    slide.classList.toggle("active", slideIndex === index);
  });

  showcaseDots.forEach((dot, dotIndex) => {
    dot.classList.toggle("active", dotIndex === index);
  });

  if (showcaseUrl && showcaseUrls[index]) {
    showcaseUrl.textContent = showcaseUrls[index];
  }
}

function startBrowserShowcase() {
  if (showcaseSlides.length <= 1) return;

  clearInterval(showcaseTimer);

  showcaseTimer = setInterval(() => {
    const nextIndex = (activeShowcaseIndex + 1) % showcaseSlides.length;
    showBrowserDemo(nextIndex);
  }, 6500);
}

if (showcaseSlides.length && showcaseDots.length) {
  showcaseDots.forEach((dot) => {
    dot.addEventListener("click", () => {
      const targetIndex = Number(dot.dataset.showcaseTarget);

      if (!Number.isNaN(targetIndex)) {
        showBrowserDemo(targetIndex);
        startBrowserShowcase();
      }
    });
  });

  if (showcase) {
    showcase.addEventListener("mouseenter", () => clearInterval(showcaseTimer));
    showcase.addEventListener("mouseleave", startBrowserShowcase);
  }

  showBrowserDemo(0);
  startBrowserShowcase();
}
