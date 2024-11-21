import { calculator, calculatorList } from '../constants';
import {
  appendTemplate,
  calculateTotals,
  getLocalStorageItem,
  setLocalStorageItem,
  typeCheck,
} from '../helpers';
import { renderCalcs } from '../renderCalcs';
import { shapes } from '../template';

export const getLocalStorageCalcs = () => {
  //const calcType = getCalcType();
  const calcType = calculator.type === 'rebar' ? 'rebarCalculator' : 'calculator'; // something like "rebarCalculator"

  let storedCalcs = getLocalStorageItem(calcType) ? JSON.parse(localStorage.getItem(calcType)) : [];

  // check if any of the inputs have a value assigned to them
  // if not, start with a new calculator
  function doesStoredCalcsHaveValues() {
    let hasAValue = false;

    storedCalcs.forEach((savedItem) => {
      // also check if the name is different than the original name
      if (savedItem.name !== shapes[savedItem.type].name) {
        hasAValue = true;
      }

      savedItem.template.forEach((templateRow) => {
        if (
          (templateRow.unit1 && templateRow.unit1 !== null) ||
          (templateRow.unit2 && templateRow.unit2 !== null) ||
          (templateRow.quantity && templateRow.quantity !== 1)
        ) {
          hasAValue = true;
        }
      });
    });
    if (hasAValue === false) {
      return false;
    }
    return true;
  }

  function setLengthAndWidthInputs() {
    const calc = calculatorList.querySelectorAll('li')[0];
    const calcList = calc.querySelector('ul');
    const calcListLengthRow = calcList.querySelectorAll('li')[0];
    const calcListLengthInput = calcListLengthRow.querySelector('input');
    const calcListWidthRow = calcList.querySelectorAll('li')[1];
    const calcListWidthInput = calcListWidthRow.querySelector('input');
    const calcListDepthRow = calcList.querySelectorAll('li')[2];
    const calcListDepthInput = calcListDepthRow.querySelectorAll('input')[1];
    calcListLengthInput.value = calculator.length;
    calcListWidthInput.value = calculator.width;
    calcListDepthInput.value = 4;
  }

  if (!storedCalcs.length) {
    if (calculator.type === 'main') {
      // do something?
    } else {
      if (calculator.length && calculator.width) {
        appendTemplate(calculator.type);
        setLengthAndWidthInputs();
        calculateTotals();
      } else {
        appendTemplate(calculator.type);
        typeCheck(storedCalcs, calculator.type, 'push');
      }
    }
  } else {
    // stored calcs has a length
    if (calculator.type === 'main') {
      if (doesStoredCalcsHaveValues()) {
        storedCalcs.forEach((item) => {
          appendTemplate(item.type);
        });
        renderCalcs(storedCalcs);
      } else {
        storedCalcs = [];
      }
    } else {
      // calc type is not main
      if (calculator.length && calculator.width) {
        appendTemplate(calculator.type);
        setLengthAndWidthInputs();
        calculateTotals();
      } else {
        // if it's not a measurement page, append the calcs
        if (doesStoredCalcsHaveValues()) {
          storedCalcs.forEach((item) => {
            appendTemplate(item.type);
          });
          renderCalcs(storedCalcs);
        } else if (!doesStoredCalcsHaveValues()) {
          appendTemplate(calculator.type);
          storedCalcs = [
            {
              name: shapes[calculator.type].name,
              template: shapes[calculator.type].template,
              type: calculator.type,
            },
          ];
          typeCheck(storedCalcs, calculator.type, 'set');
        }
      }
    }
  }

  setLocalStorageItem(calcType, storedCalcs);
};
