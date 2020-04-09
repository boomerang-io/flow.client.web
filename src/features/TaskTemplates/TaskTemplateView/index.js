import React from "react";
import PropTypes from "prop-types";
import { matchPath, Link, Route, Switch, useParams, useRouteMatch, Prompt } from "react-router-dom";
import { Formik } from "formik";
import * as Yup from "yup";
import { Error404 } from "@boomerang/carbon-addons-boomerang-react";
import Header from "./Header";
import Overview from "./Overview";
import TemplateConfig from "./TemplateConfig";

TaskTemplateView.propTypes = {
  taskTemplates: PropTypes.array,
  addTemplateInState: PropTypes.func.isRequired,
  updateTemplateInState: PropTypes.func.isRequired
};

function TaskTemplateView({ taskTemplates, addTemplateInState, updateTemplateInState }) {
  const match = useRouteMatch();
  const params = useParams();

  const { taskTemplateId = "", version = ""} = params;
  let taskTemplateToEdit = {};
  let taskTemplateNames = taskTemplates.map(taskTemplate => taskTemplate.name);
  let taskTemplateKeys = taskTemplates.map(taskTemplate => taskTemplate.key);

  if (taskTemplateId) {
    taskTemplateToEdit = taskTemplates.find(taskTemplate => taskTemplate.id === taskTemplateId) ?? {};
    taskTemplateNames = taskTemplateNames.filter(name => name !== taskTemplateToEdit.name);
    taskTemplateKeys = taskTemplateKeys.filter(type => type !== taskTemplateToEdit.key);
  }
  const invalidVersion = version > taskTemplateToEdit.latestVersion;
  // Checks if the version in url are a valid one. If not, go to the latest version
  // Need to improve this
  const currentRevision = taskTemplateToEdit?.revisions ? 
  invalidVersion?
  taskTemplateToEdit.revisions[taskTemplateToEdit.latestVersion - 1]
  :
  taskTemplateToEdit.revisions.find(revision => revision.version.toString() === version)
  :{};
  const { name = "", type = "", description = "", category="", key="" } = taskTemplateToEdit;
  const templateNotFound = match.url.includes("edit") && !taskTemplateToEdit.id;
  const defaultConfig = Array.isArray(currentRevision?.config) ? currentRevision.config : [];

  if(templateNotFound)
    return( 
      <Error404 
        header="Task Template not found" 
        title="Crikey. We can't find the template you are looking for."
        message={
        <div>
          <span>Go to  </span>
          <Link data-testid="go-to-task-templates" to="/task-templates">
            Task Templates
          </Link>
          .
        </div>
      }
      />
    );

  return (
    <Formik
      enableReinitialize={true}
      initialValues={{
        key,
        name,
        type,
        description,
        category,
        arguments: Boolean(currentRevision?.version)? currentRevision.arguments.join(" ") : "",
        command: Boolean(currentRevision?.command)? currentRevision.command : "",
        image: Boolean(currentRevision?.image)? currentRevision.image : "",
        settings: defaultConfig
      }}
      validationSchema={Yup.object().shape({
        key: Yup.string()
          .required("Enter a key")
          .notOneOf(taskTemplateKeys, "Key must be unique")
          ,
        name: Yup.string()
          .required("Enter a name")
          .notOneOf(taskTemplateNames, "Name must be unique")
          ,
        description: Yup.string().required("Enter a description"),
        arguments: Yup.string().required("Enter some arguments"),
        command: Yup.string().required("Enter a command"),
        image: Yup.string().required("Enter a image"),
        category: Yup.string("Enter a category")
      })}
    >
      {formikProps => {
        const {
          dirty,
          values,
          touched,
          errors,
          handleBlur,
          handleChange,
          setFieldValue,
          isSubmitting,
          isValid,
          setSubmitting
        } = formikProps;
        return (
          <>
            <Prompt 
              message={(location, match, ahh) => {
                let prompt = true;
                const templateMatch = matchPath(location.pathname, { path: "/task-templates/edit/:taskTemplateId/:version" });
                if(dirty && templateMatch?.params?.version !== version && !location.pathname.includes("create") && !isSubmitting){
                  prompt = "Are you sure you want to change the version? Your changes will be lost.";
                }
                if (location.pathname === "/task-templates" && dirty && !isSubmitting) {
                  prompt = "Are you sure you want to leave? You have unsaved changes.";
                }
                return prompt;
              }}
            />
            <Header
              isDirty={dirty}
              isEdit={Boolean(taskTemplateId)}
              isValid={isValid}
              taskTemplateToEdit={taskTemplateToEdit}
              isSubmitting={isSubmitting}
              setSubmitting={setSubmitting}
              values={values}
              revisions={taskTemplateToEdit?.revisions}
              currentRevision={currentRevision}
              revisionCount={taskTemplateToEdit?.revisions?.length?? 0}
              updateTemplateInState={updateTemplateInState} 
              addTemplateInState={addTemplateInState}
            />
            <Switch>
              <Route exact path={match.path}>
                <Overview
                  errors={errors}
                  handleBlur={handleBlur}
                  handleChange={handleChange}
                  isEdit={Boolean(taskTemplateId)}
                  setFieldValue={setFieldValue}
                  touched={touched}
                  values={values}
                />
              </Route>
              <Route path={`${match.path}/settings`}>
                <TemplateConfig
                  errors={errors}
                  settings={values.settings}
                  handleBlur={handleBlur}
                  handleChange={handleChange}
                  isEdit={Boolean(taskTemplateId)}
                  setFieldValue={setFieldValue}
                  touched={touched}
                  values={values}
                />
              </Route>
            </Switch>
          </>
        );
      }}
    </Formik>
  );
}

export default TaskTemplateView;
