import React from "react";
import renderer from "react-test-renderer";
import { Overview } from "./index";

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

describe("Overview --- Snapshot", () => {
  it("+++ renders correctly", () => {
    const renderedValue = renderer.create(<Overview workflow={workflow} />).toJSON();
    expect(renderedValue).toMatchSnapshot();
  });
});

describe("Overview --- Shallow render", () => {
  let wrapper;

  wrapper = shallow(<Overview workflow={workflow} />);

  it("renders with correct container class", () => {
    expect(wrapper.find(".c-worklfow-overview").length).toEqual(1);
  });
});
