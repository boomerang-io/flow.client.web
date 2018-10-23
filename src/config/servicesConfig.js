export const BASE_SERVICE_ENV_URL =
  process.env.NODE_ENV === "development"
    ? "http://localhost:8000"
    : window._SERVER_DATA && window._SERVER_DATA.BASE_SERVICE_ENV_URL;

// Standard
export const BASE_SERVICE_URL = `${BASE_SERVICE_ENV_URL}/flow`;
export const BASE_LAUNCHPAD_SERVICE_URL = `${BASE_SERVICE_ENV_URL}/launchpad`;

export const REQUEST_STATUSES = {
  FAILURE: "failure",
  SUCCESS: "success"
};
