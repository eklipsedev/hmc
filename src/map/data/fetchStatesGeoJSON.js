import { displayError } from '../../utils/formUtils';
import { setStateData } from '../utils/constants';

export const fetchStatesGeoJSON = async () => {
  const url =
    'https://raw.githubusercontent.com/PublicaMundi/MappingAPI/refs/heads/master/data/geojson/us-states.json';

  try {
    const response = await fetch(url);

    if (!response.ok) {
      displayError('Could not fetch states data');
    }

    const data = await response.json();
    setStateData(data);
  } catch (error) {
    displayError(`Error fetching states data: ${error.message}`);
  }
};
