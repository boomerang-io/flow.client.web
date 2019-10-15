export const defaultWorkflowConfig = {
  triggers: {
    scheduler: {
      enable: false,
      schedule: "",
      timezone: ""
    },
    webhook: {
      enable: false,
      token: ""
    },
    event: {
      enable: false,
      topic: ""
    }
  },
  enablePersistentStorage: false,
  enableIAMIntegration: false,
  properties: []
};
