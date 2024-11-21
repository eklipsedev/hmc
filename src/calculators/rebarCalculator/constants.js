/* eslint-disable no-return-assign */
import { getElement } from '../../utils/helpers';

export const gridLength = getElement('grid-length') || null;
export const gridWidth = getElement('grid-width') || null;
export const totalRebarLength = getElement('total-rebar-length') || null;
export const totalRebarPieces = getElement('total-rebar-pieces') || null;

export let lengthFeet = 0;
export let lengthMeters = 0;
export let pieceCount = 0;
export let effectiveLength = 0;
export let effectiveWidth = 0;

export const getLengthFeet = () => lengthFeet;
export const setLengthFeet = (value) => (lengthFeet = value);

export const getLengthMeters = () => lengthMeters;
export const setLengthMeters = (value) => (lengthMeters = value);

export const getPieceCount = () => pieceCount;
export const setPieceCount = (value) => (pieceCount = value);

export const getEffectiveLength = () => effectiveLength;
export const setEffectiveLength = (value) => (effectiveLength = value);

export const getEffectiveWidth = () => effectiveWidth;
export const setEffectiveWidth = (value) => (effectiveWidth = value);
