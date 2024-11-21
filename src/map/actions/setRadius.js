import { getCenterCoordinates, getFilterInstance, setFilterInstance } from '../utils/constants';
import { getDistanceFromLatLonInKm } from '../utils/turf';

// resets the radius of each geojson object
// based on the new center coordinates
export const setRadius = (geoJSONData) => {
  let filterInstance = getFilterInstance();

  // by now, all locations should be set
  geoJSONData.features.forEach((location, index) => {
    const distance = getDistanceFromLatLonInKm(
      getCenterCoordinates()[1],
      getCenterCoordinates()[0],
      location.geometry.coordinates[1],
      location.geometry.coordinates[0]
    );

    const roundedDistance = Math.round(distance * 10) / 10;
    location.properties.radius = roundedDistance;

    const distanceText = getFilterInstance().listInstance.items[index].element.querySelector(
      "[data-element='distance']"
    );

    if (Number(roundedDistance) >= 0) {
      distanceText.textContent = roundedDistance;
      distanceText.style.display = 'block';
    } else {
      distanceText.textContent = '';
      distanceText.style.display = 'none';
    }

    const newDistance = new Set();
    newDistance.add(distance.toString());
    filterInstance.listInstance.items[index].props.distance.values = newDistance;
  });

  const sortedItems = filterInstance.listInstance.items.sort(
    (a, b) =>
      a.props.distance.values.values().next().value - b.props.distance.values.values().next().value
  );
  filterInstance.listInstance.items = sortedItems;

  setFilterInstance(filterInstance);
};
