import { getElement } from '../../utils/helpers';

export const imagesForm = document.querySelector("[data-images-form='true']") || null;

export let submitBtn;
export let list;
export let listItem;
export let empty;
export let fileInput;
export let imageCount;
export let totalImageCount;
export let listTrigger;
export let headerImageField;
export let imagesField;

if (imagesForm) {
  submitBtn = imagesForm.querySelector("button[type='submit']") || null;
  list = getElement('list', imagesForm) || null;
  listItem = getElement('list-item', imagesForm) || null;
  empty = getElement('empty', imagesForm) || null;
  fileInput = getElement('file-input', imagesForm) || null;
  imageCount = getElement('image-count', imagesForm);
  totalImageCount = getElement('total-image-count', imagesForm);
  listTrigger = getElement('list-trigger', imagesForm);
  headerImageField = imagesForm.querySelector("[data-ms-member='header-image']") || null;
  imagesField = imagesForm.querySelector("[data-ms-member='images']") || null;
}
