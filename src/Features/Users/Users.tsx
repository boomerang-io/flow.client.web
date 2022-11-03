import React from "react";
import { Helmet } from "react-helmet";
import { useQuery } from "Hooks";
import { useHistory, useLocation, Route, Switch } from "react-router-dom";
import { Box } from "reflexbox";
import { DataTable, DataTableSkeleton, Pagination, Search } from "@carbon/react";
import {
  ErrorMessage,
  FeatureHeader as Header,
  FeatureHeaderTitle as HeaderTitle,
  FeatureHeaderSubtitle as HeaderSubtitle,
} from "@boomerang-io/carbon-addons-boomerang-react";
import { isAccessibleKeyboardEvent } from "@boomerang-io/utils";
import EmptyState from "Components/EmptyState";
import UserDetailed from "Features/UserDetailed";
import debounce from "lodash/debounce";
import moment from "moment";
import queryString from "query-string";
import { CREATED_DATE_FORMAT, SortDirection } from "Constants";
import { AppPath, appLink } from "Config/appConfig";
import { serviceUrl } from "Config/servicesConfig";
import { FlowUser, PaginatedResponse } from "Types";
import styles from "./Users.module.scss";

const DEFAULT_ORDER = SortDirection.Desc;
const DEFAULT_PAGE = 0;
const DEFAULT_SIZE = 10;
const DEFAULT_SORT = "name";
const PAGE_SIZES = [DEFAULT_SIZE, 20, 50, 100];

const UsersContainer: React.FC = () => {
  return (
    <Switch>
      <Route path={AppPath.User}>
        <UserDetailed />
      </Route>
      <Route path={AppPath.UserList}>
        <UserList />
      </Route>
    </Switch>
  );
};

interface FeatureLayoutProps {
  handleSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const FeatureLayout: React.FC<FeatureLayoutProps> = ({ children, handleSearchChange }) => {
  return (
    <>
      <Helmet>
        <title>Users</title>
      </Helmet>
      <Header
        includeBorder={false}
        header={
          <>
            <HeaderTitle style={{ margin: "0" }}>Users</HeaderTitle>
            <HeaderSubtitle>View and manage Flow users</HeaderSubtitle>
          </>
        }
      />
      <Box p="2rem" className={styles.content}>
        <>
          <Box mb="1rem" maxWidth="20rem">
            <Search id="flow-users" labelText="Search users" placeholder="Search users" onChange={handleSearchChange} />
          </Box>
          {children}
        </>
      </Box>
    </>
  );
};

const UserList: React.FC = () => {
  const history = useHistory();
  const location = useLocation();

  const usersQuery = useQuery(serviceUrl.getManageUsers({ query: location.search }));

  function handleNavigateToUser(userId: string) {
    history.push(appLink.user({ userId }));
  }

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
  }
  // eslint-disable-next-line
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
    const { property, direction } = usersQuery.data.sort[0];
    let order = SortDirection.Asc;

    if (sort.sortHeaderKey === property && direction === SortDirection.Asc) {
      order = SortDirection.Desc;
    }

    updateHistorySearch({ ...queryString.parse(location.search), order, sort: sort.sortHeaderKey });
  }

  if (usersQuery.isLoading) {
    return (
      <FeatureLayout handleSearchChange={handleSearchChange}>
        <DataTableSkeleton />
      </FeatureLayout>
    );
  }

  if (usersQuery.isError) {
    return (
      <FeatureLayout handleSearchChange={handleSearchChange}>
        <ErrorMessage />
      </FeatureLayout>
    );
  }
  return (
    <FeatureLayout handleSearchChange={handleSearchChange}>
      <UsersTable
        handleNavigateToUser={handleNavigateToUser}
        handlePaginationChange={handlePaginationChange}
        handleSort={handleSort}
        usersData={usersQuery.data}
      />
    </FeatureLayout>
  );
};

const TableHeaderKey = {
  Name: "name",
  Email: "email",
  Type: "type",
  Created: "firstLoginDate",
  LastLogin: "lastLoginDate",
  Status: "status",
};

const headers = [
  {
    header: "Name",
    key: TableHeaderKey.Name,
    sortable: true,
  },
  {
    header: "Email",
    key: TableHeaderKey.Email,
    sortable: true,
  },
  {
    header: "Type",
    key: TableHeaderKey.Type,
    sortable: true,
  },
  {
    header: "Created",
    key: TableHeaderKey.Created,
    sortable: true,
  },
  {
    header: "Last Login",
    key: TableHeaderKey.LastLogin,
    sortable: true,
  },
  {
    header: "Status",
    key: TableHeaderKey.Status,
    sortable: true,
  },
];

interface UsersTableProps {
  handleNavigateToUser: (userId: string) => void;
  handlePaginationChange: (pagination: { page: number; pageSize: number }) => void;
  handleSort: (e: React.SyntheticEvent, sort: { sortHeaderKey: string }) => void;
  usersData: PaginatedResponse<FlowUser>;
}

const UsersTable: React.FC<UsersTableProps> = ({
  handleNavigateToUser,
  handlePaginationChange,
  handleSort,
  usersData,
}) => {
  const { TableContainer, Table, TableHead, TableRow, TableBody, TableCell, TableHeader } = DataTable;
  const { number: page, sort, totalElements, totalPages, records } = usersData;

  return records?.length > 0 ? (
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
                    onClick={() => handleNavigateToUser(row.id)}
                    onKeyDown={(e: React.SyntheticEvent) =>
                      isAccessibleKeyboardEvent(e) && handleNavigateToUser(row.id)
                    }
                    tabIndex={-1}
                  >
                    {row.cells.map((cell: any) => {
                      if (
                        cell.info.header === TableHeaderKey.Created ||
                        cell.info.header === TableHeaderKey.LastLogin
                      ) {
                        return <TableCell key={cell.id}>{moment(cell.value).format(CREATED_DATE_FORMAT)}</TableCell>;
                      }

                      if (Array.isArray(cell.value)) {
                        return <TableCell key={cell.id}>{cell.value.length}</TableCell>;
                      }

                      return <TableCell key={cell.id}>{cell.value}</TableCell>;
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
    <EmptyState message="No users found" />
  );
};

export default UsersContainer;
