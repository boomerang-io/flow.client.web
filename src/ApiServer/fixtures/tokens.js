const tokens = {
  content: [
      {
          id: "60e3a0b4e4b0c9b6e0b0b0b0",
          type: "user",
          name: "test-token-user",
          description: null,
          creationDate: "2023-07-05T04:08:52.880+00:00",
          expirationDate: null,
          valid: true,
          principal: null,
          permissions: []
      },
      {
          id: "60e3a0b4e4b0c9b6e0b0b0b1",
          type: "user",
          name: "test-token-user",
          description: null,
          creationDate: "2023-07-06T10:03:35.165+00:00",
          expirationDate: null,
          valid: true,
          principal: null,
          permissions: []
      },
      {
        id: "60e3a0b4e4b0c9b6e0b0b0b2",
          type: "team",
          name: "test-token",
          description: null,
          creationDate: "2023-07-06T10:16:16.410+00:00",
          expirationDate: null,
          valid: true,
          principal: null,
          permissions: [
            "TOKEN_READ",
            "TOKEN_DELETE"
          ]
      },
      {
        id: "60e3a0b4e4b0c9b6e0b0b0b3",
          type: "team",
          name: "test-token",
          description: null,
          creationDate: "2023-07-06T11:27:32.626+00:00",
          expirationDate: null,
          valid: false,
          principal: "64a4c82bfea180c25e229ceb",
          permissions: []
      }
  ],
  pageable: "INSTANCE",
  totalPages: 1,
  totalElements: 4,
  last: true,
  number: 0,
  size: 4,
  numberOfElements: 4,
  sort: {
      sorted: false,
      empty: true,
      unsorted: true
  },
  first: true,
  empty: false
};

export default tokens;