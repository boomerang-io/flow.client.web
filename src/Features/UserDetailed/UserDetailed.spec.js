import React from "react";
import UserDetailed from ".";
import { Route } from "react-router-dom";
import { waitFor } from "@testing-library/react";
import { queryCaches } from "react-query";
import { AppPath, appLink } from "Config/appConfig";
import { startApiServer } from "ApiServer";

jest.setTimeout(60000);
let server;

beforeEach(() => {
  server = startApiServer();
});

afterEach(() => {
  server.shutdown();
  queryCaches.forEach((queryCache) => queryCache.clear());
});

describe("UserDetailed --- Snapshot Test", () => {
  it("Capturing Snapshot of UserDetailed", async () => {
    const { baseElement, findByText } = rtlContextRouterRender(
      <Route path={AppPath.User}>
        <UserDetailed />
      </Route>,
      { route: appLink.user({ userId: "5f170b3df6ab327e302cb0a5" }) }
    );
    await findByText("These are Tim Bula's workflows");
    expect(baseElement).toMatchSnapshot();
    await waitFor(() => {});
  });
});
