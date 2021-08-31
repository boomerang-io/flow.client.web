import React from "react";
import CreateWorkflow from ".";
import { fireEvent } from "@testing-library/react";
import { queryCaches } from "react-query";
import { teams, profile } from "ApiServer/fixtures";
import { AppContextProvider } from "State/context";
const team = {
  id: "1234",
  name: "Lucas' team",
  workflows: [
    {
      id: "hQDkX9v",
      name: "lucas-workflow-1",
      description: "blablabla",
      status: "published",
      icon: "utility",
    },
    {
      id: "456",
      name: "lucas-workflow-2",
      description: "blablabla",
      status: "published",
      icon: "utility",
    },
    {
      id: "789",
      name: "lucas-workflow-3",
      description: "blablabla",
      status: "draft",
      icon: "secure",
    },
  ],
};

afterEach(() => {
  queryCaches.forEach((queryCache) => queryCache.clear());
});

const props = {
  team,
  teams: [team],
};

describe("CreateWorkflow --- Snapshot Test", () => {
  test("Capturing Snapshot of CreateWorkflow", () => {
    const { baseElement, getByText } = rtlContextRouterRender(
      <AppContextProvider
        value={{
          isTutorialActive: false,
          setIsTutorialActive: () => {},
          user: profile,
          teams,
        }}
      >
        <CreateWorkflow {...props} />{" "}
      </AppContextProvider>
    );
    fireEvent.click(getByText(/Create a new workflow/i));
    expect(baseElement).toMatchSnapshot();
  });
});
