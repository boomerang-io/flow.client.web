import React from "react";
import { useQuery } from "Hooks";
import { useHistory, useLocation } from "react-router-dom";
import { Box } from "reflexbox";
import {
  ComposedModal,
  DataTable,
  DataTableSkeleton,
  ErrorMessage,
  Error404,
  OverflowMenu,
  OverflowMenuItem,
  Pagination,
  Search,
} from "@boomerang-io/carbon-addons-boomerang-react";
import ChangeRole from "./ChangeRole";
import UserDetails from "./UserDetails";
import FeatureHeader from "Components/FeatureHeader";
import debounce from "lodash/debounce";
import moment from "moment";
import queryString from "query-string";
import { CREATED_DATE_FORMAT, SortDirection } from "Constants";
import { serviceUrl } from "Config/servicesConfig";
import { ComposedModalChildProps, FlowUser, PaginatedResponse } from "Types";

const DEFAULT_ORDER = SortDirection.Desc;
const DEFAULT_PAGE = 0;
const DEFAULT_SIZE = 10;
const DEFAULT_SORT = "name";
const PAGE_SIZES = [DEFAULT_SIZE, 20, 50, 100];

interface FeatureLayoutProps {
  handleSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const FeatureLayout: React.FC<FeatureLayoutProps> = ({ children, handleSearchChange }) => {
  return (
    <>
      <FeatureHeader>
        <h1 style={{ fontWeight: 600, margin: 0 }}>Users</h1>
        <p>View and manage Flow users</p>
      </FeatureHeader>
      <Box p="2rem">
        <>
          <Box mb="1rem" maxWidth="20rem">
            <Search
              id="flow-users"
              labelText="Search users"
              placeHolderText="Search users"
              onChange={handleSearchChange}
            />
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
      <UsersTable handlePaginationChange={handlePaginationChange} handleSort={handleSort} usersData={usersQuery.data} />
    </FeatureLayout>
  );
};

const TableHeaderKey = {
  Name: "name",
  Email: "email",
  Type: "type",
  Created: "firstLoginDate",
  Status: "status",
  Action: "action",
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
    header: "Status",
    key: TableHeaderKey.Status,
    sortable: true,
  },
  {
    header: "",
    key: TableHeaderKey.Action,
  },
];

export default UserList;

interface UsersTableProps {
  handlePaginationChange: (pagination: { page: number; pageSize: number }) => void;
  handleSort: (e: React.SyntheticEvent, sort: { sortHeaderKey: string }) => void;
  usersData: PaginatedResponse<FlowUser>;
}

const UsersTable: React.FC<UsersTableProps> = ({ handlePaginationChange, handleSort, usersData }) => {
  const [viewDetailsUserId, setViewDeatilsUserId] = React.useState(null);
  const [changeRoleUserId, setChangeRoleUserId] = React.useState(null);
  const cancelRequestRef = React.useRef<{} | null>();

  const { TableContainer, Table, TableHead, TableRow, TableBody, TableCell, TableHeader } = DataTable;
  const { number: page, sort, totalElements, totalPages, records } = usersData;

  const viewDetailsUser = records.find((user) => user.id === viewDetailsUserId);
  const changeRoleUser = records.find((user) => user.id === changeRoleUserId);

  return records.length > 0 ? (
    <>
      <DataTable
        rows={records}
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
                  <TableRow key={row.id}>
                    {row.cells.map((cell: any) => {
                      if (cell.info.header === TableHeaderKey.Action) {
                        return (
                          <TableCell key={cell.id}>
                            <OverflowMenu flipped>
                              <OverflowMenuItem itemText="Change role" onClick={() => setChangeRoleUserId(row.id)} />
                              <OverflowMenuItem itemText="View details" onClick={() => setViewDeatilsUserId(row.id)} />
                            </OverflowMenu>
                          </TableCell>
                        );
                      }

                      if (cell.info.header === TableHeaderKey.Created) {
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
      <ComposedModal
        composedModalProps={{ shouldCloseOnOverlayClick: true }}
        isOpen={Boolean(viewDetailsUserId)}
        onCloseModal={() => setViewDeatilsUserId(null)}
      >
        {() => {
          return <UserDetails user={viewDetailsUser} />;
        }}
      </ComposedModal>
      <ComposedModal
        composedModalProps={{ shouldCloseOnOverlayClick: true }}
        isOpen={Boolean(changeRoleUserId)}
        modalHeaderProps={{
          title: "User Role",
          subtitle: `Set ${changeRoleUser?.name ?? "user"}'s role in Flow. Admins can do more things.`,
        }}
        onCloseModal={() => setChangeRoleUserId(null)}
      >
        {({ closeModal }: ComposedModalChildProps) => {
          return <ChangeRole closeModal={closeModal} cancelRequestRef={cancelRequestRef} user={changeRoleUser} />;
        }}
      </ComposedModal>
    </>
  ) : (
    <Error404 message={null} title="No users found" header={null} />
  );
};
