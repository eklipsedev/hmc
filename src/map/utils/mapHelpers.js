import { map } from '../components/map';

export const flyToLocation = (currentFeature, options = {}) => {
  if (!currentFeature) {
    return;
  }

  const flyOptions = {
    center: currentFeature,
    curve: 1,
    speed: 1,
    ...options,
  };

  map.flyTo(flyOptions);
};
