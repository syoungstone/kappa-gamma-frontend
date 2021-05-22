import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";
import store from "../store/index.js";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/about",
    name: "About",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import("../views/About.vue"),
  },
  {
    path: "/login",
    name: "Log In",
    component: () => import("../views/Login.vue"),
  },
  {
    path: "/login/:redirect",
    name: "Log In Redirect",
    component: () => import("../views/Login.vue"),
  },
  {
    path: "/register",
    name: "Register",
    component: () => import("../views/Register.vue"),
  },
  {
    path: "/forgotpassword",
    name: "Forgot Password",
    component: () => import("../views/ForgotPassword.vue"),
  },
  {
    path: "/resetpassword/:id/:verify_hash",
    name: "Reset Password",
    component: () => import("../views/ResetPassword.vue"),
  },
  {
    path: "/verify/:id/:verify_hash",
    name: "Verify",
    component: () => import("../views/Verify.vue"),
  },
  {
    path: "/dashboard",
    name: "Dashboard",
    component: () => import("../views/Dashboard.vue"),
  },
  {
    path: "/settings",
    name: "Settings",
    component: () => import("../views/Settings.vue"),
  },
  {
    path: "/editprofile",
    name: "Edit Profile",
    component: () => import("../views/EditProfile.vue"),
  },
  {
    path: "/directory",
    name: "Directory",
    component: () => import("../views/Directory.vue"),
  },
  {
    path: "/pledgedirectory",
    name: "Pledge Directory",
    component: () => import("../views/PledgeDirectory.vue"),
  },
  {
    path: "/student/:id",
    name: "Student",
    component: () => import("../views/Student.vue"),
  },
  {
    path: "/edit/:id",
    name: "Edit Student",
    component: () => import("../views/Edit.vue"),
  },
  {
    path: "/create",
    name: "Create Student",
    component: () => import("../views/CreateStudent.vue"),
  },
  {
    path: "/pledgeclasses",
    name: "Pledge Classes",
    component: () => import("../views/PledgeClasses.vue"),
  },
  {
    path: "/officers",
    name: "Officers",
    component: () => import("../views/Officers.vue"),
  },
  {
    path: "/update-officers",
    name: "Update Officers",
    component: () => import("../views/UpdateOfficers.vue"),
  },
  {
    path: "/lineage/:id",
    name: "Lineage",
    component: () => import("../views/Lineage.vue"),
  },
  {
    path: "/lineages",
    name: "Lineages",
    component: () => import("../views/Lineages.vue"),
  },
  {
    path: "/pledgeclass/:id",
    name: "Pledge Class",
    component: () => import("../views/PledgeClass.vue"),
  },
  {
    path: "/initiate",
    name: "Initiate Pledges",
    component: () => import("../views/Initiate.vue"),
  },
];

const router = new VueRouter({
  // mode: "history",
  routes,
});

const officerRestricted = [
  "Edit Student",
  "Create Student",
  "Initiate Pledges",
  "Update Officers",
];
const brotherRestricted = officerRestricted.concat([
  "Directory",
  "Pledge Classes",
  "Pledge Class",
  "Officers",
  "Lineage",
  "Lineages",
]);
const studentRestricted = brotherRestricted.concat([
  "Dashboard",
  "Student",
  "Settings",
  "Edit Profile",
  "Pledge Directory",
]);

router.beforeEach((to, from, next) => {
  if (!store.state.loggedIn) {
    let jwt = localStorage.getItem("kappa-gamma-jwt");
    if (jwt) {
      store.commit("setUser", jwt);
    }
  }
  if (studentRestricted.includes(to.name) && !store.state.loggedIn) {
    next({ path: "/login" + to.path });
  } else if (brotherRestricted.includes(to.name) && !store.state.isBrother) {
    next({ name: "Dashboard" });
  } else if (officerRestricted.includes(to.name) && !store.state.position) {
    next({ name: "Dashboard" });
  } else {
    next();
  }
});

export default router;
