import { costToggle } from '../concreteCalculator/constants';
import { calculateTotal } from '../concreteCalculator/helpers';
import { calculateRebarTotal } from '../rebarCalculator/helpers';
import {
  body,
  calculator,
  calculatorList,
  empty,
  getSettings,
  setSettings,
  unitToggle,
} from './constants';
import { updateLocalStorageCalcs } from './localStorage/updateLocalStorage';
import { shapes } from './template';

export const removeTrailingZeros = (numStr) => {
  return parseFloat(numStr);
};

export const isZero = (unitType) => {
  let num = parseFloat(unitType);

  if (num > 0 && num !== Infinity) {
    if (Number.isInteger(num)) {
      return num; // Return as an integer if there are no decimals
    }
    return removeTrailingZeros(setToTwoDecimals(num)); // Format to two decimals and remove trailing zeros
  }
  return '—'; // Return "—" if the number is less than or equal to zero
};

export const hasValue = (unit) => {
  // for some reason 2 equals signs doesn't work right...confirm later
  return unit !== '' ? parseFloat(unit.toFixed(3)).toString() : '';
};

export const setToTwoDecimals = (value) => {
  return parseFloat(value).toFixed(2);
};

// handle conversion between feet and meters
export const convertFeetToMeters = (feet) => {
  const metersPerFoot = 0.3048;
  return hasValue(feet * metersPerFoot); //(feet * metersPerFoot).toFixed(3);
};

export const convertMetersToFeet = (meters) => {
  const feetPerMeter = 3.28084;
  return hasValue(meters * feetPerMeter);
};

// handle conversion between inches and centimeters
export const convertInchesToCentimeters = (inches) => {
  const centimetersPerInch = 2.54;
  return hasValue(inches * centimetersPerInch);
};

export const convertCentimetersToInches = (centimeters) => {
  const inchesPerCentimeter = 0.393701;
  return hasValue(centimeters * inchesPerCentimeter);
};

// local storage
export const getLocalStorageItem = (key) => {
  return JSON.parse(localStorage.getItem(key));
};

export const setLocalStorageItem = (key, value) => {
  return localStorage.setItem(key, JSON.stringify(value));
};

// check if the user is in an imperial country, returns True or False
export const isImperialCountry = () => {
  const imperialCountries = ['US', 'LR', 'MM']; // Add more country codes as needed

  const userLanguage = (navigator.language || 'en-US').toUpperCase();
  const userCountryCode = userLanguage.split('-')[1];

  return imperialCountries.includes(userCountryCode);
};

// append a new list item to the list
export const appendTemplate = (type) => {
  if (type !== 'main') {
    let template = document.getElementById(`js-${type}-template`).getElementsByTagName('li')[0];
    const clonedItem = template.cloneNode(true);
    calculatorList.appendChild(clonedItem);
    empty.style.display = 'none';
  }
};

export const convertRows = () => {
  let calculatorListItems = Array.from(calculatorList.children);

  calculatorListItems.forEach((listItem) => {
    let rows = Array.from(listItem.querySelector('ul').children);

    rows.forEach((row) => {
      let unit1 = row.querySelectorAll('input')[0];
      let unit2 = row.querySelectorAll('input')[1];

      if (unit1 && unit2) {
        if (getSettings().unitType !== 'metric') {
          // metric to imperial
          if (unit1.value) unit1.value = convertMetersToFeet(unit1.value);
          if (unit2.value) unit2.value = convertCentimetersToInches(unit2.value);
        } else {
          // imperial to metric
          if (unit1.value) unit1.value = convertFeetToMeters(unit1.value);
          if (unit2.value) unit2.value = convertInchesToCentimeters(unit2.value);
        }
      }
    });
  });
};

export const toggleUnitTypeCheckbox = (e) => {
  const newUnitType = unitToggle.checked ? 'metric' : 'imperial';
  setSettings({ unitType: newUnitType });

  body.classList.toggle('is-metric', newUnitType === 'metric');
  body.classList.toggle('is-imperial', newUnitType === 'imperial');

  convertRows();
  //calculateTotals();
  updateLocalStorageCalcs(e, 'updateUnitTypeValues');
};

export const toggleCostTypeCheckbox = (e) => {
  const newCostType = e.target.checked ? 'cost-per-area' : 'cost-per-bag';
  setSettings({ costType: newCostType });

  body.classList.toggle('is-cost-per-area', newCostType === 'cost-per-area');
  body.classList.toggle('is-cost-per-bag', newCostType === 'cost-per-bag');

  calculateTotals();
  updateLocalStorageCalcs(e, 'updateCostTypeValues');
};


// get number value of a given input
export const getValueOfInput = (calc, row) => {
  const rowGroup = calc.querySelector(`[data-row="${row}"]`);
  // handle conversions somewhere else
  const unit1Multiplier = getSettings().unitType === 'metric' ? 39.37 : 12;
  const unit2Multiplier = getSettings().unitType === 'metric' ? 2.54 : 1;

  const setValueAsNumber = (el) => {
    return parseFloat(!el.value ? 0 : el.value);
  };

  // check if there is a unit group... quantity won't have one
  if (rowGroup) {
    const unit1 = rowGroup.querySelector('[data-type="unit1"]');
    const unit2 = rowGroup.querySelector('[data-type="unit2"]');

    if (unit1 && unit2) {
      return (
        setValueAsNumber(rowGroup.querySelector('[data-type="unit1"]')) * unit1Multiplier +
        setValueAsNumber(rowGroup.querySelector('[data-type="unit2"]')) / unit2Multiplier
      );
    }

    return setValueAsNumber(
      rowGroup.querySelector('[data-type="quantity"]') ||
        rowGroup.querySelector('[data-type="stepCount"]')
    );
  }
};

// decides whether to set array or to push new item into array
export const typeCheck = (storedCalcs, condition, method) => {
  const objectTemplate = (type) => {
    return {
      type: shapes[type].type,
      name: shapes[type].name,
      template: shapes[type].template,
    };
  };

  const setSavedCalculator = (object) => {
    // eslint-disable-next-line no-return-assign
    return method === 'set' ? (storedCalcs = [object]) : storedCalcs.push(object);
  };

  switch (condition /*calculator.type*/) {
    case shapes.slab.type:
      setSavedCalculator(objectTemplate(shapes.slab.type));
      break;
    case shapes.triangle.type:
      setSavedCalculator(objectTemplate(shapes.triangle.type));
      break;
    case shapes.column.type:
      setSavedCalculator(objectTemplate(shapes.column.type));
      break;
    case shapes.curbGutter.type:
      setSavedCalculator(objectTemplate(shapes.curbGutter.type));
      break;
    case shapes.stairs.type:
      setSavedCalculator(objectTemplate(shapes.stairs.type));
      break;
    case shapes.tube.type:
      setSavedCalculator(objectTemplate(shapes.tube.type));
      break;
    case shapes.rebar.type:
      setSavedCalculator(objectTemplate(shapes.rebar.type));
      break;
    default:
      storedCalcs = [];
  }
};

export const calculateTotals = () => {
  calculator.type === 'rebar' ? calculateRebarTotal() : calculateTotal();
};
