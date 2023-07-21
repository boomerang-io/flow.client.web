const workflowsCompose = {
  nodes: [
    {
      id: "start",
      position: {
        x: 300.0,
        y: 400.0,
      },
      data: {
        label: "start",
        params: [],
        templateRef: null,
      },
      type: "start",
    },
    {
      id: "end",
      position: {
        x: 1000.0,
        y: 400.0,
      },
      data: {
        label: "end",
        params: [],
        templateRef: null,
      },
      type: "end",
    },
    {
      id: "Sleep 1",
      position: {
        x: 621.0036101083033,
        y: 391.5812274368231,
      },
      data: {
        label: "Sleep 1",
        params: [
          {
            name: "duration",
            value: "30",
          },
        ],
        templateRef: "sleep",
        templateUpgradeAvailable: true,
      },
      type: "template",
    },
  ],
  edges: [
    {
      id: "64adcb3f4fb0482cb6b00419",
      source: "Sleep 1",
      target: "end",
      type: "template",
      data: null,
    },
    {
      id: "64adcb3f4fb0482cb6b0041a",
      source: null,
      target: "Sleep 1",
      type: "",
      data: null,
    },
  ],
};

export default workflowsCompose;
