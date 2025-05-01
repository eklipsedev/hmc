import { addressForm } from '../constants';
import {
  disableSubmitButton,
  handleProfileInputChanges,
  handleSubmitProfileForm,
} from '../helpers';
import { setAddressFromMapbox } from './helpers';

export const handleAddress = (form) => {
  if (!form) return;

  const isAddressForm = form.formElement === addressForm;

  // only run this if not onboarding
  if (isAddressForm) {
    disableSubmitButton();
    handleSubmitProfileForm(form, 'address');
  }

  setAddressFromMapbox(form);
  handleProfileInputChanges(form);
};
