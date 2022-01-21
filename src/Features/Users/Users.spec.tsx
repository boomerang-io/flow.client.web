import React from "react";
import Users from ".";
import { Route } from "react-router-dom";
import { waitFor, screen, fireEvent } from "@testing-library/react";
import { queryCaches } from "react-query";
import { AppPath, appLink } from "Config/appConfig";
import { startApiServer } from "ApiServer";

let server;

beforeEach(() => {
  server = startApiServer();
});

afterEach(() => {
  server.shutdown();
  queryCaches.forEach((queryCache) => queryCache.clear());
});

describe("Users --- Snapshot Test", () => {
  it("Capturing Snapshot of Users", async () => {
    const { baseElement, findByText } = rtlContextRouterRender(
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
    rtlContextRouterRender(
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
    rtlContextRouterRender(
      <Route path={AppPath.UserList}>
        <Users />
      </Route>,
      { route: appLink.userList() }
    );
    await screen.findByText(/^View and manage Flow users$/i);
    const overflowMenuButtons = await screen.findAllByTestId(/^user-menu$/i);

    fireEvent.click(overflowMenuButtons[0]);
    fireEvent.click(await screen.findByText(/^View details$/i));
    expect(screen.getByText(/^Last Login$/i)).toBeInTheDocument();
  });
});
