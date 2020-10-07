export default [
  {
    properties: [
      {
        required: true,
        placeholder: null,
        language: null,
        disabled: null,
        defaultValue: "",
        value: null,
        values: null,
        readOnly: false,
        description: "Tenant ID from the platform.",
        key: "tenant.name",
        label: "Tenant ID",
        type: "text",
        minValueLength: null,
        maxValueLength: null,
        options: null,
        helperText: null,
      },
      {
        required: true,
        placeholder: null,
        language: null,
        disabled: null,
        defaultValue: "iulian.corcoja@ro.ibm.com",
        value: null,
        values: null,
        readOnly: false,
        description: "The username used for Artifactory authentication.",
        key: "artifactory.username",
        label: "Artifactory Username",
        type: "text",
        minValueLength: null,
        maxValueLength: null,
        options: null,
        helperText: null,
      },
      {
        required: true,
        placeholder: null,
        language: null,
        disabled: null,
        defaultValue: "AKCp5emG5oc6qQy7jBbCZoZRD9QpApyMLTfZp6EGBmpz1rafd5JPY4v54gT82LwL94gZpbBoo",
        value: null,
        values: null,
        readOnly: false,
        description: "The API key used for Artifactory authentication",
        key: "artifactory.api_key",
        label: "Artifactory API Key",
        type: "password",
        minValueLength: null,
        maxValueLength: null,
        options: null,
        helperText: null,
      },
      {
        required: false,
        placeholder: null,
        language: null,
        disabled: null,
        defaultValue: "",
        value: null,
        values: null,
        readOnly: false,
        description: "The host of the database to connect.",
        key: "db.host",
        label: "Database Host",
        type: "text",
        minValueLength: null,
        maxValueLength: null,
        options: null,
        helperText: null,
      },
      {
        required: false,
        placeholder: null,
        language: null,
        disabled: null,
        defaultValue: null,
        value: null,
        values: null,
        readOnly: false,
        description: "The port of the database to connect.",
        key: "db.port",
        label: "Database Port",
        type: "number",
        minValueLength: null,
        maxValueLength: null,
        options: null,
        helperText: null,
      },
      {
        required: false,
        placeholder: null,
        language: null,
        disabled: null,
        defaultValue: "",
        value: null,
        values: null,
        readOnly: false,
        description: "The username used for database connection.",
        key: "db.username",
        label: "Database Username",
        type: "text",
        minValueLength: null,
        maxValueLength: null,
        options: null,
        helperText: null,
      },
      {
        required: false,
        placeholder: null,
        language: null,
        disabled: null,
        defaultValue: null,
        value: null,
        values: null,
        readOnly: false,
        description: "The password used for database connection.",
        key: "db.password",
        label: "Database Password",
        type: "password",
        minValueLength: null,
        maxValueLength: null,
        options: null,
        helperText: null,
      },
    ],
    description: "",
    flowTeamId: "5e3a35ad8c222700018ccd39",
    icon: "flow",
    id: "5eb2c4085a92d80001a16d87",
    name: "ML Train – Bot Efficiency",
    shortDescription: "Train and store ML model for Bot Efficiency.",
    status: "active",
    triggers: {
      scheduler: { enable: false, schedule: "", timezone: "", advancedCron: false },
      webhook: { enable: false, token: "" },
      event: { enable: false, topic: "" },
    },
    tokens: [
      {
        token: "9AC5B22ECBC5B6CC4F7CDA143BD372B9E8DB840795497F72F46A35C1CB20D22D",
        label: "Dockerhub",
      },
      {
        token: "D0620C75201487E7855263F8D4DE1D127AFFC8E97713BF10ED66FCFF6BF455F6",
        label: "Slack",
      },
    ],
    enablePersistentStorage: true,
    enableACCIntegration: false,
    revisionCount: 2,
    templateUpgradesAvailable: false,
  },
];
