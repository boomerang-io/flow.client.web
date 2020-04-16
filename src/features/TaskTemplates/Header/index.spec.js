import React from "react";
import { wait } from "@testing-library/react";
import AppContext from "state/context/appContext";
import Header from "./index";

const serviceDetails = {
  id: "5b5b451536c18900018a33d1",
  icon: null,
  name: "Jenkins",
  category: "Mobile",
  version: "1.0.9",
  imageId: "test",
  documentationUrl: "http://doc.url.com",
  createdDate: null,
  dateLastUpdated: "2019-11-11T02:47:59.719+0000",
  attributes: ["Associated cost", "Third party", "Admin-only"],
  heroImage: {
    id: "1",
    filename: "name",
    description: "about me",
    alt: "shiba",
    label: "Test Img Shiba",
    src: "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcSiYlHMBwjiaaGOYD_bNdUoHU8tB58jqO9ycWS2UyIXoQ0avTdF"
  },
  productImages: [
    {
      imageId: "1",
      name: "Test Img Panda",
      src: "https://cdnbr2.img.sputniknews.com/images/1395/55/13955519.jpg",
      description: "about me"
    },
    {
      imageId: "2",
      name: "Test Img Red Panda",
      src: "https://static.hitek.fr/img/actualite/26rrbijj.jpg",
      description: "about me",
      url: "https://media.gettyimages.com/photos/giant-panda-picture-id483807166?s=2048x2048"
    },
    {
      imageId: "3",
      name: "Test Img Ferret",
      src:
        "https://media.gettyimages.com/photos/giant-panda-baby-cub-in-chengdu-area-china-picture-id539113690?s=2048x2048"
    },
    {
      imageId: "4",
      name: "Test Img Kitten",
      src: "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcSJ7PlfTZfXVNCUj18TwsBb3p6Ul6D0sdjRL3SC1AJTWcXhPucr",
      description: "about me"
    }
  ],
  description:
    "### Summary\nAs a business owner or manager, the decision to opt for offshore software development can be difficult. As anyone who has experience knows, there are advantages and disadvantages to outsourcing software development.\n### Detail\nAs a business owner or manager, the decision to opt for offshore software development can be difficult. As anyone who has experience knows, there are advantages and disadvantages to outsourcing software development. How then, do you balance the risks and rewards and come out on top? Here are five tips to ensure that you receive an excellent return on investment.\nAs a business owner or manager, the decision to opt for offshore software development can be difficult. As anyone who has experience knows, there are advantages and disadvantages to outsourcing software development. How then, do you balance the risks and rewards and come out on top? Here are five tips to ensure that you receive an excellent return on investment.\n- List item\n - List item \n - List item",
  properties: [
    {
      required: true,
      placeholder: null,
      helperText: null,
      language: null,
      disabled: null,
      defaultValue: null,
      value: "test",
      values: null,
      readOnly: false,
      id: "a8debe00-3611-431d-9cef-b7bd0296f40d",
      description: "test",
      key: "test",
      label: "test",
      type: "text",
      minValueLength: null,
      maxValueLength: null,
      options: null
    },
    {
      required: true,
      placeholder: null,
      helperText: null,
      language: null,
      disabled: null,
      defaultValue: null,
      value: "a",
      values: null,
      readOnly: false,
      id: "20200f76-e676-4737-b51b-1b5dec303060",
      description: "a",
      key: "a",
      label: "a",
      type: "text",
      minValueLength: null,
      maxValueLength: null,
      options: null
    }
  ]
};
const teams = [
  {
    id: "5b5b451536c18900018a33d1",
    lowLevelGroupId: "124",
    name: "Marcus Dev Team",
    shortName: null,
    owners: [
      {
        ownerId: "59aebd0b7424530fce952fdd",
        ownerEmail: "mdroy@us.ibm.com",
        ownerName: "Marcus Roy"
      },
      {
        ownerId: "5bbcf419ee763e00011f5c03",
        ownerEmail: "gchickma@us.ibm.com",
        ownerName: "Glen Hickman"
      },
      {
        ownerId: "59aebd0c7424530fce952fde",
        ownerEmail: "trbula@us.ibm.com",
        ownerName: "Timothy Bula"
      }
    ],
    purpose: "Marcus Dev Team",
    dateCreated: 1551910631869,
    isActive: true,
    newRelicRestApiKey: null,
    newRelicQueryKey: null,
    newRelicAccountId: null,
    requestedTools: [],
    autoApproveRequests: true,
    tools: [
      {
        id: "5c8046ec329e17000178962e",
        name: "Scorecard",
        templateId: "5994b744189c33ed8433d9fe",
        url: "https://wdc3.cloud.boomerangplatform.net/dev/apps/ci",
        dateCreated: 1551910636308,
        lowerLevelGroupId: "5c8046ec329e170001789629",
        ldapGroups: ["boomerang-marcus-dev-team"],
        lowLevelGroupName: "Team Tools",
        toolTemplate: {
          id: "5994b744189c33ed8433d9fe",
          name: "Scorecard",
          imageSrc: "scorecard",
          baseUrl: "https://wdc3.cloud.boomerangplatform.net/dev/apps/scorecard",
          type: "both",
          comments: "Boomerang Scorecard",
          dateLastUpdated: 1513696633712,
          version: "2.0",
          ldapPrefix: "boomerang",
          quota: null,
          isLicensed: false,
          isActive: true,
          requiresVPN: true,
          isExternalHosted: false,
          isExternalUserAccessible: false,
          hasQuota: false,
          hasSubSelections: false,
          hasPostOnboardAction: true,
          isAdminOnly: false,
          subSelections: [],
          validRoles: ["lead", "user"],
          defaultRole: "user"
        }
      }
    ]
  }
];
describe("Header --- Snapshot", () => {
  it("Capturing Snapshot of Header", async () => {
    const { baseElement, getByText } = global.renderWithRouter(
      <AppContext.Provider value={{ user: { teams, id: "59aebd0b7424530fce952fdd" } }}>
        <Header service={serviceDetails} />
      </AppContext.Provider>
    );
    await wait(() => expect(getByText(/Add to team/i)).toBeInTheDocument());
    expect(baseElement).toMatchSnapshot();
  });
});
