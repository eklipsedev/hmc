import { getMemberCustomFields } from '../../memberstack/memberstack';
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

  setLastSubmittedData({ ...getMemberCustomFields() });

  const savedImages = JSON.parse(getMemberCustomFields().images || null);

  handleFileClick(form);
  handleFileInputChange(form);
  setImages(form, savedImages);
  handleDragStart(form);
  handleDragOver(form);
  handleDragEnd(form);
  handleDrop(form);
  handleImageFormKeyDown(form);
};
