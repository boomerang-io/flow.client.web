import React from "react";
import { useQuery } from "Hooks";
import { useHistory, useLocation, Route, Switch } from "react-router-dom";
import { Box } from "reflexbox";
import {
  Button,
  Checkbox,
  ComposedModal,
  DataTable,
  DataTableSkeleton,
  ErrorMessage,
  FeatureHeader as Header,
  FeatureHeaderTitle as HeaderTitle,
  FeatureHeaderSubtitle as HeaderSubtitle,
  Pagination,
  Search,
} from "@boomerang-io/carbon-addons-boomerang-react";
import TeamDetailed from "Features/TeamDetailed";
import EmptyState from "Components/EmptyState";
import AddTeamContent from "./AddTeamContent";
import debounce from "lodash/debounce";
import queryString from "query-string";
import { isAccessibleKeyboardEvent } from "@boomerang-io/utils";
import { SortDirection } from "Constants";
import { AppPath, appLink } from "Config/appConfig";
import { serviceUrl } from "Config/servicesConfig";
import { ComposedModalChildProps, FlowTeam, ModalTriggerProps, PaginatedResponse } from "Types";
import styles from "./Teams.module.scss";

const TeamsContainer: React.FC = () => {
  return (
    <Switch>
      <Route path={AppPath.Team}>
        <TeamDetailed />
      </Route>
      <Route path={AppPath.TeamList}>
        <TeamList />
      </Route>
    </Switch>
  );
};

interface FeatureLayoutProps {
  handleSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default TeamsContainer;

const FeatureLayout: React.FC<FeatureLayoutProps> = ({ children, handleSearchChange }) => {
  return (
    <>
      <Header
        includeBorder={false}
        header={
          <>
            <HeaderTitle style={{ margin: "0" }}>Teams</HeaderTitle>
            <HeaderSubtitle>View and manage Flow teams</HeaderSubtitle>
          </>
        }
      />
      <Box p="2rem">
        <>
          <Box mb="1rem" maxWidth="20rem">
            <Search
              id="flow-teams"
              labelText="Search teams"
              placeHolderText="Search teams"
              onChange={handleSearchChange}
            />
          </Box>
          {children}
        </>
      </Box>
    </>
  );
};

const TeamList: React.FC = () => {
  const history = useHistory();
  const location = useLocation();
  const cancelRequestRef = React.useRef<{} | null>();

  const teamsUrl = serviceUrl.getManageTeams({ query: allQuery });

  const { data: teamsData, error: getTeamError, isLoading: getTeamLoading } = useQuery(teamsUrl);

  const teamsQuery = useQuery(serviceUrl.getManageTeams({ query: location.search }));

  /**
   * Function that updates url search history to persist state
   * @param {object} query - all of the query params
   *
   */
  function updateHistorySearch({
    order = DEFAULT_ORDER,
    page = DEFAULT_PAGE,
    size = DEFAULT_SIZE,
    sort = DEFAULT_SORT,
    ...props
  }) {
    const queryStr = `?${queryString.stringify({ order, page, size, sort, ...props })}`;
    history.push({ search: queryStr });
    return;
  }

  const debouncedSearch = React.useCallback(
    debounce((query: string) => {
      updateHistorySearch({ query, page: 0 });
    }, 300),
    []
  );

  function handleSearchChange(e: React.ChangeEvent<HTMLInputElement>) {
    const query = e.target.value;
    debouncedSearch(query);
  }

  function handlePaginationChange(pagination: { page: number; pageSize: number }) {
    updateHistorySearch({
      ...queryString.parse(location.search),
      page: pagination.page - 1, // We have to decrement by one to offset the table pagination adjustment
      size: pagination.pageSize,
    });
  }

  function handleSort(e: React.SyntheticEvent, sort: { sortHeaderKey: string }) {
    const { property, direction } = teamsQuery.data.sort[0];
    let order = SortDirection.Asc;

    if (sort.sortHeaderKey === property && direction === SortDirection.Asc) {
      order = SortDirection.Desc;
    }

    updateHistorySearch({ ...queryString.parse(location.search), order, sort: sort.sortHeaderKey });
  }

  function handleNavigateToTeam(teamId: string) {
    history.push(appLink.team({ teamId }));
  }

  if (teamsQuery.isLoading) {
    return (
      <FeatureLayout handleSearchChange={handleSearchChange}>
        <DataTableSkeleton />
      </FeatureLayout>
    );
  }

  if (teamsQuery.isError) {
    return (
      <FeatureLayout handleSearchChange={handleSearchChange}>
        <ErrorMessage />
      </FeatureLayout>
    );
  }
  return (
    <FeatureLayout handleSearchChange={handleSearchChange}>
      {teamsData && (
        <ComposedModal
          composedModalProps={{ shouldCloseOnOverlayClick: true }}
          modalHeaderProps={{
            title: "Create Team",
            subtitle: `Scope your workflows and properties to a team`,
          }}
          modalTrigger={({ openModal }: ModalTriggerProps) => (
            <Button
              iconDescription="Create new version"
              onClick={openModal}
              size="field"
              disabled={getTeamError || getTeamLoading}
              className={styles.createTeamTrigger}
            >
              Create Team
            </Button>
          )}
        >
          {({ closeModal }: ComposedModalChildProps) => {
            return (
              <AddTeamContent
                closeModal={closeModal}
                cancelRequestRef={cancelRequestRef}
                teamRecords={teamsData.records}
                currentQuery={location.search}
              />
            );
          }}
        </ComposedModal>
      )}
      <TeamListTable
        handleNavigateToTeam={handleNavigateToTeam}
        handlePaginationChange={handlePaginationChange}
        handleSort={handleSort}
        teamsData={teamsQuery.data}
      />
    </FeatureLayout>
  );
};

const DEFAULT_ORDER = SortDirection.Desc;
const DEFAULT_PAGE = 0;
const DEFAULT_SIZE = 10;
const DEFAULT_SORT = "name";
const PAGE_SIZES = [DEFAULT_SIZE, 20, 50, 100];

//for fetching "all" teams? Maybe make request larger?
const DEFAULT_ALL_TEAM_SIZE = 1000;

const allQuery = `?${queryString.stringify({
  order: DEFAULT_ORDER,
  page: DEFAULT_PAGE,
  size: DEFAULT_ALL_TEAM_SIZE,
  sort: DEFAULT_SORT,
})}`;

const headers = [
  {
    header: "Name",
    key: "name",
    sortable: true,
  },
  {
    header: "# of Users",
    key: "users",
  },
  { header: "# of Workflows", key: "workflows" },
  { header: "Active", key: "isActive" },
];

interface TeamListTableProps {
  handleNavigateToTeam: (teamId: string) => void;
  handlePaginationChange: (pagination: { page: number; pageSize: number }) => void;
  handleSort: (e: React.SyntheticEvent, sort: { sortHeaderKey: string }) => void;
  teamsData: PaginatedResponse<FlowTeam>;
}

const TeamListTable: React.FC<TeamListTableProps> = ({
  handleNavigateToTeam,
  handlePaginationChange,
  handleSort,
  teamsData,
}) => {
  const { TableContainer, Table, TableHead, TableRow, TableBody, TableCell, TableHeader } = DataTable;
  const { number: page, sort, totalElements, totalPages, records } = teamsData;

  return records.length > 0 ? (
    <>
      <DataTable
        rows={records}
        headers={headers}
        render={({ rows, headers, getHeaderProps }: any) => (
          <TableContainer>
            <Table isSortable>
              <TableHead>
                <TableRow>
                  {headers.map((header: any) => (
                    <TableHeader
                      id={header.key}
                      {...getHeaderProps({
                        header,
                        isSortable: header.sortable,
                        onClick: handleSort,
                      })}
                      isSortHeader={sort[0].property === header.key}
                      sortDirection={sort[0].direction}
                    >
                      {header.header}
                    </TableHeader>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((row: any) => (
                  <TableRow
                    className={styles.tableRow}
                    key={row.id}
                    data-testid="user-list-table-row"
                    onClick={() => handleNavigateToTeam(row.id)}
                    onKeyDown={(e: React.SyntheticEvent) =>
                      isAccessibleKeyboardEvent(e) && handleNavigateToTeam(row.id)
                    }
                    tabIndex={-1}
                  >
                    {row.cells.map((cell: any, cellIndex: any) => {
                      if (cell.info.header === "isActive") {
                        return (
                          <TableCell key={cell.id} id={cell.id}>
                            <Checkbox id={"check-" + cell.id} checked={cell.value} hideLabel labelText="checkbox" />
                          </TableCell>
                        );
                      }
                      return (
                        <TableCell key={cell.id}>
                          {Array.isArray(cell.value) ? cell.value.length : cell?.value ?? "---"}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      />
      <Pagination
        onChange={handlePaginationChange}
        page={page + 1}
        pageSize={totalPages}
        pageSizes={PAGE_SIZES}
        totalItems={totalElements}
      />
    </>
  ) : (
    <EmptyState message={null} title="No teams found" />
  );
};
