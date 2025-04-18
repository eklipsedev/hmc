/* eslint-disable no-return-assign */
import { getElement } from '../../utils/helpers';

export const accessToken =
  'pk.eyJ1IjoiZWtsaXBzZS1kZXYiLCJhIjoiY2w2d2R5ODF4MmRnMzNlbno3Z2hweHRpdyJ9.m1Q43efWexhp8FjdbTuh0A';

export let currentCoordinates = [];

export const mapElement = getElement('map');
export const listElement = getElement('list');
export let searchElement = getElement('search');
export let radiusElement = getElement('radius');
export let sortElement = getElement('distance-sort');
export const searchResultsListElement = getElement('search-results-list');

let timer;
let filterInstance;

let centerCoordinates; // []
let currentBearing; // bearing of drag point
let currentBounds;

let locationsData = {};
let radiusCircleData;
let stateData;
let countyData;

let initialPointCoordinates;
let initialRadiusCircleCoordinates;
let initialDragCoordinates;
let circleLayer;

let activeFeatureId = null;

export const getInitialPointCoordinates = () => initialPointCoordinates;
export const setInitialPointCoordinates = (value) => (initialPointCoordinates = value);

export const getInitialDragCoordinates = () => initialDragCoordinates;
export const setInitialDragCoordinates = (value) => (initialDragCoordinates = value);

export const getInitialRadiusCircleCoordinates = () => initialRadiusCircleCoordinates;
export const setInitialRadiusCircleCoordinates = (value) =>
  (initialRadiusCircleCoordinates = value);

export const getCircleLayer = () => circleLayer;
export const setCircleLayer = (value) => (circleLayer = value);

export const getTimer = () => timer;
export const setTimer = (value) => (timer = value);

export const getFilterInstance = () => filterInstance || null;
export const setFilterInstance = (value) => (filterInstance = value);

export const getCenterCoordinates = () => centerCoordinates;
export const setCenterCoordinates = (value) => (centerCoordinates = value);

export const getCurrentBearing = () => currentBearing;
export const setCurrentBearing = (value) => (currentBearing = value);

export const getCurrentBounds = () => currentBounds;
export const setCurrentBounds = (value) => (currentBounds = value);

export const getLocationsData = () => locationsData;
export const setLocationsData = (value) => (locationsData = value);

export const getRadiusCircleData = () => radiusCircleData;
export const setRadiusCircleData = (value) => (radiusCircleData = value);

export const getStateData = () => stateData;
export const setStateData = (value) => (stateData = value);

export const getCountyData = () => countyData;
export const setCountyData = (value) => (countyData = value);

export const getActiveFeatureId = () => activeFeatureId;
export const setActiveFeatureId = (value) => (activeFeatureId = value);
