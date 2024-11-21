import { calculatorList } from './constants';

/*
export const handleDropdown = () => {
  calculatorList.addEventListener('click', (e) => {
    console.log('clicked');
    const toggle = e.target.closest('[data-trigger]');
    if (toggle) {
      const dropdownList = toggle.nextElementSibling;
      console.log(dropdownList);

      console.log(window.getComputedStyle(dropdownList).display === 'none');

      if (window.getComputedStyle(dropdownList).display === 'none') {
        console.log('block');
        dropdownList.style.display = 'block';
        toggle.querySelector('img').classList.add('is-active');
      } else {
        console.log('none');
        dropdownList.style.display = 'none';
        toggle.querySelector('img').classList.remove('is-active');
      }
    }
  });
};
*/

export const handleDropdown = () => {
  calculatorList.addEventListener('click', (e) => {
    const toggle = e.target.closest('[data-trigger]');
    if (toggle) {
      const dropdownList = toggle.nextElementSibling;
      const dropdownIcon = toggle.firstChild.nextElementSibling;

      // Check if dropdownList has the 'is-open' class to toggle visibility
      const isOpen = dropdownList.classList.contains('is-open');

      if (isOpen) {
        dropdownList.classList.remove('is-open');
        dropdownIcon.classList.remove('is-active');
      } else {
        dropdownList.classList.add('is-open');
        dropdownIcon.classList.add('is-active');
      }
    }
  });
};
