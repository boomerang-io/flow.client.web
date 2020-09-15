import React from "react";
import { useQuery, useMutation, queryCache } from "react-query";
import { Box } from "reflexbox";
import {
  Accordion,
  Error404,
  ErrorMessage,
  SkeletonPlaceholder,
  notify,
  ToastNotification,
} from "@boomerang-io/carbon-addons-boomerang-react";
import FeatureHeader from "Components/FeatureHeader";
import SettingsSection from "./SettingsSection";
import sortBy from "lodash/sortBy";
import { serviceUrl, resolver } from "Config/servicesConfig";
import { DataDrivenInput } from "Types";
import styles from "./settings.module.scss";

export type SettingsGroup = {
  name: string;
  key: string;
  config: DataDrivenInput[];
};

const platformSettingsUrl = serviceUrl.resourceSettings();

const FeatureLayout: React.FC = ({ children }) => {
  return (
    <>
      <FeatureHeader>
        <h1 style={{ fontWeight: 600, margin: 0 }}>Settings</h1>
        <p>Adjust Flow settings</p>
      </FeatureHeader>
      <Box p="2rem" overflowY="auto" className={styles.container}>
        {children}
      </Box>
    </>
  );
};

const Settings: React.FC = () => {
  const { data, error, isLoading } = useQuery({
    queryKey: platformSettingsUrl,
    queryFn: resolver.query(platformSettingsUrl),
  });

  const [updateSettingMutator] = useMutation(resolver.putPlatformSettings, {
    onSuccess: () => queryCache.invalidateQueries([platformSettingsUrl]),
  });

  const handleOnSave = async (
    values: { [key: string]: any },
    settingsGroup: SettingsGroup,
    setFieldError: (key: string, value: string) => void
  ) => {
    const newConfig = settingsGroup.config.map((input: any) => ({ ...input, value: values[input.key] }));
    const requestBody = [{ ...settingsGroup, config: newConfig }];
    try {
      await updateSettingMutator({ body: requestBody });
      notify(<ToastNotification title="Update Settings" subtitle="Settings succesfully updated" kind="success" />);
      setFieldError("initialerror", "required");
    } catch (e) {
      notify(<ToastNotification title="Something's Wrong" subtitle="Request to update settings failed" kind="error" />);
    }
  };

  if (isLoading) {
    return (
      <FeatureLayout>
        <Box className={styles.skeletonPlacholderContainer}>
          <SkeletonPlaceholder />
          <SkeletonPlaceholder />
          <SkeletonPlaceholder />
          <SkeletonPlaceholder />
          <SkeletonPlaceholder />
        </Box>
      </FeatureLayout>
    );
  }

  if (error) {
    return (
      <FeatureLayout>
        <ErrorMessage />
      </FeatureLayout>
    );
  }

  const sortedPlatformSettings = sortBy(data, (settingObj) => settingObj.name);
  return (
    <FeatureLayout>
      {!sortedPlatformSettings.length ? (
        <Error404 header={null} title="No settings found" message={null} />
      ) : (
        <Accordion>
          {sortedPlatformSettings.map((settingsGroup, index) => (
            <SettingsSection index={index} key={index} onSave={handleOnSave} settingsGroup={settingsGroup} />
          ))}
        </Accordion>
      )}
    </FeatureLayout>
  );
};

export default Settings;
