import React from "react";
import { waitFor, fireEvent } from "@testing-library/react";
import WorkflowInsights from "./index";
import { startApiServer } from "ApiServer";

jest.mock("@carbon/charts-react", () => ({
  ...jest.requireActual("@carbon/charts-react"),
  DonutChart: "DonutChart",
  LineChart: "LineChart",
  ScatterChart: "ScatterChart",
}));

const props = {
  teams: {
    isFetching: false,
    status: "success",
    error: "",
    data: [],
  },
  insights: {
    isFetching: false,
    status: "success",
    error: "",
    data: {
      totalActivitiesExecuted: 107,
      medianExecutionTime: 24435,
      executions: [
        {
          creationDate: 1535760000000,
          duration: 20825,
          id: "5bed8335b336a5000103aa2b",
          initiatedByUserId: "5bbcdd38ee763e00011f5b72",
          initiatedByUserName: "Adrienne Hudson",
          status: "completed",
          workflowId: "5bed82f6b336a5000103aa1d",
          workflowRevisionid: "5bed82f7b336a5000103aa20",
          description: "test delete",
          icon: "flow",
          shortDescription: "test",
          workflowName: "Adrienne3",
          teamName: "CAI Offering Team",
        },
      ],
    },
  },
};

let server;

beforeEach(() => {
  server = startApiServer();
});

afterEach(() => {
  server.shutdown();
});

describe("WorkflowInsights --- Snapshot", () => {
  it("Capturing Snapshot of WorkflowInsights", async () => {
    const { baseElement, getByText, getByTestId } = rtlContextRouterRender(<WorkflowInsights />);
    await waitFor(() => getByTestId("completed-insights"));
    expect(baseElement).toMatchSnapshot();
  });
});

//New tests failed due to some feature on @carbon/carts - Check again when this lib get stable
// const insights = {
//   totalActivitiesExecuted: 107,
//   medianExecutionTime: 24435,
//   executions: [
//     {
//       creationDate: 1542292277199,
//       duration: 20825,
//       id: "5bed8335b336a5000103aa2b",
//       initiatedByUserId: "5bbcdd38ee763e00011f5b72",
//       initiatedByUserName: "Adrienne Hudson",
//       status: "completed",
//       workflowId: "5bed82f6b336a5000103aa1d",
//       workflowRevisionid: "5bed82f7b336a5000103aa20",
//       description: "test delete",
//       icon: "flow",
//       shortDescription: "test",
//       workflowName: "Adrienne3",
//       teamName: "CAI Offering Team"
//     }
//   ]
// }
// const initialReduxState ={
//   insights: initialState,
//   teams: {
//     isFetching: false,
//     status: "success",
//     error: "",
//     data: [
//       {
//         "id": "5678",
//         "name": "Isa's Team",
//         "workflows": [
//           {
//             "id": "111",
//             "name": "isabela-workflow-1",
//             "shortDescription": "blablabla",
//             "status": "published",
//             "icon": "mail",
//             "flowTeamId": "5678",
//             "inputs": [
//               {
//                 "description": "A boolean parameter",
//                 "key": "toggle.bool",
//                 "label": "Boolean Toggle",
//                 "type": "boolean",
//                 "value": true
//               },
//               {
//                 "description": "A select parameter",
//                 "key": "select.options",
//                 "label": "Select Options",
//                 "type": "select",
//                 "isRequired": true,
//                 "value": ["op1", "op2"]
//               }
//             ],
//             "properties": [
//               {
//                 "readOnly": false,
//                 "description": "Please help me",
//                 "key": "what.this",
//                 "label": "Boomerang incoming webhook",
//                 "type": "boolean",
//                 "defaultValue": "false",
//                 "required": true
//               }
//             ]
//           },
//           {
//             "id": "222",
//             "name": "isabela-workflow-2",
//             "shortDescription": "blablabla",
//             "status": "draft",
//             "icon": "schedule",
//             "flowTeamId": "5678",
//             "inputs": [
//               {
//                 "description": "A boolean parameter",
//                 "key": "toggle.bool",
//                 "label": "Boolean Toggle",
//                 "type": "boolean",
//                 "value": false
//               },
//               {
//                 "description": "A select parameter",
//                 "key": "select.options",
//                 "label": "Select Options",
//                 "type": "select",
//                 "isRequired": true,
//                 "value": []
//               }
//             ]
//           }
//         ]
//       }
//     ]
//   }
// }
// const props = {
//   location: {},
//   insightsActions,
//   // teamsActions: {
//   //   fetch: () => new Promise(() => {})
//   // },
// };
// beforeEach(() => {
//   mockAxios.resetHistory();
//   window.SVGElement.prototype.getComputedTextLength = () => 200;
// });
// describe("WorkflowInsights --- Snapshot", () => {
//   it("Capturing Snapshot of WorkflowInsights", async () => {
//     const url = new RegExp(`${BASE_SERVICE_URL}/insights?`);
//     mockAxios.onGet(url).reply(200, insights);
//     const { baseElement, findByText } = rtlContextRouterRender(<WorkflowInsights {...props} />,{
//       initialState:initialReduxState
//     });
//     await findByText(/Filter by Workflow/);
//     expect(baseElement).toMatchSnapshot();
//   });
// });

// describe("WorkflowInsights --- RTL", () => {
//   it("Test Team and Period Filters", async () => {
//     const url = new RegExp(`${BASE_SERVICE_URL}/insights?`);
//     mockAxios.onGet(url).reply(200, insights);
//     const { findByText, getByText, getByLabelText, getAllByText, getByTestId} = rtlContextRouterRender(<WorkflowInsights {...props} />,{
//       initialState:initialReduxState
//     });
//     await findByText(/Filter by Workflow/);
//     const teamFilter = getByLabelText("Filter by team");
//     fireEvent.click(teamFilter);
//     fireEvent.click(teamFilter.firstChild);
//     await wait(() => {
//       expect(mockAxios.history.get.length).toBe(2);
//     });
//     const periodFilter = getByLabelText("Time period");
//     fireEvent.click(periodFilter);
//     fireEvent.click(getByText(/1 day/));
//     await wait(() => {
//       expect(mockAxios.history.get.length).toBe(3);
//     });
//   });
// });
