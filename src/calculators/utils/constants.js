/* eslint-disable no-return-assign */
import { getElement } from '../../utils/helpers';
import { costToggle } from '../concreteCalculator/constants';
import { isImperialCountry } from './helpers';

export const form = getElement('calculator-form') || null;
export const calculatorList = getElement('calculator-list') || null;
export const results = getElement('results') || null;
export const empty = getElement('empty') || null;

export const unitToggle = document.querySelector('[data-setting="unitType"]') || null;

export const { body } = document;

export const calculator =
  {
    type: body.getAttribute('data-calculator') || null,
    length: body.getAttribute('data-length') || null,
    width: body.getAttribute('data-width') || null,
  } || null;

export let imperialCountry = true;

// what unit is this in?
export let total = 0;

export let settings = {};
export let calcType = 'calculator';

// Settings
export const settingsTemplate = () => ({
  unitType: isImperialCountry() ? 'imperial' : 'metric',
  costType: costToggle && costToggle.checked ? 'cost-per-area' : 'cost-per-bag',
  bagSize: isImperialCountry() ? '80' : '50',
  costPerBag: costToggle && costToggle.checked ? '170.00' : '6.00',
  wastePercentage: '0',
});

export const getTotal = () => total;
export const setTotal = (value) => (total = value);

export const getSettings = () => settings;
export const setSettings = (newSettings) => {
  settings = { ...settings, ...newSettings };
};

export const getCalcType = () => calcType;
export const setCalcType = (value) => (calcType = value);
