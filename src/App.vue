<template>
  <div id="app">
    <b-navbar id="navbar" toggleable="lg" type="dark">
      <b-navbar-brand to="/">
        <img
          id="nav-logo"
          src="./assets/ThetaTauLogo.png"
          class="d-inline-block align-top"
          alt="OT Shield"
        />
        ΘΤ @ VCU</b-navbar-brand
      >
      <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>
      <b-collapse id="nav-collapse" is-nav>
        <b-navbar-nav v-if="$store.state.loggedIn">
          <b-nav-item to="/dashboard">Dashboard</b-nav-item>
          <b-nav-item-dropdown v-if="$store.state.isBrother" text="Membership">
            <b-dropdown-item to="/directory">Directory</b-dropdown-item>
            <b-dropdown-item to="/pledgeclasses"
              >Pledge Classes</b-dropdown-item
            >
            <b-dropdown-item to="/lineages">Lineages</b-dropdown-item>
            <b-dropdown-item to="/officers">Officers</b-dropdown-item>
          </b-nav-item-dropdown>
          <b-nav-item v-else to="/pledgedirectory">Directory</b-nav-item>
          <b-nav-item-dropdown v-if="$store.state.isOfficer" text="Actions">
            <b-dropdown-item to="/update-officers"
              >Update Officers</b-dropdown-item
            >
            <b-dropdown-item to="/create">Create New Student</b-dropdown-item>
            <b-dropdown-item to="/initiate">Initiate Pledges</b-dropdown-item>
          </b-nav-item-dropdown>
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
    <b-modal v-model="notifyModal" :title="notifyModalTitle" hide-footer>
      <p>{{ notifyModalMessage }}</p>
    </b-modal>
    <router-view />
  </div>
</template>

<script>
export default {
  data() {
    return {
      notifyModal: false,
      notifyModalMessage: null,
      notifyModalTitle: null,
    };
  },
  beforeUpdate() {
    if (
      this.$store.state.loggedIn &&
      this.$store.state.jwtExpiration * 1000 <= Date.now()
    ) {
      this.timeout();
    }
  },
  methods: {
    timeout() {
      this.logout();
      this.showMessage(
        "Session Expired",
        "Your session has expired. Please log back in."
      );
    },
    logout() {
      this.$store.commit("logout");
      this.$router.push("/", () => {});
    },
    editSelf() {
      this.$router.push("/edit/" + this.$store.state.id, () => {});
    },
    showError(error) {
      this.notifyModalTitle = "Error";
      this.notifyModalMessage = error;
      this.notifyModal = true;
    },
    showSuccess(message) {
      this.notifyModalTitle = "Success";
      this.notifyModalMessage = message;
      this.notifyModal = true;
    },
    showMessage(title, message) {
      this.notifyModalTitle = title;
      this.notifyModalMessage = message;
      this.notifyModal = true;
    },
  },
};
</script>

<style>
:root {
  --ot-dark-red: #8b0000;
  --ot-gold: #ffcc33;
  --ot-off-white: #edeab5;
}
#navbar {
  background-color: var(--ot-dark-red);
}
#nav-logo {
  max-height: 30px;
}
#app {
  margin-bottom: 100px;
}
.narrow-wrapper {
  max-width: 500px;
  padding: 20px;
  margin: 50px auto;
}
.wide-wrapper {
  max-width: 1000px;
  padding: 20px;
  margin: 50px auto;
}
h1,
h2,
h3,
h4 {
  text-align: center;
}
h1 {
  margin-top: 30px;
  margin-bottom: 30px;
}
.thumbnail {
  position: relative;
  width: 200px;
  height: 200px;
  overflow: hidden;
}
.thumbnail img {
  object-fit: cover;
  width: 100%;
  height: 100%;
}
.thumbnail img.portrait {
  width: 100%;
  height: auto;
}
.card {
  margin-top: 20px;
  background-color: var(--ot-off-white) !important;
}
</style>
