import { setCursor } from '../components/cursor';
import { map } from '../components/map';
import {
  getCircleLayer,
  setCircleLayer,
  setInitialPointCoordinates,
  setInitialRadiusCircleCoordinates,
} from '../utils/constants';

export const handleMouseDownForCenterPoint = (e) => {
  map.getCanvas().classList.add('is-dragging-center');
  setCursor('grabbing');
  map.dragPan.disable();
  setInitialPointCoordinates(e.lngLat);
  setCircleLayer(map.getSource('radiusCircle'));
  setInitialRadiusCircleCoordinates(getCircleLayer()._data.geometry.coordinates[0]);
  setInitialPointCoordinates(e.lngLat);
};
