import { getMember } from '../memberstack/memberstack';

export const editors = document.querySelectorAll("[data-element='text-editor']") || [];

export let quills = [];

export const setupQuillEditors = () => {
  const member = getMember();

  const isPremiumUser = member?.data?.planConnections.some((plan) => plan.type === 'SUBSCRIPTION');

  if (editors.length) {
    editors.forEach((editor) => {
      const toolbarOptions = [
        [{ header: [2, 3, false] }],
        ['bold', 'italic'],
        [{ list: 'ordered' }, { list: 'bullet' }],
      ];

      if (isPremiumUser) {
        toolbarOptions.push(['link']);
      }

      const quillInstance = new Quill(editor, {
        modules: {
          toolbar: toolbarOptions,
        },
        formats: isPremiumUser
          ? ['bold', 'italic', 'header', 'list', 'link']
          : ['bold', 'italic', 'header', 'list'],
        placeholder: '',
        theme: 'snow',
      });

      quills.push(quillInstance);
    });
  }
};
