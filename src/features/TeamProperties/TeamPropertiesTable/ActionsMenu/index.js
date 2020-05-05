import React, { useState } from "react";
import PropTypes from "prop-types";
import { OverflowMenu, OverflowMenuItem } from "carbon-components-react";
import { ConfirmModal } from "@boomerang/carbon-addons-boomerang-react";
import CreateEditTeamPropertiesModal from "../CreateEditTeamPropertiesModal";
import "./styles.scss";

OverflowMenuComponent.propTypes = {
  team: PropTypes.string.isRequired,
  property: PropTypes.object.isRequired,
  properties: PropTypes.array.isRequired,
  updateTeamProperty: PropTypes.func.isRequired,
  addTeamPropertyInStore: PropTypes.func.isRequired,
  deleteTeamPropertyInStore: PropTypes.func.isRequired
};

function OverflowMenuComponent({
  addTeamPropertyInStore,
  property,
  properties,
  deleteTeamPropertyInStore,
  team,
  updateTeamProperty
}) {
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
        flipped
        ariaLabel="Overflow menu"
        iconDescription="Overflow menu icon"
        data-testid="team-property-menu"
      >
        {menuOptions.map((option, index) => (
          <OverflowMenuItem key={index} primaryFocus {...option} />
        ))}
      </OverflowMenu>
      {editModalIsOpen && (
        <CreateEditTeamPropertiesModal
          isOpen
          isEdit
          addTeamPropertyInStore={addTeamPropertyInStore}
          property={property}
          properties={properties}
          handleEditClose={handleEditClose}
          team={team}
          updateTeamProperty={updateTeamProperty}
        />
      )}
      {deleteModalIsOpen && (
        <ConfirmModal
          isOpen={deleteModalIsOpen}
          affirmativeAction={() => {
            deleteTeamPropertyInStore(property);
            setDeleteModalIsOpen(false);
          }}
          affirmativeButtonProps={{ kind: "danger" }}
          affirmativeText="Delete"
          negativeText="Cancel"
          negativeAction={() => {
            setDeleteModalIsOpen(false);
          }}
          onCloseModal={() => {
            setDeleteModalIsOpen(false);
          }}
          title={`Delete ${property.label}`}
        >
          <div>It will be gone and no longer usable in Workflows. This could break things so be careful.</div>
        </ConfirmModal>
      )}
    </>
  );
}

export default OverflowMenuComponent;
