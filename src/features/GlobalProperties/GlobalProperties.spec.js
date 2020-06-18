import React from "react";
import GlobalPropertiesContainer from "./index";
import { fireEvent, waitFor } from "@testing-library/react";
import { startApiServer } from "ApiServer";
import { act } from "react-dom/test-utils";

let server;

beforeEach(() => {
  server = startApiServer();
});

afterEach(() => {
  server.shutdown();
});

describe("GlobalPropertiesContainer --- Snapshot Test", () => {
  it("Capturing Snapshot of GlobalPropertiesContainer", async () => {
    const { baseElement, getByText } = rtlRender(<GlobalPropertiesContainer />);
    await waitFor(() => getByText(/Set global properties that are available for all Workflows/i));

    expect(baseElement).toMatchSnapshot();
  });
});

describe("GlobalPropertiesContainer --- RTL", () => {
  it("rtlRender the table and search correctly", async () => {
    const { getByText, getByPlaceholderText, queryAllByText } = rtlRender(<GlobalPropertiesContainer />);
    await waitFor(() => getByText(/Set global properties that are available for all Workflows/i));
    expect(queryAllByText(/Test property/i).length).toBe(1);
    const searchProperty = getByPlaceholderText(/Search/i);
    act(() => {
      fireEvent.change(searchProperty, { target: { value: "2" } });
    });
    expect(queryAllByText(/Test property/i).length).toBe(0);
    act(() => {
      fireEvent.change(searchProperty, { target: { value: "Test" } });
    });
    expect(queryAllByText(/Test property/i).length).toBe(1);
  });

  it("Opens create property modal", async () => {
    const { getByTestId, queryByText, getByText } = rtlRender(<GlobalPropertiesContainer />);
    await waitFor(() => getByText(/Set global properties that are available for all Workflows/i));

    expect(queryByText(/CREATE PROPERTY/)).not.toBeInTheDocument();

    const modalTrigger = getByTestId("create-global-configurations-property-button");
    act(() => {
      fireEvent.click(modalTrigger);
    });

    expect(queryByText(/Cancel/)).toBeInTheDocument();
  });

  it("Opens edit property modal", async () => {
    const { findByText, queryByText, getByTestId, getAllByTestId, getByText } = rtlRender(
      <GlobalPropertiesContainer />
    );
    await waitFor(() => getByText(/Set global properties that are available for all Workflows/i));
    expect(queryByText(/EDIT TEST RTL/i)).not.toBeInTheDocument();
    act(() => {
      fireEvent.mouseOver(getAllByTestId("configuration-property-table-row")[0]);
    });
    const actionsMenu = getAllByTestId("configuration-property-table-overflow-menu")[0];
    act(() => {
      fireEvent.click(actionsMenu);
    });
    const modalTrigger = await findByText(/Edit/i);
    act(() => {
      fireEvent.click(modalTrigger);
    });
    expect(queryByText(/Edit Test property/i)).toBeInTheDocument();
  });

  it("Opens delete property modal", async () => {
    const { findByText, queryByText, getByTestId, getByText, getAllByTestId } = rtlRender(
      <GlobalPropertiesContainer />
    );
    await waitFor(() => getByText(/Set global properties that are available for all Workflows/i));
    expect(queryByText(/DELETE TEST RTL/i)).not.toBeInTheDocument();
    act(() => {
      fireEvent.mouseOver(getAllByTestId("configuration-property-table-row")[0]);
    });
    const actionsMenu = getAllByTestId("configuration-property-table-overflow-menu")[0];
    act(() => {
      fireEvent.click(actionsMenu);
    });
    const modalTrigger = await findByText(/Delete/i);
    act(() => {
      fireEvent.click(modalTrigger);
    });
    expect(queryByText(/Delete Test property?/i)).toBeInTheDocument();
  });
});
