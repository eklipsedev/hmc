import { getElement } from '../../utils/helpers';

// transform filter items into a GeoJSON object
export const setLocationsAsGeoJSON = (items) => {
  let locationsData = {};
  locationsData.type = 'FeatureCollection';
  locationsData.features = [];

  items.forEach((item, index) => {
    const { element } = item;
    const longitude = Number(element.getAttribute('data-lng'));
    const latitude = Number(element.getAttribute('data-lat'));
    const name = getElement('name', element).textContent;
    const slug = element.querySelector('a').href;
    const street = getElement('street', element).textContent;
    const city = getElement('city', element).textContent;
    const state = getElement('state', element).textContent;
    const zipCode = getElement('zip-code', element).textContent;
    const phoneText = getElement('phone', element).textContent;
    const phoneNumber = getElement('phone', element).href;
    const verified = getElement('verified', element).textContent === 'true' ? true : false;

    const data = {
      type: 'Feature',
      id: index,
      properties: {
        radius: 0,
        name,
        slug,
        street,
        city,
        state,
        zipCode,
        phoneText,
        phoneNumber,
        verified,
      },
      geometry: {
        type: 'Point',
        coordinates: [longitude, latitude],
      },
    };
    locationsData.features.push(data);
  });

  return locationsData;
};
