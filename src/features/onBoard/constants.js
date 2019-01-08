//constants
export const homeScreens = {
  WELCOME: 0,
  TEAMS: 1,
  SEARCH_FILTER: 2,
  SIDENAV: 3,
  DONE: 4,
  RETURN: 5
};

export const designerScreens = {
  WELCOME: 0,
  OVERVIEW: 1,
  INPUTS: 2,
  DESIGN: 3,
  CHANGE_LOG: 4,
  DONE: 5,
  RETURN: 6
};

export const creatorScreens = {
  WELCOME: 0,
  GENERAL: 1,
  TRIGGERS: 2,
  OPTIONS: 3,
  DONE: 4,
  RETURN: 5
};

export const activityScreens = {
  WELCOME: 0,
  FILTER: 1,
  CARDS: 2,
  SCROLLING: 3,
  DONE: 4,
  RETURN: 5
};

export const executionScreens = {
  WELCOME: 0,
  PROGRESS_BAR: 1,
  SIDE_INFO: 2,
  DIAGRAM: 3,
  DONE: 4,
  RETURN: 5
};

export const messageConfig = {
  welcomeHome: {
    title: "Welcome to Boomerang Flow!",
    subTitle: "Want us to show you around?",
    leftButton: "No thanks",
    rightButton: "Yes, please!",
    finishButton: "",
    modalClassName: "b-onboardExp-screen--hidden",
    contentClassName: "b-onboardExp-content",
    finishImgsClassName: "b-onboardExp-screen--hidden",
    finishButtonClassName: "b-onboardExp-screen--hidden",
    finishSubTitle: "",
    finishQuestionMark: "",
    subtitleClassName: "b-onboardExp__subtitle",
    buttonsClassName: "b-onboardExp__buttons"
  },
  welcomeDesigner: {
    title: "Welcome to the Designer Editor!",
    subTitle: "Want us to show you around?",
    leftButton: "No thanks",
    rightButton: "Yes, please!",
    finishButton: "",
    modalClassName: "b-onboardExp-screen--hidden",
    contentClassName: "b-onboardExp-content",
    finishImgsClassName: "b-onboardExp-screen--hidden",
    finishButtonClassName: "b-onboardExp-screen--hidden",
    finishSubTitle: "",
    finishQuestionMark: "",
    subtitleClassName: "b-onboardExp__subtitle",
    buttonsClassName: "b-onboardExp__buttons"
  },
  welcomeCreator: {
    title: "Welcome to the Workflow Creator!",
    subTitle: "Want us to show you around?",
    leftButton: "No thanks",
    rightButton: "Yes, please!",
    finishButton: "",
    modalClassName: "b-onboardExp-screen--hidden",
    contentClassName: "b-onboardExp-content",
    finishImgsClassName: "b-onboardExp-screen--hidden",
    finishButtonClassName: "b-onboardExp-screen--hidden",
    finishSubTitle: "",
    finishQuestionMark: "",
    subtitleClassName: "b-onboardExp__subtitle",
    buttonsClassName: "b-onboardExp__buttons"
  },
  welcomeActivity: {
    title: "Welcome to Workflows Activity!",
    subTitle: "Want us to show you around?",
    leftButton: "No thanks",
    rightButton: "Yes, please!",
    finishButton: "",
    modalClassName: "b-onboardExp-screen--hidden",
    contentClassName: "b-onboardExp-content",
    finishImgsClassName: "b-onboardExp-screen--hidden",
    finishButtonClassName: "b-onboardExp-screen--hidden",
    finishSubTitle: "",
    finishQuestionMark: "",
    subtitleClassName: "b-onboardExp__subtitle",
    buttonsClassName: "b-onboardExp__buttons"
  },
  welcomeExecution: {
    title: "Welcome to Workflow Execution!",
    subTitle: "Want us to show you around?",
    leftButton: "No thanks",
    rightButton: "Yes, please!",
    finishButton: "",
    modalClassName: "b-onboardExp-screen--hidden",
    contentClassName: "b-onboardExp-content",
    finishImgsClassName: "b-onboardExp-screen--hidden",
    finishButtonClassName: "b-onboardExp-screen--hidden",
    finishSubTitle: "",
    finishQuestionMark: "",
    subtitleClassName: "b-onboardExp__subtitle",
    buttonsClassName: "b-onboardExp__buttons"
  },
  done: {
    title: "Huzzah! Now let’s get to work.",
    subTitle: "Click ",
    leftButton: "",
    rightButton: "",
    finishButton: "Sounds good",
    modalClassName: "b-onboardExp-screen--hidden",
    contentClassName: "b-onboardExp-screen--hidden",
    finishImgsClassName: "b-onboardExp-finish",
    finishImgClassName: "b-onboardExp-screen--hidden",
    finishButtonClassName: "b-onboardExp-content",
    finishSubTitle: " in the navigation bar to return to this tutorial",
    finishQuestionMark: "?",
    subtitleClassName: "b-onboardExp-screen",
    buttonsClassName: "b-onboardExp-finish__buttons"
  },
  return: {
    title: "No worries, maybe next time.",
    subTitle: "Click ",
    leftButton: "",
    rightButton: "",
    finishButton: "Sounds good",
    modalClassName: "b-onboardExp-screen--hidden",
    contentClassName: "b-onboardExp-screen--hidden",
    finishImgsClassName: "b-onboardExp-finish",
    finishImgClassName: "b-onboardExp-screen--hidden",
    finishButtonClassName: "b-onboardExp-content",
    finishSubTitle: " in the navigation bar to return to this tutorial",
    finishQuestionMark: "?",
    subtitleClassName: "b-onboardExp-screen",
    buttonsClassName: "b-onboardExp-finish__buttons"
  }
};

export const homeGuideConfig = {
  teams: {
    containerClassName: "c-onboard-screen--teams",
    title: "Teams' workflows",
    message: "Here you can create, edit, delete, check activity and execute all teams' workflows"
  },
  search_filter: {
    containerClassName: "c-onboard-screen--search_filter",
    title: "Search and Filter",
    message: "Search a workflow's name or filter workflows by team"
  },
  sidenav: {
    containerClassName: "c-onboard-screen--sidenav",
    title: "Sidenav",
    message: "The sidenav enables easy access to the workflows, activity, designer and insights pages"
  }
};

export const designerGuideConfig = {
  overview: {
    containerClassName: "c-onboard-screen--overview",
    title: "Overview",
    message: "Here you can check and update general information about the workflow."
  },
  inputs: {
    containerClassName: "c-onboard-screen--inputs",
    title: "Inputs",
    message: "Here you can create, edit and delete input parameters used when executing the workflow."
  },
  design: {
    containerClassName: "c-onboard-screen--design",
    title: "Design",
    message: ""
  },
  change_log: {
    containerClassName: "c-onboard-screen--change_log",
    title: "Change Log",
    message: "See a log of all changes in the workflow"
  }
};

export const creatorGuideConfig = {
  general: {
    containerClassName: "c-onboard-screen--general",
    title: "General",
    message: ""
  },
  triggers: {
    containerClassName: "c-onboard-screen--triggers",
    title: "Triggers",
    message: ""
  },
  options: {
    containerClassName: "c-onboard-screen--options",
    title: "Options",
    message: ""
  }
};

export const activityGuideConfig = {
  filter: {
    containerClassName: "c-onboard-screen--filter",
    title: "Filter",
    message: ""
  },
  cards: {
    containerClassName: "c-onboard-screen--cards",
    title: "Workflow Cards",
    message: ""
  },
  scrolling: {
    containerClassName: "c-onboard-screen--scrolling",
    title: "Infinite Scrolling",
    message: ""
  }
};

export const executionGuideConfig = {
  progress_bar: {
    containerClassName: "c-onboard-screen--progress_bar",
    title: "Progress Bar",
    message: ""
  },
  side_info: {
    containerClassName: "c-onboard-screen--side_info",
    title: "Side Info",
    message: ""
  },
  diagram: {
    containerClassName: "c-onboard-screen--diagram",
    title: "Workflow Diagram",
    message: ""
  }
};
