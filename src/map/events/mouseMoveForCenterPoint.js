import { setCursor } from '../components/cursor';
import { addDistanceLayers } from '../components/layers/radiusLayers';
import { map } from '../components/map';
import {
  getCircleLayer,
  getInitialPointCoordinates,
  getInitialRadiusCircleCoordinates,
} from '../utils/constants';

export const handleMouseMoveForCenterPoint = (e) => {
  if (!map.getCanvas().classList.contains('is-dragging-center')) {
    return;
  }
  if (map.getCanvas().classList.contains('is-dragging-center')) {
    setCursor('grabbing');
    const lngOffset = e.lngLat.lng - getInitialPointCoordinates().lng;
    const latOffset = e.lngLat.lat - getInitialPointCoordinates().lat;
    const newRadiusCircleCoordinates = getInitialRadiusCircleCoordinates().map((coordinate) => {
      return [coordinate[0] + lngOffset, coordinate[1] + latOffset];
    });
    // set new circle data
    getCircleLayer().setData({
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [newRadiusCircleCoordinates],
      },
    });
    const polygon = turf.polygon([newRadiusCircleCoordinates]);
    const center = turf.center(polygon);
    addDistanceLayers(center);
    //setCenterCoordinates(center.geometry.coordinates);

    // set new center point data
    const pointLayer = map.getSource('point');
    pointLayer.setData({
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: center.geometry.coordinates,
      },
    });
  }
};
