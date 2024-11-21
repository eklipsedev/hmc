// streamline attribute selection if ever changed
export const getElement = (attributeName, parentElement = document) => {
  return parentElement.querySelector(`[data-element="${attributeName}"]`);
};
