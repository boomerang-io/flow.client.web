import React from "react";
import renderer from "react-test-renderer";
import { Overview } from "./index";

jest.mock("./CronJobModal", () => "CronJobModal");
jest.mock("@boomerang/boomerang-components", () => ({
  AlertModal: "AlertModal",
  Button: "Button",
  ConfirmModal: "ConfirmModal",
  Modal: "ModalWrapper",
  ModalFlow: "ModalFlow",
  SelectDropdown: "SelectDropdown",
  notify: "notify",
  Notification: "Notification",
  TextArea: "TextArea",
  TextInput: "TextInput",
  Toggle: "Toggle",
  Tooltip: "Tooltip"
}));

const mockfn = jest.fn();

const workflow = {
  data: {
    triggers: {
      scheduler: {
        enable: false,
        schedule: ""
      },
      webhook: {
        enable: false,
        token: ""
      }
    }
  }
};

const enabledWorkflow = {
  data: {
    triggers: {
      scheduler: {
        enable: true,
        schedule: ""
      },
      webhook: {
        enable: false,
        token: ""
      }
    }
  }
};
const teams = [
  {
    id: "1234",
    name: "Lucas' team",
    workflows: [
      {
        id: "5bd6fdf65a5df954ad47bdbe",
        name: "lucas-workflow-1",
        description: "blablabla",
        status: "published",
        icon: "utility",
        properties: [
          {
            defaultValue: "test",
            description: "Testing this property",
            key: "test.property",
            label: "Test Property",
            required: true,
            type: "select",
            validValues: ["test", "this"]
          },
          {
            defaultValue: "test",
            description: "Testing this propertys",
            key: "test.property1",
            label: "Test Property1",
            required: true,
            type: "text"
          }
        ]
      },
      {
        id: "456",
        name: "lucas-workflow-2",
        description: "blablabla",
        status: "published",
        icon: "utility"
      },
      {
        id: "789",
        name: "lucas-workflow-3",
        description: "blablabla",
        status: "draft",
        icon: "secure"
      }
    ]
  }
];

const props = {
  teams,
  workflow,
  workflowActions: {
    updateTriggersWebhook: mockfn,
    updateProperty: mockfn,
    updateTriggersScheduler: mockfn
  },
  teamsActions: {},
  setIsValidOverview: mockfn
};

describe("Overview --- Snapshot", () => {
  it("+++ renders correctly", () => {
    const renderedValue = renderer.create(<Overview {...props} />).toJSON();
    expect(renderedValue).toMatchSnapshot();
  });
});

describe("Overview --- Shallow render", () => {
  let wrapper;

  wrapper = shallow(<Overview {...props} />);

  it("renders with correct container class", () => {
    expect(wrapper.find(".c-worklfow-overview").length).toEqual(1);
  });
});
