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
        key: "tenantname",
        label: "Tenant ID",
        type: "text",
        min: null,
        max: null,
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
        key: "artifactoryusername",
        label: "Artifactory Username",
        type: "text",
        min: null,
        max: null,
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
        key: "artifactoryapikey",
        label: "Artifactory API Key",
        type: "password",
        min: null,
        max: null,
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
        key: "dbhost",
        label: "Database Host",
        type: "text",
        min: null,
        max: null,
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
        key: "dbport",
        label: "Database Port",
        type: "number",
        min: null,
        max: null,
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
        key: "dbusername",
        label: "Database Username",
        type: "text",
        min: null,
        max: null,
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
        key: "dbpassword",
        label: "Database Password",
        type: "password",
        min: null,
        max: null,
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
    labels: [
      {
        key: "testing",
        value: "defaultContainer",
      },
      {
        key: "purpose",
        value: "test",
      },
      {
        key: "artifactoryusername",
        value: "Artifactory Username",
      },
      {
        key: "blablablablablabla5eb2c4085a92d80001a16d875eb2c4085a92d80001a16d87",
        value: "5eb2c4085a92d80001a16d875eb2c4085a92d80001a16d875eb2c4085a92d80001a16d87",
      },
    ],
    scope: "team",
    tokens: [],
    enablePersistentStorage: true,
    enableACCIntegration: false,
    revisionCount: 2,
    templateUpgradesAvailable: false,
  },

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
        key: "tenantname",
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
        key: "artifactoryusername",
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
        key: "artifactoryapikey",
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
        key: "dbhost",
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
        key: "dbusername",
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
        key: "dbpassword",
        label: "Database Password",
        type: "password",
        minValueLength: null,
        maxValueLength: null,
        options: null,
        helperText: null,
      },
    ],
    description: "",
    flowTeamId: "5e3a35ad8c222700018ccd38",
    icon: "flow",
    id: "5eb2c4085a92d80001a16d82",
    name: "ML Train – Bot Efficiency",
    shortDescription: "Train and store ML model for Bot Efficiency.",
    status: "active",
    triggers: {
      scheduler: { enable: false, schedule: "", timezone: "", advancedCron: false },
      webhook: { enable: false, token: "" },
      event: { enable: false, topic: "" },
    },
    labels: [
      {
        key: "purpose",
        value: "test",
      },
    ],
    scope: "system",
    tokens: [],
    enablePersistentStorage: true,
    enableACCIntegration: false,
    revisionCount: 2,
    templateUpgradesAvailable: false,
  },
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
        jsonPath: null,
        description: "",
        key: "system.component.name",
        label: "Component Name",
        type: "text",
        minValueLength: null,
        maxValueLength: null,
        options: null,
        helperText: null,
      },
    ],
    description: "",
    flowTeamId: "5e7cccb94bbc6e0001c51773",
    icon: "flow",
    id: "5e877e944bbc6e0001c51e6e",
    name: "Java - Deploy",
    shortDescription: "",
    status: "active",
    triggers: {
      manual: {
        enable: true,
        token: null,
        topic: null,
      },
      scheduler: {
        enable: false,
        schedule: "",
        timezone: "",
        advancedCron: false,
      },
      webhook: {
        enable: true,
        token: "C31FABC02867CE2701757948F0734CC8AE04661E6FA70D750A653E05341F88C9",
        topic: null,
      },
      dockerhub: {
        enable: false,
        token: null,
        topic: null,
      },
      slack: {
        enable: false,
        token: null,
        topic: null,
      },
      custom: {
        enable: false,
        token: null,
        topic: null,
      },
    },
    tokens: [],
    enablePersistentStorage: false,
    scope: "team",
    revisionCount: 8,
    templateUpgradesAvailable: false,
  },
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
        jsonPath: null,
        description: "",
        key: "system.component.name",
        label: "Component Name",
        type: "text",
        minValueLength: null,
        maxValueLength: null,
        options: null,
        helperText: null,
      },
    ],
    description: "Java - Build",
    flowTeamId: "5e3a35ad8c222700018ccd39",
    icon: "flow",
    id: "5e877d1f4bbc6e0001c51e12",
    name: "Java - Build",
    shortDescription: "Java - Build",
    status: "active",
    triggers: {
      manual: {
        enable: true,
        token: null,
        topic: null,
      },
      scheduler: {
        enable: false,
        schedule: "",
        timezone: "",
        advancedCron: false,
      },
      webhook: {
        enable: true,
        token: "D72334785AC1449C04F8E8E8E3A44F6002396BA692ACC9987AD610A1FA7B11BE",
        topic: null,
      },
      dockerhub: {
        enable: false,
        token: null,
        topic: null,
      },
      slack: {
        enable: false,
        token: null,
        topic: null,
      },
      custom: {
        enable: false,
        token: null,
        topic: null,
      },
    },
    tokens: [],
    enablePersistentStorage: false,
    scope: "system",
    revisionCount: 16,
    templateUpgradesAvailable: false,
  },
];
