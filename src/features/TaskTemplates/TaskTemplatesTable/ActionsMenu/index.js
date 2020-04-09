import React, { useState } from "react";
import { OverflowMenu, OverflowMenuItem } from "carbon-components-react";
import { ConfirmModal } from "@boomerang/carbon-addons-boomerang-react";
import { useHistory, useRouteMatch } from "react-router-dom";
import "./actionMenu.module.scss";

const OverflowMenuComponent = ({ taskTemplate, deleteProperty, addPropertyInStore, updatePropertyInStore, deleteTaskTemplate }) => {
  const [deleteModalIsOpen, setDeleteModalIsOpen] = useState(false);
  const history = useHistory();
  const match = useRouteMatch();
  const menuOptions = [
    {
      itemText: "Edit",
      onClick: () => history.push(`${match.url}/edit/${taskTemplate.id}/${taskTemplate.latestVersion}`),
      primaryFocus: true
    },
    {
      itemText: "Delete",
      onClick: () => setDeleteModalIsOpen(true),
      hasDivider: true,
      isDelete: true
    }
  ];

  return (
    <>
      <OverflowMenu
        ariaLabel="Overflow menu"
        iconDescription="Overflow menu icon"
        data-testid="configuration-task-template-table-overflow-menu"
        flipped
      >
        {menuOptions.map((option, index) => (
          <OverflowMenuItem key={index} {...option} />
        ))}
      </OverflowMenu>
      {deleteModalIsOpen && (
        <ConfirmModal
          affirmativeAction={() => {
            deleteTaskTemplate(taskTemplate);
            setDeleteModalIsOpen(false);
          }}
          negativeText="No"
          affirmativeText="Delete"
          title={`Delete ${taskTemplate.name}?`}
          onCloseModal={() => {
            setDeleteModalIsOpen(false);
          }}
          affirmativeButtonProps={{kind:"danger"}}
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
