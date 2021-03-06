const manageUsers = {
  totalPages: 1,
  totalElements: 2,
  last: true,
  sort: [
    {
      direction: "ASC",
      property: "firstLoginDate",
      ignoreCase: false,
      nullHandling: "NATIVE",
      descending: false,
      ascending: true,
    },
  ],
  first: true,
  numberOfElements: 2,
  size: 100,
  number: 0,
  records: [
    {
      id: "5f170b3df6ab327e302cb0a5",
      email: "trbula@us.ibm.com",
      name: "Tim Bula",
      isFirstVisit: true,
      type: "admin",
      firstLoginDate: "2020-07-21T15:35:25.369+00:00",
      lastLoginDate: "2020-07-21T15:35:25.369+00:00",
      flowTeams: [],
      status: "active",
    },
    {
      id: "kg3p380ad09662744c240e47",
      email: "mdroy@us.ibm.com",
      name: "Marcus Roy",
      isFirstVisit: true,
      type: "admin",
      firstLoginDate: "2020-07-21T15:35:25.369+00:00",
      lastLoginDate: "2020-07-21T15:35:25.369+00:00",
      flowTeams: [],
      status: "active",
    },
  ],
};

export default manageUsers;
