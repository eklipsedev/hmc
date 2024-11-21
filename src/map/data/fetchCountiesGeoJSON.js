import { displayError } from '../../utils/formUtils';
import { setCountyData } from '../utils/constants';

export const fetchCountiesGeoJSON = async () => {
  const url =
    'https://gist.githubusercontent.com/sdwfrost/d1c73f91dd9d175998ed166eb216994a/raw/e89c35f308cee7e2e5a784e1d3afc5d449e9e4bb/counties.geojson';

  try {
    const response = await fetch(url);

    if (!response.ok) {
      displayError('Could not fetch counties data');
    }

    const data = await response.json();
    setCountyData(data);
  } catch (error) {
    displayError('Error fetching county data:', error.message);
  }
};
