import { displayError } from '../../utils/formUtils';
import { setBounds } from '../actions/setBounds';
import { setRadius } from '../actions/setRadius';
import { setCursor } from '../components/cursor';
import { addDistanceLayers } from '../components/layers/radiusLayers';
import { map } from '../components/map';
import { setLocationsAsGeoJSON } from '../data/setLocationsGeoJSON';
import { handleReverseGeocodingLocation } from '../handleGeocodingLocations';
import {
  getCenterCoordinates,
  getFilterInstance,
  getLocationsData,
  getRadiusCircleData,
  radiusElement,
  searchElement,
  setCenterCoordinates,
  setLocationsData,
} from '../utils/constants';

export const handleMouseUpForCenterPoint = async (e) => {
  try {
    map.getCanvas().classList.remove('is-dragging-center');
    map.dragPan.enable();
    setCursor('grab');

    const { lat } = e.lngLat;
    const { lng } = e.lngLat;

    setCenterCoordinates([lng, lat]);

    //const locationsData = setLocationsAsGeoJSON(getFilterInstance()?.listInstance?.items);
    const locationsData = getFilterInstance()?.listInstance?.items
      ? setLocationsAsGeoJSON(getFilterInstance().listInstance.items)
      : null;
    setLocationsData(locationsData);

    const data = await handleReverseGeocodingLocation();

    searchElement.value = data.features[0].place_name;
    searchElement.title = data.features[0].place_name;

    addDistanceLayers(getCenterCoordinates());
    setBounds(getRadiusCircleData());
    setRadius(getLocationsData());

    const filter = getFilterInstance();

    if (
      filter?.filtersData?.[0] &&
      radiusElement?.value // optional: add more validation here if needed
    ) {
      filter.filtersData[0].values = new Set(['0', radiusElement.value]);
    }

    filter?.applyFilters();
  } catch (error) {
    displayError(error.message);
  }
};
