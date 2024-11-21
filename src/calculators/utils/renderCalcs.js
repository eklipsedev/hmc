import { calculatorList } from './constants';

export const renderCalcs = (storedCalcs) => {
  if (storedCalcs) {
    // loop over each row in the calculator & match it with the appropriate object in localStorage
    const calcItems = calculatorList.getElementsByClassName('calculator_list-item');

    if (calcItems.length && storedCalcs.length) {
      Array.from(calcItems).forEach((listItem, listItemIndex) => {
        const nameInput = listItem.getElementsByTagName('input')[0];

        nameInput.value = storedCalcs[listItemIndex].name;

        Array.from(listItem.getElementsByTagName('li')).forEach((row, index) => {
          const value = (unit) => {
            return storedCalcs[listItemIndex].template[index][unit];
          };

          const unit1 = row.querySelector('[data-type="unit1"]');
          const unit2 = row.querySelector('[data-type="unit2"]');

          if (unit1) {
            unit1.value = value('unit1');
          }
          if (unit2) {
            unit2.value = value('unit2');
          }

          const quantity = row.querySelector('[data-type="quantity"]');
          const stepCount = row.querySelector('[data-type="stepCount"]');

          if (quantity) {
            quantity.value = value('quantity');
          }
          if (stepCount) {
            stepCount.value = value('stepCount');
          }
        });
      });
    }
  }
};
