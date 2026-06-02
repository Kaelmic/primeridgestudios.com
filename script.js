const navbar = document.querySelector(".navbar");
  const menuToggle = document.getElementById("menuToggle");
  const navLinks = document.getElementById("navLinks");
  const revealElements = document.querySelectorAll(".reveal");

  function handleScroll() {
    navbar.classList.toggle("scrolled", window.scrollY > 20);

    revealElements.forEach((element) => {
      if (element.getBoundingClientRect().top < window.innerHeight - 90) {
        element.classList.add("active");
      }
    });
  }

  menuToggle.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("open");
    menuToggle.classList.toggle("open", isOpen);
    menuToggle.setAttribute("aria-expanded", isOpen);
  });

  navLinks.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      navLinks.classList.remove("open");
      menuToggle.classList.remove("open");
      menuToggle.setAttribute("aria-expanded", "false");
    });
  });

  window.addEventListener("scroll", handleScroll);
  window.addEventListener("load", handleScroll);

  handleScroll();
