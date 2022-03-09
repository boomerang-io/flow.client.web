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
