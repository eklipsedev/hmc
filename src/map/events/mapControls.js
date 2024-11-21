import { getElement } from '../../utils/helpers';
import { setBounds } from '../actions/setBounds';
import { map } from '../components/map';
import { getCurrentBounds } from '../utils/constants';

const handleZoomButtonClick = (zoomChange) => {
  const zoomLevel = map.getZoom();
  map.setZoom(zoomLevel + zoomChange);
};

export const handleZoomIn = () => {
  const zoomInBtn = getElement('zoom-in');
  if (zoomInBtn) {
    zoomInBtn.addEventListener('click', () => handleZoomButtonClick(0.5));
  }
};

export const handleZoomOut = () => {
  const zoomOutBtn = getElement('zoom-out');
  if (zoomOutBtn) {
    zoomOutBtn.addEventListener('click', () => handleZoomButtonClick(-0.5));
  }
};

export const handleRecenter = () => {
  const recenterBtn = getElement('re-center');
  if (recenterBtn) {
    recenterBtn.addEventListener('click', () => {
      setBounds(getCurrentBounds());
    });
  }
};
