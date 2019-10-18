import React, { useState } from "react";
import PropTypes from "prop-types";
import isAccessibleEvent from "@boomerang/boomerang-utilities/lib/isAccessibleEvent";
import { ModalFlow, TextArea } from "@boomerang/carbon-addons-boomerang-react";
import TextEditorView from "./TextEditorView";
import "./styles.scss";

const TextEditorModal = props => {
  const [value, setValue] = useState(props.initialValue);
  return (
    <ModalFlow
      composedModalProps={{
        containerClassName: "c-task-text-area-modal"
      }}
      modalHeaderProps={{
        title: `Update ${props.item.label}`
      }}
      confirmModalProps={{
        title: "Are you sure?",
        children: "Your changes will not be saved"
      }}
      modalTrigger={({ openModal }) => (
        <TextArea
          readOnly
          id={props.item.key}
          labelText={props.item.label}
          onClick={openModal}
          onKeyDown={e => isAccessibleEvent(e) && openModal()}
          placeholder={props.item.description}
          value={value}
          style={{ cursor: "pointer" }}
        />
      )}
    >
      <TextEditorView {...props} setTextAreaValue={setValue} />
    </ModalFlow>
  );
};

TextEditorModal.propTypes = {
  item: PropTypes.shape({
    description: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired
  }).isRequired
};

export default TextEditorModal;
