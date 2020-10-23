import React from "react";
import TaskApprovalModal from "./index";
import { fireEvent } from "@testing-library/react";
import { queryCaches } from "react-query";

afterEach(() => {
  queryCaches.forEach((queryCache) => queryCache.clear());
});

const props = {
  approvalId: "1",
  executionId: "1",
  closeModal: () => {},
};

describe("TaskApprovalModal --- Snapshot", () => {
  it("Capturing Snapshot of TaskApprovalModal", () => {
    const { baseElement } = rtlRender(<TaskApprovalModal {...props} />);
    expect(baseElement).toMatchSnapshot();
  });
});

describe("TaskApprovalModal --- RTL", () => {
  it("Formik form submission state", async () => {
    const { getByText } = rtlRender(<TaskApprovalModal {...props} />);

    const submissionButton = getByText("Submit decisions");
    expect(submissionButton).toBeDisabled();
    const approvalButton = getByText("Approve");
    fireEvent.click(approvalButton);
    expect(submissionButton).toBeEnabled();
  });
});
