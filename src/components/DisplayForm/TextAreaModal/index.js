import React, { useState } from "react";
//import ModalFlow from "@boomerang/boomerang-components/lib/ModalFlow";
//import { TextArea } from "@boomerang/boomerang-components";
//import ModalWrapper from "@boomerang/boomerang-components/lib/Modal";
import { ModalFlow, TextArea } from "@boomerang/carbon-addons-boomerang-react";
//import TextAreaView from "./TextAreaView";
import TextAreaView from "Components/TextAreaModal/TextAreaView/index.js";

/*const TextAreaContainer = ({ closeModal, setValue, title, ...rest }) => {
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
};*/

const TextAreaModal = props => {
  const [value, setValue] = useState(props.initialValue);
  return (
    /*<ModalWrapper
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
    />*/
    <ModalFlow
      modalHeaderProps={{
        title: `Update ${props.item.label}`
        //subtitle: "Provide input values for your workflow"
      }}
      /*modalTrigger={({ openModal }) => (
        <Button iconDecscription="Run Workflow" renderIcon={Run20} size="small" onClick={openModal}>
          Execute Workflow
        </Button>
      )}*/
      modalTrigger={({ openModal }) => (
        <div onClick={openModal}>
          <TextArea
            id={props.item.key}
            //name={props.item.key}
            labelText={props.item.key}
            //alwaysShowTitle
            //title={props.item.label}
            placeholder={props.item.description}
            value={value}
            //readOnly
          />
        </div>
      )}
    >
      <TextAreaView {...props} setTextAreaValue={setValue} />
    </ModalFlow>
  );
};

export default TextAreaModal;
