import React, { useState } from "react";
import moment from "moment";
import cx from "classnames";
import { Box } from "reflexbox";
import { DataTable, DataTableSkeleton, Pagination } from "@carbon/react";
import {
  ComboBox,
  FeatureHeader as Header,
  FeatureHeaderTitle as HeaderTitle,
  FeatureHeaderSubtitle as HeaderSubtitle,
  Error404,
  ErrorMessage,
} from "@boomerang-io/carbon-addons-boomerang-react";
import NoTeamsRedirectPrompt from "Components/NoTeamsRedirectPrompt";
import WombatMessage from "Components/WombatMessage";
import DeleteToken from "./DeleteToken";
import CreateToken from "./CreateToken";
import { arrayPagination, sortByProp } from "Utils/arrayHelper";
import { FlowTeam, Token } from "Types";
import { UserRole } from "Constants";
import styles from "./tokensComponent.module.scss";

const DEFAULT_PAGE_SIZE = 10;
const PAGE_SIZES = [DEFAULT_PAGE_SIZE, 20, 50, 100];

const headers = [
  {
    header: "Name",
    key: "name",
    sortable: true,
  },
  {
    header: "Created By",
    key: "creatorName",
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
    header: "",
    key: "delete",
    sortable: false,
  },
];

interface FeatureLayoutProps {
  children: React.ReactNode;
}

const FeatureLayout: React.FC<FeatureLayoutProps> = ({ children }) => {
  return (
    <div className={styles.container}>
      <Header
        className={styles.header}
        includeBorder={false}
        header={
          <>
            <HeaderTitle className={styles.headerTitle}>Team Tokens</HeaderTitle>
            <HeaderSubtitle>
              Set team-level tokens that are accessible to all workflows owned by the team.
            </HeaderSubtitle>
          </>
        }
      />
      <div className={styles.content}>{children}</div>
    </div>
  );
};

interface TeamTokensTableProps {
  activeTeam?: FlowTeam | null;
  tokens: Token[];
  isLoading: boolean;
  hasError: any;
  deleteToken(tokenId: string): void;
  userType: string;
}

function TeamTokenComponent({ deleteToken, tokens, hasError, isLoading, activeTeam, userType }: TeamTokensTableProps) {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const [sortKey, setSortKey] = useState("creationDate");
  const [sortDirection, setSortDirection] = useState("DESC");
  const deleteTokenAvailable = userType === UserRole.Admin;

  const renderCell = (tokenItemId: string, cellIndex: number, value: string) => {
    const tokenDetails = tokens.find((token: Token) => token.id === tokenItemId);
    const column = headers[cellIndex];
    switch (column.key) {
      case "creationDate":
      case "expirationDate":
        return (
          <p className={styles.tableTextarea}>
            {value ? moment(value).utc().startOf("day").format("MMMM DD, YYYY") : "---"}
          </p>
        );
      case "delete":
        return tokenDetails && tokenDetails.id && deleteTokenAvailable ? (
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

  if (isLoading) {
    return (
      <FeatureLayout>
        <DataTableSkeleton
          data-testid="token-loading-skeleton"
          className={cx(`cds--skeleton`, `cds--data-table`, styles.tableSkeleton)}
          rowCount={DEFAULT_PAGE_SIZE}
          columnCount={headers.length}
          headers={headers.map((header) => header.header)}
        />
      </FeatureLayout>
    );
  }

  if (hasError) {
    return (
      <FeatureLayout>
        <ErrorMessage />
      </FeatureLayout>
    );
  }

  console.log(tokens);

  return (
    <FeatureLayout>
      <>
        <div className={styles.tokenContainer}>{activeTeam?.id && <CreateToken activeTeam={activeTeam} />}</div>
        {tokens?.length > 0 ? (
          <>
            <DataTable
              rows={arrayPagination(tokens, page, pageSize, sortKey, sortDirection)}
              sortRow={(rows: any) => sortByProp(rows, sortKey, sortDirection.toLowerCase())}
              headers={headers}
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
              totalItems={tokens?.length}
            />
          </>
        ) : activeTeam ? (
          <>
            <DataTable
              rows={tokens}
              headers={headers}
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
    </FeatureLayout>
  );
}

export default TeamTokenComponent;
