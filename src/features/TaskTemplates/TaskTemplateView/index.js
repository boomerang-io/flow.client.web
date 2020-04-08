import React from "react";
import PropTypes from "prop-types";
import { matchPath, Route, Switch, useLocation, useParams, useHistory, useRouteMatch, Prompt } from "react-router-dom";
import { Formik } from "formik";
import * as Yup from "yup";
import Header from "./Header";
import Overview from "./Overview";
import TemplateConfig from "./TemplateConfig";

TaskTemplateView.propTypes = {
  taskTemplates: PropTypes.array
};

function TaskTemplateView({ taskTemplates }) {
  const match = useRouteMatch();
  const params = useParams();

  const { taskTemplateId = "" } = params;
  let taskTemplateToEdit = {};
  let taskTemplateNames = taskTemplates.map(taskTemplate => taskTemplate.name);
  let taskTemplateKeys = taskTemplates.map(taskTemplate => taskTemplate.key);

  if (taskTemplateId) {
    taskTemplateToEdit = taskTemplates.find(taskTemplate => taskTemplate.id === taskTemplateId) ?? {};
    taskTemplateNames = taskTemplateNames.filter(name => name !== taskTemplateToEdit.name);
    taskTemplateKeys = taskTemplateKeys.filter(type => type !== taskTemplateToEdit.key);
  }

  const [ currentRevision, setCurrentRevision ] = React.useState(taskTemplateToEdit?.revisions ? taskTemplateToEdit.revisions[taskTemplateToEdit.revisions.length - 1]:{});
  const { name = "", type = "", description = "", category="", key="" } = taskTemplateToEdit;
  const defaultConfig = Array.isArray(currentRevision?.config) ? currentRevision.config : [];
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
              message={location => {
                let prompt = true;
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
              setCurrentRevision={setCurrentRevision}
              revisionCount={taskTemplateToEdit?.revisions?.length?? 0}
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
