import React from "react";
import { Helmet } from "react-helmet";
import { useMutation } from "react-query";
import { Box } from "reflexbox";
import { ErrorMessage, Loading, ComposedModal } from "@boomerang-io/carbon-addons-boomerang-react";
import UpdateTeamName from "./UpdateTeamName";
import queryString from "query-string";
import { serviceUrl, resolver } from "Config/servicesConfig";
import { SortDirection } from "Constants";
import { Edit } from "@carbon/react/icons";
import { FlowTeam } from "Types";
import styles from "./Settings.module.scss";

export default function Settings({ team, teamManagementEnabled }: { team: FlowTeam; teamManagementEnabled: any }) {
  const canEdit = teamManagementEnabled;

  return (
    <section aria-label="Team Settings" className={styles.settingsContainer}>
      <Helmet>
        <title>{`Settings - ${team.name}`}</title>
      </Helmet>
      <div className={styles.editTeamNameContainer}>
        <p className={styles.teamNameLabel}>Team Name</p>
        <div className={styles.actionableNameContainer}>
          <p className={styles.headerEditText}>{team.name}</p>
          {canEdit && (
            <ComposedModal
              composedModalProps={{
                containerClassName: styles.teamNameModalContainer,
              }}
              modalHeaderProps={{
                title: "Change team name",
                //   subtitle:
                //     "Try to keep it concise to avoid truncation in the sidebar. You must make sure the name is valid before it can be updated.",
              }}
              modalTrigger={({ openModal }: { openModal: () => void }) => (
                <button className={styles.teamEditIcon} onClick={openModal} data-testid="open-change-name-modal">
                  <Edit />
                </button>
              )}
            >
              {({ closeModal }: { closeModal: () => void }) => <UpdateTeamName closeModal={closeModal} team={team} />}
            </ComposedModal>
          )}
        </div>
      </div>
    </section>
  );
}
