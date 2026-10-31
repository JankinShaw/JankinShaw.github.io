// Restrict casual image saving without affecting text or navigation.
document.querySelectorAll('.photo-grid img').forEach(image => {
  image.addEventListener('dragstart', event => event.preventDefault());
  image.addEventListener('contextmenu', event => event.preventDefault());
});
