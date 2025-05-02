import { getMemberCustomFields, memberstack } from '../memberstack/memberstack';
import { displayError, displayLoader, displaySuccess, hideLoader } from '../utils/formUtils';
import { validateAddress } from './address/helpers';
import { forms, getlastSubmittedData, setLastSubmittedData, submitBtn } from './constants';
import { setAndUploadImageData } from './images/helpers';

export const handleSubmitProfileForm = (form, type) => {
  const handleSubmit = async (e) => {
    e.preventDefault();

    displayLoader(submitBtn, 'Saving...');

    let currentFormData = getFormData(form.formElement);

    try {
      if (type === 'address') {
        const result = await validateAddress(form);
        //const validation = await saveAddressStepData(form, currentFormData);
        if (result.data) currentFormData = { ...currentFormData, ...result.data };
      }

      const updatedMemberstackData = await memberstack.updateMember({
        customFields: currentFormData,
      });

      setLastSubmittedData({ ...updatedMemberstackData.data.customFields });

      hideLoader(submitBtn);
      displaySuccess('Profile Updated');
      disableSubmitButton();
      submitBtn.disabled = true;
    } catch (error) {
      hideLoader(submitBtn, false);
      displayError(error);
    }
  };

  form.formElement.addEventListener('submit', handleSubmit);
};

export const handleCompanyNameToSlug = () => {
  const companyNameInput = document.querySelector('[data-ms-member="company-name"]');

  if (!companyNameInput) return;

  companyNameInput.addEventListener('input', (e) => {
    const companyName = e.target.value; // Get the value of the "company-name" input
    const slugifiedName = stringToSlug(companyName); // Convert it to slug format

    // Find the next sibling input and set its value to the slugified name
    const nextSiblingInput = companyNameInput.nextElementSibling;
    if (nextSiblingInput && nextSiblingInput.tagName === 'INPUT') {
      nextSiblingInput.value = slugifiedName;
    }
  });
};

const stringToSlug = (text) => {
  return text
    .toLowerCase() // Convert to lowercase
    .replace(/&/g, 'and') // Replace "&" with "and"
    .replace(/\band\b/g, '') // Remove any standalone "and"
    .replace(/[^\w\s-]/g, '') // Remove non-alphanumeric characters (except spaces and hyphens)
    .trim() // Remove leading and trailing whitespace
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/--+/g, '-'); // Remove consecutive hyphens
};

export const handleProfileInputChanges = (form) => {
  disableSubmitButton();
  setLastSubmittedData({ ...getMemberCustomFields() });

  let currentFormData = getFormData(form.formElement);

  for (const key in currentFormData) {
    if (currentFormData.hasOwnProperty(key)) {
      const element = form.formElement.querySelector(`[data-ms-member=${key}]`);

      element.addEventListener('change', () => {
        currentFormData = getFormData(form.formElement);
        let lastSubmittedData = getlastSubmittedData();

        const currentValue = currentFormData[key] ?? null; // Use null if the property doesn't exist
        const lastValue = lastSubmittedData[key] ?? null;

        const formDataChanged = currentValue !== lastValue;

        formDataChanged ? enableSubmitButton() : disableSubmitButton();
      });
    }
  }
};

export const handleOnboardingRedirect = (member) => {
  const accountPage = window.location.pathname.startsWith('/account/');

  if (!accountPage) return;

  const onboardingPage = window.location.pathname.startsWith('/account/onboard');
  const onboardComplete = member.data.customFields['onboard-complete'];

  // if user hasn't completed onboarding, redirect them to onboarding flow
  if (!onboardComplete && !onboardingPage) {
    window.location.href = '/account/onboard';
  }

  if (onboardComplete && onboardingPage) {
    window.location.href = '/account/profile';
  }
};

export const showPublishedMessage = () => {
  const profilePage = window.location.pathname.startsWith('/account/profile');

  if (!profilePage) return;

  const params = new URLSearchParams(window.location.search);
  const isPublished = params.get('published') === 'true';

  if (isPublished) {
    displaySuccess('Successfully Published Profile');
    const url = new URL(window.location);
    url.searchParams.delete('published');
    window.history.replaceState(null, '', url);
  }
};

// Check if data for the current form or step has changed by comparing against lastSubmittedData
export const hasFormDataChanged = (formData, lastSubmittedData) => {
  for (const key in formData) {
    if (key === 'images') {
      const parsedImagesArray = JSON.parse(lastSubmittedData[key] || '[]');
      const currentImagesArray = JSON.parse(formData[key] || '[]');

      // If there is an action value set, it means the array changed
      const hasActionValue = parsedImagesArray.some((obj) => obj.action !== '');

      if (hasActionValue) {
        return true;
      }

      // Check if the order has changed
      if (parsedImagesArray.length !== currentImagesArray.length) {
        return true; // Arrays are of different lengths, so they changed
      }

      const isOrderChanged = parsedImagesArray.some((prevObj, index) => {
        const currentObj = currentImagesArray[index];
        return currentObj?.order !== prevObj.order;
      });

      if (isOrderChanged) {
        return true;
      }
    } else {
      if (formData[key] !== lastSubmittedData[key]) {
        return true; // If any field differs, data has changed
      }
    }
  }
  return false; // No changes detected
};

export const getFormData = (element) => {
  const customFields = {};
  const fields = element.querySelectorAll('[data-ms-member]');

  if (fields && fields.length) {
    fields.forEach((field) => {
      const attributeKey = field.getAttribute('data-ms-member');
      if (attributeKey) {
        customFields[attributeKey] = field.type === 'checkbox' ? field.checked : field.value;
      }
    });
  }

  return customFields;
};

// Function to convert an image to WebP format
export const resizeCompressAndConvertToWebP = async (
  imageFile,
  maxWidth,
  maxHeight,
  quality = 0.8
) => {
  const img = new Image();
  const objectUrl = URL.createObjectURL(imageFile);

  img.src = objectUrl;

  return new Promise((resolve, reject) => {
    img.onload = () => {
      // Calculate the aspect ratio
      const aspectRatio = img.width / img.height;

      // Calculate new dimensions to maintain aspect ratio
      let newWidth = img.width;
      let newHeight = img.height;

      // Resize the image if it exceeds maxWidth or maxHeight
      if (img.width > maxWidth) {
        newWidth = maxWidth;
        newHeight = Math.round(newWidth / aspectRatio);
      }
      if (newHeight > maxHeight) {
        newHeight = maxHeight;
        newWidth = Math.round(newHeight * aspectRatio);
      }

      // Create a canvas and set its dimensions to the resized dimensions
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      canvas.width = newWidth;
      canvas.height = newHeight;

      // Draw the resized image onto the canvas
      ctx.drawImage(img, 0, 0, newWidth, newHeight);

      // Convert the resized image to WebP format with compression
      const webpDataUrl = canvas.toDataURL('image/webp', quality); // Adjust quality (0 to 1)

      // Create a blob from the WebP data URL
      const byteString = atob(webpDataUrl.split(',')[1]);
      const arrayBuffer = new ArrayBuffer(byteString.length);
      const uint8Array = new Uint8Array(arrayBuffer);
      for (let i = 0; i < byteString.length; i++) {
        uint8Array[i] = byteString.charCodeAt(i);
      }

      const webpBlob = new Blob([uint8Array], { type: 'image/webp' });
      const webpFile = new File([webpBlob], 'converted-image.webp', { type: 'image/webp' });

      // Resolve the promise with the WebP file
      resolve(webpFile);
    };

    img.onerror = reject;
  });
};

// Utility to enable/disable submit button
export const enableSubmitButton = () => {
  submitBtn.disabled = false;
  submitBtn.title = '';
};

export const disableSubmitButton = (title = 'No changes to save') => {
  submitBtn.disabled = true;
  submitBtn.title = title;
};

export const saveAddressStepData = async (form, formData) => {
  console.log("saving address step data...here's the form data: ", formData);
  const result = await validateAddress(form, formData);
  console.log('the result: ', result);
  //if (!result.status) return { isValid: false };

  formData['state-id'] = result.data.stateId || null;
  formData['county-id'] = result.data.countyId || null;

  console.log('good to go, saving this data: ', formData);

  return { formData };
};

export const saveImagesStepData = async () => {
  const response = await setAndUploadImageData();
  const result = await response.json();
  if (!result.data) return { isValid: false };

  const noImages = JSON.parse(result.data.images).length === 0;

  const imageData = {
    'header-image': noImages ? '' : result.data['header-image'],
    images: noImages ? '' : result.data.images,
  };

  forms.onboard['header-image'].value = imageData['header-image'] || null;
  forms.onboard['header-image'].dispatchEvent(new Event('change'));

  forms.onboard.images.value = imageData.images || null;
  forms.onboard.images.dispatchEvent(new Event('change'));

  return { isValid: true, imageData };
};
