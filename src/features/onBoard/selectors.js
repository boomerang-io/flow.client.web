/*eslint-disable no-unused-vars*/
export const formatUpdateUserDataForOnboarding = userData => {
  //remove tools
  const { tools, teams, projects, ...updateData } = userData;
  isFirstVisit = false;
  return updateData;
};

const selectors = {
  formatUpdateUserDataForOnboarding
};

export default selectors;
