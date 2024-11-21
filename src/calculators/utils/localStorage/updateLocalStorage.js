import { calculator, calculatorList, settings } from '../constants';
import { getLocalStorageItem, setLocalStorageItem, typeCheck } from '../helpers';
import { setLocalStorageCalcs } from './setLocalStorage';

// initialize the first calc storage
// will only be triggered when at least 1 input changes
// so check for event
export const updateLocalStorageCalcs = (e, action) => {
  const calcType = calculator.type === 'rebar' ? 'rebarCalculator' : 'calculator'; // something like "rebarCalculator"

  let storedCalcs = getLocalStorageItem(calcType);
  // loop over all calcs and their data that are currently inside of the calculator list
  // once you have this, set it as the array to be added to local storage
  switch (action) {
    case 'create':
      // code block
      const { type } = e.target.dataset;
      typeCheck(storedCalcs, type, 'push');
      setLocalStorageItem(calcType, storedCalcs);
      break;
    case 'remove':
      // code block
      const calc = e.target.closest('li');
      const calcIndex = Array.from(calculatorList.children).indexOf(calc);
      storedCalcs.splice(calcIndex, 1);
      setLocalStorageItem(calcType, storedCalcs);
      break;
    case 'update':
      // code block
      const calcRow = e.target.closest('li');
      const calcRows = calcRow.parentNode;
      const calcRowIndex = Array.from(calcRows.children).indexOf(calcRow);
      const calcListItem = calcRows.parentNode;
      const calcListIndex2 = Array.from(calculatorList.children).indexOf(calcListItem);
      const unitType = e.target.dataset.type;
      const inputValue = parseFloat(e.target.value);
      const calcRowKeys = storedCalcs[calcListIndex2].template[calcRowIndex];

      for (const key in calcRowKeys) {
        if (unitType === key) {
          //key.value = storedCalcs[calcListIndex2].template[calcRowIndex][key] = inputValue;
          storedCalcs[calcListIndex2].template[calcRowIndex][key] = inputValue;
        }
      }
      setLocalStorageItem(calcType, storedCalcs);
      break;
    case 'updateUnitTypeValues':
      // code block
      Array.from(calculatorList.children).forEach((listItem, listItemIndex) => {
        let rows = Array.from(listItem.querySelector('ul').children);

        rows.forEach((row, rowIndex) => {
          let inputs = row.querySelectorAll('[data-calculate]');

          Array.from(inputs).forEach((input) => {
            let calcRowKeys = storedCalcs[listItemIndex].template[rowIndex];
            for (const key in calcRowKeys) {
              if (input.dataset.type === key) {
                //key.value = storedCalcs[listItemIndex].template[rowIndex][key] = parseFloat(
                //  input.value
                //);
                storedCalcs[listItemIndex].template[rowIndex][key] = parseFloat(input.value);
              }
            }
          });
        });
      });
      setLocalStorageItem(calcType, storedCalcs);
      break;
    case 'updateName':
      const calcItem = e.target.closest('li');
      const calcParent = calcItem.parentNode;
      const calcListIndex = Array.from(calcParent.children).indexOf(calcItem);
      storedCalcs[calcListIndex].name = e.target.value.trim();
      setLocalStorageItem(calcType, storedCalcs);
      break;
    case 'reset':
      setLocalStorageCalcs();
      break;
    default:
  }
};

export const updateLocalStorageSettings = () => {
  setLocalStorageItem('settings', settings);
};
