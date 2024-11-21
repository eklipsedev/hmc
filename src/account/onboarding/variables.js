import { getElement } from '../../utils/helpers';
import { onboardForm } from '../constants';

export let steps = null;
export let infoSteps = null;
export let backButton = null;
export let nextButton = null;
export let progressBar = null;
export let submitBtn = null;
export let fields = null;

export let currentStep = 0;

if (onboardForm) {
  steps = onboardForm.querySelectorAll('[data-form="step"]');
  infoSteps = onboardForm.querySelectorAll('[data-form="step"][data-info="true"]');
  backButton = getElement('back-btn', onboardForm);
  nextButton = getElement('next-btn', onboardForm).firstElementChild;
  progressBar = getElement('progress-indicator', onboardForm);
  fields = onboardForm.querySelectorAll('[data-ms-member]');
}

export const getCurrentStep = () => currentStep;
// eslint-disable-next-line no-return-assign
export const setCurrentStep = (value) => (currentStep = value);
