import React, { useState } from "react";
import PropTypes from "prop-types";
import { OverflowMenu, OverflowMenuItem } from "carbon-components-react";
import { ConfirmModal } from "@boomerang/carbon-addons-boomerang-react";
import CreateEditTeamPropertiesModal from "../CreateEditTeamPropertiesModal";

OverflowMenuComponent.propTypes = {
  team: PropTypes.object.isRequired,
  property: PropTypes.object.isRequired,
  properties: PropTypes.array.isRequired,
  deleteTeamProperty: PropTypes.func.isRequired
};

function OverflowMenuComponent({ property, properties, deleteTeamProperty, team }) {
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

  const affirmativeAction = () => {
    deleteTeamProperty(property);
    setDeleteModalIsOpen(false);
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
      <CreateEditTeamPropertiesModal
        isOpen={editModalIsOpen}
        isEdit
        property={property}
        properties={properties}
        handleEditClose={handleEditClose}
        team={team}
      />
      <ConfirmModal
        isOpen={deleteModalIsOpen}
        affirmativeAction={affirmativeAction}
        affirmativeButtonProps={{ kind: "danger" }}
        affirmativeText="Delete"
        negativeText="Cancel"
        onCloseModal={() => setDeleteModalIsOpen(false)}
        title={`Delete ${property.label}?`}
      >
        Your team property will be gone. Forever.
      </ConfirmModal>
    </>
  );
}

export default OverflowMenuComponent;
