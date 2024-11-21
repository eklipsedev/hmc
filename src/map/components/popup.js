import mapboxgl from 'mapbox-gl';

import { getElement } from '../../utils/helpers';
import { toggleFeatureHoverState } from '../events/toggleFeatureHoverState';
import { map } from './map';

const popupElement = getElement('popup') || null;

let popup = new mapboxgl.Popup({
  closeButton: false,
  closeOnClick: true,
  anchor: 'top',
});

// update the popup
export const isPopupEnabled = () => {
  return popupElement && popup.isOpen();
};

export const handlePopup = (lngLat, html) => {
  if (lngLat) {
    if (isPopupEnabled()) {
      popup.remove();
      toggleFeatureHoverState('locations', false);
    } else {
      popup.setLngLat(lngLat).setHTML(html).addTo(map);
      toggleFeatureHoverState('locations', true);
    }
  }
};
