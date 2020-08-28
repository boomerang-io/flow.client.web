import React from "react";
// import { useHistory } from "react-router-dom";
import { Flex } from "reflexbox";
import { ErrorBoundary as ReactErrorBoundary, FallbackProps } from "react-error-boundary";
// import { Button } from "@boomerang-io/carbon-addons-boomerang-react";
import ErrorDragon from "Components/ErrorDragon";
// import { appLink } from "Config/appConfig";
// import { ArrowRight16, ArrowLeft16 } from "@carbon/icons-react";

const ErrorMessage: React.FC<FallbackProps> = (props) => {
  //const history = useHistory();
  return (
    <Flex mt="10rem" alignItems="center" flexDirection="column" justifyContent="center">
      <ErrorDragon />
      {/* <Flex mt="1rem">
        <Button
          style={{ marginRight: "1rem" }}
          iconDescription="Go Back"
          onClick={() => {
            history.goBack();
            props.resetErrorBoundary();
          }}
          renderIcon={ArrowLeft16}
        >
          Go Back
        </Button>
        <Button
          iconDescription="Go to Workflows"
          onClick={() => {
            history.push(appLink.workflows());
            props.resetErrorBoundary();
          }}
          renderIcon={ArrowRight16}
        >
          Go Home
        </Button>
      </Flex> */}
    </Flex>
  );
};

interface ErrorBoundaryProps {
  FallbackComponent?: React.FunctionComponent<FallbackProps>;
}

const ErrorBoundary: React.FC<ErrorBoundaryProps> = ({ children, FallbackComponent = ErrorMessage, ...rest }) => {
  return (
    <ReactErrorBoundary FallbackComponent={ErrorMessage} {...rest}>
      {children}
    </ReactErrorBoundary>
  );
};

export default ErrorBoundary;
