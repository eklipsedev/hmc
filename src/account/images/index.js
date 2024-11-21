import { memberCustomFields } from '../../memberstack/memberstack';
import { setLastSubmittedData } from '../constants';
import { imagesForm } from '../constants';
import { disableSubmitButton } from '../helpers';
import { handleImageFormSubmit } from './helpers';
import {
  handleDragEnd,
  handleDragOver,
  handleDragStart,
  handleDrop,
  handleFileClick,
  handleFileInputChange,
  handleImageFormKeyDown,
  setImages,
} from './helpers';

export const handleImages = (form) => {
  if (!form) return;

  const isImagesForm = form.formElement === imagesForm;

  // only run this if not onboarding
  if (isImagesForm) {
    disableSubmitButton();
    handleImageFormSubmit(form);
  }

  setLastSubmittedData({ ...memberCustomFields });

  const savedImages = JSON.parse(memberCustomFields.images || null);

  handleFileClick(form);
  handleFileInputChange(form);
  setImages(form, savedImages);
  handleDragStart(form);
  handleDragOver(form);
  handleDragEnd(form);
  handleDrop(form);
  handleImageFormKeyDown(form);
};
