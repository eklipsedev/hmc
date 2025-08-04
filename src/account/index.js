import { getMember } from '../memberstack/memberstack';
import { handleAddress } from './address';
import { forms } from './constants';
//import { handleNewEmail } from './handleNewEmailForm';
//import { handleNewPassword } from './handleNewPasswordForm';
//import { handleImages } from './images';
import { handleProfile } from './profile';
//import { setLiveLink } from './profile/helpers';
//import { handleServices } from './services';

export const handleAccount = async () => {
  if (!getMember()) return;

  //await handleOnboard(forms.onboard);

  //handleOnboardingRedirect();
  handleProfile(forms.profile);
  handleServices(forms.services);
  handleAddress(forms.address);
  //handleImages(forms.images);
  //handleNewEmail();
  //handleNewPassword();
  //setLiveLink();
};
