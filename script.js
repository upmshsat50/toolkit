const menuBtn = document.querySelector(".menu-button");
const nav = document.querySelector(".site-nav");

if (menuBtn && nav) {
  menuBtn.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("open");
    menuBtn.setAttribute("aria-expanded", String(isOpen));
  });

  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      nav.classList.remove("open");
      menuBtn.setAttribute("aria-expanded", "false");
    });
  });
}

const pw = document.getElementById("password");
const showPw = document.getElementById("show-password");

if (pw && showPw) {
  showPw.addEventListener("click", () => {
    const show = pw.type === "password";
    pw.type = show ? "text" : "password";
    showPw.textContent = show ? "Hide" : "Show";
  });
}

const form = document.getElementById("login-form");
const status = document.getElementById("login-status");

if (form && status) {
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    status.textContent = "Portal authentication will be connected in the next phase.";
  });
}
