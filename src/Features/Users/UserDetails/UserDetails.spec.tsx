import React from "react";
import UserDetails from ".";
import { waitFor } from "@testing-library/react";
import { FlowUser, PlatformRole, UserStatus } from "Types";

const user: FlowUser = {
  id: "1234",
  email: "test@testemail.com",
  name: "Test User",
  ifFirstVisit: true,
  type: PlatformRole.Admin,
  firstLoginDate: "2020-07-21T15:35:25.369+00:00",
  lastLoginDate: "2020-07-21T15:35:25.369+00:00",
  flowTeams: [],
  status: UserStatus.Active,
  platformRole: "user",
};

describe("UserDetails --- Snapshot Test", () => {
  it("Capturing Snapshot of UserDetails", async () => {
    const { baseElement } = global.rtlContextRouterRender(<UserDetails user={user}/>);
    expect(baseElement).toMatchSnapshot();
    await waitFor(() => {});
  });
});
