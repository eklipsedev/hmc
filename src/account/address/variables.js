export const addressForm = document.querySelector("[data-address-form='true']") || null;

export const MAPBOX_SEARCH_TOKEN =
  'pk.eyJ1IjoiZWtsaXBzZS1kZXYiLCJhIjoiY2w2d2R5ODF4MmRnMzNlbno3Z2hweHRpdyJ9.m1Q43efWexhp8FjdbTuh0A';
export const STATE_COUNTY_API_ENDPOINT =
  'https://state-county-manager-worker.josh-8e8.workers.dev/';

// Address state encapsulation
export const addressState = {
  fullAddress: '',
  fullState: '',
  country: '',
  county: '',
  lat: '',
  lng: '',
};

let autofillCollection;

export const theme = {
  variables: {
    fontFamily: 'Roboto, sans-serif',
    unit: '0.875rem',
    padding: '0.5rem',
    borderRadius: '0',
    boxShadow: 'none',
    colorPrimary: '#000',
    colorSecondary: '#000',
    colorText: '#000',
    colorBackground: '#fff',
    border: '1px solid #e0e2e6',
    duration: '200ms',
    curve: 'ease',
    paddingModal: '2.5rem',
    colorBackdrop: '#000000d9',
    minWidth: '26rem',
  },
};

export const icons = {
  addressMarker: `
      <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" width="16px" height="16px" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24"><path fill="currentColor" d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7m0 9.5a2.5 2.5 0 0 1 0-5a2.5 2.5 0 0 1 0 5"></path></svg>
      `,
};

export const getAutofillCollection = () => autofillCollection;
// eslint-disable-next-line no-return-assign
export const setAutofillCollection = (value) => (autofillCollection = value);
