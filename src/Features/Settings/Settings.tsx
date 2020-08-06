import React from "react";
import { useQuery, useMutation } from "react-query";
import sortBy from "lodash/sortBy";
import { Accordion, Loading, notify, ToastNotification, Error404, ErrorDragon } from "@boomerang-io/carbon-addons-boomerang-react";
import Header from "Components/Header";
import SettingsSection from "./SettingsSection";
import { serviceUrl, resolver } from "Config/servicesConfig"; 
import styles from "./settings.module.scss";

const platformSettingsUrl = serviceUrl.resourcePlatformSettings();

const Settings: React.FC = () => {
  const { data: platformSettingsData, error: platformSettingsError, isLoading: platformSettingsIsLoading } = useQuery({
    queryKey: platformSettingsUrl,
    queryFn: resolver.query(platformSettingsUrl),
  });

  const [updateSettingMutator] = useMutation(resolver.putPlatformSettings);

  const handleOnSave = async (values: any, config: any, setFieldError: any) => {
    const newConfig = config.config.map((input) => ({ ...input, value: values[input.key] }));
    const requestBody = [{ ...config, config: newConfig }];
    try {
      await updateSettingMutator({ body: requestBody });
      notify(<ToastNotification title="Update Settings" subtitle="Settings succesfully updated" kind="success" />);
      setFieldError("initialerror", "required");
    } catch (e) {
      notify(<ToastNotification title="Something's Wrong" subtitle="Request to update settings failed" kind="error" />);
    }
  };

  if (platformSettingsIsLoading) return <Loading />;

  if (platformSettingsError) return <ErrorDragon />;

  const sortedPlatformSettings = sortBy(platformSettingsData, (settingObj) => settingObj.name);
  return (
    <div className={styles.container}>
      <Header includeBorder title="Settings" description="Adjust CICD settings." />
      {!sortedPlatformSettings.length ? (
        <Error404 header={null} title="No settings found" message={null} />
      ) : (
        <Accordion style={{ padding: "1.5rem" }}>
          {sortedPlatformSettings.map((config, index) => (
            <SettingsSection config={config} index={index} key={index} onSave={handleOnSave} />
          ))}
        </Accordion>
      )}
    </div>
  );
}

export default Settings;
