import React from "react";
import { PrivacyStatement } from "./index";
import renderer from "react-test-renderer";
import { actions as consentFormActions } from "State/privacyStatement/consentForm";
import { actions as consentResponseActions } from "State/privacyStatement/consentResponse";
import { actions as userActions } from "State/user";

jest.mock("@boomerang/boomerang-components/lib/Modal", () => "Modal");

export const consentFormData = {
  id: "1",
  version: 1,
  formContent: {
    sections: [
      {
        title: "test",
        content: "test"
      },
      {
        title: "test",
        content: "test"
      },
      {
        title: "test",
        content: "test"
      },
      {
        title: "test",
        content: "test"
      }
    ]
  },
  effectiveDate: 1504627139000
};

export const consentForm = {
  isFetching: false,
  status: "success",
  data: consentFormData
};

let component;

describe(" PrivacyStatement Component --- Snapshot", () => {
  component = renderer.create(
    <PrivacyStatement
      isOpen={true}
      consentForm={consentForm}
      consentResponse={{}}
      consentFormActions={consentFormActions}
      consentResponseActions={consentResponseActions}
      userActions={userActions}
      user={{ data: {} }}
      baseServiceUrl="test"
    />
  );
  expect(component).toMatchSnapshot();
});

describe(" PrivacyStatement Component --- Shallow render", () => {
  beforeEach(() => {
    component = shallow(
      <PrivacyStatement
        isOpen={true}
        consentForm={consentForm}
        consentResponse={{}}
        consentFormActions={consentFormActions}
        consentResponseActions={consentResponseActions}
        userActions={userActions}
        user={{ data: {} }}
        baseServiceUrl="test"
      />
    );
  });

  it("+++ Check if component renders", () => {
    expect(component.length).toEqual(1);
  });
});
