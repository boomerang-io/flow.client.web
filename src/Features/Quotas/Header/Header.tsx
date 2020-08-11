import React from "react";
import { Button, ConfirmModal } from "@boomerang-io/carbon-addons-boomerang-react";
import FeatureHeader from "Components/FeatureHeader";
import { Reset16 } from "@carbon/icons-react";
import { ModalTriggerProps, FlowTeam } from "Types";
import styles from "./Header.module.scss";

interface HeaderProps {
  handleRestoreDefaultQuota: Function;
  selectedTeam: FlowTeam;
}

const Header: React.FC<HeaderProps> = ({ selectedTeam, handleRestoreDefaultQuota }) => {
  return (
    <FeatureHeader includeBorder className={styles.featureHeader}>
      <div className={styles.container}>
        <hgroup>
          <h1 className={styles.teamName}>{selectedTeam.name}</h1>
          <h2 className={styles.teamMembers}>{`${selectedTeam.users.length} Team Member${
            selectedTeam.users.length !== 1 ? "s" : ""
          }`}</h2>
        </hgroup>
        <ConfirmModal
          affirmativeAction={handleRestoreDefaultQuota}
          children={
            <>
              <p className={styles.confirmModalText}>
                Are you sure you’d like to restore quotas to their default values?
              </p>
            </>
          }
          affirmativeText="Restore default quotas"
          title="Restore"
          modalTrigger={({ openModal }: ModalTriggerProps) => (
            <Button className={styles.resetButton} size="field" renderIcon={Reset16} onClick={openModal}>
              Restore defaults
            </Button>
          )}
        />
      </div>
    </FeatureHeader>
  );
};

export default Header;
