export const scrollNavbar = () => {
  const navbar = document.querySelector("[data-element='nav']");

  // Function to check scroll position and add/remove class
  if (navbar) {
    window.onscroll = function () {
      if (window.scrollY > 0) {
        // Add class when scrolled
        navbar.classList.add('is-scrolling');
      } else {
        // Remove class when at the top
        navbar.classList.remove('is-scrolling');
      }
    };
  }
};
