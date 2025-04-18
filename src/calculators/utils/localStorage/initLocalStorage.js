import { bagSize, costPerBag, wastePercentage } from '../../concreteCalculator/constants';
import { costToggle } from '../../concreteCalculator/constants';
import { body, getSettings, setSettings, settingsTemplate, unitToggle } from '../constants';
import { updateLocalStorageSettings } from './updateLocalStorage';

export const initLocalStorageSettings = () => {
  const storedSettings = localStorage.getItem('settings');
  setSettings(storedSettings ? JSON.parse(storedSettings) : settingsTemplate);

  if (Object.keys(getSettings()).length !== 0) {
    // unit type check
    if (getSettings().unitType === 'metric') {
      unitToggle.checked = true;
      setSettings({ unitType: 'metric' });
      if (body.classList.contains('is-imperial')) {
        body.classList.remove('is-imperial');
        body.classList.add('is-metric');
      }
    } else {
      unitToggle.checked = false;
      setSettings({ unitType: 'imperial' });
      if (body.classList.contains('is-metric')) {
        body.classList.remove('is-metric');
        body.classList.add('is-imperial');
      }
    }

    // cost type check
    if (getSettings().costType === 'cost-per-area') {
      if (costToggle) costToggle.checked = true;
      setSettings({ costType: 'cost-per-area' });
      if (body.classList.contains('is-cost-per-bag')) {
        body.classList.remove('is-cost-per-bag');
        body.classList.add('is-cost-per-area');
      }
    } else {
      if (costToggle) costToggle.checked = false;
      setSettings({ costType: 'cost-per-bag' });
      if (body.classList.contains('is-cost-per-area')) {
        body.classList.remove('is-cost-per-area');
        body.classList.add('is-cost-per-bag');
      }
    }
  } else {
    // set class to body based on user location
    body.classList.add(`is-${getSettings().unitType}`);
    unitToggle.checked = getSettings().unitType === 'metric' ? true : false; //settings.metric;
  }

  if (bagSize) bagSize.value = getSettings().bagSize;
  if (costPerBag) costPerBag.value = getSettings().costPerBag;
  if (wastePercentage) wastePercentage.value = getSettings().wastePercentage;

  updateLocalStorageSettings();
};
