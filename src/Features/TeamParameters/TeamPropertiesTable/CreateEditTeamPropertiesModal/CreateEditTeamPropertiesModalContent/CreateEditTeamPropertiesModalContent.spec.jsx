import { vi } from "vitest";
import CreateEditTeamPropertiesModalContent from ".";
import { screen, fireEvent } from "@testing-library/react";

const mockfn = vi.fn();
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
    rtlContextRouterRender(<CreateEditTeamPropertiesModalContent {...newProps} />);

    expect(screen.queryByText(/active/i)).not.toBeInTheDocument();
  });

  test("CreateEditTeamPropertiesModalContent - test the Submit Button state", async () => {
    const newProps = { ...props, isEdit: false };

    rtlContextRouterRender(<CreateEditTeamPropertiesModalContent {...newProps} />);
    const valueInputText = screen.getByLabelText(/value/i);
    const labelInputText = screen.getByLabelText(/label/i);
    const keyInputText = screen.getByLabelText(/key/i);

    fireEvent.change(valueInputText, { target: { value: "testing for value" } });
    fireEvent.change(labelInputText, { target: { value: "testing for label" } });
    fireEvent.change(keyInputText, { target: { value: "rtlTestingKeyTest" } });

    expect(screen.getByTestId("team-parameter-create-edit-submission-button")).toBeEnabled();
  });

  test("CreateEditTeamPropertiesModalContent - test if the form submits", async () => {
    rtlContextRouterRender(<CreateEditTeamPropertiesModalContent {...props} />);
    const valueInputText = screen.getByLabelText(/value/i);
    const labelInputText = screen.getByLabelText(/label/i);
    const keyInputText = screen.getByLabelText(/key/i);

    expect(valueInputText).toBeInTheDocument();
    expect(labelInputText).toBeInTheDocument();
    expect(keyInputText).toBeInTheDocument();

    fireEvent.change(valueInputText, { target: { value: "Value Test" } });
    fireEvent.change(labelInputText, { target: { value: "Label Test" } });
    fireEvent.change(keyInputText, { target: { value: "rtlTestingKey" } });
    fireEvent.click(screen.getByTestId("team-parameter-create-edit-submission-button"));
  });

  test("CreateEditTeamPropertiesModalContent - test form reqired validations", async () => {
    rtlContextRouterRender(<CreateEditTeamPropertiesModalContent {...props} />);
    const valueInputText = screen.getByLabelText(/value/i);
    const labelInputText = screen.getByLabelText(/label/i);
    const keyInputText = screen.getByLabelText(/key/i);

    expect(screen.queryByText(/Enter a value/i)).not.toBeInTheDocument();
    fireEvent.change(valueInputText, { target: { value: "" } });
    fireEvent.blur(valueInputText);
    const mandatoryValueErr = await screen.findByText(/Enter a value/i);
    expect(mandatoryValueErr).toBeInTheDocument();

    expect(screen.queryByText(/Enter a label/i)).not.toBeInTheDocument();
    fireEvent.change(labelInputText, { target: { value: "" } });
    fireEvent.blur(labelInputText);
    const mandatoryLabelErr = await screen.findByText(/Enter a label/i);
    expect(mandatoryLabelErr).toBeInTheDocument();

    expect(screen.queryByText(/Enter a key/i)).not.toBeInTheDocument();
    fireEvent.change(keyInputText, { target: { value: "" } });
    fireEvent.blur(keyInputText);
    const mandatoryKeyErr = await screen.findByText(/Enter a key/i);
    expect(mandatoryKeyErr).toBeInTheDocument();
  });
});
