import { calculator, form } from '../utils/constants';
import { handleDropdown } from '../utils/dropdown';
import {
  handleBlurEvent,
  handleChangeEvent,
  handleClickEvent,
  handleFocusEvent,
} from '../utils/events';
import { isImperialCountry } from '../utils/helpers';
import { getLocalStorageCalcs } from '../utils/localStorage/getLocalStorage';
import { initLocalStorageSettings } from '../utils/localStorage/initLocalStorage';
import { calculateRebarTotal } from './helpers';

export const handleRebarCalculator = () => {
  if (!form || calculator.type !== 'rebar') return;

  isImperialCountry();
  initLocalStorageSettings();
  getLocalStorageCalcs();
  calculateRebarTotal();
  handleDropdown();

  // handle global events
  document.addEventListener('click', (e) => handleClickEvent(e));
  document.addEventListener('change', (e) => handleChangeEvent(e));
  document.addEventListener('focus', (e) => handleFocusEvent(e), { capture: true });
  document.addEventListener('blur', (e) => handleBlurEvent(e), true);
};
