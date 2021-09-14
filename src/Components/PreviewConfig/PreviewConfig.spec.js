import React from "react";
import { fireEvent } from "@testing-library/react";
import PreviewConfig from "./index";

const props = {
  taskTemplateName: "Test template",
  templateConfig: [
    {
      placeholder: "",
      readOnly: false,
      description: "",
      key: "path",
      label: "File Path",
      type: "text",
    },
    {
      placeholder: "",
      readOnly: false,
      description: "",
      key: "propertyName",
      label: "Property Name",
      type: "text",
    },
  ],
};

describe("PreviewConfig --- Snapshot", () => {
  it("Capturing Snapshot of Task Templates", async () => {
    const { baseElement, getByText } = rtlContextRouterRender(<PreviewConfig {...props} />);
    fireEvent.click(getByText("Preview"));
    expect(baseElement).toMatchSnapshot();
  });
});
