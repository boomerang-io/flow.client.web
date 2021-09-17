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
  storage: {
    workflow: {
      enabled: false,
      size: 1,
      mountPath: "",
    },
    activity: {
      enabled: false,
      size: 1,
      mountPath: "",
    },
  },
  enableIAMIntegration: false,
  properties: [],
  revisionCount: 0,
};
