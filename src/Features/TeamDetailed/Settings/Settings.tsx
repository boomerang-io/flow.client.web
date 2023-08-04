import React from "react";
import { Helmet } from "react-helmet";
import { useMutation, useQueryClient } from "react-query";
import { Breadcrumb, BreadcrumbItem, Button } from "@carbon/react";
import { ConfirmModal, ComposedModal, notify, ToastNotification } from "@boomerang-io/carbon-addons-boomerang-react";
import UpdateTeamName from "./UpdateTeamName";
import { Tag } from "@carbon/react";
import { Edit, Close } from "@carbon/react/icons";
import { FlowTeam } from "Types";
import styles from "./Settings.module.scss";
import { resolver, serviceUrl } from "Config/servicesConfig";

export default function Settings({ team, canEdit }: { team: FlowTeam; canEdit: boolean }) {
  const queryClient = useQueryClient();

  const { mutateAsync: removeTeamMutator } = useMutation(resolver.patchUpdateTeam);

  const handleRemoveTeam = async () => {
    try {
      await removeTeamMutator({ teamId: team.id, body: { isActive: false } });
      queryClient.invalidateQueries(serviceUrl.resourceTeam({ teamId: team.id }));
      notify(
        <ToastNotification title="Remove Team" subtitle={`Request to close ${team.name} successful`} kind="success" />
      );
    } catch (error) {
      // noop
    }
  };

  return (
    <section aria-label="Team Settings" className={styles.settingsContainer}>
      <Helmet>
        <title>{`Settings - ${team.name}`}</title>
      </Helmet>
      {!canEdit ? (
        <section className={styles.readOnly}>
          <Tag className={styles.readOnlyTag}>Read-only</Tag>
          <p className={styles.readOnlyText}>
            You don’t have permission to change any of these settings, but you can still see what’s going on behind the
            scenes.
          </p>
        </section>
      ) : (
        <p className={styles.settingsDescription}>
          These are configurable settings for this Team – only Admins have the ability to make changes here
        </p>
      )}
      <SettingSection
        title="Basic details"
        editModal={
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
              <button
                disabled={!canEdit}
                className={styles.teamEditIcon}
                onClick={openModal}
                data-testid="open-change-name-modal"
              >
                <Edit />
              </button>
            )}
          >
            {({ closeModal }: { closeModal: () => void }) => <UpdateTeamName closeModal={closeModal} team={team} />}
          </ComposedModal>
        }
      >
        <dl className={styles.detailedListContainer}>
          <div className={styles.detailedListGrid}>
            <div className={styles.detailedListGridItem}>
              <dt className={styles.detailedListTitle}>Name</dt>
              <dd className={styles.detailedListDescription}>{team.name}</dd>
            </div>
          </div>
        </dl>
      </SettingSection>
      <SettingSection title="Close Team">
        <div className={styles.buttonWithMessageContainer}>
          <p className={styles.buttonHelperText}>
            Done with your work here? Closing the team means its members will no longer be able to access this team, and
            access to the Services will be revoked.
          </p>
          <ConfirmModal
            affirmativeAction={() => handleRemoveTeam()}
            affirmativeButtonProps={{ kind: "danger", "data-testid": "confirm-close-team" }}
            title={`Close ${team.name}?`}
            negativeText="Cancel"
            affirmativeText="Close"
            modalTrigger={({ openModal }: { openModal: () => void }) => (
              <Button
                disabled={!canEdit}
                iconDescription="Close"
                kind="danger--ghost"
                onClick={openModal}
                renderIcon={Close}
                size="md"
                data-testid="close-team"
              >
                Close Team
              </Button>
            )}
          >
            Closing a team will submit a "leave team" request for each user on the team. After the requests are
            processed, the team will become "inactive". Are you sure you want to do this?
          </ConfirmModal>
        </div>
      </SettingSection>
    </section>
  );
}

function SettingSection({ children, description, editModal, title }) {
  return (
    <section className={styles.sectionContainer}>
      <div className={styles.sectionHeader}>
        <h1 className={styles.sectionTitle}>{title}</h1>
        {editModal}
      </div>
      {description ? <p className={styles.sectionDescription}>{description}</p> : null}
      {children}
    </section>
  );
}
