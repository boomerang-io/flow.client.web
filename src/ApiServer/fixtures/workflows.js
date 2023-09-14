const workflows = {
  content: [
    {
      id: "5eb2c4085a92d80001a16d87",
      name: "Personal - ML Train – Bot Efficiency",
      description: "Train and store ML model for Bot Efficiency.",
      creationDate: "2022-01-05T22:50:12.204+00:00",
      version: 2,
      icon: "bot",
      status: "active",
      annotations: {},
      params: [
        {
          name: "tenant",
          type: "string",
          description: "",
          defaultValue: null
        }
      ],
      triggers: {
        scheduler: { enable: false, schedule: "", timezone: "", advancedCron: false },
        webhook: { enable: false, token: "" },
        event: { enable: false, topic: "" },
      },
      templateUpgradesAvailable: false,
      config: [
        {
          required: true,
          placeholder: null,
          language: null,
          disabled: null,
          defaultValue: null,
          value: null,
          values: null,
          readOnly: false,
          description: "Tenant ID from the platform.",
          key: "tenant",
          label: "Tenant ID",
          type: "password",
          min: null,
          max: null,
          options: null,
          helperText: null,
          hiddenValue: true,
        },
      ]
    },
    {
      id: "5e877e944bbc6e0001c51e6e",
      name: "Personal - Java - Deploy",
      description: "",
      creationDate: "2022-01-07T00:29:47.041+00:00",
      version: 8,
      icon: "cloud upload",
      status: "active",
      annotations: {},
      params: [
        {
          name: "system.component.name",
          type: "string",
          description: "",
          defaultValue: null
        }
      ],
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
          token: "test",
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
      templateUpgradesAvailable: false,
      config: [
        {
          required: true,
          placeholder: null,
          language: null,
          disabled: null,
          defaultValue: null,
          value: null,
          values: null,
          readOnly: false,
          description: "here is my test",
          key: "system.component.name",
          label: "Component Name",
          type: "password",
          minValueLength: null,
          maxValueLength: null,
          options: null,
          helperText: null,
          hiddenValue: true,
        },
      ],
    },
    {
      id: "5e877d1f4bbc6e0001c51e12",
      name: "Personal - Java - Build",
      description: "Java - Build",
      version: 16,
      icon: "delivery",
      status: "inactive",
      annotations: {},
      params: [
        {
          name: "color",
          type: "string",
          description: "",
          defaultValue: null
        },
        {
          name: "asdfasdf",
          type: "string",
          description: "",
          defaultValue: null
        }
      ],
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
          token: "test",
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
      templateUpgradesAvailable: true,
      config: [
        {
          required: true,
          placeholder: null,
          language: null,
          disabled: null,
          defaultValue: "red",
          value: null,
          values: null,
          readOnly: false,
          description: "what color is it",
          key: "color",
          label: "Color",
          type: "select",
          minValueLength: null,
          maxValueLength: null,
          options: [
            {
              key: "red",
              value: "red",
            },
            {
              key: "green",
              value: "green",
            },
            {
              key: "blue",
              value: "blue",
            },
          ],
          helperText: null,
        },
        {
          required: true,
          placeholder: null,
          language: null,
          disabled: null,
          defaultValue: 1,
          value: null,
          values: null,
          readOnly: false,
          description: "Testing",
          key: "asdfasdf",
          label: "asdfasdf",
          type: "number",
          minValueLength: null,
          maxValueLength: null,
          options: null,
          helperText: null,
        },
      ],
    },
  ],
  number: 0,
  size: 3,
  totalElements: 3,
  pageable: "INSTANCE",
  last: true,
  totalPages: 1,
  sort: {
      sorted: false,
      empty: true,
      unsorted: true
  },
  first: true,
  numberOfElements: 3,
  empty: false
};


export default workflows;
