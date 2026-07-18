// NOTE: This is a front-end-only demo login. The credentials and the
// "loggedIn" flag both live in the browser (in this file and in
// localStorage), so anyone can read them in view-source or flip them
// in devtools. Fine for a portfolio mockup — swap this for a real
// backend with hashed passwords and server-issued sessions before
// this ever holds real agent accounts or listing data.
const validEmail = "admin@primenest.com";
const validPassword = "PrimeNest2026";

const loginForm = document.getElementById("loginForm");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const error = document.getElementById("loginError");
const submitBtn = loginForm.querySelector("button[type='submit']");

[emailInput, passwordInput].forEach((input) => {
  input.addEventListener("input", () => {
    error.textContent = "";
  });
});

loginForm.addEventListener("submit", function(e) {
  e.preventDefault();

  const email = emailInput.value.trim();
  const password = passwordInput.value.trim();

  if (email === validEmail && password === validPassword) {
    submitBtn.disabled = true;
    submitBtn.textContent = "Signing in...";
    localStorage.setItem("loggedIn", "true");
    window.location.href = "./portal.html";
  } else {
    error.textContent = "Invalid email or password.";
    passwordInput.value = "";
    passwordInput.focus();
  }
});
