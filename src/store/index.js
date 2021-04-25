import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    loggedIn: false,
    user: "",
    id: "",
    jwt: "",
    lastName: "",
    isBrother: false,
    isOfficer: false,
  },
  mutations: {
    setJwt(state, jwt) {
      state.jwt = jwt;
    },
    setUser(state, user) {
      state.user = user;
    },
    setId(state, id) {
      state.id = id;
    },
    setName(state, lastName) {
      state.lastName = lastName;
    },
    setBrother(state, isBrother) {
      state.isBrother = isBrother;
    },
    setOfficer(state, isOfficer) {
      state.isOfficer = isOfficer;
    },
    login(state) {
      state.loggedIn = true;
    },
    logout(state) {
      state.loggedIn = false;
      state.user = "";
      state.jwt = "";
    },
  },
  actions: {},
  modules: {},
});
