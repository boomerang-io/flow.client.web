export const defaultWorkflowConfig = {
  triggers: {
    scheduler: {
      enable: false,
      schedule: "",
      timezone: "",
      advancedCron: false,
    },
    webhook: {
      enable: false,
      token: "",
    },
    event: {
      enable: false,
      topic: "",
    },
  },
  enableACCIntegration: false,
  enablePersistentStorage: false,
  enableIAMIntegration: false,
  properties: [],
  revisionCount: 0,
};
