export const revision = {
  config: {
    nodes: [
      {
        inputs: { path: "./", shell: "", taskName: "Execute Shell 1", script: 'echo "I love Boomerang Flow"' },
        nodeId: "5c0ba07d-f841-4a48-8fef-e124b747bb11",
        taskId: "5c3907a1352b1b51412ed079",
        type: "templateTask",
        taskVersion: 1,
      },
      {
        inputs: { image: "", arguments: "", taskName: "Run Custom Task 1", command: "" },
        nodeId: "201d3407-897c-41aa-b6fc-c4510f1107af",
        taskId: "5d9e703dc90b5240508869e2",
        type: "customTask",
        taskVersion: 1,
      },
      {
        inputs: { taskName: "Switch 1", value: "" },
        nodeId: "1774b546-4727-4c78-a843-2e0f45ccdcc6",
        taskId: "5c37af285616d5f3544568fd",
        type: "decision",
        taskVersion: 1,
      },
      {
        inputs: { path: ".", shell: "", taskName: "Execute Shell 2", script: 'echo "No, made it here!"' },
        nodeId: "ea2f5ba5-01e5-472a-89a8-5ff7f4d271c6",
        taskId: "5c3907a1352b1b51412ed079",
        type: "templateTask",
        taskVersion: 1,
      },
      {
        inputs: { path: ".", shell: "", taskName: "Execute Shell 3", script: 'echo "Made it here!"' },
        nodeId: "c2323dc9-494d-496f-b0c7-27585e3b72c4",
        taskId: "5c3907a1352b1b51412ed079",
        type: "templateTask",
        taskVersion: 1,
      },
    ],
  },
  dag: {
    gridSize: 0,
    links: [
      {
        type: "task",
        id: "6d2441e1-efe1-42cb-bdec-de5d9653b904",
        selected: false,
        source: "ea2f5ba5-01e5-472a-89a8-5ff7f4d271c6",
        sourcePort: "55a3d3e3-3b4c-4396-b6d5-eaea6640a51b",
        target: "1f12db10-c88c-4c9a-948a-a75517b13b33",
        targetPort: "e901189c-b27c-40fd-908b-6ff32bc000cd",
        points: [
          { id: "9ab6b7c3-7bcd-4de3-9911-f88ab4161a18", selected: false, x: 1641.001206144704, y: 239.27645571439464 },
          { id: "eee59f0f-89dd-4540-9b26-85aead26c84e", selected: false, x: 1863.6719167817232, y: 408.73436962665426 },
        ],
        extras: {},
        labels: [],
        width: 3,
        color: "rgba(255,255,255,0.5)",
        curvyness: 50,
        executionCondition: "always",
        linkId: "6d2441e1-efe1-42cb-bdec-de5d9653b904",
        switchCondition: null,
      },
      {
        type: "task",
        id: "246a4c04-dc95-454a-b22a-fff12c99b632",
        selected: false,
        source: "c2323dc9-494d-496f-b0c7-27585e3b72c4",
        sourcePort: "ad3292c0-9068-4f28-9aeb-16ecee9a6801",
        target: "1f12db10-c88c-4c9a-948a-a75517b13b33",
        targetPort: "e901189c-b27c-40fd-908b-6ff32bc000cd",
        points: [
          { id: "05b50093-3835-4c30-8bc2-03522a2bd57f", selected: false, x: 1637.9338608923003, y: 608.5168027696831 },
          { id: "777a68ec-8375-4ccb-bcd8-ef724a3d78e2", selected: false, x: 1863.6719167817232, y: 408.73436962665426 },
        ],
        extras: {},
        labels: [],
        width: 3,
        color: "rgba(255,255,255,0.5)",
        curvyness: 50,
        executionCondition: "always",
        linkId: "246a4c04-dc95-454a-b22a-fff12c99b632",
        switchCondition: null,
      },
      {
        type: "task",
        id: "c13095fe-6319-484b-bca0-1d2bc34c4824",
        selected: false,
        source: "94759b6e-7d99-46d6-b6a7-6f2c781d9390",
        sourcePort: "0b58a2e1-4ecb-46fc-91b6-a9f74d0b5065",
        target: "5c0ba07d-f841-4a48-8fef-e124b747bb11",
        targetPort: "e41fc65c-3967-463f-9d49-2814e1307e91",
        points: [
          { id: "85148771-0a63-4ab8-990f-827528acca52", selected: false, x: 127.19847328244276, y: 425.4356506420894 },
          { id: "71100b1a-b19c-4408-9bab-6c9ea1faa840", selected: false, x: 311.5909775587837, y: 417.77354540580563 },
        ],
        extras: {},
        labels: [],
        width: 3,
        color: "rgba(255,255,255,0.5)",
        curvyness: 50,
        executionCondition: "always",
        linkId: "c13095fe-6319-484b-bca0-1d2bc34c4824",
        switchCondition: null,
      },
      {
        type: "task",
        id: "a940a45d-4145-4b97-ba54-080df62a94c2",
        selected: false,
        source: "5c0ba07d-f841-4a48-8fef-e124b747bb11",
        sourcePort: "ecc8c9d8-8e93-49b5-b7bb-a7e7f46378b3",
        target: "201d3407-897c-41aa-b6fc-c4510f1107af",
        targetPort: "80a32a2f-97e0-49ad-8374-34932c2f0680",
        points: [
          { id: "37e8141f-8960-476e-8da1-39bf19c90fab", selected: false, x: 563.5909623072295, y: 417.7735198432811 },
          { id: "aaaedbad-d4b3-42cb-95ee-60c9934bdf8a", selected: false, x: 688.301355952495, y: 415.25909205420527 },
        ],
        extras: {},
        labels: [],
        width: 3,
        color: "rgba(255,255,255,0.5)",
        curvyness: 50,
        executionCondition: "always",
        linkId: "a940a45d-4145-4b97-ba54-080df62a94c2",
        switchCondition: null,
      },
      {
        type: "task",
        id: "e46b84e3-64c1-4af4-b342-8aa15624d5cd",
        selected: false,
        source: "201d3407-897c-41aa-b6fc-c4510f1107af",
        sourcePort: "5058e9a7-71e1-4312-8f46-85b301aa4686",
        target: "1774b546-4727-4c78-a843-2e0f45ccdcc6",
        targetPort: "99bc9d6c-424f-4f26-a053-c8ed2e90fcca",
        points: [
          { id: "5f5dfe0e-51ab-43fe-8f40-4a07fdd99154", selected: false, x: 940.3113025964649, y: 415.2644399736377 },
          { id: "4925fc07-ceab-471f-b067-3f7cceda5cc2", selected: false, x: 1046.9891544761003, y: 413.57211461699006 },
        ],
        extras: {},
        labels: [],
        width: 3,
        color: "rgba(255,255,255,0.5)",
        curvyness: 50,
        executionCondition: "always",
        linkId: "e46b84e3-64c1-4af4-b342-8aa15624d5cd",
        switchCondition: null,
      },
      {
        type: "decision",
        id: "698a5937-5fe4-4a6d-9ef1-8bfdeee05c56",
        selected: false,
        source: "1774b546-4727-4c78-a843-2e0f45ccdcc6",
        sourcePort: "3ca95312-cba8-401f-8886-a44c49d645b8",
        target: "ea2f5ba5-01e5-472a-89a8-5ff7f4d271c6",
        targetPort: "52d1120c-388a-46bb-a2e2-2f86529035bb",
        points: [
          { id: "f12fa364-51e7-4129-a541-6ded93d89169", selected: false, x: 1232.9928302432616, y: 413.57445751727926 },
          { id: "ca2ff161-2239-4edd-9fb8-e2b5a173f23e", selected: false, x: 1389.0024456278768, y: 239.27645571439464 },
        ],
        extras: {},
        labels: [],
        width: 3,
        color: "rgba(255,255,255,0.5)",
        curvyness: 50,
        executionCondition: "always",
        linkId: "698a5937-5fe4-4a6d-9ef1-8bfdeee05c56",
        switchCondition: null,
      },
      {
        type: "decision",
        id: "ca9d7c7a-ec59-4484-87c1-a59514c04be6",
        selected: false,
        source: "1774b546-4727-4c78-a843-2e0f45ccdcc6",
        sourcePort: "3ca95312-cba8-401f-8886-a44c49d645b8",
        target: "c2323dc9-494d-496f-b0c7-27585e3b72c4",
        targetPort: "a2aded2f-5995-479b-9c25-db0f8c8500ae",
        points: [
          { id: "9d876654-3e7d-44b6-b37f-446d7628cb19", selected: false, x: 1232.9832524187423, y: 413.5648796927601 },
          { id: "73e9dcde-458b-46dd-9ff1-9b28ab940045", selected: false, x: 1385.9302175629732, y: 608.5120138574234 },
        ],
        extras: {},
        labels: [],
        width: 3,
        color: "rgba(255,255,255,0.5)",
        curvyness: 50,
        executionCondition: "always",
        linkId: "ca9d7c7a-ec59-4484-87c1-a59514c04be6",
        switchCondition: null,
      },
    ],
    nodes: [
      {
        nodeId: "94759b6e-7d99-46d6-b6a7-6f2c781d9390",
        type: "startend",
        selected: false,
        x: -32.80152671755725,
        y: 387.4356506420894,
        extras: {},
        ports: [
          {
            nodePortId: "0b58a2e1-4ecb-46fc-91b6-a9f74d0b5065",
            type: "startend",
            selected: false,
            name: "right",
            links: ["c13095fe-6319-484b-bca0-1d2bc34c4824"],
            position: "right",
            id: "0b58a2e1-4ecb-46fc-91b6-a9f74d0b5065",
          },
        ],
        passedName: "Start",
        templateUpgradeAvailable: false,
        id: "4879d3ed-993c-4eff-95bf-71a3c2451751",
      },
      {
        nodeId: "1f12db10-c88c-4c9a-948a-a75517b13b33",
        type: "startend",
        selected: false,
        x: 1879.686384640915,
        y: 370.74839796778065,
        extras: {},
        ports: [
          {
            nodePortId: "e901189c-b27c-40fd-908b-6ff32bc000cd",
            type: "startend",
            selected: false,
            name: "left",
            links: ["6d2441e1-efe1-42cb-bdec-de5d9653b904", "246a4c04-dc95-454a-b22a-fff12c99b632"],
            position: "left",
            id: "e901189c-b27c-40fd-908b-6ff32bc000cd",
          },
        ],
        passedName: "End",
        templateUpgradeAvailable: false,
        id: "dfbe5853-589c-49d8-bd4d-2667a41a11f8",
      },
      {
        nodeId: "5c0ba07d-f841-4a48-8fef-e124b747bb11",
        type: "templateTask",
        selected: false,
        x: 327.5909775587837,
        y: 377.77354540580563,
        extras: {},
        ports: [
          {
            nodePortId: "e41fc65c-3967-463f-9d49-2814e1307e91",
            type: "task",
            selected: false,
            name: "left",
            parentNode: "5c3907a1352b1b51412ed079",
            links: ["c13095fe-6319-484b-bca0-1d2bc34c4824"],
            position: "left",
            id: "e41fc65c-3967-463f-9d49-2814e1307e91",
          },
          {
            nodePortId: "ecc8c9d8-8e93-49b5-b7bb-a7e7f46378b3",
            type: "task",
            selected: false,
            name: "right",
            parentNode: "5c3907a1352b1b51412ed079",
            links: ["a940a45d-4145-4b97-ba54-080df62a94c2"],
            position: "right",
            id: "ecc8c9d8-8e93-49b5-b7bb-a7e7f46378b3",
          },
        ],
        passedName: "Execute Shell 1",
        taskId: "5c3907a1352b1b51412ed079",
        taskName: "Execute Shell 1",
        templateUpgradeAvailable: false,
        id: "c4639678-3c67-4354-af09-bcda70d8b403",
      },
      {
        nodeId: "201d3407-897c-41aa-b6fc-c4510f1107af",
        type: "customTask",
        selected: false,
        x: 704.3118924881841,
        y: 375.2716139644691,
        extras: {},
        ports: [
          {
            nodePortId: "80a32a2f-97e0-49ad-8374-34932c2f0680",
            type: "task",
            selected: false,
            name: "left",
            parentNode: "5d9e703dc90b5240508869e2",
            links: ["a940a45d-4145-4b97-ba54-080df62a94c2"],
            position: "left",
            id: "80a32a2f-97e0-49ad-8374-34932c2f0680",
          },
          {
            nodePortId: "5058e9a7-71e1-4312-8f46-85b301aa4686",
            type: "task",
            selected: false,
            name: "right",
            parentNode: "5d9e703dc90b5240508869e2",
            links: ["e46b84e3-64c1-4af4-b342-8aa15624d5cd"],
            position: "right",
            id: "5058e9a7-71e1-4312-8f46-85b301aa4686",
          },
        ],
        passedName: "Run Custom Task 1",
        taskId: "5d9e703dc90b5240508869e2",
        taskName: "Run Custom Task 1",
        templateUpgradeAvailable: false,
        id: "a2bfae6d-9633-41a8-91a3-4db458b1e038",
      },
      {
        nodeId: "1774b546-4727-4c78-a843-2e0f45ccdcc6",
        type: "decision",
        selected: false,
        x: 1063.9953156034028,
        y: 338.57831058679795,
        extras: {},
        ports: [
          {
            nodePortId: "99bc9d6c-424f-4f26-a053-c8ed2e90fcca",
            type: "decision",
            selected: false,
            name: "left",
            parentNode: "5c37af285616d5f3544568fd",
            links: ["e46b84e3-64c1-4af4-b342-8aa15624d5cd"],
            position: "left",
            id: "99bc9d6c-424f-4f26-a053-c8ed2e90fcca",
          },
          {
            nodePortId: "3ca95312-cba8-401f-8886-a44c49d645b8",
            type: "decision",
            selected: false,
            name: "right",
            parentNode: "5c37af285616d5f3544568fd",
            links: ["698a5937-5fe4-4a6d-9ef1-8bfdeee05c56", "ca9d7c7a-ec59-4484-87c1-a59514c04be6"],
            position: "right",
            id: "3ca95312-cba8-401f-8886-a44c49d645b8",
          },
        ],
        passedName: "Switch 1",
        taskId: "5c37af285616d5f3544568fd",
        taskName: "Switch 1",
        templateUpgradeAvailable: false,
        id: "edd7e868-e323-4b52-9a62-0ee78196f1a7",
      },
      {
        nodeId: "ea2f5ba5-01e5-472a-89a8-5ff7f4d271c6",
        type: "templateTask",
        selected: false,
        x: 1405.0132253754732,
        y: 199.28858762545232,
        extras: {},
        ports: [
          {
            nodePortId: "52d1120c-388a-46bb-a2e2-2f86529035bb",
            type: "task",
            selected: false,
            name: "left",
            parentNode: "5c3907a1352b1b51412ed079",
            links: ["698a5937-5fe4-4a6d-9ef1-8bfdeee05c56"],
            position: "left",
            id: "52d1120c-388a-46bb-a2e2-2f86529035bb",
          },
          {
            nodePortId: "55a3d3e3-3b4c-4396-b6d5-eaea6640a51b",
            type: "task",
            selected: false,
            name: "right",
            parentNode: "5c3907a1352b1b51412ed079",
            links: ["6d2441e1-efe1-42cb-bdec-de5d9653b904"],
            position: "right",
            id: "55a3d3e3-3b4c-4396-b6d5-eaea6640a51b",
          },
        ],
        passedName: "Execute Shell 2",
        taskId: "5c3907a1352b1b51412ed079",
        taskName: "Execute Shell 2",
        templateUpgradeAvailable: false,
        id: "c7eca55c-56d1-4784-8884-8cd85239ab30",
      },
      {
        nodeId: "c2323dc9-494d-496f-b0c7-27585e3b72c4",
        type: "templateTask",
        selected: false,
        x: 1401.9363022985501,
        y: 568.5193568562215,
        extras: {},
        ports: [
          {
            nodePortId: "a2aded2f-5995-479b-9c25-db0f8c8500ae",
            type: "task",
            selected: false,
            name: "left",
            parentNode: "5c3907a1352b1b51412ed079",
            links: ["ca9d7c7a-ec59-4484-87c1-a59514c04be6"],
            position: "left",
            id: "a2aded2f-5995-479b-9c25-db0f8c8500ae",
          },
          {
            nodePortId: "ad3292c0-9068-4f28-9aeb-16ecee9a6801",
            type: "task",
            selected: false,
            name: "right",
            parentNode: "5c3907a1352b1b51412ed079",
            links: ["246a4c04-dc95-454a-b22a-fff12c99b632"],
            position: "right",
            id: "ad3292c0-9068-4f28-9aeb-16ecee9a6801",
          },
        ],
        passedName: "Execute Shell 3",
        taskId: "5c3907a1352b1b51412ed079",
        taskName: "Execute Shell 3",
        templateUpgradeAvailable: false,
        id: "d5c47187-ade7-4ce0-88fd-145882c66366",
      },
    ],
    offsetX: 0,
    offsetY: 0,
    zoom: 100,
    id: "146087e0-9385-4868-9bca-f0060720c2d7",
  },
  id: "5ed12d7803fea060fb55189f",
  version: 2,
  workFlowId: "5ed12be103fea060fb55169a",
  changelog: {
    userId: "5e7377c6a97b78000125ed7c",
    reason: "First release",
    date: "2020-05-29T15:42:48.383+00:00",
    userName: null,
  },
  templateUpgradesAvailable: false,
};
