import { map } from './map';

export const setCursor = (style) => {
  if (map && map.getCanvas()) {
    map.getCanvas().style.cursor = style;
  }
};
