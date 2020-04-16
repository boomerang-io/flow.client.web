import React from "react";
import { useHistory } from "react-router-dom";
import { Button } from "@boomerang/carbon-addons-boomerang-react";
import capitalize from "lodash/capitalize";
import FeatureHeader from "Components/FeatureHeader";
import VersionSwitcher from "./VersionSwitcher";
import { serviceUrl } from "Config/servicesConfig";
import { Bee20, Save16, Undo16, WatsonHealthSaveSeries16 } from "@carbon/icons-react";
import styles from "./header.module.scss";

function Header({ selectedTaskTemplate, currentRevision }) {
  let history = useHistory();
  return (
    <FeatureHeader includeBorder className={styles.featureHeader}>
      <div className={styles.container}>
        <div>
          <h1 className={styles.category}>{capitalize(selectedTaskTemplate.category)}</h1>
          <div className={styles.infoContainer}>
            {selectedTaskTemplate.imageId ? (
              <img
                className={styles.icon}
                alt={`${selectedTaskTemplate.name} icon`}
                src={serviceUrl.getImage({imgId:selectedTaskTemplate.imageId})}
              />
            ) : (
              <Bee20 alt={`${selectedTaskTemplate.name} icon`} className={styles.icon} />
            )}
            <p className={styles.taskName}>{selectedTaskTemplate.name || "TASK"}</p>
            {/* <AddService task={task} /> */}
          </div>
        </div>
        <div className={styles.buttons}>
          <VersionSwitcher 
            revisions={selectedTaskTemplate.revisions} 
            currentRevision={currentRevision} 
            revisionCount={selectedTaskTemplate.revisions.length}
          />
          <Button className={styles.button} size="field" kind="ghost" renderIcon={Undo16}>Reset changes</Button>
          {/* <Button className={styles.button} size="field" kind="secondary" renderIcon={Save16}>Update this version</Button> */}
          <Button className={styles.button} size="field" renderIcon={WatsonHealthSaveSeries16}>Save new version</Button>
        </div>
      </div>
    </FeatureHeader>
  );
}

export default Header;
