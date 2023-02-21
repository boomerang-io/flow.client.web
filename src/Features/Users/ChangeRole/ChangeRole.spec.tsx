import { vi } from "vitest";
import ChangeRole from ".";
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

describe("ChangeRole --- Snapshot Test", () => {
  it("Capturing Snapshot of ChangeRole", async () => {
    const { baseElement } = global.rtlContextRouterRender(
      <ChangeRole user={user} cancelRequestRef={{}} closeModal={vi.fn()} />
    );
    expect(baseElement).toMatchSnapshot();
  });
});
