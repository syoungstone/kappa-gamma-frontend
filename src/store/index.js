import Vue from "vue";
import Vuex from "vuex";
import { AUTH_TIERS } from "../constants/index.js";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    loggedIn: false,
    refreshFailed: false,
    email: null,
    id: null,
    jwt: null,
    jwtExpiration: null,
    authTier: AUTH_TIERS.NONE,
    firstName: null,
    lastName: null,
    committees: null,
  },
  mutations: {
    refreshFailed(state) {
      state.refreshFailed = true;
    },
    setUser(state, jwt) {
      let base64Url = jwt.split(".")[1];
      let base64 = base64Url.replace("-", "+").replace("_", "/");
      let parsed = JSON.parse(atob(base64));
      if (parsed.exp * 1000 > Date.now()) {
        state.loggedIn = true;
        state.email = parsed.data.email;
        state.id = parsed.data.id;
        state.jwt = jwt;
        state.jwtExpiration = parsed.exp;
        state.authTier = parsed.data.auth_tier;
        state.firstName = parsed.data.name_first;
        state.lastName = parsed.data.name_last;
        state.committees = parsed.data.committees;
      }
    },
    logout(state) {
      state.loggedIn = false;
      state.email = null;
      state.id = null;
      state.jwt = null;
      state.jwtExpiration = null;
      state.authTier = AUTH_TIERS.NONE;
      state.firstName = null;
      state.lastName = null;
    },
  },
  actions: {},
  modules: {},
});
