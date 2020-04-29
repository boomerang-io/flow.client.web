import React from "react";
import { ComboBox } from "@boomerang/carbon-addons-boomerang-react";
import styles from "./selectIcon.module.scss";

export function SelectIcon({ onChange, selectedIcon, iconOptions }) {
  return (
    <ComboBox
      id="select-icon"
      placeholder="Choose an icon"
      labelText="Icon"
      helperText="Choose the icon that best fits this task"
      invalid={false}
      items={iconOptions.map(icon => ({
        value: icon.iconName,
        label: icon.iconName,
        icon: icon.icon
      }))}
      itemToElement={item => {
        return (
          <div className={styles.container}>
            <item.icon className={styles.icon} />
            {item.label}
          </div>
        );
      }}
      initialSelectedItem={selectedIcon}
      onChange={onChange}
    />
  );
}

export default SelectIcon;
