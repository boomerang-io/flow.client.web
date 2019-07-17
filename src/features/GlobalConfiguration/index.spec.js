import React from "react";
import { GlobalConfigurationContainer } from ".";
import { render, fireEvent, waitForElement } from "react-testing-library";

const mockfn = jest.fn();

const props = {
  globalConfiguration: {
    isFetching: false,
    status: "success",
    data: [
      {
        value: "12345",
        id: "5cdc5ad7460edb4a230b579a",
        key: "test.rtl",
        label: "Test RTL",
        type: "text"
      }
    ]
  },
  actions: {
    reset: mockfn,
    fetch: mockfn,
    addPropertyInStore: mockfn,
    deletePropertyInStore: mockfn,
    updatePropertyInStore: mockfn
  }
};

beforeEach(() => {
  document.body.setAttribute("id", "app");
});

describe("GlobalConfigurationContainer --- Snapshot Test", () => {
  it("Capturing Snapshot of GlobalConfigurationContainer", () => {
    const { baseElement } = render(<GlobalConfigurationContainer {...props} />);
    expect(baseElement).toMatchSnapshot();
  });
});

describe("GlobalConfigurationContainer --- RTL", () => {
  it("Render the table and search correctly", async () => {
    const { getByText, getByPlaceholderText, queryAllByText } = render(<GlobalConfigurationContainer {...props} />);
    getByText(/Set global properties that are accessible in flow processes/i);
    expect(queryAllByText(/Test RTL/i).length).toBe(1);
    const searchProperty = getByPlaceholderText(/Search/i);
    fireEvent.change(searchProperty, { target: { value: "2" } });
    expect(queryAllByText(/Test RTL/i).length).toBe(0);
    fireEvent.change(searchProperty, { target: { value: "Test" } });
    expect(queryAllByText(/Test RTL/i).length).toBe(1);
  });

  it("Opens create property modal", async () => {
    const { getByText, queryByText } = render(<GlobalConfigurationContainer {...props} />);
    expect(queryByText(/CREATE PROPERTY/)).not.toBeInTheDocument();

    const modalTrigger = getByText(/Create Property/i);
    fireEvent.click(modalTrigger);

    expect(queryByText(/CREATE PROPERTY/)).toBeInTheDocument();
  });

  it("Opens edit property modal", async () => {
    const { getByText, queryByText, getByTestId } = render(<GlobalConfigurationContainer {...props} />);

    expect(queryByText(/EDIT TEST RTL/i)).not.toBeInTheDocument();

    fireEvent.mouseOver(getByTestId("configuration-property-table-row"));

    const actionsMenu = getByTestId("configuration-property-table-overflow-menu");
    fireEvent.click(actionsMenu);

    const modalTrigger = await waitForElement(() => getByText(/Edit/i));
    fireEvent.click(modalTrigger);

    expect(queryByText(/EDIT TEST RTL/i)).toBeInTheDocument();
  });

  it("Opens delete property modal", async () => {
    const { getByText, queryByText, getByTestId } = render(<GlobalConfigurationContainer {...props} />);

    expect(queryByText(/DELETE TEST RTL/i)).not.toBeInTheDocument();

    fireEvent.mouseOver(getByTestId("configuration-property-table-row"));

    const actionsMenu = getByTestId("configuration-property-table-overflow-menu");
    fireEvent.click(actionsMenu);

    const modalTrigger = await waitForElement(() => getByText(/Delete/i));
    fireEvent.click(modalTrigger);

    expect(queryByText(/DELETE TEST RTL/i)).toBeInTheDocument();
  });
});
