import React from "react";
import moment from "moment";
import { Link, useLocation } from "react-router-dom";
import { Breadcrumb, BreadcrumbItem, Button } from "@carbon/react";
import {
  Avatar,
  ComposedModal,
  FeatureHeader as Header,
  FeatureHeaderTitle as HeaderTitle,
  FeatureNavTab as Tab,
  FeatureNavTabs as Tabs,
} from "@boomerang-io/carbon-addons-boomerang-react";
import ChangeRole from "./ChangeRole";
import { UserRoleCopy } from "Constants";
import { appLink } from "Config/appConfig";
import { serviceUrl } from "Config/servicesConfig";
import { emailIsValid } from "Utils";
import { ComposedModalChildProps, FlowUser } from "Types";
import { Checkmark, Close, User } from "@carbon/react/icons";
import styles from "./UserDetailedHeader.module.scss";

interface UserDetailedHeaderProps {
  isError?: boolean;
  isLoading?: boolean;
  user?: FlowUser;
  userManagementEnabled?: any;
}

function UserDetailedHeader({ isError, isLoading, user, userManagementEnabled }: UserDetailedHeaderProps) {
  const location: any = useLocation();
  const cancelRequestRef = React.useRef<{} | null>();

  const backToTeam = location?.state?.fromTeam;

  const isActive = user?.status === "active";

  const NavigationComponent = () => {
    return Boolean(backToTeam) ? (
      <Breadcrumb noTrailingSlash>
        <BreadcrumbItem>
          <Link to={appLink.teamList()}>Teams</Link>
        </BreadcrumbItem>
        <BreadcrumbItem>
          <Link to={appLink.team({ teamId: backToTeam.id })}>{backToTeam.name}</Link>
        </BreadcrumbItem>
      </Breadcrumb>
    ) : (
      <Breadcrumb noTrailingSlash>
        <BreadcrumbItem>
          <Link to={appLink.userList()}>Users</Link>
        </BreadcrumbItem>
        <BreadcrumbItem isCurrentPage>
          <p>{user?.name}</p>
        </BreadcrumbItem>
      </Breadcrumb>
    );
  };

  return (
    <Header
      includeBorder
      isLoading={isLoading}
      className={styles.container}
      nav={<NavigationComponent />}
      footer={
        !isError && (
          <section className={styles.headerActions}>
            <Tabs ariaLabel="User pages">
              <Tab exact label="Teams" to={{ pathname: appLink.user({ userId: user?.id }), state: location.state }} />
              <Tab
                exact
                label="Labels"
                to={{ pathname: appLink.userLabels({ userId: user?.id }), state: location.state }}
              />
              <Tab
                exact
                label="Settings"
                to={{ pathname: appLink.userSettings({ userId: user?.id }), state: location.state }}
              />
            </Tabs>
            <ComposedModal
              composedModalProps={{ shouldCloseOnOverlayClick: true }}
              modalTrigger={({ openModal }: any) => (
                <Button
                  disabled={!userManagementEnabled}
                  iconDescription={"Change role"}
                  kind="ghost"
                  onClick={openModal}
                  renderIcon={User}
                  size="md"
                  style={{ marginBottom: "0.5rem" }}
                >
                  Change role
                </Button>
              )}
              modalHeaderProps={{
                title: "User Role",
                subtitle: `Set ${user?.name ?? "user"}'s role in Flow. Admins can do more things.`,
              }}
            >
              {({ closeModal }: ComposedModalChildProps) => {
                return <ChangeRole closeModal={closeModal} cancelRequestRef={cancelRequestRef} user={user} />;
              }}
            </ComposedModal>
          </section>
        )
      }
    >
      <div className={styles.infoContainer}>
        <div className={styles.userContainer}>
          <Avatar
            className={styles.userAvatar}
            src={serviceUrl.getUserProfileImage({ userEmail: user?.email })}
            user={user?.email}
          />
          <HeaderTitle style={{ margin: "0 1rem 0 1rem" }} title={user?.name}>
            {user?.name ?? "---"}
          </HeaderTitle>
        </div>
        {!isError && user && (
          <div className={styles.userDetailsContainer}>
            <section className={styles.subHeaderContainer}>
              <dl className={styles.detailedInfoContainer}>
                <dt className={styles.dataTitle}>Email</dt>
                <dd className={styles.dataValueEmail}>{emailIsValid(user?.email) ? user?.email : "---"}</dd>
              </dl>
              <dl className={styles.detailedInfoContainer}>
                <dt className={styles.dataTitle}>Status</dt>
                <dd className={styles.dataValue}>
                  <div className={styles.status}>
                    {isActive ? <Checkmark style={{ fill: "#009d9a" }} /> : <Close style={{ fill: "#da1e28" }} />}
                    <p className={styles.statusText}>{isActive ? "Active" : "Inactive"}</p>
                  </div>
                </dd>
              </dl>
              <dl className={styles.detailedInfoContainer}>
                <dt className={styles.dataTitle}>Role</dt>
                <dd className={styles.dataValue}>{user?.type ? UserRoleCopy[user.type] : "---"}</dd>
              </dl>
              <dl className={styles.detailedInfoContainer}>
                <dt className={styles.dataTitle}>Date Joined</dt>
                <dd className={styles.dataValue}>{moment(user.firstLoginDate).format("YYYY-MM-DD")}</dd>
              </dl>
              <dl className={styles.detailedInfoContainer}>
                <dt className={styles.dataTitle}>Last Login</dt>
                <dd className={styles.dataValue}>{moment(user.lastLoginDate).format("YYYY-MM-DD h:mma")}</dd>
              </dl>
            </section>
            <section className={styles.actionButtonsContainer}></section>
          </div>
        )}
      </div>
    </Header>
  );
}

export default UserDetailedHeader;
