import mapboxgl from 'mapbox-gl';

import { map } from '../components/map';

export const setBounds = (locations, animate = true) => {
  const getCoordinates = () => {
    if (locations.geometry && locations.geometry.coordinates.length) {
      return locations.geometry.coordinates[0];
    }
    if (locations.features && locations.features.length) {
      return locations.features.map((feature) => feature.geometry.coordinates);
    }
    return [];
  };

  const coordinatesArray = getCoordinates();
  if (coordinatesArray.length < 2) return; // Ensure at least two coordinates are available

  const bounds = coordinatesArray.reduce(
    (bounds, coord) => bounds.extend(coord),
    new mapboxgl.LngLatBounds(coordinatesArray[0], coordinatesArray[1])
  );

  map.fitBounds(bounds, {
    padding: { top: 50, bottom: 50, left: 50, right: 50 },
    easing: (t) => t * (2 - t),
    animate,
  });
};
