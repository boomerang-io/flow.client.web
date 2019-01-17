import React from "react";
import { shallow } from "enzyme";
import renderer from "react-test-renderer";
import { MemoryRouter } from "react-router";
import { WorkflowInsights } from "./index";

jest.mock("Components/NavigateBack", () => "NavigateBack");
jest.mock("./CustomAreaChart", () => "CustomAreaChart");
jest.mock("./CustomScatterChart", () => "CustomScatterChart");
jest.mock("./CustomPieChart", () => "CustomPieChart");

const mockfn = jest.fn();
const location = {};
const insightsActions = {
  fetch: () => new Promise(resolve => resolve({ test: "test" }))
};
const teamsActions = {
  fetch: mockfn
};
const teams = {
  isFetching: false,
  status: "success",
  error: "",
  data: []
};
const insights = {
  isFetching: false,
  status: "success",
  error: "",
  data: {
    totalActivitiesExecuted: 107,
    medianExecutionTime: 24435,
    executions: [
      {
        creationDate: 1542292277199,
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
        teamName: "CAI Offering Team"
      }
    ]
  }
};

describe("WorkflowInsights --- Snapshot", () => {
  it("Capturing Snapshot of WorkflowInsights", () => {
    const renderedValue = renderer
      .create(
        <MemoryRouter>
          <WorkflowInsights
            insights={insights}
            teams={teams}
            insightsActions={insightsActions}
            teamsActions={teamsActions}
            location={location}
          />
        </MemoryRouter>
      )
      .toJSON();
    expect(renderedValue).toMatchSnapshot();
  });
});

describe("WorkflowInsights --- Shallow render", () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallow(
      <MemoryRouter>
        <WorkflowInsights
          insights={insights}
          teams={teams}
          insightsActions={insightsActions}
          teamsActions={teamsActions}
          location={location}
        />
      </MemoryRouter>
    );
  });

  it("Render the DUMB component", () => {
    expect(wrapper.length).toEqual(1);
  });
});
