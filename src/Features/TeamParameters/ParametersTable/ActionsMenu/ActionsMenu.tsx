import React, { useState } from "react";
import { OverflowMenu, OverflowMenuItem } from "@carbon/react";
import { ConfirmModal } from "@boomerang-io/carbon-addons-boomerang-react";
import CreateEditParametersModal from "../../CreateEditParametersModal";
import { Property } from "Types";

interface OverflowMenuComponentProps {
  parameter: Property;
  parameters: Property[];
  handleDelete: (component: Property) => Promise<void>;
  handleSubmit: (isEdit: boolean, values: any) => Promise<void>;
}

const OverflowMenuComponent: React.FC<OverflowMenuComponentProps> = ({
  parameter,
  parameters,
  handleDelete,
  handleSubmit,
}) => {
  const [deleteModalIsOpen, setDeleteModalIsOpen] = useState(false);
  const [editModalIsOpen, setEditModalIsOpen] = useState(false);

  const menuOptions = [
    {
      itemText: "Edit",
      onClick: () => setEditModalIsOpen(true),
    },
    {
      itemText: "Delete",
      onClick: () => setDeleteModalIsOpen(true),
      hasDivider: true,
      isDelete: true,
    },
  ];

  const handleEditClose = () => {
    setEditModalIsOpen(false);
  };

  const affirmativeAction = () => {
    handleDelete(parameter);
    setDeleteModalIsOpen(false);
  };

  return (
    <>
      <OverflowMenu
        flipped
        ariaLabel="Overflow menu"
        iconDescription="Overflow menu icon"
        data-testid="team-parameter-menu-button"
      >
        {menuOptions.map((option, index) => (
          <OverflowMenuItem key={index} {...option} />
        ))}
      </OverflowMenu>
      <CreateEditParametersModal
        isOpen={editModalIsOpen}
        isEdit
        parameter={parameter}
        parameters={parameters}
        handleClose={handleEditClose}
        handleSubmit={handleSubmit}
      />
      <ConfirmModal
        isOpen={deleteModalIsOpen}
        affirmativeAction={affirmativeAction}
        affirmativeButtonProps={{ kind: "danger" }}
        affirmativeText="Delete"
        negativeText="Cancel"
        onCloseModal={() => setDeleteModalIsOpen(false)}
        title={`Delete ${parameter?.label}?`}
      >
        Your parameter will be gone. Forever.
      </ConfirmModal>
    </>
  );
};

export default OverflowMenuComponent;
