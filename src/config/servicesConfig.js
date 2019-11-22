export const BASE_SERVICE_ENV_URL =
  process.env.NODE_ENV === "development"
    ? "http://localhost:8000"
    : window._SERVER_DATA && window._SERVER_DATA.BASE_SERVICE_ENV_URL;

export const PRODUCT_SERVICE_ENV_URL =
  process.env.NODE_ENV === "development"
    ? "http://localhost:8000"
    : window._SERVER_DATA && window._SERVER_DATA.PRODUCT_SERVICE_ENV_URL;

// Standard
export const BASE_URL = BASE_SERVICE_ENV_URL;
export const BASE_SERVICE_URL = `${PRODUCT_SERVICE_ENV_URL}/flow`;
export const BASE_USERS_URL = `${BASE_SERVICE_ENV_URL}/users`;
export const BASE_TEAMS_URL = `${BASE_SERVICE_URL}/teams`;

// Profile image
export const IMG_URL = `${BASE_USERS_URL}/image`;

// Teams
export const TEAMS_USER_URL = email => `${BASE_TEAMS_URL}?userEmail=${email}`;
export const TEAM_PROPERTIES_ID_URL = ciTeamId => `${BASE_TEAMS_URL}/${ciTeamId}/properties`;
export const TEAM_PROPERTIES_ID_PROPERTY_ID_URL = (ciTeamId, configurationId) =>
  `${BASE_TEAMS_URL}/${ciTeamId}/properties/${configurationId}`;

export const REQUEST_STATUSES = {
  FAILURE: "failure",
  SUCCESS: "success"
};
