import Vue from "vue";
import Axios from "axios";
import { store } from "../_stores/index";
import router from "../routes";

window.axiosInstance = Axios.create({
  headers: { Accept: "application/json" }, // default headers
});

window.loading = false;

const token = sessionStorage.getItem("token");
if (token) {
  axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
}

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
