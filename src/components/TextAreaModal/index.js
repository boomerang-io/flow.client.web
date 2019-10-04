import React, { useState } from "react";
import PropTypes from "prop-types";
import { ModalFlow, TextArea } from "@boomerang/carbon-addons-boomerang-react";
import TextAreaView from "./TextAreaView/index.js";
import "./styles.scss";

const TextAreaModal = props => {
  const [value, setValue] = useState(props.initialValue);
  return (
    <ModalFlow
      modalHeaderProps={{
        title: `Update ${props.item.label}`
        //subtitle: ""
      }}
      modalTrigger={({ openModal }) => (
        /* eslint-disable-line */ <button onClick={openModal} className="bmrg-c-text-area-modal-wrapper">
          <TextArea
            id={props.item.key}
            //name={props.item.key}
            //helperText={props.item.key}
            //title={props.item.label}
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
