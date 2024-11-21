/* eslint-disable no-return-assign */
import { getElement } from '../../utils/helpers';

export const costToggle = document.querySelector('[data-setting="costType"]') || null;
export const bagSize = document.querySelector('[data-setting="bagSize"]') || null;
export const costPerBag = document.querySelector('[data-setting="costPerBag"]') || null;
export const wastePercentage = document.querySelector('[data-setting="wastePercentage"]') || null;

export const totalConcrete = getElement('total-concrete') || null;
export const totalBags = getElement('total-bags') || null;
export const truckDisclaimer = getElement('truck-disclaimer') || null;
export const totalCost = getElement('total-cost') || null;

export let wastePercentageAmount = 1;
export let volumeYards = 0;
export let volumeFeet = 0;
export let volumeMeters = 0;

export let kgs = 0;
export let lbs = 0;

export const getWastePercentageAmount = () => wastePercentageAmount;
export const setWastePercentageAmount = (value) => (wastePercentageAmount = value);

export const getVolumeYards = () => volumeYards;
export const setVolumeYards = (value) => (volumeYards = value);

export const getVolumeFeet = () => volumeFeet;
export const setVolumeFeet = (value) => (volumeFeet = value);

export const getVolumeMeters = () => volumeMeters;
export const setVolumeMeters = (value) => (volumeMeters = value);

export const getKgs = () => kgs;
export const setKgs = (value) => (kgs = value);

export const getLbs = () => lbs;
export const setLbs = (value) => (lbs = value);
