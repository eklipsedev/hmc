import { getElement } from './helpers';

export const getFormByAttribute = (attributeValue) => {
  return document.querySelector(`[data-hmc-form="${attributeValue}"]`);
};

let buttonText;

export const handleLoader = (button, loadingText = '', showLoader = true, success = true) => {
  const textElement = button.querySelector("[data-element='text']");
  const loader = textElement.nextSibling;

  if (showLoader) {
    loader.style.display = 'flex'; // Show loader
    buttonText = textElement.textContent; // Store the original button text

    if (loadingText) {
      textElement.textContent = loadingText; // Set loading text if provided
    }
  } else {
    loader.style.display = 'none'; // Hide loader

    if (success && successElement) {
      textElement.textContent = 'Success'; // Set success text

      // Hide success message after 2000 ms
      setTimeout(() => {
        textElement.textContent = buttonText; // Restore original text
      }, 2000);
    } else {
      textElement.textContent = buttonText; // Restore original text
    }
  }
};

export const displayLoader = (button, loadingText) => {
  const textElement = button.querySelector("[data-element='text']");
  const loader = textElement.nextSibling;

  loader.style.display = 'flex';

  buttonText = textElement.textContent;

  if (loadingText) {
    textElement.textContent = loadingText;
  }
};

export const hideLoader = (button) => {
  const textElement = button.querySelector("[data-element='text']");
  const loader = textElement.nextSibling;

  loader.style.display = 'none';
  textElement.textContent = buttonText;
};

const displayMessage = (elementSelector, message) => {
  const messageElement = document.querySelector(elementSelector);
  const contentElement = messageElement.querySelector('[data-ms-message-text]');
  const closeButton = messageElement.querySelector('[data-ms-message-close]');

  // Set the message content
  contentElement.textContent = message;

  // Display the message element
  messageElement.style.display = 'block';
  //setTimeout(() => {
  //  messageElement.classList.add('is-visible');
  //}, 100); // added delay because it wasn't working without one

  // Hide the element after 5 seconds
  setTimeout(() => {
    messageElement.style.display = 'none';
    //setTimeout(() => {
    //  messageElement.style.display = 'none';
    //}, 300);
  }, 3000);

  // Event listener to hide the element if closed
  closeButton.addEventListener('click', () => {
    messageElement.style.display = 'none';
    //setTimeout(() => {
    //  messageElement.style.display = 'none';
    //}, 300);
  });
};

export const displayError = (error) => {
  if (!error) {
    // Handle the case where no error object is provided
    console.error('Invalid or missing error object:', error);
    // Display a generic error message or handle it in a way that makes sense for your application
    displayMessage("[data-ms-message='error']", 'An unexpected error occurred.');
    return;
  }

  if (error.code) {
    // Case where error code is provided
    const errorCode = error.code;
    displayMessage("[data-ms-message='error']", errorCode);
  } else {
    // Case where only a custom message is provided
    displayMessage("[data-ms-message='error']", error);
  }
};

export const displaySuccess = (message) => {
  displayMessage("[data-ms-message='success']", message);
};

export const handleTogglePassword = () => {
  const toggleBtn = document.querySelectorAll('[data-element="toggle-password"]');

  if (!toggleBtn || !toggleBtn.length) return;

  toggleBtn.forEach((btn) => {
    btn.addEventListener('click', () => {
      const showPassword = getElement('show-password', btn);
      const hidePassword = getElement('hide-password', btn);

      if (showPassword.style.display === 'none') {
        btn.previousElementSibling.type = 'password';
        showPassword.style.display = 'flex';
        hidePassword.style.display = 'none';
      } else {
        btn.previousElementSibling.type = 'text';
        showPassword.style.display = 'none';
        hidePassword.style.display = 'flex';
      }
    });
  });
};

export const handlePhoneValidation = () => {
  const phoneField = document.querySelector('input[type="tel"]');

  if (!phoneField) return;

  phoneField.addEventListener('input', (e) => {
    // Remove any non-numeric characters
    let phone = e.target.value.replace(/\D/g, '');
    // Format the input value
    if (phone.length > 3 && phone.length <= 6) {
      e.target.value = `${phone.slice(0, 3)}-${phone.slice(3)}`;
    } else if (phone.length > 6) {
      e.target.value = `${phone.slice(0, 3)}-${phone.slice(3, 6)}-${phone.slice(6, 10)}`;
    } else {
      e.target.value = phone;
    }
  });
};
