import { getMemberCustomFields } from '../../memberstack/memberstack';

let selectedServices = [];

export const setServices = async (form) => {
  const savedServices = getMemberCustomFields().services?.split(',') || [];

  const items = form['services-list'].querySelectorAll('.w-dyn-item');
  items.forEach((item) => {
    const checkbox = item.querySelector("input[type='checkbox']");

    if (savedServices.includes(checkbox.id)) {
      checkbox.checked = true;
      selectedServices.push(checkbox.id);
    }

    checkbox.addEventListener('change', (e) => handleServiceChange(form, e));
  });

  setServicesInput(form);
};

export const setServicesInput = (form) => {
  // Convert selected services to a comma-separated list to store in Memberstack
  form.services.value = selectedServices.join(',');
  form.services.dispatchEvent(new Event('change'));
};

export const handleServiceChange = (form, e) => {
  const checkbox = e.target;

  if (checkbox.checked) {
    // Add to selectedServices if checked, ensuring no duplicates
    if (!selectedServices.includes(checkbox.id)) selectedServices.push(checkbox.id);
  } else {
    // Remove from selectedServices if unchecked
    selectedServices = selectedServices.filter((service) => service !== checkbox.id);
  }

  setServicesInput(form);
};
