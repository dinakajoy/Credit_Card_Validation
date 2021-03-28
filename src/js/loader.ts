const loader = document.getElementById('loader');
window.addEventListener('load', () => {
  setTimeout(() => {
    loader.style.display = 'none';
  }, 2000);
});