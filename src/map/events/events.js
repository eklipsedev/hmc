import { getElement } from '../../utils/helpers';
import { setCursor } from '../components/cursor';
import { handlePopup } from '../components/popup';
import { setActiveFeatureId } from '../utils/constants';
import { flyToLocation } from '../utils/mapHelpers';
import { toggleHightlightCardOnMarkerHover } from './highlightCardOnMarkerHover';
import { toggleFeatureHoverState } from './toggleFeatureHoverState';

export const handleLocationsClick = (e) => {
  const coordinates = e.lngLat;
  const popupElement = getElement('popup').cloneNode(true);
  const { properties } = e.features[0];

  getElement('name', popupElement).textContent = properties.name;
  getElement('link', popupElement).href = properties.slug;
  getElement('street', popupElement).textContent = properties.street;
  getElement('city', popupElement).textContent = properties.city;
  getElement('state', popupElement).textContent = properties.state;
  getElement('zip-code', popupElement).textContent = properties.zipCode;
  getElement('phone', popupElement).textContent = properties.phoneText;
  getElement('phone', popupElement).href = properties.phoneNumber;
  getElement('verified', popupElement).style.display = properties.verified ? 'flex' : 'none';

  flyToLocation([coordinates.lng, coordinates.lat]);
  handlePopup(coordinates, popupElement.outerHTML);
};

export const handleLocationsMouseEnter = (e) => {
  setActiveFeatureId(e.features[0].id);
  toggleHightlightCardOnMarkerHover('mouseenter');
  toggleFeatureHoverState(true);
  setCursor('pointer');
};

export const handleLocationsMouseLeave = () => {
  toggleHightlightCardOnMarkerHover('mouseleave');
  toggleFeatureHoverState(false);
  setCursor('');
};
