import React from "react";
import { useQuery } from "react-query";
import { useHistory } from "react-router-dom";
import { Helmet } from "react-helmet";
import { useAppContext } from "Hooks";
import ApproverGroupsTable from "./ApproverGroupsTable";
import { serviceUrl, resolver } from "Config/servicesConfig";
import { appLink } from "Config/appConfig";
import { FlowTeam } from "Types";
import styles from "./approverGroups.module.scss";

function ApproverGroups() {
  const history = useHistory();
  const { activeTeam } = useAppContext();

  const ApproverGroupsUrl = serviceUrl.resourceApproverGroups({ teamId: activeTeam?.id, groupId: undefined });
  const { data, isLoading, error } = useQuery({
    queryKey: ApproverGroupsUrl,
    queryFn: resolver.query(ApproverGroupsUrl),
    enabled: Boolean(activeTeam?.id),
  });

  /** Check if there is an active team or redirec to home */
  if (!activeTeam) {
    return history.push(appLink.home());
  }

  const userCanEdit = true;

  return (
    <div className={styles.container}>
      <Helmet>
        <title>Team Approvers</title>
      </Helmet>
      <ApproverGroupsTable
        activeTeam={activeTeam}
        approverGroups={data}
        userCanEdit={userCanEdit}
        isLoading={isLoading}
        error={error}
      />
    </div>
  );
}

export default ApproverGroups;
