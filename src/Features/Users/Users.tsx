import React, { useState } from "react";
import { useHistory, Route, Switch } from "react-router-dom";
import { Box } from "reflexbox";
import { useQuery } from "Hooks";
import {
  DataTable,
  DataTableSkeleton,
  ErrorMessage,
  Error404,
  Pagination,
} from "@boomerang-io/carbon-addons-boomerang-react";
import User from "./User";
import { isAccessibleEvent, sortByProp } from "@boomerang-io/utils";
import FeatureHeader from "Components/FeatureHeader";
import { arrayPagination } from "Utils/arrayHelper";
import { appLink, AppPath } from "Config/appConfig";
import { serviceUrl } from "Config/servicesConfig";
import { FlowUser } from "Types";

const getUsersUrl = serviceUrl.getUsers();

const UsersContainer: React.FC = () => {
  return (
    <Switch>
      <Route path={AppPath.User}>
        <User />
      </Route>
      <Route path={AppPath.UserList}>
        <UserList />
      </Route>
    </Switch>
  );
};

export default UsersContainer;

const FeatureLayout: React.FC = ({ children }) => {
  return (
    <>
      <FeatureHeader>
        <h1 style={{ fontWeight: 600 }}>Users</h1>
      </FeatureHeader>
      <Box p="1rem">{children}</Box>
    </>
  );
};

const UserList: React.FC = () => {
  const usersQuery = useQuery(getUsersUrl);

  if (usersQuery.isLoading) {
    return (
      <FeatureLayout>
        <DataTableSkeleton />
      </FeatureLayout>
    );
  }

  if (usersQuery.isError) {
    return (
      <FeatureLayout>
        <ErrorMessage />
      </FeatureLayout>
    );
  }
  return (
    <FeatureLayout>
      <UsersTable usersData={usersQuery.data} />
    </FeatureLayout>
  );
};

const DEFAULT_PAGE_SIZE = 10;
const PAGE_SIZES = [DEFAULT_PAGE_SIZE, 20, 50, 100];

const headers = [
  {
    header: "Name",
    key: "name",
    sortable: true,
  },
  {
    header: "Email",
    key: "email",
    sortable: true,
  },
  {
    header: "Id",
    key: "id",
  },
];

interface UsersTableProps {
  usersData: FlowUser[];
}

const UsersTable: React.FC<UsersTableProps> = ({ usersData }) => {
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

  function handleSort(e: React.SyntheticEvent, { sortHeaderKey }: any) {
    const order = sortDirection === "asc" ? "desc" : "asc";
    setSortKey(sortHeaderKey);
    setSortDirection(order);
  }

  function navigateToUser(userId: string) {
    history.push(appLink.user({ userId }));
  }

  const { TableContainer, Table, TableHead, TableRow, TableBody, TableCell, TableHeader } = DataTable;

  const records = usersData;
  const totalElements = usersData.length;

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
                    data-testid="user-list-table-row"
                    onClick={() => navigateToUser(row.id)}
                    onKeyDown={(e: React.SyntheticEvent) => isAccessibleEvent(e) && navigateToUser(row.id)}
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
    <Error404 message={null} title="No users found" header={null} />
  );
};
