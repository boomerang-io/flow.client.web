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
    workspace: {
      enabled: false,
      size: 1,
      mountPath: "",
    },
    workflow: {
      enabled: false,
      size: 1,
      mountPath: "",
    },
  },
  enableIAMIntegration: false,
  properties: [],
  revisionCount: 0,
};
