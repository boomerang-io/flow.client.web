import React from "react";
import { Helmet } from "react-helmet";
import { ConfirmModal, notify, ToastNotification } from "@boomerang-io/carbon-addons-boomerang-react";
import { useMutation } from "react-query";
import { Edit, Close } from "@carbon/react/icons";
import { Tag, Button } from "@carbon/react";
import { FlowUser } from "Types";
import { resolver, serviceUrl } from "Config/servicesConfig";
import styles from "./Settings.module.scss";

interface UserSettingsProps {
  user: FlowUser;
  userManagementEnabled: any;
}

export default function Settings({ user, userManagementEnabled }: UserSettingsProps) {
  const canEdit = userManagementEnabled;

  const removeUserMutator = useMutation(resolver.deleteUser);

  const removeTeam = async () => {
    try {
      await removeUserMutator.mutateAsync({ userId: user.id });
      notify(
        <ToastNotification title="Close Account" subtitle="Request to close your account successful" kind="success" />
      );
    } catch (error) {
      notify(
        <ToastNotification
          title="Close Account"
          subtitle={`Unable to close the account. ${error.message}. Please contact support.`}
          kind="error"
        />
      );
    }
  };

  return (
    <section aria-label="User Settings" className={styles.settingsContainer}>
      <Helmet>
        <title>{`Settings - ${user?.name}`}</title>
      </Helmet>
      {!canEdit ? (
        <section className={styles.readOnly}>
          <Tag className={styles.readOnlyTag}>Read-only</Tag>
          <p className={styles.readOnlyText}>
            Manage your profile - You don’t have permission to change any of these settings, but you can still see
            what’s going on behind the scenes.
          </p>
        </section>
      ) : (
        <p className={styles.settingsDescription}>
          Manage your profile, activate special features, or close your account.
        </p>
      )}
      <SettingSection title="Basic details">
        <dl className={styles.detailedListContainer}>
          <div className={styles.detailedListGrid}>
            <div className={styles.detailedListGridItem}>
              <dt className={styles.detailedListTitle}>Name</dt>
              <dd className={styles.detailedListDescription}>{user.name}</dd>
            </div>
            <div className={styles.detailedListGridItem}>
              <dt className={styles.detailedListTitle}>Email</dt>
              <dd className={styles.detailedListDescription}>{user.email}</dd>
            </div>
          </div>
        </dl>
      </SettingSection>
      <SettingSection title="API Tokens">
        <div className={styles.buttonWithMessageContainer}>
          <p className={styles.buttonHelperText}>Coming soon.</p>
        </div>
      </SettingSection>
      <SettingSection title="Features">
        <div className={styles.buttonWithMessageContainer}>
          <p className={styles.buttonHelperText}>There are no special features to be enabled at this time.</p>
        </div>
      </SettingSection>
      <SettingSection title="Close Account">
        <div className={styles.buttonWithMessageContainer}>
          <p className={styles.buttonHelperText}>
            Done with your work here? Closing your account means you will no longer be able to access any Teams or
            Workflows you have created. You will also no longer receive any notifications from the platform.
          </p>
          <p className={styles.buttonHelperText}>
            This action cannot be undone. Be sure you want to permanently delete all of the data stored.
          </p>
          <ConfirmModal
            affirmativeAction={() => removeTeam()}
            affirmativeButtonProps={{ kind: "danger", "data-testid": "confirm-close-account" }}
            title="Close Account?"
            negativeText="Cancel"
            affirmativeText="Close"
            modalTrigger={({ openModal }: { openModal: () => void }) => (
              <Button
                disabled={!canEdit}
                iconDescription="Close"
                kind="danger"
                onClick={openModal}
                renderIcon={Close}
                size="md"
                data-testid="close-team"
              >
                Close Account
              </Button>
            )}
          >
            Closing your account will submit a request but will not immediatly become inactive. This action cannot be
            undone. Are you sure you want to do this?
          </ConfirmModal>
        </div>
      </SettingSection>
    </section>
  );
}

// function EditButton({ openModal }) {
//   return (
//     <Button
//       className={styles.editButton}
//       data-testid="settings-edit-button"
//       iconDescription="edit"
//       kind="ghost"
//       size="small"
//       renderIcon={Edit}
//       onClick={openModal}
//     />
//   );
// }

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
