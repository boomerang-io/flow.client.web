import React from "react";
import PlatformRoleModal from "./index";
import { UserPlatformRole } from "Constants/userPlatformRoles";

const roles = [
  UserPlatformRole.Admin,
  UserPlatformRole.Auditor,
  UserPlatformRole.Operator,
  UserPlatformRole.User,
].map((option) => ({ id: option, name: option }));

const user = {
  id: "5b5903476229d60001ab362e",
  name: "Tim Bula",
  role: "admin",
};

describe("User Detailed - PlatformRoleModal --- Snapshot", () => {
  it("+++ renders correctly", () => {
    const { baseElement } = renderWithRouter(
      <PlatformRoleModal user={user} role={roles[0].name} closeModal={jest.fn()} roles={roles} cancelRequestRef={{}} />
    );
    expect(baseElement).toMatchSnapshot();
  });
});
