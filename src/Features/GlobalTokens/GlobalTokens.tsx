import React, { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { Helmet } from "react-helmet";
import { useAppContext } from "Hooks";
import { notify, ToastNotification } from "@boomerang-io/carbon-addons-boomerang-react";
import { serviceUrl, resolver } from "Config/servicesConfig";
import queryString from "query-string";
import styles from "./tokens.module.scss";
import moment from "moment";
import cx from "classnames";
import { Box } from "reflexbox";
import { DataTable, DataTableSkeleton, Pagination } from "@carbon/react";
import {
  FeatureHeader as Header,
  FeatureHeaderTitle as HeaderTitle,
  FeatureHeaderSubtitle as HeaderSubtitle,
  Error404,
  ErrorMessage,
} from "@boomerang-io/carbon-addons-boomerang-react";
import WombatMessage from "Components/WombatMessage";
import DeleteToken from "./DeleteToken";
import CreateToken from "Components/CreateToken";
import { arrayPagination, sortByProp } from "Utils/arrayHelper";
import { FlowTeam, Token } from "Types";

const DEFAULT_PAGE_SIZE = 10;
const PAGE_SIZES = [DEFAULT_PAGE_SIZE, 20, 50, 100];
const HEADERS = [
  {
    header: "Name",
    key: "name",
    sortable: true,
  },
  {
    header: "Status",
    key: "valid",
    sortable: true,
  },
  {
    header: "Description",
    key: "description",
    sortable: true,
  },
  {
    header: "Date Created",
    key: "creationDate",
    sortable: true,
  },
  {
    header: "Expires (UTC)",
    key: "expirationDate",
    sortable: true,
  },
  {
    header: "Scopes",
    key: "permissions",
    sortable: true,
  },
  {
    header: "",
    key: "delete",
    sortable: false,
  },
];

function Tokens({ team }: { team: FlowTeam }) {
  const { activeTeam } = useAppContext();
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const [sortKey, setSortKey] = useState("creationDate");
  const [sortDirection, setSortDirection] = useState("DESC");

  const getTokensUrl = serviceUrl.getTokens({
    query: queryString.stringify({ types: "global" }),
  });

  const {
    data: tokensData,
    error: tokensError,
    isLoading: tokensIsLoading,
  } = useQuery({
    queryKey: getTokensUrl,
    queryFn: resolver.query(getTokensUrl),
    enabled: Boolean(team?.id),
  });

  const { mutateAsync: deleteTokenMutator } = useMutation(resolver.deleteToken, {
    onSuccess: () => queryClient.invalidateQueries([getTokensUrl]),
  });

  if (tokensIsLoading) {
    return (
      <DataTableSkeleton
        data-testid="token-loading-skeleton"
        className={cx(`cds--skeleton`, `cds--data-table`, styles.tableSkeleton)}
        rowCount={DEFAULT_PAGE_SIZE}
        columnCount={HEADERS.length}
        headers={HEADERS.map((header) => header.header)}
      />
    );
  }

  if (tokensError) {
    return <ErrorMessage />;
  }

  const deleteToken = async (tokenId: string) => {
    try {
      await deleteTokenMutator({ tokenId });
      notify(<ToastNotification kind="success" title="Delete Token" subtitle={`Token successfully deleted`} />);
    } catch (error) {
      notify(<ToastNotification kind="error" title="Something's Wrong" subtitle="Request to delete token failed" />);
    }
  };

  const renderCell = (tokenItemId: string, cellIndex: number, value: string) => {
    const tokenDetails = tokensData?.content.find((token: Token) => token.id === tokenItemId);
    const column = HEADERS[cellIndex];
    switch (column.key) {
      case "permissions":
        return <p className={styles.tableTextarea}>{value ? tokenDetails.permissions.join(", ") : "---"}</p>;
      case "valid":
        return <p className={styles.tableTextarea}>{value ? "Active" : "Inactive"}</p>;
      case "creationDate":
      case "expirationDate":
        return (
          <p className={styles.tableTextarea}>
            {value ? moment(value).utc().startOf("day").format("MMMM DD, YYYY") : "---"}
          </p>
        );
      case "delete":
        return tokenDetails && tokenDetails.id ? (
          <DeleteToken tokenItem={tokenDetails} deleteToken={deleteToken} />
        ) : (
          ""
        );
      default:
        return <p className={styles.tableTextarea}>{value || "---"}</p>;
    }
  };

  const handlePaginationChange = ({ page, pageSize }: { page: number; pageSize: number }) => {
    setPage(page);
    setPageSize(pageSize);
  };

  function handleSort(e: any, { sortHeaderKey }: { sortHeaderKey: string }) {
    const order = sortDirection === "ASC" ? "DESC" : "ASC";
    setSortKey(sortHeaderKey);
    setSortDirection(order);
  }

  const { TableContainer, Table, TableHead, TableRow, TableBody, TableCell, TableHeader } = DataTable;

  return (
    <section aria-label={`${team.name} Team Tokens`} className={styles.container}>
      <Helmet>
        <title>{`Tokens - ${team.name}`}</title>
      </Helmet>
      <>
        <div className={styles.buttonContainer}>
          {activeTeam?.id && <CreateToken type="team" principal={activeTeam.id} getTokensUrl={getTokensUrl} />}
        </div>
        {tokensData?.content?.length > 0 ? (
          <>
            <DataTable
              rows={arrayPagination(tokensData?.content, page, pageSize, sortKey, sortDirection)}
              sortRow={(rows: any) => sortByProp(rows, sortKey, sortDirection.toLowerCase())}
              headers={HEADERS}
              render={({
                rows,
                headers,
                getHeaderProps,
              }: {
                rows: any;
                headers: Array<{ header: string; key: string; sortable: boolean }>;
                getHeaderProps: any;
              }) => (
                <TableContainer>
                  <Table isSortable>
                    <TableHead>
                      <TableRow className={styles.tableHeadRow}>
                        {headers.map((header: { header: string; key: string; sortable: boolean }) => (
                          <TableHeader
                            id={header.key}
                            {...getHeaderProps({
                              header,
                              className: `${styles.tableHeadHeader} ${styles[header.key]}`,
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
                    <TableBody className={styles.tableBody}>
                      {rows.map((row: any) => (
                        <TableRow key={row.id}>
                          {row.cells.map((cell: any, cellIndex: number) => (
                            <TableCell key={cell.id} style={{ padding: "0" }}>
                              <div className={styles.tableCell}>{renderCell(row.id, cellIndex, cell.value)}</div>
                            </TableCell>
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
              totalItems={tokensData?.content?.length}
            />
          </>
        ) : activeTeam ? (
          <>
            <DataTable
              rows={tokensData?.content}
              headers={HEADERS}
              render={({ headers }: { headers: Array<{ header: string; key: string; sortable: boolean }> }) => (
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow className={styles.tableHeadRow}>
                        {headers.map((header: { header: string; key: string; sortable: boolean }) => (
                          <TableHeader
                            key={header.key}
                            id={header.key}
                            className={`${styles.tableHeadHeader} ${styles[header.key]}`}
                          >
                            {header.header}
                          </TableHeader>
                        ))}
                      </TableRow>
                    </TableHead>
                  </Table>
                </TableContainer>
              )}
            />
            <Error404 title="No teams tokens found" header={null} message={null} theme="boomerang" />
          </>
        ) : (
          <Box maxWidth="20rem" margin="0 auto">
            <WombatMessage title="Select a team" />
          </Box>
        )}
      </>
    </section>
  );
}

export default Tokens;
