import React from "react";
import renderer from "react-test-renderer";
import { Overview } from "./index";

describe("Overview --- Snapshot", () => {
  const workflow = {
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
  };
  it("+++ renders correctly", () => {
    const renderedValue = renderer.create(<Overview workflow={workflow} />).toJSON();
    expect(renderedValue).toMatchSnapshot();
  });
});
