import React from "react";
import PropTypes from "prop-types";
import {
  Button,
  ComposedModal,
  ModalBody,
  StructuredListWrapper,
  StructuredListHead,
  StructuredListBody,
  StructuredListRow,
  StructuredListCell,
} from "@boomerang/carbon-addons-boomerang-react";
import { Catalog16 } from "@carbon/icons-react";
import styles from "./versionHistory.module.scss";

VersionHistory.propTypes = {
  revisions: PropTypes.array,
};

function VersionHistory({ changelogs }) {
  return (
    <ComposedModal
      composedModalProps={{ shouldCloseOnOverlayClick: true }}
      modalHeaderProps={{
        title: "Version History",
      }}
      modalTrigger={({ openModal }) => (
        <Button
          hasIconOnly
          className={styles.history}
          iconDescription="History"
          kind="ghost"
          onClick={openModal}
          renderIcon={Catalog16}
          size="small"
          tooltipAlignment="center"
          tooltipPosition="right"
        />
      )}
    >
      {() => <VersionHistoryModal changelogs={changelogs} />}
    </ComposedModal>
  );
}

function VersionHistoryModal({ changelogs }) {
  return (
    <ModalBody>
      <StructuredListWrapper>
        <StructuredListHead>
          <StructuredListRow head>
            <StructuredListCell head>Version</StructuredListCell>
            <StructuredListCell head>Creator</StructuredListCell>
            <StructuredListCell head>Comments</StructuredListCell>
            <StructuredListCell head>Date</StructuredListCell>
          </StructuredListRow>
        </StructuredListHead>
        <StructuredListBody>
          {changelogs.map((log) => (
            <StructuredListRow>
              <StructuredListCell>{log?.version ?? "---"}</StructuredListCell>
              <StructuredListCell noWrap>{log?.userName ?? "---"}</StructuredListCell>
              <StructuredListCell>{log?.reason?.length ? log.reason : "---"}</StructuredListCell>
              <StructuredListCell noWrap>{log?.date ?? "---"}</StructuredListCell>
            </StructuredListRow>
          ))}
        </StructuredListBody>
      </StructuredListWrapper>
    </ModalBody>
  );
}

export default VersionHistory;
