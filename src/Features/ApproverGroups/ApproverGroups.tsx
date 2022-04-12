import React from "react";
import { useQuery } from "react-query";
import { Helmet } from "react-helmet";
import { useAppContext} from "Hooks";
import ApproverGroupsTable from "./ApproverGroupsTable";
import { serviceUrl, resolver } from "Config/servicesConfig";
import { FlowTeam } from "Types";
import styles from "./approverGroups.module.scss";

function ApproverGroups() {
  const [activeTeam, setActiveTeam] = React.useState<FlowTeam | null>(null);
  const { teams } = useAppContext();

  const ApproverGroupsUrl = serviceUrl.resourceApproverGroups({ teamId: activeTeam?.id, groupId: undefined });
  const { data, isLoading, error } = useQuery({
    queryKey: ApproverGroupsUrl,
    queryFn: resolver.query(ApproverGroupsUrl),
    enabled: Boolean(activeTeam?.id),
  });

  const userCanEdit = true;

  return (
    <div className={styles.container}>
      <Helmet>
        <title>Team Approvers</title>
      </Helmet>
      <ApproverGroupsTable
        activeTeam={activeTeam}
        approverGroups={data}
        setActiveTeam={setActiveTeam}
        teams={teams}
        userCanEdit={userCanEdit}
        isLoading={isLoading}
        error={error}
      />
    </div>
  );
}

export default ApproverGroups;
