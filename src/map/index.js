import { getElement } from '../utils/helpers';
import { setBounds } from './actions/setBounds';
import { getURLParams, setLocationAsQueryParams } from './actions/setLocationParams';
import { setRadius } from './actions/setRadius';
import { setCursor } from './components/cursor';
import { addLocationsLayer } from './components/layers/locationsLayer';
import { addDistanceLayers } from './components/layers/radiusLayers';
import { map } from './components/map';
import { handlePopup } from './components/popup';
import { fetchCountiesGeoJSON } from './data/fetchCountiesGeoJSON';
import { fetchStatesGeoJSON } from './data/fetchStatesGeoJSON';
import { setLocationsAsGeoJSON } from './data/setLocationsGeoJSON';
import { handleLocationsClick } from './events/events';
import { handleLocationsMouseEnter } from './events/events';
import { handleLocationsMouseLeave } from './events/events';
import {
  onSearchElementFocus,
  onSearchElementFocusOut,
  onSearchElementKeyUp,
} from './events/handleSearchFocus';
import { toggleHighlightMarkerOnCardHover } from './events/highlightMarkerOnCardHover';
import { handleRecenter, handleZoomIn, handleZoomOut } from './events/mapControls';
import { handleMouseDownForCenterPoint } from './events/mouseDownForCenterPoint';
import { handleMouseMoveForCenterPoint } from './events/mouseMoveForCenterPoint';
import { handleMouseUpForCenterPoint } from './events/mouseUpForCenterPoint';
import { handleReverseGeocodingLocation } from './handleGeocodingLocations';
import {
  formElement,
  getCenterCoordinates,
  getCountyData,
  getFilterInstance,
  getLocationsData,
  getRadiusCircleData,
  getStateData,
  getTimer,
  radiusElement,
  searchElement,
  setCenterCoordinates,
  setCurrentBounds,
  setFilterInstance,
  setLocationsData,
} from './utils/constants';

export const handleMap = async () => {
  if (!map) return;

  map.on('load', () => {
    window.fsAttributes = window.fsAttributes || [];
    window.fsAttributes.push([
      'cmsfilter',
      async (filterInstances) => {
        setFilterInstance(filterInstances[0]);

        let longitude;
        let latitude;
        let radius;

        ({ longitude, latitude, radius } = getURLParams());

        const mapType = document.body.getAttribute('data-map');

        if (mapType === 'state') {
          await fetchStatesGeoJSON();

          const selectedState = document.body.getAttribute('data-state');
          const stateGeoJSON = getStateData().features.find(
            (feature) => feature.properties.name === selectedState
          );

          map.addSource('state', {
            type: 'geojson',
            data: stateGeoJSON,
          });

          map.addLayer({
            id: 'state-fill',
            type: 'fill',
            source: 'state',
            paint: {
              'fill-color': '#e0e2e6',
              'fill-opacity': 0.5,
              'fill-outline-color': '#000',
            },
          });
          setCurrentBounds(stateGeoJSON);
          setBounds(stateGeoJSON, false);
        }

        if (mapType === 'county') {
          await fetchCountiesGeoJSON();

          const selectedCounty = document.body.getAttribute('data-id');
          const countyGeoJSON = getCountyData().features.find(
            (feature) => feature.properties.GEOID === selectedCounty
          );

          if (countyGeoJSON) {
            map.addSource('county', {
              type: 'geojson',
              data: countyGeoJSON,
            });

            map.addLayer({
              id: 'county-fill',
              type: 'fill',
              source: 'county',
              paint: {
                'fill-color': '#e0e2e6',
                'fill-opacity': 0.5,
                'fill-outline-color': '#000',
              },
            });
            setCurrentBounds(countyGeoJSON);
            setBounds(countyGeoJSON, false);
          }
        }

        if (mapType === 'city') {
          if (!latitude && !longitude && !radius) {
            latitude = document.body.getAttribute('data-lat');
            longitude = document.body.getAttribute('data-lng');
            radius = 50;
          }
        }

        const locationsData = getFilterInstance()?.listInstance?.items
          ? setLocationsAsGeoJSON(getFilterInstance().listInstance.items)
          : null;
        setLocationsData(locationsData);

        if (longitude && latitude && radius) {
          const data = await handleReverseGeocodingLocation(longitude, latitude);

          searchElement.value = data.features[0].place_name;
          searchElement.title = data.features[0].place_name;

          radiusElement.value = radius;
          getElement('max-radius').value = radius;
          setCenterCoordinates([longitude, latitude]);
          addDistanceLayers(getCenterCoordinates());
          setCurrentBounds(getRadiusCircleData());
          setBounds(getRadiusCircleData());
          setRadius(getLocationsData());

          const filter = getFilterInstance();
          //if (!filter?.filtersData?.[0]) return;

          //filter.filtersData[0].values = new Set(['0', radiusElement.value]);
          if (filter?.filtersData?.[0] && radiusElement.value) {
            filter.filtersData[0].values = new Set(['0', radiusElement.value]);
          }
          //getFilterInstance().filtersData[0].values = new Set(['0', radiusElement.value]);
          filter?.applyFilters();
        }

        toggleHighlightMarkerOnCardHover();
        handlePopup();
        filterInstances?.[0]?.listInstance.renderItems();

        // event listeners
        map.on('click', 'locations', (e) => handleLocationsClick(e));
        map.on('mouseenter', 'locations', (e) => handleLocationsMouseEnter(e));
        map.on('mouseleave', 'locations', (e) => handleLocationsMouseLeave(e));

        map.on('mouseenter', 'point', () => setCursor('grab'));
        map.on('mouseleave', 'point', () => setCursor(''));
        map.on('mousedown', 'point', handleMouseDownForCenterPoint);
        map.on('mouseup', 'point', (e) => handleMouseUpForCenterPoint(e));

        map.on('mousemove', (e) => {
          handleMouseMoveForCenterPoint(e);
        });

        // handle radius change event
        radiusElement.addEventListener('change', () => {
          if (searchElement.value.length) {
            getElement('max-radius').value = radiusElement.value;

            const filter = getFilterInstance();

            if (
              filter?.filtersData?.[0] &&
              radiusElement?.value // optional: add more validation here if needed
            ) {
              filter.filtersData[0].values = new Set(['0', radiusElement.value]);
            }

            // reset locations data so radius can be set for all items
            //const locationsData = setLocationsAsGeoJSON(getFilterInstance().listInstance.items);
            const locationsData = filter?.listInstance?.items
              ? setLocationsAsGeoJSON(filter.listInstance.items)
              : null;
            setLocationsData(locationsData);

            addDistanceLayers(getCenterCoordinates());
            setBounds(getRadiusCircleData());
            setRadius(getLocationsData());
            filter?.applyFilters(); // triggers renderItems
          }
        });

        // handle re-render of list items
        filterInstances?.[0]?.listInstance.on('renderitems', (renderedItems) => {
          // after each render, reset the map markers
          //const locationsData = setLocationsAsGeoJSON(renderedItems);
          const locationsData = renderedItems?.length ? setLocationsAsGeoJSON(renderedItems) : null;
          setLocationsData(locationsData);

          if (map.getLayer('locations')) {
            map.removeLayer('locations');
            map.removeSource('locations');
          }

          addLocationsLayer('locations');

          if (searchElement.value.length) {
            addDistanceLayers(getCenterCoordinates());
            setBounds(getRadiusCircleData());
            setLocationAsQueryParams();
          }
        });
      },
    ]);

    handleZoomIn();
    handleZoomOut();
    handleRecenter();

    document.body.addEventListener('click', () => handlePopup(), true);

    searchElement.addEventListener('focus', onSearchElementFocus);
    searchElement.addEventListener('focusout', onSearchElementFocusOut);
    searchElement.addEventListener('keyup', onSearchElementKeyUp);
    searchElement.addEventListener('keydown', () => {
      clearTimeout(getTimer());
    });
  });

  // prevent form from submitting when users click enter (they keep doing it)
  formElement.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
    }
  });
};
