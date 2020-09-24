import React from "react";
import { useQuery } from "react-query";
import { Box } from "reflexbox";
import { ErrorMessage, Loading, ComposedModal } from "@boomerang-io/carbon-addons-boomerang-react";
import UpdateTeamName from "./UpdateTeamName";
import queryString from "query-string";
import { serviceUrl, resolver } from "Config/servicesConfig";
import { SortDirection } from "Constants";
import { Edit16 } from "@carbon/icons-react";
import { FlowTeam } from "Types";
import styles from "./Settings.module.scss";

const DEFAULT_ORDER = SortDirection.Desc;
const DEFAULT_PAGE = 0;
const DEFAULT_SIZE = 1000;
const DEFAULT_SORT = "name";
// const PAGE_SIZES = [DEFAULT_SIZE];

const query = `?${queryString.stringify({
  order: DEFAULT_ORDER,
  page: DEFAULT_PAGE,
  size: DEFAULT_SIZE,
  sort: DEFAULT_SORT,
})}`;

export default function Settings({ team }: { team: FlowTeam }) {
  const teamsUrl = serviceUrl.getManageTeams({ query });

  const { data: teamsData, error, isLoading } = useQuery({
    queryKey: teamsUrl,
    queryFn: resolver.query(teamsUrl),
  });

  if (!error) {
    return (
      <Box mt="5rem">
        <ErrorMessage />
      </Box>
    );
  }

  if (isLoading) {
    return <Loading />;
  }

  const teamNameList = teamsData.records.map((team: FlowTeam) => team.name);

  return (
    <section aria-label="Team Settings" className={styles.settingsContainer}>
      <div className={styles.editTeamNameContainer}>
        <p className={styles.teamNameLabel}>Team Name</p>
        <div className={styles.actionableNameContainer}>
          <p className={styles.headerEditText}>{team.name}</p>
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
              <button className={styles.teamEditIcon} onClick={openModal} data-testid="open-change-name-modal">
                <Edit16 />
              </button>
            )}
          >
            {({ closeModal }: { closeModal: () => void }) => (
              <UpdateTeamName closeModal={closeModal} team={team} teamNameList={teamNameList} />
            )}
          </ComposedModal>
        </div>
      </div>
    </section>
  );
}
