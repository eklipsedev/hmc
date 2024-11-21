import { servicesForm } from '../constants';
import { handleProfileInputChanges, handleSubmitProfileForm } from '../helpers';
import { setServices } from './helpers';

export const handleServices = (form) => {
  if (!form) return;

  const isServicesForm = form.formElement === servicesForm;

  // only run this if not onboarding
  if (isServicesForm) {
    handleSubmitProfileForm(form, 'services');
  }

  setServices(form);
  handleProfileInputChanges(form);
};
