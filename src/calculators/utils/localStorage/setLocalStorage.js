import { calculator } from '../constants';
import { setLocalStorageItem, typeCheck } from '../helpers';

export const setLocalStorageCalcs = () => {
  const calcType = calculator.type === 'rebar' ? 'rebarCalculator' : 'calculator'; // something like "rebarCalculator"
  let storedCalcs = [];

  typeCheck(storedCalcs, calculator.type /*&& localStorage.getItem("calculator").length*/, 'push');

  setLocalStorageItem(calcType, storedCalcs);
};
