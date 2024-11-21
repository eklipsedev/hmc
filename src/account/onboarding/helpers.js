import { memberCustomFields, memberstack } from '../../memberstack/memberstack';
import { displayError, displayLoader, hideLoader } from '../../utils/formUtils';
import {
  forms,
  getlastSubmittedData,
  onboardForm,
  setLastSubmittedData,
  submitBtn,
} from '../constants';
import {
  disableSubmitButton,
  enableSubmitButton,
  getFormData,
  hasFormDataChanged,
  saveAddressStepData,
  saveImagesStepData,
} from '../helpers';
import { setImages } from '../images/helpers';
import {
  backButton,
  getCurrentStep,
  infoSteps,
  nextButton,
  progressBar,
  setCurrentStep,
  steps,
} from './variables';

export const setInitialFormStep = () => {
  const savedData = { ...memberCustomFields };
  const formFields = getFormData(onboardForm);

  for (const key in formFields) {
    if (!(key in savedData)) {
      const initialStep = onboardForm
        .querySelector(`[data-ms-member="${key}"]`)
        .closest('[data-form="step"]');
      const initialStepIndex = Array.from(steps).indexOf(initialStep);

      // Update the current step and show it
      setCurrentStep(initialStepIndex);
      showCurrentStep();
      break;
    }
  }

  setLastSubmittedData(savedData);
};

// Display the current step and update buttons, validation, and progress
const showCurrentStep = () => {
  const currentStep = getCurrentStep();

  window.scrollTo({ top: 0, behavior: 'smooth' });

  steps.forEach((step, index) => {
    step.style.display = index === currentStep ? 'block' : 'none';
  });

  // Update button visibility based on the current step
  backButton.style.display = currentStep > 0 ? 'inline-block' : 'none';
  nextButton.style.display = currentStep < steps.length - 1 ? 'flex' : 'none';
  submitBtn.firstChild.textContent = 'Publish Profile';

  // Update progress bar
  if (progressBar) {
    const progressPercent = (currentStep / (steps.length - infoSteps.length)) * 100;
    progressBar.style.width = `${progressPercent}%`;
  }

  validateCurrentStep();
};

// Validate required fields in the current step
export const validateCurrentStep = () => {
  const currentFields = steps[getCurrentStep()]?.querySelectorAll('[required]') || [];
  const allValid = Array.from(currentFields).every((field) => {
    if (['checkbox', 'radio'].includes(field.type)) {
      return field.checked;
    }
    return field.value.trim();
  });
  nextButton.disabled = !allValid;
};

const processStepData = async (currentStepData, isAddressStep, isImagesStep) => {
  if (isAddressStep) {
    const success = await saveAddressStepData(forms.onboard, currentStepData);
    if (!success) return false;
  }

  if (isImagesStep) {
    const imageData = await saveImagesStepData();
    if (!imageData) return false;

    Object.assign(currentStepData, {
      images: imageData.imageData.images, // leave empty, not empty array
      'header-image': imageData.imageData['header-image'],
    });
  }

  const updatedMember = await memberstack.updateMember({ customFields: currentStepData });
  setLastSubmittedData({ ...updatedMember.data.customFields });

  if (isImagesStep) {
    const images = JSON.parse(getlastSubmittedData().images || '[]');
    if (images.length) setImages(forms.onboard, images);
  }

  return true;
};

export const nextStep = async () => {
  const currentStepElement = steps[getCurrentStep()];
  const currentStepData = getFormData(currentStepElement);
  const isAddressStep = currentStepElement.dataset.type === 'address';
  const isImagesStep = currentStepElement.dataset.type === 'images';

  validateCurrentStep();

  const lastSubmittedData = getlastSubmittedData();

  // Check if data has changed from the last submitted data
  if (hasFormDataChanged(currentStepData, lastSubmittedData)) {
    displayLoader(nextButton, 'Saving...');
    try {
      const success = await processStepData(currentStepData, isAddressStep, isImagesStep);
      if (!success) throw new Error('Failed to process step data');
      hideLoader(nextButton);
    } catch (error) {
      hideLoader(nextButton);
      displayError('Failed to save data', error);
      return;
    }
  }

  let currentStep = getCurrentStep();
  currentStep += 1;
  setCurrentStep(currentStep);
  showCurrentStep();
};

// Move to the previous step
export const previousStep = () => {
  let currentStep = getCurrentStep();

  if (currentStep > 0) {
    currentStep -= 1;
    setCurrentStep(currentStep);
    showCurrentStep();
  }
};

// onboarding logic on submit
export const finalizeOnboarding = async () => {
  try {
    disableSubmitButton();
    displayLoader(submitBtn, 'Publishing...');

    await memberstack.updateMember({ customFields: { 'onboard-complete': true } });

    hideLoader(submitBtn);
    window.location.href = '/account/profile?published=true';
  } catch (error) {
    enableSubmitButton();
    hideLoader(submitBtn, false);
    displayError('Failed to complete onboarding', error);
  }
};

export const handleOnboardingRedirect = () => {
  const accountPage = window.location.pathname.startsWith('/account/');

  if (!accountPage) return;

  const onboardingPage = window.location.pathname.startsWith('/account/onboard');
  const onboardComplete = memberCustomFields['onboard-complete'];

  // if user hasn't completed onboarding, redirect them to onboarding flow
  if (!onboardComplete && !onboardingPage) {
    window.location.href = '/account/onboard';
  }

  if (onboardComplete && onboardingPage) {
    window.location.href = '/account/profile';
  }
};
