import { handleReverseGeocodingLocation } from '../handleGeocodingLocations';
import { getCenterCoordinates, radiusElement, setCenterCoordinates } from '../utils/constants';

export const setLocationAsQueryParams = () => {
  const newParams = {
    lng: getCenterCoordinates()[0],
    lat: getCenterCoordinates()[1],
    radius: radiusElement.value,
  };

  const params = new URLSearchParams(window.location.search);
  for (const [key, value] of Object.entries(newParams)) {
    params.set(key, value);
  }

  const newUrl = `${window.location.pathname}?${params.toString()}`;
  window.history.pushState({}, '', newUrl);
};

export const setLocationFromParams = () => {
  const params = new URLSearchParams(window.location.search);
  // Get the latitude and longitude values from the query parameters
  const longitude = params.get('lng');
  const latitude = params.get('lat');
  const radius = params.get('radius');

  if (longitude && latitude && radius) {
    handleReverseGeocodingLocation(longitude, latitude);
    radiusElement.value = radius;
    setCenterCoordinates([longitude, latitude]);
    setLocationAsQueryParams();
  }
};

export const getURLParams = () => {
  const params = new URLSearchParams(window.location.search);
  // Get the latitude and longitude values from the query parameters
  const longitude = params.get('lng');
  const latitude = params.get('lat');
  const radius = params.get('radius');

  return { longitude, latitude, radius };
};
