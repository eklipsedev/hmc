import { memberstack } from '../memberstack/memberstack';
import { displayError, displayLoader, displaySuccess, hideLoader } from '../utils/formUtils';

export const handleNewPassword = () => {
  const form = document.querySelector("[data-password-form='true']");

  if (!form) return;

  const submitBtn = form.querySelector("button[type='submit']") || null;
  const currentPasswordField = form.querySelector("[data-ms-member='current-password']");
  const newPasswordField = form.querySelector("[data-ms-member='new-password']");

  if (!form) return;

  const handleSubmit = async (e) => {
    e.preventDefault();

    displayLoader(submitBtn, 'Saving...');
    try {
      await memberstack.updateMemberAuth({
        oldPassword: currentPasswordField.value,
        newPassword: newPasswordField.value,
      });

      (currentPasswordField.value = ''), (newPasswordField.value = '');

      hideLoader(submitBtn);
      displaySuccess('Password Updated');
    } catch (error) {
      hideLoader(submitBtn, false);
      displayError(error.message);
    }
  };

  form.addEventListener('submit', handleSubmit);
};
