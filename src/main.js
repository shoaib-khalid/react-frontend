import Vue from "vue";
window.jQuery = require("jquery");
window.$ = window.jQuery;
import "./plugins/vue-axios";
import "./plugins/vuejs-datatable";
import "./plugins/vuetify";
import "./plugins/feather-icon";
import "./plugins/vue-table";
import "./plugins/bootstrap";
import "./plugins/vee-validate";
import "./plugins/vue-filter2";
import "./plugins/vue-json-excel";
import VueMask from "v-mask";
import moment from "moment";
import "./directives/index.js";
// import './plugins/vue-moment'

Vue.use(require("vue-moment"));
Vue.use(VueMask);
// require('@/assets/css/main.css')

import { store } from "./_stores/index";
import router from "./routes";
import App from "./App.vue";

// Vue.config.productionTip = false

const files = require.context("./components", true, /\.vue$/i);

files.keys().map((key) => {
  Vue.filter("formatDate", function (value) {
    if (value) {
      return moment(String(value)).format("DD-MMM-YYYY");
    }
  });

  Vue.component(key.split("/").pop().split(".")[0], files(key).default);
});

Vue.prototype.$dataType = function (
  value,
  type_view = 0,
  return_val_only = false
) {
  let type = ["KB", "MB", "GB", "TB"];
  let N_A_show = false;

  let result = value;

  if (type_view == 1) {
    let status_int = result < 0 ? -1 : 1;

    if (N_A_show && status_int < 0) return "N/A";

    result = Math.abs(result);
    let mb = 1024;
    let inc = 0;
    let count = result;
    while (count >= mb) {
      count = count / mb;
      inc += 1;
    }

    if (return_val_only) result = status_int * parseFloat(count).toFixed(2);
    else result = status_int * parseFloat(count).toFixed(2) + " " + type[inc];
  } else if (type_view == 2) {
    result = new Intl.NumberFormat().format(result);
  }

  return result;
};

Vue.directive("quota-show", {
  // When the bound element is inserted into the DOM...
  //function(el, binding, vnode)
  bind: function (el) {
    el.focus();
  },
});

require("./script.js");

window.vm = new Vue({
  el: "#app",
  store,
  router,
  render: (h) => h(App),
});

// window.vm = vm;
