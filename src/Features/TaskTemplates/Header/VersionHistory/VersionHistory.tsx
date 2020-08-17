import React from "react";
import {
  ComposedModal,
  ModalBody,
  StructuredListWrapper,
  StructuredListHead,
  StructuredListBody,
  StructuredListRow,
  StructuredListCell,
  TooltipHover,
} from "@boomerang-io/carbon-addons-boomerang-react";
import { Catalog16 } from "@carbon/icons-react";
import { ChangeLogItem, ModalTriggerProps } from "Types";
import styles from "./versionHistory.module.scss";

interface VersionHistoryProps {
  changelogs: ChangeLogItem[];
}

const VersionHistory: React.FC<VersionHistoryProps> = ({ changelogs }) => {
  return (
    <ComposedModal
      composedModalProps={{ shouldCloseOnOverlayClick: true }}
      modalHeaderProps={{
        title: "Version History",
      }}
      modalTrigger={({ openModal }: ModalTriggerProps) => (
        <TooltipHover direction="right" content="History">
          <button className={styles.button} onClick={openModal}>
            <Catalog16 />
          </button>
        </TooltipHover>
      )}
    >
      {() => <VersionHistoryModal changelogs={changelogs} />}
    </ComposedModal>
  );
};

const VersionHistoryModal: React.FC<VersionHistoryProps> = ({ changelogs }) => {
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
          {changelogs.map((log, index) => (
            <StructuredListRow key={index}>
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
};

export default VersionHistory;
