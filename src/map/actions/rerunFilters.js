import { getFilterInstance, radiusElement, setFilterInstance } from '../utils/constants';

export const rerunFilters = () => {
  // set the new values for the range filter
  const filterInstance = getFilterInstance();

  filterInstance.filtersData[0].values = new Set(['0', radiusElement.value]);

  setFilterInstance(filterInstance);
};
