import React from "react";
import PropTypes from "prop-types";
import { Route } from "react-router-dom";
import CaslteDragonGraphic from "./CaslteDragonGraphic";
import USER_TYPES from "Constants/userTypes";

const checkAuth = userRole => {
  return userRole === USER_TYPES.ADMIN || userRole === USER_TYPES.OPERATOR;
};

const ProtectedRoute = ({ component: Component, userRole, ...rest }) => (
  <Route
    {...rest}
    render={props =>
      checkAuth(userRole) ? (
        <Component {...props} />
      ) : (
        <div className="c-app-content c-app-content--not-loaded">
          <div
            style={{
              color: "black",
              textAlign: "center",
              fontSize: "2rem",
              letterSpacing: "0.0625rem",
              lineHeight: "1.5",
              fontWeight: 300,
              paddingBottom: "25vh"
            }}
          >
            <CaslteDragonGraphic style={{ width: "50vw", height: "16vw", minHeight: "13rem", minWidth: "40rem" }} />
            <div>
              Sorry mate, you are not allowed here.
              <br />
              If you think you should be, contact your friendly neighborhood Boomerang Joe.
            </div>
          </div>
        </div>
      )
    }
  />
);

ProtectedRoute.propTypes = {
  component: PropTypes.oneOfType([PropTypes.func, PropTypes.object]).isRequired,
  userRole: PropTypes.string.isRequired,
  location: PropTypes.object
};

export default ProtectedRoute;
