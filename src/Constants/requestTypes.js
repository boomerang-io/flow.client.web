export const REQUEST_TYPES = {
  JOIN_TEAM: "joingroup",
  CREATE_TEAM: "creategroup",
  LEAVE_TEAM: "leavegroup",
  REMOVE_TEAM: "removegroup",
};

export const REQUEST_TYPES_TO_DISPLAY = {
  [REQUEST_TYPES.JOIN_TEAM]: "Join a Team",
  [REQUEST_TYPES.CREATE_TEAM]: "Create a Team",
  [REQUEST_TYPES.LEAVE_TEAM]: "Leave a Team",
  [REQUEST_TYPES.REMOVE_TEAM]: "Remove a Team",
};
