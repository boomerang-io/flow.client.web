const flowNavigation = [
  {
    name: "Home",
    type: "link",
    icon: "Home",
    link: "/BMRG_APP_ROOT_CONTEXT/home",
  },
  {
    type: "divider",
  },
  {
    name: "Workflows",
    type: "link",
    link: "/BMRG_APP_ROOT_CONTEXT/workflows",
  },
  {
    name: "Activity",
    type: "link",
    icon: "Activity",
    link: "/BMRG_APP_ROOT_CONTEXT/activity",
  },
  {
    name: "Actions",
    type: "link",
    icon: "Stamp",
    link: "/BMRG_APP_ROOT_CONTEXT/actions",
  },
  {
    disabled: true,
    name: "Schedules",
    type: "link",
    icon: "CalendarHeatMap",
    link: "/BMRG_APP_ROOT_CONTEXT/schedules",
  },
  {
    name: "Insights",
    type: "link",
    icon: "ChartScatter",
    link: "/BMRG_APP_ROOT_CONTEXT/insights",
  },
  {
    type: "divider",
  },
  {
    name: "Task Manager",
    type: "link",
    icon: "TaskSettings",
    link: "/BMRG_APP_ROOT_CONTEXT/manage/team",
  },
  {
    name: "Tokens",
    type: "link",
    icon: "Password",
    link: "/BMRG_APP_ROOT_CONTEXT/manage/tokens",
  },
  {
    name: "Manage Team",
    type: "link",
    icon: "SettingsAdjust",
    link: "/BMRG_APP_ROOT_CONTEXT/manage/team",
  },
  // {
  //   name: "Management",
  //   type: "menu",
  //   icon: "SettingsAdjust",
  //   childLinks: [
  //     {
  //       name: "Team Approvers",
  //       type: "link",
  //       link: "/BMRG_APP_ROOT_CONTEXT/manage/approver-groups",
  //     },
  //     {
  //       name: "Team Parameters",
  //       type: "link",
  //       link: "/BMRG_APP_ROOT_CONTEXT/manage/team-parameters",
  //     },
  //     {
  //       name: "Team Tasks",
  //       type: "link",
  //       link: "/BMRG_APP_ROOT_CONTEXT/manage/task-templates",
  //     },
  //     {
  //       name: "Team Tokens",
  //       type: "link",
  //       link: "/BMRG_APP_ROOT_CONTEXT/manage/team-tokens",
  //     },
  //   ],
  // },
  {
    name: "Admin",
    type: "menu",
    icon: "Settings",
    childLinks: [
      {
        name: "Teams",
        type: "link",
        link: "/BMRG_APP_ROOT_CONTEXT/admin/teams",
      },
      {
        name: "Users",
        type: "link",
        link: "/BMRG_APP_ROOT_CONTEXT/admin/users",
      },
      {
        name: "Global Parameters",
        type: "link",
        link: "/BMRG_APP_ROOT_CONTEXT/admin/parameters",
      },
      {
        name: "Global Tokens",
        type: "link",
        link: "/BMRG_APP_ROOT_CONTEXT/admin/tokens",
      },
      {
        name: "Settings",
        type: "link",
        link: "/BMRG_APP_ROOT_CONTEXT/admin/settings",
      },
      {
        name: "Task Manager",
        type: "link",
        link: "/BMRG_APP_ROOT_CONTEXT/admin/task-templates",
      },
      {
        name: "Template Workflows",
        type: "link",
        link: "/BMRG_APP_ROOT_CONTEXT/admin/template-workflows",
      },
    ],
  },
];

export default flowNavigation;
