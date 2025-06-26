document.addEventListener('DOMContentLoaded', () => {
  const overlay = document.getElementById('overlay');
  const folderContainer = document.getElementById('folder-container');
  const folderName = document.getElementById('folder-name');
  document.querySelectorAll('.folder').forEach(el => {
    el.addEventListener('click', () => {
      folderContainer.innerHTML = el.querySelector('.icon').outerHTML;
      folderName.textContent = el.dataset.name;
      overlay.classList.remove('hidden');
    });
  });
  document.getElementById('close').addEventListener('click', () => {
    overlay.classList.add('hidden');
  });
});
