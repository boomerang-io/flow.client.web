import React from "react";
// import PropTypes from "prop-types";
import { useQuery } from "react-query";
import { matchPath, Route, Switch, useLocation, useRouteMatch } from "react-router-dom";
import ErrorDragon from "Components/ErrorDragon";
import Loading from "Components/Loading";
import TaskTemplatesTable from "./TaskTemplatesTable";
import TaskTemplateView from "./TaskTemplateView";
import { resolver, serviceUrl } from "Config/servicesConfig";
import { QueryStatus } from "Constants/reactQueryStatuses";
import styles from "./taskTemplates.module.scss";

export function TaskTemplatesContainer(){
  const match = useRouteMatch();
  const getTaskTemplatesUrl = serviceUrl.getTaskTemplates();
  const {
    data: taskTemplatesData,
    error: taskTemplatesDataError,
    status: taskTemplatesStatus
  } = useQuery({queryKey: getTaskTemplatesUrl, queryFn: resolver.query(getTaskTemplatesUrl)});
  const isLoading = taskTemplatesStatus === QueryStatus.Loading;
    if (isLoading) {
      return <Loading />;
    }

    if (taskTemplatesDataError) {
      return (
        <div className={styles.container}>
          <ErrorDragon />
        </div>
      );
    }

    if (taskTemplatesData) {
      return (
        <div className={styles.container}>
        <Switch>
          <Route path={[`${match.path}/edit/:taskTemplateId`, `${match.path}/create`]}>
            <TaskTemplateView taskTemplates={taskTemplatesData} />
          </Route>
          <Route exact path={match.path}>
            <TaskTemplatesTable
              data={taskTemplatesData}
            />
          </Route>
        </Switch>
        </div>
      );
    }

    return null;
}

export default TaskTemplatesContainer;
