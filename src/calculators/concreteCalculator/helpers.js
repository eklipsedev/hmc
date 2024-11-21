import { calculateTemplate } from '../utils/calculations';
import { body, calculatorList, getSettings, getTotal, setTotal } from '../utils/constants';
import { setToTwoDecimals } from '../utils/helpers';
import { shapes } from '../utils/template';
import {
  bagSize,
  costPerBag,
  getKgs,
  getLbs,
  getVolumeFeet,
  getVolumeMeters,
  getVolumeYards,
  setKgs,
  setLbs,
  setVolumeFeet,
  setVolumeMeters,
  setVolumeYards,
  totalBags,
  totalConcrete,
  totalCost,
  truckDisclaimer,
} from './constants';

export const calculateTotal = () => {
  calculateTemplate(shapes.slab.type);
  calculateTemplate(shapes.triangle.type);
  calculateTemplate(shapes.column.type);
  calculateTemplate(shapes.curbGutter.type);
  calculateTemplate(shapes.stairs.type);
  calculateTemplate(shapes.tube.type);

  setTotal(
    shapes.slab.subtotals +
      shapes.triangle.subtotals +
      shapes.column.subtotals +
      shapes.curbGutter.subtotals +
      shapes.stairs.subtotals +
      shapes.tube.subtotals
  );

  // run calculation based on unit type
  const wastePercentageAmount = wastePercentage.value / 100 + 1;
  const isZero = (unitType) => {
    return setToTwoDecimals(unitType) > 0 ? setToTwoDecimals(unitType) : '—';
  };

  if (getSettings().unitType === 'imperial') {
    // imperial units
    setVolumeYards((getTotal() / 46660) * wastePercentageAmount);
    setVolumeFeet((getTotal() / 1728) * wastePercentageAmount);
    setLbs((getVolumeFeet() * 133) / bagSize.value);

    totalConcrete.textContent = isZero(getVolumeYards());

    if (isZero(getVolumeYards()) > 1) {
      truckDisclaimer.textContent =
        'Since the amount is over 1 yard, you may want to consider having a truck deliver your concrete.';
      truckDisclaimer.style.display = 'block';
    } else {
      truckDisclaimer.style.display = 'none';
    }

    totalBags.textContent = isZero(getLbs());
  } else {
    // metric units
    setVolumeMeters((getTotal() / 61020) * wastePercentageAmount);
    setKgs((getVolumeMeters() * 2130) / bagSize.value);

    totalConcrete.textContent = isZero(getVolumeMeters());

    if (isZero(getVolumeMeters()) > 1) {
      truckDisclaimer.textContent =
        'Since the amount is over 1 meter, you may want to consider having a truck deliver your concrete.';
      truckDisclaimer.style.display = 'block';
    } else {
      truckDisclaimer.style.display = 'none';
    }

    totalBags.textContent = isZero(getKgs());
  }

  // set total cost
  if (calculatorList.children.length && costPerBag.value !== '') {
    const isBags = body.classList.contains('is-cost-per-bag') ? totalBags : totalConcrete;

    totalCost.textContent = isZero(
      setToTwoDecimals(isBags.textContent) * setToTwoDecimals(costPerBag.value)
    );
  } else {
    totalCost.textContent = '—';
  }
};
