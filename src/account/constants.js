import { getElement } from '../utils/helpers';

export const initializeForms = () => {
  const forms = document.querySelectorAll('[data-form]');
  const formFields = {};

  forms.forEach((form) => {
    const formName = form.getAttribute('data-form');
    formFields[formName] = {
      formElement: form, // Add the entire form element to the object
    };

    const fields = form.querySelectorAll('[data-element]');
    fields.forEach((field) => {
      const fieldName = field.getAttribute('data-element');
      formFields[formName][fieldName] = field; // Add the field to the object
    });
  });

  return formFields;
};

export const forms = initializeForms();

export const submitBtn = document.querySelector("button[type='submit']") || null;

export const profileForm = forms.profile?.formElement || null;
export const servicesForm = forms.services?.formElement || null;
export const addressForm = forms.address?.formElement || null;
export const onboardForm = forms.onboard?.formElement || null;
export const imagesForm = forms.images?.formElement || null;

export let fields = null;
export let lastSubmittedData = {};

// address variables
export const resetBtn = getElement('reset-btn') || null;
export let addressLine1 = null;
export let addressLine2 = null;
export let addressLevel2 = null;
export let addressLevel1 = null;
export let postalCode = null;
export let countryName = null;
export let fullAddressField = null;
export let fullStateField = null;
export let stateIdField = null;
export let countyName = null;
export let countyIdField = null;
export let latField = null;
export let lngField = null;

let autofillCollection;

// services variables
export const servicesList = getElement('services-list') || null;
export let serviceCheckboxes;
export let servicesInput;

// images variables
export let list = null;
export let listItem = null;
export let empty = null;
export let fileInput = null;
export let imageCount = null;
export let totalImageCount = null;
export let listTrigger = null;
export let headerImageField = null;
export let imagesField = null;

if (profileForm) {
  fields = profileForm.querySelectorAll('[data-ms-member]') || null;
}

if (addressForm) {
  fields = addressForm.querySelectorAll('[data-ms-member]') || null;
  addressLine1 = addressForm.querySelector("[autocomplete='address-line1']") || null;
  addressLine2 = addressForm.querySelector("[autocomplete='address-line2']") || null;
  addressLevel2 = addressForm.querySelector("[autocomplete='address-level2']") || null;
  addressLevel1 = addressForm.querySelector("[autocomplete='address-level1']") || null;
  postalCode = addressForm.querySelector("[autocomplete='postal-code']") || null;
  countryName = addressForm.querySelector("[data-ms-member='country']") || null;
  fullAddressField = addressForm.querySelector("[data-ms-member='full-address']") || null;
  fullStateField = addressForm.querySelector("[data-ms-member='state-full']") || null;
  stateIdField = addressForm.querySelector("[data-ms-member='state-id']") || null;
  countyName = addressForm.querySelector("[data-ms-member='county']") || null;
  countyIdField = addressForm.querySelector("[data-ms-member='county-id']") || null;
  latField = addressForm.querySelector("[data-ms-member='lat']") || null;
  lngField = addressForm.querySelector("[data-ms-member='lng']") || null;
}

/*
if (servicesForm) {
  fields = servicesForm.querySelectorAll('[data-ms-member]') || null;
  submitBtn = servicesForm.querySelector("button[type='submit']") || null;
  serviceCheckboxes = servicesForm.querySelectorAll("input[type='checkbox']");
  servicesInput = servicesForm.querySelector("[data-ms-member='services']");
}
  */

if (onboardForm) {
  fields = onboardForm.querySelectorAll('[data-ms-member]') || null;
  //submitBtn = onboardForm.querySelector("button[type='submit']") || null;
  serviceCheckboxes = onboardForm.querySelectorAll("input[type='checkbox']");
  servicesInput = onboardForm.querySelector("[data-ms-member='services']");
  addressLine1 = onboardForm.querySelector("[autocomplete='address-line1']") || null;
  addressLine2 = onboardForm.querySelector("[autocomplete='address-line2']") || null;
  addressLevel2 = onboardForm.querySelector("[autocomplete='address-level2']") || null;
  addressLevel1 = onboardForm.querySelector("[autocomplete='address-level1']") || null;
  postalCode = onboardForm.querySelector("[autocomplete='postal-code']") || null;
  countryName = onboardForm.querySelector("[data-ms-member='country']") || null;
  fullAddressField = onboardForm.querySelector("[data-ms-member='full-address']") || null;
  fullStateField = onboardForm.querySelector("[data-ms-member='state-full']") || null;
  stateIdField = onboardForm.querySelector("[data-ms-member='state-id']") || null;
  countyName = onboardForm.querySelector("[data-ms-member='county']") || null;
  countyIdField = onboardForm.querySelector("[data-ms-member='county-id']") || null;
  latField = onboardForm.querySelector("[data-ms-member='lat']") || null;
  lngField = onboardForm.querySelector("[data-ms-member='lng']") || null;
  list = getElement('list', onboardForm) || null;
  listItem = getElement('list-item', onboardForm) || null;
  empty = getElement('empty', onboardForm) || null;
  fileInput = getElement('file-input', onboardForm) || null;
  imageCount = getElement('image-count', onboardForm);
  totalImageCount = getElement('total-image-count', onboardForm);
  listTrigger = getElement('list-trigger', onboardForm);
  headerImageField = onboardForm.querySelector("[data-ms-member='header-image']") || null;
  imagesField = onboardForm.querySelector("[data-ms-member='images']") || null;
}

if (imagesForm) {
  //submitBtn = imagesForm.querySelector("button[type='submit']") || null;
  list = getElement('list', imagesForm) || null;
  listItem = getElement('list-item', imagesForm) || null;
  empty = getElement('empty', imagesForm) || null;
  fileInput = getElement('file-input', imagesForm) || null;
  imageCount = getElement('image-count', imagesForm);
  totalImageCount = getElement('total-image-count', imagesForm);
  listTrigger = getElement('list-trigger', imagesForm);
}

export const theme = {
  variables: {
    fontFamily: 'Roboto, sans-serif',
    unit: '0.875rem',
    padding: '0.5rem',
    borderRadius: '0',
    boxShadow: 'none',
    colorPrimary: '#000',
    colorSecondary: '#000',
    colorText: '#000',
    colorBackground: '#fff',
    border: '1px solid #e0e2e6',
    duration: '200ms',
    curve: 'ease',
    paddingModal: '2.5rem',
    colorBackdrop: '#000000d9',
    minWidth: '26rem',
  },
};

export const icons = {
  addressMarker: `
    <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" width="16px" height="16px" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24"><path fill="currentColor" d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7m0 9.5a2.5 2.5 0 0 1 0-5a2.5 2.5 0 0 1 0 5"></path></svg>
    `,
};

export const getAutofillCollection = () => autofillCollection;
// eslint-disable-next-line no-return-assign
export const setAutofillCollection = (value) => (autofillCollection = value);

export const getlastSubmittedData = () => lastSubmittedData;
// eslint-disable-next-line no-return-assign
export const setLastSubmittedData = (value) => (lastSubmittedData = value);
