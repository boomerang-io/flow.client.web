import React, { Component } from "react";
import { Helmet } from "react-helmet";
import { useLocation } from "react-router-dom";
import { useFeature } from "flagged";
import { History } from "history";
import { Formik, FormikProps, FieldArray } from "formik";
import {
  Button,
  ComboBox,
  ComposedModal,
  Tag,
  TextArea,
  TextInput,
  Toggle,
  TooltipHover,
} from "@boomerang-io/carbon-addons-boomerang-react";
import cx from "classnames";
import cronstrue from "cronstrue";
import capitalize from "lodash/capitalize";
import * as Yup from "yup";
import BuildWebhookModalContent from "./BuildWebhookModalContent";
import ConfigureStorage from "./ConfigureStorage";
import CreateToken from "./CreateToken";
//@ts-ignore
import CustomLabel from "./CustomLabel";
import Token from "./Token";
import { Save24 } from "@carbon/icons-react";
import { appLink, BASE_DOCUMENTATION_URL, FeatureFlag } from "Config/appConfig";
import { QueryStatus } from "Constants";
import workflowIcons from "Assets/workflowIcons";
import { WorkflowSummary } from "Types";
import styles from "./configure.module.scss";

interface FormProps {
  description: string;
  enableACCIntegration: boolean;
  storage: {
    activity: {
      enabled: boolean;
      size: number;
      mountPath: string;
    };
    workflow: {
      enabled: boolean;
      size: number;
      mountPath: string;
    };
  };
  icon: string;
  name: string;
  labels: Array<{ key: string; value: string }>;
  shortDescription: string;
  triggers: {
    manual: {
      enable: boolean;
    };
    custom: {
      enable: boolean;
      topic: string;
    };
    scheduler: {
      enable: boolean;
      schedule: string;
      timezone: string | boolean;
      advancedCron: boolean;
    };
    webhook: {
      enable: boolean;
      token: string;
    };
  };
  selectedTeam: { id: null | string };

  tokens: [
    {
      token: string;
      label: string;
    }
  ];
}

interface ConfigureContainerProps {
  history: History;
  params: { workflowId: string };
  quotas: {
    maxActivityStorageSize: string;
    maxWorkflowStorageSize: string;
  };
  summaryData: WorkflowSummary;
  summaryMutation: { status: string };
  teams: Array<{ id: string }>;
  updateSummary: ({ values, callback }: { values: object; callback: () => void }) => void;
  canEditWorkflow: boolean;
}

const ConfigureContainer = React.memo<ConfigureContainerProps>(function ConfigureContainer({
  history,
  params,
  quotas,
  summaryData,
  summaryMutation,
  teams,
  updateSummary,
  canEditWorkflow,
}) {
  const workflowTriggersEnabled = useFeature(FeatureFlag.WorkflowTriggersEnabled);
  const handleOnSubmit = (values: { selectedTeam: { id: null | string } }) => {
    updateSummary({
      values,
      callback: () => history.push(appLink.editorConfigure({ workflowId: params.workflowId })),
    });
  };
  const location = useLocation();
  const isOnConfigurePath = appLink.editorConfigure({ workflowId: params.workflowId }) === location.pathname;
  return (
    <>
      <Helmet>
        <title>{`Configure - ${summaryData.name}`}</title>
      </Helmet>
      <Formik
        enableReinitialize
        onSubmit={(values: { selectedTeam: { id: null | string } }) => {
          canEditWorkflow && handleOnSubmit(values);
        }}
        initialValues={{
          description: summaryData.description ?? "",
          enableACCIntegration: summaryData.enableACCIntegration ?? false,
          storage: {
            workflow: {
              enabled: summaryData.storage?.workflow?.enabled ?? false,
              size: summaryData.storage?.workflow?.size ?? 1,
              mountPath: summaryData.storage?.workflow?.mountPath ?? "",
            },
            activity: {
              enabled: summaryData.storage?.activity?.enabled ?? false,
              size: summaryData.storage?.activity?.size ?? 1,
              mountPath: summaryData.storage?.activity?.mountPath ?? "",
            },
          },
          icon: summaryData.icon ?? "",
          name: summaryData.name ?? "",
          labels: summaryData.labels ? summaryData.labels : [],
          // selectedTeam: teams.find((team) => team?.id === summaryData?.flowTeamId) ?? { id: "" },
          selectedTeam: teams.find((team) => team?.id === summaryData?.flowTeamId) ?? { id: null },
          shortDescription: summaryData?.shortDescription ?? "",
          triggers: {
            manual: {
              enable: summaryData.triggers?.manual?.enable ?? true,
            },
            custom: {
              enable: summaryData.triggers?.custom?.enable ?? false,
              topic: summaryData.triggers?.custom?.topic ?? "",
            },
            scheduler: {
              enable: summaryData.triggers?.scheduler?.enable ?? false,
              schedule: summaryData.triggers?.scheduler?.schedule ?? "0 18 * * *",
              timezone: summaryData.triggers?.scheduler?.timezone ?? false,
              advancedCron: summaryData.triggers?.scheduler?.advancedCron ?? false,
            },
            webhook: {
              enable: summaryData.triggers?.webhook?.enable ?? false,
              token: summaryData.triggers?.webhook?.token ?? "",
            },
          },
          tokens: summaryData?.tokens ?? [],
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
          selectedTeam: summaryData?.flowTeamId
            ? Yup.object().shape({ name: Yup.string().required("Team is required") })
            : Yup.object().shape({ id: Yup.mixed() }),
          shortDescription: Yup.string().max(128, "Summary must not be greater than 128 characters"),
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
              summaryData={summaryData}
              summaryMutation={summaryMutation}
              teams={teams}
              updateSummary={updateSummary}
              canEditWorkflow={canEditWorkflow}
            />
          ) : null
        }
      </Formik>
    </>
  );
});

export default ConfigureContainer;

interface ConfigureProps {
  workflowTriggersEnabled: boolean;
  formikProps: FormikProps<FormProps>;
  quotas: {
    maxActivityStorageSize: string;
    maxWorkflowStorageSize: string;
  };
  summaryData: WorkflowSummary;
  summaryMutation: {
    status: string;
  };
  teams: Array<{ id: string }>;
  updateSummary: ({ values, callback }: { values: object; callback: () => void }) => void;
  canEditWorkflow: boolean;
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

  // generateToken = (label: string) => {
  //   axios
  //     .post(serviceUrl.postCreateWorkflowToken({ workflowId: this.props.summaryData.id }), { label: label })
  //     .then((response) => {
  //       let newTokens = this.props.formikProps.values.tokens;
  //       let tokenIndex = newTokens.findIndex((obj) => obj.label == label);

  //       if (tokenIndex === -1) {
  //         newTokens.push(response.data);
  //       } else {
  //         newTokens[tokenIndex].token = response.data.token;
  //       }

  //       // this.props.formikProps.setFieldValue(`triggers.${tokenType}.token`, response.data.token);
  //       this.props.formikProps.setFieldValue(`tokens`, newTokens);

  //       notify(<ToastNotification kind="success" title="Generate Token" subtitle={`Successfully generated token`} />);
  //     })
  //     .catch((err) => {
  //       notify(<ToastNotification kind="error" title="Something's wrong" subtitle={`Failed to create token`} />);
  //     });
  // };

  handleOnChange = (e: React.MouseEvent<HTMLInputElement, MouseEvent>) => {
    if (this.props.canEditWorkflow) {
      this.props.formikProps.handleChange(e);
    }
  };

  handleOnToggleChange = (value: any, id: string) => {
    if (this.props.canEditWorkflow) {
      this.props.formikProps.setFieldValue(id, value);
    }
  };

  handleTeamChange = ({ selectedItem }: { selectedItem: object }) => {
    this.props.formikProps.setFieldValue("selectedTeam", selectedItem ?? {});
  };

  render() {
    const {
      quotas,
      summaryMutation,
      teams,
      formikProps: { dirty, errors, handleBlur, handleSubmit, touched, values, setFieldValue },
    } = this.props;
    const isLoading = summaryMutation.status === QueryStatus.Loading;
    return (
      <div aria-label="Configure" className={styles.wrapper} role="region">
        <section className={styles.largeCol}>
          <h1 className={styles.header}>General info</h1>
          <p className={styles.subTitle}>The bare necessities - you gotta fill out all these fields</p>
          {this.props.summaryData?.flowTeamId && (
            <div className={styles.teamSelect}>
              <ComboBox
                id="selectedTeam"
                disabled={!this.props.canEditWorkflow}
                initialSelectedItem={values.selectedTeam}
                invalid={Boolean(errors.selectedTeam)}
                invalidText={errors.selectedTeam}
                items={teams}
                itemToString={(item: { name: string }) => item?.name ?? ""}
                onChange={this.handleTeamChange}
                value={values.selectedTeam}
                label="Team"
                placeholder="Select a team"
                shouldFilterItem={({ item, inputValue }: { item: { name: string }; inputValue: string }) =>
                  item?.name?.toLowerCase()?.includes(inputValue.toLowerCase())
                }
              />
            </div>
          )}
          <TextInput
            id="name"
            label="Name"
            disabled={!this.props.canEditWorkflow}
            helperText="Must be unique"
            placeholder="Name"
            value={values.name}
            onBlur={handleBlur}
            onChange={this.handleOnChange}
            invalid={errors.name && touched.name}
            invalidText={errors.name}
          />
          <TextInput
            id="shortDescription"
            label="Summary"
            placeholder="Summary"
            disabled={!this.props.canEditWorkflow}
            value={values.shortDescription}
            onBlur={handleBlur}
            onChange={this.handleOnChange}
            invalid={errors.shortDescription && touched.shortDescription}
            invalidText={errors.shortDescription}
          />
          <div className={styles.descriptionContainer}>
            <p className={styles.descriptionLength}> {`${values.description.length} / 250`}</p>
            <TextArea
              id="description"
              label="Description"
              disabled={!this.props.canEditWorkflow}
              placeholder="Description"
              onBlur={handleBlur}
              onChange={this.handleOnChange}
              invalid={errors.description && touched.description}
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
                    onClick={this.handleOnChange}
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
                    disabled={!this.props.canEditWorkflow}
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
                    disabled={!this.props.canEditWorkflow}
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
                    disabled={!this.props.canEditWorkflow}
                    toggled={values.triggers.webhook.enable}
                    onToggle={(checked: boolean) => this.handleOnToggleChange(checked, "triggers.webhook.enable")}
                    tooltipContent="Enable workflow to be executed by a webhook"
                    tooltipProps={{ direction: "top" }}
                    reversed
                  />
                </div>
                {values.triggers.webhook.enable && this.props.canEditWorkflow && (
                  <div className={styles.webhookContainer}>
                    <ComposedModal
                      modalHeaderProps={{
                        title: "Build Webhook URL",
                        subtitle: (
                          <>
                            <p>
                              Build up a webhook URL for an external service to push events that map to this workflow.
                            </p>
                            <p style={{ marginTop: "0.5rem" }}>
                              There are a variety of different webhook types that provide additional functionality, for
                              example the Slack type responds to the slack verification request.
                              <a
                                href={`${BASE_DOCUMENTATION_URL}/introduction/overview`}
                                style={{ marginLeft: "0.1rem" }}
                              >
                                Learn more here
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
                          workflowId={this.props.summaryData.id}
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
                    disabled={!this.props.canEditWorkflow}
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
                    workflowId={this.props.summaryData.id}
                    canEditWorkflow={this.props.canEditWorkflow}
                  />
                ))}
              </div>
              {this.props.canEditWorkflow && (
                <CreateToken
                  tokenData={values.tokens}
                  formikPropsSetFieldValue={this.props.formikProps.setFieldValue}
                  workflowId={this.props.summaryData.id}
                />
              )}
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
                  disabled={!this.props.canEditWorkflow}
                  toggled={values.storage.workflow.enabled}
                  onToggle={(checked: boolean) => this.handleOnToggleChange(checked, "storage.workflow.enabled")}
                  tooltipContent="Persist data across workflow executions"
                  tooltipProps={{ direction: "top" }}
                  reversed
                />
              </div>
              {values.storage.workflow.enabled && this.props.canEditWorkflow && (
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
                        size={values.storage.workflow.size}
                        mountPath={values.storage.workflow.mountPath}
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
                  disabled={!this.props.canEditWorkflow}
                  toggled={values.storage.activity.enabled}
                  onToggle={(checked: boolean) => this.handleOnToggleChange(checked, "storage.activity.enabled")}
                  tooltipContent="Persist workflow data per executions"
                  tooltipProps={{ direction: "top" }}
                  reversed
                />
              </div>
              {values.storage.activity.enabled && this.props.canEditWorkflow && (
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
                    composedModalProps={
                      {
                        // containerClassName: styles.buildWebhookContainer,
                        // shouldCloseOnOverlayClick: true,
                      }
                    }
                    modalTrigger={({ openModal }: { openModal: () => void }) => (
                      <button className={styles.regenerateText} type="button" onClick={openModal}>
                        <p>Configure</p>
                      </button>
                    )}
                  >
                    {({ closeModal }: { closeModal: () => void }) => (
                      <ConfigureStorage
                        size={values.storage.activity.size}
                        mountPath={values.storage.activity.mountPath}
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
                              disabled={!this.props.canEditWorkflow}
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
                          canEditWorkflow={this.props.canEditWorkflow}
                        />
                      );
                    })
                  }
                />
              </div>
              <CustomLabel
                formikPropsSetFieldValue={setFieldValue}
                labels={values.labels}
                canEditWorkflow={this.props.canEditWorkflow}
              />
            </div>
          </div>
          <hr className={styles.delimiter} />
          <div className={styles.saveChangesContainer}>
            <Button
              size="field"
              disabled={!dirty || isLoading || !this.props.canEditWorkflow}
              iconDescription="Save"
              onClick={(e: any) => {
                e.preventDefault();
                handleSubmit();
              }}
              renderIcon={Save24}
            >
              {isLoading ? "Saving..." : "Save"}
            </Button>
            <p className={styles.saveText}>
              Save the configuration. Versioning functionality only applies to the Workflow.
            </p>
          </div>
        </section>
      </div>
    );
  }
}
