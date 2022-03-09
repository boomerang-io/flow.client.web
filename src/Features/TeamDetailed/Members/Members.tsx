import React from "react";
import { Helmet } from "react-helmet";
import moment from "moment";
import ms from "match-sorter";
import sortBy from "lodash/sortBy";
import { Link } from "react-router-dom";
import {
  Search,
  StructuredListWrapper,
  StructuredListHead,
  StructuredListBody,
  StructuredListRow,
  StructuredListCell,
} from "@boomerang-io/carbon-addons-boomerang-react";
import { appLink } from "Config/appConfig";
import { FlowTeam, FlowUser } from "Types";
import EmptyState from "Components/EmptyState";
import AddMember from "./AddMember";
import RemoveMember from "./RemoveMember";
import styles from "./Members.module.scss";

interface MemberProps {
  isActive: boolean;
  memberList: FlowUser[];
  team: FlowTeam;
  teamManagementEnabled: any;
  user: FlowUser;
}

const Members: React.FC<MemberProps> = ({ isActive, memberList = [], team, teamManagementEnabled, user }) => {
  const [searchQuery, setSearchQuery] = React.useState("");
  const filteredMemberList = searchQuery ? ms(memberList, searchQuery, { keys: ["name", "email"] }) : memberList;

  const memberIdList = memberList?.map((member) => member.id);

  const canEdit = isActive && teamManagementEnabled;

  return (
    <section aria-label={`${team.name} Team Members`} className={styles.container}>
      <Helmet>
        <title>{`Members - ${team.name}`}</title>
      </Helmet>
      <section className={styles.actionsContainer}>
        <div className={styles.leftActions}>
          <p className={styles.featureDescription}>These are the people who have access to workflows for this Team.</p>
          <p className={styles.memberCountText}>
            Showing {filteredMemberList.length} member{filteredMemberList.length !== 1 ? "s" : ""}
          </p>
          <Search
            labelText="member search"
            id="member-search"
            placeHolderText="Search for a member"
            onChange={(e: React.FormEvent<HTMLInputElement>) => setSearchQuery(e.currentTarget.value)}
          />
        </div>
        {canEdit && (
          <div className={styles.rightActions}>
            <AddMember teamId={team.id} teamName={team.name} memberList={memberList} memberIdList={memberIdList} />
          </div>
        )}
      </section>
      {filteredMemberList.length > 0 ? (
        <StructuredListWrapper>
          <StructuredListHead>
            <StructuredListRow head>
              <StructuredListCell head>Name</StructuredListCell>
              <StructuredListCell head>Email</StructuredListCell>

              <StructuredListCell head>Added on</StructuredListCell>
              <StructuredListCell head />
              <StructuredListCell head />
              <StructuredListCell head />
            </StructuredListRow>
          </StructuredListHead>
          <StructuredListBody>
            {sortBy(filteredMemberList, "name").map((member) => {
              return (
                <StructuredListRow key={member.id}>
                  <StructuredListCell>
                    <div className={styles.memberNameContainer}>
                      <p>{`${member.name}${user.id === member.id ? " (you!)" : ""}`}</p>
                    </div>
                  </StructuredListCell>
                  <StructuredListCell>{member.email}</StructuredListCell>
                  <StructuredListCell>{moment(member.firstLoginDate).format("MMMM D, YYYY")}</StructuredListCell>
                  <StructuredListCell>
                    {canEdit && (
                      <RemoveMember
                        member={member}
                        memberIdList={memberIdList}
                        teamId={team.id}
                        teamName={team.name}
                        userId={user.id}
                      />
                    )}
                  </StructuredListCell>
                  <StructuredListCell>
                    <Link
                      className={styles.viewMemberLink}
                      to={{
                        pathname: appLink.user({ userId: member.id }),
                        state: { fromTeam: { id: team.id, name: team.name } },
                      }}
                    >
                      View user
                    </Link>
                  </StructuredListCell>
                </StructuredListRow>
              );
            })}
          </StructuredListBody>
        </StructuredListWrapper>
      ) : (
        <EmptyState />
      )}
    </section>
  );
};

export default Members;
