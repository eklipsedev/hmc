import { displayError } from '../utils/formUtils';
import { getElement } from '../utils/helpers';
import { handleReverseGeocodingLocation } from './handleGeocodingLocations';
import { searchElement } from './utils/constants';

export const handleLocationTracker = () => {
  const useCurrentLocationBtn = getElement('use-current-location');
  const targetIcon = getElement('target');
  const loaderIcon = getElement('loader');
  const successIcon = getElement('success');

  if (!useCurrentLocationBtn) return;

  let isLoading = false;

  useCurrentLocationBtn.addEventListener('click', () => {
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;

        try {
          if (!isLoading) {
            targetIcon.style.display = 'none';
            loaderIcon.style.display = 'flex';
            successIcon.style.display = 'none';
            isLoading = true;
          }

          const data = await handleReverseGeocodingLocation(lng, lat);
          if (!data) return;

          setTimeout(() => {
            targetIcon.style.display = 'none';
            loaderIcon.style.display = 'none';
            successIcon.style.display = 'flex';
            isLoading = false;

            const { context } = data.features[0];
            let city = '';
            let postalCode = '';

            context.forEach((contextItem) => {
              if (contextItem.id.includes('place')) {
                city = contextItem.text;
              }
              if (contextItem.id.includes('postcode')) {
                postalCode = contextItem.text;
              }
            });

            searchElement.value = postalCode;
            searchElement.title = postalCode;
            useCurrentLocationBtn.querySelector('span').textContent = city;
          }, 400);
        } catch (error) {
          targetIcon.style.display = 'flex';
          loaderIcon.style.display = 'none';
          successIcon.style.display = 'none';
          isLoading = false;
          displayError('Could not get current location');
        }
      },
      (error) => {
        displayError(error.message);
      }
    );
  });
};
