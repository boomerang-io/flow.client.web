/* eslint-disable */

export default [
  {
    id: "61d620a33aa9034ded32caee",
    name: "Test Workflow",
    status: "active",
    version: 2,
    creationDate: "2022-01-05T22:50:12.204+00:00",
    annotations: {
      "boomerang.io/generation": "3",
      "boomerang.io/kind": "Workflow",
    },
    nodes: [
      {
        id: "start",
        position: {
          x: 50.0,
          y: 400.0,
        },
        data: {
          name: "start",
          params: [],
        },
        type: "start",
      },
      {
        id: "end",
        position: {
          x: 1500.0,
          y: 400.0,
        },
        data: {
          name: "end",
          params: [],
        },
        type: "end",
      },
      {
        id: "Sleep 1",
        position: {
          x: 800.0,
          y: 400.0,
        },
        data: {
          name: "Sleep 1",
          params: [
            {
              name: "duration",
              value: "30",
            },
          ],
          templateRef: "sleep",
          templateVersion: 1,
          templateUpgradeAvailable: true,
        },
        type: "template",
      },
    ],
    edges: [
      {
        id: "64ad3c599d355450e1c2c530",
        source: "Sleep 1",
        target: "end",
        type: "template",
        data: null,
      },
      {
        id: "64ad3c599d355450e1c2c531",
        source: "start",
        target: "Sleep 1",
        type: "template",
        data: null,
      },
    ],
    params: [
      {
        name: "token",
        type: "string",
        description: "enter a token please",
        defaultValue: "a",
      },
      {
        name: "password",
        type: "string",
        description: "This is a secure value.",
        defaultValue: null,
      },
    ],
    tasks: [
      {
        name: "start",
        type: "start",
        templateRef: null,
        templateVersion: null,
        labels: {},
        annotations: {
          "boomerang.io/position": {
            x: 300.0,
            y: 400.0,
          },
        },
        params: [],
        dependencies: [],
        results: null,
        workspaces: null,
      },
      {
        name: "end",
        type: "end",
        templateRef: null,
        templateVersion: null,
        labels: {},
        annotations: {
          "boomerang.io/position": {
            x: 1000.0,
            y: 400.0,
          },
        },
        params: [],
        dependencies: [
          {
            taskRef: "Sleep 1",
            decisionCondition: "",
            executionCondition: "always",
          },
        ],
        results: null,
        workspaces: null,
      },
      {
        name: "Sleep 1",
        type: "template",
        templateRef: "sleep",
        templateVersion: null,
        labels: {},
        annotations: {
          "boomerang.io/position": {
            x: 621.0036101083033,
            y: 391.5812274368231,
          },
        },
        params: [
          {
            name: "duration",
            value: "30",
          },
        ],
        dependencies: [
          {
            decisionCondition: "",
            executionCondition: "always",
          },
        ],
        results: [],
        workspaces: null,
      },
    ],
    changelog: {
      author: "61d38d133aa9034ded32cae6",
      reason: "",
      date: "2022-01-05T22:50:29.934+00:00",
    },
    icon: "bot",
    upgradesAvailable: false,
    triggers: {
      manual: {
        enable: true,
      },
      scheduler: {
        enable: false,
      },
      webhook: {
        enable: false,
      },
      event: {
        enable: false,
        type: null,
        subject: null,
      },
    },
    tokens: [
      {
        token: "7AFBE8B30B2958B2B1879AAAF59B68EC31BF7C581F6D1C0833F64F623A667102",
        label: "default",
      },
    ],
    config: [
      {
        key: "token",
        description: "enter a token please",
        label: "Token",
        type: "text",
        minValueLength: null,
        maxValueLength: null,
        options: null,
        required: true,
        placeholder: null,
        language: null,
        disabled: null,
        defaultValue: "a",
        value: null,
        values: null,
        readOnly: false,
        hiddenValue: null,
        helperText: null,
      },
      {
        key: "password",
        description: "This is a secure value.",
        label: "Password",
        type: "password",
        minValueLength: null,
        maxValueLength: null,
        options: null,
        required: false,
        placeholder: null,
        language: null,
        disabled: null,
        defaultValue: null,
        value: null,
        values: null,
        readOnly: false,
        hiddenValue: null,
        helperText: null,
      },
    ],
  },
];
