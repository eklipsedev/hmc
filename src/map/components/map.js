import mapboxgl from 'mapbox-gl';

import { accessToken, mapElement } from '../utils/constants';

mapboxgl.accessToken = accessToken;

export let map;

if (mapElement) {
  map = new mapboxgl.Map({
    container: mapElement,
    style: 'mapbox://styles/eklipse-dev/cldv1jkb5000401om6rkthhyo/draft',
    zoom: 10,
    projection: 'mercator',
    scrollZoom: false,
    center: [-75.61961, 40.24237],
  });
}
