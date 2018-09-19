import { BASE_APPS_ENV_URL, BASE_LAUNCH_ENV_URL } from './platformUrlConfig';

const BASE_SERVICE_ENV_URL =
  process.env.NODE_ENV === 'development'
    ? 'http://localhost:8000'
    : window._SERVER_DATA && window._SERVER_DATA.BASE_SERVICE_ENV_URL;

// Standard
export const BASE_SERVICE_URL = `${BASE_SERVICE_ENV_URL}/api`;

export const REQUEST_STATUSES = {
  FAILURE: 'failure',
  SUCCESS: 'success',
};
