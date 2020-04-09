import React, { Fragment } from "react";
import PropTypes from "prop-types";
import moment from "moment";
import { useMutation } from "react-query";
import matchSorter from "match-sorter";
import { DataTable, Search, Pagination } from "carbon-components-react";
import { notify, ToastNotification, NoDisplay, Button , Loading } from "@boomerang/carbon-addons-boomerang-react";
import { useHistory, useRouteMatch } from "react-router-dom";
import ActionsMenu from "./ActionsMenu";
import Header from "Components/Header";
import { arrayPagination } from "Utilities/arrayHelper";
import { resolver, serviceUrl } from "Config/servicesConfig";
import { QueryStatus } from "Constants/reactQueryStatuses";
import styles from "./taskTemplatesTable.module.scss";

const DEFAULT_PAGE_SIZE = 10;
const PAGE_SIZES = [DEFAULT_PAGE_SIZE, 25, 50];

const headers = [
  {
    header: "Name",
    key: "name"
  },
  {
    header: "Key",
    key: "key"
  },
  {
    header: "Description",
    key: "description"
  },
  {
    header: "Category",
    key: "category"
  },
  {
    header: "Type",
    key: "type"
  },
  {
    header: "Date Created",
    key: "dateCreated"
  },
  {
    header: "Updated Date",
    key: "lastModified"
  },
  {
    header: "Latest Version",
    key: "latestVersion"
  },
  {
    header: "Actions",
    key: "actions "
  }
];

TaskTemplatesTable.propTypes = {
  data: PropTypes.array
};

function TaskTemplatesTable({data}) {
  const history = useHistory();
  const match = useRouteMatch();

  const [ page, setPage ] = React.useState(1);
  const [ pageSize, setPageSize ] = React.useState(DEFAULT_PAGE_SIZE);
  const [ taskTemplates, setTaskTemplates ] = React.useState(data);
  const [ sort, setSort ] = React.useState({
    key: "label",
    sortDirection: "ASC"
  });

  const [deleteTaskMutator, { status: deleteStatus }] = useMutation(resolver.deleteTaskTemplate,
    {
      refetchQueries: [serviceUrl.getTaskTemplates()]
    }
  );
  const deleteIsLoading = deleteStatus === QueryStatus.Loading;
  /* Standard table configuration after search or service call */
  const resetTableWithNewProperties = templates => {
    const newPage = page !== 1 && templates.length < pageSize * (page - 1) + 1 ? page - 1 : page;
    setTaskTemplates(templates);
    setPage(newPage);
  };

  // const deletePropertyInStore = propertyId => {
  //   this.props.deletePropertyInStore(propertyId);
  //   const properties = [...this.state.properties];
  //   const newProperties = properties.filter(property => property.id !== propertyId);
  //   this.resetTableWithNewProperties(newProperties);
  // };

  const deleteTaskTemplate = taskTemplate => {    
      deleteTaskMutator({id:taskTemplate.id})
      .then(response => {
        // this.deletePropertyInStore(property.id);
        notify(
          <ToastNotification
            kind="success"
            title={"Property Deleted"}
            subtitle={`Request to delete ${taskTemplate.name} succeeded`}
          />
        );
      })
      .catch(error => {
        notify(<ToastNotification kind="error" title={"Delete Property Failed"} subtitle={"Something went wrong"} />);
      });
  };

  const handleSearchChange = e => {
    const searchQuery = e.target.value;
    const newTaskTemplates = searchQuery
      ? matchSorter(data, searchQuery, { keys: ["name", "description", "category"] })
      : data;

    resetTableWithNewProperties(newTaskTemplates);
  };

  const handlePaginationChange = ({ page, pageSize }) => {
    setPage(page);
    setPageSize(pageSize);
  };

  const renderCell = (templateId, cellIndex, value) => {
    const taskTemplate = data.find(template => template.id === templateId);
    const column = headers[cellIndex];

    switch (column.header) {
      case "Updated Date":
      case "Date Created":
        return( 
        <p className={styles.tableTextarea}>{value
          ? moment(value)
              .utc()
              .startOf("day")
              .format("MMMM DD, YYYY")
          : "---"}
        </p>);
      case "Actions":
        return (
          <ActionsMenu
            flipped
            // deleteProperty={this.deleteProperty}
            deleteTaskTemplate={deleteTaskTemplate}
            taskTemplate={taskTemplate}
            taskTemplates={taskTemplates}
          />
        );
      default:
        return <p className={styles.tableTextarea}>{value || "---"}</p>;
    }
  };

  const handleSort = (valueA, valueB, config) => {
    setSort(config);
  };

    const { TableContainer, Table, TableHead, TableRow, TableBody, TableCell, TableHeader } = DataTable;
    const totalItems = taskTemplates.length;

    return (
      <>
        { deleteIsLoading && <Loading /> }
        <Header title="Task Templates" description="Manage your tasks flow here" />
        <div className={styles.tableContainer}>
          <div className={styles.header}>
            <Search
              className={styles.search}
              id="tasktemplates-table-search"
              labelText="Search"
              placeHolderText="Search"
              onChange={handleSearchChange}
            />
            <Button size="field" onClick={() => history.push(`${match.path}/create`)}>Create Task Template</Button>
          </div>
          {totalItems > 0 ? (
            <>
              <DataTable
                rows={arrayPagination(taskTemplates, page, pageSize, sort)}
                sortRow={handleSort}
                headers={headers}
                render={({ rows, headers, getHeaderProps }) => (
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          {headers.map(header => (
                            <TableHeader
                              id={header.key}
                              {...getHeaderProps({
                                header,
                                className: `${styles.tableHeadHeader} ${styles[header.key]}`
                              })}
                            >
                              {header.header}
                            </TableHeader>
                          ))}
                        </TableRow>
                      </TableHead>
                      <TableBody className={styles.tableBody}>
                        {rows.map(row => (
                          <TableRow key={row.id} data-testid="configuration-tasktemplates-table-row">
                            {row.cells.map((cell, cellIndex) => (
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
                totalItems={totalItems}
              />
            </>
          ) : (
            <Fragment>
              <DataTable
                rows={taskTemplates}
                headers={headers}
                render={({ headers }) => (
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          {headers.map(header => (
                            <TableHeader id={header.key}>{header.header}</TableHeader>
                          ))}
                        </TableRow>
                      </TableHead>
                    </Table>
                  </TableContainer>
                )}
              />
              <NoDisplay
                textLocation="below"
                text={
                  taskTemplates.length > 0
                    ? "No task template found"
                    : "Looks like there aren't any task template. Create one above!"
                }
                style={{ marginTop: "5rem", height: "30rem" }}
              />
            </Fragment>
          )}
        </div>
      </>
    );
}

export default TaskTemplatesTable;
