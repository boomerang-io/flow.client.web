import React from "react";
import { shallow } from "enzyme";
import renderer from "react-test-renderer";
import { MemoryRouter } from "react-router";
import ActivityCard from "./index";

const history = {};
// const activity = {
//   "last": false,
//     "totalPages": 9,
//     "totalElements": 90,
//     "size": 10,
//     "number": 0,
//     "numberOfElements": 10,
//     "first": true,
//     "sort": [
//       {
//         "direction": "DESC",
//         "property": "creationDate",
//         "ignoreCase": false,
//         "nullHandling": "NATIVE",
//         "descending": true,
//         "ascending": false
//       }
//     ],
//     "records":[
//       {
//         "creationDate": 1541070397344,
//         "duration": 13886,
//         "id": "5bdade3d37dc4700011b06c3",
//         "initiatedBy": "5bc7b126f7856000012cd95d",
//         "status": "completed",
//         "workflowId": "5bd9d8ab7eb44d0001772e64",
//         "workflowRevisionid": "5bd9e1cfa40f5d0001249bfa",
//         "description": "file ingestion",
//         "teamName": "Isa's Team",
//         "icon": "flow",
//         "shortDescription": "file ingestion",
//         "workflowName": "Business Process Test"
//       }
//     ]
// };
const activity = {
  creationDate: 1541070397344,
  duration: 13886,
  id: "5bdade3d37dc4700011b06c3",
  initiatedBy: "5bc7b126f7856000012cd95d",
  status: "completed",
  workflowId: "5bd9d8ab7eb44d0001772e64",
  workflowRevisionid: "5bd9e1cfa40f5d0001249bfa",
  description: "file ingestion",
  teamName: "Isa's Team",
  icon: "flow",
  shortDescription: "file ingestion",
  workflowName: "Business Process Test"
};

describe("ActivityCard --- Snapshot", () => {
  it("Capturing Snapshot of ActivityCard", () => {
    const renderedValue = renderer.create(
      <MemoryRouter>
        <ActivityCard activity={activity} history={history} />
      </MemoryRouter>
    );
    expect(renderedValue).toMatchSnapshot();
  });
});

describe("ActivityCard --- Shallow render", () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallow(
      <MemoryRouter>
        <ActivityCard activity={activity} history={history} />
      </MemoryRouter>
    );
  });

  it("Render the DUMB component", () => {
    expect(wrapper.length).toEqual(1);
  });
});
