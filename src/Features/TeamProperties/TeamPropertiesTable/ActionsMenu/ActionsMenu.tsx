import React, { useState } from "react";
import { OverflowMenu, OverflowMenuItem } from "@boomerang-io/carbon-addons-boomerang-react";
import { ConfirmModal } from "@boomerang-io/carbon-addons-boomerang-react";
import CreateEditTeamPropertiesModal from "../CreateEditTeamPropertiesModal";
import { FlowTeam, Property } from "Types";

interface OverflowMenuComponentProps {
  team: FlowTeam;
  property: Property;
  properties: Property[];
  deleteTeamProperty(args: Property): void;
}

const OverflowMenuComponent: React.FC<OverflowMenuComponentProps> = ({
  property,
  properties,
  deleteTeamProperty,
  team,
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
    deleteTeamProperty(property);
    setDeleteModalIsOpen(false);
  };

  return (
    <>
      <OverflowMenu
        flipped
        ariaLabel="Overflow menu"
        iconDescription="Overflow menu icon"
        data-testid="team-property-menu-button"
      >
        {menuOptions.map((option, index) => (
          <OverflowMenuItem key={index} {...option} />
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
        title={`Delete ${property?.label}?`}
      >
        Your team property will be gone. Forever.
      </ConfirmModal>
    </>
  );
};

export default OverflowMenuComponent;
