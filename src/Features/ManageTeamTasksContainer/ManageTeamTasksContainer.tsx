import React from "react";
import { useAppContext } from "Hooks";
import { useHistory } from "react-router-dom";
import NoTeamsRedirectPrompt from "Components/NoTeamsRedirectPrompt";
import { appLink } from "Config/appConfig";
//@ts-ignore
const ManageTeamTasksContainer: React.FC = () => {
  const { teams } = useAppContext();
  const history = useHistory();
  if (teams.length > 0) {
    history.push(appLink.manageTaskTemplates({ teamId: teams[0]?.id }));
    return null;
  } else {
    return <NoTeamsRedirectPrompt />;
  }
};

export default ManageTeamTasksContainer;
