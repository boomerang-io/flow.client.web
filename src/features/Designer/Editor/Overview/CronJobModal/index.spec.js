import React from "react";
import Overview from ".";
import { queryByAttribute } from "@testing-library/react";

const mockfn = jest.fn();

const initialState = {
  tokenTextType: "password",
  showTokenText: "Show Token",
  copyTokenText: "Copy Token",
  errors: {},
};

const props = {
  advancedCron: false,
  closeModal: mockfn,
  cronExpression: "0 00 18 * * MON",
  handleOnChange: mockfn,
  setShouldConfirmModalClose: mockfn,
  timeZone: "",
};

const advancedProps = { ...props, cronExpression: "0 00 18 * * MON-WED" };

beforeEach(() => {
  document.body.setAttribute("id", "app");
});

/*describe("Settings Overview --- Snapshot Test", () => {
    it("Capturing Snapshot of Settings Overview", () => {
        const { baseElement } = rtlContextRouterRender(<Overview {...props} />, { initialState });
        expect(baseElement).toMatchSnapshot();
    });
});*/

describe("Inputs --- RTL", () => {
  it("Time properly renders", () => {
    const { getByTestId } = rtlContextRouterRender(<Overview {...props} />, { initialState });

    const timeInput = getByTestId(/time/i);
    expect(timeInput.value).toBe("18:00");
  });

  it("Day Box Checked Correctly", () => {
    const getById = queryByAttribute.bind(null, "id");
    const dom = rtlContextRouterRender(<Overview {...props} />, { initialState });

    const monday = getById(dom.container, "monday");
    expect(monday.checked).toBe(true);

    const tuesday = getById(dom.container, "tuesday");
    expect(tuesday.checked).toBe(false);
  });
  it("Day Box Checked Correctly Advanced", () => {
    const getById = queryByAttribute.bind(null, "id");
    const dom = rtlContextRouterRender(<Overview {...advancedProps} />, { initialState });

    const monday = getById(dom.container, "monday");
    expect(monday.checked).toBe(true);

    const tuesday = getById(dom.container, "tuesday");
    expect(tuesday.checked).toBe(true);

    const wednesday = getById(dom.container, "wednesday");
    expect(wednesday.checked).toBe(true);

    const sunday = getById(dom.container, "sunday");
    expect(sunday.checked).toBe(false);
  });
});
