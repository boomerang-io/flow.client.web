export const BASE_SERVICE_ENV_URL =
  process.env.NODE_ENV === "development"
    ? "http://localhost:8000"
    : window._SERVER_DATA && window._SERVER_DATA.BASE_SERVICE_ENV_URL;

export const PRODUCT_SERVICE_ENV_URL =
  process.env.NODE_ENV === "development"
    ? "http://localhost:8000"
    : window._SERVER_DATA && window._SERVER_DATA.PRODUCT_SERVICE_ENV_URL;

// Standard
export const BASE_SERVICE_URL = `${PRODUCT_SERVICE_ENV_URL}/flow`;
export const BASE_LAUNCHPAD_SERVICE_URL = `${BASE_SERVICE_ENV_URL}/launchpad`;
export const BASE_USERS_URL = `${BASE_SERVICE_ENV_URL}/users`;

// Profile image
export const IMG_URL = `${BASE_USERS_URL}/image`;

export const REQUEST_STATUSES = {
  FAILURE: "failure",
  SUCCESS: "success"
};
