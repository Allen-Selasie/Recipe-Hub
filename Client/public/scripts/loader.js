window.addEventListener('load', () => {
  const loader = document.querySelector('.loading-modal');
  loader.classList.add('loader-hidden');
  loader.addEventListener('transitionend', () => {
    document.body.removeChild('loader');
  })
})