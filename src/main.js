import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";

import { BootstrapVue, IconsPlugin } from "bootstrap-vue";

import "bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-vue/dist/bootstrap-vue.css";

import VueSingleSelect from "vue-single-select";
Vue.component("vue-single-select", VueSingleSelect);

import Raphael from "raphael";
import "treantjs/Treant.css";
import "treantjs/Treant";

window.Raphael = Raphael;

Vue.use(BootstrapVue);
Vue.use(IconsPlugin);

Vue.config.productionTip = false;

// API URL constant
Vue.prototype.$apiUrl = "http://api.vcuthetatau.org/";

// Permission tier constants for determining what to display to whom
Vue.prototype.$tierAll = 7;
Vue.prototype.$tierFinancial = 6;
Vue.prototype.$tierOfficer = 5;
Vue.prototype.$tierCommittee = 4;
Vue.prototype.$tierActive = 3;
Vue.prototype.$tierBrother = 2;
Vue.prototype.$tierPledge = 1;
Vue.prototype.$tierNone = 0;

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
