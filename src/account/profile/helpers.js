import { getMemberCustomFields } from '../../memberstack/memberstack';
import { getElement } from '../../utils/helpers';

export const setLiveLink = () => {
  const link = getElement('live-link');

  if (link && getMemberCustomFields().slug) {
    link.href = `/contractors/${getMemberCustomFields().slug}`;
  }
};
