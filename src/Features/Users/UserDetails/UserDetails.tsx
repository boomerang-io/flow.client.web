import React from "react";
import { ModalBody } from "carbon-components-react";
import capitalize from "lodash/capitalize";
import { FlowUser } from "Types";
import styles from "./UserDetails.module.scss";

interface UserDetailsSection {
  label: string;
  value: any;
}

const UserDetailsSection: React.FC<UserDetailsSection> = ({ label, value }) => {
  return (
    <section className={styles.sectionContainer}>
      <dt className={styles.sectionHeader}>{label}</dt>
      <dd className={styles.sectionDetail}>{value ? value : "---"}</dd>
    </section>
  );
};

interface UserDetailsProps {
  user: FlowUser | undefined;
}

const UserDetails: React.FC<UserDetailsProps> = ({ user = {} }) => {
  return (
    <ModalBody>
      <dl>
        <UserDetailsSection label="Name" value={user.name} />
        <UserDetailsSection label="Email" value={user.email} />
        <UserDetailsSection label="Type" value={capitalize(user.type)} />
        <UserDetailsSection label="Created" value={capitalize(user.firstLoginDate)} />
        <UserDetailsSection label="Last Login" value={capitalize(user.lastLoginDate)} />
        <UserDetailsSection label="Status" value={user.status} />
        <UserDetailsSection label="# of Flow Teams" value={user.flowTeams?.join(", ")} />
      </dl>
    </ModalBody>
  );
};

export default UserDetails;
