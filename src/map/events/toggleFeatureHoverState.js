import { map } from '../components/map';
import { getActiveFeatureId } from '../utils/constants';

export const toggleFeatureHoverState = (state) => {
  if (map.getSource('locations')) {
    map.setFeatureState({ source: 'locations', id: getActiveFeatureId() }, { hover: state });
  }
};
