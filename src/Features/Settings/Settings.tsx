import React from "react";
import { useQuery, useMutation } from "react-query";
import { Box } from "reflexbox";
import { Accordion, Loading, notify, ToastNotification, Error404, ErrorMessage } from "@boomerang-io/carbon-addons-boomerang-react";
import FeatureHeader from "Components/FeatureHeader";
import SettingsSection from "./SettingsSection";
import sortBy from "lodash/sortBy";
import { serviceUrl, resolver } from "Config/servicesConfig"; 
import styles from "./settings.module.scss";

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

  const [updateSettingMutator] = useMutation(resolver.putPlatformSettings);

  const handleOnSave = async (values: any, config: any, setFieldError: any) => {
    const newConfig = config.config.map((input: any) => ({ ...input, value: values[input.key] }));
    const requestBody = [{ ...config, config: newConfig }];
    try {
      await updateSettingMutator({ body: requestBody });
      notify(<ToastNotification title="Update Settings" subtitle="Settings succesfully updated" kind="success" />);
      setFieldError("initialerror", "required");
    } catch (e) {
      notify(<ToastNotification title="Something's Wrong" subtitle="Request to update settings failed" kind="error" />);
    }
  };

  if (isLoading) {
    return <FeatureLayout><Loading /></FeatureLayout>
  }

  if (error) { 
    return <FeatureLayout><ErrorMessage /></FeatureLayout>
  }

  const sortedPlatformSettings = sortBy(data, (settingObj) => settingObj.name);
  return (
    <FeatureLayout>
      {!sortedPlatformSettings.length ? (
        <Error404 header={null} title="No settings found" message={null} />
      ) : (
        <Accordion style={{ padding: "1.5rem" }}>
          {sortedPlatformSettings.map((config, index) => (
            <SettingsSection config={config} index={index} key={index} onSave={handleOnSave} />
          ))}
        </Accordion>
      )}
    </FeatureLayout>
  );
}

export default Settings;
