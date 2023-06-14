import React from "react";
import { startApiServer } from "ApiServer";
import { teams, profile } from "ApiServer/fixtures";
import { AppContextProvider } from "State/context";
import TeamCard from "./index";

const props = {
  team: teams[0],
};

let server;

beforeEach(() => {
  server = startApiServer({ environment: "test" });
});

afterEach(() => {
  server.shutdown();
});

describe("TeamCard --- Snapshot", () => {
  it("Capturing Snapshot of TeamCard", () => {
    const { baseElement } = rtlContextRouterRender(
      <AppContextProvider
        value={{
          isTutorialActive: false,
          setIsTutorialActive: () => {},
          user: profile,
          teams,
        }}
      >
        <TeamCard {...props} />
      </AppContextProvider>
    );
    expect(baseElement).toMatchSnapshot();
  });
});
