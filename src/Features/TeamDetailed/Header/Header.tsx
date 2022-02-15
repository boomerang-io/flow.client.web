import React from "react";
import { useMutation, queryCache } from "react-query";
import {
  Breadcrumb,
  BreadcrumbItem,
  Button,
  ConfirmModal,
  FeatureHeader as Header,
  FeatureHeaderTitle as HeaderTitle,
  FeatureHeaderSubtitle as HeaderSubtitle,
  FeatureNavTab as Tab,
  FeatureNavTabs as Tabs,
  notify,
  ToastNotification,
} from "@boomerang-io/carbon-addons-boomerang-react";
import { Checkmark16, Close16 } from "@carbon/icons-react";
import { Link, useLocation } from "react-router-dom";
import { appLink } from "Config/appConfig";
import { resolver, serviceUrl } from "Config/servicesConfig";

import styles from "./Header.module.scss";

import { FlowTeam } from "Types";

interface TeamDetailedHeaderProps {
  isActive: boolean;
  team: FlowTeam;
  teamManagementEnabled: any;
}

function TeamDetailedHeader({ isActive, team, teamManagementEnabled }: TeamDetailedHeaderProps) {
  const location: any = useLocation();

  const backToUser = location?.state?.fromUser;

  const [removeTeamMutator] = useMutation(resolver.putUpdateTeam, {
    onSuccess: () => queryCache.invalidateQueries(serviceUrl.getManageTeam({ teamId: team.id })),
  });

  const removeTeam = async () => {
    try {
      await removeTeamMutator({ teamId: team.id, body: { isActive: false } });
      notify(
        <ToastNotification title="Add User" subtitle={`Request to close ${team.name} successful`} kind="success" />
      );
    } catch (error) {
      // noop
    }
  };

  const canEdit = isActive && teamManagementEnabled;

  const NavigationComponent = () => {
    return Boolean(backToUser) ? (
      <Breadcrumb noTrailingSlash>
        <BreadcrumbItem>
          <Link to={appLink.userList()}>Users</Link>
        </BreadcrumbItem>
        <BreadcrumbItem>
          <Link to={appLink.user({ userId: backToUser.id })}>{backToUser.name}</Link>
        </BreadcrumbItem>
      </Breadcrumb>
    ) : (
      <Breadcrumb noTrailingSlash>
        <BreadcrumbItem>
          <Link to={appLink.teamList()}>Teams</Link>
        </BreadcrumbItem>
        <BreadcrumbItem isCurrentPage>
          <p>{team.name}</p>
        </BreadcrumbItem>
      </Breadcrumb>
    );
  };

  return (
    <Header
      includeBorder
      className={styles.container}
      nav={<NavigationComponent />}
      header={
        <>
          <HeaderTitle>{team.name}</HeaderTitle>
          <HeaderSubtitle className={styles.subtitle}>
            <div className={styles.status}>
              {isActive ? <Checkmark16 style={{ fill: "#009d9a" }} /> : <Close16 style={{ fill: "#da1e28" }} />}
              <p className={styles.statusText}>{isActive ? "Active" : "Inactive"}</p>
            </div>
            <span className={styles.statusDivider}>-</span>
            {/*<div className={styles.dateText}>
              Created on
              <p style={{ marginLeft: "0.3rem" }}>{moment(team.dateCreated).format("MMMM DD, YYYY")}</p>
            </div>*/}
          </HeaderSubtitle>
        </>
      }
      footer={
        <Tabs>
          <Tab exact label="Members" to={{ pathname: appLink.team({ teamId: team.id }), state: location.state }} />
          <Tab
            exact
            label="Workflows"
            to={{ pathname: appLink.teamWorkflows({ teamId: team.id }), state: location.state }}
          />
          <Tab
            exact
            label="Settings"
            to={{ pathname: appLink.teamSettings({ teamId: team.id }), state: location.state }}
          />
        </Tabs>
      }
      actions={
        canEdit && (
          <section className={styles.teamButtons}>
            <ConfirmModal
              affirmativeAction={() => removeTeam()}
              affirmativeButtonProps={{ kind: "danger", "data-testid": "confirm-close-team" }}
              title={`Close ${team.name}?`}
              negativeText="Cancel"
              affirmativeText="Close"
              modalTrigger={({ openModal }: { openModal: () => void }) => (
                <Button
                  iconDescription="Close"
                  kind="danger"
                  onClick={openModal}
                  renderIcon={Close16}
                  size="field"
                  data-testid="close-team"
                >
                  Close Team
                </Button>
              )}
            >
              Closing a team will submit a "leave team" request for each user on the team. After the requests are
              processed, the team will become "inactive". Are you sure you want to do this?
            </ConfirmModal>
          </section>
        )
      }
    />
  );
}

export default TeamDetailedHeader;
