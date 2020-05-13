import React from "react";

const AppContext = React.createContext({
  user: {},
  teamsQuery: {},
  teams: [],
  activeTeam: null,
  setActiveTeam: () => {},
  onBoardShow: false,
  setOnBoardShow: () => {},
  refetchTeams: () => {}
});
export default AppContext;
