import React, { useState } from "react";
import moment from "moment";
import cx from "classnames";
import { settings } from "carbon-components";
import { useAppContext } from "Hooks";
import {
  ButtonSkeleton,
  DataTable,
  DataTableSkeleton,
  Error404,
  ErrorMessage,
  FeatureHeader as Header,
  FeatureHeaderTitle as HeaderTitle,
  Pagination,
} from "@boomerang-io/carbon-addons-boomerang-react";
import DeleteToken from "./DeleteToken";
import CreateToken from "./CreateToken";
import { arrayPagination, sortByProp } from "Utils/arrayHelper";
import { Token } from "Types";
import { UserRole } from "Constants";
import styles from "./tokensComponent.module.scss";

const { prefix } = settings;

const DEFAULT_PAGE_SIZE = 10;
const PAGE_SIZES = [DEFAULT_PAGE_SIZE, 20, 50, 100];

const headers = [
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
    key: "expiryDate",
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

const FeatureLayout = ({ children }: FeatureLayoutProps) => {
  return (
    <div className={styles.container}>
      <Header
        className={styles.header}
        includeBorder={false}
        header={
          <>
            <HeaderTitle className={styles.headerTitle}>Global Tokens</HeaderTitle>
          </>
        }
      />
      <div className={styles.content}>{children}</div>
    </div>
  );
};

interface GlobalTokensTableProps {
  tokens: Token[];
  isLoading: boolean;
  hasError: any;
  deleteToken(tokenId: string): void;
}

function GlobalTokenComponent({ deleteToken, tokens, hasError, isLoading }: GlobalTokensTableProps) {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const [sortKey, setSortKey] = useState("creationDate");
  const [sortDirection, setSortDirection] = useState("DESC");
  const { user } = useAppContext();
  const deleteTokenAvailable = user.type === UserRole.Admin;

  const renderCell = (tokenItemId: string, cellIndex: number, value: string) => {
    const tokenDetails = tokens.find((token: Token) => token.id === tokenItemId);
    const column = headers[cellIndex];
    switch (column.key) {
      case "creationDate":
      case "expiryDate":
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

  const handlePaginationChange = ({ page, pageSize }: {page:number; pageSize: number;}) => {
    setPage(page);
    setPageSize(pageSize);
  };

  function handleSort(e: any, { sortHeaderKey }: {sortHeaderKey: string}) {
    const order = sortDirection === "ASC" ? "DESC" : "ASC";
    setSortKey(sortHeaderKey);
    setSortDirection(order);
  }

  const { TableContainer, Table, TableHead, TableRow, TableBody, TableCell, TableHeader } = DataTable;

  if (isLoading) {
    return (
      <FeatureLayout>
        <ButtonSkeleton className={styles.buttonSkeleton} small />
        <DataTableSkeleton
          data-testid="token-loading-skeleton"
          className={cx(`${prefix}--skeleton`, `${prefix}--data-table`, styles.tableSkeleton)}
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

  if (tokens) {
    return (
      <FeatureLayout>
        <div className={styles.tokenContainer}>
          <CreateToken />
        </div>
        {tokens.length > 0 ? (
          <>
            <DataTable
              rows={arrayPagination(tokens, page, pageSize, sortKey, sortDirection)}
              sortRow={(rows: any) => sortByProp(rows, sortKey, sortDirection.toLowerCase())}
              headers={headers}
              render={({ rows, headers, getHeaderProps }: {rows: any, headers: Array<{header:string; key: string; sortable: boolean;}>, getHeaderProps: any}) => (
                <TableContainer>
                  <Table isSortable>
                    <TableHead>
                      <TableRow className={styles.tableHeadRow}>
                        {headers.map((header: {header:string; key: string; sortable: boolean;}) => (
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
                        <TableRow key={row.id} >
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
              totalItems={tokens.length}
            />
          </>
        ) : (
          <>
            <DataTable
              rows={tokens}
              headers={headers}
              render={({ headers }: {headers: Array<{header:string; key: string; sortable: boolean;}>}) => (
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow className={styles.tableHeadRow}>
                        {headers.map((header: {header:string; key: string; sortable: boolean;}) => (
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
            <Error404 title="No global tokens found" header={null} message={null} theme="boomerang" />
          </>
        )}
      </FeatureLayout>
    );
  }

  return null;
}

export default GlobalTokenComponent;
