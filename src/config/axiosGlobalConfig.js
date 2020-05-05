// Setup global config for Axios requests so they work with ICP
import axios from "axios";
axios.defaults.withCredentials = true;

// If port forwarding is set, we need to attach the JWT to all requests
// if (process.env.REACT_APP_PORT_FORWARD) {
//   const JWT = `Bearer ${process.env.REACT_APP_JWT}`;
//   axios.interceptors.request.use(function(config) {
//     config.headers.Authorization = JWT;
//     return config;
//   });
// }
