import React, { useState } from "react";
import { Helmet } from "react-helmet";
import { ConfirmModal, notify, ToastNotification, TooltipHover } from "@boomerang-io/carbon-addons-boomerang-react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { CopyFile, Close } from "@carbon/react/icons";
import {
  Tag,
  Button,
  SkeletonText,
  StructuredListWrapper,
  StructuredListHead,
  StructuredListRow,
  StructuredListCell,
  StructuredListBody,
} from "@carbon/react";
import CopyToClipboard from "react-copy-to-clipboard";
import type { FlowUser, Token as TokenType } from "Types";
import { resolver, serviceUrl } from "Config/servicesConfig";
import queryString from "query-string";
import Token from "./Token";
import CreateToken from "Components/CreateToken";
import styles from "./Settings.module.scss";

interface UserSettingsProps {
  user: FlowUser;
  userManagementEnabled: any;
}

export default function Settings({ user, userManagementEnabled }: UserSettingsProps) {
  const [copyTokenText, setCopyTokenText] = useState("Copy Token");
  const canEdit = userManagementEnabled;
  const queryClient = useQueryClient();

  const getTokensUrl = serviceUrl.getTokens({
    query: queryString.stringify({ types: "user", principals: user?.id }),
  });

  const getTokensQuery = useQuery({
    queryKey: getTokensUrl,
    queryFn: resolver.query(getTokensUrl),
    enabled: Boolean(user?.id),
  });

  const deleteTokenMutator = useMutation(resolver.deleteToken);

  const deleteToken = async (tokenId: string) => {
    try {
      await deleteTokenMutator.mutateAsync({ tokenId });
      queryClient.invalidateQueries([getTokensUrl]);
      notify(<ToastNotification kind="success" title="Delete Token" subtitle={`Token successfully deleted`} />);
    } catch (error) {
      notify(<ToastNotification kind="error" title="Something's Wrong" subtitle="Request to delete token failed" />);
    }
  };

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
            Manage your profile, tokens, special features, or close your account. - You don’t have permission to change
            any of these settings, but you can still see what’s going on behind the scenes.
          </p>
        </section>
      ) : (
        <p className={styles.settingsDescription}>
          Manage your profile, tokens, special features, or close your account.
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
      <SettingSection title="Tokens">
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
                <StructuredListCell head>Name</StructuredListCell>
                <StructuredListCell head>Status</StructuredListCell>
                <StructuredListCell head>Creation Date</StructuredListCell>
                <StructuredListCell head>Expiration Date</StructuredListCell>
                <StructuredListCell head>Scopes</StructuredListCell>
                <StructuredListCell head />
              </StructuredListRow>
            </StructuredListHead>
            <StructuredListBody>
              {getTokensQuery.isLoading ? (
                <StructuredListRow>
                  <StructuredListCell>
                    <SkeletonText data-testid="token-loading-skeleton" />
                  </StructuredListCell>
                  <StructuredListCell>
                    <SkeletonText data-testid="token-loading-skeleton" />
                  </StructuredListCell>
                  <StructuredListCell>
                    <SkeletonText data-testid="token-loading-skeleton" />
                  </StructuredListCell>
                  <StructuredListCell>
                    <SkeletonText data-testid="token-loading-skeleton" />
                  </StructuredListCell>
                  <StructuredListCell />
                </StructuredListRow>
              ) : (
                getTokensQuery.data.content?.map((token: TokenType) => (
                  <Token tokenData={token} deleteToken={deleteToken} />
                ))
              )}
            </StructuredListBody>
          </StructuredListWrapper>
        </dl>
        <CreateToken getTokensUrl={getTokensUrl} principal={user.id} type="user" />
      </SettingSection>
      <SettingSection title="Your ID">
        <dl className={styles.detailedListContainer}>
          <p className={styles.detailedListParagraph}>
            This is your user ID and can be used when interacting with the API.
          </p>
          <div className={styles.detailedListGrid}>
            <div className={styles.detailedListGridItem}>
              <dd className={styles.detailedListDescription}>{user.id}</dd>
            </div>
            <div className={styles.detailedListGridItem}>
              <dd className={styles.detailedListDescription}>
                <TooltipHover direction="top" content={copyTokenText} hideOnClick={false}>
                  <div>
                    <CopyToClipboard text={user.id}>
                      <button
                        className={styles.actionButton}
                        onClick={() => setCopyTokenText("Copied Token")}
                        onMouseLeave={() => setCopyTokenText("Copy Token")}
                        type="button"
                      >
                        <CopyFile fill={"#0072C3"} className={styles.actionIcon} alt="Copy token" />
                      </button>
                    </CopyToClipboard>
                  </div>
                </TooltipHover>
              </dd>
            </div>
          </div>
        </dl>
      </SettingSection>
      <SettingSection title="Features">
        <div className={styles.detailedListContainer}>
          <p className={styles.detailedListParagraph}>There are no special features to be enabled at this time.</p>
        </div>
      </SettingSection>
      <SettingSection title="Close Account">
        <div className={styles.detailedListContainer}>
          <p className={styles.detailedListParagraph}>
            Done with your work here? Closing your account means you will no longer be able to access any items you have
            created. You will also no longer receive any notifications from the platform.
          </p>
          <p className={styles.detailedListParagraph}>
            This action cannot be undone. Be sure you want to permanently delete your access.
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
                kind="danger--ghost"
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
