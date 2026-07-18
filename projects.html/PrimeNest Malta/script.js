// --- Mobile navigation menu ---
const menuToggle = document.getElementById("menuToggle");
const mobileNav = document.getElementById("mobileNav");
const mobileNavBackdrop = document.getElementById("mobileNavBackdrop");

function openMobileNav() {
  mobileNav.classList.add("open");
  mobileNavBackdrop.classList.add("open");
  mobileNav.setAttribute("aria-hidden", "false");
  menuToggle.setAttribute("aria-expanded", "true");
  menuToggle.setAttribute("aria-label", "Close menu");
  document.body.classList.add("nav-open");
}

function closeMobileNav() {
  mobileNav.classList.remove("open");
  mobileNavBackdrop.classList.remove("open");
  mobileNav.setAttribute("aria-hidden", "true");
  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.setAttribute("aria-label", "Open menu");
  document.body.classList.remove("nav-open");
}

if (menuToggle && mobileNav && mobileNavBackdrop) {
  menuToggle.addEventListener("click", () => {
    const isOpen = mobileNav.classList.contains("open");
    isOpen ? closeMobileNav() : openMobileNav();
  });

  mobileNavBackdrop.addEventListener("click", closeMobileNav);

  mobileNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeMobileNav);
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && mobileNav.classList.contains("open")) {
      closeMobileNav();
    }
  });

  // Close the drawer automatically if the viewport is resized back to desktop
  window.addEventListener("resize", () => {
    if (window.innerWidth > 860 && mobileNav.classList.contains("open")) {
      closeMobileNav();
    }
  });
}

// --- Scroll-driven effects, throttled with requestAnimationFrame for smoother mobile scrolling ---
const heroParallax = document.querySelector(".hero-parallax");
const revealElements = document.querySelectorAll(".reveal");
const parallaxItems = document.querySelectorAll(".property-image, .main-preview");
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function revealOnScroll() {
  revealElements.forEach((element) => {
    const elementTop = element.getBoundingClientRect().top;
    const windowHeight = window.innerHeight;

    if (elementTop < windowHeight - 100) {
      element.classList.add("active");
    }
  });
}

function updateParallax() {
  if (heroParallax) {
    const scrollY = window.scrollY;
    heroParallax.style.transform = `translateY(${scrollY * 0.25}px) scale(1.08)`;
  }

  if (!prefersReducedMotion) {
    parallaxItems.forEach((item) => {
      const rect = item.getBoundingClientRect();

      if (rect.top < window.innerHeight && rect.bottom > 0) {
        const offset = rect.top * -0.08;
        item.style.backgroundPosition = `center ${offset}px`;
      }
    });
  }
}

let ticking = false;

function onScroll() {
  if (!ticking) {
    window.requestAnimationFrame(() => {
      revealOnScroll();
      updateParallax();
      ticking = false;
    });
    ticking = true;
  }
}

revealOnScroll();
window.addEventListener("scroll", onScroll, { passive: true });
window.addEventListener("load", revealOnScroll);

// --- Property inquiry form: client-side validation + feedback (no backend attached yet) ---
const inquiryForm = document.getElementById("inquiryForm");
const inquiryFeedback = document.getElementById("inquiryFeedback");

if (inquiryForm && inquiryFeedback) {
  inquiryForm.addEventListener("submit", (e) => {
    e.preventDefault();

    if (!inquiryForm.checkValidity()) {
      inquiryForm.reportValidity();
      return;
    }

    const submitBtn = inquiryForm.querySelector(".inquiry-submit");
    submitBtn.disabled = true;
    submitBtn.textContent = "Sending...";

    // Simulated send — replace with a real fetch() call to your backend or form endpoint.
    setTimeout(() => {
      inquiryFeedback.textContent =
        "Thanks! Your inquiry has been received. Our team will get back to you shortly.";
      inquiryFeedback.classList.remove("error");
      inquiryFeedback.classList.add("show", "success");

      inquiryForm.reset();
      submitBtn.disabled = false;
      submitBtn.textContent = "Send Property Inquiry";
    }, 700);
  });
}

const filters = {
  status: document.getElementById("filterStatus"),
  location: document.getElementById("filterLocation"),
  type: document.getElementById("filterType"),
  bedrooms: document.getElementById("filterBedrooms"),
};

const propertyCards = document.querySelectorAll(".property-card");
const resetBtn = document.getElementById("resetFilters");

function filterProperties() {
  propertyCards.forEach(card => {
    const statusMatch =
      filters.status.value === "all" ||
      card.dataset.status === filters.status.value;

    const locationMatch =
      filters.location.value === "all" ||
      card.dataset.location === filters.location.value;

    const typeMatch =
      filters.type.value === "all" ||
      card.dataset.type === filters.type.value;

    const bedroomsMatch =
      filters.bedrooms.value === "all" ||
      Number(card.dataset.bedrooms) >= Number(filters.bedrooms.value);

    if (statusMatch && locationMatch && typeMatch && bedroomsMatch) {
      card.style.display = "block";
    } else {
      card.style.display = "none";
    }
  });
}

Object.values(filters).forEach(filter => {
  filter.addEventListener("change", filterProperties);
});

resetBtn.addEventListener("click", () => {
  Object.values(filters).forEach(filter => {
    filter.value = "all";
  });

  filterProperties();
});