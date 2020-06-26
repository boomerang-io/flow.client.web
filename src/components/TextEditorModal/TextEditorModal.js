import React, { useState } from "react";
import PropTypes from "prop-types";
import { isAccessibleEvent } from "@boomerang-io/utils";
import { ModalFlow, TextArea } from "@boomerang-io/carbon-addons-boomerang-react";
import TextEditorView from "./TextEditorView";
import styles from "./TextEditorModal.module.scss";

const TextEditorModal = (props) => {
  const [value, setValue] = useState(props.initialValue);
  return (
    <ModalFlow
      composedModalProps={{
        containerClassName: styles.modalContainer,
      }}
      modalHeaderProps={{
        title: `Update ${props.label}`,
      }}
      confirmModalProps={{
        title: "Are you sure?",
        children: "Your changes will not be saved",
      }}
      modalTrigger={({ openModal }) => (
        <TextArea
          readOnly
          helperText={props.helperText}
          id={props.key}
          labelText={props.label}
          onClick={openModal}
          onKeyDown={(e) => isAccessibleEvent(e) && openModal()}
          placeholder={props.placeholder}
          style={{ cursor: "pointer" }}
          value={value}
          tooltipContent={props.description}
        />
      )}
    >
      <TextEditorView
        {...props}
        language={props.type?.includes("::") ? props.type.split("::")[1] : undefined}
        setTextAreaValue={setValue}
        value={value}
      />
    </ModalFlow>
  );
};

TextEditorModal.propTypes = {
  item: PropTypes.shape({
    description: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
  }).isRequired,
};

export default TextEditorModal;
