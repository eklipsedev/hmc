export const editors = document.querySelectorAll("[data-element='text-editor']") || [];

export let quills = [];

if (editors.length) {
  editors.forEach((editor) => {
    const quillInstance = new Quill(editor, {
      modules: {
        toolbar: [
          [{ header: [2, 3, false] }],
          ['bold', 'italic'],
          [{ list: 'ordered' }, { list: 'bullet' }],
          ['link'],
        ],
      },
      formats: ['bold', 'italic', 'header', 'list', 'link'],
      placeholder: '',
      theme: 'snow',
    });
    quills.push(quillInstance); // Store each Quill instance in the array
  });
}
