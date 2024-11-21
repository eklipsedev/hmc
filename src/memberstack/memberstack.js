export const memberstack = window.$memberstackDom;

export let member = null;
export let memberId = null;
export let memberCustomFields = null;
export let memberPlans = null;
export let memberIsPremium = null;

export const initializeMember = async () => {
  if (memberstack) {
    try {
      member = await memberstack.getCurrentMember();
      memberId = member?.data?.id || null;
      memberCustomFields = member?.data?.customFields || null;
      memberPlans = member?.data?.planConnections || null;
      memberIsPremium = memberPlans && memberPlans.length;
    } catch (error) {
      console.error('Error fetching member data:', error);
    }
  }
};
