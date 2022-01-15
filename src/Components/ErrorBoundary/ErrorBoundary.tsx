import React from "react";
// import { useHistory } from "react-router-dom";
import { Flex } from "reflexbox";
import { ErrorBoundary as ReactErrorBoundary, FallbackProps } from "react-error-boundary";
import { ErrorFullPage } from "@boomerang-io/carbon-addons-boomerang-react";

const ErrorMessage: React.FC<FallbackProps> = (props) => {
  //const history = useHistory();
  return (
    <Flex mt="10rem" alignItems="center" flexDirection="column" justifyContent="center">
      <ErrorFullPage statusUrl="https://www.betteruptime.com" />
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
