import React, { Component } from "react";
import PropTypes from "prop-types";
import { Formik } from "formik";
import * as Yup from "yup";
import get from "lodash.get";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { actions as tasksActions } from "State/tasks";
import ActionBar from "Features/WorkflowManager/components/ActionBar";
import Navigation from "Features/WorkflowManager/components/Navigation";
import Overview from "Features/WorkflowManager/components/Overview";
import DiagramApplication from "Utilities/DiagramApplication";

class WorkflowCreatorContainer extends Component {
  static propTypes = {
    createWorkflow: PropTypes.func.isRequired,
    workflow: PropTypes.object.isRequired
  };

  diagramApp = new DiagramApplication({ dag: null, isLocked: false });

  createWorkflow = () => {
    this.props.createWorkflow(this.diagramApp);
  };

  render() {
    const { workflow } = this.props;

    return (
      <>
        <Navigation onlyShowBackLink />
        <Formik
          initialValues={{
            name: get(workflow, "data.name", ""),
            shortDescription: get(workflow, "data.shortDescription", ""),
            description: get(workflow, "data.description", ""),
            webhook: get(workflow, "data.triggers.webhook.enable", false),
            token: get(workflow, "data.triggers.webhook.token", ""),
            schedule: get(workflow, "data.triggers.scheduler.enable", false),
            event: get(workflow, "data.triggers.event.enable", false),
            topic: get(workflow, "data.triggers.event.topic", ""),
            persistence: get(workflow, "data.enablePersistentStorage", false)
          }}
          validationSchema={Yup.object().shape({
            name: Yup.string()
              .required("Enter a name")
              .max(64, "Name must not be greater than 64 characters"),
            shortDescription: Yup.string().max(128, "Summary must not be greater than 128 characters"),
            description: Yup.string().max(256, "Description must not be greater than 256 characters"),
            webhook: Yup.boolean(),
            token: Yup.string(),
            schedule: Yup.boolean(),
            event: Yup.boolean(),
            topic: Yup.string(),
            persistence: Yup.boolean()
          })}
        >
          {formikProps => (
            <>
              <ActionBar
                diagramApp={this.diagramApp}
                performActionButtonText="Create Workflow"
                performAction={this.createWorkflow}
                isValidOverview={formikProps.isValid}
              />
              <Overview workflow={workflow} formikProps={formikProps} />
            </>
          )}
        </Formik>
      </>
    );
  }
}

const mapStateToProps = state => ({
  tasks: state.tasks,
  workflow: state.workflow
});

const mapDispatchToProps = dispatch => ({
  tasksActions: bindActionCreators(tasksActions, dispatch)
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(WorkflowCreatorContainer);
