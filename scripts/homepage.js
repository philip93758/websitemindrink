const menuButton = document.querySelector('.home-page .menu-toggle');
const menu = document.getElementById('main-nav');
const languageMenu = document.querySelector('.home-page .language-dropdown');
const desktop = window.matchMedia('(min-width: 768px)');

function closeMenu(restoreFocus = false) {
    const wasOpen = menuButton.getAttribute('aria-expanded') === 'true';
    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.classList.remove('active');
    menu.classList.remove('active');
    if (wasOpen && restoreFocus) menuButton.focus();
}

menuButton.addEventListener('click', () => {
    const open = menuButton.getAttribute('aria-expanded') !== 'true';
    menuButton.setAttribute('aria-expanded', String(open));
    menuButton.classList.toggle('active', open);
    menu.classList.toggle('active', open);
});

menu.addEventListener('click', event => {
    if (event.target.closest('a')) closeMenu();
});

document.addEventListener('click', event => {
    if (!event.target.closest('.header-container')) {
        closeMenu();
        languageMenu.open = false;
    }
});

document.addEventListener('keydown', event => {
    if (event.key !== 'Escape') return;
    if (languageMenu.open) {
        languageMenu.open = false;
        languageMenu.querySelector('summary').focus();
    }
    closeMenu(true);
});

desktop.addEventListener('change', event => {
    if (event.matches) closeMenu();
});

document.getElementById('current-year').textContent = new Date().getFullYear();
