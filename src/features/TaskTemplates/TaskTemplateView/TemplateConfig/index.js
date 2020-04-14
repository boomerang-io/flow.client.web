import React from "react";
import PropTypes from "prop-types";
import { ConfirmModal } from "@boomerang/carbon-addons-boomerang-react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import TemplateConfigModal from "./TemplateConfigModal";
import WorkflowCloseButton from "Components/WorkflowCloseButton";
import styles from "./TemplateConfig.module.scss";

TemplateConfig.propTypes = {
  settings: PropTypes.array.isRequired,
  setFieldValue: PropTypes.func.isRequired
};

function TemplateConfigRow({ title, value }) {
  return (
    <dl className={styles.fieldContainer}>
      <dt className={styles.fieldKey}>{title}</dt>
      <dd className={styles.fieldValue}>{value}</dd>
    </dl>
  );
}

function TemplateConfig(props) {
  const { settings, setFieldValue } = props;
  const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    return result;
  };
  const onDragEnd = async result => {
    if (result.source && result.destination) {
      const newSettings = reorder(settings, result.source.index, result.destination.index);
      await setFieldValue("settings",newSettings);
      // setFieldValue("actionsInfo", { ...actionsInfo, [type]: actions });
    }
  };

  function formatDefaultValue(value) {
    if (!value) {
      return "---";
    } else {
      return value;
    }
  }

  function TemplateConfigHeader({ label, description }) {
    return (
      <div className={styles.headerContainer}>
        <h1 className={styles.label}>{label}</h1>
        <p className={styles.description}>{formatDefaultValue(description)}</p>
      </div>
    );
  }

  function deleteConfiguration(selectedSetting) {
    const settingIndex = settings.findIndex(setting => setting.key === selectedSetting.key);
    let newProperties = [].concat(settings);
    newProperties.splice(settingIndex,1);
    setFieldValue("settings",newProperties);
  }
  const settingKeys = settings.map(input => input.key);
  return (
    <main className={styles.container}>
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="droppable" direction="horizontal">
        {
          provided=>(
            <div ref={provided.innerRef} className={styles.settingListRow}>
            {settings.length > 0 &&
              settings.map((setting, index) => (
                <Draggable key={index} draggableId={index} index={index}>
                  {provided => (
                    <section key={`${setting.id}-${index}`} className={styles.setting} ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                      <TemplateConfigHeader label={setting.label} description={setting.description} />
                      <TemplateConfigRow title="Label" value={setting.label} />
                      <TemplateConfigRow title="Key" value={setting.key} />
                      <TemplateConfigRow title="Type" value={setting.type} />
                      <TemplateConfigRow title="Placeholder" value={setting.placeholder} />
                      <TemplateConfigRow title="Helper Text" value={setting.helperText} />
                      <TemplateConfigRow title="Description" value={setting.description} />
                      {setting.required ? (
                        <p className={styles.required}>Required</p>
                      ) : (
                        <p className={styles.notRequired}>Not required</p>
                      )}
                      {/* {!setting.readOnly ? ( */}
                        <>
                          <TemplateConfigModal
                            isEdit
                            settingKeys={settingKeys.filter(settingName => settingName !== setting.key)}
                            setting={setting}
                            settings={settings}
                            setFieldValue={setFieldValue}
                          />
                          <ConfirmModal
                            affirmativeAction={() => {
                              deleteConfiguration(setting);
                            }}
                            // children="It will be gone. Forever."
                            title="Delete This Configuration?"
                            modalTrigger={({ openModal }) => (
                              <WorkflowCloseButton className={styles.deleteConfiguration} onClick={openModal} />
                            )}
                          />
                        </>
                      {/* ) : (
                        <p className={styles.readOnlyText}>Read-only</p>
                      )
                      } */}
                    </section>
                  )}
                </Draggable>
              ))}
            </div>
          )
        }
      </Droppable>
    </DragDropContext>
      <TemplateConfigModal
        isEdit={false}
        settingKeys={settingKeys}
        updateTemplateConfig={props.updateTemplateConfig}
        settings={settings}
        setFieldValue={setFieldValue}
      />
    </main>
  );
}

export default TemplateConfig;
