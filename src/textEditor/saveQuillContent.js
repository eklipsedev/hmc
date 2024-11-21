import { editors, quills } from './quill';
import { cleanHTMLString } from './utils';

export const saveQuillContent = () => {
  if (!quills) return;

  quills.forEach((quill, index) => {
    quill.on('text-change', () => {
      // "text-change"
      // Set the innerHTML of the Quill editor to the hidden input field
      editors[index].nextSibling.value = cleanHTMLString(quill.root.innerHTML);
      editors[index].nextSibling.dispatchEvent(new Event('change'));
    });
  });
};
