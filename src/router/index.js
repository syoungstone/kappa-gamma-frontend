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
    path: "/register",
    name: "Register",
    component: () => import("../views/Register.vue"),
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

router.beforeEach((to, from, next) => {
  var officerRestricted = [
    "Edit Student",
    "Create Student",
    "Initiate Pledges",
  ];
  var brotherRestricted = officerRestricted.concat([
    "Directory",
    "Pledge Classes",
    "Pledge Class",
    "Officers",
    "Lineage",
    "Lineages",
  ]);
  var studentRestricted = brotherRestricted.concat([
    "Dashboard",
    "Student",
    "Settings",
    "Edit Profile",
    "Pledge Directory",
  ]);
  if (studentRestricted.includes(to.name) && !store.state.loggedIn) {
    next({ name: "Log In" });
  } else if (brotherRestricted.includes(to.name) && !store.state.isBrother) {
    next({ name: "Dashboard" });
  } else if (officerRestricted.includes(to.name) && !store.state.isOfficer) {
    next({ name: "Dashboard" });
  } else {
    next();
  }
});

export default router;
