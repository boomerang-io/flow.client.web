import React, { useState } from "react";
import PropTypes from "prop-types";
import ModalFlow from "@boomerang/boomerang-components/lib/ModalFlow";
import { TextArea } from "@boomerang/boomerang-components";
import ModalWrapper from "@boomerang/boomerang-components/lib/Modal";
import TextAreaView from "./TextAreaView";
import "./styles.scss";

const TextAreaContainer = ({ closeModal, setValue, title, ...rest }) => {
  return (
    <ModalFlow
      headerTitle={`Update ${title}`}
      theme="bmrg-flow"
      closeModal={closeModal}
      confirmModalProps={{
        affirmativeAction: closeModal,
        theme: "bmrg-flow",
        subTitleTop: "Your input will not be saved"
      }}
      setTextAreaValue={setValue}
      {...rest}
    >
      <TextAreaView />
    </ModalFlow>
  );
};

const TextAreaModal = props => {
  const [value, setValue] = useState(props.initialValue);
  return (
    <ModalWrapper
      className="c-task-text-area-modal"
      modalTriggerProps={{ style: { width: "100%" } }}
      ModalTrigger={() => (
        <TextArea
          id={props.item.key}
          name={props.item.key}
          alwaysShowTitle
          title={props.item.label}
          placeholder={props.item.description}
          value={value}
          readOnly
        />
      )}
      modalContent={(closeModal, rest) => (
        <TextAreaContainer
          closeModal={closeModal}
          value={value}
          setValue={setValue}
          title={props.item.label}
          {...rest}
        />
      )}
      {...props}
    />
  );
};

TextAreaModal.propTypes = {
  item: PropTypes.shape({
    description: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired
  }).isRequired
};

export default TextAreaModal;
