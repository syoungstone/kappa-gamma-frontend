import axios from "axios";
import router from "../router";
import store from "../store";
import { API_URL } from "../constants";
import { Promise } from "es6-promise";

export default () => {
  axios.interceptors.response.use(
    (response) => {
      // Return a successful response back to the calling service
      // console.log("Request was successful");
      return response;
    },
    (error) => {
      // console.log("There was an error.");

      // Return any error which is not due to authentication back to the calling service
      if (
        error.response.status !== 401 ||
        error.config.url == API_URL + "login.php"
      ) {
        // console.log(
        //   "Error not to do with authorization, or was a login error. No need for a refresh."
        // );
        return new Promise((resolve, reject) => {
          reject(error);
        });
      }

      // Logout user if token refresh didn't work
      if (error.config.url == API_URL + "refresh.php") {
        // console.log("Error was from a failed refresh. Logging out.");
        const axiosInstance = axios.create();
        axiosInstance.defaults.withCredentials = true;
        axiosInstance
          .post(API_URL + "logout.php")
          .then(() => {
            store.commit("logout");
            router.push({ name: "Home" });
            return new Promise((resolve, reject) => {
              reject(error);
            });
          })
          .catch(() => {
            store.commit("logout");
            router.push({ name: "Home" });
            return new Promise((resolve, reject) => {
              reject(error);
            });
          });
      }

      // console.log("Trying a refresh.");
      const axiosInstance = axios.create();
      axiosInstance.defaults.withCredentials = true;
      return axiosInstance
        .post(API_URL + "refresh.php")
        .then((response) => {
          // console.log("Successful refresh.");
          store.commit("setUser", response.data.jwt);
          // New request with new token
          const config = error.config;
          config.headers["Authorization"] = store.state.jwt;
          // console.log("Retrying original request.");
          return new Promise((resolve, reject) => {
            axios
              .request(config)
              .then((response) => {
                // console.log("Retry succeeded.");
                resolve(response);
              })
              .catch((error) => {
                // console.log("Retry failed.");
                reject(error);
              });
          });
        })
        .catch(() => {
          // console.log("Failed refresh, redirecting to home.");
          router.push({ name: "Home" });
          return new Promise((resolve, reject) => {
            reject(error);
          });
        });
    }
  );
};
