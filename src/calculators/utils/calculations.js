import { displayError } from '../../utils/formUtils';
import { setPieceCount } from '../rebarCalculator/constants';
import {
  getEffectiveLength,
  getEffectiveWidth,
  setEffectiveLength,
  setEffectiveWidth,
} from '../rebarCalculator/constants';
import { calculatorList } from './constants';
import { getValueOfInput } from './helpers';
import { shapes } from './template';

// Helper to calculate subtotals
const calculateSubtotals = (type) => {
  shapes[type].subtotals = shapes[type].totals.reduce((acc, value) => acc + value, 0);
};

// Shape-specific calculation functions
const calculateSlab = (calculator) => {
  const depth = getValueOfInput(calculator, 'depth');
  const length = getValueOfInput(calculator, 'length');
  const width = getValueOfInput(calculator, 'width');
  const quantity = getValueOfInput(calculator, 'quantity');
  return length * width * depth * quantity;
};

const calculateTriangle = (calculator) => {
  const depth = getValueOfInput(calculator, 'depth');
  const length = getValueOfInput(calculator, 'length');
  const width = getValueOfInput(calculator, 'width');
  const quantity = getValueOfInput(calculator, 'quantity');
  return ((length * width * depth) / 2) * quantity;
};

const calculateColumn = (calculator) => {
  const diameter = getValueOfInput(calculator, 'diameter');
  const height = getValueOfInput(calculator, 'height');
  const quantity = getValueOfInput(calculator, 'quantity');
  return (Math.PI * Math.pow(diameter, 2) * height * quantity) / 4;
};

const calculateCurbGutter = (calculator) => {
  const length = getValueOfInput(calculator, 'length');
  const curbDepth = getValueOfInput(calculator, 'curbDepth');
  const curbHeight = getValueOfInput(calculator, 'curbHeight');
  const flagThickness = getValueOfInput(calculator, 'flagThickness');
  const gutterWidth = getValueOfInput(calculator, 'gutterWidth');
  const quantity = getValueOfInput(calculator, 'quantity');
  return (
    quantity *
    (length * curbDepth * curbHeight + length * flagThickness * (gutterWidth + curbDepth))
  );
};

const calculateStairs = (calculator) => {
  const rise = getValueOfInput(calculator, 'rise');
  const run = getValueOfInput(calculator, 'run');
  const platformDepth = getValueOfInput(calculator, 'platformDepth');
  const width = getValueOfInput(calculator, 'width');
  const stepCount = getValueOfInput(calculator, 'stepCount');
  const quantity = getValueOfInput(calculator, 'quantity');

  let formula = 0;
  for (let steps = 0; steps < stepCount; steps++) {
    formula +=
      steps === stepCount - 1
        ? width * rise * (steps + 1) * platformDepth * quantity
        : width * rise * (steps + 1) * run * quantity;
  }
  return formula;
};

const calculateTube = (calculator) => {
  const innerDiameter = getValueOfInput(calculator, 'innerDiameter');
  const outerDiameter = getValueOfInput(calculator, 'outerDiameter');
  const height = getValueOfInput(calculator, 'height');
  const quantity = getValueOfInput(calculator, 'quantity');

  if (outerDiameter < innerDiameter) {
    displayError('The outer diameter must be bigger than the inner diameter');
    return 0;
  }
  return (height * Math.PI * (outerDiameter ** 2 - innerDiameter ** 2) * quantity) / 4;
};

const calculateRebar = (calculator) => {
  const length = getValueOfInput(calculator, 'length');
  const width = getValueOfInput(calculator, 'width');
  const edgeClearance = getValueOfInput(calculator, 'edgeClearance');
  const spacing = getValueOfInput(calculator, 'spacing');
  const rebarLength = getValueOfInput(calculator, 'rebarLength');

  // Calculate effective dimensions
  setEffectiveLength(length - 2 * edgeClearance);
  setEffectiveWidth(width - 2 * edgeClearance);

  // Calculate the number of rebars required
  const numRebarsLengthwise =
    spacing === 0 || getEffectiveLength() === 0
      ? 0 // If either value is zero, set the number of rebars to zero
      : Math.ceil(getEffectiveLength() / spacing);
  const numRebarsWidthwise =
    spacing === 0 || getEffectiveWidth() === 0
      ? 0 // If either value is zero, set the number of rebars to zero
      : Math.ceil(getEffectiveWidth() / spacing);

  // Calculate total length of rebars required
  const totalRebarLength =
    numRebarsLengthwise * getEffectiveWidth() + numRebarsWidthwise * getEffectiveLength();

  // Set the piece count
  setPieceCount(totalRebarLength / rebarLength);

  return totalRebarLength;
};

// Unified calculation function
export const calculateTemplate = (type) => {
  const calculators = calculatorList.querySelectorAll(`[data-calculator="${type}"]`);
  shapes[type].totals = [];
  shapes[type].subtotals = 0;

  if (calculators.length) {
    calculators.forEach((calculator, index) => {
      let formula = 0;

      switch (type) {
        case shapes.slab.type:
          formula = calculateSlab(calculator);
          break;
        case shapes.triangle.type:
          formula = calculateTriangle(calculator);
          break;
        case shapes.column.type:
          formula = calculateColumn(calculator);
          break;
        case shapes.curbGutter.type:
          formula = calculateCurbGutter(calculator);
          break;
        case shapes.stairs.type:
          formula = calculateStairs(calculator);
          break;
        case shapes.tube.type:
          formula = calculateTube(calculator);
          break;
        case shapes.rebar.type:
          formula = calculateRebar(calculator);
          break;
        default:
          displayError('Unknown calculator type');
          return;
      }

      shapes[type].totals[index] = formula;
    });

    calculateSubtotals(type);
  } else {
    shapes[type].subtotals = 0;
    //calculateSubtotals(type);
  }
};
