import { displayError } from '../utils/formUtils';
import { getElement } from '../utils/helpers';
import { setBounds } from './actions/setBounds';
import { setLocationAsQueryParams } from './actions/setLocationParams';
import { setRadius } from './actions/setRadius';
import { addDistanceLayers } from './components/layers/radiusLayers';
import { fetchDataFromMapboxAPI } from './data/fetchMapboxData';
import { setLocationsAsGeoJSON } from './data/setLocationsGeoJSON';
import {
  accessToken,
  getCenterCoordinates,
  getFilterInstance,
  getLocationsData,
  getRadiusCircleData,
  radiusElement,
  searchElement,
  searchResultsListElement,
  setCenterCoordinates,
  setLocationsData,
} from './utils/constants';

export const handleReverseGeocodingLocation = async (longitude, latitude) => {
  longitude = longitude || getCenterCoordinates()[0];
  latitude = latitude || getCenterCoordinates()[1];

  const data = await fetchDataFromMapboxAPI(
    {
      access_token: accessToken,
    },
    `${longitude},${latitude}`,
    'Failed to fetch location'
  );

  return data ? data : null;
};

export const handleForwardGeocodingLocations = async () => {
  try {
    const data = await fetchDataFromMapboxAPI(
      {
        access_token: accessToken,
        country: 'us',
      },
      searchElement.value,
      'Failed to fetch search results'
    );

    if (!data) return;

    setCenterCoordinates(data.features[0].center);

    // Clear previous search results
    clearSearchResults();

    searchResultsListElement.style.display = 'flex';

    // Populate new search results
    data.features.forEach((feature) => {
      const listItem = createSearchResultItem(feature);
      searchResultsListElement.appendChild(listItem);
    });
  } catch (error) {
    displayError(`Error fetching location data: ${error.message}`);
  }
};

// Helper function to clear search results
const clearSearchResults = () => {
  while (searchResultsListElement.firstChild) {
    searchResultsListElement.removeChild(searchResultsListElement.firstChild);
  }
};

// Helper function to create a search result item
const createSearchResultItem = (feature) => {
  const searchResultsListItemElement = getElement('search-results-item');
  const clonedItem = searchResultsListItemElement.cloneNode(true);
  clonedItem.textContent = feature.place_name;

  clonedItem.addEventListener('click', () => {
    handleSearchResultClick(feature);
  });

  return clonedItem;
};

// Function to handle search result click events
const handleSearchResultClick = (feature) => {
  const locationsData = setLocationsAsGeoJSON(getFilterInstance().listInstance.items);
  setLocationsData(locationsData);

  searchElement.value = feature.place_name;
  searchElement.title = feature.place_name;

  setCenterCoordinates(feature.center);
  addDistanceLayers(getCenterCoordinates());
  setBounds(getRadiusCircleData());

  getElement('max-radius').value = radiusElement.value;
  getElement('max-radius').dispatchEvent(new Event('change'));

  setRadius(getLocationsData());
  getFilterInstance().filtersData[0].values = new Set(['0', radiusElement.value]);
  getFilterInstance().applyFilters();

  setLocationAsQueryParams();

  searchResultsListElement.style.display = 'none';
};
