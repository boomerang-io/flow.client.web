import React from "react";

// TOOD: remove in the future placeholder component to validate form on mount until fix is merged in
// FML: https://github.com/jaredpalmer/formik/pull/1971
export default function ValidateFormikOnMount({ validateForm }) {
  React.useEffect(() => {
    validateForm();
  }, [validateForm]);

  return null;
}
