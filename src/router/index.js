import Vue from "vue";
import axios from "axios";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";
import store from "../store/index.js";
import { API_URL, AUTH_TIERS } from "../constants/index.js";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
    meta: { minAuthRequired: AUTH_TIERS.NONE },
  },
  {
    path: "/about",
    name: "About",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import("../views/About.vue"),
    meta: { minAuthRequired: AUTH_TIERS.NONE },
  },
  {
    path: "/events",
    name: "Events",
    component: () => import("../views/Events.vue"),
    meta: { minAuthRequired: AUTH_TIERS.NONE },
  },
  {
    path: "/login",
    name: "Log In",
    component: () => import("../views/Login.vue"),
    meta: { minAuthRequired: AUTH_TIERS.NONE },
  },
  {
    path: "/login/:redirect",
    name: "Log In Redirect",
    component: () => import("../views/Login.vue"),
    meta: { minAuthRequired: AUTH_TIERS.NONE },
  },
  {
    path: "/register",
    name: "Register",
    component: () => import("../views/Register.vue"),
    meta: { minAuthRequired: AUTH_TIERS.NONE },
  },
  {
    path: "/forgotpassword",
    name: "Forgot Password",
    component: () => import("../views/ForgotPassword.vue"),
    meta: { minAuthRequired: AUTH_TIERS.NONE },
  },
  {
    path: "/resetpassword/:id/:verify_hash",
    name: "Reset Password",
    component: () => import("../views/ResetPassword.vue"),
    meta: { minAuthRequired: AUTH_TIERS.NONE },
  },
  {
    path: "/verify/:id/:verify_hash",
    name: "Verify",
    component: () => import("../views/Verify.vue"),
    meta: { minAuthRequired: AUTH_TIERS.NONE },
  },
  {
    path: "/event/:id",
    name: "Event",
    component: () => import("../views/Event.vue"),
    meta: { minAuthRequired: AUTH_TIERS.NONE },
  },
  {
    path: "/dashboard",
    name: "Dashboard",
    component: () => import("../views/Dashboard.vue"),
    meta: { minAuthRequired: AUTH_TIERS.PLEDGE },
  },
  {
    path: "/settings",
    name: "Settings",
    component: () => import("../views/Settings.vue"),
    meta: { minAuthRequired: AUTH_TIERS.PLEDGE },
  },
  {
    path: "/editprofile",
    name: "Edit Profile",
    component: () => import("../views/EditProfile.vue"),
    meta: { minAuthRequired: AUTH_TIERS.PLEDGE },
  },
  {
    path: "/pledgedirectory",
    name: "Pledge Directory",
    component: () => import("../views/PledgeDirectory.vue"),
    meta: { minAuthRequired: AUTH_TIERS.PLEDGE },
  },
  {
    path: "/student/:id",
    name: "Student",
    component: () => import("../views/Student.vue"),
    meta: { minAuthRequired: AUTH_TIERS.PLEDGE },
  },
  {
    path: "/account",
    name: "Account",
    component: () => import("../views/Account.vue"),
    meta: { minAuthRequired: AUTH_TIERS.BROTHER },
  },
  {
    path: "/directory",
    name: "Directory",
    component: () => import("../views/Directory.vue"),
    meta: { minAuthRequired: AUTH_TIERS.BROTHER },
  },
  {
    path: "/pledgeclasses",
    name: "Pledge Classes",
    component: () => import("../views/PledgeClasses.vue"),
    meta: { minAuthRequired: AUTH_TIERS.BROTHER },
  },
  {
    path: "/pledgeclass/:id",
    name: "Pledge Class",
    component: () => import("../views/PledgeClass.vue"),
    meta: { minAuthRequired: AUTH_TIERS.BROTHER },
  },
  {
    path: "/lineages",
    name: "Lineages",
    component: () => import("../views/Lineages.vue"),
    meta: { minAuthRequired: AUTH_TIERS.BROTHER },
  },
  {
    path: "/lineage/:id",
    name: "Lineage",
    component: () => import("../views/Lineage.vue"),
    meta: { minAuthRequired: AUTH_TIERS.BROTHER },
  },
  {
    path: "/officers",
    name: "Officers",
    component: () => import("../views/Officers.vue"),
    meta: { minAuthRequired: AUTH_TIERS.BROTHER },
  },
  {
    path: "/committees",
    name: "Committees",
    component: () => import("../views/Committees.vue"),
    meta: { minAuthRequired: AUTH_TIERS.ACTIVE },
  },
  {
    path: "/committee/:id",
    name: "Committee",
    component: () => import("../views/Committee.vue"),
    meta: { minAuthRequired: AUTH_TIERS.ACTIVE },
  },
  {
    path: "/attendance",
    name: "Attendance",
    component: () => import("../views/Attendance.vue"),
    meta: { minAuthRequired: AUTH_TIERS.ACTIVE },
  },
  {
    path: "/standing",
    name: "Brother Standing",
    component: () => import("../views/BrotherStanding.vue"),
    meta: { minAuthRequired: AUTH_TIERS.ACTIVE },
  },
  {
    path: "/createevent",
    name: "Create Event",
    component: () => import("../views/CreateEvent.vue"),
    meta: { minAuthRequired: AUTH_TIERS.COMMITTEE },
  },
  {
    path: "/editevent/:id",
    name: "Edit Event",
    component: () => import("../views/EditEvent.vue"),
    meta: { minAuthRequired: AUTH_TIERS.COMMITTEE },
  },
  {
    path: "/editcommittees",
    name: "Edit Committees",
    component: () => import("../views/EditCommittees.vue"),
    meta: { minAuthRequired: AUTH_TIERS.OFFICER },
  },
  {
    path: "/editstudent/:id",
    name: "Edit Student",
    component: () => import("../views/EditStudent.vue"),
    meta: { minAuthRequired: AUTH_TIERS.OFFICER },
  },
  {
    path: "/create",
    name: "Create Student",
    component: () => import("../views/CreateStudent.vue"),
    meta: { minAuthRequired: AUTH_TIERS.OFFICER },
  },
  {
    path: "/assignbigs",
    name: "Assign Bigs",
    component: () => import("../views/AssignBigs.vue"),
    meta: { minAuthRequired: AUTH_TIERS.OFFICER },
  },
  {
    path: "/initiate",
    name: "Initiate Pledges",
    component: () => import("../views/Initiate.vue"),
    meta: { minAuthRequired: AUTH_TIERS.OFFICER },
  },
  {
    path: "/assessdues",
    name: "Assess Dues",
    component: () => import("../views/AssessDues.vue"),
    meta: { minAuthRequired: AUTH_TIERS.FINANCIAL },
  },
  {
    path: "/reportpayment",
    name: "Report Payment",
    component: () => import("../views/ReportPayment.vue"),
    meta: { minAuthRequired: AUTH_TIERS.FINANCIAL },
  },
  {
    path: "/reportfine",
    name: "Report Fine",
    component: () => import("../views/ReportFine.vue"),
    meta: { minAuthRequired: AUTH_TIERS.FINANCIAL },
  },
  {
    path: "/editofficers",
    name: "Edit Officers",
    component: () => import("../views/EditOfficers.vue"),
    meta: { minAuthRequired: AUTH_TIERS.ALL },
  },
  {
    path: "/:catchAll(.*)",
    name: "Not Found",
    component: () => import("../views/NotFound.vue"),
    meta: { minAuthRequired: AUTH_TIERS.NONE },
  },
];

const router = new VueRouter({
  mode: "history",
  routes,
});

router.beforeEach(async (to, from, next) => {
  if (
    (!store.state.loggedIn && !store.state.refreshFailed) ||
    (store.state.loggedIn && store.state.jwtExpiration * 1000 <= Date.now())
  ) {
    const axiosInstance = axios.create();
    axiosInstance.defaults.withCredentials = true;
    await axiosInstance
      .post(API_URL + "refresh.php")
      .then((response) => {
        store.commit("setUser", response.data.jwt);
      })
      .catch(() => {
        store.commit("refreshFailed");
        store.commit("logout");
      });
  }
  if (store.state.authTier < to.meta.minAuthRequired) {
    if (store.state.loggedIn) {
      next({ name: "Dashboard" });
    } else {
      next({ path: "/login" + to.path });
    }
  } else {
    next();
  }
});

export default router;
