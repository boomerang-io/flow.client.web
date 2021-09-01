const workflowTemplates = [
  {
  id: "61096c6c9213e8611ae38ddc",
  name: "Test name",
  summary: "Test summary",
  icon: "bot",
  description: "Test System Workflow Test System Workflow Test System Workflow Test System Workflow Test System Workflow Test System Workflow Test System Workflow Test System Workflow Test System Workflow Test System Workflow Test System Workflow Test System Workflow",
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
  id: "f53779df-f82a-4bee-a959-73b752eff8dd",
  selected: false,
  source: "89466a6a-9ab0-4f2e-8004-3995bcb93455",
  sourcePort: "85769c48-671e-4725-92ee-fc993d4ccfba",
  target: "7542e313-c82f-46ef-bcec-0ac7dc60bd17",
  targetPort: "cfe0fd71-a003-4f72-a364-d9f6c2f27cee",
  points: [
  {
  id: "622163c2-7013-489f-a117-633172e07c0b",
  selected: false,
  x: 904,
  y: 444
  },
  {
    id: "61096c6c9213e8611ae322dc",
    name: "Test name2",
    summary: "Test summary",
    icon: "clean",
    description: "Test System Workflow",
    parameters: [
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
    id: "f53779df-f82a-4bee-a959-73b752eff8dd",
    selected: false,
    source: "89466a6a-9ab0-4f2e-8004-3995bcb93455",
    sourcePort: "85769c48-671e-4725-92ee-fc993d4ccfba",
    target: "7542e313-c82f-46ef-bcec-0ac7dc60bd17",
    targetPort: "cfe0fd71-a003-4f72-a364-d9f6c2f27cee",
    points: [
    {
    id: "622163c2-7013-489f-a117-633172e07c0b",
    selected: false,
    x: 904,
    y: 444
    },
    {
    id: "a145e288-2d97-4a6b-8b73-b5ec490b24b5",
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
    linkId: "f53779df-f82a-4bee-a959-73b752eff8dd",
    switchCondition: null
    },
    {
    type: "task",
    id: "b6c14f5f-9b93-4164-9a18-b30943120d64",
    selected: false,
    source: "49e5c0c0-2d61-4913-86ff-1fda4e52d65c",
    sourcePort: "aa6e2173-4fdb-4e28-baa2-00f2da970591",
    target: "89466a6a-9ab0-4f2e-8004-3995bcb93455",
    targetPort: "7725adc4-3dea-4ccb-b954-1abc21ccec91",
    points: [
    {
    id: "d4600ff3-86a4-43c7-ad2e-076312b138cd",
    selected: false,
    x: 460,
    y: 438
    },
    {
    id: "5b68889f-ac8b-4258-8c79-8c5112d38b89",
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
    linkId: "b6c14f5f-9b93-4164-9a18-b30943120d64",
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
    nodePortId: "aa6e2173-4fdb-4e28-baa2-00f2da970591",
    type: "startend",
    selected: false,
    name: "right",
    links: [
    "b6c14f5f-9b93-4164-9a18-b30943120d64"
    ],
    position: "right",
    id: "aa6e2173-4fdb-4e28-baa2-00f2da970591"
    }
    ],
    passedName: "Start",
    templateUpgradeAvailable: false,
    id: "44708f37-8156-464f-971b-f5dac3ba7a7b"
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
    nodePortId: "cfe0fd71-a003-4f72-a364-d9f6c2f27cee",
    type: "startend",
    selected: false,
    name: "left",
    links: [
    "f53779df-f82a-4bee-a959-73b752eff8dd"
    ],
    position: "left",
    id: "cfe0fd71-a003-4f72-a364-d9f6c2f27cee"
    }
    ],
    passedName: "End",
    templateUpgradeAvailable: false,
    id: "d4120bfe-ff13-4a6c-8a00-51de4265d538"
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
    nodePortId: "7725adc4-3dea-4ccb-b954-1abc21ccec91",
    type: "task",
    selected: false,
    name: "left",
    parentNode: "5c3907a1352b1b51412ed079",
    links: [
    "b6c14f5f-9b93-4164-9a18-b30943120d64"
    ],
    position: "left",
    id: "7725adc4-3dea-4ccb-b954-1abc21ccec91"
    },
    {
    nodePortId: "85769c48-671e-4725-92ee-fc993d4ccfba",
    type: "task",
    selected: false,
    name: "right",
    parentNode: "5c3907a1352b1b51412ed079",
    links: [
    "f53779df-f82a-4bee-a959-73b752eff8dd"
    ],
    position: "right",
    id: "85769c48-671e-4725-92ee-fc993d4ccfba"
    }
    ],
    passedName: "Execute Shell 1",
    taskId: "5c3907a1352b1b51412ed079",
    taskName: "Execute Shell 1",
    templateUpgradeAvailable: false,
    id: "6ed99215-8b4a-4ee9-9514-70c56efe560f"
    }
    ],
    offsetX: 0,
    offsetY: 0,
    zoom: 100,
    id: "d615ae66-70c8-4c91-9142-cadd2c8c0f28"
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
    id: "61096c6c921333611ae38ddc",
    name: "Test name3",
    summary: "Test summary3",
    icon: "cloud",
    description: "Test System Workflow",
    parameters: [],
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
    id: "f53779df-f82a-4bee-a959-73b752eff8dd",
    selected: false,
    source: "89466a6a-9ab0-4f2e-8004-3995bcb93455",
    sourcePort: "85769c48-671e-4725-92ee-fc993d4ccfba",
    target: "7542e313-c82f-46ef-bcec-0ac7dc60bd17",
    targetPort: "cfe0fd71-a003-4f72-a364-d9f6c2f27cee",
    points: [
    {
    id: "622163c2-7013-489f-a117-633172e07c0b",
    selected: false,
    x: 904,
    y: 444
    },
    {
    id: "a145e288-2d97-4a6b-8b73-b5ec490b24b5",
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
    linkId: "f53779df-f82a-4bee-a959-73b752eff8dd",
    switchCondition: null
    },
    {
    type: "task",
    id: "b6c14f5f-9b93-4164-9a18-b30943120d64",
    selected: false,
    source: "49e5c0c0-2d61-4913-86ff-1fda4e52d65c",
    sourcePort: "aa6e2173-4fdb-4e28-baa2-00f2da970591",
    target: "89466a6a-9ab0-4f2e-8004-3995bcb93455",
    targetPort: "7725adc4-3dea-4ccb-b954-1abc21ccec91",
    points: [
    {
    id: "d4600ff3-86a4-43c7-ad2e-076312b138cd",
    selected: false,
    x: 460,
    y: 438
    },
    {
    id: "5b68889f-ac8b-4258-8c79-8c5112d38b89",
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
    linkId: "b6c14f5f-9b93-4164-9a18-b30943120d64",
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
    nodePortId: "aa6e2173-4fdb-4e28-baa2-00f2da970591",
    type: "startend",
    selected: false,
    name: "right",
    links: [
    "b6c14f5f-9b93-4164-9a18-b30943120d64"
    ],
    position: "right",
    id: "aa6e2173-4fdb-4e28-baa2-00f2da970591"
    }
    ],
    passedName: "Start",
    templateUpgradeAvailable: false,
    id: "44708f37-8156-464f-971b-f5dac3ba7a7b"
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
    nodePortId: "cfe0fd71-a003-4f72-a364-d9f6c2f27cee",
    type: "startend",
    selected: false,
    name: "left",
    links: [
    "f53779df-f82a-4bee-a959-73b752eff8dd"
    ],
    position: "left",
    id: "cfe0fd71-a003-4f72-a364-d9f6c2f27cee"
    }
    ],
    passedName: "End",
    templateUpgradeAvailable: false,
    id: "d4120bfe-ff13-4a6c-8a00-51de4265d538"
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
    nodePortId: "7725adc4-3dea-4ccb-b954-1abc21ccec91",
    type: "task",
    selected: false,
    name: "left",
    parentNode: "5c3907a1352b1b51412ed079",
    links: [
    "b6c14f5f-9b93-4164-9a18-b30943120d64"
    ],
    position: "left",
    id: "7725adc4-3dea-4ccb-b954-1abc21ccec91"
    },
    {
    nodePortId: "85769c48-671e-4725-92ee-fc993d4ccfba",
    type: "task",
    selected: false,
    name: "right",
    parentNode: "5c3907a1352b1b51412ed079",
    links: [
    "f53779df-f82a-4bee-a959-73b752eff8dd"
    ],
    position: "right",
    id: "85769c48-671e-4725-92ee-fc993d4ccfba"
    }
    ],
    passedName: "Execute Shell 1",
    taskId: "5c3907a1352b1b51412ed079",
    taskName: "Execute Shell 1",
    templateUpgradeAvailable: false,
    id: "6ed99215-8b4a-4ee9-9514-70c56efe560f"
    }
    ],
    offsetX: 0,
    offsetY: 0,
    zoom: 100,
    id: "d615ae66-70c8-4c91-9142-cadd2c8c0f28"
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
  }
];

export default workflowTemplates;