import React, { Component } from "react";
import { Helmet } from "react-helmet";
import { Switch, Route, Redirect, useLocation, useParams } from "react-router-dom";
import { useFeature } from "flagged";
import { Formik, FormikProps, FieldArray } from "formik";
import { Tag } from "@carbon/react";
import { ComposedModal, TextArea, TextInput, Toggle, TooltipHover } from "@boomerang-io/carbon-addons-boomerang-react";
import cx from "classnames";
import capitalize from "lodash/capitalize";
import * as Yup from "yup";
import BuildWebhookModalContent from "./BuildWebhookModalContent";
import ConfigureEventTrigger from "./ConfigureEventTrigger";
import ConfigureStorage from "./ConfigureStorage";
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
      <div className={styles.container}>
        <NavPanel team={params.team} workflowId={params.workflowId}></NavPanel>
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
            },
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
            }),
          })}
        >
          {(formikProps) =>
            isOnConfigurePath ? (
              <Configure
                workflowTriggersEnabled={workflowTriggersEnabled as boolean}
                formikProps={formikProps}
                quotas={quotas}
                workflow={workflow}
              />
            ) : null
          }
        </Formik>
      </div>
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
}

interface ConfigureState {
  errors: object;
}

class Configure extends Component<ConfigureProps, ConfigureState> {
  constructor(props: ConfigureProps) {
    super(props);
    this.state = {
      errors: {},
    };
  }

  handleOnChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    this.props.formikProps.handleChange(e);
  };

  handleOnClick: React.MouseEventHandler<HTMLInputElement> = (e) => {
    this.props.formikProps.handleChange(e);
  };

  handleOnToggleChange = (value: any, id: string) => {
    this.props.formikProps.setFieldValue(id, value);
  };

  render() {
    const {
      quotas,
      formikProps: { errors, handleBlur, touched, values, setFieldValue },
    } = this.props;

    return (
      <div aria-label="Configure" className={styles.wrapper} role="region">
        <Switch>
          <Route exact path={AppPath.EditorConfigureGeneral}>
            <Section title="General Info" description="The bare necessities - you gotta fill out all these fields">
              <TextInput
                id="name"
                label="Name"
                helperText="Must be unique"
                placeholder="Name"
                value={values.name}
                onBlur={handleBlur}
                onChange={this.handleOnChange}
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
                  onChange={this.handleOnChange}
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
                        onClick={this.handleOnClick}
                        value={name}
                        type="radio"
                      />
                      <Icon key={`${name}-${index}`} alt={`${name} icon`} />
                    </label>
                  </TooltipHover>
                ))}
              </div>
            </Section>
          </Route>
          <Route exact path={AppPath.EditorConfigureTriggers}>
            {this.props.workflowTriggersEnabled && (
              <Section title="Triggers" description="Off - until you turn them on. (Feel the power).">
                <div className={styles.triggerContainer}>
                  <div className={styles.triggerSection}>
                    <div className={styles.toggleContainer}>
                      <Toggle
                        reversed
                        id="triggers.manual.enable"
                        data-testid="triggers.manual.enable"
                        label="Manual"
                        onToggle={(checked: boolean) => this.handleOnToggleChange(checked, "triggers.manual.enable")}
                        toggled={values.triggers.manual.enable}
                        tooltipContent="Enable workflow to be executed manually"
                        tooltipProps={{ direction: "top" }}
                      />
                    </div>
                    <div className={styles.toggleContainer} style={{ marginTop: "1rem" }}>
                      <Toggle
                        reversed
                        id="triggers.scheduler.enable"
                        data-testid="triggers.scheduler.enable"
                        label="Scheduler"
                        onToggle={(checked: boolean) => this.handleOnToggleChange(checked, "triggers.scheduler.enable")}
                        toggled={values.triggers.scheduler.enable}
                        tooltipContent="Enable workflow to be executed by a schedule"
                        tooltipProps={{ direction: "top" }}
                      />
                    </div>
                    <div className={styles.schedulerContainer}>
                      {values.triggers.scheduler.enable ? (
                        <p>
                          <b>All enabled</b> schedules will execute. Manage them in the Schedule tab.
                        </p>
                      ) : (
                        <p>
                          <b>No schedules</b> will execute, regardless of status. Manage them in the Schedule tab.
                        </p>
                      )}
                    </div>
                  </div>
                  <div className={styles.triggerSection}>
                    <div className={styles.toggleContainer}>
                      <Toggle
                        id="triggers.webhook.enable"
                        label="Webhook"
                        toggled={values.triggers.webhook.enable}
                        onToggle={(checked: boolean) => this.handleOnToggleChange(checked, "triggers.webhook.enable")}
                        tooltipContent="Enable workflow to be executed by a webhook"
                        tooltipProps={{ direction: "top" }}
                        reversed
                      />
                    </div>
                    {values.triggers.webhook.enable && (
                      <div className={styles.webhookContainer}>
                        <ComposedModal
                          modalHeaderProps={{
                            title: "Build Webhook URL",
                            subtitle: (
                              <>
                                <p>
                                  Build up a webhook URL for an external service to push events that execute this
                                  workflow.
                                </p>
                                <p style={{ marginTop: "0.5rem" }}>
                                  There are a variety of different webhook types that provide additional functionality.
                                  For example, the Slack type responds to the Slack verification request.{" "}
                                  <a href={`${BASE_DOCUMENTATION_URL}/introduction/overview`}>
                                    Learn more in the documentation.
                                  </a>
                                </p>
                              </>
                            ),
                          }}
                          composedModalProps={{
                            containerClassName: styles.buildWebhookContainer,
                            shouldCloseOnOverlayClick: true,
                          }}
                          modalTrigger={({ openModal }: { openModal: () => void }) => (
                            <button className={styles.regenerateText} type="button" onClick={openModal}>
                              <p>Build webhook URL</p>
                            </button>
                          )}
                        >
                          {({ closeModal }: { closeModal: () => void }) => (
                            <BuildWebhookModalContent
                              values={values}
                              closeModal={closeModal}
                              workflowId={this.props.workflow.id}
                            />
                          )}
                        </ComposedModal>
                      </div>
                    )}
                  </div>
                  <div className={styles.triggerSection}>
                    <div className={styles.toggleContainer}>
                      <Toggle
                        id="triggers.event.enable"
                        label="Event"
                        toggled={values.triggers.event.enable}
                        onToggle={(checked: boolean) => this.handleOnToggleChange(checked, "triggers.event.enable")}
                        tooltipContent="Enable workflow to be triggered by platform actions"
                        tooltipProps={{ direction: "top" }}
                        reversed
                      />
                    </div>
                    {values.triggers.event.enable && (
                      <div className={styles.webhookContainer}>
                        <ComposedModal
                          modalHeaderProps={{
                            title: "Configure Event Trigger",
                            subtitle: (
                              <>
                                <p>
                                  The following filters will be applied to any incoming event based on the CloudEvent
                                  specification. Configure using exact match or regular expression to filter the events.
                                </p>
                                <p style={{ marginTop: "0.5rem" }}>
                                  <a href={`${BASE_DOCUMENTATION_URL}/introduction/overview`}>
                                    Learn more in the documentation.
                                  </a>
                                </p>
                              </>
                            ),
                          }}
                          composedModalProps={{
                            containerClassName: styles.buildWebhookContainer,
                            shouldCloseOnOverlayClick: true,
                          }}
                          modalTrigger={({ openModal }: { openModal: () => void }) => (
                            <button className={styles.regenerateText} type="button" onClick={openModal}>
                              <p>Configure</p>
                            </button>
                          )}
                        >
                          {({ closeModal }: { closeModal: () => void }) => (
                            <ConfigureEventTrigger
                              values={values}
                              closeModal={closeModal}
                              handleOnChange={(eventTriggers: any) => {
                                setFieldValue("triggers.event", eventTriggers);
                              }}
                              workflowId={this.props.workflow.id}
                            />
                          )}
                        </ComposedModal>
                      </div>
                    )}
                  </div>
                </div>
              </Section>
            )}
          </Route>
          <Route exact path={AppPath.EditorConfigureRun}>
            <Section title="Run Options" description="Customize how your Workflow behaves.">
              <div>
                <div className={styles.runOptionsSection}>
                  <TextInput
                    id="timeout"
                    label="Timeout"
                    helperText="In minutes. Maximum defined by your quota."
                    value={values.timeout}
                    onBlur={handleBlur}
                    onChange={this.handleOnChange}
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
                    onChange={this.handleOnChange}
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
                    onToggle={(checked: boolean) => this.handleOnToggleChange(checked, "storage.workflow.enabled")}
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
                              Note: use with caution as this can lead to a collision if you are running many executions
                              in parallel using the same artifact.
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
                    onToggle={(checked: boolean) => this.handleOnToggleChange(checked, "storage.workflowrun.enabled")}
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
                              The activity storage is persisted per workflow execution and allows you to share
                              short-lived artifacts between tasks in the workflow.
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

            <Section
              title="Labels"
              description="Create labels that can be used to query for specific workflows, used at execution time, and can be
              useful in debugging the workflow."
            >
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
          <Redirect exact from={AppPath.EditorConfigure} to={AppPath.EditorConfigureGeneral} />
        </Switch>
      </div>
    );
  }
}

interface SectionProps {
  children: React.ReactNode;
  description?: string;
  editModal?: React.ReactNode;
  title: string;
}

function Section({ children, description, editModal, title }: SectionProps) {
  return (
    <section className={styles.sectionContainer}>
      <div className={styles.sectionHeader}>
        <h1 className={styles.sectionTitle}>{title}</h1>
        {editModal}
      </div>
      {description ? <p className={styles.sectionDescription}>{description}</p> : null}
      {children}
    </section>
  );
}
