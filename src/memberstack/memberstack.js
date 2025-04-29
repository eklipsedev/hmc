// memberstack.js

export const memberstack = window.$memberstackDom;

let member = null;
let memberId = null;
let memberCustomFields = null;
let memberPlans = null;
let memberIsPremium = null;

export const initializeMember = async () => {
  if (memberstack) {
    try {
      member = await memberstack.getCurrentMember();
      memberId = member?.data?.id || null;
      memberCustomFields = member?.data?.customFields || null;
      memberPlans = member?.data?.planConnections || [];
      memberIsPremium = memberPlans.some((plan) => plan.type === 'SUBSCRIPTION');
    } catch (error) {
      console.error('Error fetching member data:', error);
    }
  }
};

// 🛑 DON'T export `member` directly!
// ✅ INSTEAD: export "getter" functions:
export const getMember = () => member;
export const getMemberCustomFields = () => memberCustomFields;
export const getMemberId = () => memberId;
export const getMemberPlans = () => memberPlans;
export const getMemberIsPremium = () => memberIsPremium;
