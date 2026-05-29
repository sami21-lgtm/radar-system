const themeToggle = document.getElementById('theme-toggle');
const toggleText = document.getElementById('toggle-text');

themeToggle.addEventListener('change', () => {
    if (themeToggle.checked) {
        document.body.classList.add('view-2');
        toggleText.textContent = 'Ver. 2';
    } else {
        document.body.classList.remove('view-2');
        toggleText.textContent = 'Ver. 1';
    }
});
