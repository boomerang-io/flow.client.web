import React from "react";
import WorkflowExecutionContainer from "./index";
import mockAxios from "Utilities/mocks/axios";
import { serviceUrl } from "Config/servicesConfig";
import { waitFor } from "@testing-library/react";
import { Route } from "react-router-dom";

jest.mock("@boomerang/carbon-addons-boomerang-react", () => ({
  Loading: "Loading",
  Error: "Error",
  NoDisplay: "NoDisplay",
  LoadingAnimation: "LoadingAnimation",
  notify: "notify",
  Notification: "Notification",
}));

jest.mock("Components/WorkflowLink", () => {
  return {
    __esModule: true,
    A: true,
    default: () => {
      return <div></div>;
    },
  };
});

const workflowRevision = {
  templateUpgradesAvailable: true,
  dag: {
    id: "3f58d302-2a3c-4765-b606-7573d313a2fa",
    offsetX: 0,
    offsetY: 0,
    zoom: 36.38779735338877,
    gridSize: 0,
    links: [
      {
        id: "16955507-cc27-4d0c-b17c-debf4573cb3b",
        type: "decision",
        selected: false,
        source: "ced6eda1-47b0-4b8a-bddc-1c0bf64e0b84",
        sourcePort: "0d350a4e-1715-49f2-a788-0626a1c80009",
        target: "7400fbe4-bd7d-4f6a-be31-fd0733fc9bf8",
        targetPort: "21cc6fbb-5d3f-457a-9d97-a0bb8be453bc",
        points: [
          {
            id: "c9e37f73-c060-41ae-9fad-372cff349b0b",
            selected: false,
            x: 1009.3280429210657,
            y: 541.9688011746338,
          },
          {
            id: "49bf42e7-484b-44b6-9257-a5a7b4107627",
            selected: false,
            x: 1222.062611810589,
            y: 452.39063928983467,
          },
        ],
        extras: {},
        labels: [],
        width: 3,
        color: "rgba(255,255,255,0.5)",
        curvyness: 50,
        linkId: "16955507-cc27-4d0c-b17c-debf4573cb3b",
      },
      {
        id: "dbc85ced-7820-4c69-a376-1d1c30a309f3",
        type: "decision",
        selected: false,
        source: "7400fbe4-bd7d-4f6a-be31-fd0733fc9bf8",
        sourcePort: "5ff63d6c-b8ae-42a7-8d34-0542028423b0",
        target: "41b48a51-b3ae-4738-9c20-74ec02ab4ceb",
        targetPort: "f46cb544-ae22-4b58-ad5a-bd94dd7ba095",
        points: [
          {
            id: "15d77fe4-d9ec-49b6-ae80-edcdea1f01fb",
            selected: false,
            x: 1474.06248885537,
            y: 452.39063928983467,
          },
          {
            id: "378c95b9-cda5-4dbf-9c8b-ee4778c61a6a",
            selected: false,
            x: 1652.5000671565597,
            y: 536.7968530362637,
          },
        ],
        extras: {},
        labels: [],
        width: 3,
        color: "rgba(255,255,255,0.5)",
        curvyness: 50,
        linkId: "dbc85ced-7820-4c69-a376-1d1c30a309f3",
      },
      {
        id: "7c398133-111d-48af-a592-a6118413d08d",
        type: "task",
        selected: false,
        templateUpgradeAvailable: true,
        source: "cbdc30f0-f8d5-4674-87d3-117787fe8263",
        sourcePort: "6f1f5e66-9bc1-4675-a654-5f580036a173",
        target: "d7f90f78-12f3-445d-b88a-b33368b5fd66",
        targetPort: "f3d51b38-7886-4b93-a798-517a125d5a19",
        points: [
          {
            id: "01ac57bc-d5cd-42c1-9428-e4e3a7967baf",
            selected: false,
            x: 218.2656259974508,
            y: 590.921825379697,
          },
          {
            id: "ffee2569-bbb7-4462-8dc3-017fe75e5520",
            selected: true,
            x: 343.93747440637395,
            y: 511.1562584248039,
          },
        ],
        extras: {},
        labels: [],
        width: 3,
        color: "rgba(255,255,255,0.5)",
        curvyness: 50,
        executionCondition: "always",
        linkId: "7c398133-111d-48af-a592-a6118413d08d",
      },
      {
        id: "1920ec14-3bce-47cf-80e5-e6ed88f4f3a9",
        type: "task",
        selected: false,
        source: "d7f90f78-12f3-445d-b88a-b33368b5fd66",
        sourcePort: "77433bab-734d-4d7d-aaaf-bcb1db9b7471",
        target: "ced6eda1-47b0-4b8a-bddc-1c0bf64e0b84",
        targetPort: "33c03d2f-fa52-4ce2-9134-d914ecb75ef4",
        points: [
          {
            id: "8035f8f1-8736-4b2a-a745-74588af6c8db",
            selected: false,
            x: 595.9375191863867,
            y: 511.1562584248039,
          },
          {
            id: "2ec3d63a-a754-48eb-8269-1887f8308daf",
            selected: true,
            x: 823.3281216926395,
            y: 541.9688011746338,
          },
        ],
        extras: {},
        labels: [],
        width: 3,
        color: "rgba(255,255,255,0.5)",
        curvyness: 50,
        executionCondition: "always",
        linkId: "1920ec14-3bce-47cf-80e5-e6ed88f4f3a9",
      },
    ],
    nodes: [
      {
        id: "cbdc30f0-f8d5-4674-87d3-117787fe8263",
        type: "startend",
        selected: false,
        x: 58.26566085625685,
        y: 552.9339696623682,
        extras: {},
        ports: [
          {
            id: "6f1f5e66-9bc1-4675-a654-5f580036a173",
            type: "startend",
            selected: false,
            name: "right",
            parentNode: "cbdc30f0-f8d5-4674-87d3-117787fe8263",
            links: ["7c398133-111d-48af-a592-a6118413d08d"],
            position: "right",
            nodePortId: "6f1f5e66-9bc1-4675-a654-5f580036a173",
          },
        ],
        passedName: "Start",
        nodeId: "cbdc30f0-f8d5-4674-87d3-117787fe8263",
      },
      {
        id: "41b48a51-b3ae-4738-9c20-74ec02ab4ceb",
        type: "startend",
        selected: false,
        x: 1668.5025401844534,
        y: 498.80160108595845,
        extras: {},
        ports: [
          {
            id: "f46cb544-ae22-4b58-ad5a-bd94dd7ba095",
            type: "startend",
            selected: false,
            name: "left",
            parentNode: "41b48a51-b3ae-4738-9c20-74ec02ab4ceb",
            links: ["dbc85ced-7820-4c69-a376-1d1c30a309f3"],
            position: "left",
            nodePortId: "f46cb544-ae22-4b58-ad5a-bd94dd7ba095",
          },
        ],
        passedName: "End",
        nodeId: "41b48a51-b3ae-4738-9c20-74ec02ab4ceb",
      },
      {
        id: "ced6eda1-47b0-4b8a-bddc-1c0bf64e0b84",
        type: "decision",
        selected: false,
        x: 840.3348438118273,
        y: 466.9728437955392,
        extras: {},
        ports: [
          {
            id: "33c03d2f-fa52-4ce2-9134-d914ecb75ef4",
            type: "decision",
            selected: false,
            name: "left",
            parentNode: "ced6eda1-47b0-4b8a-bddc-1c0bf64e0b84",
            links: ["1920ec14-3bce-47cf-80e5-e6ed88f4f3a9"],
            position: "left",
            nodePortId: "33c03d2f-fa52-4ce2-9134-d914ecb75ef4",
          },
          {
            id: "0d350a4e-1715-49f2-a788-0626a1c80009",
            type: "decision",
            selected: false,
            name: "right",
            parentNode: "ced6eda1-47b0-4b8a-bddc-1c0bf64e0b84",
            links: ["16955507-cc27-4d0c-b17c-debf4573cb3b"],
            position: "right",
            nodePortId: "0d350a4e-1715-49f2-a788-0626a1c80009",
          },
        ],
        taskId: "7be9d03a8a5df958ad58b3b8",
        nodeId: "ced6eda1-47b0-4b8a-bddc-1c0bf64e0b84",
        taskName: "launch Send Email 1",
      },
      {
        id: "7400fbe4-bd7d-4f6a-be31-fd0733fc9bf8",
        type: "templateTask",
        selected: false,
        x: 1238.069057630476,
        y: 412.4003983482839,
        extras: {},
        ports: [
          {
            id: "21cc6fbb-5d3f-457a-9d97-a0bb8be453bc",
            type: "task",
            selected: false,
            name: "left",
            parentNode: "7400fbe4-bd7d-4f6a-be31-fd0733fc9bf8",
            links: ["16955507-cc27-4d0c-b17c-debf4573cb3b"],
            nodePortId: "21cc6fbb-5d3f-457a-9d97-a0bb8be453bc",
            position: "left",
          },
          {
            id: "5ff63d6c-b8ae-42a7-8d34-0542028423b0",
            type: "task",
            selected: false,
            name: "right",
            parentNode: "7400fbe4-bd7d-4f6a-be31-fd0733fc9bf8",
            links: ["dbc85ced-7820-4c69-a376-1d1c30a309f3"],
            nodePortId: "5ff63d6c-b8ae-42a7-8d34-0542028423b0",
            position: "right",
          },
        ],
        taskId: "5b92f794844d0700016ea216",
        nodeId: "7400fbe4-bd7d-4f6a-be31-fd0733fc9bf8",
        taskName: "read Ingest CSV 1",
      },
      {
        id: "d7f90f78-12f3-445d-b88a-b33368b5fd66",
        type: "templateTask",
        selected: false,
        x: 359.93776056102746,
        y: 471.1603711365562,
        extras: {},
        ports: [
          {
            id: "f3d51b38-7886-4b93-a798-517a125d5a19",
            type: "task",
            selected: false,
            name: "left",
            parentNode: "d7f90f78-12f3-445d-b88a-b33368b5fd66",
            links: ["7c398133-111d-48af-a592-a6118413d08d"],
            nodePortId: "f3d51b38-7886-4b93-a798-517a125d5a19",
            position: "left",
          },
          {
            id: "77433bab-734d-4d7d-aaaf-bcb1db9b7471",
            type: "task",
            selected: false,
            name: "right",
            parentNode: "d7f90f78-12f3-445d-b88a-b33368b5fd66",
            links: ["1920ec14-3bce-47cf-80e5-e6ed88f4f3a9"],
            nodePortId: "77433bab-734d-4d7d-aaaf-bcb1db9b7471",
            position: "right",
          },
        ],
        taskId: "Z0WdhFdks",
        nodeId: "d7f90f78-12f3-445d-b88a-b33368b5fd66",
        taskName: "test22 1",
        templateUpgradeAvailable: true,
        taskVersion: 3,
      },
    ],
  },
  config: {
    nodes: [
      {
        nodeId: "ced6eda1-47b0-4b8a-bddc-1c0bf64e0b84",
        taskId: "5bd98b105a5df954ad599bc2",
        inputs: {
          to: "",
          subject: "",
          message: "",
          message2: "",
          message3: "",
          message4: "",
        },
        type: "templateTask",
      },
      {
        nodeId: "7400fbe4-bd7d-4f6a-be31-fd0733fc9bf8",
        taskId: "5b92f794844d0700016ea216",
        inputs: {
          offset: "",
          shell: "",
        },
        type: "templateTask",
      },
      {
        nodeId: "d7f90f78-12f3-445d-b88a-b33368b5fd66",
        taskId: "Z0WdhFdks",
        inputs: {
          token: "1234",
          slack: "here",
        },
        type: "templateTask",
        taskVersion: 3,
      },
    ],
  },
  changelog: {
    reason: "aaaaa",
  },
};

const workflow = {
  name: "Sparkle Flow with extra glitter and donuts on the side",
};

const tasks = [];

const workflowExecution = {
  status: "inProgress",
  steps: [],
};

const workflowId = "5bd9de16a40f5d0001249bad";
const executionId = "5bdaddb837dc4700011b06bb";

const getSummaryUrl = serviceUrl.getWorkflowSummary({ workflowId });
const getRevisionUrl = serviceUrl.getWorkflowRevision({ workflowId });
const getTaskTemplatesUrl = serviceUrl.getTaskTemplates();

const getExecutionUrl = serviceUrl.getWorkflowExecution({ executionId });

describe("WorkflowExecutionContainer --- Snapshot", () => {
  mockAxios.onGet(getSummaryUrl).reply(200, workflow);
  mockAxios.onGet(getRevisionUrl).reply(200, workflowRevision);
  mockAxios.onGet(getTaskTemplatesUrl).reply(200, tasks);
  mockAxios.onGet(getExecutionUrl).reply(200, workflowExecution);

  it("Capturing Snapshot of WorkflowExecutionContainer", async () => {
    const { baseElement, getByText } = rtlRouterRender(
      <Route path="/activity/:workflowId/execution/:executionId">
        <WorkflowExecutionContainer />
      </Route>,
      { route: `/activity/${workflowId}/execution/${executionId}` }
    );
    await waitFor(() => getByText(/Workflow run detail/));
    expect(baseElement).toMatchSnapshot();
  });
});
