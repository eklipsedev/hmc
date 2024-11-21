import {
  //getCurrentBearing,
  getRadiusCircleData,
  radiusElement,
  setRadiusCircleData,
} from '../../utils/constants';
import { map } from '../map';

// handle radius circle, center pin and drag pin
export const addDistanceLayers = (center) => {
  let radius = radiusElement.value || 30;

  const options = {
    steps: 100, // number
    units: 'miles', // string
  };

  // set the radiusCircle data so it can be accessed later
  setRadiusCircleData(turf.circle(center, radius, options));

  // establish the 3 layers
  const layers = [
    {
      id: 'radiusCircle',
      type: 'fill',
      source: {
        type: 'geojson',
        data: getRadiusCircleData(),
      },
      paint: {
        'fill-color': '#FFB238',
        'fill-opacity': 0.2,
        'fill-outline-color': '#f55b23',
      },
      layout: {
        visibility: 'visible',
      },
    },
    {
      id: 'point',
      type: 'circle',
      source: {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: [
            {
              type: 'Feature',
              geometry: {
                type: 'Point',
                coordinates: center,
              },
            },
          ],
        },
      },
      paint: {
        'circle-radius': 8,
        'circle-color': '#FFB238',
      },
      layout: {
        visibility: 'visible',
      },
    },
  ];

  layers.forEach((layer) => {
    if (map.getLayer(layer.id)) {
      map.getSource(layer.id).setData(layer.source.data);
    } else {
      map.addLayer(layer);
    }
  });
};
