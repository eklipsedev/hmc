import { getFilterInstance, setActiveFeatureId } from '../utils/constants';
import { toggleFeatureHoverState } from './toggleFeatureHoverState';

// Highlight a marker when the corresponding card is hovered
export const toggleHighlightMarkerOnCardHover = () => {
  if (!getFilterInstance()?.listInstance?.items) return;

  const { items } = getFilterInstance().listInstance;

  // Make sure that each item has an associated feature ID or index
  items.forEach((item, index) => {
    item.element.addEventListener('mouseenter', () => {
      // Set hover state for the corresponding feature
      setActiveFeatureId(index);
      toggleFeatureHoverState(true);
    });

    item.element.addEventListener('mouseleave', () => {
      // Remove hover state for the corresponding feature
      toggleFeatureHoverState(false);
    });
  });
};
