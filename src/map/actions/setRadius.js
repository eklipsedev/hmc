import { getCenterCoordinates, getFilterInstance, setFilterInstance } from '../utils/constants';
import { getDistanceFromLatLonInKm } from '../utils/turf';

// resets the radius of each geojson object
// based on the new center coordinates
export const setRadius = (geoJSONData) => {
  //if (!geoJSONData?.features?.length) {
  //  console.warn('No features found in geoJSONData.');
  //  return;
  //}

  const [centerLng, centerLat] = getCenterCoordinates();
  const filterInstance = getFilterInstance();

  geoJSONData?.features.forEach((location, index) => {
    const [lng, lat] = location.geometry.coordinates;
    const distance = getDistanceFromLatLonInKm(centerLat, centerLng, lat, lng);
    const roundedDistance = Math.round(distance * 10) / 10;

    location.properties.radius = roundedDistance;

    const distanceText = filterInstance.listInstance.items[index].element.querySelector(
      "[data-element='distance']"
    );

    if (distanceText) {
      distanceText.textContent = roundedDistance;
      distanceText.style.display = 'block';
    }

    filterInstance.listInstance.items[index].props.distance.values = new Set([distance.toString()]);
  });

  // Safe to sort if items exist
  if (filterInstance?.listInstance?.items?.length > 1) {
    filterInstance.listInstance.items.sort((a, b) => {
      const aDist = parseFloat([...a.props.distance.values][0]);
      const bDist = parseFloat([...b.props.distance.values][0]);
      return aDist - bDist;
    });
  }

  setFilterInstance(filterInstance);
};
