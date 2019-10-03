import React, { useState } from "react";
import { OverflowMenu, OverflowMenuItem } from "carbon-components-react";
import { ConfirmModal } from "@boomerang/carbon-addons-boomerang-react";
import CreateEditPropertiesModal from "../CreateEditPropertiesModal";
import "./actionMenu.module.scss";

const OverflowMenuComponent = ({ property, properties, deleteProperty, addPropertyInStore, updatePropertyInStore }) => {
  const [deleteModalIsOpen, setDeleteModalIsOpen] = useState(false);
  const [editModalIsOpen, setEditModalIsOpen] = useState(false);

  const menuOptions = [
    {
      itemText: "Edit",
      onClick: () => setEditModalIsOpen(true),
      primaryFocus: true
    },
    {
      itemText: "Delete",
      onClick: () => setDeleteModalIsOpen(true),
      hasDivider: true,
      isDelete: true
    }
  ];

  const handleEditClose = () => {
    setEditModalIsOpen(false);
  };

  return (
    <>
      <OverflowMenu
        ariaLabel="Overflow menu"
        iconDescription="Overflow menu icon"
        data-testid="configuration-property-table-overflow-menu"
        flipped
      >
        {menuOptions.map((option, index) => (
          <OverflowMenuItem key={index} {...option} />
        ))}
      </OverflowMenu>
      {editModalIsOpen && (
        <CreateEditPropertiesModal
          isOpen
          isEdit
          property={property}
          properties={properties}
          addPropertyInStore={addPropertyInStore}
          updatePropertyInStore={updatePropertyInStore}
          handleEditClose={handleEditClose}
        />
      )}
      {deleteModalIsOpen && (
        <ConfirmModal
          affirmativeAction={() => {
            deleteProperty(property);
            setDeleteModalIsOpen(false);
          }}
          negativeText="NO"
          affirmativeText="YES"
          title={`DELETE ${property.label.toUpperCase()}?`}
          onCloseModal={() => {
            setDeleteModalIsOpen(false);
          }}
          isOpen={deleteModalIsOpen}
          negativeAction={() => {
            setDeleteModalIsOpen(false);
          }}
        >
          <div>It will be gone. Forever.</div>
        </ConfirmModal>
      )}
    </>
  );
};

export default OverflowMenuComponent;
