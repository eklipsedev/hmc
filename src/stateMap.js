export const handleStateMap = () => {
  const statePaths = document.querySelectorAll('#us-map path');

  if (statePaths && statePaths.length) {
    statePaths.forEach((path) => {
      const id = path.id.replace('state-', '');
      const link = document.querySelector(`[data-id="${id}"]`);

      if (link) {
        path.addEventListener('mouseenter', () => {
          link.classList.add('is-active');
        });
        path.addEventListener('mouseleave', () => {
          link.classList.remove('is-active');
        });
        path.addEventListener('click', () => {
          link.click();
        });
        link.addEventListener('mouseenter', () => {
          path.classList.add('is-active');
        });
        link.addEventListener('mouseleave', () => {
          path.classList.remove('is-active');
        });
      }
    });
  }
};
