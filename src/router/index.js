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
    path: "/pledgeclass/:id",
    name: "Pledge Class",
    component: () => import("../views/PledgeClass.vue"),
  },
];

const router = new VueRouter({
  routes,
});

export default router;
