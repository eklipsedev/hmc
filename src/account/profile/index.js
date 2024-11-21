import { profileForm } from '../constants';
import {
  handleProfileInputChanges,
  handleSubmitProfileForm,
  showPublishedMessage,
} from '../helpers';

export const handleProfile = (form) => {
  if (!form) return;

  const isProfileForm = form.formElement === profileForm;

  // only run this if not onboarding
  if (isProfileForm) {
    showPublishedMessage();
    handleSubmitProfileForm(form);
  }

  handleProfileInputChanges(form);
};
