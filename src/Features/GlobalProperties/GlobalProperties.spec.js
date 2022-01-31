import React from "react";
import GlobalPropertiesContainer from "./index";
import { fireEvent } from "@testing-library/react";
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
    const { baseElement, findByText } = global.rtlQueryRender(<GlobalPropertiesContainer />);
    await findByText(/Set global parameters that are available for all Workflows/i);

    expect(baseElement).toMatchSnapshot();
  });
});

describe("GlobalPropertiesContainer --- RTL", () => {
  it("rtlQueryRender the table and search correctly", async () => {
    const { findByText, getByPlaceholderText, queryAllByText } = global.rtlQueryRender(<GlobalPropertiesContainer />);
    await findByText(/Set global parameters that are available for all Workflows/i);
    expect(queryAllByText(/Test parameter/i).length).toBe(1);
    const searchProperty = getByPlaceholderText(/Search/i);
    act(() => {
      fireEvent.change(searchProperty, { target: { value: "2" } });
    });
    expect(queryAllByText(/Test parameter/i).length).toBe(0);
    act(() => {
      fireEvent.change(searchProperty, { target: { value: "Test" } });
    });
    expect(queryAllByText(/Test parameter/i).length).toBe(1);
  });

  it("Opens create parameter modal", async () => {
    const { getByTestId, queryByText, findByText } = global.rtlQueryRender(<GlobalPropertiesContainer />);
    await findByText(/Set global parameters that are available for all Workflows/i);

    expect(queryByText(/CREATE parameter/)).not.toBeInTheDocument();

    const modalTrigger = getByTestId("create-global-parameter-button");
    act(() => {
      fireEvent.click(modalTrigger);
    });

    expect(queryByText(/Cancel/)).toBeInTheDocument();
  });

  it("Opens edit parameter modal", async () => {
    const { findByText, queryByText, getAllByTestId } = global.rtlQueryRender(<GlobalPropertiesContainer />);
    await findByText(/Set global parameters that are available for all Workflows/i);
    expect(queryByText(/EDIT TEST RTL/i)).not.toBeInTheDocument();
    act(() => {
      fireEvent.mouseOver(getAllByTestId("configuration-parameter-table-row")[0]);
    });
    const actionsMenu = getAllByTestId("configuration-parameter-table-overflow-menu")[0];
    act(() => {
      fireEvent.click(actionsMenu);
    });
    const modalTrigger = await findByText(/Edit/i);
    act(() => {
      fireEvent.click(modalTrigger);
    });
    expect(queryByText(/Edit Test parameter/i)).toBeInTheDocument();
  });

  it("Opens delete parameter modal", async () => {
    const { findByText, queryByText, getAllByTestId } = global.rtlQueryRender(<GlobalPropertiesContainer />);
    await findByText(/Set global parameters that are available for all Workflows/i);
    expect(queryByText(/DELETE TEST RTL/i)).not.toBeInTheDocument();
    act(() => {
      fireEvent.mouseOver(getAllByTestId("configuration-parameter-table-row")[0]);
    });
    const actionsMenu = getAllByTestId("configuration-parameter-table-overflow-menu")[0];
    act(() => {
      fireEvent.click(actionsMenu);
    });
    const modalTrigger = await findByText(/Delete/i);
    act(() => {
      fireEvent.click(modalTrigger);
    });
    expect(queryByText(/Delete Test parameter?/i)).toBeInTheDocument();
  });
});
