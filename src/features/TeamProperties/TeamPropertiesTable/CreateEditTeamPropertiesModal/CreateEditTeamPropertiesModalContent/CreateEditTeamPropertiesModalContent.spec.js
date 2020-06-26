import React from "react";
import CreateEditTeamPropertiesModalContent from "../CreateEditTeamPropertiesModalContent";
import { fireEvent, waitFor } from "@testing-library/react";
import { act } from "react-dom/test-utils";

const mockfn = jest.fn();
const props = {
  closeModal: mockfn,
  cancelRequestRef: { current: mockfn },
  isEdit: true,
  team: { id: "Test-Id" },
  propertyKeys: ["key"],
  property: {
    id: 1,
  },
};

describe("CreateEditTeamPropertiesModalContent --- Snapshot Test", () => {
  test("Capturing Snapshot of CreateEditTeamPropertiesModalContent", () => {
    const { baseElement } = rtlContextRouterRender(<CreateEditTeamPropertiesModalContent {...props} />);
    expect(baseElement).toMatchSnapshot();
  });
});

describe("CreateEditTeamPropertiesModalContent --- RTL Tests", () => {
  test("CreateEditTeamPropertiesModalContent - test if the isActive Toggle appears", () => {
    const newProps = { ...props, isEdit: false };
    const { queryByText } = rtlContextRouterRender(<CreateEditTeamPropertiesModalContent {...newProps} />);

    expect(queryByText(/active/i)).not.toBeInTheDocument();
  });

  test("CreateEditTeamPropertiesModalContent - test the Submit Button state", async () => {
    const newProps = { ...props, isEdit: false };

    const { getByLabelText, getByTestId } = rtlContextRouterRender(
      <CreateEditTeamPropertiesModalContent {...newProps} />
    );
    const valueInputText = getByLabelText(/value/i);
    const labelInputText = getByLabelText(/label/i);
    const keyInputText = getByLabelText(/key/i);

    act(() => {
      fireEvent.change(valueInputText, { target: { value: "testing for value" } });
      fireEvent.change(labelInputText, { target: { value: "testing for label" } });
      fireEvent.change(keyInputText, { target: { value: "rtlTestingKeyTest" } });
    });

    expect(getByTestId("team-property-create-edit-submission-button")).toBeEnabled();
    await waitFor(() => {});
  });

  test("CreateEditTeamPropertiesModalContent - test if the form submits", async () => {
    const { getByLabelText, getByTestId } = rtlContextRouterRender(<CreateEditTeamPropertiesModalContent {...props} />);
    const valueInputText = getByLabelText(/value/i);
    const labelInputText = getByLabelText(/label/i);
    const keyInputText = getByLabelText(/key/i);

    expect(valueInputText).toBeInTheDocument();
    expect(labelInputText).toBeInTheDocument();
    expect(keyInputText).toBeInTheDocument();

    act(() => {
      fireEvent.change(valueInputText, { target: { value: "Value Test" } });
      fireEvent.change(labelInputText, { target: { value: "Label Test" } });
      fireEvent.change(keyInputText, { target: { value: "rtlTestingKey" } });
      fireEvent.click(getByTestId("team-property-create-edit-submission-button"));
    });

    await waitFor(() => {});
  });

  test("CreateEditTeamPropertiesModalContent - test form reqired validations", async () => {
    const { getByLabelText, findByText, queryByText } = rtlContextRouterRender(
      <CreateEditTeamPropertiesModalContent {...props} />
    );
    const valueInputText = getByLabelText(/value/i);
    const labelInputText = getByLabelText(/label/i);
    const keyInputText = getByLabelText(/key/i);

    expect(queryByText(/Enter a value/i)).toBeNull();
    fireEvent.change(valueInputText, { target: { value: "" } });
    fireEvent.blur(valueInputText);
    const mandatoryValueErr = await findByText(/Enter a value/i);
    expect(mandatoryValueErr).toBeInTheDocument();

    expect(queryByText(/Enter a label/i)).toBeNull();
    fireEvent.change(labelInputText, { target: { value: "" } });
    fireEvent.blur(labelInputText);
    const mandatoryLabelErr = await findByText(/Enter a label/i);
    expect(mandatoryLabelErr).toBeInTheDocument();

    expect(queryByText(/Enter a key/i)).toBeNull();
    fireEvent.change(keyInputText, { target: { value: "" } });
    fireEvent.blur(keyInputText);
    const mandatoryKeyErr = await findByText(/Enter a key/i);
    expect(mandatoryKeyErr).toBeInTheDocument();
    await waitFor(() => {});
  });
});
