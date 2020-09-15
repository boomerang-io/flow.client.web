const stringToBooleanHelper = (str) => {
  if (str === "true") {
    return true;
  } else if (str === "false") {
    return false;
  } else return str;
};

export default stringToBooleanHelper;
