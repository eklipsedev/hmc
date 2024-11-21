import { memberIsPremium } from '../../memberstack/memberstack';
import { setQuillEditor } from '../../textEditor/setQuillEditor';
import { handleAddress } from '../address';
import { onboardForm } from '../constants';
import { handleImages } from '../images';
import { handleProfile } from '../profile';
import { handleServices } from '../services';
import {
  finalizeOnboarding,
  nextStep,
  previousStep,
  setInitialFormStep,
  validateCurrentStep,
} from './helpers';

export const handleOnboard = async (form) => {
  if (!form) return;

  // Event listeners for back, next, and form submission
  form['back-btn'].addEventListener('click', (e) => {
    e.preventDefault();
    previousStep();
  });

  form['next-btn'].addEventListener('click', (e) => {
    e.preventDefault();
    nextStep();
  });

  onboardForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    await finalizeOnboarding();
  });

  onboardForm.addEventListener('input', validateCurrentStep);
  onboardForm.addEventListener('change', validateCurrentStep);

  onboardForm.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') e.preventDefault();
  });

  // Initialization
  setQuillEditor();
  handleProfile(form);
  handleServices(form);
  handleAddress(form);
  if (memberIsPremium) handleImages(form);
  setInitialFormStep();
};
