import React, { useState } from "react";
import ModalFlow from "@boomerang/boomerang-components/lib/ModalFlow";
import { TextArea } from "@boomerang/boomerang-components";
import ModalWrapper from "@boomerang/boomerang-components/lib/Modal";
import TextAreaView from "./TextAreaView";

const TextAreaContainer = ({ closeModal, setValue, title, ...rest }) => {
  return (
    <ModalFlow
      headerTitle={`Update ${title}`}
      theme="bmrg-flow"
      closeModal={closeModal}
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
        <TextAreaContainer closeModal={closeModal} setValue={setValue} title={props.item.label} {...rest} />
      )}
      {...props}
    />
  );
};

export default TextAreaModal;
