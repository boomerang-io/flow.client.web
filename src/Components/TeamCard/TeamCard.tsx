import React, { useState } from "react";
import { useMutation, useQueryClient } from "react-query";
import { Link, useHistory } from "react-router-dom";
import { InlineLoading, OverflowMenu, OverflowMenuItem } from "@carbon/react";
import { ConfirmModal, ToastNotification, notify } from "@boomerang-io/carbon-addons-boomerang-react";
import { appLink } from "Config/appConfig";
import { serviceUrl, resolver } from "Config/servicesConfig";
import { ArrowRight, Checkmark, Close } from "@carbon/react/icons";
import moment from "moment";
import { FlowTeam, FlowTeamSummary } from "Types";
import styles from "./teamCard.module.scss";

interface TeamCardProps {
  team: FlowTeam | FlowTeamSummary;
}

const TeamCard: React.FC<TeamCardProps> = ({ team }) => {
  const [isLeaveModalOpen, setIsLeaveModalOpen] = useState(false);
  const queryClient = useQueryClient();
  const history = useHistory();

  const leaveTeamMutator = useMutation(resolver.leaveTeam);
  const handleLeaveTeam = async () => {
    try {
      await leaveTeamMutator.mutateAsync({ id: team.id });
      notify(<ToastNotification kind="success" title={`Leave Team`} subtitle={`${team.name} successfully left`} />);
      queryClient.invalidateQueries(serviceUrl.getUserProfile());
    } catch {
      notify(<ToastNotification kind="error" title="Something's Wrong" subtitle={`Request to leave team failed`} />);
    }
  };

  let menuOptions = [
    {
      itemText: "View Workflows",
      onClick: () => history.push(appLink.workflows({ teamId: team.id })),
    },
    {
      itemText: "View Actions",
      onClick: () => history.push(appLink.actions({ teamId: team.id })),
    },
    {
      itemText: "View Activity",
      onClick: () => history.push(appLink.activity({ teamId: team.id })),
    },
    {
      itemText: "Manage Team",
      onClick: () => history.push(appLink.manageTeam({ teamId: team.id })),
    },
    {
      hasDivider: true,
      itemText: "Leave",
      isDelete: true,
      onClick: () => setIsLeaveModalOpen(true),
      disabled: false,
    },
  ];

  return (
    <div className={styles.container}>
      <Link to={!leaveTeamMutator.isLoading ? appLink.workflows({ teamId: team.id }) : ""}>
        <div className={styles.content}>
          <h1 title={team.name} className={styles.name} data-testid="workflow-card-title">
            {team.name}
          </h1>
          {/* TODO - change name to display name and put the name slug underneath in small font */}
          <div className={styles.details}>
            <div className={styles.detailItem}>
              <div className={styles.detailLabel}>Workflows</div>
              <div className={styles.detailValue}>{team.insights.workflows}</div>
            </div>
            <div className={styles.detailItem}>
              <div className={styles.detailLabel}>Members</div>
              <div className={styles.detailValue}>{team.insights.members}</div>
            </div>
            <div className={styles.detailItem}>
              <div className={styles.detailLabel}>Status</div>
              <div className={styles.detailValue}>
                {leaveTeamMutator.isLoading ? (
                  <InlineLoading
                    description="Leaving.."
                    style={{ position: "absolute", right: "0.5rem", top: "0", width: "fit-content" }}
                  />
                ) : (
                  <div className={styles.detailStatus}>
                    {team.status === "active" ? (
                      <Checkmark style={{ fill: "#009d9a" }} />
                    ) : (
                      <Close style={{ fill: "#da1e28" }} />
                    )}
                    <p>{team.status === "active" ? "Active" : "Inactive"}</p>
                  </div>
                )}
              </div>
            </div>
            <div className={styles.detailItem}>
              <div className={styles.detailLabel}>Creation Date</div>
              <div className={styles.detailValue}>{moment(team.creationDate).format("YYYY-MM-DD")}</div>
            </div>
          </div>
        </div>
        <ArrowRight size={24} className={styles.cardIcon} />
      </Link>
      {!leaveTeamMutator.isLoading ? (
        <OverflowMenu
          flipped
          ariaLabel="Overflow card menu"
          iconDescription="Overflow menu icon"
          style={{ position: "absolute", right: "0" }}
        >
          {menuOptions.map(({ onClick, itemText, ...rest }, index) => (
            <OverflowMenuItem onClick={onClick} itemText={itemText} key={`${itemText}-${index}`} {...rest} />
          ))}
        </OverflowMenu>
      ) : null}
      {isLeaveModalOpen && (
        <ConfirmModal
          affirmativeAction={handleLeaveTeam}
          affirmativeButtonProps={{ kind: "danger" }}
          affirmativeText="Leave"
          isOpen={isLeaveModalOpen}
          negativeAction={() => {
            setIsLeaveModalOpen(false);
          }}
          negativeText="Cancel"
          onCloseModal={() => {
            setIsLeaveModalOpen(false);
          }}
          title={`Leave Team`}
        >
          {`Are you sure you want to leave Team (${team.name})? There's no going back from this decision.`}
        </ConfirmModal>
      )}
    </div>
  );
};

export default TeamCard;
