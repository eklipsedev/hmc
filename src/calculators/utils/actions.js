//import { displaySuccess } from '../../utils/formUtils';
import { calculateTotal } from '../concreteCalculator/helpers';
import { calculateRebarTotal } from '../rebarCalculator/helpers';
import { body, calculator, calculatorList, empty } from './constants';
import { appendTemplate } from './helpers';
import { setLocalStorageCalcs } from './localStorage/setLocalStorage';
import { updateLocalStorageCalcs } from './localStorage/updateLocalStorage';

// create a new calculator item
export const createCalcListItem = (e) => {
  const { type } = e.target.dataset;
  appendTemplate(type);
  if (calculatorList.children.length) {
    empty.style.display = 'none';
  }
  updateLocalStorageCalcs(e, 'create');
  calculator.type === 'rebar' ? calculateRebarTotal() : calculateTotal();
  //displaySuccess(`New ${type} added`);
};

// remove an existing calculator item
export const removeCalcListItem = (e) => {
  const parentListItem = e.target.closest('li');
  updateLocalStorageCalcs(e, 'remove');
  parentListItem.remove();
  if (!calculatorList.children.length) {
    empty.style.display = 'block';
  }
  calculator.type === 'rebar' ? calculateRebarTotal() : calculateTotal();
  //displaySuccess(`${parentListItem.getAttribute('data-calculator')} removed`);
};

// reset all calculator items
export const resetCalcListItems = (e) => {
  if (calculator.type === 'main') {
    updateLocalStorageCalcs(e, 'reset');
    calculatorList.innerHTML = '';
    empty.style.display = 'block';
  } else if (calculator.type !== 'main') {
    calculatorList.innerHTML = '';
    appendTemplate(calculator.type);
    setLocalStorageCalcs();
    empty.style.display = 'none';
  }
  calculator.type === 'rebar' ? calculateRebarTotal() : calculateTotal();
  body.scrollTop = document.documentElement.scrollTop = 0;
  //displaySuccess('Calculator Reset');
};
