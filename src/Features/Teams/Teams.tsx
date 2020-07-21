import React, { useState } from "react";
import { useQuery } from "Hooks";
import { useHistory, Route, Switch } from "react-router-dom";
import { Box } from "reflexbox";
import {
  DataTable,
  DataTableSkeleton,
  ErrorMessage,
  Error404,
  Pagination,
} from "@boomerang-io/carbon-addons-boomerang-react";
import FeatureHeader from "Components/FeatureHeader";
import Team from "./Team";
import { isAccessibleEvent, sortByProp } from "@boomerang-io/utils";
import { arrayPagination } from "Utils/arrayHelper";
import { AppPath, appLink } from "Config/appConfig";
import { serviceUrl } from "Config/servicesConfig";
import { FlowTeam } from "Types";

const getTeamsUrl = serviceUrl.getTeams();

const TeamsContainer: React.FC = () => {
  return (
    <Switch>
      <Route path={AppPath.Team}>
        <Team />
      </Route>
      <Route path={AppPath.TeamList}>
        <TeamList />
      </Route>
    </Switch>
  );
};

export default TeamsContainer;

const FeatureLayout: React.FC = ({ children }) => {
  return (
    <>
      <FeatureHeader>
        <h1 style={{ fontWeight: 600 }}>Teams</h1>
      </FeatureHeader>
      <Box p="1rem">{children}</Box>
    </>
  );
};

const TeamList: React.FC = () => {
  const teamsQuery = useQuery(getTeamsUrl);

  if (teamsQuery.isLoading) {
    return (
      <FeatureLayout>
        <DataTableSkeleton />
      </FeatureLayout>
    );
  }

  if (teamsQuery.isError) {
    return (
      <FeatureLayout>
        <ErrorMessage />
      </FeatureLayout>
    );
  }
  return (
    <FeatureLayout>
      <TeamsTable teamsData={teamsQuery.data} />
    </FeatureLayout>
  );
};

interface TeamsTableProps {
  teamsData: FlowTeam[];
}

const DEFAULT_PAGE_SIZE = 10;
const PAGE_SIZES = [DEFAULT_PAGE_SIZE, 20, 50, 100];
const headers = [
  {
    header: "Name",
    key: "name",
    sortable: true,
  },
  {
    header: "Id",
    key: "id",
  },
];

const TeamsTable: React.FC<TeamsTableProps> = ({ teamsData }) => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  //const [searchQuery, setSearchQuery] = useState("");
  const [sortKey, setSortKey] = useState("name");
  const [sortDirection, setSortDirection] = useState("asc");
  const history = useHistory();

  // const handleSearchChange = (e) => {
  //   const searchQuery = e.target.value;
  //   setPage(1);
  //   setSearchQuery(searchQuery);
  // };

  function handlePaginationChange({ page, pageSize }: { page: number; pageSize: number }) {
    setPage(page);
    setPageSize(pageSize);
  }

  function handleSort(e: React.MouseEvent<HTMLButtonElement, MouseEvent>, { sortHeaderKey }: any) {
    const order = sortDirection === "asc" ? "desc" : "asc";
    setSortKey(sortHeaderKey);
    setSortDirection(order);
  }

  function navigateToTeam(teamId: string) {
    history.push(appLink.team({ teamId }));
  }

  const { TableContainer, Table, TableHead, TableRow, TableBody, TableCell, TableHeader } = DataTable;

  const records = teamsData;
  const totalElements = teamsData.length;

  return totalElements > 0 ? (
    <>
      <DataTable
        rows={arrayPagination(records, page, pageSize, sortKey, sortDirection)}
        sortRow={(rows: any) => sortByProp(rows, sortKey, sortDirection)}
        headers={headers}
        render={({ rows, headers, getHeaderProps }: any) => (
          <TableContainer>
            <Table>
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
                      isSortHeader={sortKey === header.key}
                      sortDirection={sortDirection}
                    >
                      {header.header}
                    </TableHeader>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((row: any) => (
                  <TableRow
                    key={row.id}
                    data-testid="team-list-table-row"
                    onClick={() => navigateToTeam(row.id)}
                    onKeyDown={(e: React.SyntheticEvent) => isAccessibleEvent(e) && navigateToTeam(row.id)}
                    tabIndex={0}
                  >
                    {row.cells.map((cell: any, cellIndex: any) => (
                      <TableCell key={cell.id}>{cell.value}</TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      />
      <Pagination
        onChange={handlePaginationChange}
        page={page}
        pageSize={pageSize}
        pageSizes={PAGE_SIZES}
        totalItems={totalElements}
      />
    </>
  ) : (
    <Error404 message={null} title="No teams found" header={null} />
  );
};
