import { displayError } from '../../utils/formUtils';

export const fetchDataFromMapboxAPI = async (searchParams, input, error) => {
  const params = new URLSearchParams(searchParams).toString();

  const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${input}.json?${params}`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      displayError(error);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    displayError(`Error fetching location data: ${error.message}`);
    return;
  }
};
