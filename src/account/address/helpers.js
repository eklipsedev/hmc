import { getMemberCustomFields } from '../../memberstack/memberstack';
import { disableSubmitButton, enableSubmitButton } from '../helpers';
import {
  addressState,
  getAutofillCollection,
  icons,
  MAPBOX_SEARCH_TOKEN,
  setAutofillCollection,
  STATE_COUNTY_API_ENDPOINT,
  theme,
} from './variables';

// Handle form submission (create or update)
export const setAddressFromMapbox = async (form) => {
  mapboxsearch.config.accessToken = MAPBOX_SEARCH_TOKEN;
  setAutofillCollection(mapboxsearch.autofill({ theme, icons }));

  getAutofillCollection().addEventListener('retrieve', (e) => handleRetrieveEvent(form, e));
};

const handleRetrieveEvent = async (form, e) => {
  const data = e.detail.features[0];
  const [lng, lat] = data.geometry.coordinates;

  Object.assign(addressState, {
    'full-address': data.properties.full_address,
    'state-full': data.properties.region,
    country: data.properties.country,
    county: data.properties.district,
    lat,
    lng,
  });

  updateHiddenAddressInputs(form);
  enableSubmitButton();
};

// Validate the address and fetch state/county information
export const validateAddress = async (form) => {
  try {
    mapboxsearch.config.accessToken = MAPBOX_SEARCH_TOKEN;
    const result = await mapboxsearch.confirmAddress(form.formElement, { theme });

    const memberCounty = getMemberCustomFields().county;
    const memberState = getMemberCustomFields()['state-full'];

    if (result.type === 'nochange' || result.type === 'change') {
      getAutofillCollection().addEventListener('retrieve', (e) => handleRetrieveEvent(form, e));

      const refetchData =
        memberCounty !== addressState.county || memberState !== addressState.state;

      // only fetch county item ID from Webflow if it changed
      if (refetchData) {
        const data = await fetchCountyFromWebflow();

        if (data) {
          return {
            status: true,
            data: {
              ...addressState,
              'state-id': data.countyItem.fieldData.state,
              'county-id': data.countyItem.id,
            },
          };
        }

        return { status: false };
      }
      // Didn't fetch from API, just return same form data

      return {
        status: true,
        data: {
          ...addressState,
          'state-id': formData['state-id'],
          'county-id': formData['county-id'],
        },
      };
    }

    disableSubmitButton();

    //return { status: false };
  } catch (error) {
    console.error('Error validating address:', error);
    return { status: false };
  }
};

// Fetch county information from the API
// The state ID will be found in the county response object
const fetchCountyFromWebflow = async () => {
  try {
    const response = await fetch(STATE_COUNTY_API_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ state: addressState['state-full'], county: addressState.county }),
    });

    if (!response.ok) throw new Error(response.status);
    return await response.json();
  } catch (error) {
    console.error('Error fetching state and county:', error.message);
    return null;
  }
};

// Update hidden address inputs
const updateHiddenAddressInputs = (form) => {
  const {
    ['full-address']: fullAddress,
    ['state-full']: fullState,
    country,
    county,
    lat,
    lng,
  } = addressState;

  setInputValue(form['full-address'], fullAddress);
  setInputValue(form['full-state'], fullState);
  setInputValue(form.country, country);
  setInputValue(form.county, county);
  setInputValue(form.lat, lat);
  setInputValue(form.lng, lng);
};

// Utility to set input values and trigger change events
const setInputValue = (input, value) => {
  input.value = value;
  input.dispatchEvent(new Event('change'));
};
