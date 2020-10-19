import React from "react";
import PropTypes from "prop-types";
import {
  StructuredListCell,
  StructuredListBody,
  StructuredListHead,
  StructuredListRow,
  StructuredListWrapper,
} from "@boomerang-io/carbon-addons-boomerang-react";
import { NoDisplay } from "@boomerang-io/carbon-addons-boomerang-react";
import styles from "./propertiesTable.module.scss";

function PropertiesTable({ data: properties, hasJsonValues = false }) {
  const formatPropertyValue = (value) => {
    if (hasJsonValues) {
      if (value && value !== '""')
        try {
          return JSON.parse(value);
        } catch {
          return "---";
        }
      return "---";
    } else {
      return value ?? "---";
    }
  };

  return (
    <div className={styles.tableContainer}>
      {properties && properties.length > 0 ? (
        <StructuredListWrapper selection>
          <StructuredListHead>
            <StructuredListRow head>
              <StructuredListCell head>Property</StructuredListCell>
              <StructuredListCell head>Value</StructuredListCell>
            </StructuredListRow>
          </StructuredListHead>
          <StructuredListBody>
            {properties.map((property, i) => (
              <StructuredListRow key={`row-${i}`}>
                <StructuredListCell>{property.key}</StructuredListCell>
                <StructuredListCell>
                  {<code className={styles.code}>{formatPropertyValue(property.value)}</code>}
                </StructuredListCell>
              </StructuredListRow>
            ))}
          </StructuredListBody>
        </StructuredListWrapper>
      ) : (
        <NoDisplay text="No properties to display" />
      )}
    </div>
  );
}

PropertiesTable.propTypes = {
  data: PropTypes.array.isRequired,
};

export default PropertiesTable;
