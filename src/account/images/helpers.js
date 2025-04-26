import { memberId, memberstack } from '../../memberstack/memberstack';
import { displayError, displayLoader, displaySuccess, hideLoader } from '../../utils/formUtils';
import { getElement } from '../../utils/helpers';
import {
  forms,
  getlastSubmittedData,
  imagesForm,
  list,
  setLastSubmittedData,
  submitBtn,
} from '../constants';
import { enableSubmitButton, getFormData, hasFormDataChanged } from '../helpers';

let allImages = [];

let imageLimit = 25;
let currentImageCount = 0;

let currentAltText;

// initially set images when page loads
export const setImages = (form, images) => {
  form['image-count'].textContent = imageLimit - currentImageCount;
  form['total-image-count'].textContent = imageLimit;

  if (!images || !images.length) return;

  resetImageList();

  images.forEach((image, index) => {
    setImageItem(form, image.url, image.alt, image.fileId, null, '', index);
    currentImageCount += 1;
  });

  createAndSetListTrigger(form);
  setRemainingImageCount(form);

  form.empty.style.display = 'none';
  form.list.style.display = 'grid';
};

export const createAndSetListTrigger = (form) => {
  const clonedListTrigger = form['list-trigger'].cloneNode(true);
  clonedListTrigger.style.display = 'flex';
  form.list.append(clonedListTrigger);
};

export const setRemainingImageCount = (form) => {
  form['image-count'].textContent = imageLimit - currentImageCount;
};

export const handleFileClick = (form) => {
  document.addEventListener('click', (e) => {
    const triggerElement = e.target.closest('[data-list-trigger]');

    if (triggerElement) {
      form['file-input'].click();
    }
  });
};

export const handleImageFormKeyDown = (form) => {
  form.formElement.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
    }
  });
};

export const handleFileInputChange = (form) => {
  form['file-input'].addEventListener('change', async (e) => {
    const { files } = e.target;

    if (!files.length) return;

    form.empty.style.display = 'none';

    const trigger = form.list.querySelector('label');
    if (trigger) trigger.remove();

    let addedImagesCount = 0;
    const maxImagesToAdd = imageLimit - currentImageCount;

    // Convert the loop into a map of promises
    const imageProcessingPromises = Array.from(files).map(async (file) => {
      if (addedImagesCount >= maxImagesToAdd) {
        // Skip remaining images if limit is reached
        return;
      }

      const webpBlob = await resizeCompressAndConvertToWebP(file, 1200, 800, 0.75);

      return new Promise((resolve) => {
        const reader = new FileReader();

        reader.onloadend = (e) => {
          // Check limit again before processing
          if (addedImagesCount < maxImagesToAdd) {
            setImageItem(form, e.target.result, '', file.lastModified, webpBlob, 'toUpload', null);
            currentImageCount += 1;
            addedImagesCount += 1;
            setRemainingImageCount(form);
          }
          resolve(); // Resolve the promise when the image is processed
        };

        reader.readAsDataURL(webpBlob); // Read file for preview
      });
    });

    // Wait for all images to finish processing
    await Promise.all(imageProcessingPromises);

    const formData = getFormData(form.formElement);
    const lastSubmittedData = getlastSubmittedData();
    setLastSubmittedData({ ...lastSubmittedData, images: JSON.stringify(allImages) });

    const hasChanges = hasFormDataChanged(formData, getlastSubmittedData());
    if (hasChanges) {
      enableSubmitButton();
    }

    // Calculate skipped images and show an error if necessary
    const skippedImagesCount = files.length - addedImagesCount;
    if (skippedImagesCount > 0) {
      displayError(
        `${skippedImagesCount} image${skippedImagesCount > 1 ? 's' : ''} couldn't be added due to the limit.`
      );
    }

    // Perform actions after processing
    if (currentImageCount > 0) {
      form.list.style.display = 'grid';
    }

    // Add the list trigger if the image count is below the limit
    if (currentImageCount < imageLimit) {
      createAndSetListTrigger(form);
    }
  });
};

export const handleImageFormSubmit = () => {
  imagesForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    displayLoader(submitBtn, 'Saving...');

    const response = await setAndUploadImageData();

    const result = await response.json();

    if (result?.data) {
      const updatedMemberData = await memberstack.updateMember({
        customFields: result.data,
      });

      const images = JSON.parse(updatedMemberData.data.customFields.images);

      if (images?.length) setImages(forms.images, images);
    }

    hideLoader(submitBtn);
    displaySuccess('Images updated');
  });
};

export const setAndUploadImageData = async () => {
  try {
    // Collect all form data
    const formData = new FormData();
    formData.append('memberId', JSON.stringify(memberId));

    // Filter images that have files (skip those without files)
    const validImages = allImages.filter((image) => image.file);

    // Append valid image files to FormData
    validImages.forEach((image) => {
      formData.append('images[]', image.file);
    });

    // Prepare metadata for each image
    const imagesMetadata = allImages.map((image) => ({
      url: image.file ? null : image.url, // Only set URL if no file exists
      fileId: image.fileId,
      alt: image.alt,
      order: image.order,
      action: image.action,
    }));

    formData.append('imagesMetadata', JSON.stringify(imagesMetadata));

    // Send request to Cloudflare Worker
    const response = await fetch('https://images-worker-manager.josh-8e8.workers.dev/', {
      method: 'POST',
      body: formData,
    });

    //hideLoader(submitBtn);

    //if (!response.ok) {
    //  displayError('The response was not OK');
    //}

    return response; // data
  } catch (error) {
    hideLoader(submitBtn);
    displayError(error);
  }
};

export const setImageItem = (form, src, altText = '', fileId = '', file, action, index) => {
  const clonedListItem = form['list-item'].cloneNode(true);
  const clonedListTrigger = form['list-trigger'].cloneNode(true);
  const image = clonedListItem.querySelector('img');
  const editBtn = getElement('edit', clonedListItem);
  const deleteBtn = getElement('delete', clonedListItem);
  const overlay = getElement('overlay', clonedListItem);
  const actions = getElement('actions', clonedListItem);
  const altWrapper = getElement('alt-wrapper', clonedListItem);
  const altInput = altWrapper.querySelector('input');

  image.src = src;
  clonedListItem.id = fileId;
  altInput.value = altText;

  allImages.push({
    alt: altText,
    fileId: fileId.toString(),
    url: src,
    file: file || null,
    action: action,
    order: index,
  });

  clonedListItem.addEventListener('mouseenter', () => {
    actions.style.display = 'flex';
  });

  clonedListItem.addEventListener('mouseleave', () => {
    actions.style.display = 'none';
  });

  document.addEventListener('click', (e) => {
    // Check if the clicked target is not inside the dropdown or the trigger
    if (!clonedListItem.contains(e.target)) {
      altWrapper.style.display = 'none';
      overlay.style.display = 'none';
    }
  });

  editBtn.addEventListener('click', () => {
    currentAltText = altInput.value.trim(); // set current Alt Text

    altWrapper.style.display = 'flex';
    actions.style.display = 'none';
    overlay.style.display = 'block';
    altInput.focus();
  });

  deleteBtn.addEventListener('click', () => {
    actions.style.display = 'none';

    deleteImage(form, fileId);
    currentImageCount -= 1;

    clonedListItem.remove();

    if (currentImageCount <= imageLimit - 1 && !clonedListTrigger) {
      createAndSetListTrigger(form);
    }

    if (currentImageCount === 0) {
      form.empty.style.display = 'flex';
      form.list.style.display = 'none';
    }

    setRemainingImageCount(form);
  });

  altInput.addEventListener('blur', (e) => {
    // check if alt text actually changed
    if (e.target.value.trim() !== currentAltText) {
      updateAltText(fileId, e.target.value);
    }

    altWrapper.style.display = 'none';
    overlay.style.display = 'none';

    currentAltText = null;
  });

  form.list.appendChild(clonedListItem);
  clonedListItem.style.display = 'flex';
};

export const deleteImage = (form, fileId) => {
  const image = allImages.find((img) => img.fileId === fileId);

  if (image && !image.file) {
    image.action = 'toDelete'; // Mark for deletion
  } else {
    // remove image
    allImages = allImages.filter((img) => img.fileId !== fileId);
  }

  const formData = getFormData(form.formElement);
  const lastSubmittedData = getlastSubmittedData();
  setLastSubmittedData({ ...lastSubmittedData, images: JSON.stringify(allImages) });

  const hasChanges = hasFormDataChanged(formData, getlastSubmittedData());
  if (hasChanges) {
    enableSubmitButton();
  }
};

// Update alt text
export const updateAltText = (fileId, newAltText) => {
  const image = allImages.find((img) => img.fileId === fileId);

  if (image) {
    image.alt = newAltText;
    if (!image.file) {
      // if there's no file, the image already exists, so update
      image.action = 'toUpdate';
    } else {
      // image doesn't exist yet, keep as toUpload
      image.action = 'toUpload';
    }

    const formData = getFormData(form.formElement);
    const lastSubmittedData = getlastSubmittedData();
    setLastSubmittedData({ ...lastSubmittedData, images: JSON.stringify(allImages) });

    const hasChanges = hasFormDataChanged(formData, getlastSubmittedData());
    if (hasChanges) {
      enableSubmitButton();
    }
  }
};

// Reset all image tracking arrays (e.g., when saving changes)
export const resetImageList = () => {
  list.innerHTML = '';
  allImages = [];
  currentImageCount = 0;
};

let dragSrcElement = null;

export const handleDragStart = (form) => {
  if (!form.list) return;

  form.list.addEventListener('dragstart', (e) => {
    const target = e.target.closest('[draggable]');
    if (target) {
      dragSrcElement = target;
      target.classList.add('dragging');
      e.dataTransfer.effectAllowed = 'move';
    }
  });
};

export const handleDragEnd = (form) => {
  if (!form.list) return;

  form.list.addEventListener('dragend', () => {
    if (dragSrcElement) {
      dragSrcElement.classList.remove('dragging');
      dragSrcElement = null;
    }

    // Remove all drop indicators
    document.querySelectorAll('.drop-indicator').forEach((indicator) => indicator.remove());
  });
};

export const handleDragOver = (form) => {
  if (!form.list) return;

  form.list.addEventListener('dragover', (e) => {
    e.preventDefault();
    const target = e.target.closest('[draggable]');

    if (target && target !== dragSrcElement) {
      const bounding = target.getBoundingClientRect();
      const offset = e.clientX - bounding.left;

      // Remove existing indicators
      document.querySelectorAll('.drop-indicator').forEach((indicator) => indicator.remove());

      // Create and append a drop indicator
      const indicator = document.createElement('div');
      indicator.className = 'drop-indicator';

      if (offset > bounding.width / 2) {
        // Add indicator to the right
        target.style.position = 'relative';
        target.appendChild(indicator);
        indicator.style.right = '-6px';
      } else {
        // Add indicator to the left
        target.style.position = 'relative';
        target.appendChild(indicator);
        indicator.style.left = '-6px';
      }
    }
  });
};

export const handleDrop = (form) => {
  if (!form.list) return;

  form.list.addEventListener('drop', (e) => {
    e.preventDefault();
    const target = e.target.closest('[draggable]');

    if (target && target !== dragSrcElement) {
      const bounding = target.getBoundingClientRect();
      const offset = e.clientX - bounding.left;

      // Move dragSrcElement before or after the target
      if (offset > bounding.width / 2) {
        target.after(dragSrcElement);
      } else {
        target.before(dragSrcElement);
      }
    }

    updateImageOrder();

    const formData = getFormData(form.formElement);
    const lastSubmittedData = getlastSubmittedData();
    setLastSubmittedData({ ...lastSubmittedData, images: JSON.stringify(allImages) });

    const hasChanges = hasFormDataChanged(formData, getlastSubmittedData());
    if (hasChanges) {
      enableSubmitButton();
    }

    // Remove all drop indicators
    document.querySelectorAll('.drop-indicator').forEach((indicator) => indicator.remove());
  });
};

// Update the image order based on the current DOM structure
export const updateImageOrder = () => {
  // Get the new order of IDs from the DOM
  const imagesOrder = [...list.querySelectorAll('[draggable]')].map((item) => item.id);

  // Update the order property in allImages based on the new imagesOrder
  imagesOrder.forEach((id, index) => {
    // Find the corresponding object in allImages
    const image = allImages.find((img) => img.fileId === id);
    if (image) {
      // Update the order property
      image.order = index;
    }
  });
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
