const menuToggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.main-nav');

if (menuToggle && nav) {
  menuToggle.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    menuToggle.setAttribute('aria-expanded', String(open));
  });

  nav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      nav.classList.remove('open');
      menuToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

const togglePassword = document.getElementById('toggle-password');
const passwordInput = document.getElementById('password');

if (togglePassword && passwordInput) {
  togglePassword.addEventListener('click', () => {
    const hidden = passwordInput.type === 'password';
    passwordInput.type = hidden ? 'text' : 'password';
    togglePassword.textContent = hidden ? 'Hide' : 'Show';
  });
}

const loginForm = document.getElementById('login-form');
const loginMessage = document.getElementById('login-message');

if (loginForm && loginMessage) {
  loginForm.addEventListener('submit', (event) => {
    event.preventDefault();
    loginMessage.textContent = 'Toolkit login will be connected once the protected portal is enabled.';
  });
}
