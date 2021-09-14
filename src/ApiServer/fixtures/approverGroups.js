const approverGroups = [
  {
    groupId: "1",
    groupName: "Test approver 1",
    teamId: "5a8b331e262a70306622df72",
    teamName: "ISE Core",
    approvers: [
     {
       userId: "5b69f3adf170ce00018106b6",
       userEmail: "isabela.kawabata@ibm.com",
       userName: "Isabela Mayumi Kawabata Borges",
     },
     {
       userId: "5b6306564bd080000168f0f0",
       userEmail: "lucas.grimauth@ibm.com",
       userName: "Lucas Grimauth Evangelista",
     }
    ]
  },
  {
   groupId: "2",
   groupName: "New amazing approver group",
   teamId: "5a8b331e262a70306622df72",
   teamName: "ISE Core",
   approvers: [
    {
      userId: "5b69f3adf170ce00018106b6",
      userEmail: "isabela.kawabata@ibm.com",
      userName: "Isabela Mayumi Kawabata Borges",
    },
    {
      userId: "5b6306564bd080000168f0f0",
      userEmail: "lucas.grimauth@ibm.com",
      userName: "Lucas Grimauth Evangelista",
    },
    {
     userId: "5b85516579ab9f0001097480",
     userEmail: "amhudson@us.ibm.com",
     userName: "Adrienne Hudson",
    },
    {
     userId: "1b6378a84bd080000168f0f1",
     userEmail: "mwinsby@us.ibm.com",
     userName: "Megan Winsby",
    },
    {
     userId: "5b5f97a105d83a00018bdbed",
     userEmail: "mdroy@us.ibm.com",
     userName: "Marcus Roy",
    },
    {
     userId: "5b5f802f05d83a00018bdbeb",
     userEmail: "benjamin.ruby@ibm.com",
     userName: "Benjamin Ruby",
    },
    {
     userId: "5b59176f621bbc00015656a0",
     userEmail: "twlawrie@us.ibm.com",
     userName: "Tyson Lawrie",
    },
    {
     userId: "5b590e92621bbc000156569c",
     userEmail: "gchickma@us.ibm.com",
     userName: "Glen Hickman",
    }
   ]
   },
   {
     groupId: "3",
     groupName: "Empty group",
     teamName: "IBM Services Engineering",
     teamId: "5a8b331f262a70306622df75",
     approvers: []
   },
   {
     type: "group",
     groupId: "c199f457-589a-4ca3-c23a-e7f69e4bec99",
     approvalsRequired: 1,
     groupName: "Test approver group",
     approvers: [
         {
             "type": "individual",
             "userId": "59aebd0b7424530fce952fdd",
             "userName": "Tyson Lawrie",
             "userEmail": "boomerang@us.ibm.com",
             "required": false
         },
         {
             "type": "individual",
             "userId": "59aebd0b7424530fce952fdc",
             "userName": "Glen Hickman",
             "userEmail": "gchickma@us.ibm.com",
             "required": false
         }
     ]
 }
 ];
 
 export default approverGroups;
 