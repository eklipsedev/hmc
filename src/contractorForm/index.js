export const handleContractorForm = () => {
  const form = document.querySelector('#contractor-form');

  if (!form) return;

  form.addEventListener('submit', async function (e) {
    e.preventDefault();

    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    // Extract slug from URL and include it in body
    const pathParts = window.location.pathname.split('/');
    const slug = pathParts[pathParts.length - 1];
    data.slug = slug;

    try {
      const response = await fetch('https://send-form-submission-manager.josh-8e8.workers.dev/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const resultText = await response.text();

      if (response.ok) {
        alert('Form submitted successfully!');
      } else {
        alert('Something went wrong: ' + resultText);
      }
    } catch (err) {
      alert('Error submitting form: ' + err.message);
    }
  });
};
