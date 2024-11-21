import { getActiveFeatureId, getFilterInstance } from '../utils/constants';

// Highlight a card when the corresponding marker is hovered
export const toggleHightlightCardOnMarkerHover = (eventType) => {
  let item;
  let { items } = getFilterInstance().listInstance;

  const id = getActiveFeatureId();

  // Ensure id is valid before proceeding
  if (id === null || items[id] === undefined) {
    return; // Exit early if no valid feature ID is active
  }

  item = items[id].element;

  if (eventType === 'mouseenter') {
    // Add 'active' class on hover
    item.classList.add('active');
  } else if (eventType === 'mouseleave') {
    // Remove 'active' class when mouse leaves
    item.classList.remove('active');
  }
};
