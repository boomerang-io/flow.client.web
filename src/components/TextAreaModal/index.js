import React, { useState } from "react";
import PropTypes from "prop-types";
import { ModalFlow, TextArea } from "@boomerang/carbon-addons-boomerang-react";
import TextAreaView from "./TextAreaView/index.js";
import "./styles.scss";

const TextAreaModal = props => {
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
        /* eslint-disable-line */ <button onClick={openModal} className="bmrg-c-text-area-modal-wrapper" type="button">
          <TextArea
            id={props.item.key}
            labelText={props.item.label}
            placeholder={props.item.description}
            value={value}
            disabled
            style={{ cursor: "pointer" }}
          />
        </button>
      )}
    >
      <TextAreaView {...props} setTextAreaValue={setValue} />
    </ModalFlow>
  );
};

TextAreaModal.propTypes = {
  item: PropTypes.shape({
    description: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired
  }).isRequired
};

export default TextAreaModal;
