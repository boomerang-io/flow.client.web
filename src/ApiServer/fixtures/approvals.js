const approvals = {
  pageable: {
    number: 0,
    size: 2147483647,
    sort: [
      {
        property: "creationDate",
        direction: "ASC"
      }
    ],
    totalElements: 3,
    first: true,
    last: true,
    totalPages: 1,
    numberOfElements: 3
  },
  records: [
    {
      id: "61300607db7b5f610be7346d",
      activityId: "61300607db7b5f610be7346b",
      taskActivityId: "61300607db7b5f610be7346c",
      workflowId: "613005eddb7b5f610be73468",
      teamId: null,
      audit: null,
      status: "submitted",
      type: "approval",
      creationDate: "2021-05-20T12:12:58.963+0000",
      taskName: "Manual Approval 1",
      workflowName: "Test Action 1",
      inputRequired: "required",
      teamName: null,
      instructions: null
    },
    {
      id: "61300607db7b5f610be734asd",
      activityId: "61300607db7b5f610be7346b",
      taskActivityId: "61300607db7b5f610be7346c",
      workflowId: "613005eddb7b5f610be73468",
      teamId: null,
      audit: null,
      status: "approved",
      type: "approval",
      creationDate: "2021-07-20T12:12:58.963+0000",
      taskName: "Manual Approval 2",
      workflowName: "Test Action 2",
      inputRequired: "none",
      teamName: null,
      instructions: null
    },
    {
      id: "61300607db7b5f610be734245",
      activityId: "61300607db7b5f610be7346b",
      taskActivityId: "61300607db7b5f610be7346c",
      workflowId: "613005eddb7b5f610be73468",
      teamId: null,
      audit: null,
      status: "rejected",
      type: "approval",
      creationDate: "2021-08-30T12:12:58.963+0000",
      taskName: "Manual Approval 3",
      workflowName: "Test Action 3",
      inputRequired: "none",
      teamName: null,
      instructions: null
    },
    {
      id: "61300607db7b5f610be7346asdd",
      activityId: "61300607db7b5f610be7346b",
      taskActivityId: "61300607db7b5f610be7346c",
      workflowId: "613005eddb7b5f610be73468",
      teamId: null,
      audit: null,
      status: "submitted",
      type: "approval",
      creationDate: "2021-08-24T12:12:58.963+0000",
      taskName: "Manual Approval 4",
      workflowName: "Test Action 4",
      teamName: "Team 4",
      inputRequired: "optional",
      submittedApproversUserIds: ["59aebd0c7424530fce952fde"],
      instructions: null
    },
  ]
};

export default approvals;
