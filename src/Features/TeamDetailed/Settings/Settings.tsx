import React from "react";
import { Helmet } from "react-helmet";
import { useMutation, useQueryClient } from "react-query";
import { InlineNotification, Button } from "@carbon/react";
import {
  ConfirmModal,
  ComposedModal,
  notify,
  ToastNotification,
  TooltipHover,
} from "@boomerang-io/carbon-addons-boomerang-react";
import UpdateTeamName from "./UpdateTeamName";
import {
  StructuredListWrapper,
  StructuredListHead,
  StructuredListRow,
  StructuredListCell,
  StructuredListBody,
} from "@carbon/react";
import { Edit, Close, TrashCan } from "@carbon/react/icons";
import sortBy from "lodash/sortBy";
import { FlowTeam } from "Types";
import LabelModal from "Components/LabelModal";
import styles from "./Settings.module.scss";
import { resolver, serviceUrl } from "Config/servicesConfig";

interface Label {
  key: string;
  value: string;
}

export default function Settings({ team, canEdit }: { team: FlowTeam; canEdit: boolean }) {
  const queryClient = useQueryClient();

  const removeTeamMutator = useMutation(resolver.patchUpdateTeam);

  const handleRemoveTeam = async () => {
    try {
      await removeTeamMutator.mutateAsync({ teamId: team.id, body: { isActive: false } });
      queryClient.invalidateQueries(serviceUrl.resourceTeam({ teamId: team.id }));
      notify(
        <ToastNotification title="Remove Team" subtitle={`Request to close ${team.name} successful`} kind="success" />
      );
    } catch (error) {
      // noop
    }
  };

  const handleAddLabel = async (value: Label) => {
    console.log("handleAddLabel", value);
    const newLabels = [...teamLabels, value];
    const newLabelsRecord = newLabels.reduce((acc, label) => {
      acc[label.key] = label.value;
      return acc;
    }, {} as Record<string, string>);

    try {
      await removeTeamMutator.mutateAsync({ teamId: team.id, body: { labels: newLabelsRecord } });
      queryClient.invalidateQueries(serviceUrl.resourceTeam({ teamId: team.id }));
      notify(
        <ToastNotification title="Remove Team" subtitle={`Request to close ${team.name} successful`} kind="success" />
      );
    } catch (error) {
      // noop
    }
  };

  const handleRemoveLabel = async (value: Label) => {
    console.log("handleRemoveLabel", value);

    const newLabels = teamLabels.filter((label) => label.key !== value.key);
    const newLabelsRecord = newLabels.reduce((acc, label) => {
      acc[label.key] = label.value;
      return acc;
    }, {} as Record<string, string>);

    console.log("newLabels", newLabelsRecord);

    try {
      await removeTeamMutator.mutateAsync({ teamId: team.id, body: { labels: newLabelsRecord } });
      queryClient.invalidateQueries(serviceUrl.resourceTeam({ teamId: team.id }));
      notify(
        <ToastNotification title="Remove Team" subtitle={`Request to close ${team.name} successful`} kind="success" />
      );
    } catch (error) {
      // noop
    }
  };

  // Convert Record/Map of Labels to Array of Label Object
  const teamLabels = team.labels ? Object.entries(team.labels).map(([key, value]) => ({ key, value })) : [];
  const labelsKeys = team.labels ? Object.keys(team.labels) : [];

  return (
    <section aria-label="Team Settings" className={styles.settingsContainer}>
      <Helmet>
        <title>{`Settings - ${team.name}`}</title>
      </Helmet>
      {!canEdit ? (
        <section className={styles.notificationsContainer}>
          <InlineNotification
            lowContrast
            hideCloseButton={true}
            kind="info"
            title="Read-only"
            subtitle="You don’t have permission to change these settings, but you can still see what’s going on behind the
            scenes."
          />
        </section>
      ) : null}
      <p className={styles.settingsDescription}>
        Configurable settings for this Team – Team Owners & Admins have the ability to make changes here.
      </p>
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
      <SettingSection title="Labels">
        <div className={styles.buttonWithMessageContainer}>
          <p className={styles.buttonHelperText}>Coming soon - labels are not yet enabled via this page.</p>
        </div>
      </SettingSection>
      <SettingSection title="Labels">
        <dl className={styles.detailedListContainer}>
          <p className={styles.detailedListParagraph}>
            Personal access tokens allow other apps to access the APIs as if they were you. All of your access will be
            shared. Be careful how you distribute these tokens!
          </p>
          <StructuredListWrapper
            className={styles.structuredListWrapper}
            ariaLabel="Structured list"
            isCondensed={true}
          >
            <StructuredListHead>
              <StructuredListRow head>
                <StructuredListCell head>Key</StructuredListCell>
                <StructuredListCell head>Value</StructuredListCell>
                <StructuredListCell head />
              </StructuredListRow>
            </StructuredListHead>
            <StructuredListBody>
              {sortBy(teamLabels, "key").map((label: Label) => {
                const labelIndex = teamLabels.findIndex((labelFromList) => labelFromList.key === label.key);
                return (
                  <StructuredListRow key={label.key}>
                    <StructuredListCell className={styles.labelKeyCell}>{label.key}</StructuredListCell>
                    <StructuredListCell>{label.value}</StructuredListCell>
                    {canEdit && (
                      <>
                        <StructuredListCell>
                          <LabelModal
                            action={handleAddLabel}
                            isEdit
                            labelsKeys={labelsKeys.filter((labelKey) => labelKey !== label.key)}
                            selectedLabel={label}
                            modalTrigger={({ openModal }: { openModal: Function }) => (
                              <Button
                                kind="ghost"
                                iconDescription="edit label"
                                renderIcon={Edit}
                                size="sm"
                                onClick={openModal}
                              >
                                Edit
                              </Button>
                            )}
                          />
                          <Button
                            kind="danger--ghost"
                            iconDescription="delete label"
                            renderIcon={TrashCan}
                            size="sm"
                            onClick={() => handleRemoveLabel(label)}
                          >
                            Delete
                          </Button>
                        </StructuredListCell>
                      </>
                    )}
                  </StructuredListRow>
                );
              })}
            </StructuredListBody>
          </StructuredListWrapper>
        </dl>
        {/* <CreateToken getTokensUrl={getTokensUrl} principal={user.id} type="user" /> */}
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
