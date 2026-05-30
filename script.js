const siteHeader = document.querySelector(".site-header");

window.addEventListener("scroll", () => {
  if (window.scrollY > 80) {
    siteHeader.classList.add("scrolled");
  } else {
    siteHeader.classList.remove("scrolled");
  }
});

 window.addEventListener("load", () => {

  const loader = document.getElementById("site-loader");
  const hero = document.querySelector(".hero");

  setTimeout(() => {

    loader.classList.add("hide");
    hero.classList.add("loaded");

  }, 3800);

});