import { setupQuillEditors } from './quill';
import { saveQuillContent } from './saveQuillContent';
import { setQuillEditor } from './setQuillEditor';

export const handleQuillEditor = () => {
  setupQuillEditors();
  setQuillEditor();
  saveQuillContent();
};
