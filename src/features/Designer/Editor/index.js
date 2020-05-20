import React, { Component } from "react";
import PropTypes from "prop-types";
import { Route, Switch, withRouter } from "react-router-dom";
import { DiagramWidget } from "@projectstorm/react-diagrams";
import { SkeletonPlaceholder, SkeletonText } from "@boomerang/carbon-addons-boomerang-react";
import ChangeLog from "./ChangeLog";
import DesignerHeader from "./DesignerHeader";
import Overview from "./Overview";
import Tasks from "./Tasks";
import Properties from "./Properties";
import WorkflowZoom from "Components/WorkflowZoom";
import { QueryStatus } from "Constants";
import cx from "classnames";
import DiagramApplication from "Utilities/DiagramApplication";
import { TaskTemplateStatus } from "Constants/taskTemplateStatuses";
import styles from "./Editor.module.scss";

class Editor extends Component {
  static propTypes = {
    createNode: PropTypes.func.isRequired,
    createRevision: PropTypes.func.isRequired,
    changeRevision: PropTypes.func.isRequired,
    formikProps: PropTypes.object.isRequired,
    isModalOpen: PropTypes.bool.isRequired,
    location: PropTypes.object.isRequired,
    match: PropTypes.object.isRequired,
    revisionMutation: PropTypes.object.isRequired,
    revisionState: PropTypes.object.isRequired,
    summaryData: PropTypes.object.isRequired,
    tasks: PropTypes.object.isRequired,
    teams: PropTypes.array.isRequired,
    updateSummary: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.diagramApp = new DiagramApplication({ dag: props.revisionState.dag, isLocked: false });
    this.state = {
      diagramBoundingClientRect: {},
    };
    this.diagramRef = React.createRef();
  }

  componentDidMount() {
    if (this.diagramRef.current) {
      this.setState({
        diagramBoundingClientRect: this.diagramRef.current.getBoundingClientRect(),
      });
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.revisionState.version !== prevProps.revisionState.version) {
      const { revisionCount } = this.props.summaryData;
      const { version } = this.props.revisionState;
      const isLocked = version < revisionCount;
      this.diagramApp = new DiagramApplication({ dag: this.props.revisionState.dag, isLocked });
      this.diagramApp.getDiagramEngine().repaintCanvas();
      this.forceUpdate();
    }

    if (!prevProps.location.pathname.endsWith("/designer") && this.props.location.pathname.endsWith("/designer")) {
      this.diagramApp.getDiagramEngine().zoomToFit();
    }
  }

  createRevision = ({ closeModal, reason }) => {
    this.props.createRevision({ diagramApp: this.diagramApp, reason, closeModal });
  };

  render() {
    const {
      createNode,
      changeRevision,
      formikProps,
      isModalOpen,
      location,
      match,
      revisionMutation,
      revisionState,
      revisionQuery,
      summaryData,
      tasks,
      teams,
      updateSummary,
    } = this.props;

    const isRevisionLoading = revisionQuery.status === QueryStatus.Loading;

    return (
      <>
        <DesignerHeader
          changeRevision={changeRevision}
          createRevision={this.createRevision}
          isOnDesigner={location.pathname.endsWith("/designer")}
          revisionState={revisionState}
          revisionMutation={revisionMutation}
          revisionQuery={revisionQuery}
          summaryData={summaryData}
        />
        <Switch>
          <Route path={`${match.path}/settings`}>
            <Overview formikProps={formikProps} summaryData={summaryData} teams={teams} updateSummary={updateSummary} />
          </Route>
          <Route path={`${match.path}/properties`}>
            <Properties summaryData={summaryData} />
          </Route>
          <Route path={`${match.path}/designer`}>
            <div className={styles.container}>
              <Tasks tasks={tasks.filter((task) => task.status === TaskTemplateStatus.Active)} />
              {isRevisionLoading ? (
                <WorkflowSkeleton />
              ) : (
                <div
                  className={styles.designer}
                  onDrop={(event) => createNode(this.diagramApp, event)}
                  onDragOver={(event) => {
                    event.preventDefault();
                  }}
                  ref={this.diagramRef}
                >
                  <WorkflowZoom
                    diagramApp={this.diagramApp}
                    diagramBoundingClientRect={this.state.diagramBoundingClientRect}
                  />
                  <DiagramWidget
                    allowCanvasTranslation={!isModalOpen}
                    allowCanvasZoom={!isModalOpen}
                    className={styles.diagram}
                    deleteKeys={[]}
                    diagramEngine={this.diagramApp.getDiagramEngine()}
                    maxNumberPointsPerLink={0}
                  />
                </div>
              )}
            </div>
          </Route>
          <Route path={`${match.path}/changes`}>
            <ChangeLog summaryData={summaryData} />
          </Route>
        </Switch>
      </>
    );
  }
}

function WorkflowSkeleton() {
  return (
    <div className={cx(styles.designer, styles.loading)}>
      <div className={styles.loadingContainer}>
        <SkeletonPlaceholder className={styles.loadingStartNode} />
        <SkeletonText className={styles.loadingEdge} />
        <SkeletonPlaceholder className={styles.loadingTaskNode} />
        <SkeletonText className={styles.loadingEdge} />
        <SkeletonPlaceholder className={styles.loadingStartNode} />
        <SkeletonText className={styles.loadingEdge} />
        <SkeletonPlaceholder className={styles.loadingStartNode} />
      </div>
    </div>
  );
}

export default withRouter(Editor);
