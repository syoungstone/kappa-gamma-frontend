<template>
  <div id="app">
    <b-navbar toggleable="lg" type="dark" variant="info">
      <b-navbar-brand to="/">OT Kappa Gamma</b-navbar-brand>

      <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

      <b-collapse id="nav-collapse" is-nav>
        <b-navbar-nav v-if="$store.state.loggedIn">
          <b-nav-item to="/dashboard">Dashboard</b-nav-item>
          <b-nav-item v-if="$store.state.isBrother" to="/directory"
            >Directory</b-nav-item
          >
          <b-nav-item v-else to="/pledgedirectory">Directory</b-nav-item>
          <b-nav-item v-if="$store.state.isBrother" to="/pledgeclasses"
            >Pledge Classes</b-nav-item
          >
        </b-navbar-nav>
        <b-navbar-nav v-else>
          <b-nav-item to="/">Home</b-nav-item>
          <b-nav-item to="/about">About</b-nav-item>
        </b-navbar-nav>

        <!-- Right aligned nav items -->
        <b-navbar-nav class="ml-auto">
          <b-nav-item-dropdown right>
            <!-- Using 'button-content' slot -->
            <template #button-content>
              <em>Brother Portal</em>
            </template>
            <div v-if="$store.state.loggedIn">
              <b-dropdown-item to="/editprofile">Edit Profile</b-dropdown-item>
              <b-dropdown-item to="/settings">Settings</b-dropdown-item>
              <b-dropdown-item @click="logout">Sign Out</b-dropdown-item>
            </div>
            <div v-else>
              <b-dropdown-item to="/login">Log In</b-dropdown-item>
              <b-dropdown-item to="/register">Register</b-dropdown-item>
            </div>
          </b-nav-item-dropdown>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>
    <router-view />
  </div>
</template>

<script>
export default {
  methods: {
    logout() {
      this.$store.commit("logout");
      this.$router.push("/", () => {});
    },
    editSelf() {
      this.$router.push("/edit/" + this.$store.state.id, () => {});
    },
  },
};
</script>

<style>
#app {
  margin-bottom: 100px;
}
#everything {
  max-width: 1000px;
  padding: 0px 20px;
  margin: 50px auto;
  margin-bottom: 100px;
}
h1 {
  text-align: center;
  margin-top: 30px;
  margin-bottom: 30px;
}
footer {
  height: 100px;
}
</style>
