/* eslint-disable no-return-assign */
import { getLocationsData } from '../../utils/constants';
import { map } from '../map';

export const addLocationsLayer = (sourceId) => {
  // Add a custom data source if it doesn't exist
  if (!map.getSource(sourceId)) {
    map.addSource(sourceId, {
      type: 'geojson',
      data: getLocationsData(),
    });
  }

  // Add the vector layer itself
  map.addLayer({
    id: 'locations',
    type: 'circle',
    source: sourceId,
    paint: {
      'circle-color': [
        'case',
        ['boolean', ['feature-state', 'hover'], false],
        '#FFB238', // color when hovered
        '#000', // color when not hovered
      ],
      'circle-radius': [
        'case',
        ['boolean', ['feature-state', 'hover'], false],
        7, // radius when hovered
        5, // radius when not hovered
      ],
    },
  });
};

// utility function to handle adding layers
export const handleAddLayer = (layer) => {
  try {
    map.addLayer(layer);
  } catch (err) {
    console.error(`Failed to add layer: ${err.message}`);
  }
};
