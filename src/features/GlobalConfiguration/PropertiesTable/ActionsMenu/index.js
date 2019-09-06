import React, { useState } from "react";
import { OverflowMenu, OverflowMenuItem } from "carbon-components-react";
import ConfirmModal from "@boomerang/boomerang-components/lib/ConfirmModal";
import AlertModalWrapper from "@boomerang/boomerang-components/lib/AlertModal";
import CreateEditPropertiesModal from "../CreateEditPropertiesModal";
import "./actionMenu.module.scss";

const OverflowMenuComponent = ({ property, properties, deleteProperty, addPropertyInStore, updatePropertyInStore }) => {
  const [deleteModalIsOpen, setDeleteModalIsOpen] = useState(false);
  const [editModalIsOpen, setEditModalIsOpen] = useState(false);

  const menuOptions = [
    {
      itemText: "Edit",
      onClick: () => setEditModalIsOpen(true)
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
        <AlertModalWrapper
          isOpen
          modalContent={closeModal => (
            <ConfirmModal
              closeModal={() => {
                setDeleteModalIsOpen(false);
              }}
              affirmativeAction={() => {
                deleteProperty(property);
                setDeleteModalIsOpen(false);
              }}
              title={`DELETE ${property.label.toUpperCase()}?`}
              subTitleTop="It will be gone. Forever."
              negativeText="NO"
              affirmativeText="YES"
              theme="bmrg-flow"
            />
          )}
        />
      )}
    </>
  );
};

export default OverflowMenuComponent;
