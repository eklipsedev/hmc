import { memberstack } from '../memberstack/memberstack';
import { displayError, displayLoader, displaySuccess, hideLoader } from '../utils/formUtils';

export const handleNewEmail = () => {
  const form = document.querySelector("[data-email-form='true']");

  if (!form) return;

  const submitBtn = form.querySelector("button[type='submit']") || null;
  const emailField = form.querySelector("input[type='email']");

  const handleSubmit = async (e) => {
    e.preventDefault();

    displayLoader(submitBtn, 'Saving...');
    try {
      await memberstack.updateMemberAuth({
        email: emailField.value,
      });

      hideLoader(submitBtn);
      displaySuccess('Email Updated');
    } catch (error) {
      hideLoader(submitBtn, false);
      displayError(error.message);
    }
  };

  form.addEventListener('submit', handleSubmit);
};
