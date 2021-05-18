import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    apiURL:
      "https://ec2-174-129-78-30.compute-1.amazonaws.com/kappa-gamma-backend/api/",
    loggedIn: false,
    user: null,
    id: null,
    jwt: null,
    jwtExpiration: null,
    lastName: null,
    isBrother: null,
    isOfficer: null,
  },
  mutations: {
    setUser(state, jwt) {
      let base64Url = jwt.split(".")[1];
      let base64 = base64Url.replace("-", "+").replace("_", "/");
      let parsed = JSON.parse(atob(base64));
      if (parsed.exp * 1000 > Date.now()) {
        state.loggedIn = true;
        state.user = parsed.data.email;
        state.id = parsed.data.id;
        state.jwt = jwt;
        state.jwtExpiration = parsed.exp;
        state.lastName = parsed.data.name_last;
        state.isBrother = parsed.data.is_brother;
        state.isOfficer = parsed.data.is_officer;
        localStorage.setItem("kappa-gamma-jwt", jwt);
      }
    },
    logout(state) {
      state.loggedIn = false;
      state.user = null;
      state.id = null;
      state.jwt = null;
      state.jwtExpiration = null;
      state.lastName = null;
      state.isBrother = null;
      state.isOfficer = null;
      localStorage.removeItem("kappa-gamma-jwt");
    },
  },
  actions: {},
  modules: {},
});
