import { setBounds } from '../actions/setBounds';
import { map } from '../components/map';
import { handleForwardGeocodingLocations } from '../handleGeocodingLocations';
import { getLocationsData, searchElement, searchResultsListElement } from '../utils/constants';

let timer;

export const onSearchElementFocus = () => {
  if (searchElement.value.length) {
    handleForwardGeocodingLocations(map);
  }
};

export const onSearchElementFocusOut = () => {
  if (searchElement.value.length) {
    const HIDE_DELAY_MS = 100;
    setTimeout(() => {
      searchResultsListElement.style.display = 'none';
    }, HIDE_DELAY_MS);
  } else {
    // No need to await here since resetFilters is commented out
    if (map.getLayer('radiusCircle')) {
      map.setLayoutProperty('radiusCircle', 'visibility', 'none');
    }
    setBounds(getLocationsData().features);
  }
};

const SEARCH_DEBOUNCE_TIME = 500;

export const onSearchElementKeyUp = () => {
  clearTimeout(timer);
  if (searchElement.value.length) {
    timer = setTimeout(() => {
      handleForwardGeocodingLocations(map);
    }, SEARCH_DEBOUNCE_TIME);
  } else {
    // search result cleared
    timer = setTimeout(() => {
      searchResultsListElement.style.display = 'none';
    }, SEARCH_DEBOUNCE_TIME);
  }
};
