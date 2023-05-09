import React, { useState } from "react";
import { useAppContext } from "Hooks";
import { useMutation, useQueryClient } from "react-query";
import { Link, useHistory } from "react-router-dom";
import { InlineLoading, OverflowMenu, OverflowMenuItem } from "@carbon/react";
import { ConfirmModal, ToastNotification, notify } from "@boomerang-io/carbon-addons-boomerang-react";
import { appLink } from "Config/appConfig";
import { serviceUrl, resolver } from "Config/servicesConfig";
import { ArrowRight } from "@carbon/react/icons";
import { FlowTeam } from "Types";
import styles from "./teamCard.module.scss";

interface TeamCardProps {
  team: FlowTeam;
}

const TeamCard: React.FC<TeamCardProps> = ({ team }) => {
  const { teams } = useAppContext();
  const queryClient = useQueryClient();
  const [isLeaveModalOpen, setIsLeaveModalOpen] = useState(false);

  const history = useHistory();

  const { mutateAsync: leaveTeamMutator, isLoading: isLeaving } = useMutation(resolver.leaveTeam, {});

  const handleLeaveTeam = async () => {
    try {
      await leaveTeamMutator({ id: team.id });
      notify(<ToastNotification kind="success" title={`Leave Team`} subtitle={`${team.name} successfully left`} />);
      // @ts-ignore
      teams[specificTeamIndex].workflows = newTeamWorkflows;
      //TODO what am I setting as queryData
      // queryClient.setQueryData(serviceUrl.getTeams(), teams);
      queryClient.invalidateQueries(serviceUrl.getTeams());
    } catch {
      notify(<ToastNotification kind="error" title="Something's Wrong" subtitle={`Request to leave team failed`} />);
    }
  };

  let menuOptions = [
    {
      itemText: "Workflows",
      onClick: () => history.push(appLink.workflows({ teamId: team.id })),
    },
    // {
    //   itemText: "Manage",
    //   onClick: () => history.push(appLink.workflowActivity({ workflowId: workflow.id })),
    // },
    {
      hasDivider: true,
      itemText: "Leave",
      isDelete: true,
      onClick: () => setIsLeaveModalOpen(true),
    },
  ];

  return (
    <div className={styles.container}>
      <Link to={!isLeaving ? appLink.workflows({ teamId: team.id }) : ""}>
        <section className={styles.details}>
          <div className={styles.descriptionContainer}>
            <h1 title={team.name} className={styles.name} data-testid="workflow-card-title">
              {team.name}
            </h1>
            {/* TODO - add a team description field
            <p title={workflow.shortDescription} className={styles.description}>
              {workflow.shortDescription}
            </p> */}
          </div>
          <ArrowRight size={24} className={styles.cardIcon} />
        </section>
      </Link>
      {isLeaving ? (
        <InlineLoading
          description="Leaving.."
          style={{ position: "absolute", right: "0.5rem", top: "0", width: "fit-content" }}
        />
      ) : (
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
      )}
      {isLeaveModalOpen && (
        <ConfirmModal
          affirmativeAction={handleLeaveTeam}
          affirmativeButtonProps={{ kind: "danger" }}
          affirmativeText="Delete"
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
          {`Are you sure you want to leave this Team? There's no going back from this decision.`}
        </ConfirmModal>
      )}
    </div>
  );
};

export default TeamCard;
