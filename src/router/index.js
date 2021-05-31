import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";
import store from "../store/index.js";

Vue.use(VueRouter);

const tiers = {
  all: 7,
  financial: 6,
  officer: 5,
  committee: 4,
  active: 3,
  brother: 2,
  pledge: 1,
  none: 0,
};

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
    meta: { minAuthRequired: tiers.none },
  },
  {
    path: "/about",
    name: "About",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import("../views/About.vue"),
    meta: { minAuthRequired: tiers.none },
  },
  {
    path: "/events",
    name: "Events",
    component: () => import("../views/Events.vue"),
    meta: { minAuthRequired: tiers.none },
  },
  {
    path: "/login",
    name: "Log In",
    component: () => import("../views/Login.vue"),
    meta: { minAuthRequired: tiers.none },
  },
  {
    path: "/login/:redirect",
    name: "Log In Redirect",
    component: () => import("../views/Login.vue"),
    meta: { minAuthRequired: tiers.none },
  },
  {
    path: "/register",
    name: "Register",
    component: () => import("../views/Register.vue"),
    meta: { minAuthRequired: tiers.none },
  },
  {
    path: "/forgotpassword",
    name: "Forgot Password",
    component: () => import("../views/ForgotPassword.vue"),
    meta: { minAuthRequired: tiers.none },
  },
  {
    path: "/resetpassword/:id/:verify_hash",
    name: "Reset Password",
    component: () => import("../views/ResetPassword.vue"),
    meta: { minAuthRequired: tiers.none },
  },
  {
    path: "/verify/:id/:verify_hash",
    name: "Verify",
    component: () => import("../views/Verify.vue"),
    meta: { minAuthRequired: tiers.none },
  },
  {
    path: "/event/:id",
    name: "Event",
    component: () => import("../views/Event.vue"),
    meta: { minAuthRequired: tiers.none },
  },
  {
    path: "/dashboard",
    name: "Dashboard",
    component: () => import("../views/Dashboard.vue"),
    meta: { minAuthRequired: tiers.pledge },
  },
  {
    path: "/settings",
    name: "Settings",
    component: () => import("../views/Settings.vue"),
    meta: { minAuthRequired: tiers.pledge },
  },
  {
    path: "/editprofile",
    name: "Edit Profile",
    component: () => import("../views/EditProfile.vue"),
    meta: { minAuthRequired: tiers.pledge },
  },
  {
    path: "/pledgedirectory",
    name: "Pledge Directory",
    component: () => import("../views/PledgeDirectory.vue"),
    meta: { minAuthRequired: tiers.pledge },
  },
  {
    path: "/student/:id",
    name: "Student",
    component: () => import("../views/Student.vue"),
    meta: { minAuthRequired: tiers.pledge },
  },
  {
    path: "/directory",
    name: "Directory",
    component: () => import("../views/Directory.vue"),
    meta: { minAuthRequired: tiers.brother },
  },
  {
    path: "/pledgeclasses",
    name: "Pledge Classes",
    component: () => import("../views/PledgeClasses.vue"),
    meta: { minAuthRequired: tiers.brother },
  },
  {
    path: "/pledgeclass/:id",
    name: "Pledge Class",
    component: () => import("../views/PledgeClass.vue"),
    meta: { minAuthRequired: tiers.brother },
  },
  {
    path: "/lineages",
    name: "Lineages",
    component: () => import("../views/Lineages.vue"),
    meta: { minAuthRequired: tiers.brother },
  },
  {
    path: "/lineage/:id",
    name: "Lineage",
    component: () => import("../views/Lineage.vue"),
    meta: { minAuthRequired: tiers.brother },
  },
  {
    path: "/officers",
    name: "Officers",
    component: () => import("../views/Officers.vue"),
    meta: { minAuthRequired: tiers.brother },
  },
  {
    path: "/attendance",
    name: "Attendance",
    component: () => import("../views/Attendance.vue"),
    meta: { minAuthRequired: tiers.active },
  },
  {
    path: "/standing",
    name: "Brother Standing",
    component: () => import("../views/BrotherStanding.vue"),
    meta: { minAuthRequired: tiers.active },
  },
  {
    path: "/createevent",
    name: "Create Event",
    component: () => import("../views/CreateEvent.vue"),
    meta: { minAuthRequired: tiers.committee },
  },
  {
    path: "/editevent/:id",
    name: "Edit Event",
    component: () => import("../views/EditEvent.vue"),
    meta: { minAuthRequired: tiers.committee },
  },
  {
    path: "/editstudent/:id",
    name: "Edit Student",
    component: () => import("../views/EditStudent.vue"),
    meta: { minAuthRequired: tiers.officer },
  },
  {
    path: "/create",
    name: "Create Student",
    component: () => import("../views/CreateStudent.vue"),
    meta: { minAuthRequired: tiers.officer },
  },
  {
    path: "/initiate",
    name: "Initiate Pledges",
    component: () => import("../views/Initiate.vue"),
    meta: { minAuthRequired: tiers.officer },
  },
  {
    path: "/updateofficers",
    name: "Update Officers",
    component: () => import("../views/UpdateOfficers.vue"),
    meta: { minAuthRequired: tiers.all },
  },
  {
    path: "/:catchAll(.*)",
    name: "Not Found",
    component: () => import("../views/NotFound.vue"),
    meta: { minAuthRequired: tiers.none },
  },
];

const router = new VueRouter({
  mode: "history",
  routes,
});

router.beforeEach((to, from, next) => {
  if (!store.state.loggedIn) {
    let jwt = localStorage.getItem("kappa-gamma-jwt");
    if (jwt) {
      store.commit("setUser", jwt);
    }
  }
  if (store.state.permissionTier < to.meta.minAuthRequired) {
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
