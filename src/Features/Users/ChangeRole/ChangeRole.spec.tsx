import React from "react";
import ChangeRole from ".";
import { waitFor } from "@testing-library/react";

const user = {
  id: "1234",
  email: "test@testemail.com",
  name: "Test User",
  isFirstVisit: true,
  type: "admin",
  firstLoginDate: "2020-07-21T15:35:25.369+00:00",
  lastLoginDate: "2020-07-21T15:35:25.369+00:00",
  flowTeams: [],
  status: "active",
};

describe("ChangeRole --- Snapshot Test", () => {
  it("Capturing Snapshot of ChangeRole", async () => {
    const { baseElement } = rtlContextRouterRender(<ChangeRole user={user} />);
    expect(baseElement).toMatchSnapshot();
    await waitFor(() => {});
  });
});
