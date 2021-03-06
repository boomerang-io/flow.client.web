const settings = [
  {
    config: [
      {
        required: null,
        placeholder: null,
        language: null,
        disabled: null,
        defaultValue: null,
        value: "false",
        values: null,
        readOnly: false,
        description: "When enabled, verified tasks can be edited in the task manager",
        key: "enable.tasks",
        label: "Enable Verified Tasks to be edited",
        type: "boolean",
        min: null,
        max: null,
        options: null,
        helperText: null,
      },
      {
        required: null,
        placeholder: null,
        language: null,
        disabled: null,
        defaultValue: null,
        value: "false",
        values: null,
        readOnly: false,
        description: "Enable Debug logging for worker logs",
        key: "enable.debug",
        label: "Enable Debug",
        type: "boolean",
        min: null,
        max: null,
        options: null,
        helperText: null,
      },
      {
        required: null,
        placeholder: null,
        language: null,
        disabled: null,
        defaultValue: null,
        value: "test-version",
        values: null,
        readOnly: false,
        description: "Default container image to be used by the Worker including version",
        key: "worker.image",
        label: "Default Image Path",
        type: "text",
        min: null,
        max: null,
        options: null,
        helperText: null,
      },
      {
        required: null,
        placeholder: null,
        language: null,
        disabled: null,
        defaultValue: null,
        value: "Always",
        values: null,
        readOnly: false,
        description: "Deletion Policy",
        key: "job.deletion.policy",
        label: "Defines the completion state that will lead to worker removal",
        type: "select",
        min: 0,
        max: 128,
        options: [
          {
            key: "Never",
            value: "Never",
          },
          {
            key: "OnSuccess",
            value: "On Success",
          },
          {
            key: "Always",
            value: "Always",
          },
        ],
        helperText: null,
      },
    ],
    description: "The CICD worker configuration.",
    id: "5f32cb19d09662744c0df51d",
    key: "controller",
    lastModiifed: "2020-09-11T03:14:55.819+00:00",
    name: "Workers",
    tool: null,
    type: "ValuesList",
  },
];

export default settings;
