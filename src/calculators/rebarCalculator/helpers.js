import { calculateTemplate } from '../utils/calculations';
import { getSettings, getTotal, setTotal } from '../utils/constants';
import { convertFeetToMeters, isZero } from '../utils/helpers';
import { shapes } from '../utils/template';
import {
  getEffectiveLength,
  getEffectiveWidth,
  getLengthFeet,
  getLengthMeters,
  getPieceCount,
  gridLength,
  gridWidth,
  setLengthFeet,
  setLengthMeters,
  totalRebarLength,
} from './constants';

export const calculateRebarTotal = () => {
  calculateTemplate(shapes.rebar.type);

  setTotal(shapes.rebar.subtotals);

  if (getSettings().unitType === 'imperial') {
    // imperial units
    setLengthFeet(getTotal() / 12);
    totalRebarLength.textContent = isZero(getLengthFeet());
    gridLength.textContent = isZero(getEffectiveLength() / 12);
    gridWidth.textContent = isZero(getEffectiveWidth() / 12);
  } else {
    // metric units
    setLengthMeters(getTotal() / 39.37);
    totalRebarLength.textContent = isZero(getLengthMeters());
    gridLength.textContent = isZero(convertFeetToMeters(getEffectiveLength() / 12));
    gridWidth.textContent = isZero(convertFeetToMeters(getEffectiveWidth() / 12));
  }

  totalRebarPieces.textContent = isZero(getPieceCount());
};
