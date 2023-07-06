const featureFlag = {
  features: {
    activity: true,
    "enable.verified.tasks.edit": false,
    "global.parameters": true,
    insights: true,
    "team.management": true,
    "team.parameters": true,
    "team.tasks": true,
    "user.management": true,
    "workflow.quotas": true,
    "workflow.tokens": true,
    "workflow.triggers": true,
  },
  quotas: {
    maxActivityStorageSize: "50",
    maxWorkflowStorageSize: "10",
  },
};

export default featureFlag;
