import { saveQuillContent } from './saveQuillContent';
import { setQuillEditor } from './setQuillEditor';

export const handleQuillEditor = () => {
  setQuillEditor();
  saveQuillContent();
};
