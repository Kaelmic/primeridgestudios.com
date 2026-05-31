const navbar = document.querySelector(".navbar");
const navLinks = document.querySelectorAll(".nav-links a");
const sections = document.querySelectorAll("section[id]");

let isClickScrolling = false;

function updateNavbar() {
  navbar.classList.toggle("scrolled", window.scrollY > 80);
}

function setActiveLink(id) {
  navLinks.forEach((link) => {
    link.classList.toggle("active", link.getAttribute("href") === `#${id}`);
  });
}

function updateActiveLink() {
  if (isClickScrolling) return;

  let currentSection = "home";

  sections.forEach((section) => {
    if (window.scrollY >= section.offsetTop - 180) {
      currentSection = section.getAttribute("id");
    }
  });

  setActiveLink(currentSection);
}

navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    const targetId = link.getAttribute("href").replace("#", "");

    isClickScrolling = true;
    setActiveLink(targetId);

    setTimeout(() => {
      isClickScrolling = false;
      updateActiveLink();
    }, 900);
  });
});

window.addEventListener("scroll", () => {
  updateNavbar();
  updateActiveLink();
});

window.addEventListener("load", () => {
  updateNavbar();
  updateActiveLink();
});

const revealElements = document.querySelectorAll(".reveal");

function revealOnScroll() {
  revealElements.forEach((element) => {
    const elementTop = element.getBoundingClientRect().top;
    const triggerPoint = window.innerHeight * 0.86;

    if (elementTop < triggerPoint) {
      element.classList.add("active");
    }
  });
}

window.addEventListener("scroll", revealOnScroll);
window.addEventListener("load", revealOnScroll);
