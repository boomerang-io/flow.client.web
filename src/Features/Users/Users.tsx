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
} from "@boomerang-io/carbon-addons-boomerang-react";
import ChangeRole from "./ChangeRole";
import UserDetails from "./UserDetails";
import FeatureHeader from "Components/FeatureHeader";
import queryString from "query-string";
import { SortDirection } from "Constants";
import { serviceUrl } from "Config/servicesConfig";
import { ComposedModalChildProps, FlowUser, PaginatedResponse } from "Types";

const DEFAULT_ORDER = SortDirection.Desc;
const DEFAULT_PAGE = 0;
const DEFAULT_SIZE = 10;
const DEFAULT_SORT = "name";
const PAGE_SIZES = [DEFAULT_SIZE, 20, 50, 100];

const FeatureLayout: React.FC = ({ children }) => {
  return (
    <>
      <FeatureHeader>
        <h1 style={{ fontWeight: 600, margin: 0 }}>Users</h1>
        <p>View and manage all of the Flow users</p>
      </FeatureHeader>
      <Box p="1rem">{children}</Box>
    </>
  );
};

const UserList: React.FC = () => {
  const history = useHistory();
  const location = useLocation();

  const usersQuery = useQuery(serviceUrl.getManageUsers({ query: location.search }));

  // const handleSearchChange = (e) => {
  //   const searchQuery = e.target.value;
  //   setPage(1);
  //   setSearchQuery(searchQuery);
  // };

  /**
   * Function that updates url search history to persist state
   * @param {object} query - all of the query params
   *
   */
  const updateHistorySearch = ({
    order = DEFAULT_ORDER,
    page = DEFAULT_PAGE,
    size = DEFAULT_SIZE,
    sort = DEFAULT_SORT,
    ...props
  }) => {
    const queryStr = `?${queryString.stringify({ order, page, size, sort, ...props })}`;
    history.push({ search: queryStr });
    return;
  };

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
      <UsersTable handlePaginationChange={handlePaginationChange} handleSort={handleSort} usersData={usersQuery.data} />
    </FeatureLayout>
  );
};

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
    header: "Type",
    key: "type",
    sortable: true,
  },
  {
    header: "Created",
    key: "firstLoginDate",
    sortable: true,
  },
  {
    header: "Status",
    key: "status",
    sortable: true,
  },
  {
    header: "",
    key: "",
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

  const { TableContainer, Table, TableHead, TableRow, TableBody, TableCell, TableHeader } = DataTable;
  const { number: page, sort, totalElements, totalPages, records } = usersData;

  return totalElements > 0 ? (
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
                      if (!cell.info.header) {
                        return (
                          <TableCell key={cell.id}>
                            <OverflowMenu flipped>
                              <OverflowMenuItem itemText="Change role" onClick={() => setChangeRoleUserId(row.id)} />
                              <OverflowMenuItem itemText="View details" onClick={() => setViewDeatilsUserId(row.id)} />
                            </OverflowMenu>
                          </TableCell>
                        );
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
        page={page}
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
          return <UserDetails user={records.find((user) => user.id === viewDetailsUserId)} />;
        }}
      </ComposedModal>
      <ComposedModal
        composedModalProps={{ shouldCloseOnOverlayClick: true }}
        isOpen={Boolean(changeRoleUserId)}
        onCloseModal={() => setChangeRoleUserId(null)}
      >
        {({ closeModal }: ComposedModalChildProps) => {
          return <ChangeRole closeModal={closeModal} user={records.find((user) => user.id === changeRoleUserId)} />;
        }}
      </ComposedModal>
    </>
  ) : (
    <Error404 message={null} title="No users found" header={null} />
  );
};
