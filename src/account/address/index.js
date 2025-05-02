import { addressForm } from '../constants';
import { handleProfileInputChanges, handleSubmitProfileForm } from '../helpers';
import { setAddressFromMapbox } from './helpers';

export const handleAddress = (form) => {
  if (!form) return;

  const isAddressForm = form.formElement === addressForm;

  // only run this if not onboarding
  if (isAddressForm) {
    setAddressFromMapbox(form);
    handleProfileInputChanges(form);

    handleSubmitProfileForm(form, 'address');
  }
};
