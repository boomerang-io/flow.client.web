//@ts-nocheck
import React, { useState } from "react";
import cx from "classnames";
import { useQuery } from "Hooks";
import { Helmet } from "react-helmet";
import { Formik } from "formik";
import axios from "axios";
import { useParams, useHistory, Prompt, matchPath } from "react-router-dom";
import { useMutation, useQueryClient } from "react-query";
import { InlineNotification } from "@carbon/react";
import { Loading, notify, ToastNotification } from "@boomerang-io/carbon-addons-boomerang-react";
import { ChevronRight } from "@carbon/react/icons";
import EmptyState from "Components/EmptyState";
import Header from "../Header";
import { formatErrorMessage } from "@boomerang-io/utils";
import { TaskTemplateStatus } from "Constants";
import { TemplateRequestType } from "../constants";
import { resolver, serviceUrl } from "Config/servicesConfig";
import { appLink, AppPath } from "Config/appConfig";
import styles from "./TaskTemplateEditor.module.scss";
import { TaskTemplate } from "Types";
import ReactMarkdown from "react-markdown";
import { yamlInstructions } from "Constants";

// import CodeMirror from "codemirror";
import { Controlled as CodeMirrorReact } from "react-codemirror2";
import "codemirror/lib/codemirror.css";
import "codemirror/theme/material.css";
import "codemirror/mode/yaml/yaml";
import "codemirror/addon/hint/show-hint";
import "codemirror/addon/hint/javascript-hint";
import "codemirror/addon/search/searchcursor";
import "codemirror/addon/fold/foldgutter.css";
import "codemirror/addon/fold/foldcode.js";
import "codemirror/addon/fold/foldgutter.js";
import "codemirror/addon/fold/brace-fold.js";
import "codemirror/addon/fold/indent-fold.js";
import "codemirror/addon/fold/comment-fold.js";
import "codemirror/addon/comment/comment.js";
import "Styles/markdown.css";

type TaskTemplateYamlEditorProps = {
  taskTemplates: Record<string, TaskTemplate[]>;
  editVerifiedTasksEnabled: any;
  getTaskTemplatesUrl: string;
};

export function TaskTemplateYamlEditor({
  taskTemplates,
  editVerifiedTasksEnabled,
  getTaskTemplatesUrl,
}: TaskTemplateYamlEditorProps) {
  const [isSaving, setIsSaving] = React.useState(false);
  const cancelRequestRef = React.useRef();
  const queryClient = useQueryClient();

  const params = useParams();
  const history = useHistory();

  const [docOpen, setDocOpen] = useState(true);

  const getTaskTemplateYamlUrl = serviceUrl.getTaskTemplateYaml({ name: params.name, version: params.version });

  const {
    data: yamlData,
    loading: yamlLoading,
    error: yamlError,
  } = useQuery({
    queryKey: getTaskTemplateYamlUrl,
    queryFn: resolver.queryYaml(getTaskTemplateYamlUrl),
  });

  const invalidateQueries = () => {
    queryClient.invalidateQueries(getTaskTemplatesUrl);
    queryClient.invalidateQueries(serviceUrl.getFeatureFlags());
    queryClient.invalidateQueries(getTaskTemplateYamlUrl);
  };

  const invalidateYaml = () => {
    queryClient.invalidateQueries(serviceUrl.getTaskTemplateYaml({ id: params.taskId, revision: params.version }));
  };

  const applyTaskTemplateYamlMutation = useMutation(resolver.putApplyTaskTemplateYaml);
  const applyTaskTemplateMutation = useMutation(resolver.putApplyTaskTemplate);
  const archiveTaskTemplateMutation = useMutation(resolver.putStatusTaskTemplate);
  const restoreTaskTemplateMutation = useMutation(resolver.putStatusTaskTemplate);

  let selectedTaskTemplateVersions = taskTemplates[params.name] ?? [];
  console.log("selectedTaskTemplateList", selectedTaskTemplateVersions);
  // Checks if the version in url are a valid one. If not, go to the latest version
  const invalidVersion = params.version === "0" || params.version > selectedTaskTemplateVersions.length;
  console.log("invalidVersion", invalidVersion);
  const selectedTaskTemplateVersion = invalidVersion ? selectedTaskTemplateVersions.length : params.version;
  console.log("selectedTaskTemplateVersion", selectedTaskTemplateVersion);
  let selectedTaskTemplate = selectedTaskTemplateVersions.find((t) => t.version == selectedTaskTemplateVersion) ?? {};
  console.log("selectedTaskTemplate", selectedTaskTemplate);
  const canEdit = !selectedTaskTemplate?.verified || (editVerifiedTasksEnabled && selectedTaskTemplate?.verified);
  console.log("canEdit", canEdit);
  const isActive = selectedTaskTemplate.status === TaskTemplateStatus.Active;
  console.log("isActive", isActive);
  const isOldVersion = !invalidVersion && params.version != selectedTaskTemplateVersions.length;
  console.log("isOldVersion", isOldVersion);
  const templateNotFound = !selectedTaskTemplate.name;

  const handleSaveTaskTemplate = async (values, resetForm, requestType, setRequestError, closeModal) => {
    setIsSaving(true);
    let newVersion =
      requestType === TemplateRequestType.Overwrite
        ? selectedTaskTemplateVersion
        : selectedTaskTemplateVersions.length + 1;
    let changeReason =
      requestType === TemplateRequestType.Copy
        ? "Version copied from ${values.currentConfig.version}"
        : values.comments;

    try {
      let response;
      if (requestType === TemplateRequestType.Copy) {
        let body = { ...selectedTaskTemplate, version: newVersion, changelog: { reason: changeReason } };
        response = await applyTaskTemplateMutation.mutateAsync({
          replace: false,
          team: params.teamId,
          body,
        });
      } else if (requestType === TemplateRequestType.Overwrite) {
        response = await applyTaskTemplateYamlMutation.mutateAsync({
          replace: true,
          team: params.teamId,
          body: values.yaml,
        });
        queryClient.invalidateQueries(getTaskTemplateYamlUrl);
      } else {
        response = await applyTaskTemplateYamlMutation.mutateAsync({
          replace: false,
          team: params.teamId,
          body: values.yaml,
        });
        queryClient.invalidateQueries(getTaskTemplateYamlUrl);
      }
      queryClient.invalidateQueries(getTaskTemplatesUrl);
      queryClient.invalidateQueries(serviceUrl.getFeatureFlags());
      notify(
        <ToastNotification
          kind="success"
          title={"Task Template Updated"}
          // subtitle={`Request to update ${body.name} succeeded`}
          subtitle={`Request to update succeeded`}
          data-testid="create-update-task-template-notification"
        />
      );
      resetForm();
      history.push(
        //@ts-ignore
        appLink.manageTaskTemplateYaml({
          teamId: params?.teamId,
          taskId: params.taskId,
          version: response.data.currentVersion,
        })
      );
      if (requestType !== TemplateRequestType.Copy) {
        typeof setRequestError === "function" && setRequestError(null);
        typeof closeModal === "function" && closeModal();
      }
    } catch (err) {
      if (requestType !== TemplateRequestType.Copy) {
        const { title, message: subtitle } = formatErrorMessage({
          error: err,
          defaultMessage: "Request to save task template failed.",
        });
        setRequestError({ title, subtitle });
      } else {
        notify(
          <ToastNotification
            kind="error"
            title={"Update Task Template Failed"}
            subtitle={"Something's Wrong"}
            data-testid="update-task-template-notification"
          />
        );
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleArchiveTaskTemplate = async () => {
    try {
      await archiveTaskTemplateMutation.mutateAsync({ name: params.name, status: "disable" });
      await queryClient.invalidateQueries(getTaskTemplatesUrl);
      await queryClient.invalidateQueries(serviceUrl.getFeatureFlags());
      notify(
        <ToastNotification
          kind="success"
          title={"Successfully Archived Task Template"}
          subtitle={`Request to archive ${selectedTaskTemplate.name} succeeded`}
          data-testid="archive-task-template-notification"
        />
      );
    } catch (err) {
      notify(
        <ToastNotification
          kind="error"
          title={"Archive Task Template Failed"}
          subtitle={`Unable to archive the task. ${sentenceCase(err.message)}. Please contact support.`}
          data-testid="archive-task-template-notification"
        />
      );
    }
  };

  const handleRestoreTaskTemplate = async () => {
    try {
      await restoreTaskTemplateMutation.mutateAsync({ name: selectedTaskTemplate.name, status: "enable" });
      await queryClient.invalidateQueries(getTaskTemplatesUrl);
      await queryClient.invalidateQueries(serviceUrl.getFeatureFlags());
      notify(
        <ToastNotification
          kind="success"
          title={"Successfully Restored Task Template"}
          subtitle={`Request to restore ${selectedTaskTemplate.name} succeeded`}
          data-testid="restore-task-template-notification"
        />
      );
    } catch (err) {
      notify(
        <ToastNotification
          kind="error"
          title={"Restore Task Template Failed"}
          subtitle={`Unable to restore the task. ${sentenceCase(err.message)}. Please contact support.`}
          data-testid="restore-task-template-notification"
        />
      );
    }
  };

  const handleDownloadTaskTemplate = async () => {
    try {
      const response = await axios.get(
        serviceUrl.getTaskTemplateYaml({ name: selectedTaskTemplate.name, version: selectedTaskTemplate.version }),
        {
          headers: { Accept: "application/x-yaml" },
        }
      );
      fileDownload(response.data, `${selectedTaskTemplate.name}.yaml`);
      notify(
        <ToastNotification
          kind="success"
          title={"Task Template Download"}
          subtitle={`Request to download ${params.name} started.`}
          data-testid="downloaded-task-template-notification"
        />
      );
    } catch (err) {
      console.log("err", err);
      notify(
        <ToastNotification
          kind="error"
          title={"Download Task Template Failed"}
          subtitle={`Unable to download the task template. ${sentenceCase(err.message)}. Please contact support.`}
          data-testid="download-task-template-notification"
        />
      );
    }
  };

  if (yamlLoading || applyTaskTemplateYamlMutation.isLoading) {
    return <Loading />;
  }

  if (templateNotFound || yamlError)
    return (
      <EmptyState title="Task Template not found" message="Crikey. We can't find the template you are looking for." />
    );

  return (
    <Formik
      initialValues={{
        yaml: yamlData ?? "",
      }}
      enableReinitialize={true}
    >
      {(formikProps) => {
        const { setFieldValue, values, dirty: isDirty, isSubmitting } = formikProps;

        return (
          <div className={styles.container}>
            <Helmet>
              <title>{`Task manager - ${selectedTaskTemplate.name}`}</title>
            </Helmet>
            <Prompt
              message={(location) => {
                let prompt = true;
                const templateMatch = matchPath(location.pathname, {
                  path: AppPath.TaskTemplateDetail,
                });
                if (isDirty && !location.pathname.includes(templateMatch?.params?.id) && !isSubmitting) {
                  prompt = "Are you sure you want to leave? You have unsaved changes.";
                }
                if (
                  isDirty &&
                  templateMatch?.params?.version !== selectedTaskTemplate.currentVersion &&
                  !isSubmitting
                ) {
                  prompt = "Are you sure you want to change the version? Your changes will be lost.";
                }
                return prompt;
              }}
            />
            {(applyTaskTemplateMutation.isLoading ||
              archiveTaskTemplateMutation.isLoading ||
              restoreTaskTemplateMutation.isLoading) && <Loading />}
            <Header
              editVerifiedTasksEnabled={editVerifiedTasksEnabled}
              selectedTaskTemplate={selectedTaskTemplate}
              selectedTaskTemplates={selectedTaskTemplateVersions}
              formikProps={formikProps}
              handleRestoreTaskTemplate={handleRestoreTaskTemplate}
              handleArchiveTaskTemplate={handleArchiveTaskTemplate}
              handleSaveTaskTemplate={handleSaveTaskTemplate}
              handleDownloadTaskTemplate={handleDownloadTaskTemplate}
              isActive={isActive}
              isLoading={isSubmitting || isSaving}
              isOldVersion={isOldVersion}
              cancelRequestRef={cancelRequestRef}
            />
            <div className={styles.content}>
              {!canEdit && (
                <section className={styles.notificationsContainer}>
                  <InlineNotification
                    lowContrast
                    hideCloseButton={true}
                    kind="info"
                    title="Verified tasks are not editable"
                    subtitle="Admins can adjust this in global settings"
                  />
                </section>
              )}
              <section className={styles.yamlContainer}>
                <CodeMirrorReact
                  className={cx(styles.codeMirrorContainer, { [styles.yamlCollapsed]: !docOpen })}
                  //   editorDidMount={(cmeditor) => {
                  //     editor.current = cmeditor;
                  //     setDoc(cmeditor.getDoc());
                  //   }}
                  value={values.yaml}
                  options={{
                    mode: "yaml",
                    // readOnly: props.readOnly,
                    theme: "material",
                    // extraKeys: {
                    //   "Ctrl-Space": "autocomplete",
                    //   "Ctrl-Q": foldCode,
                    //   "Cmd-/": toggleComment,
                    //   "Shift-Alt-A": blockComment,
                    //   "Shift-Opt-A": blockComment,
                    // },
                    lineWrapping: true,
                    foldGutter: true,
                    lineNumbers: true,
                    gutters: ["CodeMirrorReact-linenumbers", "CodeMirror-foldgutter"],
                    // ...languageParams,
                  }}
                  onBeforeChange={(editor, data, value) => {
                    setFieldValue("yaml", value);
                  }}
                  //TB: trying to get autocomplete to work
                  //   onKeyUp={(cm, event) => {
                  //     if (
                  //       !cm.state.completionActive /*Enables keyboard navigation in autocomplete list*/ &&
                  //       event.keyCode !== 13
                  //     ) {
                  //       /*Enter - do not open autocomplete list just after item has been selected in it*/
                  //       autoComplete(cm);
                  //     }
                  //   }}
                />
                <div className={cx(styles.markdownContainer, { [styles.collapsed]: !docOpen })}>
                  <button className={styles.collapseButton} onClick={() => setDocOpen(!docOpen)}>
                    <ChevronRight size={32} className={styles.collapseButtonImg} />
                  </button>
                  {docOpen && <ReactMarkdown className="markdown-body" children={yamlInstructions} />}
                </div>
              </section>
            </div>
          </div>
        );
      }}
    </Formik>
  );
}

export default TaskTemplateYamlEditor;
