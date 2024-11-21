import { editors, quills } from './quill';

export const setQuillEditor = () => {
  if (!quills || !editors || !editors.length) return;

  editors.forEach((editor, index) => {
    // Set the HTML content
    quills[index].clipboard.dangerouslyPasteHTML(editor.nextSibling.value);
    //editor.nextSibling.removeAttribute('src');
    //quills[index].blur();
  });

  // Scroll the page to the top after setting the editor content
  window.scrollTo({
    top: 0,
    behavior: 'auto',
  });
};
