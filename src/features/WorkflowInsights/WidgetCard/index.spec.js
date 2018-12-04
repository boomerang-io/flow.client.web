import React from "react";
import { shallow } from "enzyme";
import renderer from "react-test-renderer";
import { MemoryRouter } from "react-router";
import WidgetCard from "./index";

const title = "test title";
const children = "test children";

describe("WidgetCard --- Snapshot", () => {
  it("Capturing Snapshot of WidgetCard", () => {
    const renderedValue = renderer.create(
      <MemoryRouter>
        <WidgetCard title={title} children={children} />
      </MemoryRouter>
    );
    expect(renderedValue).toMatchSnapshot();
  });
});

describe("WidgetCard --- Shallow render", () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallow(
      <MemoryRouter>
        <WidgetCard title={title} children={children} />
      </MemoryRouter>
    );
  });

  it("Render the DUMB component", () => {
    expect(wrapper.length).toEqual(1);
  });
});
