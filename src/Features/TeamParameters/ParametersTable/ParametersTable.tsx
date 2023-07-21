import React, { useState } from "react";
import { DataTable, Pagination, DataTableSkeleton } from "@carbon/react";
import { Error } from "@boomerang-io/carbon-addons-boomerang-react";
import CreateEditParametersModal from "../CreateEditParametersModal";
import ActionsMenu from "./ActionsMenu";
import EmptyState from "Components/EmptyState";
import { InputType, PASSWORD_CONSTANT } from "Constants";
import { Property } from "Types";
import { Checkmark, Close } from "@carbon/react/icons";
import styles from "./parametersTable.module.scss";

const DEFAULT_PAGE_SIZE = 10;
const PAGE_SIZES = [DEFAULT_PAGE_SIZE, 25, 50];
const headers = [
  {
    header: "Label",
    key: "label",
    sortable: true,
  },
  {
    header: "Key",
    key: "key",
    sortable: true,
  },
  {
    header: "Description",
    key: "description",
    sortable: true,
  },
  {
    header: "Value",
    key: "value",
    sortable: true,
  },
  {
    header: "Secured",
    key: "secured",
    sortable: true,
  },
  {
    header: "",
    key: "actions",
  },
];

interface ParametersTableProps {
  parameters: Property[];
  isLoading: boolean;
  hasError: any;
  handleDelete: (component: Property) => Promise<void>;
  handleSubmit: (isEdit: boolean, component: Property) => Promise<void>;
}

const ParametersTable: React.FC<ParametersTableProps> = ({
  parameters,
  isLoading,
  hasError,
  handleDelete,
  handleSubmit,
}) => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);

  const handlePaginationChange = ({ page, pageSize }: { page: number; pageSize: number }) => {
    setPage(page);
    setPageSize(pageSize);
  };

  const renderCell = (propertyId: string, cellIndex: number, value: any) => {
    const parameter = parameters.find((parameter) => parameter.id === propertyId)!;
    const column = headers[cellIndex];
    switch (column.key) {
      case "value":
        const determineValue = value
          ? parameter && parameter.type === InputType.Password
            ? PASSWORD_CONSTANT
            : value
          : "---";
        return <p className={styles.tableTextarea}>{determineValue}</p>;
      case "secured":
        return parameter && parameter.type === InputType.Password ? (
          <Checkmark size={32} alt="secured" className={`${styles.tableSecured} ${styles.secured}`} />
        ) : (
          <Close size={32} alt="unsecured" className={`${styles.tableSecured} ${styles.unsecured}`} />
        );
      case "actions":
        return (
          <ActionsMenu
            parameter={parameter}
            parameters={parameters}
            handleDelete={handleDelete}
            handleSubmit={handleSubmit}
          />
        );
      default:
        return value || "---";
    }
  };

  const { TableContainer, Table, TableHead, TableRow, TableBody, TableCell, TableHeader } = DataTable;
  const totalItems = parameters.length;
  const tableData = parameters.map((p, index) => ({ ...p, id: index.toString() }));

  return (
    <>
      <div className={styles.tableContainer}>
        <div className={styles.tableActions}>
          {!isLoading && !hasError && <CreateEditParametersModal parameters={parameters} handleSubmit={handleSubmit} />}
        </div>
        {isLoading ? (
          <DataTableSkeleton />
        ) : hasError ? (
          <Error />
        ) : totalItems > 0 ? (
          <>
            <DataTable
              rows={tableData}
              headers={headers}
              render={({ rows, headers, getHeaderProps }: { rows: any; headers: any; getHeaderProps: any }) => (
                <TableContainer>
                  <Table isSortable>
                    <TableHead>
                      <TableRow className={styles.tableHeadRow}>
                        {headers.map((header: any, key: any) => (
                          <TableHeader
                            key={`mode-table-key-${key}`}
                            {...getHeaderProps({
                              className: `${styles.tableHeadHeader} ${styles[header.key]}`,
                              header,
                              isSortable: header.sortable,
                            })}
                          >
                            {header.header}
                          </TableHeader>
                        ))}
                      </TableRow>
                    </TableHead>
                    <TableBody className={styles.tableBody}>
                      {rows.map((row: any) => {
                        return (
                          <TableRow key={row.id}>
                            {row.cells.map((cell: any, cellIndex: number) => (
                              <TableCell key={cell.id}>
                                <div className={styles.tableCell}>{renderCell(row.id, cellIndex, cell.value)}</div>
                              </TableCell>
                            ))}
                          </TableRow>
                        );
                      })}
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
              totalItems={totalItems}
            />
          </>
        ) : (
          <>
            <EmptyState title="No team parameters" message={null} />
          </>
        )}
      </div>
    </>
  );
};

export default ParametersTable;
