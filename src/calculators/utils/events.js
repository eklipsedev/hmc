//import { displaySuccess } from '../../utils/formUtils';
import { bagSize, costPerBag, wastePercentage } from '../concreteCalculator/constants';
import { calculateTotal } from '../concreteCalculator/helpers';
import { calculateRebarTotal } from '../rebarCalculator/helpers';
import { createCalcListItem, removeCalcListItem, resetCalcListItems } from './actions';
import { calculator, setSettings } from './constants';
import { getLocalStorageItem, toggleCostTypeCheckbox, toggleUnitTypeCheckbox } from './helpers';
import {
  updateLocalStorageCalcs,
  updateLocalStorageSettings,
} from './localStorage/updateLocalStorage';

// handle global click events
export const handleClickEvent = (e) => {
  const actionElement = e.target.closest('[data-action]');
  if (!actionElement) return;

  // Get the action type
  const { action } = actionElement.dataset;

  switch (action) {
    case 'create':
      createCalcListItem(e);
      break;
    case 'remove':
      removeCalcListItem(e);
      break;
    case 'reset':
      resetCalcListItems(e);
      break;
    default:
      return;
  }
};

export const handleChangeEvent = (e) => {
  const el = e.target;
  const { setting, calculate } = el.dataset;

  // Define a helper to choose the correct calculation function
  const calculateTotalByType = () =>
    calculator.type === 'rebar' ? calculateRebarTotal() : calculateTotal();

  // Handle calculation-related changes
  if (calculate) {
    const calcType = calculator.type === 'rebar' ? 'rebarCalculator' : 'calculator';
    const action = !getLocalStorageItem(calcType).length ? 'create' : 'update';
    updateLocalStorageCalcs(e, action);
    calculateTotalByType();
  }

  // Handle setting-related changes
  if (setting) {
    switch (setting) {
      case 'unitType':
        toggleUnitTypeCheckbox();
        updateLocalStorageCalcs(e, 'updateUnitTypeValues');
        break;
      case 'costType':
        toggleCostTypeCheckbox(e);
        break;
      case 'bagSize':
        setSettings({ bagSize: bagSize.value });
        //displaySuccess('bag size updated');
        break;
      case 'costPerBag':
        setSettings({ costPerBag: costPerBag.value || 0 });
        //displaySuccess('cost updated');
        break;
      case 'wastePercentage':
        setSettings({ wastePercentage: wastePercentage.value });
        //displaySuccess('waste percentage updated');
        break;
      default:
        return; // Exit if no other cases match
    }
    calculateTotalByType();
    updateLocalStorageSettings();
  }
};

// store name value temporarily to determine if name changed
let nameValue = '';

export const handleFocusEvent = (e) => {
  const el = e.target;
  const { action } = el.dataset;

  if (action !== 'updateName') return;

  nameValue = el.value.trim();
};

export const handleBlurEvent = (e) => {
  const el = e.target;
  const { action } = el.dataset;

  if (action !== 'updateName') return;

  const trimmedValue = el.value.trim();
  el.value = trimmedValue;

  if (trimmedValue !== nameValue) {
    updateLocalStorageCalcs(e, action);
    //const calculatorName = el.closest('li')?.dataset.calculator || 'Calculator';
    //displaySuccess(`${calculatorName} name updated`);
  }
};
