import { handleAccount } from './account';
//import { initializeForms } from './account/constants';
import { handleCompanyNameToSlug } from './account/helpers';
import { handleConcreteCalculator } from './calculators/concreteCalculator';
import { handleRebarCalculator } from './calculators/rebarCalculator';
import { handleContractorForm } from './contractorForm';
import { handleMap } from './map';
import { handleContractorSearch } from './map/handleContractorSearch';
import { handleLocationTracker } from './map/locationTracker';
import { initializeMember } from './memberstack/memberstack';
import { handleStateMap } from './stateMap';
import { handleQuillEditor } from './textEditor';
import { handlePhoneValidation, handleTogglePassword } from './utils/formUtils';

document.addEventListener('DOMContentLoaded', async () => {
  //initializeForms();
  await initializeMember();
  handleAccount();

  handleCompanyNameToSlug();
  handleMap();
  handleContractorSearch();
  handleLocationTracker();
  handleTogglePassword();
  handleConcreteCalculator();
  handleRebarCalculator();
  handleQuillEditor();
  handleStateMap();

  handlePhoneValidation();
  handleContractorForm();
});
