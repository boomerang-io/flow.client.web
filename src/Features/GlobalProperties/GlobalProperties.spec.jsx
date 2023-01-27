import React from "react";
import GlobalPropertiesContainer from "./index";
import { screen, fireEvent } from "@testing-library/react";
import { startApiServer } from "ApiServer";

let server;

beforeEach(() => {
  server = startApiServer();
});

afterEach(() => {
  server.shutdown();
});

describe("GlobalPropertiesContainer --- Snapshot Test", () => {
  it("Capturing Snapshot of GlobalPropertiesContainer", async () => {
    const { baseElement } = global.rtlQueryRender(<GlobalPropertiesContainer />);
    await screen.findByText(/Set global parameters that are available for all Workflows/i);

    expect(baseElement).toMatchSnapshot();
  });
});

describe("GlobalPropertiesContainer --- RTL", () => {
  it("rtlQueryRender the table and search correctly", async () => {
    global.rtlQueryRender(<GlobalPropertiesContainer />);
    await screen.findByText(/Set global parameters that are available for all Workflows/i);
    expect(screen.queryAllByText(/Test parameter/i).length).toBe(1);
    const searchProperty = screen.getByPlaceholderText(/Search/i);

    fireEvent.change(searchProperty, { target: { value: "2" } });

    expect(screen.queryAllByText(/Test parameter/i).length).toBe(0);

    fireEvent.change(searchProperty, { target: { value: "Test" } });

    expect(screen.queryAllByText(/Test parameter/i).length).toBe(1);
  });

  it("Opens create parameter modal", async () => {
    global.rtlQueryRender(<GlobalPropertiesContainer />);
    await screen.findByText(/Set global parameters that are available for all Workflows/i);

    expect(screen.queryByText(/CREATE parameter/)).not.toBeInTheDocument();

    const modalTrigger = screen.getByTestId("create-global-parameter-button");

    fireEvent.click(modalTrigger);

    expect(screen.getByText(/Cancel/)).toBeInTheDocument();
  });

  it("Opens edit parameter modal", async () => {
    global.rtlQueryRender(<GlobalPropertiesContainer />);
    await screen.findByText(/Set global parameters that are available for all Workflows/i);
    expect(screen.queryByText(/EDIT TEST RTL/i)).not.toBeInTheDocument();

    fireEvent.mouseOver(screen.getAllByTestId("configuration-parameter-table-row")[0]);

    const actionsMenu = screen.getAllByTestId("configuration-parameter-table-overflow-menu")[0];

    fireEvent.click(actionsMenu);

    const modalTrigger = await screen.findByText(/Edit/i);

    fireEvent.click(modalTrigger);

    expect(screen.getByText(/Edit Test parameter/i)).toBeInTheDocument();
  });

  it("Opens delete parameter modal", async () => {
    global.rtlQueryRender(<GlobalPropertiesContainer />);
    await screen.findByText(/Set global parameters that are available for all Workflows/i);
    expect(screen.queryByText(/DELETE TEST RTL/i)).not.toBeInTheDocument();

    fireEvent.mouseOver(screen.getAllByTestId("configuration-parameter-table-row")[0]);

    const actionsMenu = screen.getAllByTestId("configuration-parameter-table-overflow-menu")[0];

    fireEvent.click(actionsMenu);

    const modalTrigger = await screen.findByText(/Delete/i);

    fireEvent.click(modalTrigger);

    expect(screen.getByText(/Delete Test parameter?/i)).toBeInTheDocument();
  });
});
