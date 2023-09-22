import React, { Component } from "react";
import { Helmet } from "react-helmet";
import { useLocation, useParams } from "react-router-dom";
import { useFeature } from "flagged";
import { Formik, FormikProps, FieldArray } from "formik";
import { Tag } from "@carbon/react";
import { ComposedModal, TextArea, TextInput, Toggle, TooltipHover } from "@boomerang-io/carbon-addons-boomerang-react";
import cx from "classnames";
import cronstrue from "cronstrue";
import capitalize from "lodash/capitalize";
import * as Yup from "yup";
import BuildWebhookModalContent from "./BuildWebhookModalContent";
import ConfigureStorage from "./ConfigureStorage";
import CreateToken from "./CreateToken";
import CustomLabel from "./CustomLabel";
import Token from "./Token";
import { appLink, BASE_DOCUMENTATION_URL, FeatureFlag } from "Config/appConfig";
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
  const isOnConfigurePath =
    appLink.editorConfigure({ team: params.team, workflowId: params.workflowId }) === location.pathname;

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
          labels: workflow.labels ? Object.entries(workflow.labels).map(([key, value]) => ({ key, value })) : [],
          triggers: {
            manual: {
              enable: workflow.triggers?.manual?.enable ?? true,
            },
            custom: {
              enable: workflow.triggers?.custom?.enable ?? false,
              topic: workflow.triggers?.custom?.topic ?? "",
            },
            scheduler: {
              enable: workflow.triggers?.scheduler?.enable ?? false,
            },
            webhook: {
              enable: workflow.triggers?.webhook?.enable ?? false,
              token: workflow.triggers?.webhook?.token ?? "",
            },
          },
          tokens: workflow?.tokens ?? [],
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
          triggers: Yup.object().shape({
            manual: Yup.object().shape({
              enable: Yup.boolean(),
            }),
            custom: Yup.object().shape({
              enable: Yup.boolean(),
              topic: Yup.string(),
            }),
            scheduler: Yup.object().shape({
              enable: Yup.boolean(),
              schedule: Yup.string(),
              timezone: Yup.mixed(),
              advancedCron: Yup.boolean(),
            }),
            webhook: Yup.object().shape({
              enable: Yup.boolean(),
              token: Yup.string(),
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
  tokenTextType: string;
  showTokenText: string;
  copyTokenText: string;
  errors: object;
}

class Configure extends Component<ConfigureProps, ConfigureState> {
  constructor(props: ConfigureProps) {
    super(props);
    this.state = {
      tokenTextType: "password",
      showTokenText: "Show Token",
      copyTokenText: "Copy Token",
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
        <section className={styles.largeCol}>
          <h1 className={styles.header}>General info</h1>
          <p className={styles.subTitle}>The bare necessities - you gotta fill out all these fields</p>
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
        </section>
        {this.props.workflowTriggersEnabled && (
          <section className={styles.largeCol}>
            <h1 className={styles.header}>Triggers</h1>
            <p className={styles.subTitle}>Off - until you turn them on. (Feel the power).</p>
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
                  {values.triggers.scheduler.schedule &&
                    values.triggers.scheduler.enable &&
                    values.triggers.scheduler.timezone && (
                      <div className={styles.informationWrapper}>
                        <p className={styles.webhookTokenLabel}>Schedule</p>
                        <div className={styles.informationCronMessage}>
                          {`${cronstrue.toString(values.triggers.scheduler.schedule)} in ${
                            values.triggers.scheduler.timezone
                          }`}
                        </div>
                      </div>
                    )}
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
                              Build up a webhook URL for an external service to push events that execute this workflow.
                            </p>
                            <p style={{ marginTop: "0.5rem" }}>
                              There are a variety of different webhook types that provide additional functionality. For
                              example, the Slack type responds to the Slack verification request.{" "}
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
                    id="triggers.custom.enable"
                    label="Custom Event"
                    toggled={values.triggers.custom.enable}
                    onToggle={(checked: boolean) => this.handleOnToggleChange(checked, "triggers.custom.enable")}
                    tooltipContent="Enable workflow to be triggered by platform actions"
                    tooltipProps={{ direction: "top" }}
                    reversed
                  />
                </div>
                {values.triggers.custom.enable && (
                  <div className={styles.subscriptionContainer}>
                    <TextInput
                      id="triggers.custom.topic"
                      label="Topic"
                      placeholder="Name"
                      value={values.triggers.custom.topic}
                      onBlur={handleBlur}
                      onChange={this.handleOnChange}
                    />
                  </div>
                )}
              </div>
            </div>
            <hr className={styles.delimiter} />
            <h1 className={styles.header}>Tokens</h1>
            <p className={styles.subTitle}>Customize how you run your Workflow</p>
            <div>
              <div className={styles.triggerSection}>
                {values.tokens.map((token) => (
                  <Token
                    token={token}
                    tokenData={values.tokens}
                    formikPropsSetFieldValue={this.props.formikProps.setFieldValue}
                    workflowId={this.props.workflow.id}
                  />
                ))}
              </div>
              <CreateToken
                tokenData={values.tokens}
                formikPropsSetFieldValue={this.props.formikProps.setFieldValue}
                workflowId={this.props.workflow.id}
              />
            </div>
          </section>
        )}
        <section className={styles.smallCol}>
          <div className={styles.optionsContainer}>
            <h1 className={styles.header}>Workspaces</h1>
            <p className={styles.subTitle}>
              Workspaces allow your workflow to declare storage options to be used at execution time. This will be
              limited by the Storage Capacity quota which will error executions if you exceed the allowed maximum.
            </p>
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
          </div>
          <hr className={styles.delimiter} />
          <div className={styles.labelsContainer}>
            <h1 className={styles.header}>Custom Labels</h1>
            <p className={styles.subTitle}>
              Create custom labels that will be used at execution time and can be useful in debugging the workflow in
              Kubernetes.
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
              .
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
          </div>
        </section>
      </div>
    );
  }
}
