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
