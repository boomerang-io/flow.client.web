export default [
  {
    properties: [],
    description: "",
    flowTeamId: "5eb2c4085a92d80001a16d82",
    icon: "flow",
    id: "5eb2c4085a92d80001a16d87",
    name: "A system Workflow",
    shortDescription: "a place to run system level tasks",
    status: "active",
    triggers: {
      scheduler: { enable: false, schedule: "", timezone: "", advancedCron: false },
      webhook: { enable: false, token: "" },
      event: { enable: false, topic: "" },
    },
    tokens: [],
    enablePersistentStorage: true,
    enableACCIntegration: false,
    revisionCount: 2,
    templateUpgradesAvailable: false,
    scope: "system",
  },
];
