const workflowTemplates = [
  {
  id: "61096c6c9213e8611ae38ddc",
  name: "Test name",
  summary: "Test summary",
  icon: "bot",
  description: "Test System Workflow Test System Workflow Test System Workflow Test System Workflow Test System Workflow Test System Workflow Test System Workflow",
  triggers: {
    manual: {
      enable: true
    },
    scheduler: {
      enable: true,
      schedule: "0 00 23 ? * MON,TUE,WED,THU,FRI,SAT,SUN",
      timezone: "America/Denver",
      advancedCron: false
    },
      webhook: {
      enable: true,
      token: "",
      topic: null
    },
    dockerhub: {
      enable: false,
      token: null,
      topic: null
    },
    slack: {
      enable: false,
      token: null,
      topic: null
    },
    custom: {
      enable: true,
      token: null,
      topic: "Testing"
    }
  },
  parameters: [
    {label: "Param1", type: "Type1"},
    {label: "Param2", type: "Type2"},
    {label: "Param1", type: "Type1"},
    {label: "Param2", type: "Type2"},
    {label: "Param1", type: "Type1"},
    {label: "Param2", type: "Type2"},
    {label: "Param1", type: "Type1"},
    {label: "Param2", type: "Type2"},
  ],
  revision: {
    config: {
    nodes: [
    {
    inputs: {
    path: "",
    shell: "",
    taskName: "Execute Shell 1",
    script: ""
    },
    nodeId: "89466a6a-9ab0-4f2e-8004-3995bcb93455",
    taskId: "5c3907a1352b1b51412ed079",
    type: "script",
    taskVersion: 2,
    outputs: [ ]
    }
    ]
    },
    dag: {
    gridSize: 0,
    links: [
    {
    type: "task",
    id: "30dc28f1-e5fe-4bfb-9cf2-ea164fadc63d",
    selected: false,
    source: "89466a6a-9ab0-4f2e-8004-3995bcb93455",
    sourcePort: "e56cec36-ec7f-41a0-ae80-0f4808e23011",
    target: "7542e313-c82f-46ef-bcec-0ac7dc60bd17",
    targetPort: "49c3476d-c222-4d6e-842b-b9e225cb6a21",
    points: [
    {
    id: "300f2673-8715-4f3f-b05c-d16c92cd6a02",
    selected: false,
    x: 904,
    y: 444
    },
    {
    id: "cb248bab-9544-4f80-ad9c-fdb7a0545892",
    selected: false,
    x: 984,
    y: 438
    }
    ],
    extras: { },
    labels: [ ],
    width: 3,
    color: "rgba(255,255,255,0.5)",
    curvyness: 50,
    executionCondition: "always",
    linkId: "30dc28f1-e5fe-4bfb-9cf2-ea164fadc63d",
    switchCondition: null
    },
    {
    type: "task",
    id: "114c2561-7616-49ff-968e-060006d60a4f",
    selected: false,
    source: "49e5c0c0-2d61-4913-86ff-1fda4e52d65c",
    sourcePort: "cb017f9e-d09f-4657-a2a6-87c1e8d2ea56",
    target: "89466a6a-9ab0-4f2e-8004-3995bcb93455",
    targetPort: "40dbc647-38f0-4411-b9fc-69d13755e4b9",
    points: [
    {
    id: "1baa6fe2-e267-4728-9409-d7304e5b7028",
    selected: false,
    x: 460,
    y: 438
    },
    {
    id: "8137c3ab-f867-4d96-9cc7-7d2382e98e74",
    selected: false,
    x: 652,
    y: 444
    }
    ],
    extras: { },
    labels: [ ],
    width: 3,
    color: "rgba(255,255,255,0.5)",
    curvyness: 50,
    executionCondition: "always",
    linkId: "114c2561-7616-49ff-968e-060006d60a4f",
    switchCondition: null
    }
    ],
    nodes: [
    {
    nodeId: "49e5c0c0-2d61-4913-86ff-1fda4e52d65c",
    type: "startend",
    selected: false,
    x: 300,
    y: 400,
    extras: { },
    ports: [
    {
    nodePortId: "cb017f9e-d09f-4657-a2a6-87c1e8d2ea56",
    type: "startend",
    selected: false,
    name: "right",
    links: [
    "114c2561-7616-49ff-968e-060006d60a4f"
    ],
    position: "right",
    id: "cb017f9e-d09f-4657-a2a6-87c1e8d2ea56"
    }
    ],
    passedName: "Start",
    templateUpgradeAvailable: false,
    id: "47d9ddd9-4e5e-48ce-9287-b5cf798b56d5"
    },
    {
    nodeId: "7542e313-c82f-46ef-bcec-0ac7dc60bd17",
    type: "startend",
    selected: false,
    x: 1000,
    y: 400,
    extras: { },
    ports: [
    {
    nodePortId: "49c3476d-c222-4d6e-842b-b9e225cb6a21",
    type: "startend",
    selected: false,
    name: "left",
    links: [
    "30dc28f1-e5fe-4bfb-9cf2-ea164fadc63d"
    ],
    position: "left",
    id: "49c3476d-c222-4d6e-842b-b9e225cb6a21"
    }
    ],
    passedName: "End",
    templateUpgradeAvailable: false,
    id: "aff2afb9-a4db-4169-a1f4-0836cec675ed"
    },
    {
    nodeId: "89466a6a-9ab0-4f2e-8004-3995bcb93455",
    type: "script",
    selected: false,
    x: 668,
    y: 404,
    extras: { },
    ports: [
    {
    nodePortId: "40dbc647-38f0-4411-b9fc-69d13755e4b9",
    type: "task",
    selected: false,
    name: "left",
    parentNode: "5c3907a1352b1b51412ed079",
    links: [
    "114c2561-7616-49ff-968e-060006d60a4f"
    ],
    position: "left",
    id: "40dbc647-38f0-4411-b9fc-69d13755e4b9"
    },
    {
    nodePortId: "e56cec36-ec7f-41a0-ae80-0f4808e23011",
    type: "task",
    selected: false,
    name: "right",
    parentNode: "5c3907a1352b1b51412ed079",
    links: [
    "30dc28f1-e5fe-4bfb-9cf2-ea164fadc63d"
    ],
    position: "right",
    id: "e56cec36-ec7f-41a0-ae80-0f4808e23011"
    }
    ],
    passedName: "Execute Shell 1",
    taskId: "5c3907a1352b1b51412ed079",
    taskName: "Execute Shell 1",
    templateUpgradeAvailable: false,
    id: "85b03842-72fb-4126-a57a-5afed9be1ec2"
    }
    ],
    offsetX: 0,
    offsetY: 0,
    zoom: 100,
    id: "9787adae-e0b5-480c-ae2d-cc8a218c33d5"
    },
    id: "611d28bd1fe9252079033f9c",
    version: 3,
    workFlowId: "61096c6c9213e8611ae38ddc",
    changelog: {
    userId: "60a975123d611c38c010102e",
    reason: "test",
    date: "2021-08-18T15:35:25.625+00:00",
    userName: null
    },
    templateUpgradesAvailable: false
    }    
  },
  {
    "properties": [],
    "description": "Testing new template",
    "icon": "power",
    "id": "61326e32183bdc138022dfca",
    "name": "Test Template Isa",
    "shortDescription": "Testing",
    "status": "deleted",
    "triggers": {
        "manual": {
            "enable": true,
            "token": null,
            "topic": null
        },
        "scheduler": {
            "enable": false,
            "schedule": "",
            "timezone": "",
            "advancedCron": false
        },
        "webhook": {
            "enable": false,
            "token": "",
            "topic": null
        },
        "dockerhub": {
            "enable": false,
            "token": null,
            "topic": null
        },
        "slack": {
            "enable": false,
            "token": null,
            "topic": null
        },
        "custom": {
            "enable": false,
            "token": null,
            "topic": null
        }
    },
    "tokens": [
        {
            "token": "5451EE0D2D5149B5EDBD3B3650BB5F4F09A20F013C4B196D1B251F9BA735801A",
            "label": "default"
        }
    ],
    "enablePersistentStorage": false,
    "scope": "template",
    "revisionCount": 1,
    "templateUpgradesAvailable": false,
    "revision": {
        "dag": {
            "tasks": [
                {
                    "taskId": "f213b199-f5f8-477a-9b0b-306227b1a9c2",
                    "type": "start",
                    "dependencies": [],
                    "metadata": {
                        "position": {
                            "x": 300,
                            "y": 400
                        }
                    }
                },
                {
                    "taskId": "b918f913-0b8d-42e1-b031-22ecbda9ebab",
                    "type": "end",
                    "dependencies": [],
                    "metadata": {
                        "position": {
                            "x": 1000,
                            "y": 400
                        }
                    }
                }
            ]
        },
        "id": "61326e32183bdc138022dfcb",
        "version": 1,
        "workFlowId": "61326e32183bdc138022dfca",
        "changelog": {
            "userId": "6086e0b670bfa94ac91f84a0",
            "reason": "Create workflow",
            "date": 1630694962401,
            "userName": null
        }
    }
  }
];

export default workflowTemplates;