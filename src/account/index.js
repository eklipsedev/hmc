import { member } from '../memberstack/memberstack';
import { handleAddress } from './address';
import { forms } from './constants';
import { handleNewEmail } from './handleNewEmailForm';
import { handleNewPassword } from './handleNewPasswordForm';
import { handleImages } from './images';
import { handleOnboard } from './onboarding';
//import { handleOnboardingRedirect } from './onboarding/helpers';
import { handleProfile } from './profile';
import { setLiveLink } from './profile/helpers';
import { handleServices } from './services';

export const handleAccount = async () => {
  if (!member) return;

  await handleOnboard(forms.onboard);

  //handleOnboardingRedirect();
  handleProfile(forms.profile);
  handleServices(forms.services);
  handleAddress(forms.address);
  handleImages(forms.images);
  handleNewEmail();
  handleNewPassword();
  setLiveLink();
};
