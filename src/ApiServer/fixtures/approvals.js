const approvals = {
  pageable: {
    number: 0,
    size: 2147483647,
    sort: [
      {
        property: "creationDate",
        direction: "ASC",
      },
    ],
    totalElements: 4,
    first: true,
    last: true,
    totalPages: 1,
    numberOfElements: 4,
  },
  content: [
    {
      id: "61300607db7b5f610be7346d",
      workflowRunRef: "61300607db7b5f610be7346b",
      taskRunRef: "61300607db7b5f610be7346c",
      workflowRef: "613005eddb7b5f610be73468",
      teamRef: null,
      status: "submitted",
      type: "approval",
      creationDate: "2021-05-20T12:12:58.963+0000",
      taskName: "Manual Approval 1",
      workflowName: "Test Action 1",
      numberOfApprovals: 1,
      approvalsRequired: 2,
      actioners: [
        {
          approverId: "59aebd0c7424530fce952fff",
          approverEmail: "panda@ibm.com",
          approverName: "Panda",
          comments: "I can't in good conscience approve this.",
          date: "2021-09-15T18:49:13.831+00:00",
          approved: false,
        },
      ],
      teamName: null,
      instructions: null,
    },
    {
      id: "61300607db7b5f610be734asd",
      workflowRunRef: "61300607db7b5f610be7346b",
      taskRunRef: "61300607db7b5f610be7346c",
      workflowRef: "613005eddb7b5f610be73468",
      teamId: null,
      status: "approved",
      type: "approval",
      creationDate: "2021-07-20T12:12:58.963+0000",
      taskName: "Manual Approval 2",
      workflowName: "Test Action 2",
      numberOfApprovals: 4,
      approvalsRequired: 4,
      actioners: [
        {
          approverId: "59aebd0c7424530fce952fff",
          approverEmail: "panda@ibm.com",
          approverName: "Panda",
          comments: "I can't in good conscience approve this.",
          date: "2021-09-15T18:49:13.831+00:00",
          approved: false,
        },
        {
          approverId: "59aebd0c7424530fce952fee",
          approverEmail: "puppy@ibm.com",
          approverName: "Puppy",
          comments: "This looks good for me.",
          date: "2021-09-15T18:49:13.831+00:00",
          approved: true,
        },
        {
          approverId: "59aebd0c7424530fce952fle",
          approverEmail: "super.monkey@ibm.com",
          approverName: "Monkey",
          comments:
            "ook, hoo hoo hoo hoo, oo oo oo, ooooooo hooooooo ook ook hoohooo ooo, oo, ooo oo oo oo, hoooo hooooo oooooo hoo oook oko ook ook oook hooo ooo oo o oo ooo",
          date: "2021-09-15T18:49:13.831+00:00",
          approved: true,
        },
        {
          approverId: "59aebd0c7424530fce952fpe",
          approverEmail: "kitten@ibm.com",
          approverName: "Kitten",
          comments: "meow",
          date: "2021-09-15T18:49:13.831+00:00",
          approved: true,
        },
        {
          approverId: "59aebd0c7424530fce952fpe",
          approverEmail: "manager@ibm.com",
          approverName: "Manager",
          comments: "Monkey and Kitten, language!",
          date: "2021-09-15T18:49:13.831+00:00",
          approved: true,
        },
      ],
      teamName: "Team 2",
      instructions: null,
    },
    {
      id: "61300607db7b5f610be734245",
      workflowRunRef: "61300607db7b5f610be7346b",
      taskRunRef: "61300607db7b5f610be7346c",
      workflowRef: "613005eddb7b5f610be73468",
      teamId: null,
      status: "rejected",
      type: "approval",
      creationDate: "2021-08-30T12:12:58.963+0000",
      taskName: "Manual Approval 3",
      workflowName: "Test Action 3",
      numberOfApprovals: 2,
      approvalsRequired: 3,
      actioners: [
        {
          approverId: "59aebd0c7424530fce952fff",
          approverEmail: "panda@ibm.com",
          approverName: "Panda",
          comments: "I can't in good conscience approve this.",
          date: "2021-09-15T18:49:13.831+00:00",
          approved: false,
        },
        {
          approverId: "59aebd0c7424530fce952fee",
          approverEmail: "puppy@ibm.com",
          approverName: "Puppy",
          comments: "Cool",
          date: "2021-09-15T18:49:13.831+00:00",
          approved: true,
        },
        {
          approverId: "59aebd0c7424530fce952fpe",
          approverEmail: "kitten@ibm.com",
          approverName: "Kitten",
          comments: "Purrrfect",
          date: "2021-09-15T18:49:13.831+00:00",
          approved: true,
        },
      ],
      teamName: null,
      instructions: null,
    },
    {
      id: "61300607db7b5f610be7346asdd",
      workflowRunRef: "61300607db7b5f610be7346b",
      taskRunRef: "61300607db7b5f610be7346c",
      workflowRef: "613005eddb7b5f610be73468",
      teamRef: null,
      status: "submitted",
      type: "approval",
      creationDate: "2021-08-24T12:12:58.963+0000",
      taskName: "Manual Approval 4",
      workflowName: "Test Action 4",
      teamName: "Team 4",
      numberOfApprovals: 3,
      approvalsRequired: 3,
      actioners: [
        {
          approverId: "59aebd0c7424530fce952fde",
          approverEmail: "trbula@us.ibm.com",
          approverName: "Timothy Bula",
          comments: null,
          date: "2021-09-15T18:49:13.831+00:00",
          approved: true,
        },
        {
          approverId: "59aebd0c7424530fce952fff",
          approverEmail: "panda@ibm.com",
          approverName: "Panda",
          comments: "Nice!",
          date: "2021-09-15T18:49:13.831+00:00",
          approved: true,
        },
        {
          approverId: "59aebd0c7424530fce952fee",
          approverEmail: "puppy@ibm.com",
          approverName: "Puppy",
          comments: "Woof!",
          date: "2021-09-15T18:49:13.831+00:00",
          approved: true,
        },
      ],
      instructions: null,
    },
  ],
};

export default approvals;
