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
  CARDS: 1,
  FILTER: 2,
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
    message: "See all of your workflows by team and execute them."
  },
  search_filter: {
    containerClassName: "c-onboard-screen--search_filter",
    title: "Search and Filter",
    message: "Search a workflow's name or filter workflows by team."
  },
  sidenav: {
    containerClassName: "c-onboard-screen--sidenav",
    title: "Sidenav",
    message: "Access the different screens of Boomerang Flow."
  }
};

export const designerGuideConfig = {
  overview: {
    containerClassName: "c-onboard-screen--overview",
    title: "Overview",
    message: "Check and update general information about the workflow, set triggers, and configure options."
  },
  inputs: {
    containerClassName: "c-onboard-screen--inputs",
    title: "Properties",
    message: "Edit and delete input properties that can be used by the workflow as it executes steps."
  },
  design: {
    containerClassName: "c-onboard-screen--design",
    title: "Design",
    message: "Create your workflow using plugins and utlities."
  },
  change_log: {
    containerClassName: "c-onboard-screen--change_log",
    title: "Change Log",
    message: "See a version change log of your workflow."
  }
};

export const creatorGuideConfig = {
  general: {
    containerClassName: "c-onboard-screen--general",
    title: "General",
    message: "Configure the general properties for your workflow like name and description."
  },
  triggers: {
    containerClassName: "c-onboard-screen--triggers",
    title: "Triggers",
    message: "Set the different ways that your workflow can be triggered e.g. webhook or schedule."
  },
  options: {
    containerClassName: "c-onboard-screen--options",
    title: "Options",
    message: "Set additional options for the workflow."
  }
};

export const activityGuideConfig = {
  cards: {
    containerClassName: "c-onboard-screen--cards",
    title: "Workflow Activity",
    message: "See all of your workflow activity."
  },
  filter: {
    containerClassName: "c-onboard-screen--filter",
    title: "Filter",
    message: "Filter activity by team, workflow and trigger."
  },
  scrolling: {
    containerClassName: "c-onboard-screen--scrolling",
    title: "Infinite Scrolling",
    message: "Keep scrolling to see more activity."
  }
};

export const executionGuideConfig = {
  progress_bar: {
    containerClassName: "c-onboard-screen--progress_bar",
    title: "Progress Bar",
    message: "As your tasks complete, they will fill the progress bar."
  },
  side_info: {
    containerClassName: "c-onboard-screen--side_info",
    title: "Side Info",
    message: "See information about the completed tasks."
  },
  diagram: {
    containerClassName: "c-onboard-screen--diagram",
    title: "Workflow Diagram",
    message: "See your workflow execution in action."
  }
};
