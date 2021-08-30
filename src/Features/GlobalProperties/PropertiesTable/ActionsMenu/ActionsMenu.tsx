import React, { useState } from "react";
import { OverflowMenu, OverflowMenuItem } from "@boomerang-io/carbon-addons-boomerang-react";
import { ConfirmModal } from "@boomerang-io/carbon-addons-boomerang-react";
import CreateEditPropertiesModal from "../CreateEditPropertiesModal";
import { Property } from "Types";

type Props = {
  property: Property;
  properties: Property[];
  deleteProperty: (property: Property) => void;
};

const OverflowMenuComponent = ({ property, properties, deleteProperty }: Props) => {
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

  return (
    <>
      <OverflowMenu
        flipped
        ariaLabel="Overflow menu"
        iconDescription="Overflow menu icon"
        data-testid="configuration-parameter-table-overflow-menu"
      >
        {menuOptions.map((option, index) => (
          <OverflowMenuItem key={index} {...option} />
        ))}
      </OverflowMenu>
      <CreateEditPropertiesModal
        isOpen={editModalIsOpen}
        isEdit
        property={property}
        properties={properties}
        handleEditClose={handleEditClose}
      />
      <ConfirmModal
        isOpen={deleteModalIsOpen}
        onCloseModal={() => {
          setDeleteModalIsOpen(false);
        }}
        affirmativeAction={() => {
          deleteProperty(property);
        }}
        affirmativeButtonProps={{ kind: "danger" }}
        title={`Delete ${property?.label}?`}
        negativeText="No"
        affirmativeText="Yes"
      >
        It will be gone. Forever.
      </ConfirmModal>
    </>
  );
};

export default OverflowMenuComponent;
