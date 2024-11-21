import { memberCustomFields } from '../../memberstack/memberstack';
import { getElement } from '../../utils/helpers';

export const setLiveLink = () => {
  const link = getElement('live-link');

  if (link && memberCustomFields.slug) {
    link.href = `/contractors/${memberCustomFields.slug}`;
  }
};
