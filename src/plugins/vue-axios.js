import Vue from "vue";
import Axios from "axios";
import { store } from "../_stores/index";
import router from "../routes";

const token = sessionStorage.getItem("token");

// window.baseApiURL =
//   "http:" +
//   window.location.origin.split(":")[1] +
//   ":" +
//   process.env.VUE_APP_CORE_PORT; //" http://10.13.60.191:8090";
// window.ReportBaseURL_CONST =
//   "http:" +
//   window.location.origin.split(":")[1] +
//   ":" +
//   process.env.VUE_APP_REPORT_PORT; //"http://10.13.60.191:9090";

// let baseURL = window.baseApiURL;
// if (sessionStorage.getItem("baseURL")) {
//   baseURL = sessionStorage.getItem("baseURL").toString();
// }
// if (sessionStorage.getItem("ReportBaseURL")) {
//   window.ReportBaseURL = sessionStorage.getItem("ReportBaseURL").toString();
// } else {
//   window.ReportBaseURL = window.ReportBaseURL_CONST;
// }

// if (process.env.NODE_ENV == "development") {
//   baseURL =
//     "http:" +
//     window.location.origin.split(":")[1] +
//     ":" +
//     process.env.VUE_APP_CORE_PORT; //"http://10.13.60.191:8090/";
//   window.baseApiURL = baseURL;
// }

//https://209.58.160.107:8056/

// Set config defaults when creating the instance

window.axiosInstance = Axios.create({
  // baseURL: baseURL, // api URL
  headers: { Accept: "application/json" }, // default headers
});

window.loading = false;

if (token)
  axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;

// Add a request interceptor
axiosInstance.interceptors.request.use(
  function (config) {
    // Do something before request is sent

    // console.log("before request")
    store.commit("notis/setLoading", true);

    return config;
  },
  function (error) {
    store.commit("notis/setLoading", false);
    // Do something with request error
    return Promise.reject(error);
  }
);

// Add a response interceptor
axiosInstance.interceptors.response.use(
  function (response) {
    // window.loading = false;
    store.commit("notis/setLoading", false);

    if (response.data.errorCode == "16") {
      store.commit("notis/setAlert", {
        type: "warning",
        title: "Access denied, Please login again!",
        time: "10",
      });
      store.commit("logout");
      router.push({ name: "login" });
    }

    return response.data;
  },
  function (error) {
    store.commit("notis/setLoading", false);
    if (error.response.status == 400) {
      store.commit("notis/setAlert", {
        type: "error",
        title: "Invalid Request!",
        time: "10",
      });
    } else {
      store.commit("notis/setAlert", {
        type: "error",
        title: "Network Error!",
        time: "10",
      });
    }
    return Promise.reject(error);
  }
);

Vue.$http = axiosInstance;
Vue.prototype.$http = axiosInstance;
