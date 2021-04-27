import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";

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
    path: "/profile",
    name: "Profile",
    component: () => import("../views/Profile.vue"),
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
    path: "/brother/:id",
    name: "Brother",
    component: () => import("../views/Brother.vue"),
  },
  {
    path: "/pledge/:id",
    name: "Pledge",
    component: () => import("../views/Pledge.vue"),
  },
  {
    path: "/editbrother/:id",
    name: "Edit Brother",
    component: () => import("../views/EditBrother.vue"),
  },
  {
    path: "/editpledge/:id",
    name: "Edit Pledge",
    component: () => import("../views/EditPledge.vue"),
  },
  {
    path: "/pledgeclasses",
    name: "Pledge Classes",
    component: () => import("../views/PledgeClasses.vue"),
  },
];

const router = new VueRouter({
  routes,
});

export default router;
