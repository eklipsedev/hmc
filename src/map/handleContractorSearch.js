import { displayError } from '../utils/formUtils';
import { getElement } from '../utils/helpers';
import { accessToken, radiusElement, searchElement } from './utils/constants';

export const handleContractorSearch = async () => {
  const contractorSearchForm = getElement('contractor-search-form');

  if (!contractorSearchForm) return;

  contractorSearchForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const zipCode = searchElement.value;
    const radius = radiusElement.value;

    // Use Mapbox to get coordinates from the zip code
    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${zipCode}.json?access_token=${accessToken}`;

    try {
      const response = await fetch(url);

      if (!response.ok) {
        displayError('Error fetching location. Please try again');
        return;
      }

      const data = await response.json();

      if (data && data.features.length > 0) {
        const [lng, lat] = data.features[0].center;

        // Construct the redirect URL
        const searchUrl = `/contractor-search?lng=${lng}&lat=${lat}&radius=${radius}`;

        // Redirect the user to the new URL
        window.location.href = searchUrl;
      } else {
        displayError('Could not find location for the provided zip code');
      }
    } catch (error) {
      displayError(`Error fetching locations: ${error.message}`);
    }
  });
};
