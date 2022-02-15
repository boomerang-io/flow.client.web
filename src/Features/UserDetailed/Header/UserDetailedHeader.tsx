import React from "react";
import moment from "moment";
import { useFeature } from "flagged";
import { Link, useLocation } from "react-router-dom";
import {
  Avatar,
  Breadcrumb,
  BreadcrumbItem,
  Button,
  ComposedModal,
  FeatureHeader as Header,
  FeatureHeaderTitle as HeaderTitle,
  FeatureHeaderSubtitle as HeaderSubtitle,
  FeatureNavTab as Tab,
  FeatureNavTabs as Tabs,
} from "@boomerang-io/carbon-addons-boomerang-react";
import ChangeRole from "./ChangeRole";
import { UserRoleCopy } from "Constants";
import { appLink, FeatureFlag } from "Config/appConfig";
import { serviceUrl } from "Config/servicesConfig";
import { emailIsValid } from "Utils";
import { ComposedModalChildProps, FlowUser } from "Types";
import { Checkmark16, Close16, User24 } from "@carbon/icons-react";
import styles from "./UserDetailedHeader.module.scss";

interface UserDetailedHeaderProps {
  isError?: boolean;
  isLoading?: boolean;
  user?: FlowUser;
}

function UserDetailedHeader({ isError, isLoading, user }: UserDetailedHeaderProps) {
  const userManagementEnabled = useFeature(FeatureFlag.UserManagementEnabled);
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
          <Tabs>
            <Tab exact label="Workflows" to={{ pathname: appLink.user({ userId: user?.id }), state: location.state }} />
            <Tab
              exact
              label="Teams"
              to={{ pathname: appLink.userTeams({ userId: user?.id }), state: location.state }}
            />
          </Tabs>
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
          <HeaderTitle style={{ margin: "0 1rem 0 0" }} title={user?.name}>
            {user?.name ?? "---"}
          </HeaderTitle>
          <HeaderSubtitle className={styles.headerSubtitle} title={user?.email}>
            <div className={styles.status}>
              {isActive ? <Checkmark16 style={{ fill: "#009d9a" }} /> : <Close16 style={{ fill: "#da1e28" }} />}
              <p className={styles.statusText}>{isActive ? "Active" : "Inactive"}</p>
            </div>
            <span className={styles.statusDivider}>-</span>
            {emailIsValid(user?.email) ? user?.email : "User's email is ofuscated"}
          </HeaderSubtitle>
        </div>
        {!isError && user && (
          <div className={styles.userDetailsContainer}>
            <section className={styles.subHeaderContainer}>
              <dl className={styles.detailedInfoContainer}>
                <dt className={styles.dataTitle}>Platform Role</dt>
                <dd className={styles.dataValue}>{user?.type ? UserRoleCopy[user.type] : "---"}</dd>
              </dl>
              <dl className={styles.detailedInfoContainer}>
                <dt className={styles.dataTitle}>Date Joined</dt>
                <dd className={styles.dataValue}>{moment(user.firstLoginDate).format("YYYY-MM-DD h:mma")}</dd>
              </dl>
              <dl className={styles.detailedInfoContainer}>
                <dt className={styles.dataTitle}>Last Login</dt>
                <dd className={styles.dataValue}>{moment(user.lastLoginDate).format("YYYY-MM-DD h:mma")}</dd>
              </dl>
            </section>
            <section className={styles.actionButtonsContainer}>
              <ComposedModal
                composedModalProps={{ shouldCloseOnOverlayClick: true }}
                modalTrigger={({ openModal }: any) => (
                  <Button
                    disabled={!userManagementEnabled}
                    kind="ghost"
                    onClick={openModal}
                    renderIcon={User24}
                    size="field"
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
          </div>
        )}
      </div>
    </Header>
  );
}

export default UserDetailedHeader;
