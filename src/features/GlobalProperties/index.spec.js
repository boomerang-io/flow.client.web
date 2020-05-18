import React from "react";
import { GlobalPropertiesContainer } from ".";
import { render, fireEvent, waitFor } from "@testing-library/react";

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

describe("GlobalPropertiesContainer --- Snapshot Test", () => {
  it("Capturing Snapshot of GlobalPropertiesContainer", async() => {
    const { baseElement } = render(<GlobalPropertiesContainer {...props} />);
    expect(baseElement).toMatchSnapshot();
    await waitFor(() => {});
  });
});

describe("GlobalPropertiesContainer --- RTL", () => {
  it("Render the table and search correctly", async () => {
    const { getByText, getByPlaceholderText, queryAllByText } = render(<GlobalPropertiesContainer {...props} />);
    getByText(/Set global properties that are available for all Workflows/i);
    expect(queryAllByText(/Test RTL/i).length).toBe(1);
    const searchProperty = getByPlaceholderText(/Search/i);
    fireEvent.change(searchProperty, { target: { value: "2" } });
    expect(queryAllByText(/Test RTL/i).length).toBe(0);
    fireEvent.change(searchProperty, { target: { value: "Test" } });
    expect(queryAllByText(/Test RTL/i).length).toBe(1);
  });

  it("Opens create property modal", async () => {
    const { getByTestId, queryByText } = render(<GlobalPropertiesContainer {...props} />);
    expect(queryByText(/CREATE PROPERTY/)).not.toBeInTheDocument();

    const modalTrigger = getByTestId("create-global-configurations-property-button");
    fireEvent.click(modalTrigger);

    expect(queryByText(/Cancel/)).toBeInTheDocument();
  });

  it("Opens edit property modal", async () => {
    const { findByText, queryByText, getByTestId } = render(<GlobalPropertiesContainer {...props} />);

    expect(queryByText(/EDIT TEST RTL/i)).not.toBeInTheDocument();

    fireEvent.mouseOver(getByTestId("configuration-property-table-row"));

    const actionsMenu = getByTestId("configuration-property-table-overflow-menu");
    fireEvent.click(actionsMenu);

    const modalTrigger = await findByText(/Edit/i);
    fireEvent.click(modalTrigger);

    expect(queryByText(/EDIT TEST RTL/i)).toBeInTheDocument();
  });

  it("Opens delete property modal", async () => {
    const { findByText, queryByText, getByTestId } = render(<GlobalPropertiesContainer {...props} />);

    expect(queryByText(/DELETE TEST RTL/i)).not.toBeInTheDocument();

    fireEvent.mouseOver(getByTestId("configuration-property-table-row"));

    const actionsMenu = getByTestId("configuration-property-table-overflow-menu");
    fireEvent.click(actionsMenu);

    const modalTrigger = await findByText(/Delete/i);
    fireEvent.click(modalTrigger);

    expect(queryByText(/DELETE TEST RTL/i)).toBeInTheDocument();
  });
});
