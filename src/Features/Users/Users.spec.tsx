import React from "react";
import Users from ".";
import { Route } from "react-router-dom";
import { waitFor, screen, fireEvent } from "@testing-library/react";
import { AppPath, appLink } from "Config/appConfig";
import { startApiServer } from "ApiServer";

let server: any;

beforeEach(() => {
  server = startApiServer();
});

afterEach(() => {
  server.shutdown();
});

describe("Users --- Snapshot Test", () => {
  it("Capturing Snapshot of Users", async () => {
    const { baseElement, findByText } = global.rtlContextRouterRender(
      <Route path={AppPath.UserList}>
        <Users />
      </Route>,
      { route: appLink.userList() }
    );
    await findByText("Tim Bula");
    expect(baseElement).toMatchSnapshot();
    await waitFor(() => {});
  });
});

describe("Users --- RTL", () => {
  test("Change user role", async () => {
    global.rtlContextRouterRender(
      <Route path={AppPath.UserList}>
        <Users />
      </Route>,
      { route: appLink.userList() }
    );
    await screen.findByText(/^View and manage Flow users$/i);
    const overflowMenuButtons = await screen.findAllByTestId(/^user-menu$/i);

    fireEvent.click(overflowMenuButtons[0]);
    fireEvent.click(await screen.findByText(/^Change role$/i));
    expect(screen.getByText(/Admins can do more things/i)).toBeInTheDocument();
    expect(screen.getByText(/^Submit$/i)).toBeDisabled();
    fireEvent.click(await screen.findByText(/^User$/i));
    expect(screen.getByText(/^Submit$/i)).toBeEnabled();
    fireEvent.click(await screen.findByText(/^Submit$/i));
  });

  test("View user details", async () => {
    global.rtlContextRouterRender(
      <Route path={AppPath.UserList}>
        <Users />
      </Route>,
      { route: appLink.userList() }
    );
    await screen.findByText(/^View and manage Flow users$/i);
    const overflowMenuButtons = await screen.findAllByTestId(/^user-menu$/i);

    fireEvent.click(overflowMenuButtons[0]);
    fireEvent.click(await screen.findByText(/^View details$/i));
    expect(screen.getByText(/^# of Flow Teams/i)).toBeInTheDocument();
  });
});
