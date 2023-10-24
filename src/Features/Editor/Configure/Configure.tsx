import React, { useState } from "react";
import { Helmet } from "react-helmet";
import { Switch, Route, Redirect, useLocation, useParams } from "react-router-dom";
import { useQuery } from "react-query";
import { useFeature } from "flagged";
import { Formik, FormikProps, FieldArray } from "formik";
import { Tag, MultiSelect, InlineNotification, Button } from "@carbon/react";
import { Launch, Popup } from "@carbon/react/icons";
import {
  ComposedModal,
  TextArea,
  TextInput,
  Toggle,
  TooltipHover,
  CheckboxList,
} from "@boomerang-io/carbon-addons-boomerang-react";
import cx from "classnames";
import capitalize from "lodash/capitalize";
import * as Yup from "yup";
import BuildWebhookModalContent from "./BuildWebhookModalContent";
import ConfigureEventTrigger from "./ConfigureEventTrigger";
import ConfigureStorage from "./ConfigureStorage";
import { resolver, serviceUrl } from "Config/servicesConfig";
import NavPanel from "./SideNav";
import CustomLabel from "./CustomLabel";
import { appLink, AppPath, BASE_DOCUMENTATION_URL, FeatureFlag } from "Config/appConfig";
import workflowIcons from "Assets/workflowIcons";
import { WorkspaceConfigType } from "Constants";
import { Workflow, ConfigureWorkflowFormValues } from "Types";
import styles from "./configure.module.scss";

interface ConfigureContainerProps {
  quotas: {
    maxActivityStorageSize: string;
    maxWorkflowStorageSize: string;
  };
  workflow: Workflow;
  settingsRef: React.MutableRefObject<FormikProps<any> | null>;
}

function ConfigureContainer({ quotas, workflow, settingsRef }: ConfigureContainerProps) {
  const params = useParams<{ team: string; workflowId: string }>();
  const workflowTriggersEnabled = useFeature(FeatureFlag.WorkflowTriggersEnabled);
  const location = useLocation();

  const getGitHubAppInstallationForTeam = serviceUrl.getGitHubAppInstallationForTeam({
    team: params.team,
  });

  const getGitHubInstallationQuery = useQuery({
    queryKey: getGitHubAppInstallationForTeam,
    queryFn: resolver.query(getGitHubAppInstallationForTeam),
    enabled: Boolean(params.team),
  });

  const isOnConfigurePath = location.pathname.startsWith(
    appLink.editorConfigure({ team: params.team, workflowId: params.workflowId })
  );
  console.log(isOnConfigurePath);

  // Find the specific workspace configs we want that are used for storage storage
  const workflowStorageConfig = workflow.workspaces?.find(
    (workspaceConfig) => workspaceConfig.type === WorkspaceConfigType.Workflow
  );
  const workflowRunStorageConfig = workflow.workspaces?.find(
    (workspaceConfig) => workspaceConfig.type === WorkspaceConfigType.WorflowRun
  );

  return (
    <>
      <Helmet>
        <title>{`Configure - ${workflow.name}`}</title>
      </Helmet>
      <Formik<ConfigureWorkflowFormValues>
        innerRef={settingsRef}
        enableReinitialize
        onSubmit={() => void 0}
        initialValues={{
          description: workflow.description ?? "",
          storage: {
            workflow: {
              enabled: Boolean(workflowStorageConfig),
              size: workflowStorageConfig?.spec?.size ?? 1,
              mountPath: workflowStorageConfig?.spec?.mountPath ?? "",
            },
            workflowrun: {
              enabled: Boolean(workflowRunStorageConfig),
              size: workflowRunStorageConfig?.spec?.size ?? 1,
              mountPath: workflowRunStorageConfig?.spec?.mountPath ?? "",
            },
          },
          icon: workflow.icon ?? "",
          name: workflow.name ?? "",
          timeout: workflow.timeout ?? null,
          retries: workflow.retries ?? null,
          labels: workflow.labels ? Object.entries(workflow.labels).map(([key, value]) => ({ key, value })) : [],
          triggers: {
            manual: {
              enable: workflow.triggers?.manual?.enable ?? true,
            },
            event: {
              enable: workflow.triggers?.event?.enable ?? false,
              subject: workflow.triggers?.event?.subject ?? "",
              type: workflow.triggers?.event?.type ?? "",
            },
            scheduler: {
              enable: workflow.triggers?.scheduler?.enable ?? false,
            },
            webhook: {
              enable: workflow.triggers?.webhook?.enable ?? false,
            },
            github: {
              enable: workflow.triggers?.github?.enable ?? false,
              events: workflow.triggers?.github?.events ?? [],
              repositories: workflow.triggers?.github?.repositories ?? [],
            },
          },
          config: workflow.config ?? [],
        }}
        validationSchema={Yup.object().shape({
          description: Yup.string().max(250, "Description must not be greater than 250 characters"),
          enableACCIntegration: Yup.boolean(),
          storage: Yup.object().shape({
            activity: Yup.object().shape({
              enabled: Yup.boolean().nullable(),
              size: Yup.number().required("Enter the storage size"),
              mountPath: Yup.string().nullable(),
            }),
            workflow: Yup.object().shape({
              enabled: Yup.boolean().nullable(),
              size: Yup.number().required("Enter the storage size"),
              mountPath: Yup.string().nullable(),
            }),
          }),
          icon: Yup.string(),
          name: Yup.string().required("Name is required").max(64, "Name must not be greater than 64 characters"),
          retries: Yup.number(),
          timeout: Yup.number(),
          triggers: Yup.object().shape({
            manual: Yup.object().shape({
              enable: Yup.boolean(),
            }),
            event: Yup.object().shape({
              enable: Yup.boolean(),
              type: Yup.string(),
              subject: Yup.string(),
            }),
            scheduler: Yup.object().shape({
              enable: Yup.boolean(),
            }),
            webhook: Yup.object().shape({
              enable: Yup.boolean(),
            }),
            github: Yup.object().shape({
              enable: Yup.boolean(),
              events: Yup.array().of(Yup.string()),
              repositories: Yup.array().of(Yup.string()),
            }),
          }),
        })}
      >
        {(formikProps) =>
          isOnConfigurePath ? (
            <div className={styles.container}>
              <NavPanel team={params.team} workflowId={params.workflowId}></NavPanel>
              <Configure
                workflowTriggersEnabled={workflowTriggersEnabled as boolean}
                formikProps={formikProps}
                quotas={quotas}
                workflow={workflow}
                githubAppInstallation={getGitHubInstallationQuery.data}
              />
            </div>
          ) : null
        }
      </Formik>
    </>
  );
}

export default ConfigureContainer;

interface ConfigureProps {
  workflowTriggersEnabled: boolean;
  formikProps: FormikProps<ConfigureWorkflowFormValues>;
  quotas: {
    maxActivityStorageSize: string;
    maxWorkflowStorageSize: string;
  };
  workflow: Workflow;
  githubAppInstallation: any;
}

function Configure(props: ConfigureProps) {
  const handleOnToggleChange = (value: any, id: string) => {
    props.formikProps.setFieldValue(id, value);
  };

  const {
    quotas,
    formikProps: { errors, handleBlur, touched, values, setFieldValue },
  } = props;

  const githubEvents = props.githubAppInstallation?.events
    ? props.githubAppInstallation.events.map((item: string) => ({
        labelText: item,
        id: item,
      }))
    : [];
  const githubRepositories = props.githubAppInstallation?.repositories
    ? props.githubAppInstallation.repositories.map((item: string) => ({
        label: props.githubAppInstallation.orgSlug + " / " + item,
        value: item,
      }))
    : [];

  return (
    <div aria-label="Configure" className={styles.wrapper} role="region">
      <Switch>
        <Route exact path={AppPath.EditorConfigureGeneral}>
          <Section title="Basic Information" description="The bare necessities - you gotta fill out all these fields">
            <TextInput
              id="name"
              label="Name"
              helperText="Must be unique"
              placeholder="Name"
              value={values.name}
              onBlur={handleBlur}
              onChange={(e) => props.formikProps.handleChange(e)}
              invalid={Boolean(errors.name && touched.name)}
              invalidText={errors.name}
            />
            <div className={styles.descriptionContainer}>
              <p className={styles.descriptionLength}> {`${values.description.length} / 250`}</p>
              <TextArea
                id="description"
                labelText="Description (optional)"
                placeholder="Description"
                onBlur={handleBlur}
                onChange={(e) => props.formikProps.handleChange(e)}
                invalid={Boolean(errors.description && touched.description)}
                invalidText={errors.description}
                style={{ resize: "none" }}
                value={values.description}
              />
            </div>
            <h2 className={styles.iconTitle}>Pick an icon (any icon)</h2>
            <div className={styles.icons}>
              {workflowIcons.map(({ name, Icon }, index) => (
                <TooltipHover key={name} direction="top" tooltipText={capitalize(name)}>
                  <label
                    className={cx(styles.icon, {
                      [styles.active]: values.icon === name,
                    })}
                    key={`icon-number-${index}`}
                    title={capitalize(name)}
                  >
                    <input
                      id="icon"
                      readOnly
                      checked={values.icon === name}
                      onClick={(e) => props.formikProps.handleChange(e)}
                      value={name}
                      type="radio"
                    />
                    <Icon key={`${name}-${index}`} alt={`${name} icon`} />
                  </label>
                </TooltipHover>
              ))}
            </div>
          </Section>
          <Section title="Labels">
            <p className={styles.sectionDescription}>
              Create labels that can be used to query for specific Workflows, used at execution time, and can be useful
              in debugging the Workflow.
              <a
                aria-describedby="new-window-aria-desc-0"
                className={styles.link}
                href={appLink.docsWorkflowEditor()}
                target="_blank"
                rel="noopener noreferrer"
                data-testid="docs-link"
              >
                For more details, check our Docs
              </a>
            </p>
            <div className={styles.labelsContainer}>
              <div className={styles.tagsContainer}>
                <FieldArray
                  name="labels"
                  render={(arrayHelpers) =>
                    values.labels.map((label, index) => {
                      return (
                        <CustomLabel
                          formikPropsSetFieldValue={setFieldValue}
                          isEdit
                          editTrigger={({ openModal }: { openModal: () => void }) => (
                            <Tag
                              type="teal"
                              key={index}
                              filter
                              onClick={openModal}
                              onClose={() => arrayHelpers.remove(index)}
                              selectedLabel={label}
                            >
                              {`${label.key}=${label.value}`}
                            </Tag>
                          )}
                          labels={values.labels}
                          selectedLabel={{ ...label, index }}
                        />
                      );
                    })
                  }
                />
              </div>
              <CustomLabel formikPropsSetFieldValue={setFieldValue} labels={values.labels} />
            </div>
          </Section>
        </Route>
        <Route exact path={AppPath.EditorConfigureTriggers}>
          {props.workflowTriggersEnabled && (
            <>
              <Section
                title="Manual"
                description="Enable workflow to be executed manually through the UI and triggered via the API."
              >
                <div className={styles.toggleContainer}>
                  <Toggle
                    reversed
                    id="triggers.manual.enable"
                    data-testid="triggers.manual.enable"
                    label="Enable"
                    onToggle={(checked: boolean) => handleOnToggleChange(checked, "triggers.manual.enable")}
                    toggled={values.triggers.manual.enable}
                  />
                </div>
              </Section>
              <Section title="Scheduler" description="Enable workflow to be executed by a schedule.">
                <div className={styles.toggleContainer} style={{ marginTop: "1rem" }}>
                  <Toggle
                    reversed
                    id="triggers.scheduler.enable"
                    data-testid="triggers.scheduler.enable"
                    label="Enable"
                    onToggle={(checked: boolean) => handleOnToggleChange(checked, "triggers.scheduler.enable")}
                    toggled={values.triggers.scheduler.enable}
                  />
                </div>
                {values.triggers.scheduler.enable ? (
                  <InlineNotification
                    lowContrast
                    kind="info"
                    title="All enabled schedules"
                    subtitle="will execute. Manage them in the Schedule tab."
                    style={{ marginTop: "1rem" }}
                    hideCloseButton
                  />
                ) : (
                  <InlineNotification
                    lowContrast
                    kind="warning"
                    title="No schedules"
                    subtitle="will execute, regardless of status. Manage them in the Schedule tab."
                    style={{ marginTop: "1rem" }}
                    hideCloseButton
                  />
                )}
              </Section>
              <Section title="Webhook" description="Listen for events and receive data from an external system.">
                <div className={styles.triggerSection}>
                  <div className={styles.toggleContainer}>
                    <Toggle
                      id="triggers.webhook.enable"
                      label="Enable"
                      toggled={values.triggers.webhook.enable}
                      onToggle={(checked: boolean) => handleOnToggleChange(checked, "triggers.webhook.enable")}
                      tooltipContent="Enable workflow to be executed by a webhook"
                      tooltipProps={{ direction: "top" }}
                      reversed
                    />
                  </div>
                  {values.triggers.webhook.enable && (
                    <ComposedModal
                      modalHeaderProps={{
                        title: "Webhook Usage",
                      }}
                      composedModalProps={{
                        containerClassName: styles.buildWebhookContainer,
                        shouldCloseOnOverlayClick: true,
                      }}
                      modalTrigger={({ openModal }: { openModal: () => void }) => (
                        <Button kind="ghost" onClick={openModal} renderIcon={Popup} size="sm">
                          <p>View usage example</p>
                        </Button>
                      )}
                    >
                      {({ closeModal }: { closeModal: () => void }) => (
                        <BuildWebhookModalContent closeModal={closeModal} workflowId={props.workflow.id} />
                      )}
                    </ComposedModal>
                  )}
                </div>
              </Section>
              <Section title="Events">
                <p className={styles.sectionDescription}>
                  Listen for events received in the CloudEvent format and trigger this Workflow based on filter
                  matching. Learn more about
                  <a
                    aria-describedby="new-window-aria-desc-0"
                    className={styles.link}
                    href={appLink.docsWorkflowEditor()}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-testid="docs-link"
                  >
                    Event Triggers <Launch />
                  </a>
                  .
                </p>
                <div className={styles.triggerSection}>
                  <div className={styles.toggleContainer}>
                    <Toggle
                      id="triggers.event.enable"
                      label="Enable"
                      toggled={values.triggers.event.enable}
                      onToggle={(checked: boolean) => handleOnToggleChange(checked, "triggers.event.enable")}
                      tooltipContent="Enable workflow to be triggered by received events."
                      tooltipProps={{ direction: "top" }}
                      reversed
                    />
                  </div>
                  {values.triggers.event.enable && (
                    <>
                      <p className={styles.sectionDescription}>
                        The following filters will be applied to any incoming event based on the{" "}
                        <a
                          aria-describedby="new-window-aria-desc-0"
                          className={styles.link}
                          href="cloudevents.io"
                          target="_blank"
                          rel="noopener noreferrer"
                          data-testid="docs-link"
                        >
                          CloudEvent <Launch />
                        </a>{" "}
                        specification. Configure using exact match or regular expression to filter the events.
                      </p>
                      <TextInput
                        id="triggers.event.type"
                        label="Type Filter"
                        invalid={Boolean(errors.triggers?.event?.type && touched.triggers?.event?.type)}
                        invalidText={errors.triggers?.event?.type}
                        placeholder="io.boomerang.[event|phase|status]"
                        helperText="A regular expression."
                        value={values.triggers?.event?.type}
                        onBlur={handleBlur}
                        onChange={(e) => props.formikProps.handleChange(e)}
                      />
                      <TextInput
                        id="triggers.event.subject"
                        label="Subject Filter"
                        invalid={Boolean(errors.triggers?.event?.subject && touched.triggers?.event?.subject)}
                        invalidText={errors.triggers?.event?.subject}
                        placeholder="Hello World"
                        helperText="A regular expression."
                        value={values.triggers?.event?.subject}
                        onBlur={handleBlur}
                        onChange={(e) => props.formikProps.handleChange(e)}
                      />
                      {/* <div className={styles.webhookContainer}> */}
                      <ComposedModal
                        modalHeaderProps={{
                          title: "Event Trigger Usage",
                        }}
                        composedModalProps={{
                          containerClassName: styles.buildWebhookContainer,
                          shouldCloseOnOverlayClick: true,
                        }}
                        modalTrigger={({ openModal }: { openModal: () => void }) => (
                          <Button kind="ghost" onClick={openModal} renderIcon={Popup} size="sm">
                            <p>View usage example</p>
                          </Button>
                        )}
                      >
                        {({ closeModal }: { closeModal: () => void }) => (
                          <ConfigureEventTrigger closeModal={closeModal} workflowId={props.workflow.id} />
                        )}
                      </ComposedModal>
                      {/* </div> */}
                    </>
                  )}
                </div>
              </Section>
              <Section
                title="GitHub"
                description="Listen for and respond to events from GitHub. Filter the events and repositories that will trigger this Workflow. The GitHub integration must be enabled for this Trigger
                  to work."
                beta
              >
                <div className={styles.toggleContainer}>
                  <Toggle
                    id="triggers.github.enable"
                    label="Enable"
                    toggled={values.triggers.github.enable}
                    onToggle={(checked: boolean) => handleOnToggleChange(checked, "triggers.github.enable")}
                    reversed
                    disabled={!props.githubAppInstallation}
                  />
                </div>
                {!props.githubAppInstallation && (
                  <InlineNotification
                    lowContrast
                    kind="warning"
                    title="Integration Required"
                    subtitle="The GitHub integration is required for this to be enabled."
                    style={{ marginTop: "1rem" }}
                    hideCloseButton
                  />
                )}
                {values.triggers.github.enable && props.githubAppInstallation && (
                  <>
                    <h2 className={styles.iconTitle}>Events Filter</h2>
                    <CheckboxList
                      id="triggers.github.events"
                      initialSelectedItems={values.triggers.github.events}
                      labelText="Select events that you wish to trigger this Workflow"
                      onChange={(checked: boolean, label: string) => {
                        const selectedItems = [...values.triggers.github.events];
                        if (checked) {
                          selectedItems.push(label);
                        } else {
                          const index = selectedItems.indexOf(label);
                          if (index !== -1) {
                            selectedItems.splice(index, 1);
                          }
                        }
                        props.formikProps.setFieldValue("triggers.github.events", selectedItems);
                      }}
                      options={githubEvents}
                      tooltipContent="Tooltip for checkbox"
                      tooltipProps={{ direction: "top" }}
                    />
                    <h2 className={styles.iconTitle}>Repository Filter</h2>
                    <MultiSelect
                      style={{ maxWidth: "12rem" }}
                      hideLabel
                      id="triggers.github.repositories"
                      label="Choose Repositories"
                      invalid={false}
                      onChange={({ selectedItems }: { selectedItems: Array<{ label: string; value: string }> }) =>
                        props.formikProps.setFieldValue(
                          "triggers.github.repositories",
                          selectedItems.map((item) => item.value)
                        )
                      }
                      items={githubRepositories}
                      initialSelectedItems={values.triggers.github.repositories}
                      titleText="Filter by Repository"
                    />
                  </>
                )}
              </Section>
            </>
          )}
        </Route>
        <Route exact path={AppPath.EditorConfigureParams}>
          <Section title="GitHub" description="Auto inject GitHub Parameters." beta>
            <div className={styles.toggleContainer}>
              <Toggle
                id="bob"
                label="Enable"
                toggled={values.triggers.webhook.enable}
                onToggle={(checked: boolean) => handleOnToggleChange(checked, "triggers.webhook.enable")}
                reversed
                disabled
              />
            </div>
          </Section>
        </Route>
        <Route exact path={AppPath.EditorConfigureRun}>
          <Section title="Execution" description="Customize how your Workflow behaves.">
            <div>
              <div className={styles.runOptionsSection}>
                <TextInput
                  id="timeout"
                  label="Timeout"
                  helperText="In minutes. Maximum defined by your quota."
                  value={values.timeout}
                  onBlur={handleBlur}
                  onChange={(e) => props.formikProps.handleChange(e)}
                  invalid={Boolean(errors.timeout && touched.timeout)}
                  invalidText={errors.timeout}
                  type="number"
                />
                <TextInput
                  id="retries"
                  label="Retries"
                  helperText="The number of times to retry a failed workflow. Defaults to 0."
                  value={values.retries}
                  onBlur={handleBlur}
                  onChange={(e) => props.formikProps.handleChange(e)}
                  invalid={Boolean(errors.retries && touched.retries)}
                  invalidText={errors.retries}
                />
              </div>
            </div>
          </Section>
        </Route>
        <Route exact path={AppPath.EditorConfigureWorkspaces}>
          <Section
            title="Workspaces"
            description="Declare storage options to be used at execution time. This will be
                  limited by the Storage Capacity quota which will error executions if you exceed the allowed maximum."
          >
            <div className={styles.storageToggle}>
              <div className={styles.toggleContainer}>
                <Toggle
                  id="enableWorkflowPersistentStorage"
                  label="Enable Workflow Persistent Storage"
                  toggled={values.storage?.workflow?.enabled}
                  onToggle={(checked: boolean) => handleOnToggleChange(checked, "storage.workflow.enabled")}
                  tooltipContent="Persist data across workflow executions"
                  tooltipProps={{ direction: "top" }}
                  reversed
                />
              </div>
              {values.storage?.workflow?.enabled && (
                <div className={styles.webhookContainer}>
                  <ComposedModal
                    modalHeaderProps={{
                      title: "Configure Workspace - Workflow Persistent Storage",
                      subtitle: (
                        <>
                          <p>
                            The Workflow storage is persisted across workflow executions and allows you to share
                            artifacts between workflows, such as maintaining a cache of files used every execution.
                          </p>
                          <p style={{ marginTop: "0.5rem" }}>
                            Note: use with caution as this can lead to a collision if you are running many executions in
                            parallel using the same artifact.
                          </p>
                        </>
                      ),
                    }}
                    composedModalProps={
                      {
                        // containerClassName: styles.buildWebhookContainer,
                        // shouldCloseOnOverlayClick: true,
                      }
                    }
                    modalTrigger={({ openModal }: { openModal: () => void }) => (
                      <button
                        className={styles.regenerateText}
                        style={{ marginBottom: "0.5rem" }}
                        type="button"
                        onClick={openModal}
                      >
                        <p>Configure</p>
                      </button>
                    )}
                  >
                    {({ closeModal }: { closeModal: () => void }) => (
                      <ConfigureStorage
                        size={values.storage?.workflow?.size}
                        mountPath={values.storage?.workflow?.mountPath}
                        handleOnChange={(storageValues: any) => {
                          setFieldValue("storage.workflow", storageValues);
                        }}
                        closeModal={closeModal}
                        quotas={quotas.maxWorkflowStorageSize}
                      />
                    )}
                  </ComposedModal>
                </div>
              )}
            </div>
            <div className={styles.storageToggle}>
              <div className={styles.toggleContainer}>
                <Toggle
                  id="enableActivityPersistentStorage"
                  label="Enable Activity Persistent Storage"
                  toggled={values.storage?.workflowrun?.enabled}
                  onToggle={(checked: boolean) => handleOnToggleChange(checked, "storage.workflowrun.enabled")}
                  tooltipContent="Persist workflow data per executions"
                  tooltipProps={{ direction: "top" }}
                  reversed
                />
              </div>
              {values.storage?.workflowrun?.enabled && (
                <div className={styles.webhookContainer}>
                  <ComposedModal
                    modalHeaderProps={{
                      title: "Configure Workflow - Activity Persistent Storage",
                      subtitle: (
                        <>
                          <p>
                            The activity storage is persisted per workflow execution and allows you to share short-lived
                            artifacts between tasks in the workflow.
                          </p>
                          <p style={{ marginTop: "0.5rem" }}>
                            Note: All artifacts will be deleted at the end of the workflow execution. If you want to
                            persist long term use Workspace storage.
                          </p>
                        </>
                      ),
                    }}
                    modalTrigger={({ openModal }: { openModal: () => void }) => (
                      <button className={styles.regenerateText} type="button" onClick={openModal}>
                        <p>Configure</p>
                      </button>
                    )}
                  >
                    {({ closeModal }: { closeModal: () => void }) => (
                      <ConfigureStorage
                        size={values.storage.workflowrun.size}
                        mountPath={values.storage.workflowrun.mountPath}
                        handleOnChange={(storageValues: any) => {
                          setFieldValue("storage.activity", storageValues);
                        }}
                        closeModal={closeModal}
                        quotas={quotas.maxActivityStorageSize}
                        isActivity
                      />
                    )}
                  </ComposedModal>
                </div>
              )}
            </div>
          </Section>
        </Route>
        <Redirect exact from={AppPath.EditorConfigure} to={AppPath.EditorConfigureGeneral} />
      </Switch>
    </div>
  );
}

interface SectionProps {
  title: string;
  description?: string;
  beta?: boolean;
  children: React.ReactNode;
  editModal?: React.ReactNode;
}

function Section({ children, description, editModal, title, beta }: SectionProps) {
  return (
    <section className={styles.sectionContainer}>
      <div className={styles.sectionHeader}>
        <h1 className={styles.sectionTitle}>
          {title} {beta ? <Tag>beta</Tag> : null}
        </h1>
        {editModal}
      </div>
      {description ? <p className={styles.sectionDescription}>{description}</p> : null}
      {children}
    </section>
  );
}
